import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('https://data-sources-v2.pdap.dev/api/typeahead/locations', () => {
    console.log('Request captured');
  }),
  http.post('https://data-sources-v2.pdap.dev/api/auth/login', () => {
    console.log('MOCKING GITHUB');
    return new HttpResponse({
      status: 200,
      body: JSON.stringify({
        accessToken: 'mockedAccessToken',
        refreshToken: 'mockedRefreshToken'
      })
    });
  }),
  http.post(
    'https://data-sources-v2.pdap.dev/api/oauth/login-with-github',
    () => {
      console.log('MOCKING GITHUB');
      return HttpResponse.json(
        {
          message: 'Oh I just failed normally, I guess'
          // To test user already linked error use below
          // 'User with email example@gmail.com already exists but is not linked to the Github Account with the same email. You must explicitly link their accounts in order to log in via Github.'
        },
        { status: 401 }
      );
    }
  )
];
