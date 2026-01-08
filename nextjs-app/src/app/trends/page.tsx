'use client';

import { useState, useMemo, useEffect } from 'react';
import { HealthData } from '@/types/health-data';
import { TrendComparisonChart } from '@/components/trends/TrendComparisonChart';
import { TrendPredictionChart } from '@/components/trends/TrendPredictionChart';
import { CorrelationMatrix } from '@/components/trends/CorrelationMatrix';
import { TrendInsights } from '@/components/trends/TrendInsights';
import { TimeRangeSelector } from '@/components/trends/TimeRangeSelector';
import { MetricSelector } from '@/components/trends/MetricSelector';
import { TrendingUp, Calendar, BarChart3, Lightbulb } from 'lucide-react';

type TimeRange = '3m' | '6m' | '1y' | 'all';
type MetricType = 'weight' | 'bmi' | 'symptoms' | 'lab_results' | 'medications';

export default function TrendsPage() {
  const [healthData, setHealthData] = useState<Partial<HealthData> | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRange>('1y');
  const [selectedMetrics, setSelectedMetrics] = useState<MetricType[]>(['weight', 'bmi']);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Load data
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const response = await fetch('/api/data');
        const result = await response.json();
        if (result.success) {
          setHealthData(result.data);
        }
      } catch (err) {
        console.error('Error loading data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Filter data by time range
  const filteredData = useMemo(() => {
    if (!healthData?.profile?.history) return null;

    const now = new Date();
    const ranges: Record<TimeRange, number> = {
      '3m': 90,
      '6m': 180,
      '1y': 365,
      'all': Infinity
    };

    const daysToInclude = ranges[selectedTimeRange];
    const cutoffDate = new Date(now.getTime() - daysToInclude * 24 * 60 * 60 * 1000);

    return {
      ...healthData,
      profile: {
        ...healthData.profile,
        history: healthData.profile.history.filter(
          entry => new Date(entry.date) >= cutoffDate
        )
      }
    };
  }, [healthData, selectedTimeRange]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6B6B] mb-4"></div>
            <p className="text-gray-600">加载趋势数据中...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!filteredData) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
          <p className="text-red-700">无法加载趋势数据</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-macos-accent-mint/12 rounded-lg">
            <TrendingUp className="w-6 h-6 text-macos-accent-mint" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-macos-text-primary">
              健康趋势分析
            </h1>
            <p className="text-macos-text-secondary">
              多维度数据对比与趋势预测
            </p>
          </div>
        </div>
      </header>

      {/* Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <TimeRangeSelector
          value={selectedTimeRange}
          onChange={setSelectedTimeRange}
        />
        <MetricSelector
          availableMetrics={['weight', 'bmi', 'symptoms', 'lab_results']}
          selectedMetrics={selectedMetrics}
          onChange={(metrics) => setSelectedMetrics(metrics as MetricType[])}
        />
      </div>

      {/* Trend Comparison Chart */}
      <section className="mb-6">
        <div className="bg-macos-bg-card border border-macos-border rounded-macos shadow-macos p-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-macos-accent-coral" />
            <h2 className="text-lg font-semibold text-macos-text-primary">
              多指标趋势对比
            </h2>
          </div>
          <TrendComparisonChart
            data={filteredData}
            metrics={selectedMetrics}
          />
        </div>
      </section>

      {/* Predictive Analysis */}
      <section className="mb-6">
        <div className="bg-macos-bg-card border border-macos-border rounded-macos shadow-macos p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-macos-accent-apricot" />
            <h2 className="text-lg font-semibold text-macos-text-primary">
              趋势预测（未来30天）
            </h2>
          </div>
          <TrendPredictionChart
            data={filteredData}
            metrics={selectedMetrics}
          />
        </div>
      </section>

      {/* Correlation Matrix */}
      {selectedMetrics.length > 1 && (
        <section className="mb-6">
          <div className="bg-macos-bg-card border border-macos-border rounded-macos shadow-macos p-6">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-macos-accent-mint" />
              <h2 className="text-lg font-semibold text-macos-text-primary">
                相关性分析
              </h2>
            </div>
            <CorrelationMatrix
              data={filteredData}
              metrics={selectedMetrics}
            />
          </div>
        </section>
      )}

      {/* AI Insights */}
      <section className="mb-6">
        <div className="bg-macos-bg-card border border-macos-border rounded-macos shadow-macos p-6">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="w-5 h-5 text-macos-accent-apricot" />
            <h2 className="text-lg font-semibold text-macos-text-primary">
              智能洞察
            </h2>
          </div>
          <TrendInsights
            data={filteredData}
            metrics={selectedMetrics}
            timeRange={selectedTimeRange}
          />
        </div>
      </section>

      {/* Development Notice */}
      <section className="bg-macos-bg-secondary border border-macos-border rounded-macos shadow-macos p-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <Lightbulb className="h-5 w-5 text-macos-accent-apricot" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-macos-text-primary mb-2">
              趋势分析功能说明
            </h3>
            <div className="text-sm text-macos-text-secondary space-y-1">
              <p>✅ <strong>已完成</strong> - 多指标趋势对比、时间范围筛选、基础趋势预测</p>
              <p>🚧 <strong>开发中</strong> - 高级预测算法、异常检测、个性化建议</p>
              <p>📋 <strong>计划中</strong> - 机器学习模型、健康风险评估、预警系统</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
