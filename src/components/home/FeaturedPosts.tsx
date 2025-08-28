'use client';

import Link from 'next/link';
import { MessageSquare, Heart, AlertCircle, Calendar, User } from 'lucide-react';
import { useGetPosts } from '@/api/eventitta';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

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
        <CardTitle className="mb-2">커뮤니티 글을 불러올 수 없습니다</CardTitle>
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
        <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <CardTitle className="mb-2">등록된 글이 없습니다</CardTitle>
        <CardDescription className="mb-6">
          지역 커뮤니티의 첫 번째 글을 작성해보세요!
        </CardDescription>
        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          <Button>글 작성하기</Button>
          <Link href="/community">
            <Button variant="outline">커뮤니티 보기</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export function FeaturedPosts() {
  const { data, isLoading, error, refetch } = useGetPosts(
    {
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
      <section className="py-12 bg-muted/30">
        <div className="container max-w-6xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-8">
            <MessageSquare className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">지역 커뮤니티</h2>
            <div className="flex-1 h-px bg-border" />
          </div>
          <LoadingSkeleton />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-12 bg-muted/30">
        <div className="container max-w-6xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-8">
            <MessageSquare className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">지역 커뮤니티</h2>
            <div className="flex-1 h-px bg-border" />
          </div>
          <ErrorState onRetry={refetch} />
        </div>
      </section>
    );
  }

  const posts = data?.data?.content ?? [];

  if (!posts.length) {
    return (
      <section className="py-12 bg-muted/30">
        <div className="container max-w-6xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-8">
            <MessageSquare className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">지역 커뮤니티</h2>
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
            <MessageSquare className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">지역 커뮤니티</h2>
          </div>
          <Link href="/community">
            <Button variant="ghost" className="text-primary">
              전체 보기 →
            </Button>
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {posts.slice(0, 6).map((post: any) => (
            <Link key={post.id} href={`/community/${post.id}`}>
              <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg line-clamp-2" title={post.title}>
                    {post.title}
                  </CardTitle>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="h-3 w-3" />
                    <span>{post.authorNickname}</span>
                    <span>•</span>
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(post.createdAt)}</span>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Heart className="h-4 w-4" />
                        <span>{post.likeCount || 0}</span>
                      </div>
                      {/* <div className="flex items-center gap-1">
                        <MessageSquare className="h-4 w-4" />
                        <span>{post.commentCount || 0}</span>
                      </div> */}
                    </div>

                    <Badge variant="secondary" className="text-xs">
                      지역
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link href="/community">
            <Button size="lg" variant="outline">
              더 많은 글 보기
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
