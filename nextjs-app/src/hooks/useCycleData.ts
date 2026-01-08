'use client';

import { useHealthData } from './useHealthData';
import { CycleTracker } from '@/types/health-data';

export function useCycleData() {
  const { healthData, loading, error, refetch } = useHealthData();
  return {
    cycleTracker: healthData?.cycleTracker as CycleTracker | undefined,
    loading,
    error,
    refetch,
  };
}
