'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';
import { GetPostsParams, GetPostsSearchType } from '@/api/eventitta';
import { RegionSelector } from '@/components/region/RegionSelector';

interface PostFiltersProps {
  onFiltersChange: (filters: GetPostsParams) => void;
  loading?: boolean;
}

export function PostFilters({ onFiltersChange, loading }: PostFiltersProps) {
  const [keyword, setKeyword] = useState('');
  const [searchType, setSearchType] = useState<GetPostsSearchType>('TITLE_CONTENT');
  const [regionCode, setRegionCode] = useState<string>('');
  const [regionName, setRegionName] = useState<string>('');

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
    setRegionName('');
    setSearchType('TITLE_CONTENT');
    onFiltersChange({
      page: 0,
    });
  };

  const handleRegionChange = (code: string, name: string) => {
    setRegionCode(code);
    setRegionName(name);
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

        <div className="w-full md:w-64">
          <RegionSelector value={regionCode} onChange={handleRegionChange} disabled={loading} />
          {regionName && (
            <p className="text-xs text-muted-foreground mt-1">선택된 지역: {regionName}</p>
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
