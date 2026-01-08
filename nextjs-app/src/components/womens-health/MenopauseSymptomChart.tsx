'use client';

import { useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { TrendingUp, BarChart3, Calendar, GitMerge, Activity } from 'lucide-react';
import { MenopauseTracker } from '@/types/health-data';
import * as echarts from 'echarts/core';

interface MenopauseSymptomChartProps {
  data: MenopauseTracker;
}

type ViewMode = 'timeline' | 'frequency' | 'severity' | 'correlation';

export function MenopauseSymptomChart({ data }: MenopauseSymptomChartProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('timeline');

  // Get symptoms from tracker
  const symptoms = data.menopause_tracking?.symptoms || [];

  // Group symptoms by date
  const symptomsByDate = symptoms.reduce((acc, symptom) => {
    const date = symptom.date.substring(0, 7); // YYYY-MM
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(symptom);
    return acc;
  }, {} as Record<string, typeof symptoms>);

  // Prepare timeline data
  const timelineData = Object.entries(symptomsByDate)
    .map(([date, symptomList]) => ({
      date,
      count: symptomList.length,
      symptoms: symptomList,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));

  // Symptom frequency data
  const frequencyData = symptoms.reduce((acc, symptom) => {
    const key = symptom.symptom;
    if (!acc[key]) {
      acc[key] = { count: 0, totalSeverity: 0 };
    }
    acc[key].count++;
    acc[key].totalSeverity += symptom.severity === 'mild' ? 1 : symptom.severity === 'moderate' ? 2 : 3;
    return acc;
  }, {} as Record<string, { count: number; totalSeverity: number }>);

  const frequencyList = Object.entries(frequencyData)
    .map(([name, data]) => ({
      name,
      count: data.count,
      avgSeverity: data.totalSeverity / data.count,
    }))
    .sort((a, b) => b.count - a.count);

  // Severity distribution
  const severityDistribution = symptoms.reduce(
    (acc, symptom) => {
      const key = symptom.severity as keyof typeof acc;
      if (key in acc) {
        acc[key]++;
      }
      return acc;
    },
    { mild: 0, moderate: 0, severe: 0 }
  );

  // Chart options
  const getTimelineOption = () => ({
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => {
        const data = params[0];
        const point = timelineData[data.dataIndex];
        return `
          <div class="font-semibold">${point.date}</div>
          <div>症状数量: ${point.count}</div>
        `;
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '10%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: timelineData.map((d) => d.date),
      axisLabel: {
        fontSize: 11,
        rotate: timelineData.length > 6 ? 45 : 0,
      },
    },
    yAxis: {
      type: 'value',
      name: '症状数量',
    },
    series: [
      {
        type: 'line',
        data: timelineData.map((d) => d.count),
        smooth: true,
        itemStyle: {
          color: '#A78BFA',
        },
        areaStyle: {
          color: new (echarts as any).graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(167, 139, 250, 0.3)' },
            { offset: 1, color: 'rgba(167, 139, 250, 0.05)' },
          ]),
        },
      },
    ],
  });

  const getFrequencyOption = () => ({
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '10%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: frequencyList.slice(0, 10).map((d) => d.name),
      axisLabel: {
        interval: 0,
        rotate: 45,
        fontSize: 11,
      },
    },
    yAxis: {
      type: 'value',
      name: '出现次数',
    },
    series: [
      {
        type: 'bar',
        data: frequencyList.slice(0, 10).map((d) => d.count),
        itemStyle: {
          color: new (echarts as any).graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#A78BFA' },
            { offset: 1, color: '#C4B5FD' },
          ]),
          borderRadius: [8, 8, 0, 0],
        },
      },
    ],
  });

  const getSeverityOption = () => ({
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)',
    },
    legend: {
      orient: 'vertical',
      left: 'left',
    },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2,
        },
        label: {
          show: true,
          formatter: '{b}\n{c}次',
        },
        data: [
          {
            value: severityDistribution.mild,
            name: '轻度',
            itemStyle: { color: '#FEF3C7' },
          },
          {
            value: severityDistribution.moderate,
            name: '中度',
            itemStyle: { color: '#FED7AA' },
          },
          {
            value: severityDistribution.severe,
            name: '重度',
            itemStyle: { color: '#FCA5A5' },
          },
        ],
      },
    ],
  });

  const getCorrelationOption = () => ({
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => {
        let result = `<div class="font-semibold">${params[0].name}</div>`;
        params.forEach((param: any) => {
          result += `<div>${param.marker} ${param.seriesName}: ${param.value}</div>`;
        });
        return result;
      },
    },
    legend: {
      data: ['症状数量', '平均严重程度'],
      top: '5%',
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '15%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: timelineData.map((d) => d.date),
      axisLabel: {
        fontSize: 11,
        rotate: timelineData.length > 6 ? 45 : 0,
      },
    },
    yAxis: [
      {
        type: 'value',
        name: '症状数量',
        position: 'left',
      },
      {
        type: 'value',
        name: '严重程度',
        position: 'right',
        max: 3,
      },
    ],
    series: [
      {
        name: '症状数量',
        type: 'bar',
        data: timelineData.map((d) => d.count),
        itemStyle: {
          color: '#A78BFA',
        },
      },
      {
        name: '平均严重程度',
        type: 'line',
        yAxisIndex: 1,
        data: timelineData.map((d) => {
          if (d.symptoms.length === 0) return 0;
          const totalSeverity = d.symptoms.reduce((sum, s) => {
            return sum + (s.severity === 'mild' ? 1 : s.severity === 'moderate' ? 2 : 3);
          }, 0);
          return (totalSeverity / d.symptoms.length).toFixed(2);
        }),
        itemStyle: {
          color: '#FCA5A5',
        },
      },
    ],
  });

  const viewModes = [
    { mode: 'timeline' as ViewMode, label: '时间趋势', icon: TrendingUp },
    { mode: 'frequency' as ViewMode, label: '症状频率', icon: BarChart3 },
    { mode: 'severity' as ViewMode, label: '严重程度', icon: Activity },
    { mode: 'correlation' as ViewMode, label: '关联分析', icon: GitMerge },
  ];

  return (
    <div className="space-y-4">
      {/* View Mode Selector */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-macos-text-primary">
          症状分析
        </h3>
        <div className="flex flex-wrap gap-2">
          {viewModes.map(({ mode, label, icon: Icon }) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                viewMode === mode
                  ? 'bg-macos-accent-purple text-white'
                  : 'bg-macos-bg-secondary text-macos-text-primary hover:bg-macos-bg-hover'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm font-medium">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Statistics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-macos-bg-card p-4 rounded-xl border border-macos-border">
          <p className="text-xs text-macos-text-muted mb-1">总记录数</p>
          <p className="text-2xl font-bold text-macos-text-primary">{symptoms.length}</p>
        </div>
        <div className="bg-macos-bg-card p-4 rounded-xl border border-macos-border">
          <p className="text-xs text-macos-text-muted mb-1">轻度症状</p>
          <p className="text-2xl font-bold text-yellow-600">
            {severityDistribution.mild}
          </p>
        </div>
        <div className="bg-macos-bg-card p-4 rounded-xl border border-macos-border">
          <p className="text-xs text-macos-text-muted mb-1">中度症状</p>
          <p className="text-2xl font-bold text-orange-600">
            {severityDistribution.moderate}
          </p>
        </div>
        <div className="bg-macos-bg-card p-4 rounded-xl border border-macos-border">
          <p className="text-xs text-macos-text-muted mb-1">重度症状</p>
          <p className="text-2xl font-bold text-red-600">
            {severityDistribution.severe}
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-macos-bg-card p-6 rounded-2xl border border-macos-border">
        {viewMode === 'timeline' && (
          <ReactECharts
            option={getTimelineOption()}
            style={{ height: '400px' }}
            opts={{ renderer: 'svg' }}
          />
        )}
        {viewMode === 'frequency' && (
          <ReactECharts
            option={getFrequencyOption()}
            style={{ height: '400px' }}
            opts={{ renderer: 'svg' }}
          />
        )}
        {viewMode === 'severity' && (
          <ReactECharts
            option={getSeverityOption()}
            style={{ height: '400px' }}
            opts={{ renderer: 'svg' }}
          />
        )}
        {viewMode === 'correlation' && (
          <ReactECharts
            option={getCorrelationOption()}
            style={{ height: '400px' }}
            opts={{ renderer: 'svg' }}
          />
        )}
      </div>

      {/* Detailed List */}
      {viewMode === 'frequency' && frequencyList.length > 0 && (
        <div className="bg-macos-bg-card p-6 rounded-2xl border border-macos-border">
          <h4 className="text-md font-semibold text-macos-text-primary mb-4">
            症状详情
          </h4>
          <div className="space-y-2">
            {frequencyList.slice(0, 10).map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-macos-bg-secondary rounded-lg hover:bg-macos-bg-hover transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <span className="w-6 h-6 flex items-center justify-center bg-macos-accent-purple/20 text-macos-accent-purple rounded-full text-xs font-semibold">
                    {index + 1}
                  </span>
                  <span className="text-sm font-medium text-macos-text-primary">
                    {item.name}
                  </span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-macos-text-muted">
                    出现 {item.count} 次
                  </span>
                  <span className="text-xs px-2 py-1 bg-gray-100 rounded">
                    平均: {item.avgSeverity.toFixed(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {symptoms.length === 0 && (
        <div className="bg-macos-bg-card p-12 rounded-2xl border border-macos-border text-center">
          <Activity className="w-16 h-16 text-macos-text-muted mx-auto mb-4" />
          <p className="text-macos-text-muted">暂无症状数据</p>
          <p className="text-sm text-macos-text-muted mt-2">
            开始记录您的更年期症状以便查看分析
          </p>
        </div>
      )}
    </div>
  );
}
