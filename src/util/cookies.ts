import { defineStore } from 'pinia';

export function getCookie(name: string): string | null {
  const match = document.cookie.split('; ').find(r => r.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.split('=')[1]) : null;
}

export function setCookie(name: string, value: string, opts: {
  days?: number; path?: string; secure?: boolean; sameSite?: 'Strict'|'Lax'|'None';
} = {}) {
  const { days = 365, path='/', secure=true, sameSite='Lax' } = opts;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=${path}; SameSite=${sameSite}${secure ? '; Secure' : ''}`;
}

export function deleteCookie(
  name: string,
  path = '/',
  domain?: string
) {
  // Delete cookie by overwriting it with an expiration date in the past
  document.cookie = [
    `${name}=`,
    'expires=Thu, 01 Jan 1970 00:00:00 GMT',
    `path=${path}`,
    domain ? `domain=${domain}` : '',
  ].join('; ');
}

export const useAnonSessionStore = defineStore(
  'anonSession',
  {
    state: () => ({
      sessionID: null,
    }),
    actions: {
      hydrateSession() {
        const raw = getCookie('sessionID');
        if (!raw) return;

        try {
          const parsed = JSON.parse(raw) as Partial<{
            sessionID: string;
          }>;
          if (parsed.sessionID) this.sessionID = parsed.sessionID;

        } catch {
          this.sessionID = null;
        }

      }
    }
  }

)