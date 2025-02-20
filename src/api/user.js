import axios from 'axios';
import { ENDPOINTS } from './constants';
import { useAuthStore } from '@/stores/auth';
import { useUserStore } from '@/stores/user';

const USER_BASE = `${import.meta.env.VITE_API_URL}/user`;
const HEADERS = {
  'Content-Type': 'application/json'
};

export async function changePassword(oldPassword, newPassword) {
  const auth = useAuthStore();
  const user = useUserStore();

  await axios.post(
    `${USER_BASE}/${user.id}/${ENDPOINTS.USER.ID.UPDATE_PASSWORD}`,
    { old_password: oldPassword, new_password: newPassword },
    {
      headers: {
        ...HEADERS,
        Authorization: `Bearer ${auth.$state.tokens.accessToken.value}`
      }
    }
  );

  return await auth.signInWithEmail(user.email, newPassword);
}

export async function getUser() {
  const auth = useAuthStore();
  const user = useUserStore();

  return await axios.get(`${USER_BASE}/${user.id}`, {
    headers: {
      ...HEADERS,
      Authorization: `Bearer ${auth.$state.tokens.accessToken.value}`
    }
  });
}
