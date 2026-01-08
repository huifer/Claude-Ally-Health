'use client';

import ReactECharts from 'echarts-for-react';
import { useMemo } from 'react';

interface MedicationData {
  name: string;
  adherence: number; // 0-100 percentage
  target?: number;
  totalDoses: number;
  takenDoses: number;
  missedDoses: number;
}

interface MedicationChartProps {
  data: MedicationData[];
  height?: string;
  type?: 'gauge' | 'bar' | 'pie';
}

export function MedicationChart({ data, height = '400px', type = 'bar' }: MedicationChartProps) {
  const option = useMemo(() => {
    if (!data || data.length === 0) {
      return {
        title: {
          text: '暂无药物数据',
          left: 'center',
          top: 'middle',
          textStyle: { fontSize: 16, color: '#999' }
        }
      };
    }

    if (type === 'gauge' && data.length === 1) {
      // Single medication gauge
      const medication = data[0];
      return {
        title: {
          text: `${medication.name} 依从性`,
          left: 'center',
          top: '5%',
          textStyle: { fontSize: 18, fontWeight: 'bold', color: '#1F2937' }
        },
        tooltip: {
          formatter: (params: any) => {
            return `${medication.name}<br/>依从性: <strong>${medication.adherence}%</strong><br/>` +
                   `已服用: ${medication.takenDoses}/${medication.totalDoses} 剂<br/>` +
                   `漏服: ${medication.missedDoses} 剂`;
          }
        },
        series: [
          {
            type: 'gauge',
            startAngle: 180,
            endAngle: 0,
            min: 0,
            max: 100,
            center: ['50%', '65%'],
            radius: '100%',
            itemStyle: {
              color: getAdherenceColor(medication.adherence)
            },
            progress: {
              show: true,
              roundCap: true,
              width: 18
            },
            pointer: {
              show: false
            },
            axisLine: {
              roundCap: true,
              lineStyle: {
                width: 18
              }
            },
            axisTick: {
              show: false
            },
            splitLine: {
              show: false
            },
            axisLabel: {
              show: false
            },
            title: {
              show: false
            },
            detail: {
              valueAnimation: true,
              formatter: '{value}%',
              fontSize: 48,
              fontWeight: 'bold',
              color: '#1F2937',
              offsetCenter: [0, '0%']
            },
            data: [
              {
                value: medication.adherence
              }
            ]
          }
        ]
      };
    }

    if (type === 'bar') {
      // Bar chart for multiple medications
      const names = data.map(d => d.name);
      const adherences = data.map(d => d.adherence);

      return {
        title: {
          text: '药物依从性统计',
          left: 'center',
          textStyle: { fontSize: 18, fontWeight: 'bold', color: '#1F2937' }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'shadow' },
          formatter: (params: any) => {
            const param = params[0];
            const medication = data[param.dataIndex];
            return `${medication.name}<br/>` +
                   `${param.marker} 依从性: <strong>${medication.adherence}%</strong><br/>` +
                   `已服用: ${medication.takenDoses}/${medication.totalDoses} 剂<br/>` +
                   `漏服: ${medication.missedDoses} 剂`;
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
          data: names,
          axisLine: { lineStyle: { color: '#9CA3AF' } },
          axisLabel: {
            color: '#6B7280',
            interval: 0,
            rotate: names.length > 3 ? 45 : 0
          }
        },
        yAxis: {
          type: 'value',
          name: '依从性 (%)',
          nameTextStyle: { color: '#6B7280' },
          min: 0,
          max: 100,
          axisLine: { lineStyle: { color: '#9CA3AF' } },
          axisLabel: { color: '#6B7280' },
          splitLine: { lineStyle: { color: '#E5E7EB' } }
        },
        series: [
          {
            type: 'bar',
            data: adherences.map((value, index) => ({
              value,
              itemStyle: {
                color: getAdherenceColor(value),
                borderRadius: [4, 4, 0, 0]
              }
            })),
            label: {
              show: true,
              position: 'top',
              formatter: '{c}%',
              color: '#6B7280',
              fontSize: 12
            },
            markLine: {
              symbol: 'none',
              lineStyle: { opacity: 0.5 },
              data: [
                {
                  yAxis: 80,
                  name: '目标线',
                  lineStyle: { type: 'dashed', color: '#6BCB77', width: 2 },
                  label: { formatter: '目标 80%', position: 'end', color: '#6BCB77' }
                }
              ]
            },
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      };
    }

    // Pie chart showing taken vs missed
    const totalTaken = data.reduce((sum, d) => sum + d.takenDoses, 0);
    const totalMissed = data.reduce((sum, d) => sum + d.missedDoses, 0);

    return {
      title: {
        text: '药物服用情况',
        left: 'center',
        textStyle: { fontSize: 18, fontWeight: 'bold', color: '#111827' }
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} 剂 ({d}%)'
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
            show: true,
            formatter: '{b}\n{c} 剂\n({d}%)',
            color: '#374151'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 16,
              fontWeight: 'bold'
            },
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          },
          data: [
            {
              value: totalTaken,
              name: '已服用',
              itemStyle: { color: '#6BCB77' }
            },
            {
              value: totalMissed,
              name: '漏服',
              itemStyle: { color: '#FF6B6B' }
            }
          ]
        }
      ]
    };
  }, [data, type]);

  function getAdherenceColor(adherence: number): string {
    if (adherence >= 80) return '#6BCB77'; // Green - Good
    if (adherence >= 60) return '#FFB347'; // Orange - Fair
    return '#FF6B6B'; // Red - Poor
  }

  return (
    <div className="w-full">
      <ReactECharts option={option} style={{ height, width: '100%' }} />
    </div>
  );
}
