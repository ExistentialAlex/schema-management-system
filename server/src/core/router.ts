import type { ServerEnv } from '@env';
import type { Hono } from 'hono';
import { authRouter, sessionRouter, userRouter } from '@/router';
import { schemaRouter } from '@/router/schema/schema.endpoints';

export const configureRouter = (app: Hono<ServerEnv>) => {
  return app
    .route('/auth', authRouter)
    .route('/session', sessionRouter)
    .route('/schemas', schemaRouter)
    .route('/users', userRouter);
};
