import { useMutation, useQuery } from '@tanstack/react-query';
import { axios } from '@/lib/axios';
import { CategoryAPIResponse, TTask } from '@/types';

export function useCategories() {
  const { data: categories, status: queryStatus } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      try {
        const { data, status } = await axios.get('/task-categories?q=tasks', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (status !== 200) throw data; // as error
        return data as CategoryAPIResponse[];
      } catch (e) {
        console.log(e);
      }
    },
  });

  const { mutateAsync: saveCategory, status: savingStatus } = useMutation({
    mutationFn: async ({ label, order }: { label: string; order: number }) => {
      const { data: res, status } = await axios.post('/task-categories', {
        label,
        order,
        createdAt: new Date(),
      });
      if (status !== 201) throw res; // as error
      return res as CategoryAPIResponse;
    },
  });

  const { mutateAsync: rename, status: renamingStatus } = useMutation({
    mutationFn: async (data: { label: string; id: string }) => {
      const { data: res, status } = await axios.post(
        '/task-categories/rename',
        data,
      );
      if (status !== 200) throw res; // as error
      return res;
    },
  });

  const { mutateAsync: updateCategories, status: updateStatus } = useMutation({
    mutationFn: async (
      data: Array<{
        id: string;
        label: string;
        order: number;
        tasks?: TTask[];
      }>,
    ) => {
      const { data: res, status } = await axios.put(`/task-categories`, data);
      if (status !== 200) throw res; // as error
      return res as CategoryAPIResponse;
    },
  });

  const { mutateAsync: deleteCategory, status: deletionStatus } = useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      const { data: res, status } = await axios.delete(
        `/task-categories/${id}`,
      );
      if (status !== 200) throw res; // as error
      return res as {
        ok: boolean;
      };
    },
  });

  return {
    categories,
    queryStatus,
    saveCategory,
    savingStatus,
    updateCategories,
    updateStatus,
    deleteCategory,
    deletionStatus,
    rename,
    renamingStatus,
  };
}
