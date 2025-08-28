import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Sparkles } from 'lucide-react';

export default function EventsPage() {
  return (
    <div className="container max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">지역 이벤트 & 축제</h1>
        <p className="text-muted-foreground mt-2">
          주변에서 열리는 다양한 이벤트와 축제 정보를 확인하세요
        </p>
      </div>

      <Card className="text-center py-12">
        <CardContent>
          <Sparkles className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <CardTitle className="mb-2">이벤트 페이지 개발 예정</CardTitle>
          <CardDescription className="mb-6">
            위치 기반 이벤트 및 축제 조회 기능이 곧 추가될 예정입니다. 주변의 다양한 문화 행사를
            놓치지 마세요.
          </CardDescription>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <Button disabled>
              <Calendar className="h-4 w-4 mr-2" />
              이벤트 검색하기
            </Button>
            <Link href="/">
              <Button variant="outline">메인으로 돌아가기</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
