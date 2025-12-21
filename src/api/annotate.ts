import axios from 'axios';
import { useAuthStore } from '@/stores/auth';
import {
  AnnotationSubmission,
  NextAnnotationResponse
} from '@/pages/annotate/_components/_shared/types';
import { UserContributionGetResponse } from '../pages/annotate/_components/_shared/types';
import { deleteCookie, useAnonSessionStore } from '@/util/cookies';

const ANNOTATE_BASE = `${import.meta.env.VITE_SM_API_URL}/annotate`;
const CONTRIBUTIONS_BASE = `${import.meta.env.VITE_SM_API_URL}/contributions`;
const HEADERS_BASE = {
  'Content-Type': 'application/json'
};

function authHeaders(auth) {
  return {
    ...HEADERS_BASE,
    authorization: `Bearer ${auth.$state.tokens.accessToken.value}`
  };
}

export async function getAnnotationURL(session_id: string | null): Promise<NextAnnotationResponse> {
  const auth = useAuthStore();

  if (auth.isAuthenticated()) {
    return await axios
      .get(`${ANNOTATE_BASE}/all`, {
        headers: authHeaders(auth)
      })
      .then((res) => res.data);
  }
  // Fall back to anonymous annotation.
  // Use anonymous session ID if provided
  console.log('Falling back to anonymous annotation...')
  if (session_id !== null) {
    console.log("Using Session ID ", session_id);
    return await axios.get(`${ANNOTATE_BASE}/anonymous?session_id=${session_id}`).then((res) => res.data)
  }
  // Otherwise do not provide session id
  return await axios.get(`${ANNOTATE_BASE}/anonymous`).then((res) => res.data);
}

export async function postAnnotation(
  annotation: AnnotationSubmission,
  url_id: number,
  session_id: string | null
) {
  const auth = useAuthStore();
  if (auth.isAuthenticated()) {
    return await axios
      .post(`${ANNOTATE_BASE}/all/${url_id}`, annotation, {
        headers: authHeaders(auth)
      })
      .then((res) => res.data);
  }
  // Fall back to anonymous annotation.
  return await axios
    .post(
      `${ANNOTATE_BASE}/anonymous/${url_id}?session_id=${session_id}`,
      annotation,
      {
        headers: {
          ...HEADERS_BASE
        }
      }
    )
    .then((res) => res.data);
}

export async function getContributions(): Promise<null | UserContributionGetResponse> {
  const auth = useAuthStore();
  if (!auth.isAuthenticated()) {
    return null;
  }
  return await axios
    .get(`${CONTRIBUTIONS_BASE}/user`, {
      headers: authHeaders(auth)
    })
    .then((res) => res.data);
}

export async function migrateAnonymousSessionAnnotations(): Promise<void> {
  // Get Auth
  const auth = useAuthStore();
  if (!auth.isAuthenticated()) {
    console.log("User not authenticated. Cancelling migration.")
    return;
  }
  // Get Anon Session UUID
  const anonSession = useAnonSessionStore();
  anonSession.hydrateSession();
  if (!anonSession.sessionID) {
    console.log("No session ID found. Cancelling migration.")
    return;
  }

  try {
    await axios.post(
      `${ANNOTATE_BASE}/migrate?session_id=${anonSession.sessionID}`,
      {},
      {
        headers: authHeaders(auth)
      }
    );
  } catch (error) {
    console.log("Error calling migration endpoint: ", error);
    return;
  }


  // Remove session ID cookie
  deleteCookie('sessionID')

  // Log to console whether migration was a success or not.
  console.log("Anonymous Session Migration success.")
}