'use client';

import { useHealthData } from './useHealthData';
import { PregnancyTracker } from '@/types/health-data';

export function usePregnancyData() {
  const { healthData, loading, error, refetch } = useHealthData();
  return {
    pregnancyTracker: healthData?.pregnancyTracker as PregnancyTracker | undefined,
    loading,
    error,
    refetch,
  };
}
