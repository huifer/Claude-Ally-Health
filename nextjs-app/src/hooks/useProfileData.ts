'use client';

import { useHealthData } from './useHealthData';
import { Profile } from '@/types/health-data';

export function useProfileData() {
  const { healthData, loading, error, refetch } = useHealthData();
  return {
    profile: healthData?.profile as Profile | undefined,
    loading,
    error,
    refetch
  };
}
