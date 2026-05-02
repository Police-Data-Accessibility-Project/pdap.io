import { authHandlers } from './auth';
import { dataRequestHandlers } from './data-requests';
import { userHandlers } from './user';

export const handlers = [
  ...authHandlers,
  ...dataRequestHandlers,
  ...userHandlers
];
