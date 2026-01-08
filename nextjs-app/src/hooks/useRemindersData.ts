'use client';

import { useHealthData } from './useHealthData';
import { Reminders } from '@/types/health-data';

export function useRemindersData() {
  const { healthData, loading, error, refetch } = useHealthData();
  return {
    reminders: healthData?.reminders as Reminders | undefined,
    loading,
    error,
    refetch
  };
}
