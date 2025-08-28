'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  AlertCircle,
  Eye,
  EyeOff,
  UserPlus,
  Sparkles,
  ArrowRight,
  CheckCircle,
} from 'lucide-react';
import { useSignUp } from '@/api/eventitta';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
    nickname?: string;
  }>({});

  const router = useRouter();

  const signUpMutation = useSignUp({
    mutation: {
      onSuccess: (data) => {
        // 회원가입 성공 후 로그인 페이지로 이동
        router.push('/auth/login?message=signup-success');
      },
      onError: (error: any) => {
        console.error('Signup error:', error);
        // 서버에서 반환된 에러 메시지 처리
        if (error?.response?.status === 409) {
          setErrors({
            email: '이미 사용 중인 이메일입니다.',
          });
        } else {
          setErrors({
            email: '회원가입에 실패했습니다. 다시 시도해주세요.',
          });
        }
      },
    },
  });

  const validateForm = () => {
    const newErrors: {
      email?: string;
      password?: string;
      confirmPassword?: string;
      nickname?: string;
    } = {};

    if (!email) {
      newErrors.email = '이메일을 입력해주세요.';
    } else if (!/^[\w.-]+@[\w.-]+\.[a-zA-Z]{2,6}$/.test(email)) {
      newErrors.email = '올바른 이메일 형식을 입력해주세요.';
    }

    if (!password) {
      newErrors.password = '비밀번호를 입력해주세요.';
    } else if (!/^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>]).{8,20}$/.test(password)) {
      newErrors.password = '비밀번호는 8-20자이며, 영문, 숫자, 특수문자를 포함해야 합니다.';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = '비밀번호 확인을 입력해주세요.';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';
    }

    if (!nickname) {
      newErrors.nickname = '닉네임을 입력해주세요.';
    } else if (!/^[가-힣a-zA-Z0-9]{2,20}$/.test(nickname)) {
      newErrors.nickname = '닉네임은 2-20자의 한글, 영문, 숫자만 사용 가능합니다.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    signUpMutation.mutate({
      data: {
        email,
        password,
        nickname,
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute -top-40 -right-32 w-80 h-80 rounded-full bg-gradient-to-br from-purple-400/20 to-pink-400/20 blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-32 w-80 h-80 rounded-full bg-gradient-to-br from-blue-400/20 to-indigo-400/20 blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 right-1/3 w-64 h-64 rounded-full bg-gradient-to-br from-pink-300/10 to-rose-300/10 blur-3xl animate-bounce"></div>
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
          <p className="text-gray-600 text-lg font-medium mb-3">
            새로운 모임과 만남을 시작해보세요
          </p>
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-pink-100 to-rose-100 text-pink-700 rounded-full text-sm font-semibold">
            <CheckCircle className="w-4 h-4 mr-2" />
            무료 가입, 언제나 이용 가능
          </div>
        </div>

        <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-md hover:shadow-3xl transition-all duration-300 hover:bg-white/90">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto mb-4 p-4 bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl w-fit shadow-lg">
              <UserPlus className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900 mb-2">회원가입</CardTitle>
            <CardDescription className="text-base text-gray-600">
              계정을 만들어 이벤트있다의 모든 기능을 이용하세요
            </CardDescription>
          </CardHeader>

          <CardContent className="px-6 pb-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">이메일 *</Label>
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
                  className={`h-12 px-4 border-2 rounded-xl transition-all duration-300 focus:ring-4 focus:ring-pink-500/20 ${errors.email ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-pink-300 focus:border-pink-500'}`}
                  disabled={signUpMutation.isPending}
                />
                {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="nickname">닉네임 *</Label>
                <Input
                  id="nickname"
                  type="text"
                  placeholder="닉네임을 입력하세요"
                  value={nickname}
                  onChange={(e) => {
                    setNickname(e.target.value);
                    if (errors.nickname) {
                      setErrors((prev) => ({ ...prev, nickname: undefined }));
                    }
                  }}
                  className={`h-12 px-4 border-2 rounded-xl transition-all duration-300 focus:ring-4 focus:ring-purple-500/20 ${errors.nickname ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-purple-300 focus:border-purple-500'}`}
                  disabled={signUpMutation.isPending}
                />
                {errors.nickname && <p className="text-sm text-destructive">{errors.nickname}</p>}
                <p className="text-xs text-muted-foreground">
                  2-20자의 한글, 영문, 숫자만 사용 가능
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">비밀번호 *</Label>
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
                    disabled={signUpMutation.isPending}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-10 w-10 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={signUpMutation.isPending}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-500" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-500" />
                    )}
                  </Button>
                </div>
                {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                <p className="text-xs text-muted-foreground">8-20자, 영문, 숫자, 특수문자 포함</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">비밀번호 확인 *</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="비밀번호를 다시 입력하세요"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (errors.confirmPassword) {
                        setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
                      }
                    }}
                    className={`h-12 px-4 pr-12 border-2 rounded-xl transition-all duration-300 focus:ring-4 focus:ring-purple-500/20 ${errors.confirmPassword ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-purple-300 focus:border-purple-500'}`}
                    disabled={signUpMutation.isPending}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-10 w-10 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={signUpMutation.isPending}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-500" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-500" />
                    )}
                  </Button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-destructive">{errors.confirmPassword}</p>
                )}
              </div>

              {signUpMutation.error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    회원가입에 실패했습니다. 입력 정보를 확인해주세요.
                  </AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none group"
                disabled={signUpMutation.isPending}
              >
                {signUpMutation.isPending ? (
                  <div className="flex items-center">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                    가입 중...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    회원가입
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                  </div>
                )}
              </Button>
            </form>

            <div className="mt-6">
              <Separator className="my-6" />
              <div className="text-center space-y-4">
                <p className="text-gray-600 font-medium">이미 계정이 있으신가요?</p>
                <Link href="/auth/login">
                  <Button
                    variant="outline"
                    className="w-full h-12 border-2 border-gray-300 hover:border-indigo-400 hover:bg-indigo-50 text-gray-700 hover:text-indigo-700 font-semibold rounded-xl transition-all duration-300 hover:scale-105 group"
                  >
                    <div className="flex items-center justify-center">
                      로그인
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
