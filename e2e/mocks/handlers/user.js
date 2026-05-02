import { http, HttpResponse } from 'msw';
import { TEST_USER, USER_BASE_V3_URL } from '../../fixtures/constants';

const emptyProfile = {
  id: TEST_USER.id,
  email: TEST_USER.email,
  external_accounts: { github: null },
  permissions: [],
  followed_searches: [],
  recent_searches: [],
  data_requests: []
};

export const userHandlers = [
  http.get(`${USER_BASE_V3_URL}/:id`, () =>
    HttpResponse.json(emptyProfile, { status: 200 })
  )
];
