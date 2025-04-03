import { beforeAll, afterAll, afterEach } from '@playwright/test';
import { server } from './setup';

beforeAll(async () => {
  console.log('🚀 Starting MSW Server in test setup');
  server.listen({ onUnhandledRequest: 'warn' });
});

afterEach(() => {
  console.log('🔄 Resetting handlers');
  server.resetHandlers();
});

afterAll(() => {
  console.log('🛑 Stopping MSW Server');
  server.close();
});
