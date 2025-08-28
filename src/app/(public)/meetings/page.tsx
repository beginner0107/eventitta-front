'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Calendar, MapPin, Users, Loader2, AlertCircle } from 'lucide-react';
import { useGetMeetings } from '@/api/eventitta';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

function formatDateTime(dateTimeString?: string) {
  if (!dateTimeString) return '';
  const date = new Date(dateTimeString);
  return date.toLocaleDateString('ko-KR', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getStatusBadge(status?: string) {
  switch (status) {
    case 'OPEN':
      return <Badge variant="default">모집중</Badge>;
    case 'CLOSED':
      return <Badge variant="secondary">마감</Badge>;
    case 'CANCELLED':
      return <Badge variant="destructive">취소됨</Badge>;
    case 'COMPLETED':
      return <Badge variant="outline">완료</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

function LoadingSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="animate-pulse">
          <CardHeader>
            <div className="h-6 bg-muted rounded w-3/4" />
            <div className="h-4 bg-muted rounded w-1/2" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded" />
              <div className="h-4 bg-muted rounded w-2/3" />
              <div className="h-4 bg-muted rounded w-1/2" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-2" />
        <CardTitle>데이터를 불러올 수 없습니다</CardTitle>
        <CardDescription>모임 목록을 가져오는 중 오류가 발생했습니다.</CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        <Button onClick={onRetry} variant="outline">
          다시 시도
        </Button>
      </CardContent>
    </Card>
  );
}

function EmptyState() {
  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <Users className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
        <CardTitle>모임이 없습니다</CardTitle>
        <CardDescription>아직 등록된 모임이 없습니다. 새로운 모임을 만들어보세요!</CardDescription>
      </CardHeader>
    </Card>
  );
}

export default function MeetingsPage() {
  const [page, setPage] = useState(0);
  const { data, isLoading, error, refetch, isFetching } = useGetMeetings({
    page,
    size: 10,
  });

  if (isLoading) {
    return (
      <div className="container max-w-4xl mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">모임 목록</h1>
          <p className="text-muted-foreground mt-2">관심있는 모임을 찾아 참여해보세요</p>
        </div>
        <LoadingSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container max-w-4xl mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">모임 목록</h1>
        </div>
        <ErrorState onRetry={refetch} />
      </div>
    );
  }

  const meetings = data?.data?.content ?? [];
  const totalPages = data?.data?.totalPages ?? 1;
  const hasNextPage = page < totalPages - 1;

  if (!meetings.length) {
    return (
      <div className="container max-w-4xl mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">모임 목록</h1>
          <p className="text-muted-foreground mt-2">관심있는 모임을 찾아 참여해보세요</p>
        </div>
        <EmptyState />
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">모임 목록</h1>
        <p className="text-muted-foreground mt-2">
          총 {data?.data?.totalElements}개의 모임이 있습니다
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 mb-8">
        {meetings.map((meeting: any) => (
          <Link key={meeting.id} href={`/meetings/${meeting.id}`}>
            <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-1">{meeting.title}</CardTitle>
                    <CardDescription className="mt-1 line-clamp-2">
                      {meeting.description || '설명이 없습니다'}
                    </CardDescription>
                  </div>
                  {getStatusBadge(meeting.status)}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-2" />
                  {formatDateTime(meeting.startTime)} - {formatDateTime(meeting.endTime)}
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-2" />
                  {meeting.address || '주소 미정'}
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-muted-foreground">
                    <Users className="h-4 w-4 mr-2" />
                    {meeting.currentMembers}/{meeting.maxMembers}명
                  </div>
                  <div className="text-muted-foreground text-xs">by {meeting.leaderNickname}</div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-2">
        <Button
          variant="outline"
          onClick={() => setPage((p) => Math.max(0, p - 1))}
          disabled={page === 0 || isFetching}
        >
          이전
        </Button>
        <span className="text-sm text-muted-foreground px-4">
          {page + 1} / {totalPages}
        </span>
        <Button
          variant="outline"
          onClick={() => setPage((p) => p + 1)}
          disabled={!hasNextPage || isFetching}
        >
          {isFetching ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
          다음
        </Button>
      </div>
    </div>
  );
}
