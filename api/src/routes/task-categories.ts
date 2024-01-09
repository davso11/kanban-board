import { Hono } from 'hono';

// handlers
import * as handlers from '@/handlers/task-categories';

const router = new Hono();

router
  .route('/')
  .post(handlers.createCategory)
  .get('/', handlers.getEveryCategories);

router.route('/:id').delete(handlers.deleteCategory);

export default router;
