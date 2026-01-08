'use client';

import ReactECharts from 'echarts-for-react';
import { useMemo } from 'react';

interface SymptomData {
  symptom: string;
  count: number;
  category?: string;
}

interface SymptomChartProps {
  data: SymptomData[];
  height?: string;
  type?: 'bar' | 'pie' | 'timeline';
}

export function SymptomChart({ data, height = '400px', type = 'bar' }: SymptomChartProps) {
  const option = useMemo(() => {
    if (!data || data.length === 0) {
      return {
        title: {
          text: '暂无症状数据',
          left: 'center',
          top: 'middle',
          textStyle: { fontSize: 16, color: '#999' }
        }
      };
    }

    // Sort by count
    const sortedData = [...data].sort((a, b) => b.count - a.count);
    const symptoms = sortedData.map(d => d.symptom);
    const counts = sortedData.map(d => d.count);

    if (type === 'bar') {
      return {
        title: {
          text: '症状频率统计',
          left: 'center',
          textStyle: { fontSize: 18, fontWeight: 'bold', color: '#1F2937' }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'shadow' },
          formatter: (params: any) => {
            const param = params[0];
            return `${param.name}<br/>${param.marker} <strong>${param.value}</strong> 次`;
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: symptoms,
          axisLine: { lineStyle: { color: '#9CA3AF' } },
          axisLabel: {
            color: '#6B7280',
            interval: 0,
            rotate: symptoms.length > 5 ? 45 : 0
          }
        },
        yAxis: {
          type: 'value',
          name: '次数',
          nameTextStyle: { color: '#6B7280' },
          axisLine: { lineStyle: { color: '#9CA3AF' } },
          axisLabel: { color: '#6B7280' },
          splitLine: { lineStyle: { color: '#E5E7EB' } }
        },
        series: [
          {
            type: 'bar',
            data: counts,
            itemStyle: {
              color: {
                type: 'linear',
                x: 0, y: 0, x2: 0, y2: 1,
                colorStops: [
                  { offset: 0, color: '#FF6B6B' },
                  { offset: 1, color: '#FF8787' }
                ]
              },
              borderRadius: [4, 4, 0, 0]
            },
            emphasis: {
              itemStyle: {
                color: {
                  type: 'linear',
                  x: 0, y: 0, x2: 0, y2: 1,
                  colorStops: [
                    { offset: 0, color: '#a78bfa' },
                    { offset: 1, color: '#818cf8' }
                  ]
                }
              }
            },
            label: {
              show: true,
              position: 'top',
              color: '#6B7280',
              fontSize: 12
            }
          }
        ]
      };
    }

    if (type === 'pie') {
      return {
        title: {
          text: '症状分布',
          left: 'center',
          textStyle: { fontSize: 18, fontWeight: 'bold', color: '#1F2937' }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c} 次 ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          top: 'middle',
          textStyle: { color: '#374151' }
        },
        series: [
          {
            type: 'pie',
            radius: ['40%', '70%'],
            center: ['60%', '50%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 20,
                fontWeight: 'bold',
                color: '#1F2937'
              }
            },
            labelLine: {
              show: false
            },
            data: sortedData.map((d, i) => ({
              value: d.count,
              name: d.symptom,
              itemStyle: {
                color: [
                  '#FF6B6B', '#FF8787', '#FFB347', '#4ECDC4',
                  '#6BCB77', '#FFA94D', '#FF6B6B', '#FFB347'
                ][i % 8]
              }
            }))
          }
        ]
      };
    }

    // Timeline chart (for cycle phases)
    return {
      title: {
        text: '症状时间线',
        left: 'center',
        textStyle: { fontSize: 18, fontWeight: 'bold', color: '#111827' }
      },
      tooltip: {
        trigger: 'axis',
        formatter: (params: any) => {
          const date = params[0]?.axisValue;
          let result = `<strong>${date}</strong><br/>`;
          params.forEach((param: any) => {
            result += `${param.marker} ${param.seriesName}: <strong>${param.value}</strong><br/>`;
          });
          return result;
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: symptoms,
        axisLine: { lineStyle: { color: '#9CA3AF' } },
        axisLabel: {
          color: '#6B7280',
          rotate: 45
        }
      },
      yAxis: {
        type: 'value',
        name: '次数',
        nameTextStyle: { color: '#6B7280' },
        axisLine: { lineStyle: { color: '#9CA3AF' } },
        axisLabel: { color: '#6B7280' },
        splitLine: { lineStyle: { color: '#E5E7EB' } }
      },
      series: [
        {
          type: 'line',
          data: counts,
          smooth: true,
          areaStyle: {
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(255, 107, 107, 0.3)' },
                { offset: 1, color: 'rgba(255, 135, 135, 0.05)' }
              ]
            }
          },
          itemStyle: { color: '#FF6B6B' },
          emphasis: {
            focus: 'series'
          }
        }
      ]
    };
  }, [data, type]);

  return (
    <div className="w-full">
      <ReactECharts option={option} style={{ height, width: '100%' }} />
    </div>
  );
}
