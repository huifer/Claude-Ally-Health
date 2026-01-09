// Analytics Type Definitions

// Time Series Data for Analytics
export interface TimeSeriesDataPoint {
  date: string;
  timestamp: number;
  value: number;
  category?: string;
  metadata?: Record<string, any>;
}

// Aggregation Types
export type AggregationPeriod = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';

// Trend Analysis Types
export interface TrendAnalysis {
  period: string;
  startValue: number;
  endValue: number;
  change: number;
  changePercent: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  movingAverage?: number[];
  linearRegression?: {
    slope: number;
    intercept: number;
    r2: number;
  };
}

// Health Metrics for Trends
export interface HealthMetric {
  name: string;
  value: number;
  unit: string;
  date: string;
  category: 'vital' | 'lab' | 'anthropometric' | 'symptom';
  referenceRange?: {
    min: number;
    max: number;
  };
  isAbnormal?: boolean;
}

// Lab Trend Specific
export interface LabTrendData {
  testName: string;
  unit: string;
  referenceRange: { min: number; max: number };
  history: Array<{
    date: string;
    value: number;
    isAbnormal: boolean;
    hospital?: string;
  }>;
  trend: TrendAnalysis;
  abnormalCount: number;
  totalCount: number;
}

// Statistics Summary
export interface HealthStatistics {
  period: {
    start: string;
    end: string;
    type: AggregationPeriod;
  };
  metrics: {
    totalTests: number;
    abnormalTests: number;
    normalTests: number;
    screeningCompliance: number;
    averageScore: number;
  };
  distributions: {
    testType: Record<string, number>;
    abnormalCategories: Record<string, number>;
    hospitalVisits: Record<string, number>;
  };
}

// Export Configuration
export interface ExportConfig {
  dataType: 'health-trends' | 'lab-trends' | 'statistics' | 'all';
  dateRange: {
    start: string;
    end: string;
  };
  format: 'csv' | 'json' | 'pdf';
  includeCharts: boolean;
  includeSummary: boolean;
}

// Filter Options
export interface AnalyticsFilters {
  dateRange: {
    type: 'preset' | 'custom';
    preset?: '3M' | '6M' | '1Y' | '3Y' | 'ALL';
    start?: string;
    end?: string;
  };
  metrics: string[];
  categories: string[];
  aggregation: AggregationPeriod;
}
