import { Draggable } from '@hello-pangea/dnd';
import { Clock, MoreVertical } from 'lucide-react';
import { TTask } from '@/types';
import { dayjs } from '@/lib/dayjs';
import { Button } from './ui/button';
import { TaskMenu } from './task-menu';
import { cn } from '@/lib/utils';

interface TaskProps {
  task: TTask;
  index: number;
}

export const Task = ({ index, task }: TaskProps) => {
  const { id, label, targetDate } = task;

  return (
    <Draggable
      draggableId={id}
      index={index}
    >
      {(provided, snapshot) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          className="mb-4"
        >
          <div
            className={cn('task', {
              'rotate-2 transform opacity-90': snapshot.isDragging,
              'rotate-0 opacity-100': !snapshot.isDragging,
            })}
          >
            <div className="flex justify-between gap-x-1.5">
              <p className="text-lg font-bold">{label}</p>

              {/* ACTION BUTTON */}
              <TaskMenu
                task={task}
                trigger={
                  <Button
                    pill
                    size="icon"
                    variant="ghost"
                    className="shrink-0"
                  >
                    <MoreVertical size={16} />
                  </Button>
                }
              />
            </div>

            {/* DATE */}
            {targetDate ? (
              <div className="desc mt-2 flex items-center space-x-1.5 text-sm">
                <Clock size={15} />
                <span>{dayjs(targetDate).format('D MMM YYYY')}</span>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </Draggable>
  );
};
