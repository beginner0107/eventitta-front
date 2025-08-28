'use client';

import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Dumbbell, Coffee, Palette, Music, Camera, Heart, Code } from 'lucide-react';

// TODO: 실제 카테고리 API 엔드포인트가 있으면 해당 API를 사용
// 현재는 하드코딩된 카테고리 사용
const MOCK_CATEGORIES = [
  {
    id: 'study',
    name: '스터디',
    icon: BookOpen,
    color: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
    description: '함께 공부해요',
    count: 24,
  },
  {
    id: 'fitness',
    name: '운동',
    icon: Dumbbell,
    color: 'bg-green-100 text-green-800 hover:bg-green-200',
    description: '건강한 모임',
    count: 18,
  },
  {
    id: 'food',
    name: '맛집',
    icon: Coffee,
    color: 'bg-orange-100 text-orange-800 hover:bg-orange-200',
    description: '맛있는 시간',
    count: 32,
  },
  {
    id: 'art',
    name: '문화/예술',
    icon: Palette,
    color: 'bg-purple-100 text-purple-800 hover:bg-purple-200',
    description: '문화를 즐겨요',
    count: 15,
  },
  {
    id: 'music',
    name: '음악',
    icon: Music,
    color: 'bg-pink-100 text-pink-800 hover:bg-pink-200',
    description: '음악과 함께',
    count: 12,
  },
  {
    id: 'photography',
    name: '사진',
    icon: Camera,
    color: 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200',
    description: '순간을 담아요',
    count: 9,
  },
  {
    id: 'social',
    name: '친목',
    icon: Heart,
    color: 'bg-red-100 text-red-800 hover:bg-red-200',
    description: '새로운 인연',
    count: 28,
  },
  {
    id: 'tech',
    name: 'IT/개발',
    icon: Code,
    color: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
    description: '기술 교류',
    count: 16,
  },
];

function NoCategoriesState() {
  return (
    <Card className="text-center py-12">
      <CardContent>
        <Palette className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <CardTitle className="mb-2">카테고리 데이터가 없습니다</CardTitle>
        <CardDescription>아직 카테고리별 모임 분류가 준비되지 않았습니다.</CardDescription>
      </CardContent>
    </Card>
  );
}

interface CategoryChipsProps {
  showAll?: boolean;
}

export function CategoryChips({ showAll = false }: CategoryChipsProps) {
  // TODO: 실제 카테고리 API가 있으면 여기서 사용
  // const { data: categories, isLoading, error } = useGetCategories();

  // 실제 API 연동 시 로딩/에러 상태 처리
  // if (isLoading) return <div>카테고리 로딩 중...</div>;
  // if (error) return <NoCategoriesState />;

  const displayCategories = showAll ? MOCK_CATEGORIES : MOCK_CATEGORIES.slice(0, 6);

  // 실제 API에서 카테고리가 없는 경우
  // if (!categories?.length) return <NoCategoriesState />;

  return (
    <section className="py-12 bg-background">
      <div className="container max-w-6xl mx-auto px-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">관심사별 모임</h2>
          <p className="text-muted-foreground">다양한 카테고리에서 나에게 맞는 모임을 찾아보세요</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {displayCategories.map((category) => {
            const IconComponent = category.icon;
            return (
              <Link key={category.id} href={`/meetings?category=${category.id}`} className="group">
                <Card className="h-full hover:shadow-md transition-all duration-200 hover:scale-105">
                  <CardContent className="p-6 text-center">
                    <div className="mb-4">
                      <div
                        className={`inline-flex p-3 rounded-full ${category.color} transition-colors`}
                      >
                        <IconComponent className="h-6 w-6" />
                      </div>
                    </div>
                    <h3 className="font-semibold text-lg mb-1">{category.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{category.description}</p>
                    <Badge variant="secondary" className="text-xs">
                      {category.count}개 모임
                    </Badge>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {!showAll && MOCK_CATEGORIES.length > 6 && (
          <div className="text-center mt-8">
            <Link href="/categories">
              <button className="text-primary hover:underline font-medium">
                더 많은 카테고리 보기 →
              </button>
            </Link>
          </div>
        )}

        {/* API 연동 후 실제 데이터가 없을 때 표시할 메시지 */}
        {/* TODO: 실제 API 연동 후 아래 주석 해제 및 위 MOCK_CATEGORIES 로직 제거 */}
        {/* {!categories?.length && <NoCategoriesState />} */}
      </div>
    </section>
  );
}
