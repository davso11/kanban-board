import redaxios from 'redaxios';

export const axios = redaxios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
});
