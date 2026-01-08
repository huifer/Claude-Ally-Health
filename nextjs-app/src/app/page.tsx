'use client';

import { useState, useMemo, useEffect } from 'react';
import { HealthData } from '@/types/health-data';
import { SummaryCards } from '@/components/dashboard/SummaryCards';
import { TimeRangeSelector } from '@/components/dashboard/TimeRangeSelector';
import { DataFilterPanel } from '@/components/dashboard/DataFilterPanel';
import { WeightChart } from '@/components/charts/WeightChart';
import { LabResultsChart } from '@/components/charts/LabResultsChart';
import { SymptomChart } from '@/components/charts/SymptomChart';
import { MedicationChart } from '@/components/charts/MedicationChart';
import { Activity, TrendingUp, TestTubes, Pill } from 'lucide-react';

export default function HomePage() {
  const [healthData, setHealthData] = useState<Partial<HealthData> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState<{ start: string; end: string } | null>(null);

  // Load data on mount
  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo({ top: 0, behavior: 'smooth' });

    async function loadData() {
      try {
        setLoading(true);
        const response = await fetch('/api/data');
        const result = await response.json();

        if (result.success) {
          setHealthData(result.data);
        } else {
          setError(result.error || 'Failed to load data');
        }
      } catch (err) {
        console.error('Error loading health data:', err);
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Process symptom data
  const symptomData = useMemo(() => {
    if (!healthData?.cycleTracker?.cycles) return [];

    const symptomCounts: Record<string, number> = {};

    healthData.cycleTracker.cycles.forEach(cycle => {
      cycle.daily_logs?.forEach(log => {
        log.symptoms?.forEach(symptom => {
          symptomCounts[symptom] = (symptomCounts[symptom] || 0) + 1;
        });
      });
    });

    return Object.entries(symptomCounts)
      .map(([symptom, count]) => ({ symptom, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, [healthData]);

  // Process medication data
  const medicationData = useMemo(() => {
    // This is placeholder data - would come from actual medication records
    return [
      {
        name: '药物 A',
        adherence: 85,
        totalDoses: 30,
        takenDoses: 26,
        missedDoses: 4
      }
    ];
  }, []);

  // Get unique test names from lab results
  const uniqueTestNames = useMemo(() => {
    if (!healthData?.labResults) return [];

    const testSet = new Set<string>();
    healthData.labResults.forEach(result => {
      result.items?.forEach(item => {
        if (item.is_abnormal) {
          testSet.add(item.name);
        }
      });
    });

    return Array.from(testSet).slice(0, 5);
  }, [healthData]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6B6B] mb-4"></div>
            <p className="text-gray-600">加载健康数据中...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !healthData) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <Activity className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">数据加载错误</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>无法加载健康数据。请确保 data-example 目录存在且包含有效的 JSON 文件。</p>
                {error && <p className="mt-1">错误详情: {error}</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      {/* Page Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-macos-text-primary mb-2">
          概览
        </h1>
        <p className="text-macos-text-secondary">
          综合健康数据分析与趋势追踪
        </p>
      </div>

      {/* Summary Cards */}
      <section className="mb-6">
        <SummaryCards healthData={healthData} />
      </section>

      {/* Time Range Selector */}
      <section className="mb-6">
        <TimeRangeSelector onRangeChange={setSelectedTimeRange} />
      </section>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Weight Chart */}
        <div className="bg-macos-bg-card border border-macos-border rounded-macos shadow-macos p-6">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-macos-accent-coral" />
            <h2 className="text-lg font-semibold text-macos-text-primary">体重/BMI 趋势</h2>
          </div>
          {healthData.profile?.history && healthData.profile.history.length > 0 ? (
            <WeightChart data={healthData.profile.history} />
          ) : (
            <div className="flex items-center justify-center h-[400px] text-macos-text-muted">
              <p>暂无体重数据</p>
            </div>
          )}
        </div>

        {/* Lab Results Chart */}
        <div className="bg-macos-bg-card border border-macos-border rounded-macos shadow-macos p-6">
          <div className="flex items-center gap-2 mb-4">
            <TestTubes className="w-5 h-5 text-macos-accent-apricot" />
            <h2 className="text-lg font-semibold text-macos-text-primary">化验结果趋势</h2>
          </div>
          {healthData.labResults && healthData.labResults.length > 0 && uniqueTestNames.length > 0 ? (
            <LabResultsChart
              labResults={healthData.labResults}
              testNames={uniqueTestNames}
            />
          ) : (
            <div className="flex items-center justify-center h-[400px] text-macos-text-muted">
              <p>暂无化验数据</p>
            </div>
          )}
        </div>
      </div>

      {/* Secondary Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Symptom Chart */}
        <div className="bg-macos-bg-card border border-macos-border rounded-macos shadow-macos p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-macos-accent-mint" />
            <h2 className="text-lg font-semibold text-macos-text-primary">症状频率统计</h2>
          </div>
          {symptomData.length > 0 ? (
            <SymptomChart data={symptomData} type="bar" />
          ) : (
            <div className="flex items-center justify-center h-[400px] text-macos-text-muted">
              <p>暂无症状数据</p>
            </div>
          )}
        </div>

        {/* Medication Chart */}
        <div className="bg-macos-bg-card border border-macos-border rounded-macos shadow-macos p-6">
          <div className="flex items-center gap-2 mb-4">
            <Pill className="w-5 h-5 text-macos-accent-coral" />
            <h2 className="text-lg font-semibold text-macos-text-primary">药物依从性</h2>
          </div>
          {medicationData.length > 0 ? (
            <MedicationChart data={medicationData} type="gauge" />
          ) : (
            <div className="flex items-center justify-center h-[400px] text-macos-text-muted">
              <p>暂无用药数据</p>
            </div>
          )}
        </div>
      </div>

      {/* Detailed Data Sections */}
      <section className="space-y-6">
        {/* Lab Results Details */}
        {healthData.labResults && healthData.labResults.length > 0 && (
          <div className="bg-macos-bg-card border border-macos-border rounded-macos shadow-macos p-6">
            <h2 className="text-xl font-bold mb-4 text-macos-text-primary">化验结果详情</h2>
            <div className="space-y-4">
              {healthData.labResults.slice(0, 3).map((lab) => (
                <div key={lab.id} className="border-b border-macos-border pb-4 last:border-0">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold text-macos-text-primary">{lab.type}</p>
                      <p className="text-sm text-macos-text-secondary">
                        {lab.date} | {lab.hospital}
                      </p>
                    </div>
                    {lab.summary && (
                      <div className="text-right">
                        <p className="text-sm text-macos-text-secondary">{lab.summary.total_items} 项</p>
                        {lab.summary.abnormal_count > 0 && (
                          <p className="text-sm font-semibold text-macos-accent-coral">
                            {lab.summary.abnormal_count} 项异常
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                  {lab.items && lab.items.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                      {lab.items.slice(0, 6).map((item, index) => (
                        <div
                          key={index}
                          className={`text-sm p-2 rounded-macos ${
                            item.is_abnormal ? 'bg-red-50' : 'bg-gray-50'
                          }`}
                        >
                          <span className="font-medium">{item.name}:</span>{' '}
                          <span className={item.is_abnormal ? 'text-red-600 font-semibold' : ''}>
                            {item.value} {item.unit}
                          </span>
                          {item.is_abnormal && (
                            <span className="ml-1 text-red-600">
                              {item.abnormal_marker}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Development Status Notice */}
      <section className="mt-8 bg-macos-bg-secondary border border-macos-border rounded-macos shadow-macos p-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <Activity className="h-5 w-5 text-macos-accent-apricot" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-macos-text-primary mb-2">
              功能开发状态
            </h3>
            <div className="text-sm text-macos-text-secondary space-y-1">
              <p>✅ <strong>已完成</strong> - 基础仪表盘、统计卡片、交互式图表、AI 健康分析、报告生成</p>
              <p>🚧 <strong>开发中</strong> - 深度分析页面（女性健康、慢性病、预防保健）</p>
              <p>📋 <strong>计划中</strong> - 实时数据更新、离线支持、用户偏好设置</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
