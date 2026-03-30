import { Router } from 'express';
import * as rulesController from '../controllers/rules.controller.js';

export const rulesRouter = Router();

rulesRouter.post('/', rulesController.createRule);
