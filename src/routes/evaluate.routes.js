import { Router } from 'express';
import * as evaluateController from '../controllers/evaluate.controller.js';

export const evaluateRouter = Router();

evaluateRouter.post('/', evaluateController.evaluateAudienceRule);
