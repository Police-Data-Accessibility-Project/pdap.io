import axios from 'axios';
import { ENDPOINTS } from './constants';
import { useAuthStore } from '@/stores/auth';
import { useUserStore } from '@/stores/user';
import { signInWithEmail } from './auth';

const USER_BASE = `${import.meta.env.VITE_API_URL}/user`;
const USER_BASE_V3 = `${import.meta.env.VITE_API_URL_V3}/user`;
const HEADERS = {
  'Content-Type': 'application/json'
};

export async function changePassword(oldPassword, newPassword) {
  const auth = useAuthStore();
  const user = useUserStore();

  await axios.post(
    `${USER_BASE}/${ENDPOINTS.USER.UPDATE_PASSWORD}`,
    { old_password: oldPassword, new_password: newPassword },
    {
      headers: {
        ...HEADERS,
        Authorization: `Bearer ${auth.$state.tokens.accessToken.value}`
      }
    }
  );

  return await signInWithEmail(user.email, newPassword);
}

export async function getUser() {
  const auth = useAuthStore();
  const user = useUserStore();

  return await axios.get(`${USER_BASE_V3}/${user.id}`, {
    headers: {
      ...HEADERS,
      Authorization: `Bearer ${auth.$state.tokens.accessToken.value}`
    }
  });
}
