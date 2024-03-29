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
import { CategoryAPIResponse } from '@/types';
import { useCategories } from '@/hooks/categories';

type CategoryMenuProps = {
  trigger: React.ReactNode;
  category: CategoryAPIResponse;
  total: number;
  onRename: () => void;
};

export const CategoryMenu = ({
  trigger,
  category,
  onRename,
}: CategoryMenuProps) => {
  const { deleteCategory, deletionStatus } = useCategories();
  const [isOpen, setIsOpen] = useState(false);
  const qc = useQueryClient();

  async function deleteCategoryHandler() {
    try {
      await toast.promise(
        deleteCategory({
          id: category.id,
        }),
        {
          loading: 'Suppression...',
          error: 'Erreur lors de la suppression',
          success() {
            qc.invalidateQueries({ queryKey: ['categories'] });
            return 'Catégorie supprimée';
          },
        },
      );

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
            onClick={onRename}
          >
            <Pencil className="mr-2 h-4 w-4" />
            <span>Renommer</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer text-destructive hover:!bg-red-50/80 hover:!text-destructive"
            onClick={() => deleteCategoryHandler}
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
          Voulez-vous vraiment supprimer cette catégorie ?
        </p>
        <DialogFooter className="gap-y-2 sm:justify-start">
          <DialogClose asChild>
            <Button disabled={deletionStatus === 'pending'}>Annuler</Button>
          </DialogClose>
          <Button
            variant="icon"
            disabled={deletionStatus === 'pending'}
            onClick={deleteCategoryHandler}
          >
            Oui
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
