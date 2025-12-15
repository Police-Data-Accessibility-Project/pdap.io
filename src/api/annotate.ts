import axios from 'axios';
import { useAuthStore } from '@/stores/auth';
import {
  AnnotationSubmission, NextAnnotationResponse
} from '@/pages/annotate/_components/_shared/types';

const ANNOTATE_BASE = `${import.meta.env.VITE_SM_API_URL}/annotate`;
const HEADERS_BASE = {
  'Content-Type': 'application/json'
};

export async function getAnnotationURL(): Promise<NextAnnotationResponse> {
  const auth = useAuthStore();

  if (auth.isAuthenticated()) {
    return await axios.get(`${ANNOTATE_BASE}/all`, {
      headers: {
        ...HEADERS_BASE,
        authorization: `Bearer ${auth.$state.tokens.accessToken.value}`
      }
    }).then((res) => res.data);
  }
  // Fall back to anonymous annotation.
  return await axios.get(`${ANNOTATE_BASE}/anonymous`)
    .then((res) => res.data);
}

export async function postAnnotation(
  annotation: AnnotationSubmission,
  url_id: number,
  session_id: string | null,
) {
  const auth = useAuthStore();
  if (auth.isAuthenticated()) {
    return await axios.post(`${ANNOTATE_BASE}/all/${url_id}`, annotation, {
      headers: {
        ...HEADERS_BASE,
        authorization: `Bearer ${auth.$state.tokens.accessToken.value}`
      }
    }).then((res) => res.data);
  }
  // Fall back to anonymous annotation.
  return await axios.post(`${ANNOTATE_BASE}/anonymous/${url_id}?session_id=${session_id}`,
    annotation, {
      headers: {
        ...HEADERS_BASE
      }
    }).then((res) => res.data);
}

