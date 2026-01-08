'use client';

import { useHealthData } from './useHealthData';
import { VaccinationRecords } from '@/types/health-data';

export function useVaccinationsData() {
  const { healthData, loading, error, refetch } = useHealthData();
  return {
    vaccinations: healthData?.vaccinations as VaccinationRecords | undefined,
    loading,
    error,
    refetch,
  };
}
