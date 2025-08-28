// 개발용 쿠키 디버깅 함수 (현재 사용되지 않음)
export function debugCookies() {
  if (typeof document === 'undefined') return;

  console.log('=== COOKIE DEBUG ===');
  console.log('Raw document.cookie:', document.cookie);

  const cookies = document.cookie.split(';').reduce(
    (acc, cookie) => {
      const [name, value] = cookie.trim().split('=');
      if (name && value) {
        acc[name] = value;
      }
      return acc;
    },
    {} as Record<string, string>,
  );

  console.log('Parsed cookies:', cookies);
  console.log('Has access_token:', !!cookies.access_token);
  console.log('Has refresh_token:', !!cookies.refresh_token);
  console.log('===================');
}

export function getCookieValue(name: string): string | null {
  if (typeof document === 'undefined') return null;

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null;
  }
  return null;
}
