import axios from 'axios';
import { useAuthStore } from '@/stores/auth';
import { NextAnonymousAnnotationType } from '@/pages/annotate/_components/_shared/types';

const ANNOTATE_BASE = `${import.meta.env.VITE_SM_API_URL}/annotate`;
const HEADERS_BASE = {
  'Content-Type': 'application/json'
};

export async function getAnonymousAnnotationURL(): Promise<NextAnonymousAnnotationType> {
  return await axios.get(`${ANNOTATE_BASE}/anonymous`)
    .then((res) => res.data.next_annotation);
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
  return await axios.get(`${ANNOTATE_BASE}/${url_id}/screenshot`);
}
