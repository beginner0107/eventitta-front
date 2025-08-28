import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, Plus } from 'lucide-react';

export default function CommunityPage() {
  return (
    <div className="container max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">지역 커뮤니티</h1>
        <p className="text-muted-foreground mt-2">
          {' '}
          동네 이웃들과 소통하고 정보를 나누는 공간입니다{' '}
        </p>
      </div>{' '}
      <Card className="text-center py-12">
        {' '}
        <CardContent>
          {' '}
          <MessageSquare className="h-16 w-16 text-muted-foreground mx-auto mb-4" />{' '}
          <CardTitle className="mb-2">커뮤니티 페이지 개발 예정</CardTitle>{' '}
          <CardDescription className="mb-6">
            {' '}
            지역 기반 커뮤니티 기능이 곧 추가될 예정입니다. 동네 맛집, 생활 정보, 소통 공간으로
            활용해 보세요.{' '}
          </CardDescription>{' '}
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            {' '}
            <Button disabled>
              {' '}
              <Plus className="h-4 w-4 mr-2" /> 글 작성하기{' '}
            </Button>{' '}
            <Link href="/">
              {' '}
              <Button variant="outline">메인으로 돌아가기</Button>{' '}
            </Link>{' '}
          </div>{' '}
        </CardContent>{' '}
      </Card>{' '}
    </div>
  );
}
