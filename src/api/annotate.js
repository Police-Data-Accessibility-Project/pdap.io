import axios from 'axios';
import { useAuthStore } from '@/stores/auth';

const ANNOTATE_BASE = `${import.meta.env.VITE_SM_API_URL}/annotate`;
const HEADERS_BASE = {
  'Content-Type': 'application/json'
};

export async function getAnonymousAnnotationURL() {
  return await axios.get(`${ANNOTATE_BASE}/anonymous`);
}

export async function postAnonymousAnnotation(annotation, url_id) {
  return await axios.post(`${ANNOTATE_BASE}/anonymous/${url_id}`, annotation, {
    headers: {
      ...HEADERS_BASE
    }
  });
}

export async function getUserAnnotationURL() {
  const auth = useAuthStore();

  return await axios.get(`${ANNOTATE_BASE}/all`, {
    headers: {
      ...HEADERS_BASE,
      authorization: `Bearer ${auth.$state.tokens.accessToken.value}`
    }
  });
}
export async function postUserAnnotation(annotation, url_id) {
  const auth = useAuthStore();

  return await axios.post(`${ANNOTATE_BASE}/anonymous/${url_id}`, annotation, {
    headers: {
      ...HEADERS_BASE,
      authorization: `Bearer ${auth.$state.tokens.accessToken.value}`
    }
  });
}

export async function get_url_screenshot(url_id) {
  return await axios.get(`${URL_BASE}/${url_id}/screenshot`);
}
