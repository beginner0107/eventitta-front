'use client';

import { PostSummaryDto } from '@/api/eventitta';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, MessageSquare, User, MapPin, Calendar } from 'lucide-react';
import Link from 'next/link';
// Simple date formatter helper
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

interface PostCardProps {
  post: PostSummaryDto;
}

export function PostCard({ post }: PostCardProps) {
  const formattedDate = post.createdAt ? formatTimeAgo(post.createdAt) : '';

  return (
    <Link href={`/community/${post.id}`}>
      <Card className="hover:shadow-md transition-shadow duration-200 cursor-pointer h-full">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg font-semibold line-clamp-2 flex-1 mr-2">
              {post.title || '제목 없음'}
            </CardTitle>
            {post.regionCode && (
              <Badge variant="secondary" className="shrink-0">
                <MapPin className="h-3 w-3 mr-1" />
                {post.regionCode}
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-1" />
                <span>{post.authorNickname || '익명'}</span>
              </div>

              {post.likeCount !== undefined && post.likeCount > 0 && (
                <div className="flex items-center">
                  <Heart className="h-4 w-4 mr-1" />
                  <span>{post.likeCount}</span>
                </div>
              )}
            </div>

            {formattedDate && (
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 mr-1" />
                <span>{formattedDate}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
