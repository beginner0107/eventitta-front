'use client';

import { useState } from 'react';
import { useGetPosts, GetPostsParams } from '@/api/eventitta';
import { PostCard } from './PostCard';
import { PostFilters } from './PostFilters';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { MessageSquare, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';

const DEFAULT_PAGE_SIZE = 12;

export function PostList() {
  const [filters, setFilters] = useState<GetPostsParams>({
    page: 0,
    size: DEFAULT_PAGE_SIZE,
  });

  const { data, isLoading, error, refetch } = useGetPosts(filters, {
    query: {
      retry: 2,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  });

  const posts = data?.data?.content || [];
  const totalElements = data?.data?.totalElements || 0;
  const totalPages = data?.data?.totalPages || 0;
  const currentPage = data?.data?.page || 0;

  const handleFiltersChange = (newFilters: GetPostsParams) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  if (error) {
    return (
      <div className="container max-w-4xl mx-auto p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            게시글을 불러오는 중 오류가 발생했습니다.
            <Button variant="link" className="p-0 ml-1 h-auto" onClick={() => refetch()}>
              다시 시도
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight mb-2">지역 커뮤니티</h1>
        <p className="text-muted-foreground">동네 이웃들과 소통하고 정보를 나누는 공간입니다</p>
      </div>

      <PostFilters onFiltersChange={handleFiltersChange} loading={isLoading} />

      {/* Results summary */}
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-muted-foreground">
          총 <span className="font-semibold">{totalElements.toLocaleString()}</span>개의 게시글
        </p>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="space-y-3">
              <Skeleton className="h-48 rounded-lg" />
            </div>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12">
          <MessageSquare className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">게시글이 없습니다</h3>
          <p className="text-muted-foreground mb-4">첫 번째 게시글을 작성해보세요!</p>
          <Button>글 작성하기</Button>
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 0 || isLoading}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                이전
              </Button>

              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  const pageNumber = Math.max(0, Math.min(totalPages - 5, currentPage - 2)) + i;
                  if (pageNumber >= totalPages) return null;

                  return (
                    <Button
                      key={pageNumber}
                      variant={currentPage === pageNumber ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handlePageChange(pageNumber)}
                      disabled={isLoading}
                      className="w-8"
                    >
                      {pageNumber + 1}
                    </Button>
                  );
                })}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages - 1 || isLoading}
              >
                다음
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
