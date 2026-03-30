const LOGIC = new Set(['AND', 'OR']);

/**
 * @param {unknown} body
 * @returns {{ name: string, root: object, savedAt?: string }}
 */
export function parseCreateRuleBody(body) {
  if (body === null || typeof body !== 'object') {
    throw Object.assign(new Error('Request body must be a JSON object'), { statusCode: 400, expose: true });
  }
  const { name, root, savedAt } = /** @type {Record<string, unknown>} */ (body);
  if (typeof name !== 'string' || !name.trim()) {
    throw Object.assign(new Error('`name` is required and must be a non-empty string'), { statusCode: 400, expose: true });
  }
  if (root === null || typeof root !== 'object') {
    throw Object.assign(new Error('`root` is required and must be a rule group object'), { statusCode: 400, expose: true });
  }
  validateRuleGroup(root);
  return {
    name: name.trim(),
    root,
    savedAt: typeof savedAt === 'string' ? savedAt : undefined,
  };
}

/**
 * POST /evaluate body: `{ root: ruleGroup }`
 * @param {unknown} body
 * @returns {{ root: object }}
 */
export function parseEvaluateBody(body) {
  if (body === null || typeof body !== 'object') {
    throw Object.assign(new Error('Request body must be a JSON object'), { statusCode: 400, expose: true });
  }
  const { root } = /** @type {Record<string, unknown>} */ (body);
  if (root === null || typeof root !== 'object') {
    throw Object.assign(new Error('`root` is required and must be a rule group object'), { statusCode: 400, expose: true });
  }
  validateRuleGroup(root);
  return { root };
}

/**
 * @param {unknown} group
 */
export function validateRuleGroup(group) {
  const g = /** @type {Record<string, unknown>} */ (group);
  if (!LOGIC.has(g.logic)) {
    throw Object.assign(new Error('Each group must have logic "AND" or "OR"'), { statusCode: 400, expose: true });
  }
  if (!Array.isArray(g.conditions)) {
    throw Object.assign(new Error('Each group must have a conditions array'), { statusCode: 400, expose: true });
  }
  if (!Array.isArray(g.groups)) {
    throw Object.assign(new Error('Each group must have a groups array'), { statusCode: 400, expose: true });
  }
  for (const c of g.conditions) {
    validateCondition(c);
  }
  for (const child of g.groups) {
    validateRuleGroup(child);
  }
}

/**
 * @param {unknown} c
 */
function validateCondition(c) {
  if (c === null || typeof c !== 'object') {
    throw Object.assign(new Error('Each condition must be an object'), { statusCode: 400, expose: true });
  }
  const row = /** @type {Record<string, unknown>} */ (c);
  for (const key of ['field', 'operator', 'value']) {
    if (typeof row[key] !== 'string') {
      throw Object.assign(new Error(`Each condition needs string ${key}`), { statusCode: 400, expose: true });
    }
  }
}
