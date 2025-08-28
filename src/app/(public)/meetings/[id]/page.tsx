'use client';

import { useParams, useRouter } from 'next/navigation';
import { Calendar, MapPin, Users, User, ArrowLeft, AlertCircle } from 'lucide-react';
import { useGetMeetingDetail } from '@/api/eventitta';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

function formatDateTime(dateTimeString?: string) {
  if (!dateTimeString) return '';
  const date = new Date(dateTimeString);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getStatusBadge(status?: string) {
  switch (status) {
    case 'RECRUITING':
      return (
        <Badge variant="default" className="text-sm">
          모집중
        </Badge>
      );
    case 'CLOSED':
      return (
        <Badge variant="secondary" className="text-sm">
          마감
        </Badge>
      );
    case 'FINISHED':
      return (
        <Badge variant="outline" className="text-sm">
          완료
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className="text-sm">
          {status}
        </Badge>
      );
  }
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="h-10 w-20 bg-muted rounded animate-pulse" />
        <div className="flex-1">
          <div className="h-8 bg-muted rounded w-3/4 animate-pulse" />
        </div>
      </div>

      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-6 bg-muted rounded w-1/4" />
          <div className="h-4 bg-muted rounded w-full" />
          <div className="h-4 bg-muted rounded w-2/3" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="h-4 bg-muted rounded" />
          <div className="h-4 bg-muted rounded" />
          <div className="h-4 bg-muted rounded w-3/4" />
        </CardContent>
      </Card>
    </div>
  );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-2" />
        <CardTitle>모임을 찾을 수 없습니다</CardTitle>
        <CardDescription>요청하신 모임 정보를 불러오는 중 오류가 발생했습니다.</CardDescription>
      </CardHeader>
      <CardContent className="text-center space-y-2">
        <Button onClick={onRetry} variant="outline" className="w-full">
          다시 시도
        </Button>
        <Button variant="ghost" className="w-full" onClick={() => window.history.back()}>
          목록으로 돌아가기
        </Button>
      </CardContent>
    </Card>
  );
}

export default function MeetingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const meetingId = parseInt(params?.id as string);

  const {
    data: response,
    isLoading,
    error,
    refetch,
  } = useGetMeetingDetail(meetingId, {
    query: {
      enabled: !!meetingId && !isNaN(meetingId),
    },
  });

  const meeting = response?.data;

  if (isLoading) {
    return (
      <div className="container max-w-4xl mx-auto p-6">
        <LoadingSkeleton />
      </div>
    );
  }

  if (error || !meeting) {
    return (
      <div className="container max-w-4xl mx-auto p-6">
        <ErrorState onRetry={refetch} />
      </div>
    );
  }

  const isOpenForJoin =
    meeting?.status === 'RECRUITING' && (meeting?.currentMembers ?? 0) < (meeting?.maxMembers ?? 0);

  return (
    <div className="container max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4 -ml-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          목록으로 돌아가기
        </Button>

        <div className="flex items-start justify-between mb-2">
          <h1 className="text-3xl font-bold tracking-tight flex-1">{meeting?.title}</h1>
          {getStatusBadge(meeting?.status)}
        </div>

        {meeting?.description && (
          <p className="text-lg text-muted-foreground mt-2">{meeting?.description}</p>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* 주요 정보 */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                일정
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="font-medium text-sm text-muted-foreground">시작</div>
                <div className="text-lg">{formatDateTime(meeting?.startTime)}</div>
              </div>
              <div>
                <div className="font-medium text-sm text-muted-foreground">종료</div>
                <div className="text-lg">{formatDateTime(meeting?.endTime)}</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                장소
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg">{meeting?.address || '주소가 등록되지 않았습니다'}</p>
              {meeting?.latitude && meeting?.longitude && (
                <Button variant="outline" className="mt-4">
                  지도에서 보기
                </Button>
              )}
            </CardContent>
          </Card>

          {meeting?.participants && meeting.participants.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  참여자 ({meeting.participants.length}명)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {meeting.participants.map((participant: any, index: number) => (
                    <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">
                          {participant.nickname || '참여자'}
                          {participant.userId === meeting?.leaderId && (
                            <Badge variant="secondary" className="ml-2 text-xs">
                              리더
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* 사이드바 */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                모집 현황
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{meeting?.currentMembers}</div>
                <div className="text-sm text-muted-foreground">/ {meeting?.maxMembers}명</div>
              </div>

              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{
                    width: `${Math.min(100, ((meeting?.currentMembers ?? 0) / (meeting?.maxMembers ?? 1)) * 100)}%`,
                  }}
                />
              </div>

              {isOpenForJoin ? (
                <Button className="w-full" size="lg">
                  참여하기
                </Button>
              ) : (
                <Button disabled className="w-full" size="lg">
                  {meeting?.status === 'CLOSED'
                    ? '모집 마감'
                    : meeting?.status === 'RECRUITING'
                      ? '모집중'
                      : meeting?.status === 'FINISHED'
                        ? '완료된 모임'
                        : '참여 불가'}
                </Button>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                모임장
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  {meeting?.leaderProfileUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={meeting.leaderProfileUrl}
                      alt={meeting?.leaderNickname || '모임장'}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                  ) : (
                    <User className="h-6 w-6" />
                  )}
                </div>
                <div>
                  <div className="font-medium">{meeting?.leaderNickname}</div>
                  <div className="text-sm text-muted-foreground">모임장</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
