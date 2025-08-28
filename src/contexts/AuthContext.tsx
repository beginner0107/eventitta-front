'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useGetMyProfile, useLogout, useRefresh } from '@/api/eventitta';
import type { UserProfileResponse } from '@/api/eventitta';
import { getCookieValue } from '@/lib/cookie-debug';
import { saveAuthToStorage, loadAuthFromStorage, clearAuthStorage } from '@/lib/auth-storage';

interface AuthContextType {
  user: UserProfileResponse | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (user: UserProfileResponse) => void;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserProfileResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const router = useRouter();

  // 사용자 프로필 조회 쿼리
  const profileQuery = useGetMyProfile({
    query: {
      retry: false,
      enabled: false, // 수동으로 실행
    },
  });

  // 로그아웃 뮤테이션
  const logoutMutation = useLogout({
    mutation: {
      onSuccess: () => {
        setUser(null);
        setAuthChecked(true);
        clearAuthStorage();
        router.push('/auth/login');
      },
      onError: (error) => {
        console.error('Logout error:', error);
        // 로그아웃 실패해도 클라이언트 상태는 초기화
        setUser(null);
        setAuthChecked(true);
        clearAuthStorage();
        router.push('/auth/login');
      },
    },
  });

  // 토큰 리프레시 뮤테이션
  const refreshMutation = useRefresh({
    mutation: {
      onSuccess: async () => {
        try {
          const result = await profileQuery.refetch();
          if (result.data?.data) {
            setUser(result.data.data);
          } else {
            setUser(null);
          }
        } catch (error) {
          console.error('Profile fetch after refresh failed:', error);
          setUser(null);
        } finally {
          setIsLoading(false);
          setAuthChecked(true);
        }
      },
      onError: (error) => {
        console.error('Token refresh failed:', error);
        // 리프레시 실패 시 쿠키가 서버에서 삭제되었으므로 로그아웃 상태로
        setUser(null);
        setIsLoading(false);
        setAuthChecked(true);
        // 보호된 페이지에서만 로그인 페이지로 리다이렉트 (미들웨어가 처리)
      },
    },
  });

  // 초기 인증 상태 확인 - 쿠키를 확인하고 프로필을 가져오는 간단한 로직
  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      // Client-side only
      if (typeof window === 'undefined') {
        return;
      }

      if (authChecked) {
        return;
      }

      try {
        setIsLoading(true);

        const accessToken = getCookieValue('access_token');
        const refreshToken = getCookieValue('refresh_token');

        // No tokens = try localStorage fallback (development only)
        if (!accessToken && !refreshToken) {
          // Try localStorage fallback for development
          const storedUser = loadAuthFromStorage();
          if (storedUser) {
            if (isMounted) {
              setUser(storedUser);
              setIsLoading(false);
              setAuthChecked(true);
            }
            return;
          }

          if (isMounted) {
            setUser(null);
            setIsLoading(false);
            setAuthChecked(true);
          }
          return;
        }

        // Try to fetch profile with access token
        if (accessToken) {
          try {
            const result = await profileQuery.refetch();
            if (isMounted && result.data?.data) {
              setUser(result.data.data);
              setIsLoading(false);
              setAuthChecked(true);
              return;
            }
          } catch (error) {
            console.error('Profile fetch failed:', error);
          }
        }

        // If access token failed but we have refresh token, try refresh
        if (refreshToken) {
          refreshMutation.mutate();
          return;
        }

        // No valid tokens
        if (isMounted) {
          setUser(null);
          setIsLoading(false);
          setAuthChecked(true);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        if (isMounted) {
          setUser(null);
          setIsLoading(false);
          setAuthChecked(true);
        }
      }
    };

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, [authChecked, profileQuery, refreshMutation]); // Include required dependencies

  const login = (userData: UserProfileResponse) => {
    setUser(userData);
    setAuthChecked(true);
    setIsLoading(false);

    // Save to localStorage as development fallback
    saveAuthToStorage(userData);
  };

  const logout = async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch (error) {
      console.error('Logout failed:', error);
      // 로그아웃 API 실패해도 클라이언트 상태는 초기화
      setUser(null);
      setAuthChecked(true);
      clearAuthStorage();
      router.push('/auth/login');
    }
  };

  const refresh = async () => {
    try {
      await refreshMutation.mutateAsync();
    } catch (error) {
      console.error('Token refresh failed:', error);
      setUser(null);
      setAuthChecked(true);
      router.push('/auth/login');
    }
  };

  const value: AuthContextType = {
    user,
    isLoading: isLoading || logoutMutation.isPending || refreshMutation.isPending,
    isAuthenticated: !!user && authChecked,
    login,
    logout,
    refresh,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
