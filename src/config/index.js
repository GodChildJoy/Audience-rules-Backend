import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const config = {
  port: Number(process.env.PORT) || 3000,
  /** Path to the JSON store (project root / data) */
  rulesFilePath: path.resolve(__dirname, '../../data/audience-rules.json'),
  corsOrigin: process.env.CORS_ORIGIN ?? true,
};
