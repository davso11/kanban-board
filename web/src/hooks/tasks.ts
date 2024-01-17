import { axios } from '@/lib/axios';
import { TTask } from '@/types';
import { useMutation } from '@tanstack/react-query';

export function useTasks() {
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
    saveTask,
    saveStatus,
    deleteTask,
    deleteStatus,
    updateTasks,
    updateStatus,
  };
}
