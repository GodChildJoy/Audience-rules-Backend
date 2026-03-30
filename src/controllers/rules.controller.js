import crypto from 'node:crypto';
import { parseCreateRuleBody } from '../validation/rule-payload.js';
import * as rulesStorage from '../services/rules-storage.service.js';

/**
 * POST /rules — append a new rule to audience-rules.json
 * @type {import('express').RequestHandler}
 */
export async function createRule(req, res, next) {
  try {
    const { name, root, savedAt } = parseCreateRuleBody(req.body);
    const record = {
      id: crypto.randomUUID(),
      name,
      root,
      savedAt: savedAt ?? new Date().toISOString(),
      storedAt: new Date().toISOString(),
    };
    await rulesStorage.appendRule(record);
    res.status(201).json(record);
  } catch (err) {
    next(err);
  }
}
