'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useGetMyProfile, useLogout, useRefresh } from '@/api/eventitta';
import type { UserProfileResponse } from '@/api/eventitta';
import { debugCookies, getCookieValue } from '@/lib/cookie-debug';
import {
  saveAuthToStorage,
  loadAuthFromStorage,
  clearAuthStorage,
  hasValidCookies,
} from '@/lib/auth-storage';

interface AuthContextType {
  user: UserProfileResponse | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (user: UserProfileResponse) => void;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
  manualAuthCheck: () => void; // 개발용 디버깅
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

  // 쿠키 디버깅을 위한 수동 체크 함수 추가 (개발용)
  const manualAuthCheck = () => {
    debugCookies();
    setAuthChecked(false); // 이렇게 하면 useEffect가 다시 실행됨
  };

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
        console.log('AuthContext: Logout successful');
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
        console.log('AuthContext: Token refresh successful, fetching profile...');
        try {
          const result = await profileQuery.refetch();
          if (result.data?.data) {
            console.log(
              'AuthContext: Profile fetch after refresh successful:',
              result.data.data.nickname,
            );
            setUser(result.data.data);
          } else {
            console.log('AuthContext: Profile fetch after refresh failed');
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
      console.log('🔥 AuthContext: Starting authentication check...');

      // Client-side only
      if (typeof window === 'undefined') {
        console.log('🔥 AuthContext: Server-side, skipping');
        return;
      }

      if (authChecked) {
        console.log('🔥 AuthContext: Already checked, skipping');
        return;
      }

      try {
        setIsLoading(true);
        debugCookies();

        const accessToken = getCookieValue('access_token');
        const refreshToken = getCookieValue('refresh_token');

        console.log('🔥 AuthContext: Tokens - access:', !!accessToken, 'refresh:', !!refreshToken);

        // No tokens = try localStorage fallback (development only)
        if (!accessToken && !refreshToken) {
          console.log('🔥 AuthContext: No tokens found in cookies');

          // Try localStorage fallback for development
          const storedUser = loadAuthFromStorage();
          if (storedUser) {
            console.log('🔧 AuthContext: Using localStorage fallback for development');
            if (isMounted) {
              setUser(storedUser);
              setIsLoading(false);
              setAuthChecked(true);
            }
            return;
          }

          console.log('🔥 AuthContext: No fallback available, setting unauthenticated');
          if (isMounted) {
            setUser(null);
            setIsLoading(false);
            setAuthChecked(true);
          }
          return;
        }

        // Try to fetch profile with access token
        if (accessToken) {
          console.log('🔥 AuthContext: Fetching profile with access token...');
          try {
            const result = await profileQuery.refetch();
            if (isMounted && result.data?.data) {
              console.log('🔥 AuthContext: Profile success:', result.data.data.nickname);
              setUser(result.data.data);
              setIsLoading(false);
              setAuthChecked(true);
              return;
            }
          } catch (error) {
            console.log('🔥 AuthContext: Profile fetch failed:', error);
          }
        }

        // If access token failed but we have refresh token, try refresh
        if (refreshToken) {
          console.log('🔥 AuthContext: Trying token refresh...');
          refreshMutation.mutate();
          return;
        }

        // No valid tokens
        console.log('🔥 AuthContext: No valid tokens');
        if (isMounted) {
          setUser(null);
          setIsLoading(false);
          setAuthChecked(true);
        }
      } catch (error) {
        console.error('🔥 AuthContext: Check failed:', error);
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
    console.log('AuthContext: Manual login called for:', userData.nickname);
    setUser(userData);
    setAuthChecked(true);
    setIsLoading(false);

    // Save to localStorage as development fallback
    saveAuthToStorage(userData);
  };

  const logout = async () => {
    try {
      console.log('AuthContext: Logout initiated');
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
      console.log('AuthContext: Manual refresh initiated');
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
    manualAuthCheck,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
