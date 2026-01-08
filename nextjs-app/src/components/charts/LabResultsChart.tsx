'use client';

import ReactECharts from 'echarts-for-react';
import { useMemo } from 'react';
import { LabResult } from '@/types/health-data';

interface LabResultsChartProps {
  labResults: LabResult[];
  testNames: string[];
  height?: string;
}

export function LabResultsChart({
  labResults,
  testNames,
  height = '400px'
}: LabResultsChartProps) {
  const option = useMemo(() => {
    if (!labResults || labResults.length === 0 || !testNames || testNames.length === 0) {
      return {
        title: {
          text: '暂无化验数据',
          left: 'center',
          top: 'middle',
          textStyle: { fontSize: 16, color: '#999' }
        }
      };
    }

    // Color palette for different tests
    const colors = [
      '#FF6B6B', '#FF6B6B', '#6BCB77', '#FFB347',
      '#FF8787', '#FFA94D', '#4ECDC4', '#FFD93D'
    ];

    // Process lab results for each test
    const series = testNames.map((testName, index) => {
      const dataPoints = labResults
        .filter(result =>
          result.items && result.items.some(item => item.name === testName)
        )
        .map(result => {
          const item = result.items!.find(i => i.name === testName)!;
          return {
            date: result.date,
            value: parseFloat(item.value) || 0,
            unit: item.unit,
            isAbnormal: item.is_abnormal,
            minRef: parseFloat(item.min_ref) || 0,
            maxRef: parseFloat(item.max_ref) || 0,
            hospital: result.hospital
          };
        })
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      const color = colors[index % colors.length];

      return {
        name: testName,
        type: 'line',
        data: dataPoints.map(d => d.value),
        dates: dataPoints.map(d => d.date),
        color: color,
        smooth: true,
        itemStyle: { color },
        // Mark abnormal points
        markPoint: {
          data: dataPoints
            .filter(d => d.isAbnormal)
            .map((d, i) => ({
              name: '异常',
              value: d.value,
              xAxis: dataPoints.findIndex(p => p.date === d.date),
              yAxis: d.value,
              itemStyle: { color: '#FF6B6B' }
            }))
        },
        // Reference range lines
        markLine: {
          symbol: 'none',
          lineStyle: { opacity: 0.5 },
          data: []
        },
        emphasis: {
          focus: 'series'
        }
      };
    });

    const allDates = series.length > 0 ? series[0].dates : [];
    const uniqueDates = Array.from(new Set(allDates)).sort();

    return {
      title: {
        text: '化验结果趋势',
        left: 'center',
        textStyle: { fontSize: 18, fontWeight: 'bold', color: '#1F2937' }
      },
      tooltip: {
        trigger: 'axis',
        formatter: (params: any) => {
          const date = params[0]?.axisValue;
          let result = `<strong>${date}</strong><br/>`;
          params.forEach((param: any) => {
            const marker = param.marker;
            const name = param.seriesName;
            const value = param.value;
            const color = value > 0 ? '#FF6B6B' : '#6BCB77';
            result += `${marker} ${name}: <strong style="color: ${color}">${value}</strong><br/>`;
          });
          return result;
        }
      },
      legend: {
        data: testNames,
        top: 40,
        textStyle: { color: '#374151' },
        type: 'scroll'
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '15%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: uniqueDates,
        boundaryGap: false,
        axisLine: { lineStyle: { color: '#9CA3AF' } },
        axisLabel: {
          color: '#6B7280',
          rotate: 45
        }
      },
      yAxis: {
        type: 'value',
        name: '数值',
        nameTextStyle: { color: '#6B7280' },
        axisLine: { lineStyle: { color: '#9CA3AF' } },
        axisLabel: { color: '#6B7280' },
        splitLine: { lineStyle: { color: '#E5E7EB' } }
      },
      series: series,
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
  }, [labResults, testNames]);

  return (
    <div className="w-full">
      <ReactECharts option={option} style={{ height, width: '100%' }} />
    </div>
  );
}
