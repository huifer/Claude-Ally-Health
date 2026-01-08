'use client';

import ReactECharts from 'echarts-for-react';
import { useMemo } from 'react';

interface CorrelationMatrixProps {
  data: any;
  metrics: string[];
  height?: string;
}

// Calculate Pearson correlation coefficient
function pearsonCorrelation(x: number[], y: number[]): number {
  const n = Math.min(x.length, y.length);
  if (n === 0) return 0;

  const sumX = x.slice(0, n).reduce((a, b) => a + b, 0);
  const sumY = y.slice(0, n).reduce((a, b) => a + b, 0);
  const sumXY = x.slice(0, n).reduce((sum, xi, i) => sum + xi * y[i], 0);
  const sumX2 = x.slice(0, n).reduce((sum, xi) => sum + xi * xi, 0);
  const sumY2 = y.slice(0, n).reduce((sum, yi) => sum + yi * yi, 0);

  const numerator = n * sumXY - sumX * sumY;
  const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));

  return denominator === 0 ? 0 : numerator / denominator;
}

// Get metric values from data
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

// Get metric label
function getMetricLabel(metric: string): string {
  const labels: Record<string, string> = {
    weight: '体重',
    bmi: 'BMI',
    symptoms: '症状',
    lab_results: '化验结果'
  };
  return labels[metric] || metric;
}

export function CorrelationMatrix({ data, metrics, height = '400px' }: CorrelationMatrixProps) {
  const option = useMemo(() => {
    // Calculate correlation matrix
    const correlationData: [number, number, number][] = [];
    const metricLabels: string[] = [];

    // Filter out metrics that don't have data
    const validMetrics = metrics.filter(m => {
      const values = getMetricValues(data, m);
      return values.length > 1;
    });

    if (validMetrics.length < 2) {
      return {
        title: {
          text: '需要至少两个有效指标才能显示相关性分析',
          left: 'center',
          top: 'center',
          textStyle: { fontSize: 14, color: '#6B7280' }
        }
      };
    }

    // Build labels
    validMetrics.forEach(m => {
      metricLabels.push(getMetricLabel(m));
    });

    // Calculate correlations
    for (let i = 0; i < validMetrics.length; i++) {
      for (let j = 0; j < validMetrics.length; j++) {
        const valuesX = getMetricValues(data, validMetrics[i]);
        const valuesY = getMetricValues(data, validMetrics[j]);
        const correlation = pearsonCorrelation(valuesX, valuesY);
        correlationData.push([i, j, correlation]);
      }
    }

    return {
      title: {
        text: '指标相关性矩阵（皮尔逊相关系数）',
        left: 'center',
        textStyle: { fontSize: 16, fontWeight: 'bold', color: '#1F2937' }
      },
      tooltip: {
        position: 'top',
        formatter: (params: any) => {
          const [x, y, value] = params.data;
          const metricX = metricLabels[x];
          const metricY = metricLabels[y];
          const strength = Math.abs(value) > 0.7 ? '强' : Math.abs(value) > 0.4 ? '中' : '弱';
          const direction = value > 0 ? '正相关' : value < 0 ? '负相关' : '无相关';
          return `${metricX} vs ${metricY}<br/>相关系数: ${value.toFixed(3)}<br/>${direction} (${strength})`;
        }
      },
      grid: {
        height: '70%',
        top: '15%'
      },
      xAxis: {
        type: 'category',
        data: metricLabels,
        splitArea: { show: true },
        axisLabel: { fontSize: 12 }
      },
      yAxis: {
        type: 'category',
        data: metricLabels,
        splitArea: { show: true },
        axisLabel: { fontSize: 12 }
      },
      visualMap: {
        min: -1,
        max: 1,
        calculable: true,
        orient: 'horizontal',
        left: 'center',
        bottom: '5%',
        inRange: {
          color: ['#6BCB77', '#FFFBF0', '#FF6B6B']
        },
        textStyle: { fontSize: 11 }
      },
      series: [
        {
          name: '相关系数',
          type: 'heatmap',
          data: correlationData,
          label: {
            show: true,
            fontSize: 12,
            formatter: (params: any) => params.data[2].toFixed(2)
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };
  }, [data, metrics]);

  return (
    <div className="w-full">
      <ReactECharts option={option} style={{ height, width: '100%' }} />
    </div>
  );
}
