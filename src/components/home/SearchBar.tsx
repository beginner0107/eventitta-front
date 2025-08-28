'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export function SearchBar() {
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const router = useRouter();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const params = new URLSearchParams();
    if (keyword.trim()) {
      params.set('keyword', keyword.trim());
    }
    if (location.trim()) {
      // TODO: 위치 기반 검색 API 파라미터 추가
      params.set('location', location.trim());
    }

    const searchUrl = `/meetings${params.toString() ? `?${params.toString()}` : ''}`;
    router.push(searchUrl);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <input
                type="text"
                placeholder="관심있는 모임을 검색해보세요..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-input rounded-md bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                aria-label="모임 검색"
              />
            </div>

            <div className="relative flex-1 sm:max-w-xs">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <input
                type="text"
                placeholder="지역을 입력하세요"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-input rounded-md bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                aria-label="지역 검색"
              />
            </div>

            <Button type="submit" size="lg" className="whitespace-nowrap">
              <Search className="h-4 w-4 mr-2" />
              검색
            </Button>
          </div>

          {/* Quick filters - TODO: Implement based on available categories */}
          <div className="flex flex-wrap gap-2 pt-2">
            <span className="text-sm text-muted-foreground">인기 검색:</span>
            <button
              type="button"
              onClick={() => setKeyword('스터디')}
              className="text-sm text-primary hover:underline"
            >
              스터디
            </button>
            <button
              type="button"
              onClick={() => setKeyword('운동')}
              className="text-sm text-primary hover:underline"
            >
              운동
            </button>
            <button
              type="button"
              onClick={() => setKeyword('맛집')}
              className="text-sm text-primary hover:underline"
            >
              맛집
            </button>
            <button
              type="button"
              onClick={() => setKeyword('취미')}
              className="text-sm text-primary hover:underline"
            >
              취미
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
