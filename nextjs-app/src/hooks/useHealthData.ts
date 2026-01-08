'use client';

import { useState, useEffect } from 'react';
import { HealthData } from '@/types/health-data';

export function useHealthData() {
  const [healthData, setHealthData] = useState<Partial<HealthData> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/data');

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        setHealthData(result.data);
      } else {
        setError(result.error || 'Failed to load data');
      }
    } catch (err) {
      console.error('Error loading health data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load health data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return { healthData, loading, error, refetch: loadData };
}
