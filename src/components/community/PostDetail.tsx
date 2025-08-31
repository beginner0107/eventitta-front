'use client';

import { useGetPost } from '@/api/eventitta';
import { PostDetailContent } from './PostDetailContent';
import { CommentSection } from './CommentSection';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface PostDetailProps {
  postId: number;
}

export function PostDetail({ postId }: PostDetailProps) {
  const { data, isLoading, error, refetch } = useGetPost(postId, {
    query: {
      retry: 2,
    },
  });

  const post = data?.data;

  if (error) {
    return (
      <div className="container max-w-4xl mx-auto p-6">
        <div className="mb-6">
          <Link href="/community">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              커뮤니티로 돌아가기
            </Button>
          </Link>
        </div>

        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            게시글을 불러오는 중 오류가 발생했습니다.
            <Button variant="link" className="p-0 ml-1 h-auto" onClick={() => refetch()}>
              다시 시도
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container max-w-4xl mx-auto p-6">
        <div className="mb-6">
          <Skeleton className="h-9 w-40" />
        </div>

        <div className="bg-white rounded-lg border p-6 mb-6">
          <Skeleton className="h-8 w-3/4 mb-4" />
          <div className="flex items-center space-x-4 mb-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
          <Skeleton className="h-32 w-full" />
        </div>

        <div className="bg-white rounded-lg border p-6">
          <Skeleton className="h-6 w-32 mb-4" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container max-w-4xl mx-auto p-6">
        <div className="mb-6">
          <Link href="/community">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              커뮤니티로 돌아가기
            </Button>
          </Link>
        </div>

        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-2">게시글을 찾을 수 없습니다</h1>
          <p className="text-muted-foreground mb-4">삭제되었거나 존재하지 않는 게시글입니다.</p>
          <Link href="/community">
            <Button>커뮤니티로 돌아가기</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <Link href="/community">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            커뮤니티로 돌아가기
          </Button>
        </Link>
      </div>

      <PostDetailContent post={post} />
      <CommentSection postId={postId} />
    </div>
  );
}
