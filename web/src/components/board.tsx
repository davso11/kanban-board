import { toast } from 'react-hot-toast';
import { useEffect, useRef, useState } from 'react';
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
  const renameInputRef = useRef<HTMLInputElement>(null);
  const qc = useQueryClient();

  const isRenaming = renamingStatus === 'pending';

  const enableRenameMode = () => {
    setRenameMode(true);
    setNewName(category.label);
  };

  const renameHandler: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setRenameMode(false);

    // If the name hasn't changed, don't do anything
    if (newName === category.label) {
      return;
    }

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
            qc.invalidateQueries({ queryKey: ['categories'] });
            return 'Catégorie renommée';
          },
        },
      );
    } catch (e) {
      console.log(e);
    }
  };

  // Close rename mode on `esc` key
  const escKeyHandler = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && renameMode) {
      setRenameMode(false);
    }
  };

  useEffect(() => {
    if (renameMode) {
      renameInputRef.current?.focus();
    }
  }, [renameMode]);

  useEffect(() => {
    window.addEventListener('keydown', escKeyHandler);
    return () => window.removeEventListener('keydown', escKeyHandler);
  }, [escKeyHandler]);

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
          className="board hide-scrollbar relative mb-6 flex max-h-[calc(100vh_-_8.75rem)] flex-col space-y-4 overflow-y-auto md:mb-0 md:mr-3"
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
                <form
                  onSubmit={renameHandler}
                  autoComplete="off"
                  className="flex h-full w-full items-center gap-x-2"
                >
                  <Input
                    value={newName}
                    name="rename-input"
                    ref={renameInputRef}
                    className="h-full w-full p-2"
                    onChange={(e) => setNewName(e.target.value)}
                  />
                  <div className="flex h-full items-center gap-x-2">
                    <Button
                      type="submit"
                      className="aspect-square h-full p-1"
                    >
                      <Check size={18} />
                    </Button>
                    <Button
                      variant="secondary"
                      className="aspect-square h-full p-1 shadow-sm"
                      onClick={(e) => {
                        e.preventDefault();
                        setRenameMode(false);
                      }}
                    >
                      <X size={18} />
                    </Button>
                  </div>
                </form>
              ) : (
                <>
                  <h2
                    className={cn('line-clamp-1', isRenaming && 'opacity-40')}
                  >
                    {isRenaming || renamingStatus === 'success'
                      ? newName
                      : category.label}
                  </h2>
                  <span className="desc">{totalTasks}</span>
                </>
              )}
            </div>

            {!renameMode && (
              <CategoryMenu
                category={category}
                total={totalCategories}
                trigger={
                  <Button
                    pill
                    size="icon"
                    variant="secondary"
                    className="shrink-0"
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
