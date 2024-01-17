import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd';
import { toast } from 'react-hot-toast';
import { Plus } from 'lucide-react';
import { Board } from '@/components/board';
import { Shell } from '@/components/ui/shell';
import { Button } from '@/components/ui/button';
import { NewCategoryDialog } from '@/components/new-category-dialog';
import { useTasks } from '@/hooks/tasks';
import { useCategories } from '@/hooks/categories';
import { reorder } from '@/lib/utils';
import { useSizes } from '@/hooks/screen';

export const App = () => {
  const [droppableTaskCategory] = useState<string>();
  const { updateTasks } = useTasks(droppableTaskCategory);
  const {
    categories,
    queryStatus: catStatus,
    updateCategories,
    updateStatus,
  } = useCategories();
  const [orderedCategories, setOrderedCategories] = useState(categories ?? []);
  const qc = useQueryClient();

  const isMaxCategories = orderedCategories.length >= 3;

  const { width } = useSizes();

  useEffect(() => {
    if (catStatus === 'success' || categories) {
      setOrderedCategories(categories!);
    }
  }, [catStatus, categories]);

  async function dragEndHandler(result: DropResult) {
    const { destination, source, type } = result;

    // If dropped away
    if (!destination) {
      return;
    }

    // If dropped on the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // If dragged a category
    if (type === 'category') {
      const result = reorder(
        orderedCategories,
        source.index,
        destination.index,
      ).map((item, idx) => {
        item.order = idx;
        return item;
      });

      setOrderedCategories(result);

      // Persist changes
      await updateCategories(result, {
        async onSuccess() {
          await qc.invalidateQueries({ queryKey: ['categories'] });
        },
        onError() {
          toast.error('Erreur survenue');
        },
      });

      return;
    }

    // If dragged a task
    if (type === 'task') {
      // Find the category of the source and destination
      const catSource = categories!.find((c) => c.label === source.droppableId);
      const catDestination = categories!.find(
        (c) => c.label === destination.droppableId,
      );

      if (!catSource || !catDestination) {
        return;
      }

      // If no card on the source
      if (!catSource.tasks) {
        catSource.tasks = [];
      }

      // If no card on the destination
      if (!catDestination.tasks) {
        catDestination.tasks = [];
      }

      // If dropped on the same list
      if (destination.droppableId === source.droppableId) {
        const reorderedTasks = reorder(
          catSource.tasks,
          source.index,
          destination.index,
        );

        // Update order property of each task
        reorderedTasks.forEach((item, idx) => {
          item.order = idx + 1;
          return item;
        });

        catSource.tasks = reorderedTasks;

        const orderedCategories = categories!.map((c) =>
          c.id === catSource.id ? catSource : c,
        );

        // Optimistic update
        setOrderedCategories(orderedCategories);

        // Persist changes
        await updateTasks(reorderedTasks, {
          async onSuccess() {
            await qc.invalidateQueries({ queryKey: ['categories'] });
          },
          onError() {
            toast.error('Erreur survenue');
          },
        });
      } else {
        const [removed] = catSource.tasks.splice(source.index, 1);

        // Add the removed task to the destination
        catDestination.tasks.splice(destination.index, 0, removed!);

        // Update order property of each task
        const reorderedTasks = catDestination.tasks.map((item, idx) => {
          item.categoryId = catDestination.id;
          item.order = idx + 1;
          return item;
        });

        // Apply changes after updating order property
        catDestination.tasks = reorderedTasks;

        // Update categories
        const reorderedCategories = categories!.map((c) =>
          c.id === catSource.id ? catSource : c,
        );

        // Optimistic update
        setOrderedCategories(reorderedCategories);

        // Merge the both tasks arrays
        const toSave = [...catSource.tasks, ...reorderedTasks];

        // Persist changes
        await updateTasks(toSave, {
          async onSuccess() {
            await qc.invalidateQueries({ queryKey: ['categories'] });
          },
          onError() {
            toast.error('Erreur survenue');
          },
        });
      }
    }
  }

  const renderChildren = () => {
    if (catStatus === 'pending') {
      return (
        <div className="mt-24 flex justify-center">
          <p>Chargement...</p>
        </div>
      );
    }

    if (catStatus === 'error') {
      return (
        <div className="mt-24 flex justify-center">
          <p>Erreur survenue. Veuillez réessayez plus tard.</p>
        </div>
      );
    }

    return categories && categories.length > 0 ? (
      <DragDropContext onDragEnd={dragEndHandler}>
        <Droppable
          type="category"
          droppableId="categories"
          direction={width <= 768 ? 'vertical' : 'horizontal'}
        >
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="grid grid-cols-1 items-start md:grid-cols-3 "
            >
              {orderedCategories.map((item, i) => (
                <Board
                  key={item.id}
                  index={i}
                  data={item}
                  totalCategories={categories.length}
                />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    ) : (
      <div className="mt-24 flex justify-center">
        <p>Rien à afficher ici pour l'instant.</p>
      </div>
    );
  };

  return (
    <Shell>
      {/* HEADER */}
      <header className="mb-8">
        <div className="flex items-center justify-between">
          <div className="py-4">
            <h1 className="text-lg font-bold">Davban</h1>
          </div>

          <NewCategoryDialog
            totalCategories={categories?.length ?? 0}
            trigger={
              <Button
                pill
                className="space-x-1.5"
                disabled={
                  catStatus === 'pending' ||
                  catStatus === 'error' ||
                  isMaxCategories ||
                  updateStatus === 'pending'
                }
              >
                {!isMaxCategories && <Plus size={16} />}
                <span>
                  {isMaxCategories ? 'Max (03) atteint' : 'Catégorie'}
                </span>
              </Button>
            }
          />
        </div>
      </header>

      <main>{renderChildren()}</main>
    </Shell>
  );
};
