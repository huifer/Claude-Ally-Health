'use client';

import { useHealthData } from './useHealthData';
import { LabResult } from '@/types/health-data';

export function useLabResultsData() {
  const { healthData, loading, error, refetch } = useHealthData();
  return {
    labResults: healthData?.labResults as LabResult[] | undefined,
    loading,
    error,
    refetch,
  };
}
