import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
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
