'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PostDetailDto, useDelete } from '@/api/eventitta';
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
        router.push('/community');
      },
      onError: (error: any) => {
        console.error('Failed to delete post:', error);
        setDeleteError('게시글 삭제에 실패했습니다. 다시 시도해주세요.');
      },
    },
  });

  const handleDelete = () => {
    if (post.id) {
      setDeleteError(null);
      deletePostMutation.mutate({ postId: post.id });
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
              <Button variant="outline" size="sm">
                <Heart className="h-4 w-4 mr-2" />
                좋아요 {post.likeCount || 0}
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
