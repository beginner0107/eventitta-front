'use client';

import Link from 'next/link';
import { AlertCircle, Clock } from 'lucide-react';
import { useGetMeetings } from '@/api/eventitta';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MeetingCard } from './MeetingCard';

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
        <CardTitle className="mb-2">최신 모임을 불러올 수 없습니다</CardTitle>
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
        <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <CardTitle className="mb-2">새로운 모임이 없습니다</CardTitle>
        <CardDescription className="mb-6">
          아직 등록된 모임이 없습니다. 첫 번째 모임을 만들어보세요!
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

export function LatestMeetings() {
  // TODO: 실제 API에서 정렬 파라미터 확인 후 적용 (예: sort=createdAt_desc, sort=startTime_desc 등)
  const { data, isLoading, error, refetch } = useGetMeetings({
    page: 0,
    size: 6,
    // sort: 'createdAt_desc', // TODO: API 스펙 확인 후 적용
  });

  if (isLoading) {
    return (
      <section className="py-12">
        <div className="container max-w-6xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-8">
            <Clock className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">최신 모임</h2>
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
            <Clock className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">최신 모임</h2>
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
            <Clock className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">최신 모임</h2>
            <div className="flex-1 h-px bg-border" />
          </div>
          <EmptyState />
        </div>
      </section>
    );
  }

  return (
    <section className="py-12">
      <div className="container max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Clock className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">최신 모임</h2>
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
            <Button size="lg" variant="outline">
              모든 모임 보기
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
