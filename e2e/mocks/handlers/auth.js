import { http, HttpResponse } from 'msw';
import jwt from 'jsonwebtoken';
import { ENDPOINTS } from '../../../src/api/constants';
import {
  AUTH_BASE_URL as AUTH_BASE,
  OAUTH_BASE_URL as OAUTH_BASE,
  TEST_USER
} from '../../fixtures/constants';
import { PASSWORD_AUTH } from '../../fixtures/users';

const createTestTokens = () => {
  const secret = 'test-secret';

  const accessToken = jwt.sign(
    {
      sub: TEST_USER.id,
      // auth store reads `user_email` (not `email`) — see src/stores/auth.js
      user_email: TEST_USER.email,
      exp: Math.floor(Date.now() / 1000) + 60 * 60, // 1 hour from now
      iat: Math.floor(Date.now() / 1000)
    },
    secret
  );

  const refreshToken = jwt.sign(
    {
      sub: TEST_USER.id,
      exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60, // 7 days from now
      iat: Math.floor(Date.now() / 1000)
    },
    secret
  );

  return { accessToken, refreshToken };
};

export const authHandlers = [
  // Handler for email/password login
  http.post(`${AUTH_BASE}/${ENDPOINTS.AUTH.LOGIN}`, async ({ request }) => {
    const body = await request.json();

    if (
      body.email === PASSWORD_AUTH.email &&
      body.password === PASSWORD_AUTH.password
    ) {
      const { accessToken, refreshToken } = createTestTokens();
      return HttpResponse.json(
        { access_token: accessToken, refresh_token: refreshToken },
        { status: 200 }
      );
    }

    return HttpResponse.json(
      { message: 'Invalid credentials' },
      { status: 401 }
    );
  }),

  // Handler for API key generation
  http.post(`${AUTH_BASE}/${ENDPOINTS.AUTH.API_KEY}`, () =>
    HttpResponse.json({ api_key: 'test-api-key-abc123' }, { status: 200 })
  ),

  // Handler for GitHub OAuth redirect
  http.get(`${OAUTH_BASE}/${ENDPOINTS.OAUTH.GITHUB}`, ({ request }) => {
    const url = new URL(request.url);
    const redirectUrl = new URL(url.searchParams.get('redirect_url')).pathname;

    // Simulate GitHub OAuth redirect with mock access token
    if (redirectUrl) {
      const redirectWithToken = `${redirectUrl}?gh_access_token=mock-github-token-789`;
      return HttpResponse.redirect(redirectWithToken);
    }

    return new HttpResponse(null, { status: 400 });
  }),

  // Handler for signing in with GitHub
  http.post(
    `${OAUTH_BASE}/${ENDPOINTS.OAUTH.LOGIN_WITH_GITHUB}`,
    async ({ request }) => {
      const body = await request.json();

      // If this specific token is used, return the "already exists" error
      if (body.gh_access_token === 'existing-user-token') {
        return HttpResponse.json(
          {
            message: 'User already exists'
          },
          {
            status: 400
          }
        );
      }

      if (body.gh_access_token === 'invalid-token') {
        return HttpResponse.json(
          {
            message: 'error'
          },
          {
            status: 400
          }
        );
      }

      // Otherwise return successful login
      const { accessToken, refreshToken } = createTestTokens();
      return HttpResponse.json(
        {
          access_token: accessToken,
          refresh_token: refreshToken
        },
        {
          status: 200
        }
      );
    }
  ),

  // Handler for linking account with GitHub
  http.post(
    `${OAUTH_BASE}/${ENDPOINTS.OAUTH.LINK_TO_GITHUB}`,
    async ({ request }) => {
      const body = await request.json();

      if (body.gh_access_token && body.user_email) {
        return HttpResponse.json(
          {
            message: 'Successfully linked GitHub account'
          },
          { status: 200 }
        );
      }

      return new HttpResponse(null, {
        status: 400,
        statusText: 'Missing required parameters'
      });
    }
  )
];
