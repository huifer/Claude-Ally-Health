'use client';

import { useHealthData } from './useHealthData';
import { AllergyRecord } from '@/types/health-data';

export function useAllergiesData() {
  const { healthData, loading, error, refetch } = useHealthData();
  return {
    allergies: healthData?.allergies as AllergyRecord | undefined,
    loading,
    error,
    refetch
  };
}
