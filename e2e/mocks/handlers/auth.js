import { http, HttpResponse } from 'msw';
import jwt from 'jsonwebtoken';
import { ENDPOINTS } from '../../../src/api/constants';
import { OAUTH_BASE_URL as OAUTH_BASE } from '../../fixtures/constants';

// const OAUTH_BASE = 'https://data-sources.pdap.dev/api' + '/oauth';

const createTestTokens = () => {
  const secret = 'test-secret';

  const accessToken = jwt.sign(
    {
      sub: 'test-user-id',
      email: 'test@example.com',
      name: 'Test User',
      exp: Math.floor(Date.now() / 1000) + 60 * 60, // 1 hour from now
      iat: Math.floor(Date.now() / 1000)
    },
    secret
  );

  const refreshToken = jwt.sign(
    {
      sub: 'test-user-id',
      exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60, // 7 days from now
      iat: Math.floor(Date.now() / 1000)
    },
    secret
  );

  return { accessToken, refreshToken };
};

export const authHandlers = [
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
    'https://data-sources.pdap.dev/api/oauth/login-with-github',
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
