import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { serve } from '@hono/node-server';

// routers
import tasks from '@/routes/tasks';
import taskCategories from '@/routes/task-categories';

const app = new Hono().basePath('/api');

// middlewares
app.use('*', cors());

// routes
app.route('/tasks', tasks);
app.route('/task-categories', taskCategories);

const port = 3000;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
