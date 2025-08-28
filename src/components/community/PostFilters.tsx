'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
// Using native select for now
import { Search, Filter, X, MapPin } from 'lucide-react';
import { GetPostsParams, GetPostsSearchType } from '@/api/eventitta';

interface PostFiltersProps {
  onFiltersChange: (filters: GetPostsParams) => void;
  loading?: boolean;
}

// Common Korean regions for quick selection
const POPULAR_REGIONS = [
  '서울시 강남구',
  '서울시 서초구',
  '서울시 송파구',
  '서울시 마포구',
  '부산시 해운대구',
  '부산시 부산진구',
  '인천시 연수구',
  '대구시 수성구',
];

export function PostFilters({ onFiltersChange, loading }: PostFiltersProps) {
  const [keyword, setKeyword] = useState('');
  const [searchType, setSearchType] = useState<GetPostsSearchType>('TITLE_CONTENT');
  const [regionCode, setRegionCode] = useState<string>('');
  const [showRegionSuggestions, setShowRegionSuggestions] = useState(false);

  const handleSearch = () => {
    onFiltersChange({
      keyword: keyword.trim() || undefined,
      searchType: keyword.trim() ? searchType : undefined,
      regionCode: regionCode || undefined,
      page: 0, // Reset to first page when searching
    });
  };

  const handleClearFilters = () => {
    setKeyword('');
    setRegionCode('');
    setSearchType('TITLE_CONTENT');
    onFiltersChange({
      page: 0,
    });
  };

  const hasActiveFilters = keyword.trim() || regionCode;

  return (
    <div className="bg-white rounded-lg border p-4 mb-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Input
            type="text"
            placeholder="검색어를 입력하세요..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="pr-10"
          />
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>

        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value as GetPostsSearchType)}
          className="flex h-10 w-full md:w-40 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          <option value="TITLE_CONTENT">제목+내용</option>
          <option value="TITLE">제목</option>
          <option value="CONTENT">내용</option>
        </select>

        <div className="relative w-full md:w-48">
          <Input
            type="text"
            placeholder="지역 (예: 서울시 강남구)"
            value={regionCode}
            onChange={(e) => {
              setRegionCode(e.target.value);
              setShowRegionSuggestions(e.target.value.length > 0);
            }}
            onFocus={() => setShowRegionSuggestions(true)}
            onBlur={() => setTimeout(() => setShowRegionSuggestions(false), 200)}
            className="pr-8"
          />
          <MapPin className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />

          {/* Region Suggestions Dropdown */}
          {showRegionSuggestions && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-md shadow-lg z-10 max-h-48 overflow-y-auto">
              {POPULAR_REGIONS.filter(
                (region) =>
                  regionCode.length === 0 ||
                  region.toLowerCase().includes(regionCode.toLowerCase()),
              ).map((region) => (
                <button
                  key={region}
                  type="button"
                  className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                  onClick={() => {
                    setRegionCode(region);
                    setShowRegionSuggestions(false);
                  }}
                >
                  {region}
                </button>
              ))}
              {regionCode.length > 0 &&
                !POPULAR_REGIONS.some((r) =>
                  r.toLowerCase().includes(regionCode.toLowerCase()),
                ) && (
                  <div className="px-3 py-2 text-sm text-muted-foreground">
                    &apos;{regionCode}&apos; 검색 결과가 없습니다.
                  </div>
                )}
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <Button onClick={handleSearch} disabled={loading} className="whitespace-nowrap">
            <Search className="h-4 w-4 mr-2" />
            검색
          </Button>

          {hasActiveFilters && (
            <Button
              variant="outline"
              onClick={handleClearFilters}
              disabled={loading}
              className="whitespace-nowrap"
            >
              <X className="h-4 w-4 mr-2" />
              초기화
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
