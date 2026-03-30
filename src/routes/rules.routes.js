import { Router } from 'express';
import * as rulesController from '../controllers/rules.controller.js';

export const rulesRouter = Router();

rulesRouter.get('/', rulesController.listRules);
rulesRouter.post('/', rulesController.createRule);
rulesRouter.delete('/:id', rulesController.deleteRule);
