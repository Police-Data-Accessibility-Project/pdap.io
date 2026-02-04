import { defineStore } from 'pinia';

export function getCookie(name: string): string | null {
  const match = document.cookie
    .split('; ')
    .find((r) => r.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.split('=')[1]) : null;
}

export function setCookie(
  name: string,
  value: string,
  opts: {
    days?: number;
    path?: string;
    secure?: boolean;
    sameSite?: 'Strict' | 'Lax' | 'None';
  } = {}
) {
  const { days = 365, path = '/', secure = true, sameSite = 'Lax' } = opts;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=${path}; SameSite=${sameSite}${secure ? '; Secure' : ''}`;
}

export function deleteCookie(name: string, path = '/', domain?: string) {
  // Delete cookie by overwriting it with an expiration date in the past
  document.cookie = [
    `${name}=`,
    'expires=Thu, 01 Jan 1970 00:00:00 GMT',
    `path=${path}`,
    domain ? `domain=${domain}` : ''
  ].join('; ');
}

/**
 * Anonymous session Pinia store.
 *
 * Manages a client-side anonymous session ID, primarily used
 * to associate annotations with a temporary user before login.
 */
export const useAnonSessionStore = defineStore('anonSession', {
  state: () => ({
    /**
     * Anonymous session identifier persisted in cookies.
     * Null if no session is present or hydration fails.
     */
    sessionID: null
  }),
  actions: {
    /**
     * Hydrates the anonymous session from the `sessionID` cookie.
     *
     * - Reads and parses the cookie value
     * - Safely handles malformed JSON
     * - Clears session state on failure
     */
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
});

/**
 * Reminder Pinia store.
 *
 * Manages a client-side reminders, such as cookie agreement and content warning
 * such that once a user has indicated they've seen them once,
 * they are not presented with such reminders again.
 */
export const useRemindersStore = defineStore('reminders', {
  state: () => ({
    /**
     * Reminders persisted in cookies.
     * False if not acknowledged.
     */
    cookieAgreement: false,
    contentWarning: false
  }),
  actions: {
    /**
     * Hydrates the anonymous session from the `preferences` cookie.
     *
     * - Reads and parses the cookie value
     * - Safely handles malformed JSON
     * - Clears session state on failure
     */
    hydrateSession() {
      const raw = getCookie('reminders');
      if (!raw) return;

      try {
        const parsed = JSON.parse(raw) as Partial<{
          cookieAgreement: boolean;
          contentWarning: boolean;
        }>;
        if (parsed.cookieAgreement)
          this.cookieAgreement = parsed.cookieAgreement;
        if (parsed.contentWarning) this.contentWarning = parsed.contentWarning;
      } catch {
        this.cookieAgreement = null;
        this.contentWarning = null;
      }
    }
  }
});
