'use client';

import { useHealthData } from './useHealthData';
import { MenopauseTracker } from '@/types/health-data';

export function useMenopauseData() {
  const { healthData, loading, error, refetch } = useHealthData();
  return {
    menopauseTracker: healthData?.menopauseTracker as MenopauseTracker | undefined,
    loading,
    error,
    refetch,
  };
}
