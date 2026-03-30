import { rulesRouter } from './rules.routes.js';

/**
 * Register all HTTP route mounts. Add new routers here as the API grows.
 * @param {import('express').Application} app
 */
export function registerRoutes(app) {
  app.use('/rules', rulesRouter);
}
