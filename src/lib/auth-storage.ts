// Development-only authentication storage fallback
// This helps with SameSite=Strict cookie issues in development

export interface AuthStorageData {
  user: any;
  timestamp: number;
  expiresAt: number;
}

const AUTH_STORAGE_KEY = 'eventitta_auth_dev';
const AUTH_EXPIRY_MS = 60 * 60 * 1000; // 1 hour

export function saveAuthToStorage(user: any) {
  if (typeof window === 'undefined' || process.env.NODE_ENV !== 'development') return;

  const authData: AuthStorageData = {
    user,
    timestamp: Date.now(),
    expiresAt: Date.now() + AUTH_EXPIRY_MS,
  };

  try {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData));
  } catch (error) {
    console.warn('Failed to save auth to localStorage:', error);
  }
}

export function loadAuthFromStorage(): any | null {
  if (typeof window === 'undefined' || process.env.NODE_ENV !== 'development') return null;

  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!stored) return null;

    const authData: AuthStorageData = JSON.parse(stored);

    // Check if expired
    if (Date.now() > authData.expiresAt) {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      return null;
    }

    return authData.user;
  } catch (error) {
    console.warn('Failed to load auth from localStorage:', error);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
}

export function clearAuthStorage() {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  } catch (error) {
    console.warn('Failed to clear auth storage:', error);
  }
}

export function hasValidCookies(): boolean {
  if (typeof document === 'undefined') return false;

  const cookies = document.cookie;
  return cookies.includes('access_token=') || cookies.includes('refresh_token=');
}
