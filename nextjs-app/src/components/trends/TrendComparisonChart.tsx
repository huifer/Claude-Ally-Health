'use client';

import ReactECharts from 'echarts-for-react';
import { useMemo } from 'react';

interface TrendComparisonChartProps {
  data: any;
  metrics: string[];
  height?: string;
}

export function TrendComparisonChart({ data, metrics, height = '500px' }: TrendComparisonChartProps) {
  const option = useMemo(() => {
    // Get dates from profile history
    const dates = data?.profile?.history?.map((h: any) => h.date) || [];

    // Build series for each metric
    const series: any[] = [];
    const yAxis: any[] = [];

    if (metrics.includes('weight') && data?.profile?.history) {
      const weightData = data.profile.history.map((h: any) => h.weight);
      series.push({
        name: '体重 (kg)',
        type: 'line',
        data: weightData,
        smooth: true,
        yAxisIndex: 0,
        itemStyle: { color: '#FF6B6B' },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(255, 107, 107, 0.3)' },
              { offset: 1, color: 'rgba(255, 107, 107, 0.05)' }
            ]
          }
        }
      });
    }

    if (metrics.includes('bmi') && data?.profile?.history) {
      const bmiData = data.profile.history.map((h: any) => {
        const weight = h.weight;
        const height = data.profile?.height || 170;
        return (weight / ((height / 100) ** 2)).toFixed(1);
      });
      series.push({
        name: 'BMI',
        type: 'line',
        data: bmiData,
        smooth: true,
        yAxisIndex: 1,
        itemStyle: { color: '#FFB347' },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(255, 179, 71, 0.3)' },
              { offset: 1, color: 'rgba(255, 179, 71, 0.05)' }
            ]
          }
        }
      });
    }

    // Add Y-axes for weight and BMI
    if (metrics.includes('weight')) {
      yAxis.push({
        type: 'value',
        name: '体重 (kg)',
        position: 'left',
        axisLine: { show: true, lineStyle: { color: '#FF6B6B' } },
        axisLabel: { formatter: '{value} kg' }
      });
    }
    if (metrics.includes('bmi')) {
      yAxis.push({
        type: 'value',
        name: 'BMI',
        position: 'right',
        axisLine: { show: true, lineStyle: { color: '#FFB347' } },
        axisLabel: { formatter: '{value}' }
      });
    }

    // Fallback if no valid metrics
    if (series.length === 0) {
      return {
        title: {
          text: '请选择要显示的指标',
          left: 'center',
          top: 'center',
          textStyle: { fontSize: 16, color: '#6B7280' }
        }
      };
    }

    return {
      title: {
        text: '健康指标趋势对比',
        left: 'center',
        textStyle: { fontSize: 16, fontWeight: 'bold', color: '#1F2937' }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'cross' }
      },
      legend: {
        data: series.map(s => s.name),
        top: 40
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '15%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: dates,
        boundaryGap: false
      },
      yAxis: yAxis.length > 0 ? yAxis : [{ type: 'value' }],
      series: series,
      dataZoom: [
        { type: 'inside', start: 0, end: 100 },
        { start: 0, end: 100, height: 20, bottom: 10 }
      ]
    };
  }, [data, metrics]);

  return (
    <div className="w-full">
      <ReactECharts option={option} style={{ height, width: '100%' }} />
    </div>
  );
}
