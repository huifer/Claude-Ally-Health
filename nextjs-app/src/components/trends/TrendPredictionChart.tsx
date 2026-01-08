'use client';

import ReactECharts from 'echarts-for-react';
import { useMemo } from 'react';

interface TrendPredictionChartProps {
  data: any;
  metrics: string[];
  height?: string;
}

// Simple linear regression: y = mx + b
function linearRegression(data: number[]) {
  const n = data.length;
  if (n < 2) return { m: 0, b: data[0] || 0 };

  const xValues = Array.from({ length: n }, (_, i) => i);
  const sumX = xValues.reduce((a, b) => a + b, 0);
  const sumY = data.reduce((a, b) => a + b, 0);
  const sumXY = xValues.reduce((sum, x, i) => sum + x * data[i], 0);
  const sumX2 = xValues.reduce((sum, x) => sum + x * x, 0);

  const m = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const b = (sumY - m * sumX) / n;

  return { m, b };
}

// Predict future values using linear regression
function predictValues(data: number[], days: number) {
  const { m, b } = linearRegression(data);
  const predictions: number[] = [];

  for (let i = 0; i < days; i++) {
    const x = data.length + i;
    predictions.push(m * x + b);
  }

  return predictions;
}

// Calculate confidence interval (simplified)
function calculateConfidenceInterval(data: number[], predictions: number[], stdDevMultiplier = 1.5) {
  const mean = data.reduce((a, b) => a + b, 0) / data.length;
  const variance = data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / data.length;
  const stdDev = Math.sqrt(variance);

  return predictions.map(p => [
    p - stdDev * stdDevMultiplier,
    p + stdDev * stdDevMultiplier
  ]);
}

// Generate future date labels
function generateFutureDates(lastDate: string, days: number): string[] {
  const dates: string[] = [];
  const last = new Date(lastDate);

  for (let i = 1; i <= days; i++) {
    const date = new Date(last);
    date.setDate(date.getDate() + i);
    dates.push(date.toISOString().split('T')[0]);
  }

  return dates;
}

export function TrendPredictionChart({ data, metrics, height = '400px' }: TrendPredictionChartProps) {
  const option = useMemo(() => {
    const history = data?.profile?.history || [];
    if (history.length === 0) {
      return {
        title: {
          text: '暂无足够数据进行预测',
          left: 'center',
          top: 'center',
          textStyle: { fontSize: 16, color: '#6B7280' }
        }
      };
    }

    const historicalDates = history.map((h: any) => h.date);
    const futureDates = generateFutureDates(historicalDates[historicalDates.length - 1], 30);
    const allDates = [...historicalDates, ...futureDates];

    const series: any[] = [];
    let yAxisIndex = 0;

    if (metrics.includes('weight') && history.length > 0) {
      const weightData = history.map((h: any) => h.weight);
      const weightPredictions = predictValues(weightData, 30);
      const confidenceInterval = calculateConfidenceInterval(weightData, weightPredictions);

      series.push(
        {
          name: '历史体重',
          type: 'scatter',
          data: weightData.map((w: number, i: number) => [historicalDates[i], w]),
          yAxisIndex: 0,
          itemStyle: { color: '#FF6B6B' },
          symbolSize: 6
        },
        {
          name: '趋势线',
          type: 'line',
          data: [...weightData, ...weightPredictions],
          smooth: true,
          yAxisIndex: 0,
          itemStyle: { color: '#FFB347' },
          lineStyle: { type: 'solid', width: 2 }
        },
        {
          name: '预测范围',
          type: 'line',
          data: weightData.map((_1: number, i: number) => null).concat(
            confidenceInterval.map((ci: number[], i: number) => [futureDates[i], ci[1]])
          ),
          yAxisIndex: 0,
          itemStyle: { color: '#6BCB77' },
          lineStyle: { type: 'dashed', opacity: 0.5 },
          showSymbol: false
        },
        {
          name: '预测下限',
          type: 'line',
          data: weightData.map((_2: number, i: number) => null as any).concat(
            confidenceInterval.map((ci, i) => [futureDates[i], ci[0]])
          ),
          yAxisIndex: 0,
          itemStyle: { color: '#6BCB77' },
          lineStyle: { type: 'dashed', opacity: 0.5 },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(107, 203, 119, 0.2)' },
                { offset: 1, color: 'rgba(107, 203, 119, 0.05)' }
              ]
            }
          },
          showSymbol: false
        }
      );
    }

    return {
      title: {
        text: '趋势预测（基于线性回归）',
        left: 'center',
        textStyle: { fontSize: 16, fontWeight: 'bold', color: '#1F2937' }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'cross' },
        formatter: (params: any) => {
          let result = `${params[0]?.axisValue}<br/>`;
          params.forEach((param: any) => {
            if (param.value && param.value[1] !== undefined) {
              result += `${param.marker}${param.seriesName}: ${param.value[1].toFixed(1)} kg<br/>`;
            } else if (param.value !== null) {
              result += `${param.marker}${param.seriesName}: ${param.value.toFixed(1)} kg<br/>`;
            }
          });
          return result;
        }
      },
      legend: {
        data: ['历史体重', '趋势线', '预测范围'],
        top: 40
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '10%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: allDates,
        axisLabel: {
          rotate: 45,
          formatter: (value: string) => {
            const date = new Date(value);
            return `${date.getMonth() + 1}/${date.getDate()}`;
          }
        }
      },
      yAxis: [
        {
          type: 'value',
          name: '体重 (kg)',
          axisLine: { show: true, lineStyle: { color: '#FF6B6B' } },
          axisLabel: { formatter: '{value} kg' }
        }
      ],
      series: series,
      dataZoom: [
        { type: 'inside', start: 50, end: 100 }
      ]
    };
  }, [data, metrics]);

  return (
    <div className="w-full">
      <ReactECharts option={option} style={{ height, width: '100%' }} />
    </div>
  );
}
