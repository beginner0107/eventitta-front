'use client';

import { useState, useEffect, useMemo } from 'react';
import { useGetTopRegions, getChildRegions } from '@/api/eventitta';
import type { RegionDto } from '@/api/eventitta';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface RegionSearchProps {
  value?: string;
  onChange: (regionCode: string, regionName: string) => void;
  placeholder?: string;
  disabled?: boolean;
  maxResults?: number;
}

export function RegionSearch({
  value,
  onChange,
  placeholder = '지역을 검색하세요',
  disabled = false,
  maxResults = 10,
}: RegionSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [allRegions, setAllRegions] = useState<RegionDto[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<RegionDto | null>(null);

  const { data: topRegions } = useGetTopRegions();

  // Load all regions when top regions are available
  useEffect(() => {
    if (topRegions?.data) {
      const loadAllRegions = async () => {
        const regions: RegionDto[] = [...topRegions.data];

        // Load level 2 regions for each top region
        for (const topRegion of topRegions.data) {
          try {
            const childResponse = await getChildRegions(topRegion.code || '');
            if (childResponse?.data) {
              regions.push(...childResponse.data);

              // Load level 3 regions for each level 2 region
              for (const l2Region of childResponse.data) {
                try {
                  const grandchildResponse = await getChildRegions(l2Region.code || '');
                  if (grandchildResponse?.data) {
                    regions.push(...grandchildResponse.data);
                  }
                } catch (error) {
                  console.warn('Failed to load level 3 regions:', error);
                }
              }
            }
          } catch (error) {
            console.warn('Failed to load level 2 regions:', error);
          }
        }

        setAllRegions(regions);
      };

      loadAllRegions();
    }
  }, [topRegions]);

  // Find selected region by value
  useEffect(() => {
    if (value && allRegions.length > 0) {
      const region = allRegions.find((r) => r.code === value);
      setSelectedRegion(region || null);
      if (region) {
        setSearchQuery(region.name || '');
      }
    }
  }, [value, allRegions]);

  // Filter regions based on search query
  const filteredRegions = useMemo(() => {
    if (!searchQuery.trim()) return [];

    const query = searchQuery.toLowerCase();
    return allRegions
      .filter((region) => region.name?.toLowerCase().includes(query))
      .slice(0, maxResults);
  }, [searchQuery, allRegions, maxResults]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    setIsOpen(query.length > 0);
  };

  const handleRegionSelect = (region: RegionDto) => {
    setSelectedRegion(region);
    setSearchQuery(region.name || '');
    setIsOpen(false);
    onChange(region.code || '', region.name || '');
  };

  const handleInputFocus = () => {
    if (searchQuery.length > 0) {
      setIsOpen(true);
    }
  };

  const handleInputBlur = () => {
    // Delay closing to allow clicking on results
    setTimeout(() => setIsOpen(false), 150);
  };

  const clearSelection = () => {
    setSelectedRegion(null);
    setSearchQuery('');
    setIsOpen(false);
    onChange('', '');
  };

  const getRegionDisplayName = (region: RegionDto): string => {
    // Build hierarchical name like "서울특별시 강남구 역삼동"
    const parts = [];

    if (region.level === 3) {
      // Find parent regions
      const l2Parent = allRegions.find((r) => r.code === region.code?.substring(0, 5) + '00000');
      const l1Parent = allRegions.find((r) => r.code === region.code?.substring(0, 2) + '00000000');

      if (l1Parent) parts.push(l1Parent.name);
      if (l2Parent) parts.push(l2Parent.name);
      parts.push(region.name);
    } else if (region.level === 2) {
      const l1Parent = allRegions.find((r) => r.code === region.code?.substring(0, 2) + '00000000');
      if (l1Parent) parts.push(l1Parent.name);
      parts.push(region.name);
    } else {
      parts.push(region.name);
    }

    return parts.filter(Boolean).join(' ');
  };

  return (
    <div className="relative">
      <div className="relative">
        <Input
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          placeholder={placeholder}
          disabled={disabled}
          className="pr-10"
        />
        {selectedRegion && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
            onClick={clearSelection}
          >
            ×
          </Button>
        )}
      </div>

      {isOpen && filteredRegions.length > 0 && (
        <Card className="absolute z-50 w-full mt-1 max-h-60 overflow-y-auto border shadow-md">
          <div className="p-1">
            {filteredRegions.map((region) => (
              <Button
                key={region.code}
                variant="ghost"
                className="w-full justify-start text-left h-auto p-2 hover:bg-gray-100"
                onClick={() => handleRegionSelect(region)}
              >
                <div>
                  <div className="font-medium">{region.name}</div>
                  <div className="text-xs text-gray-500">{getRegionDisplayName(region)}</div>
                </div>
              </Button>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
