import { annotateHandlers } from './annotate';
import { authHandlers } from './auth';
import { dataRequestHandlers } from './data-requests';
import { userHandlers } from './user';

export const handlers = [
  ...annotateHandlers,
  ...authHandlers,
  ...dataRequestHandlers,
  ...userHandlers
];
