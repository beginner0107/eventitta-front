import Link from 'next/link';
import { Calendar, MapPin, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface MeetingData {
  id?: number;
  title?: string;
  description?: string;
  startTime?: string;
  endTime?: string;
  address?: string;
  currentMembers?: number;
  maxMembers?: number;
  status?: string;
  leaderNickname?: string;
  thumbnailUrl?: string;
}

interface MeetingCardProps {
  meeting: MeetingData;
  className?: string;
}

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

export function MeetingCard({ meeting, className }: MeetingCardProps) {
  const progressPercentage = Math.min(
    100,
    ((meeting.currentMembers ?? 0) / (meeting.maxMembers ?? 1)) * 100,
  );

  return (
    <Link href={`/meetings/${meeting.id}`} className={className}>
      <Card className="h-full hover:shadow-md transition-shadow cursor-pointer group">
        {meeting.thumbnailUrl && (
          <div className="relative w-full h-48 overflow-hidden rounded-t-lg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={meeting.thumbnailUrl}
              alt={meeting.title || '모임 이미지'}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}

        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg line-clamp-1" title={meeting.title}>
                {meeting.title}
              </CardTitle>
              <CardDescription className="mt-1 line-clamp-2">
                {meeting.description || '설명이 없습니다'}
              </CardDescription>
            </div>
            {getStatusBadge(meeting.status)}
          </div>
        </CardHeader>

        <CardContent className="pt-0 space-y-3">
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="truncate">
              {formatDateTime(meeting.startTime)}
              {meeting.endTime && ` - ${formatDateTime(meeting.endTime)}`}
            </span>
          </div>

          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="truncate" title={meeting.address}>
              {meeting.address || '주소 미정'}
            </span>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center text-sm text-muted-foreground">
              <Users className="h-4 w-4 mr-2" />
              <span>
                {meeting.currentMembers}/{meeting.maxMembers}명
              </span>
            </div>

            {meeting.leaderNickname && (
              <div className="text-xs text-muted-foreground">by {meeting.leaderNickname}</div>
            )}
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-muted rounded-full h-1.5">
            <div
              className="bg-primary h-1.5 rounded-full transition-all"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
