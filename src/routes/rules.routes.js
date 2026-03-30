import { Router } from 'express';
import * as rulesController from '../controllers/rules.controller.js';
import { validateBody, uuidParam } from '../middleware/validate-route.js';
import { parseCreateRuleBody } from '../validation/rule-payload.js';

export const rulesRouter = Router();

rulesRouter.get('/', rulesController.listRules);
rulesRouter.post('/', validateBody(parseCreateRuleBody), rulesController.createRule);
rulesRouter.delete('/:id', uuidParam('id'), rulesController.deleteRule);
