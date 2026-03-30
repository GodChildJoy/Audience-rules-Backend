import crypto from 'node:crypto';
import * as rulesStorage from '../services/rules-storage.service.js';

/**
 * GET /rules — all stored rules (e.g. open http://localhost:3000/rules in the browser)
 * @type {import('express').RequestHandler}
 */
export async function listRules(req, res, next) {
  try {
    const rules = await rulesStorage.readAllRules();
    res.json(rules);
  } catch (err) {
    next(err);
  }
}

/**
 * POST /rules — append a new rule to audience-rules.json
 * @type {import('express').RequestHandler}
 */
export async function createRule(req, res, next) {
  try {
    const { name, root, savedAt } = req.validatedBody;
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

/**
 * DELETE /rules/:id — remove one rule from audience-rules.json
 * @type {import('express').RequestHandler}
 */
export async function deleteRule(req, res, next) {
  try {
    const id = req.params.id;
    const deleted = await rulesStorage.deleteRuleById(id);
    if (!deleted) {
      res.status(404).json({ error: 'Rule not found.' });
      return;
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
