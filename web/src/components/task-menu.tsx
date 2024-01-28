import { toast } from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import { Pencil, Trash } from 'lucide-react';
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Button } from './ui/button';
import { TTask } from '@/types';
import { useTasks } from '@/hooks/tasks';

type TaskMenuProps = {
  trigger: React.ReactNode;
  task: TTask;
};

export const TaskMenu = ({ trigger, task }: TaskMenuProps) => {
  const { deleteTask, deleteStatus } = useTasks();
  const [isOpen, setIsOpen] = useState(false);
  const qc = useQueryClient();

  async function deleteTaskHandler() {
    try {
      await toast.promise(deleteTask(task.id), {
        loading: 'Suppression...',
        error: 'Erreur lors de la suppression',
        success() {
          qc.invalidateQueries({ queryKey: ['categories'] });
          return 'Tâche supprimée';
        },
      });

      setIsOpen(false);
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
        <DropdownMenuContent className="min-w-32">
          <DropdownMenuItem
            className="cursor-pointer"
            disabled
          >
            <Pencil className="mr-2 h-4 w-4" />
            <span>Modifier</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer text-destructive hover:!bg-red-50/80 hover:!text-destructive"
            onClick={() => deleteTaskHandler}
          >
            <Trash className="mr-2 h-4 w-4" />

            <DialogTrigger>
              <span>Supprimer</span>
            </DialogTrigger>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DialogContent className="rounded-lg">
        <DialogHeader>
          <DialogTitle>Confirmation de suppression</DialogTitle>
        </DialogHeader>
        <p className="text-center sm:text-left">
          Voulez-vous vraiment supprimer cette tâche ?
        </p>
        <DialogFooter className="gap-y-2 sm:justify-start">
          <DialogClose asChild>
            <Button disabled={deleteStatus === 'pending'}>Annuler</Button>
          </DialogClose>
          <Button
            variant="icon"
            disabled={deleteStatus === 'pending'}
            onClick={deleteTaskHandler}
          >
            Oui
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
