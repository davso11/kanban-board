import { useForm } from 'react-hook-form';
import { CalendarIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { taskOptionalDefaultsSchema } from '@/types';
import { dayjs } from '@/lib/dayjs';
import { cn } from '@/lib/utils';
import { useTasks } from '@/hooks/tasks';
import { useQueryClient } from '@tanstack/react-query';

type NewTaskDialogProps = {
  trigger: React.ReactNode;
  totalTasks: number;
  categoryId: string;
};

export const NewTaskDialog = ({
  categoryId,
  trigger,
  totalTasks,
}: NewTaskDialogProps) => {
  const [label, setLabel] = useState('');
  const [targetDate, setTargetDate] = useState<Date>();
  const { saveTask, saveStatus } = useTasks(categoryId);
  const [isOpen, setIsOpen] = useState(false);
  const qc = useQueryClient();
  const form = useForm();

  const onSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    const validationResult = await taskOptionalDefaultsSchema.safeParseAsync({
      categoryId,
      label,
      targetDate,
      createdAt: new Date(),
      order: totalTasks + 1,
    });

    if (!validationResult.success) {
      console.log(validationResult.error);
      toast.error('Remplisssez tous les champs svp');
      return;
    }

    try {
      await toast.promise(saveTask(validationResult.data), {
        loading: 'Enregistrement...',
        error: "Error lors de l'enregistrement",
        success() {
          qc.invalidateQueries({ queryKey: ['categories'] });
          return 'Tâche enregistrée';
        },
      });

      setLabel('');
      setTargetDate(undefined);
      setIsOpen(false);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nouvelle tâche</DialogTitle>
          <DialogDescription>
            Lorem ipsum dolor sit amet consectetur.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            id="new-task-form"
            autoComplete="off"
            className="space-y-6"
            onSubmit={onSubmit}
          >
            <FormField
              name="label"
              render={() => (
                <FormItem>
                  <FormLabel required>Libellé</FormLabel>
                  <FormControl>
                    <Input
                      value={label}
                      onChange={(e) => setLabel(e.target.value)}
                      placeholder="Entrez le libellé de la tâche."
                      disabled={saveStatus === 'pending'}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="targetDate"
              render={() => (
                <FormItem>
                  <FormLabel className="block">Date cible</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          disabled={saveStatus === 'pending'}
                          variant={'outline'}
                          className={cn(
                            'w-full pl-3 text-left font-normal',
                            !targetDate && 'text-muted-foreground',
                          )}
                        >
                          {targetDate ? (
                            dayjs(targetDate).format('LL')
                          ) : (
                            <span>Choisissez une date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto p-0"
                      align="start"
                    >
                      <Calendar
                        mode="single"
                        selected={targetDate}
                        onSelect={setTargetDate}
                        disabled={(date) => date < new Date('1900-01-01')}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter className="sm:justify-start">
          <Button
            type="submit"
            form="new-task-form"
            disabled={saveStatus === 'pending'}
          >
            Enregistrer
          </Button>
          <DialogClose asChild>
            <Button
              variant="icon"
              disabled={saveStatus === 'pending'}
            >
              Annuler
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
