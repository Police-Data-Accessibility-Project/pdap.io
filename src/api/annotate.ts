import axios from 'axios';
import { useAuthStore } from '@/stores/auth';
import {
  AgencyAnonymousSubmissionType,
  AnnotationSubmissionType,
  NextAnonymousAnnotationType
} from '@/pages/annotate/_components/_shared/types';

const ANNOTATE_BASE = `${import.meta.env.VITE_SM_API_URL}/annotate`;
const HEADERS_BASE = {
  'Content-Type': 'application/json'
};

export async function getAnonymousAnnotationURL(): Promise<NextAnonymousAnnotationType> {
  console.log(`${ANNOTATE_BASE}/anonymous`)
  const result = await axios.get(`${ANNOTATE_BASE}/anonymous`)
    .then((res) => res.data);
  console.log(result);
  return result
}

export async function postAnonymousAnnotation(
  annotation: AgencyAnonymousSubmissionType,
  url_id: number,
  session_id: string,
): Promise<NextAnonymousAnnotationType> {
  return await axios.post(`${ANNOTATE_BASE}/anonymous/${url_id}?session_id=${session_id}`,
    annotation, {
    headers: {
      ...HEADERS_BASE
    }
  }).then((res) => res.data);
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
export async function postUserAnnotation(
  annotation: AnnotationSubmissionType,
  url_id: number,
) {
  const auth = useAuthStore();

  return await axios.post(`${ANNOTATE_BASE}/anonymous/${url_id}`, annotation, {
    headers: {
      ...HEADERS_BASE,
      authorization: `Bearer ${auth.$state.tokens.accessToken.value}`
    }
  }).then((res) => res.data.next_annotation);
}

export async function get_url_screenshot(url_id: number) {
  return await axios.get(`${ANNOTATE_BASE}/${url_id}/screenshot`);
}
