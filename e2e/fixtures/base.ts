import { test as base, expect } from '@playwright/test';
import { http } from 'msw';
import { createWorkerFixture } from 'playwright-msw';

import { handlers } from '../mocks/handlers';

const test = base.extend({
  // @ts-expect-error
  worker: createWorkerFixture(handlers),
  http
});

export { expect, test };
