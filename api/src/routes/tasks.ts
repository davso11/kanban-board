import { Hono } from 'hono';

// handlers
import * as handlers from '@/handlers/tasks';

const router = new Hono();

router.route('/').post(handlers.createTask).put(handlers.updateTasks);
router.get('/by-category/:id', handlers.getTasksByCategory);
router.delete('/:id', handlers.deleteTask);

export default router;
