import { http, HttpResponse } from 'msw';
import { DATA_REQUESTS_BASE_URL } from '../../fixtures/constants';

export const dataRequestHandlers = [
  http.post(DATA_REQUESTS_BASE_URL, () =>
    HttpResponse.json(
      { id: 'mock-data-request-id', message: 'Data request created' },
      { status: 200 }
    )
  )
];
