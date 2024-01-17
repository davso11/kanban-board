import { z } from 'zod';
import { Context } from 'hono';
import { db } from '@/lib/db';
import { CategoryOptionalDefaultsSchema } from 'prisma/generated/zod';

export async function createCategory(c: Context<any, '/', {}>) {
  try {
    const json = await c.req.json().catch((e) => {
      c.status(400);
      throw {
        name: 'BAD_REQUEST',
        message: 'Données JSON attendues',
      };
    });

    const data = await CategoryOptionalDefaultsSchema.parseAsync(json).catch(
      (e) => {
        c.status(400);
        throw e;
      },
    );

    const newCategory = await db.category
      .create({
        data,
      })
      .catch((e: any) => {
        c.status(424);
        throw e;
      });

    return c.json(newCategory, {
      status: 201,
    });
  } catch (e: any) {
    return c.json({
      name: e.name,
      message: e.message,
    });
  }
}

export async function getEveryCategories(c: Context<any, '/', {}>) {
  try {
    const { q } = c.req.query();
    const queries = q?.split(',') ?? [];

    const categories = await db.category
      .findMany({
        select: {
          id: true,
          label: true,
          tasks: queries.some((q) => q === 'tasks')
            ? {
                orderBy: [
                  {
                    order: 'asc',
                  },
                  {
                    createdAt: 'asc',
                  },
                ],
              }
            : false,
        },
        orderBy: {
          order: 'asc',
        },
      })
      .catch((e: any) => {
        c.status(424);
        throw e;
      });

    return c.json(categories);
  } catch (e: any) {
    return c.json({
      name: e.name,
      message: e.message,
    });
  }
}

export async function updateCategories(c: Context<any, '/', {}>) {
  const schema = z.array(
    z.object({
      id: z.string().uuid(),
      label: z.string().min(1, { message: 'Le libellé ne peut être vide' }),
      order: z.number().int(),
    }),
  );

  try {
    const json = await c.req.json().catch((e) => {
      c.status(400);
      throw {
        name: 'BAD_REQUEST',
        message: 'Données JSON attendues',
      };
    });

    const data = await schema.parseAsync(json).catch((e) => {
      c.status(400);
      throw e;
    });

    const promises = data.map((category) => {
      return db.category.update({
        where: { id: category.id },
        data: category,
      });
    });

    const txResult = await db.$transaction(promises).catch((e: any) => {
      c.status(424);
      throw e;
    });

    return c.json({ ok: true });
  } catch (e: any) {
    return c.json({
      ok: false,
      name: e.name,
      message: e.message,
    });
  }
}

export async function deleteCategory(c: Context<any, '/:id', {}>) {
  try {
    const { id: catId } = c.req.param();

    const tasks = await db.task.findMany({
      where: {
        categoryId: catId,
      },
      select: {
        id: true,
      },
    });

    if (tasks.length > 0) {
      const taskIds = tasks.map((t) => t.id);

      await db.task.deleteMany({
        where: {
          id: {
            in: taskIds,
          },
        },
      });
    }

    await db.category
      .delete({
        where: {
          id: catId,
        },
      })
      .catch((e: any) => {
        c.status(424);
        throw e;
      });

    return c.json({
      ok: true,
    });
  } catch (e: any) {
    return c.json({
      ok: false,
      name: e.name,
      message: e.message,
    });
  }
}

export async function renameCategory(c: Context<any, '/rename', {}>) {
  const schema = z.object({
    id: z.string().uuid(),
    label: z.string().min(1, { message: 'Le libellé ne peut être vide' }),
  });

  try {
    const json = await c.req.json().catch((e) => {
      c.status(400);
      throw {
        name: 'BAD_REQUEST',
        message: 'Données JSON attendues',
      };
    });

    const { id, label } = await schema.parseAsync(json).catch((e) => {
      c.status(400);
      throw e;
    });

    await db.category
      .update({
        where: {
          id,
        },
        data: {
          label,
        },
      })
      .catch((e: any) => {
        c.status(424);
        throw e;
      });

    return c.json({
      ok: true,
    });
  } catch (e: any) {
    return c.json({
      ok: false,
      name: e.name,
      message: e.message,
    });
  }
}
