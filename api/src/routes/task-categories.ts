import { Hono } from 'hono';

// handlers
import * as handlers from '@/handlers/task-categories';

const router = new Hono();

router
  .route('/')
  .post(handlers.createCategory)
  .get(handlers.getEveryCategories)
  .put(handlers.updateCategories);

router.route('/:id').delete(handlers.deleteCategory);
router.post('/rename', handlers.renameCategory);

export default router;
