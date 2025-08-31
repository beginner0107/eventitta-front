'use client';

import { useEffect, useState } from 'react';
import { useGetTopRegions, getChildRegions } from '@/api/eventitta';
import type { RegionDto } from '@/api/eventitta';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

interface RegionDisplayProps {
  regionCode: string;
  showHierarchy?: boolean;
  variant?: 'default' | 'outline' | 'secondary';
  size?: 'sm' | 'default' | 'lg';
}

export function RegionDisplay({
  regionCode,
  showHierarchy = false,
  variant = 'secondary',
  size = 'default',
}: RegionDisplayProps) {
  const [regionInfo, setRegionInfo] = useState<{
    l1?: RegionDto;
    l2?: RegionDto;
    l3?: RegionDto;
    current?: RegionDto;
  }>({});
  const [isLoading, setIsLoading] = useState(true);

  const { data: topRegions } = useGetTopRegions();

  useEffect(() => {
    if (!regionCode || !topRegions?.data) return;

    const loadRegionInfo = async () => {
      setIsLoading(true);

      try {
        // Determine region level by code structure
        const level = getRegionLevel(regionCode);
        const info: typeof regionInfo = {};

        if (level >= 1) {
          // Get L1 region
          const l1Code = regionCode.substring(0, 2) + '00000000';
          info.l1 = topRegions.data.find((r) => r.code === l1Code);
        }

        if (level >= 2) {
          // Get L2 region
          const l1Code = regionCode.substring(0, 2) + '00000000';
          try {
            const l2Response = await getChildRegions(l1Code);
            if (l2Response?.data) {
              const l2Code = regionCode.substring(0, 5) + '00000';
              info.l2 = l2Response.data.find((r) => r.code === l2Code);
            }
          } catch (error) {
            console.warn('Failed to load L2 region:', error);
          }
        }

        if (level >= 3) {
          // Get L3 region
          const l2Code = regionCode.substring(0, 5) + '00000';
          try {
            const l3Response = await getChildRegions(l2Code);
            if (l3Response?.data) {
              info.l3 = l3Response.data.find((r) => r.code === regionCode);
            }
          } catch (error) {
            console.warn('Failed to load L3 region:', error);
          }
        }

        // Set current region based on level
        if (level === 1) info.current = info.l1;
        else if (level === 2) info.current = info.l2;
        else if (level === 3) info.current = info.l3;

        setRegionInfo(info);
      } catch (error) {
        console.error('Failed to load region info:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadRegionInfo();
  }, [regionCode, topRegions]);

  const getRegionLevel = (code: string): number => {
    if (!code) return 0;

    // Level 1: XX00000000 (시/도)
    if (code.endsWith('00000000') && !code.startsWith('00')) return 1;

    // Level 2: XXXXX00000 (시/군/구)
    if (code.endsWith('00000') && !code.substring(2, 5).includes('000')) return 2;

    // Level 3: XXXXXXXXXX (읍/면/동)
    if (!code.endsWith('00000')) return 3;

    return 0;
  };

  if (isLoading) {
    return <Skeleton className="h-6 w-20" />;
  }

  if (!regionInfo.current) {
    return (
      <Badge variant="outline" className="text-gray-400">
        알 수 없음
      </Badge>
    );
  }

  if (!showHierarchy) {
    return (
      <Badge
        variant={variant}
        className={size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-base' : ''}
      >
        {regionInfo.current.name}
      </Badge>
    );
  }

  // Show hierarchical display
  const parts = [];
  if (regionInfo.l1) parts.push(regionInfo.l1.name);
  if (regionInfo.l2) parts.push(regionInfo.l2.name);
  if (regionInfo.l3) parts.push(regionInfo.l3.name);

  return (
    <div className="flex flex-wrap gap-1">
      {parts.map((part, index) => (
        <Badge
          key={index}
          variant={index === parts.length - 1 ? variant : 'outline'}
          className={size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-base' : ''}
        >
          {part}
        </Badge>
      ))}
    </div>
  );
}

interface RegionNameProps {
  regionCode: string;
  showFull?: boolean;
}

export function RegionName({ regionCode, showFull = false }: RegionNameProps) {
  const [regionName, setRegionName] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  const { data: topRegions } = useGetTopRegions();

  useEffect(() => {
    if (!regionCode || !topRegions?.data) return;

    const loadRegionName = async () => {
      setIsLoading(true);

      try {
        const level = getRegionLevel(regionCode);
        const names: string[] = [];

        if (level >= 1) {
          const l1Code = regionCode.substring(0, 2) + '00000000';
          const l1Region = topRegions.data.find((r) => r.code === l1Code);
          if (l1Region?.name) names.push(l1Region.name);
        }

        if (level >= 2) {
          const l1Code = regionCode.substring(0, 2) + '00000000';
          try {
            const l2Response = await getChildRegions(l1Code);
            if (l2Response?.data) {
              const l2Code = regionCode.substring(0, 5) + '00000';
              const l2Region = l2Response.data.find((r) => r.code === l2Code);
              if (l2Region?.name) names.push(l2Region.name);
            }
          } catch (error) {
            console.warn('Failed to load L2 region:', error);
          }
        }

        if (level >= 3) {
          const l2Code = regionCode.substring(0, 5) + '00000';
          try {
            const l3Response = await getChildRegions(l2Code);
            if (l3Response?.data) {
              const l3Region = l3Response.data.find((r) => r.code === regionCode);
              if (l3Region?.name) names.push(l3Region.name);
            }
          } catch (error) {
            console.warn('Failed to load L3 region:', error);
          }
        }

        if (showFull) {
          setRegionName(names.join(' '));
        } else {
          setRegionName(names[names.length - 1] || '');
        }
      } catch (error) {
        console.error('Failed to load region name:', error);
        setRegionName('');
      } finally {
        setIsLoading(false);
      }
    };

    loadRegionName();
  }, [regionCode, topRegions, showFull]);

  const getRegionLevel = (code: string): number => {
    if (!code) return 0;

    if (code.endsWith('00000000') && !code.startsWith('00')) return 1;
    if (code.endsWith('00000') && !code.substring(2, 5).includes('000')) return 2;
    if (!code.endsWith('00000')) return 3;

    return 0;
  };

  if (isLoading) {
    return '로딩 중...';
  }

  return regionName || '알 수 없음';
}
