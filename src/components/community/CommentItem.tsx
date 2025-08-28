'use client';

import { useState } from 'react';
import { CommentWithChildrenDto, useUpdateComment, useDeleteComment } from '@/api/eventitta';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { CommentForm } from './CommentForm';
import { User, MessageSquare, Edit, Trash2, Calendar } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

// Simple date formatter helper (reused)
function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInMinutes < 1) return '방금 전';
  if (diffInMinutes < 60) return `${diffInMinutes}분 전`;
  if (diffInHours < 24) return `${diffInHours}시간 전`;
  if (diffInDays < 30) return `${diffInDays}일 전`;

  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

interface CommentItemProps {
  comment: CommentWithChildrenDto;
  postId: number;
  isChild?: boolean;
}

export function CommentItem({ comment, postId, isChild = false }: CommentItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const queryClient = useQueryClient();

  const updateCommentMutation = useUpdateComment({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [`/api/v1/posts/${postId}/comments`],
        });
        setIsEditing(false);
      },
      onError: (error) => {
        console.error('Failed to update comment:', error);
      },
    },
  });

  const deleteCommentMutation = useDeleteComment({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [`/api/v1/posts/${postId}/comments`],
        });
        // Also invalidate post data to update comment count
        queryClient.invalidateQueries({
          queryKey: [`/api/v1/posts/${postId}`],
        });
      },
      onError: (error) => {
        console.error('Failed to delete comment:', error);
      },
    },
  });

  const handleUpdateComment = (content: string) => {
    if (!comment.id) return;

    updateCommentMutation.mutate({
      postId,
      commentId: comment.id,
      data: { content },
    });
  };

  const handleDeleteComment = () => {
    if (!comment.id) return;

    if (confirm('댓글을 삭제하시겠습니까?')) {
      deleteCommentMutation.mutate({
        postId,
        commentId: comment.id,
      });
    }
  };

  const formattedDate = comment.createdAt ? formatTimeAgo(comment.createdAt) : '';

  if (comment.deleted) {
    return (
      <div className={`flex space-x-3 ${isChild ? 'ml-8' : ''}`}>
        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
          <User className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="flex-1">
          <div className="bg-muted/50 rounded-lg p-3">
            <p className="text-muted-foreground text-sm italic">삭제된 댓글입니다.</p>
          </div>

          {/* Show child comments even if parent is deleted */}
          {comment.children && comment.children.length > 0 && (
            <div className="mt-3 space-y-3">
              {comment.children.map((child) => (
                <CommentItem
                  key={child.id}
                  comment={{
                    ...child,
                    children: [], // Child comments don't have nested children
                  }}
                  postId={postId}
                  isChild={true}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex space-x-3 ${isChild ? 'ml-8' : ''}`}>
      <Avatar>
        <AvatarFallback>
          <User className="h-4 w-4" />
        </AvatarFallback>
      </Avatar>

      <div className="flex-1">
        <div className="bg-muted/30 rounded-lg p-3">
          {/* Comment Header */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-sm">{comment.nickname || '익명'}</span>
              <div className="flex items-center text-xs text-muted-foreground">
                <Calendar className="h-3 w-3 mr-1" />
                <span>{formattedDate}</span>
              </div>
            </div>

            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="h-6 px-2 text-xs"
              >
                <Edit className="h-3 w-3 mr-1" />
                수정
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDeleteComment}
                className="h-6 px-2 text-xs text-destructive hover:text-destructive"
                disabled={deleteCommentMutation.isPending}
              >
                <Trash2 className="h-3 w-3 mr-1" />
                삭제
              </Button>
            </div>
          </div>

          {/* Comment Content */}
          {isEditing ? (
            <CommentForm
              initialContent={comment.content || ''}
              onSubmit={handleUpdateComment}
              onCancel={() => setIsEditing(false)}
              isSubmitting={updateCommentMutation.isPending}
              submitLabel="수정"
              placeholder="댓글을 수정하세요..."
            />
          ) : (
            <div>
              <p className="text-sm whitespace-pre-wrap leading-relaxed">
                {comment.content || '내용이 없습니다.'}
              </p>

              {/* Reply Button - Only for parent comments */}
              {!isChild && (
                <div className="mt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowReplyForm(!showReplyForm)}
                    className="h-6 px-2 text-xs"
                  >
                    <MessageSquare className="h-3 w-3 mr-1" />
                    답글
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Reply Form */}
        {showReplyForm && !isChild && (
          <div className="mt-3 ml-4">
            <CommentForm
              onSubmit={(content) => {
                // For now, we'll treat replies as regular comments
                // In a real implementation, you'd have a separate API for replies
                console.log('Reply to comment:', comment.id, content);
                setShowReplyForm(false);
              }}
              onCancel={() => setShowReplyForm(false)}
              isSubmitting={false}
              placeholder="답글을 입력하세요..."
              submitLabel="답글 작성"
            />
          </div>
        )}

        {/* Child Comments */}
        {comment.children && comment.children.length > 0 && (
          <div className="mt-3 space-y-3">
            {comment.children.map((child) => (
              <CommentItem
                key={child.id}
                comment={{
                  ...child,
                  children: [], // Child comments don't have nested children
                }}
                postId={postId}
                isChild={true}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
