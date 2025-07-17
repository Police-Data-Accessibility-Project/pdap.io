import { beforeAll, afterAll, afterEach } from '@playwright/test';
import { server } from './setup';

beforeAll(async () => {
  server.listen({ onUnhandledRequest: 'warn' });
});

afterEach(() => {
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});
