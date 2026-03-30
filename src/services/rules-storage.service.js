import fs from 'node:fs/promises';
import { config } from '../config/index.js';

/**
 * @returns {Promise<object[]>}
 */
export async function readAllRules() {
  try {
    const raw = await fs.readFile(config.rulesFilePath, 'utf8');
    const data = JSON.parse(raw);
    if (!Array.isArray(data)) {
      return [];
    }
    return data;
  } catch (e) {
    if (/** @type {NodeJS.ErrnoException} */ (e).code === 'ENOENT') {
      return [];
    }
    throw e;
  }
}

/**
 * @param {object} ruleRecord
 */
export async function appendRule(ruleRecord) {
  const rules = await readAllRules();
  rules.push(ruleRecord);
  const json = `${JSON.stringify(rules, null, 2)}\n`;
  await fs.writeFile(config.rulesFilePath, json, 'utf8');
  return ruleRecord;
}
