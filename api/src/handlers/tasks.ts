import { Context } from 'hono';
import { z } from 'zod';
import {
  TaskOptionalDefaultsSchema,
  TaskSchema,
} from '@/../prisma/generated/zod';
import { db } from '@/lib/db';

export async function createTask(c: Context<any, '/', {}>) {
  try {
    const json = await c.req.json().catch((e) => {
      c.status(400);
      throw {
        name: 'BAD_REQUEST',
        message: 'Données JSON attendues',
      };
    });

    const data = await TaskOptionalDefaultsSchema.parseAsync(json).catch(
      (e) => {
        c.status(400);
        throw e;
      },
    );

    const newTask = await db.task
      .create({
        data,
      })
      .catch((e: any) => {
        c.status(424);
        throw e;
      });

    return c.json(newTask, {
      status: 201,
    });
  } catch (e: any) {
    return c.json({
      name: e.name,
      message: e.message,
    });
  }
}

export async function getTasksByCategory(
  c: Context<any, '/by-category/:id', {}>,
) {
  try {
    const { id } = c.req.param();

    const tasks = await db.task
      .findMany({
        where: {
          categoryId: id,
        },
        orderBy: [
          {
            order: 'asc',
          },
          {
            createdAt: 'asc',
          },
        ],
      })
      .catch((e: any) => {
        c.status(424);
        throw e;
      });

    return c.json(tasks);
  } catch (e: any) {
    return c.json({
      name: e.name,
      message: e.message,
    });
  }
}

export async function updateTasks(c: Context<any, '/', {}>) {
  const schema = z.array(
    TaskSchema.merge(
      z.object({
        updatedAt: z.coerce.date().optional(),
      }),
    ),
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

    const promises = data.map((task) => {
      return db.task.update({
        where: { id: task.id },
        data: {
          ...task,
          updatedAt: undefined,
        },
      });
    });

    const txResult = await db.$transaction(promises).catch((e: any) => {
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

export async function deleteTask(c: Context<any, '/:id', {}>) {
  try {
    const { id } = c.req.param();

    await db.task
      .delete({
        where: {
          id,
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
