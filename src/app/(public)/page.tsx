'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Calendar,
  Users,
  MapPin,
  Star,
  TrendingUp,
  ArrowRight,
  MessageSquare,
  Sparkles,
  Shield,
  Globe,
  Clock,
  Heart,
  ChevronRight,
  Bug,
} from 'lucide-react';
import { SearchBar } from '@/components/home/SearchBar';
import { FeaturedMeetings } from '@/components/home/FeaturedMeetings';
import { LatestMeetings } from '@/components/home/LatestMeetings';
import { CategoryChips } from '@/components/home/CategoryChips';
import { FeaturedPosts } from '@/components/home/FeaturedPosts';
import { NearbyEvents } from '@/components/home/NearbyEvents';
import { useAuth } from '@/contexts/AuthContext';

export default function HomePage() {
  const { manualAuthCheck } = useAuth();
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-80 h-80 rounded-full bg-gradient-to-br from-purple-400/20 to-pink-400/20 blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-32 w-80 h-80 rounded-full bg-gradient-to-br from-blue-400/20 to-indigo-400/20 blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-gradient-to-br from-indigo-300/10 to-purple-300/10 blur-3xl animate-ping"></div>
      </div>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Modern mesh gradient background */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/5 to-pink-500/10"></div>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
            radial-gradient(circle at 20% 20%, rgba(139, 92, 246, 0.1) 0px, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(236, 72, 153, 0.1) 0px, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(99, 102, 241, 0.1) 0px, transparent 50%)
          `,
          }}
        ></div>

        <div className="relative py-16 px-6">
          <div className="container max-w-7xl mx-auto">
            {/* Main Hero Content */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 px-6 py-3 rounded-full text-sm font-semibold mb-8 border border-indigo-200/50 shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-300 relative">
                <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                지역 기반 소셜 플랫폼
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/20 to-purple-400/20 rounded-full blur animate-pulse"></div>
              </div>

              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 relative">
                <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  이벤트있다
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent blur-lg opacity-30 animate-pulse"></div>
              </h1>

              <p className="text-xl md:text-3xl text-gray-700 mb-12 max-w-4xl mx-auto leading-relaxed font-light">
                우리 동네에서 만나는{' '}
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent font-semibold">
                  새로운 사람들
                </span>
                과{' '}
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent font-semibold">
                  특별한 경험
                </span>
              </p>

              {/* Search Bar */}
              <div className="max-w-2xl mx-auto mb-12">
                <SearchBar />
              </div>
            </div>

            {/* Quick Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto mb-20">
              <div className="bg-white/70 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-white/20 text-center hover:shadow-2xl hover:bg-white/80 hover:scale-105 transition-all duration-300 group">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:rotate-6 transition-transform duration-300">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  1,200+
                </div>
                <div className="text-sm text-gray-600 font-medium">활성 모임</div>
              </div>
              <div className="bg-white/70 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-white/20 text-center hover:shadow-2xl hover:bg-white/80 hover:scale-105 transition-all duration-300 group">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:rotate-6 transition-transform duration-300">
                  <MessageSquare className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                  5,000+
                </div>
                <div className="text-sm text-gray-600 font-medium">커뮤니티 글</div>
              </div>
              <div className="bg-white/70 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-white/20 text-center hover:shadow-2xl hover:bg-white/80 hover:scale-105 transition-all duration-300 group">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:rotate-6 transition-transform duration-300">
                  <Calendar className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent mb-2">
                  300+
                </div>
                <div className="text-sm text-gray-600 font-medium">지역 이벤트</div>
              </div>
              <div className="bg-white/70 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-white/20 text-center hover:shadow-2xl hover:bg-white/80 hover:scale-105 transition-all duration-300 group">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:rotate-6 transition-transform duration-300">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
                  15,000+
                </div>
                <div className="text-sm text-gray-600 font-medium">활성 사용자</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="bg-white">
        {/* Featured Meetings Section */}
        <FeaturedMeetings />

        {/* Featured Posts (Community) Section */}
        <FeaturedPosts />

        {/* Nearby Events Section */}
        <NearbyEvents />

        {/* Categories Section */}
        <CategoryChips />

        {/* Latest Meetings Section */}
        <LatestMeetings />
      </div>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="container max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              이벤트있다가 특별한 이유
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              지역 기반 종합 소셜 플랫폼으로 모임, 커뮤니티, 이벤트를 한 곳에서
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
              <CardHeader className="pb-4">
                <div className="mx-auto mb-4 p-4 bg-blue-100 rounded-full w-fit">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-lg text-gray-900">모임 관리</CardTitle>
                <CardDescription className="text-sm text-gray-500">
                  쉬운 모임 생성과 참여자 관리
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
              <CardHeader className="pb-4">
                <div className="mx-auto mb-4 p-4 bg-blue-100 rounded-full w-fit">
                  <MessageSquare className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-lg text-gray-900">지역 커뮤니티</CardTitle>
                <CardDescription className="text-sm text-gray-500">
                  동네 이웃과 소통하고 정보 공유
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
              <CardHeader className="pb-4">
                <div className="mx-auto mb-4 p-4 bg-blue-100 rounded-full w-fit">
                  <Sparkles className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-lg text-gray-900">지역 이벤트</CardTitle>
                <CardDescription className="text-sm text-gray-500">
                  주변 축제와 이벤트 정보
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
              <CardHeader className="pb-4">
                <div className="mx-auto mb-4 p-4 bg-blue-100 rounded-full w-fit">
                  <Shield className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-lg text-gray-900">안전한 환경</CardTitle>
                <CardDescription className="text-sm text-gray-500">
                  검증된 사용자와 안전한 만남
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="container max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">사용자들의 후기</h2>
            <p className="text-lg text-gray-600">
              이벤트있다를 통해 새로운 경험을 하고 있는 분들의 이야기입니다
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <Card className="p-8 border border-blue-100 hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-0">
                <div className="flex items-center mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                  &ldquo;정말 다양한 모임들이 있어서 매주 새로운 경험을 할 수 있어요. 인터페이스도
                  직관적이고 사용하기 편해서 자주 이용하고 있습니다.&rdquo;
                </p>
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">김민수</div>
                    <div className="text-sm text-gray-500">IT 직장인</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="p-8 border border-blue-100 hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-0">
                <div className="flex items-center mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                  &ldquo;새로운 도시로 이사 온 후 친구를 만들기 어려웠는데, 이벤트있다를 통해 좋은
                  사람들을 많이 만날 수 있었어요. 감사합니다!&rdquo;
                </p>
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">박지영</div>
                    <div className="text-sm text-gray-500">디자이너</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="container max-w-4xl mx-auto px-6 text-center">
          <div className="bg-white/10 rounded-full p-4 w-fit mx-auto mb-8">
            <Globe className="h-16 w-16 text-white" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            지역 소셜 플랫폼의 새로운 시작
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            모임, 커뮤니티, 이벤트가 모두 한 곳에. 지역 기반 소셜 네트워킹의 완전한 경험을
            만나보세요.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
            <Link href="/meetings">
              <Button
                size="lg"
                className="w-full bg-white text-blue-600 hover:bg-blue-50 font-medium"
              >
                <Users className="w-5 h-5 mr-2" />
                모임 참여하기
              </Button>
            </Link>
            <Link href="/community">
              <Button
                size="lg"
                variant="outline"
                className="w-full border-white/50 bg-white/10 backdrop-blur-sm text-white hover:bg-white hover:text-purple-700 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <MessageSquare className="w-5 h-5 mr-2" />
                커뮤니티 보기
              </Button>
            </Link>
            <Link href="/events">
              <Button
                size="lg"
                variant="outline"
                className="w-full border-white/50 bg-white/10 backdrop-blur-sm text-white hover:bg-white hover:text-pink-700 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <Calendar className="w-5 h-5 mr-2" />
                이벤트 둘러보기
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
