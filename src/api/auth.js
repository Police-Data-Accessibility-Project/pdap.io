import axios from 'axios';
import { ENDPOINTS } from './constants';
import { useAuthStore } from '@/stores/auth';
import { useUserStore } from '@/stores/user';
import getBaseUrl from '@/util/getBaseUrl';

const AUTH_BASE = `${import.meta.env.VITE_API_URL}/auth`;
const OAUTH_BASE = `${import.meta.env.VITE_API_URL}/oauth`;
const HEADERS = {
  'Content-Type': 'application/json'
};

export async function signUpWithEmail(email, password) {
  const user = useUserStore();

  await axios.post(
    `${AUTH_BASE}/${ENDPOINTS.AUTH.SIGNUP}`,
    { email, password },
    { headers: HEADERS }
  );
  // Update store with email
  user.$patch({ email });
}

export async function signInWithEmail(email, password) {
  const auth = useAuthStore();

  const response = await axios.post(
    `${AUTH_BASE}/${ENDPOINTS.AUTH.LOGIN}`,
    { email, password },
    {
      headers: {
        ...HEADERS
        // TODO: API should require auth
        // authorization: `Basic ${import.meta.env.VITE_API_KEY}`,
      }
    }
  );

  auth.parseTokensAndSetData(response);
}

export async function beginOAuthLogin(redirectPath = '/sign-in') {
  const redirectTo = encodeURI(
    `${OAUTH_BASE}/${ENDPOINTS.OAUTH.GITHUB}?redirect_url=${getBaseUrl()}${redirectPath}`
  );

  window.location.href = redirectTo;
}

export async function signInWithGithub(gh_access_token) {
  const auth = useAuthStore();

  const response = await axios.post(
    `${OAUTH_BASE}/${ENDPOINTS.OAUTH.LOGIN_WITH_GITHUB}`,
    { gh_access_token },
    {
      headers: {
        ...HEADERS
      }
    }
  );

  auth.parseTokensAndSetData(response);
  return true;
}

export async function linkAccountWithGithub(gh_access_token) {
  const { email: user_email } = useUserStore();

  return await axios.post(
    `${OAUTH_BASE}/${ENDPOINTS.OAUTH.LINK_TO_GITHUB}`,
    { gh_access_token, user_email },
    {
      headers: {
        ...HEADERS
        // authorization: `Bearer ${this.$state.tokens.accessToken.value}`,
      }
    }
  );
}

export async function signOut() {
  const auth = useAuthStore();
  const user = useUserStore();

  auth.$reset();
  user.$reset();
}

export async function refreshTokens() {
  const auth = useAuthStore();
  const user = useUserStore();

  if (!user.id) return;
  try {
    const response = await axios.post(
      `${AUTH_BASE}/${ENDPOINTS.AUTH.REFRESH_SESSION}`,
      {},
      {
        headers: {
          ...HEADERS,
          authorization: `Bearer ${auth.$state.tokens.refreshToken.value}`
        }
      }
    );
    return auth.parseTokensAndSetData(response);
  } catch (error) {
    console.error(error);
  }
}

export async function validateEmail(token) {
  const auth = useAuthStore();

  const response = await axios.post(
    `${AUTH_BASE}/${ENDPOINTS.AUTH.VALIDATE_EMAIL}`,
    null,
    {
      headers: {
        ...HEADERS,
        Authorization: `Bearer ${token}`
      }
    }
  );

  auth.parseTokensAndSetData(response);
}

export async function resendValidationEmail() {
  const { email } = useUserStore();

  return await axios.post(
    `${AUTH_BASE}/${ENDPOINTS.AUTH.RESEND_VALIDATION_EMAIL}`,
    { email },
    {
      headers: {
        ...HEADERS
      }
    }
  );
}

export async function requestPasswordReset(email) {
  return await axios.post(
    `${AUTH_BASE}/${ENDPOINTS.AUTH.REQUEST_RESET_PASSWORD}`,
    { email },
    { headers: HEADERS }
  );
}

export async function resetPassword(password, token) {
  return await axios.post(
    `${AUTH_BASE}/${ENDPOINTS.AUTH.RESET_PASSWORD}`,
    { password },
    { headers: { ...HEADERS, Authorization: 'Bearer ' + token } }
  );
}

export async function generateAPIKey() {
  const auth = useAuthStore();

  return await axios.post(`${AUTH_BASE}/${ENDPOINTS.AUTH.API_KEY}`, null, {
    headers: {
      ...HEADERS,
      Authorization: `Bearer ${auth.$state.tokens.accessToken.value}`
    }
  });
}

/**
 * @deprecated validation now done by parsing JWT directly
 */
export async function validateResetPasswordToken(token) {
  return await axios.post(
    `${AUTH_BASE}/${ENDPOINTS.AUTH.RESET_TOKEN_VALIDATION}`,
    {
      headers: {
        ...HEADERS,
        Authorization: `Bearer ${token}`
      }
    }
  );
}
