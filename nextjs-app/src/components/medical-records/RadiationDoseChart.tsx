'use client';

import { useEffect, useRef } from 'react';
import { RadiationRecords } from '@/types/health-data';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts/core';

interface RadiationDoseChartProps {
  data: RadiationRecords;
}

export function RadiationDoseChart({ data }: RadiationDoseChartProps) {
  const chartRef = useRef<ReactECharts>(null);

  // Group records by year
  const yearGroups = data.records.reduce((acc, record) => {
    const year = record.date.split('-')[0];
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(record);
    return acc;
  }, {} as Record<string, typeof data.records>);

  const years = Object.keys(yearGroups).sort();
  const yearlyDoses = years.map(year =>
    yearGroups[year].reduce((sum, r) => sum + r.effective_dose, 0)
  );

  const option = {
    title: {
      text: '年度辐射剂量统计',
      left: 'center',
      textStyle: {
        fontSize: 16,
        fontWeight: 600,
        color: '#374151'
      }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      formatter: (params: any) => {
        const param = params[0];
        const year = param.name;
        const dose = param.value.toFixed(3);
        const records = yearGroups[year].length;
        return `
          <div class="font-semibold mb-1">${year}年</div>
          <div>总剂量: ${dose} mSv</div>
          <div>检查次数: ${records}次</div>
        `;
      }
    },
    xAxis: {
      type: 'category',
      data: years,
      axisLabel: {
        fontSize: 12,
        color: '#6B7280'
      }
    },
    yAxis: {
      type: 'value',
      name: '剂量 (mSv)',
      axisLabel: {
        fontSize: 12,
        color: '#6B7280',
        formatter: (value: number) => value.toFixed(2)
      },
      splitLine: {
        lineStyle: {
          color: '#E5E7EB'
        }
      }
    },
    series: [
      {
        name: '辐射剂量',
        type: 'bar',
        data: yearlyDoses,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#FF6B6B' },
            { offset: 1, color: '#FFB347' }
          ]),
          borderRadius: [4, 4, 0, 0]
        },
        emphasis: {
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#FF8C8C' },
              { offset: 1, color: '#FFC77C' }
            ])
          }
        },
        label: {
          show: true,
          position: 'top',
          fontSize: 11,
          color: '#374151',
          formatter: (value: number) => value.toFixed(3)
        }
      }
    ],
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    }
  };

  return (
    <div className="bg-macos-bg-card p-6 rounded-2xl border border-macos-border">
      <ReactECharts
        ref={chartRef}
        option={option}
        style={{ height: '300px' }}
        opts={{ renderer: 'svg' }}
      />
    </div>
  );
}
