import { axios } from '@/lib/axios';
import { TTask } from '@/types';
import { useMutation, useQuery } from '@tanstack/react-query';

export function useTasks(categoryId?: string) {
  const { data: tasks, status: queryStatus } = useQuery({
    queryKey: ['tasks', categoryId],
    queryFn: async () => {
      try {
        const { data, status } = await axios.get(
          `/tasks/by-category/${categoryId}`,
        );
        if (status !== 200) throw data; // as error
        return data as TTask[];
      } catch (e) {
        console.log(e);
      }
    },
    enabled: !!categoryId,
  });

  const { mutateAsync: saveTask, status: saveStatus } = useMutation({
    mutationFn: async (data: Record<string, any>) => {
      const { data: res, status } = await axios.post('/tasks', data);
      if (status !== 201) throw res; // as error
      return res as TTask;
    },
  });

  const { mutateAsync: deleteTask, status: deleteStatus } = useMutation({
    mutationFn: async (taskId: string) => {
      const { data: res, status } = await axios.delete(`/tasks/${taskId}`);
      if (status !== 200) throw res; // as error
    },
  });

  const { mutateAsync: updateTasks, status: updateStatus } = useMutation({
    mutationFn: async (data: TTask[]) => {
      const { data: res, status } = await axios.put(`/tasks`, data);
      if (status !== 200) throw res; // as error
      return res as TTask;
    },
  });

  return {
    tasks,
    queryStatus,
    saveTask,
    saveStatus,
    deleteTask,
    deleteStatus,
    updateTasks,
    updateStatus,
  };
}
