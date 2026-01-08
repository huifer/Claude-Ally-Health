'use client';

import { useMemo } from 'react';
import { TrendingUp, TrendingDown, Minus, AlertCircle, Lightbulb } from 'lucide-react';

interface TrendInsightsProps {
  data: any;
  metrics: string[];
  timeRange: string;
}

// Analyze trends for a single metric
function analyzeTrend(data: number[]) {
  if (data.length < 2) {
    return { trend: 'stable' as const, change: 0, changePercent: 0, currentValue: data[0] || 0 };
  }

  const firstValue = data[0];
  const lastValue = data[data.length - 1];
  const change = lastValue - firstValue;
  const changePercent = firstValue !== 0 ? (change / firstValue) * 100 : 0;

  let trend: 'up' | 'down' | 'stable' = 'stable';
  if (Math.abs(changePercent) > 5) {
    trend = changePercent > 0 ? 'up' : 'down';
  }

  return {
    trend,
    change,
    changePercent: Math.abs(changePercent),
    currentValue: lastValue
  };
}

// Get metric configuration
function getMetricConfig(metric: string) {
  const configs: Record<string, { label: string; unit: string; format?: (v: number) => string }> = {
    weight: { label: '体重', unit: 'kg' },
    bmi: { label: 'BMI', unit: '', format: (v: number) => v.toFixed(1) },
    symptoms: { label: '症状频率', unit: '次' },
    lab_results: { label: '化验指标', unit: '' }
  };
  return configs[metric] || { label: metric, unit: '' };
}

// Get metric values
function getMetricValues(data: any, metric: string): number[] {
  if (metric === 'weight' && data?.profile?.history) {
    return data.profile.history.map((h: any) => h.weight).filter(Boolean);
  }

  if (metric === 'bmi' && data?.profile?.history) {
    const height = data.profile?.height || 170;
    return data.profile.history.map((h: any) => {
      const weight = h.weight;
      if (!weight) return NaN;
      return weight / ((height / 100) ** 2);
    }).filter((v: number) => !isNaN(v));
  }

  return [];
}

// Generate insights based on trends
function generateInsights(
  data: any,
  metrics: string[],
  timeRange: string
) {
  const insights: { type: 'warning' | 'info'; title: string; description: string }[] = [];

  const weightValues = getMetricValues(data, 'weight');
  const bmiValues = getMetricValues(data, 'bmi');

  // Weight trend analysis
  if (weightValues.length >= 2 && metrics.includes('weight')) {
    const weightTrend = analyzeTrend(weightValues);
    if (weightTrend.trend === 'up' && weightTrend.changePercent > 10) {
      insights.push({
        type: 'warning',
        title: '体重显著增加',
        description: `在过去${timeRange === 'all' ? '记录期间' : timeRange === '3m' ? '3个月' : timeRange === '6m' ? '6个月' : '1年'}中，体重增加了${weightTrend.changePercent.toFixed(1)}%。建议关注饮食和运动习惯。`
      });
    } else if (weightTrend.trend === 'down' && weightTrend.changePercent > 10) {
      insights.push({
        type: 'warning',
        title: '体重显著下降',
        description: `体重下降了${weightTrend.changePercent.toFixed(1)}%。如果这是非计划的减重，建议咨询医生。`
      });
    }
  }

  // BMI analysis
  if (bmiValues.length > 0 && metrics.includes('bmi')) {
    const currentBMI = bmiValues[bmiValues.length - 1];
    if (currentBMI > 24) {
      insights.push({
        type: 'info',
        title: 'BMI 偏高',
        description: `当前 BMI 为 ${currentBMI.toFixed(1)}，属于超重范围。建议保持均衡饮食和规律运动。`
      });
    } else if (currentBMI < 18.5) {
      insights.push({
        type: 'info',
        title: 'BMI 偏低',
        description: `当前 BMI 为 ${currentBMI.toFixed(1)}，属于体重过轻范围。建议增加营养摄入。`
      });
    }
  }

  // General positive trend
  if (weightValues.length >= 2 && metrics.includes('weight')) {
    const weightTrend = analyzeTrend(weightValues);
    if (weightTrend.trend === 'stable' && Math.abs(weightTrend.changePercent) < 3) {
      insights.push({
        type: 'info',
        title: '体重保持稳定',
        description: '体重变化在正常范围内（±3%），说明体重管理良好。继续保持当前的健康习惯。'
      });
    }
  }

  return insights;
}

export function TrendInsights({ data, metrics, timeRange }: TrendInsightsProps) {
  // Analyze trends for all metrics
  const trendAnalysis = useMemo(() => {
    const analysis: Record<string, any> = {};

    metrics.forEach(metric => {
      const values = getMetricValues(data, metric);
      if (values.length > 0) {
        analysis[metric] = analyzeTrend(values);
      }
    });

    return analysis;
  }, [data, metrics]);

  // Generate contextual insights
  const insights = useMemo(() => {
    return generateInsights(data, metrics, timeRange);
  }, [data, metrics, timeRange]);

  if (Object.keys(trendAnalysis).length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-macos-text-muted">暂无足够的数据进行分析</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Trend Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.map(metric => {
          const analysis = trendAnalysis[metric];
          if (!analysis) return null;

          const config = getMetricConfig(metric);
          const displayValue = config.format ? config.format(analysis.currentValue) : analysis.currentValue;

          return (
            <div key={metric} className="bg-macos-bg-secondary rounded-macos p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-macos-text-primary">
                  {config.label}
                </h3>
                {analysis.trend === 'up' ? (
                  <TrendingUp className="w-4 h-4 text-macos-accent-coral" />
                ) : analysis.trend === 'down' ? (
                  <TrendingDown className="w-4 h-4 text-macos-accent-mint" />
                ) : (
                  <Minus className="w-4 h-4 text-macos-text-muted" />
                )}
              </div>
              <p className="text-2xl font-bold text-macos-text-primary mb-1">
                {displayValue}
                {config.unit && <span className="text-sm font-normal ml-1">{config.unit}</span>}
              </p>
              <p className={`text-sm ${analysis.change >= 0 ? 'text-macos-accent-coral' : 'text-macos-accent-mint'}`}>
                {analysis.change >= 0 ? '+' : ''}{analysis.change.toFixed(1)} {config.unit}
                <span className="text-macos-text-muted ml-2">
                  ({analysis.changePercent >= 0 ? '+' : ''}{analysis.changePercent.toFixed(1)}%)
                </span>
              </p>
            </div>
          );
        })}
      </div>

      {/* Detailed Insights */}
      {insights.length > 0 && (
        <div className="space-y-3 mt-6">
          <h3 className="font-semibold text-macos-text-primary mb-3">
            智能分析
          </h3>

          {insights.map((insight, index) => (
            <div key={index} className="flex items-start gap-3 p-3 bg-macos-bg-secondary rounded-macos">
              {insight.type === 'warning' ? (
                <AlertCircle className="w-5 h-5 text-macos-accent-apricot flex-shrink-0 mt-0.5" />
              ) : (
                <Lightbulb className="w-5 h-5 text-macos-accent-mint flex-shrink-0 mt-0.5" />
              )}
              <div>
                <h4 className="font-medium text-macos-text-primary mb-1">
                  {insight.title}
                </h4>
                <p className="text-sm text-macos-text-secondary">
                  {insight.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
