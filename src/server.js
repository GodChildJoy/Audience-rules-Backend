import { createApp } from './app.js';
import { config } from './config/index.js';

const app = createApp();

app.listen(config.port, () => {
  console.log(`Audience rules API listening on http://localhost:${config.port}`);
  console.log(`POST new rule: http://localhost:${config.port}/rules`);
});
