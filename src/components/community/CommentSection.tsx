'use client';

import { useState } from 'react';
import { useGetComments, useWriteComment } from '@/api/eventitta';
import { CommentItem } from './CommentItem';
import { CommentForm } from './CommentForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { MessageSquare, AlertCircle } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

interface CommentSectionProps {
  postId: number;
}

export function CommentSection({ postId }: CommentSectionProps) {
  const [showCommentForm, setShowCommentForm] = useState(false);
  const queryClient = useQueryClient();

  const {
    data,
    isLoading: commentsLoading,
    error: commentsError,
    refetch: refetchComments,
  } = useGetComments(postId, {
    query: {
      retry: 2,
      staleTime: 1000 * 60, // 1 minute
    },
  });

  const writeCommentMutation = useWriteComment({
    mutation: {
      onSuccess: () => {
        // Invalidate and refetch comments
        queryClient.invalidateQueries({
          queryKey: [`/api/v1/posts/${postId}/comments`],
        });
        // Also invalidate post data to update comment count
        queryClient.invalidateQueries({
          queryKey: [`/api/v1/posts/${postId}`],
        });
        setShowCommentForm(false);
      },
      onError: (error) => {
        console.error('Failed to write comment:', error);
      },
    },
  });

  const comments = data?.data || [];

  const handleCommentSubmit = (content: string) => {
    writeCommentMutation.mutate({
      postId,
      data: { content },
    });
  };

  if (commentsError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MessageSquare className="h-5 w-5 mr-2" />
            댓글
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              댓글을 불러오는 중 오류가 발생했습니다.
              <Button variant="link" className="p-0 ml-1 h-auto" onClick={() => refetchComments()}>
                다시 시도
              </Button>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <MessageSquare className="h-5 w-5 mr-2" />
            댓글 ({comments.length})
          </CardTitle>

          {!showCommentForm && (
            <Button onClick={() => setShowCommentForm(true)} size="sm">
              댓글 작성
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Comment Form */}
        {showCommentForm && (
          <div className="border rounded-lg p-4 bg-muted/30">
            <CommentForm
              onSubmit={handleCommentSubmit}
              onCancel={() => setShowCommentForm(false)}
              isSubmitting={writeCommentMutation.isPending}
              placeholder="댓글을 입력하세요..."
            />
          </div>
        )}

        {/* Comments List */}
        {commentsLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="flex space-x-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-16 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">첫 번째 댓글을 작성해보세요!</p>
            {!showCommentForm && (
              <Button onClick={() => setShowCommentForm(true)} className="mt-2" variant="outline">
                댓글 작성하기
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <CommentItem key={comment.id} comment={comment} postId={postId} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
