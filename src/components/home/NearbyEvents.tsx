'use client';

import Link from 'next/link';
import { Calendar, MapPin, DollarSign, AlertCircle, ExternalLink } from 'lucide-react';
import { useGetNearbyEvents } from '@/api/eventitta';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useState, useEffect } from 'react';

// 서울 시청 좌표를 기본값으로 사용
const DEFAULT_LOCATION = {
  latitude: 37.5665,
  longitude: 126.978,
};

function formatDate(dateString?: string) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function LoadingSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="animate-pulse">
          <CardHeader>
            <div className="h-5 bg-muted rounded w-3/4" />
            <div className="h-4 bg-muted rounded w-1/2" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded" />
              <div className="h-4 bg-muted rounded w-2/3" />
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
        <CardTitle className="mb-2">이벤트를 불러올 수 없습니다</CardTitle>
        <CardDescription className="mb-4">
          위치 정보를 확인하거나 네트워크 연결을 확인해주세요.
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
        <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <CardTitle className="mb-2">주변에 진행 중인 이벤트가 없습니다</CardTitle>
        <CardDescription className="mb-6">
          다른 지역의 이벤트를 확인하거나 검색 범위를 넓혀보세요.
        </CardDescription>
        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          <Link href="/events">
            <Button variant="outline">모든 이벤트 보기</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export function NearbyEvents() {
  const [location, setLocation] = useState(DEFAULT_LOCATION);
  const [hasLocationPermission, setHasLocationPermission] = useState(false);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setHasLocationPermission(true);
        },
        (error) => {
          console.warn('Geolocation permission denied or error:', error);
          // 기본 위치 사용
          setHasLocationPermission(false);
        },
        { timeout: 10000 },
      );
    }
  }, []);

  const { data, isLoading, error, refetch } = useGetNearbyEvents(
    {
      latitude: location.latitude,
      longitude: location.longitude,
      distanceKm: 10.0, // 10km 반경
      page: 0,
      size: 6,
    },
    {
      query: {
        enabled: true,
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

  if (isLoading) {
    return (
      <section className="py-12">
        <div className="container max-w-6xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-8">
            <Calendar className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">주변 이벤트 & 축제</h2>
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
            <Calendar className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">주변 이벤트 & 축제</h2>
            <div className="flex-1 h-px bg-border" />
          </div>
          <ErrorState onRetry={refetch} />
        </div>
      </section>
    );
  }

  const events = data?.data?.content ?? [];

  if (!events.length) {
    return (
      <section className="py-12">
        <div className="container max-w-6xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-8">
            <Calendar className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">주변 이벤트 & 축제</h2>
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
            <Calendar className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">주변 이벤트 & 축제</h2>
            {!hasLocationPermission && (
              <Badge variant="secondary" className="text-xs">
                기본 지역
              </Badge>
            )}
          </div>
          <Link href="/events">
            <Button variant="ghost" className="text-primary">
              전체 보기 →
            </Button>
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {events.slice(0, 6).map((event: any) => (
            <Card key={event.id} className="h-full hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-lg line-clamp-2 flex-1" title={event.title}>
                    {event.title}
                  </CardTitle>
                  {event.isFree ? (
                    <Badge variant="secondary" className="text-xs">
                      무료
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-xs">
                      유료
                    </Badge>
                  )}
                </div>
              </CardHeader>

              <CardContent className="pt-0 space-y-3">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="truncate">
                    {formatDate(event.startTime)} - {formatDate(event.endTime)}
                  </span>
                </div>

                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="truncate" title={event.place}>
                    {event.place || '장소 미정'}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2">
                    {event.category && (
                      <Badge variant="outline" className="text-xs">
                        {event.category}
                      </Badge>
                    )}
                  </div>

                  {event.distance && (
                    <div className="text-xs text-muted-foreground">
                      {event.distance.toFixed(1)}km
                    </div>
                  )}
                </div>

                {event.homepageUrl && (
                  <div className="pt-2">
                    <a
                      href={event.homepageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-primary hover:underline text-sm"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      자세히 보기
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link href="/events">
            <Button size="lg" variant="outline">
              더 많은 이벤트 보기
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
