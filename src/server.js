import { createApp } from './app.js';
import { config } from './config/index.js';

const app = createApp();

app.listen(config.port, () => {
  console.log(`Audience rules API listening on http://localhost:${config.port}`);
  console.log(`GET    list rules: http://localhost:${config.port}/rules`);
  console.log(`POST   new rule:  http://localhost:${config.port}/rules`);
  console.log(`DELETE rule:      http://localhost:${config.port}/rules/:id`);
});
