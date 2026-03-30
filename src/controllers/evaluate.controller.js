import * as audiencesStorage from '../services/audiences-storage.service.js';
import { evaluateGroup } from '../services/rule-evaluator.service.js';

/**
 * POST /evaluate — filter audiences.json by rule tree; return name + email
 * @type {import('express').RequestHandler}
 */
export async function evaluateAudienceRule(req, res, next) {
  try {
    const { root } = req.validatedBody;
    const audiences = await audiencesStorage.readAllAudiences();
    const matches = [];
    for (const a of audiences) {
      if (evaluateGroup(a, root)) {
        const name = typeof a.name === 'string' ? a.name : '';
        const email = typeof a.email === 'string' ? a.email : '';
        matches.push({ name, email });
      }
    }
    res.json({ matches });
  } catch (err) {
    next(err);
  }
}
