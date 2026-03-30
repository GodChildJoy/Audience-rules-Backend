import fs from 'node:fs/promises';
import { config } from '../config/index.js';

/**
 * @returns {Promise<object[]>}
 */
export async function readAllAudiences() {
  try {
    const raw = await fs.readFile(config.audiencesFilePath, 'utf8');
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
