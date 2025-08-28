'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, Eye, EyeOff, LogIn, Sparkles, ArrowRight } from 'lucide-react';
import { useLogin, useGetMyProfile } from '@/api/eventitta';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const router = useRouter();
  const queryClient = useQueryClient();
  const { login, refresh } = useAuth();

  // 프로필 조회 훅 (수동 실행)
  const { refetch: fetchProfile } = useGetMyProfile({
    query: {
      enabled: false, // 수동으로 실행
      retry: false,
    },
  });

  const loginMutation = useLogin({
    mutation: {
      onSuccess: async () => {
        try {
          // 로그인 성공 후 즉시 프로필을 조회하고 AuthContext 업데이트
          const profileResult = await fetchProfile();

          if (profileResult.data?.data) {
            // AuthContext에 사용자 데이터 설정
            login(profileResult.data.data);

            // 모든 쿼리 무효화하여 새로운 인증 상태로 리프레시
            queryClient.invalidateQueries();

            // 리다이렉트
            const from = new URLSearchParams(window.location.search).get('from') || '/';
            router.push(from);
          } else {
            // 프로필 조회 실패 시 토큰 리프레시 시도
            await refresh();
            const from = new URLSearchParams(window.location.search).get('from') || '/';
            router.push(from);
          }
        } catch (error) {
          console.error('Profile fetch failed after login:', error);
          // 프로필 조회 실패해도 리다이렉트 (AuthContext의 초기화 로직이 처리)
          const from = new URLSearchParams(window.location.search).get('from') || '/';
          router.push(from);
        }
      },
      onError: (error: any) => {
        console.error('Login error:', error);
        setErrors({
          email: '이메일 또는 비밀번호가 올바르지 않습니다.',
        });
      },
    },
  });

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email) {
      newErrors.email = '이메일을 입력해주세요.';
    } else if (!/^[\w.-]+@[\w.-]+\.[a-zA-Z]{2,6}$/.test(email)) {
      newErrors.email = '올바른 이메일 형식을 입력해주세요.';
    }

    if (!password) {
      newErrors.password = '비밀번호를 입력해주세요.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    loginMutation.mutate({
      data: {
        email,
        password,
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute -top-40 -right-32 w-80 h-80 rounded-full bg-gradient-to-br from-purple-400/20 to-pink-400/20 blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-32 w-80 h-80 rounded-full bg-gradient-to-br from-blue-400/20 to-indigo-400/20 blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 left-1/3 w-64 h-64 rounded-full bg-gradient-to-br from-indigo-300/10 to-purple-300/10 blur-3xl animate-bounce"></div>
      </div>
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-10">
          <Link href="/" className="inline-block group">
            <div className="relative">
              <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3 group-hover:scale-105 transition-transform duration-300">
                이벤트있다
              </h1>
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent blur-lg opacity-30 animate-pulse"></div>
            </div>
          </Link>
          <p className="text-gray-600 text-lg font-medium">로그인하여 다양한 모임에 참여해보세요</p>
          <div className="inline-flex items-center mt-3 px-4 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 rounded-full text-sm font-semibold">
            <Sparkles className="w-4 h-4 mr-2 animate-spin" />
            새로운 만남이 기다리고 있어요
          </div>
        </div>

        <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-md hover:shadow-3xl transition-all duration-300 hover:bg-white/90">
          <CardHeader className="text-center pb-8">
            <div className="mx-auto mb-4 p-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl w-fit shadow-lg">
              <LogIn className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900 mb-2">로그인</CardTitle>
            <CardDescription className="text-base text-gray-600">
              계정에 로그인하여 이벤트있다의 모든 기능을 이용하세요
            </CardDescription>
          </CardHeader>

          <CardContent className="px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">이메일</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="이메일을 입력하세요"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) {
                      setErrors((prev) => ({ ...prev, email: undefined }));
                    }
                  }}
                  className={`h-12 px-4 border-2 rounded-xl transition-all duration-300 focus:ring-4 focus:ring-indigo-500/20 ${errors.email ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-indigo-300 focus:border-indigo-500'}`}
                  disabled={loginMutation.isPending}
                />
                {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">비밀번호</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="비밀번호를 입력하세요"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) {
                        setErrors((prev) => ({ ...prev, password: undefined }));
                      }
                    }}
                    className={`h-12 px-4 pr-12 border-2 rounded-xl transition-all duration-300 focus:ring-4 focus:ring-indigo-500/20 ${errors.password ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-indigo-300 focus:border-indigo-500'}`}
                    disabled={loginMutation.isPending}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-10 w-10 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loginMutation.isPending}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-500" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-500" />
                    )}
                  </Button>
                </div>
                {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
              </div>

              {loginMutation.error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.
                  </AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none group"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? (
                  <div className="flex items-center">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                    로그인 중...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    로그인
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                  </div>
                )}
              </Button>
            </form>

            <div className="mt-8">
              <Separator className="my-6" />
              <div className="text-center space-y-4">
                <p className="text-gray-600 font-medium">아직 계정이 없으신가요?</p>
                <Link href="/auth/signup">
                  <Button
                    variant="outline"
                    className="w-full h-12 border-2 border-gray-300 hover:border-purple-400 hover:bg-purple-50 text-gray-700 hover:text-purple-700 font-semibold rounded-xl transition-all duration-300 hover:scale-105 group"
                  >
                    <div className="flex items-center justify-center">
                      회원가입
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                    </div>
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-8">
          <Link
            href="/"
            className="inline-flex items-center text-gray-600 hover:text-indigo-600 font-medium transition-colors duration-200 group"
          >
            <ArrowRight className="w-4 h-4 mr-2 rotate-180 group-hover:-translate-x-1 transition-transform duration-200" />
            메인으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}
