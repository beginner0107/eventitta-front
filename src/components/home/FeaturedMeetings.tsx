'use client';

import Link from 'next/link';
import { AlertCircle, TrendingUp } from 'lucide-react';
import { useGetMeetings } from '@/api/eventitta';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MeetingCard } from './MeetingCard';
import { useAuth } from '@/contexts/AuthContext';

function LoadingSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="animate-pulse">
          <div className="w-full h-48 bg-muted rounded-t-lg" />
          <CardHeader>
            <div className="h-5 bg-muted rounded w-3/4" />
            <div className="h-4 bg-muted rounded w-1/2" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded" />
              <div className="h-4 bg-muted rounded w-2/3" />
              <div className="h-2 bg-muted rounded" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <Card className="text-center py-8">
      <CardContent>
        <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <CardTitle className="mb-2">추천 모임을 불러올 수 없습니다</CardTitle>
        <CardDescription className="mb-4">
          네트워크 오류가 발생했습니다. 다시 시도해주세요.
        </CardDescription>
        <Button onClick={onRetry} variant="outline">
          다시 시도
        </Button>
      </CardContent>
    </Card>
  );
}

function EmptyState() {
  return (
    <Card className="text-center py-12">
      <CardContent>
        <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <CardTitle className="mb-2">추천할 모임이 없습니다</CardTitle>
        <CardDescription className="mb-6">
          아직 활성화된 모임이 없습니다. 첫 번째 모임을 만들어보세요!
        </CardDescription>
        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          <Button>모임 만들기</Button>
          <Link href="/meetings">
            <Button variant="outline">모든 모임 보기</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export function FeaturedMeetings() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  // TODO: 실제 API에서 정렬 파라미터 확인 후 적용 (예: sort=popular, sort=participants_desc 등)
  const { data, isLoading, error, refetch } = useGetMeetings(
    {
      page: 0,
      size: 6,
      // sort: 'popular', // TODO: API 스펙 확인 후 적용
    },
    {
      query: {
        enabled: isAuthenticated && !authLoading,
        retry: (failureCount, error: any) => {
          // 401 에러는 재시도하지 않음 (인증 필요)
          if (error?.response?.status === 401) {
            return false;
          }
          return failureCount < 2;
        },
      },
    },
  );

  // Show placeholder content for unauthenticated users
  if (!isAuthenticated && !authLoading) {
    return (
      <section className="py-12 bg-muted/30">
        <div className="container max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold">추천 모임</h2>
            </div>
            <Link href="/auth/login">
              <Button variant="ghost" className="text-primary">
                로그인하여 모임 보기 →
              </Button>
            </Link>
          </div>

          <Card className="text-center py-12">
            <CardContent>
              <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <CardTitle className="mb-2">로그인하여 추천 모임을 확인하세요</CardTitle>
              <CardDescription className="mb-6">
                회원가입 후 관심사에 맞는 다양한 모임을 추천받을 수 있습니다.
              </CardDescription>
              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <Link href="/auth/login">
                  <Button>로그인</Button>
                </Link>
                <Link href="/auth/signup">
                  <Button variant="outline">회원가입</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  if (isLoading) {
    return (
      <section className="py-12">
        <div className="container max-w-6xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-8">
            <TrendingUp className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">추천 모임</h2>
            <div className="flex-1 h-px bg-border" />
          </div>
          <LoadingSkeleton />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-12">
        <div className="container max-w-6xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-8">
            <TrendingUp className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">추천 모임</h2>
            <div className="flex-1 h-px bg-border" />
          </div>
          <ErrorState onRetry={refetch} />
        </div>
      </section>
    );
  }

  const meetings = data?.data?.content ?? [];

  if (!meetings.length) {
    return (
      <section className="py-12">
        <div className="container max-w-6xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-8">
            <TrendingUp className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">추천 모임</h2>
            <div className="flex-1 h-px bg-border" />
          </div>
          <EmptyState />
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-muted/30">
      <div className="container max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <TrendingUp className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">추천 모임</h2>
          </div>
          <Link href="/meetings">
            <Button variant="ghost" className="text-primary">
              전체 보기 →
            </Button>
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {meetings.slice(0, 6).map((meeting: any) => (
            <MeetingCard key={meeting.id} meeting={meeting} />
          ))}
        </div>

        <div className="text-center mt-8">
          <Link href="/meetings">
            <Button size="lg">더 많은 모임 보기</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
