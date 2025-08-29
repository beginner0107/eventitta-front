'use client';

import { useState, useEffect, useRef } from 'react';
import { useGetTopRegions, useGetChildRegions, useGetRegionOptions } from '@/api/eventitta';
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

// Stable helpers (module-scoped) to avoid hook deps on function identity
const findRegionByCode = (code: string, regions: RegionDto[]): RegionDto | undefined => {
  return regions.find((region) => String(region.code) === String(code));
};

const getRegionName = (code: string, regions: RegionDto[]): string => {
  const region = findRegionByCode(code, regions);
  return region?.name || '';
};

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
  // New: fetch flattened options to resolve full parent path reliably
  const { data: regionOptions } = useGetRegionOptions();

  // Holds the target parent path derived from region options (l1 -> l2 -> l3)
  const [initialPath, setInitialPath] = useState<string[] | null>(null);

  const appliedOnceRef = useRef<string>(''); // Track which code we've applied

  // String normalization and safe existence checks
  const toCode = (v: unknown) => (v == null ? '' : String(v).trim());
  const hasRegion = (regions?: RegionDto[], code?: string) =>
    !!(code && regions?.some((r) => String(r.code) === String(code)));

  const getRegionLevel = (code: string): number => {
    if (!code) return 0;

    // Level 1: XX00000000 (시/도)
    if (code.endsWith('00000000')) return 1;

    // Level 2: XXXXX00000 (시/군/구)
    if (code.endsWith('00000')) return 2;

    // Level 3: XXXXXXXXXX (읍/면/동) - doesn't end with 00000
    return 3;
  };

  const isLikelyRegionCode = (code: string): boolean => {
    return /^\d{5,}$/.test(code);
  };

  // Helper to check if region exists in options
  // (moved above with string-safe comparison)

  // Resolve full path from region options when value or options change
  useEffect(() => {
    if (!value || !regionOptions?.data?.length) {
      setInitialPath(null);
      return;
    }
    const entry = regionOptions.data.find((opt: any) => String(opt.code) === String(value));
    if (!entry || !entry.fullCode) {
      setInitialPath(null);
      return;
    }
    const parts = String(entry.fullCode)
      .split('-')
      .map((p) => String(p).trim())
      .filter(Boolean);
    setInitialPath(parts.length ? parts : null);
  }, [value, regionOptions]);

  // Reset applied flag if value changes to different code
  useEffect(() => {
    if (value && value !== appliedOnceRef.current) {
      appliedOnceRef.current = '';
    }
  }, [value]);

  // Step 1: Set L1 when value changes and topRegions are loaded
  useEffect(() => {
    if (!value || !isLikelyRegionCode(value)) {
      return;
    }

    const level = getRegionLevel(value);
    if (level >= 1 && topRegions?.data) {
      const l1FromPath = initialPath?.[0];
      const l1Code = l1FromPath || (level === 1 ? value : value.substring(0, 2) + '00000000');

      // Only set if L1 region exists in options
      if (hasRegion(topRegions.data, l1Code)) {
        setSelectedL1(toCode(l1Code));
        if (level === 1) {
          setSelectedL2('');
          setSelectedL3('');
          appliedOnceRef.current = value;
          // Propagate initial selection name once
          const name = getRegionName(l1Code, topRegions.data);
          onChange(toCode(l1Code), name);
        }
      }
    }
  }, [value, topRegions, initialPath, onChange]);

  // Step 2: Set L2 when L1 is set and L2 regions are loaded
  useEffect(() => {
    if (!value || !isLikelyRegionCode(value) || appliedOnceRef.current === value) {
      return;
    }

    const level = getRegionLevel(value);
    if (level >= 2 && selectedL1 && l2Regions?.data) {
      const l2FromPath = initialPath?.[1];
      const l2Code = l2FromPath || (level === 2 ? value : value.substring(0, 5) + '00000');

      // Only set if L2 region exists in options
      if (hasRegion(l2Regions.data, l2Code)) {
        setSelectedL2(toCode(l2Code));
        if (level === 2) {
          setSelectedL3('');
          appliedOnceRef.current = value;
          // Propagate initial selection name once
          const name = getRegionName(l2Code, l2Regions.data);
          onChange(toCode(l2Code), name);
        }
      }
    }
  }, [value, selectedL1, l2Regions, initialPath, onChange]);

  // Step 3: Set L3 when L2 is set and L3 regions are loaded
  useEffect(() => {
    if (!value || !isLikelyRegionCode(value) || appliedOnceRef.current === value) {
      return;
    }

    const level = getRegionLevel(value);
    if (level === 3 && selectedL2 && l3Regions?.data) {
      // Only set if L3 region exists in options
      const l3FromPath = initialPath?.[2] || value;
      if (selectedL3 === toCode(l3FromPath)) {
        return;
      }
      if (hasRegion(l3Regions.data, l3FromPath)) {
        setSelectedL3(toCode(l3FromPath));
        appliedOnceRef.current = value;
        // Propagate initial selection name once
        const name = getRegionName(l3FromPath, l3Regions.data);
        onChange(toCode(l3FromPath), name);
      }
    }
  }, [value, selectedL2, l3Regions, initialPath, selectedL3, onChange]);

  const handleL1Change = (code: string) => {
    const next = toCode(code);
    setSelectedL1(next);
    setSelectedL2('');
    setSelectedL3('');
    appliedOnceRef.current = ''; // Reset to allow new selection

    if (topRegions?.data) {
      const regionName = getRegionName(next, topRegions.data);
      onChange(next, regionName);
    }
  };

  const handleL2Change = (code: string) => {
    const next = toCode(code);
    setSelectedL2(next);
    setSelectedL3('');
    appliedOnceRef.current = ''; // Reset to allow new selection

    if (l2Regions?.data) {
      const regionName = getRegionName(next, l2Regions.data);
      onChange(next, regionName);
    }
  };

  const handleL3Change = (code: string) => {
    const next = toCode(code);
    setSelectedL3(next);
    appliedOnceRef.current = ''; // Reset to allow new selection

    if (l3Regions?.data) {
      const regionName = getRegionName(next, l3Regions.data);
      onChange(next, regionName);
    }
  };

  return (
    <div className="space-y-2">
      <Select value={selectedL1} onValueChange={handleL1Change} disabled={disabled || isLoadingTop}>
        <SelectTrigger>
          <SelectValue placeholder="시/도 선택" />
        </SelectTrigger>
        <SelectContent>
          {topRegions?.data
            ?.filter((r) => !!r.code)
            .map((region) => (
              <SelectItem key={String(region.code)} value={String(region.code)}>
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
            {l2Regions?.data
              ?.filter((r) => !!r.code)
              .map((region) => (
                <SelectItem key={String(region.code)} value={String(region.code)}>
                  {region.name}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      )}

      {selectedL2 && (l3Regions?.data?.length ?? 0) > 0 && (
        <Select
          value={selectedL3}
          onValueChange={handleL3Change}
          disabled={disabled || isLoadingL3}
        >
          <SelectTrigger>
            <SelectValue placeholder="읍/면/동 선택" />
          </SelectTrigger>
          <SelectContent>
            {l3Regions?.data
              ?.filter((r) => !!r.code)
              .map((region) => (
                <SelectItem key={String(region.code)} value={String(region.code)}>
                  {region.name}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
}
