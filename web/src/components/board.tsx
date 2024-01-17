import { ElementRef, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import { Draggable, Droppable } from '@hello-pangea/dnd';
import { MoreHorizontal, Plus, Check, X } from 'lucide-react';
import { useCategories } from '@/hooks/categories';
import { NewTaskDialog } from './new-task-dialog';
import { CategoryAPIResponse } from '@/types';
import { CategoryMenu } from './category-menu';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Task } from './task';
import { cn } from '@/lib/utils';

type BoardProps = {
  index: number;
  data: CategoryAPIResponse;
  totalCategories: number;
};

export const Board = ({
  index,
  data: category,
  totalCategories,
}: BoardProps) => {
  const tasks = category.tasks!;
  const totalTasks = tasks.length;
  const [renameMode, setRenameMode] = useState(false);
  const [newName, setNewName] = useState(category.label);
  const { rename, renamingStatus } = useCategories();
  const renameInputRef = useRef<ElementRef<'input'>>(null);
  const qc = useQueryClient();

  const isRenaming = renamingStatus === 'pending';

  const enableRenameMode = () => {
    setRenameMode(true);
    setNewName(category.label);
    renameInputRef.current?.focus(); // not working
  };

  const renameHandler = async () => {
    try {
      await toast.promise(
        rename({
          id: category.id,
          label: newName,
        }),
        {
          loading: 'Renommage...',
          error: 'Erreur lors du renommage',
          success: () => {
            setRenameMode(false);
            qc.invalidateQueries({ queryKey: ['categories'] });
            return 'Catégorie renommée';
          },
        },
      );
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Draggable
      draggableId={category.id}
      index={index}
    >
      {(provided) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          className="board mb-6 flex flex-col space-y-4 md:mr-3"
        >
          {/* HEADER */}
          <div
            className={cn(
              'flex items-center justify-between gap-x-4 font-semibold',
              renameMode && 'h-7',
            )}
            onDoubleClick={enableRenameMode}
          >
            <div className="flex h-full grow items-center space-x-1.5">
              {renameMode ? (
                <Input
                  ref={renameInputRef}
                  value={newName}
                  className="h-full w-full shrink-0 p-2"
                  onChange={(e) => setNewName(e.target.value)}
                />
              ) : (
                <>
                  <h2>{category.label}</h2>
                  <span className={cn('desc', isRenaming && 'text-gray-400')}>
                    {isRenaming ? newName : totalTasks}
                  </span>
                </>
              )}
            </div>

            {renameMode ? (
              <div className="flex h-full items-center gap-x-2">
                <Button
                  className="aspect-square h-full p-1"
                  onClick={renameHandler}
                >
                  <Check size={18} />
                </Button>
                <Button
                  variant="secondary"
                  className="aspect-square h-full p-1 shadow-sm"
                  onClick={() => setRenameMode(false)}
                >
                  <X size={18} />
                </Button>
              </div>
            ) : (
              <CategoryMenu
                category={category}
                total={totalCategories}
                trigger={
                  <Button
                    pill
                    size="icon"
                    variant="secondary"
                  >
                    <MoreHorizontal size={16} />
                  </Button>
                }
                onRename={enableRenameMode}
              />
            )}
          </div>

          {/* TASKS */}
          <Droppable
            droppableId={category.label}
            type="task"
          >
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="flex flex-col"
              >
                {totalTasks > 0
                  ? tasks.map((task, i) => (
                      <Task
                        key={task.id}
                        index={i}
                        task={task}
                      />
                    ))
                  : null}
                {provided.placeholder}
                <NewTaskDialog
                  categoryId={category.id}
                  totalTasks={totalTasks}
                  trigger={
                    <Button
                      variant="secondary"
                      className="space-x-1.5"
                    >
                      <Plus size={16} />
                      <span>Nouvelle tâche</span>
                    </Button>
                  }
                />
              </div>
            )}
          </Droppable>
        </div>
      )}
    </Draggable>
  );
};
