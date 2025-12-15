import { beforeAll, afterAll, afterEach } from '@playwright/test';
import { server } from './setup';

beforeAll(async () => {
  // Do not intercept unknown requests; allow them to hit real services.
  server.listen({ onUnhandledRequest: 'bypass' });
});

afterEach(() => {
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});
