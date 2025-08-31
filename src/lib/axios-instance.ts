import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

// Determine effective baseURL:
// - If NEXT_PUBLIC_API_BASE_URL is an absolute URL, use it (trim trailing slash).
// - If it's relative (e.g., "/api") or empty, do not set baseURL and let request URLs be absolute paths.
const rawBaseURL = (process.env.NEXT_PUBLIC_API_BASE_URL || '').trim();
const isAbsoluteBase = /^https?:\/\//i.test(rawBaseURL);
const effectiveBaseURL = isAbsoluteBase ? rawBaseURL.replace(/\/+$/, '') : undefined;

const instance = axios.create({
  baseURL: effectiveBaseURL,
  withCredentials: true,
});

// Request interceptor: if we do have an absolute base and it ends with "/api",
// and the request URL also starts with "/api" or "/api/", drop one occurrence safely.
instance.interceptors.request.use((config) => {
  const url = config.url || '';

  // Skip absolute request URLs
  if (/^https?:\/\//i.test(url)) return config;

  const base = typeof config.baseURL === 'string' ? config.baseURL : undefined;

  if (base && /^https?:\/\//i.test(base)) {
    try {
      const parsed = new URL(base);
      const basePath = parsed.pathname.replace(/\/+$/, '');
      const startsWithApi = url === '/api' || url.startsWith('/api/');

      if (basePath.endsWith('/api') && startsWithApi) {
        config.url = url.replace(/^\/api(\/|$)/, '/');
      }
    } catch {
      // If URL parsing fails, do nothing.
    }
  }

  return config;
});

// Response interceptor to handle token expiration
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    // If we get 401 and it's not a login or refresh endpoint, the token is expired
    if (error.response?.status === 401) {
      const url = error.config?.url || '';
      if (!url.includes('/auth/login') && !url.includes('/auth/refresh')) {
        // The server should have cleared the cookies if tokens are invalid
        // We'll let the AuthContext handle the state update on next check
      }
    }

    return Promise.reject(error);
  },
);

export const axiosInstance = <T = unknown, R = AxiosResponse<T>>(
  config: AxiosRequestConfig,
): Promise<R> => {
  return instance.request<T, R>(config);
};

export default instance;
