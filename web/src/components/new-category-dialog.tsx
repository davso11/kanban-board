import { z } from 'zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
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
import { Input } from './ui/input';
import { Button } from './ui/button';
import { useCategories } from '@/hooks/categories';

const schema = z.object({
  name: z.string().min(1, { message: 'Le nom est requis.' }),
});

export const NewCategoryDialog = ({
  trigger,
  totalCategories,
}: {
  trigger: React.ReactNode;
  totalCategories: number;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { saveCategory, savingStatus } = useCategories();
  const qc = useQueryClient();
  const form = useForm();

  const onSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name');

    // safely parse name
    const result = await schema.safeParseAsync({ name });

    if (!result.success) {
      console.log(result.error);
      toast.error('Remplisssez tous les champs svp');
      return;
    }

    toast.promise(
      saveCategory({
        label: result.data.name,
        order: totalCategories + 1,
      }),
      {
        loading: 'Enregistrement...',
        success() {
          qc.invalidateQueries({ queryKey: ['categories'] });
          return 'Catégorie enregistrée';
        },
        error(e) {
          console.log(e);
          return "Error lors de l'enregistrement";
        },
        finally() {
          setIsOpen(false);
        },
      },
    );
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nouvelle catégorie</DialogTitle>
          <DialogDescription>
            Lorem ipsum dolor sit amet consectetur.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            id="new-category-form"
            autoComplete="off"
            className="space-y-6"
            onSubmit={onSubmit}
          >
            <FormField
              name="name"
              render={() => (
                <FormItem>
                  <FormLabel required>Nom</FormLabel>
                  <FormControl>
                    <Input
                      name="name"
                      placeholder="Entrez le nom de la catégorie."
                      disabled={savingStatus === 'pending'}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter className="sm:justify-start">
          <Button
            type="submit"
            form="new-category-form"
            disabled={savingStatus === 'pending'}
          >
            Enregistrer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
