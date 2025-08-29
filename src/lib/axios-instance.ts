import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

// Normalize baseURL to avoid double "/api" when request URLs also include "/api/..."
const rawBaseURL = process.env.NEXT_PUBLIC_API_BASE_URL || '';
const normalizedBaseURL = rawBaseURL.replace(/\/+$/, '');

const instance = axios.create({
  baseURL: normalizedBaseURL || undefined,
  withCredentials: true,
});

// Request interceptor to prevent duplicated "/api" in the final URL
instance.interceptors.request.use((config) => {
  const url = config.url || '';
  const base = (config.baseURL || '').replace(/\/+$/, '');
  const isAbsolute = /^https?:\/\//i.test(url);

  if (!isAbsolute) {
    // If base ends with "/api" and url starts with "/api/", drop one occurrence
    if (/(^|\/)api$/i.test(base) && url.startsWith('/api/')) {
      config.url = url.replace(/^\/api\//, '/');
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
