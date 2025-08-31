'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import {
  PostDetailDto,
  useDelete,
  useLike,
  useLikedPosts,
  getGetPostQueryKey,
  getLikedPostsQueryKey,
} from '@/api/eventitta';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Heart,
  MessageSquare,
  MapPin,
  Calendar,
  User,
  Edit,
  Trash2,
  AlertTriangle,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { RegionName } from '@/components/region/RegionDisplay';

// Simple date formatter helper (reused from PostCard)
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

interface PostDetailContentProps {
  post: PostDetailDto;
}

export function PostDetailContent({ post }: PostDetailContentProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const formattedDate = post.createdAt ? formatTimeAgo(post.createdAt) : '';
  const updatedDate =
    post.updatedAt && post.updatedAt !== post.createdAt ? formatTimeAgo(post.updatedAt) : null;

  // Author verification using the authorId from the API
  const isAuthor = Boolean(user?.id && post.authorId && user.id === post.authorId);

  const deletePostMutation = useDelete({
    mutation: {
      onSuccess: () => {
        // Invalidate posts list queries to refresh the data
        queryClient.invalidateQueries({
          predicate: (query) => query.queryKey[0] === '/api/v1/posts',
        });

        router.push('/community');
      },
      onError: (error: any) => {
        console.error('Failed to delete post:', error);
        setDeleteError('게시글 삭제에 실패했습니다. 다시 시도해주세요.');
      },
    },
  });

  // Get user's liked posts to determine current like status
  const { data: likedPostsData } = useLikedPosts({
    query: {
      staleTime: 1000 * 60 * 2, // 2 minutes
      retry: 1,
      enabled: !!user, // Only fetch when user is authenticated
    },
  });

  // Check if current post is in user's liked posts
  const isLiked = likedPostsData?.data?.some((likedPost) => likedPost.id === post.id) || false;

  // Like toggle mutation with optimistic updates
  const likeMutation = useLike({
    mutation: {
      onMutate: async () => {
        // Cancel outgoing refetches to prevent race conditions
        await queryClient.cancelQueries({ queryKey: getGetPostQueryKey(post.id) });
        await queryClient.cancelQueries({ queryKey: getLikedPostsQueryKey() });

        // Snapshot previous values
        const previousPost = queryClient.getQueryData(getGetPostQueryKey(post.id));
        const previousLikedPosts = queryClient.getQueryData(getLikedPostsQueryKey());

        // Calculate optimistic updates based on current state
        const willBeLiked = !isLiked; // Toggle current state
        const newLikeCount = willBeLiked
          ? (post.likeCount || 0) + 1
          : Math.max(0, (post.likeCount || 1) - 1);

        // Optimistically update post like count
        queryClient.setQueryData(getGetPostQueryKey(post.id), (old: any) => ({
          ...old,
          data: { ...old?.data, likeCount: newLikeCount },
        }));

        // Optimistically update liked posts list
        queryClient.setQueryData(getLikedPostsQueryKey(), (old: any) => {
          if (!old?.data) return old;

          const oldData = old.data;
          let newData;

          if (willBeLiked) {
            // Add current post to liked posts if not already there
            const postExists = oldData.some((p: any) => p.id === post.id);
            newData = postExists ? oldData : [...oldData, { id: post.id, ...post }];
          } else {
            // Remove current post from liked posts
            newData = oldData.filter((p: any) => p.id !== post.id);
          }

          return { ...old, data: newData };
        });

        return { previousPost, previousLikedPosts };
      },
      onError: (err, _variables, context) => {
        // Rollback optimistic updates on error
        if (context?.previousPost) {
          queryClient.setQueryData(getGetPostQueryKey(post.id), context.previousPost);
        }
        if (context?.previousLikedPosts) {
          queryClient.setQueryData(getLikedPostsQueryKey(), context.previousLikedPosts);
        }

        console.error('Failed to toggle like:', err);
      },
      onSettled: () => {
        // Always refetch to ensure data consistency after toggle
        queryClient.invalidateQueries({ queryKey: getGetPostQueryKey(post.id) });
        queryClient.invalidateQueries({ queryKey: getLikedPostsQueryKey() });
        queryClient.invalidateQueries({
          predicate: (query) => query.queryKey[0] === '/api/v1/posts',
        });
      },
    },
  });

  const handleDelete = () => {
    if (post.id) {
      setDeleteError(null);
      deletePostMutation.mutate({ postId: post.id });
    }
  };

  const handleLikeToggle = () => {
    // Check if user is authenticated
    if (!user) {
      // Redirect to login page or show login modal
      router.push('/auth/login');
      return;
    }

    if (post.id) {
      likeMutation.mutate({ postId: post.id });
    }
  };

  return (
    <>
      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-2xl font-bold leading-tight flex-1 mr-4">
              {post.title || '제목 없음'}
            </h1>
            {post.regionCode && (
              <Badge variant="secondary">
                <MapPin className="h-3 w-3 mr-1" />
                <RegionName regionCode={post.regionCode} />
              </Badge>
            )}
          </div>

          {/* Author Info */}
          <div className="flex items-center space-x-3 pb-4 border-b">
            <Avatar>
              <AvatarImage src={post.authorProfileUrl} alt={post.authorNickname} />
              <AvatarFallback>
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <p className="font-semibold">{post.authorNickname || '익명'}</p>
              <div className="flex items-center text-sm text-muted-foreground space-x-3">
                <div className="flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  <span>{formattedDate}</span>
                </div>
                {updatedDate && <span>(수정됨: {updatedDate})</span>}
              </div>
            </div>

            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              {post.likeCount !== undefined && post.likeCount > 0 && (
                <div className="flex items-center">
                  <Heart className="h-4 w-4 mr-1" />
                  <span>{post.likeCount}</span>
                </div>
              )}
              {post.commentCount !== undefined && (
                <div className="flex items-center">
                  <MessageSquare className="h-4 w-4 mr-1" />
                  <span>{post.commentCount}</span>
                </div>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          {/* Post Images */}
          {post.images && post.images.length > 0 && (
            <div className="mb-6">
              {post.images.length === 1 ? (
                <div className="relative aspect-video w-full rounded-lg overflow-hidden">
                  <Image
                    src={post.images[0].imageUrl || '/placeholder.jpg'}
                    alt="게시글 이미지"
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {post.images.slice(0, 4).map((image, index) => (
                    <div
                      key={image.id}
                      className="relative aspect-video rounded-lg overflow-hidden"
                    >
                      <Image
                        src={image.imageUrl || '/placeholder.jpg'}
                        alt={`게시글 이미지 ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                      {index === 3 && post.images!.length > 4 && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <span className="text-white font-semibold">
                            +{post.images!.length - 4}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Post Content */}
          <div className="prose max-w-none">
            <div className="whitespace-pre-wrap text-base leading-relaxed">
              {post.content || '내용이 없습니다.'}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t">
            <div className="flex items-center space-x-2">
              <Button
                variant={isLiked ? 'default' : 'outline'}
                size="sm"
                onClick={handleLikeToggle}
                disabled={likeMutation.isPending}
              >
                <Heart className={`h-4 w-4 mr-2 ${isLiked ? 'fill-current' : ''}`} />
                {likeMutation.isPending
                  ? '처리 중...'
                  : user
                    ? `${isLiked ? '좋아요됨' : '좋아요'} ${post.likeCount || 0}`
                    : `좋아요 ${post.likeCount || 0}`}
              </Button>
              <Button variant="outline" size="sm">
                <MessageSquare className="h-4 w-4 mr-2" />
                댓글 {post.commentCount || 0}
              </Button>
            </div>

            {/* Edit/Delete Buttons - Show only for post authors */}
            {isAuthor && (
              <div className="flex items-center space-x-2">
                <Link href={`/community/${post.id}/edit`}>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    수정
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                  onClick={() => setDeleteDialogOpen(true)}
                  disabled={deletePostMutation.isPending}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  {deletePostMutation.isPending ? '삭제 중...' : '삭제'}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      {deleteDialogOpen && (
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                게시글 삭제
              </DialogTitle>
              <DialogDescription>
                이 게시글을 정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없으며, 모든 댓글도 함께
                삭제됩니다.
              </DialogDescription>
            </DialogHeader>

            {deleteError && (
              <div className="px-6">
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{deleteError}</AlertDescription>
                </Alert>
              </div>
            )}

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setDeleteDialogOpen(false);
                  setDeleteError(null);
                }}
                disabled={deletePostMutation.isPending}
              >
                취소
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={deletePostMutation.isPending}
              >
                {deletePostMutation.isPending ? '삭제 중...' : '삭제'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
