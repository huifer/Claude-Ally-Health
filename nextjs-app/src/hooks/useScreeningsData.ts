'use client';

import { useHealthData } from './useHealthData';
import { ScreeningTracker } from '@/types/health-data';

export function useScreeningsData() {
  const { healthData, loading, error, refetch } = useHealthData();
  return {
    screeningTracker: healthData?.screeningTracker as ScreeningTracker | undefined,
    loading,
    error,
    refetch,
  };
}
