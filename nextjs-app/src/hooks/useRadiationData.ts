'use client';

import { useHealthData } from './useHealthData';
import { RadiationRecords } from '@/types/health-data';

export function useRadiationData() {
  const { healthData, loading, error, refetch } = useHealthData();
  return {
    radiationRecords: healthData?.radiationRecords as RadiationRecords | undefined,
    loading,
    error,
    refetch,
  };
}
