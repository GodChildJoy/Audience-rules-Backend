import { Router } from 'express';
import * as evaluateController from '../controllers/evaluate.controller.js';
import { validateBody } from '../middleware/validate-route.js';
import { parseEvaluateBody } from '../validation/rule-payload.js';

export const evaluateRouter = Router();

evaluateRouter.post('/', validateBody(parseEvaluateBody), evaluateController.evaluateAudienceRule);
