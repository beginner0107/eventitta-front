'use client';

import { useState, useEffect } from 'react';
import { useGetTopRegions, useGetChildRegions } from '@/api/eventitta';
import type { RegionDto } from '@/api/eventitta';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface RegionSelectorProps {
  value?: string;
  onChange: (regionCode: string, regionName: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function RegionSelector({
  value,
  onChange,
  placeholder = '지역을 선택하세요',
  disabled = false,
}: RegionSelectorProps) {
  const [selectedL1, setSelectedL1] = useState<string>('');
  const [selectedL2, setSelectedL2] = useState<string>('');
  const [selectedL3, setSelectedL3] = useState<string>('');

  const { data: topRegions, isLoading: isLoadingTop } = useGetTopRegions();
  const { data: l2Regions, isLoading: isLoadingL2 } = useGetChildRegions(selectedL1, {
    query: { enabled: !!selectedL1 },
  });
  const { data: l3Regions, isLoading: isLoadingL3 } = useGetChildRegions(selectedL2, {
    query: { enabled: !!selectedL2 },
  });

  useEffect(() => {
    if (value && topRegions?.data) {
      const region = findRegionByCode(value, topRegions.data);
      if (region) {
        if (region.level === 1) {
          setSelectedL1(region.code || '');
        } else if (region.level === 2) {
          const parentCode = (region.code?.substring(0, 2) || '') + '00000000';
          setSelectedL1(parentCode);
          setSelectedL2(region.code || '');
        } else if (region.level === 3) {
          const l1Code = (region.code?.substring(0, 2) || '') + '00000000';
          const l2Code = (region.code?.substring(0, 5) || '') + '00000';
          setSelectedL1(l1Code);
          setSelectedL2(l2Code);
          setSelectedL3(region.code || '');
        }
      }
    }
  }, [value, topRegions]);

  const findRegionByCode = (code: string, regions: RegionDto[]): RegionDto | undefined => {
    return regions.find((region) => region.code === code);
  };

  const getRegionName = (code: string, regions: RegionDto[]): string => {
    const region = findRegionByCode(code, regions);
    return region?.name || '';
  };

  const handleL1Change = (code: string) => {
    setSelectedL1(code);
    setSelectedL2('');
    setSelectedL3('');

    if (topRegions?.data) {
      const regionName = getRegionName(code, topRegions.data);
      onChange(code, regionName);
    }
  };

  const handleL2Change = (code: string) => {
    setSelectedL2(code);
    setSelectedL3('');

    if (l2Regions?.data) {
      const regionName = getRegionName(code, l2Regions.data);
      onChange(code, regionName);
    }
  };

  const handleL3Change = (code: string) => {
    setSelectedL3(code);

    if (l3Regions?.data) {
      const regionName = getRegionName(code, l3Regions.data);
      onChange(code, regionName);
    }
  };

  return (
    <div className="space-y-2">
      <Select value={selectedL1} onValueChange={handleL1Change} disabled={disabled || isLoadingTop}>
        <SelectTrigger>
          <SelectValue placeholder="시/도 선택" />
        </SelectTrigger>
        <SelectContent>
          {topRegions?.data?.map((region) => (
            <SelectItem key={region.code} value={region.code || ''}>
              {region.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {selectedL1 && (
        <Select
          value={selectedL2}
          onValueChange={handleL2Change}
          disabled={disabled || isLoadingL2}
        >
          <SelectTrigger>
            <SelectValue placeholder="시/군/구 선택" />
          </SelectTrigger>
          <SelectContent>
            {l2Regions?.data?.map((region) => (
              <SelectItem key={region.code} value={region.code || ''}>
                {region.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {selectedL2 && (
        <Select
          value={selectedL3}
          onValueChange={handleL3Change}
          disabled={disabled || isLoadingL3}
        >
          <SelectTrigger>
            <SelectValue placeholder="읍/면/동 선택" />
          </SelectTrigger>
          <SelectContent>
            {l3Regions?.data?.map((region) => (
              <SelectItem key={region.code} value={region.code || ''}>
                {region.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
}
