import { Draggable, Droppable } from '@hello-pangea/dnd';
import { MoreHorizontal, Plus } from 'lucide-react';
import { Task } from './task';
import { Button } from './ui/button';
import { NewTaskDialog } from './new-task-dialog';
import { CategoryAPIResponse } from '@/types';
import { CategoryMenu } from './category-menu';

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
          <div className="flex items-center justify-between font-semibold">
            <div className="flex items-center space-x-1.5">
              <h2>{category.label}</h2>
              <span className="desc">{totalTasks}</span>
            </div>

            <CategoryMenu
              category={category}
              total={totalCategories}
              trigger={
                <Button
                  pill
                  size="icon"
                  variant="secondary"
                  tooltipMessage="Nouvelle tâche"
                >
                  <MoreHorizontal size={16} />
                </Button>
              }
            />
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
