'use client';

import ReactECharts from 'echarts-for-react';
import { useMemo } from 'react';

interface WeightDataPoint {
  date: string;
  weight: number;
  bmi: number;
}

interface WeightChartProps {
  data: WeightDataPoint[];
  height?: string;
}

export function WeightChart({ data, height = '400px' }: WeightChartProps) {
  const option = useMemo(() => {
    if (!data || data.length === 0) {
      return {
        title: {
          text: '暂无数据',
          left: 'center',
          top: 'middle',
          textStyle: { fontSize: 16, color: '#999' }
        }
      };
    }

    const dates = data.map(d => d.date);
    const weights = data.map(d => d.weight);
    const bmis = data.map(d => d.bmi);

    return {
      title: {
        text: '体重/BMI 变化趋势',
        left: 'center',
        textStyle: { fontSize: 18, fontWeight: 'bold', color: '#1F2937' }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'cross' },
        formatter: (params: any) => {
          const date = params[0]?.axisValue;
          let result = `<strong>${date}</strong><br/>`;
          params.forEach((param: any) => {
            result += `${param.marker} ${param.seriesName}: <strong>${param.value}</strong>`;
            if (param.seriesName === '体重') {
              result += ' kg';
            } else {
              result += ` (${getBMIStatus(param.value)})`;
            }
            result += '<br/>';
          });
          return result;
        }
      },
      legend: {
        data: ['体重', 'BMI'],
        top: 40,
        textStyle: { color: '#374151' }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: dates,
        boundaryGap: false,
        axisLine: { lineStyle: { color: '#9CA3AF' } },
        axisLabel: { color: '#6B7280' }
      },
      yAxis: [
        {
          type: 'value',
          name: '体重 (kg)',
          position: 'left',
          nameTextStyle: { color: '#6B7280' },
          axisLine: { lineStyle: { color: '#9CA3AF' } },
          axisLabel: { color: '#6B7280' },
          splitLine: { lineStyle: { color: '#E5E7EB' } }
        },
        {
          type: 'value',
          name: 'BMI',
          position: 'right',
          nameTextStyle: { color: '#6B7280' },
          axisLine: { lineStyle: { color: '#9CA3AF' } },
          axisLabel: { color: '#6B7280' },
          splitLine: { show: false }
        }
      ],
      series: [
        {
          name: '体重',
          type: 'line',
          data: weights,
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
          },
          emphasis: {
            focus: 'series'
          }
        },
        {
          name: 'BMI',
          type: 'line',
          data: bmis,
          smooth: true,
          yAxisIndex: 1,
          itemStyle: { color: '#FFB347' },
          markLine: {
            symbol: 'none',
            data: [
              {
                yAxis: 18.5,
                name: 'BMI 下限',
                lineStyle: { type: 'dashed', color: '#6BCB77', width: 2 },
                label: { formatter: '偏瘦 18.5', position: 'end', color: '#6BCB77' }
              },
              {
                yAxis: 24,
                name: 'BMI 上限',
                lineStyle: { type: 'dashed', color: '#FFB347', width: 2 },
                label: { formatter: '超重 24', position: 'end', color: '#FFB347' }
              },
              {
                yAxis: 28,
                name: '肥胖线',
                lineStyle: { type: 'dashed', color: '#FF6B6B', width: 2 },
                label: { formatter: '肥胖 28', position: 'end', color: '#FF6B6B' }
              }
            ]
          },
          emphasis: {
            focus: 'series'
          }
        }
      ],
      dataZoom: [
        {
          type: 'inside',
          start: 0,
          end: 100
        },
        {
          start: 0,
          end: 100,
          height: 20,
          bottom: 10
        }
      ]
    };
  }, [data]);

  function getBMIStatus(bmi: number): string {
    if (bmi < 18.5) return '偏瘦';
    if (bmi < 24) return '正常';
    if (bmi < 28) return '超重';
    return '肥胖';
  }

  return (
    <div className="w-full">
      <ReactECharts option={option} style={{ height, width: '100%' }} />
    </div>
  );
}
