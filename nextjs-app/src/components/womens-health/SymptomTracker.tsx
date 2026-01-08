'use client';

import { useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { TrendingUp, Calendar, BarChart3 } from 'lucide-react';
import { CycleTracker } from '@/types/health-data';
import * as echarts from 'echarts/core';

interface SymptomTrackerProps {
  data: CycleTracker;
}

export function SymptomTracker({ data }: SymptomTrackerProps) {
  const [viewMode, setViewMode] = useState<'overview' | 'cycles'>('overview');

  const { cycles } = data;

  // Group cycles by month
  const monthlyCycles = cycles.reduce((acc, cycle) => {
    const month = cycle.period_start.substring(0, 7); // YYYY-MM
    if (!acc[month]) {
      acc[month] = 0;
    }
    acc[month]++;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(monthlyCycles)
    .map(([month, count]) => ({ month, count }))
    .sort((a, b) => a.month.localeCompare(b.month));

  // Chart configuration
  const getChartOption = () => ({
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => {
        const data = params[0];
        return `${data.name}<br/>周期数: ${data.value}`;
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
      data: chartData.map(d => d.month),
      axisLabel: {
        fontSize: 11,
      },
    },
    yAxis: {
      type: 'value',
      name: '周期数',
    },
    series: [
      {
        type: 'bar',
        data: chartData.map(d => d.count),
        itemStyle: {
          color: new (echarts as any).graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#FF6B9D' },
            { offset: 1, color: '#FF8FB3' },
          ]),
          borderRadius: [8, 8, 0, 0],
        },
      },
    ],
  });

  return (
    <div className="space-y-4">
      {/* View Mode Selector */}
      <div className="flex items-center space-x-2">
        <button
          onClick={() => setViewMode('overview')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            viewMode === 'overview'
              ? 'bg-macos-accent-coral text-white'
              : 'bg-macos-bg-secondary text-macos-text-primary'
          }`}
        >
          总览
        </button>
        <button
          onClick={() => setViewMode('cycles')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            viewMode === 'cycles'
              ? 'bg-macos-accent-coral text-white'
              : 'bg-macos-bg-secondary text-macos-text-primary'
          }`}
        >
          周期详情
        </button>
      </div>

      {/* Overview */}
      {viewMode === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-macos-bg-card p-4 rounded-xl border border-macos-border">
            <p className="text-xs text-macos-text-muted mb-1">总周期数</p>
            <p className="text-2xl font-bold text-macos-text-primary">{cycles.length}</p>
          </div>
          <div className="bg-macos-bg-card p-4 rounded-xl border border-macos-border">
            <p className="text-xs text-macos-text-muted mb-1">平均周期长度</p>
            <p className="text-2xl font-bold text-macos-text-primary">
              {cycles.length > 0
                ? Math.round(cycles.reduce((sum, c) => sum + c.cycle_length, 0) / cycles.length)
                : 0}
              天
            </p>
          </div>
          <div className="bg-macos-bg-card p-4 rounded-xl border border-macos-border">
            <p className="text-xs text-macos-text-muted mb-1">记录月份数</p>
            <p className="text-2xl font-bold text-macos-text-primary">{chartData.length}</p>
          </div>
        </div>
      )}

      {/* Chart */}
      <div className="bg-macos-bg-card p-6 rounded-2xl border border-macos-border">
        <h3 className="text-lg font-semibold text-macos-text-primary mb-4">
          周期统计
        </h3>
        <ReactECharts
          option={getChartOption()}
          style={{ height: '350px' }}
          opts={{ renderer: 'svg' }}
        />
      </div>

      {/* Cycles List */}
      {viewMode === 'cycles' && (
        <div className="bg-macos-bg-card p-6 rounded-2xl border border-macos-border">
          <h3 className="text-lg font-semibold text-macos-text-primary mb-4">
            周期详情
          </h3>
          <div className="space-y-2">
            {cycles.map((cycle, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-macos-bg-secondary rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <Calendar className="w-4 h-4 text-macos-text-muted" />
                  <span className="text-sm font-medium text-macos-text-primary">
                    {cycle.period_start}
                  </span>
                </div>
                <div className="flex items-center space-x-4 text-sm text-macos-text-muted">
                  <span>长度: {cycle.cycle_length}天</span>
                  <span>经期: {cycle.period_length}天</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {cycles.length === 0 && (
        <div className="bg-macos-bg-card p-12 rounded-2xl border border-macos-border text-center">
          <BarChart3 className="w-16 h-16 text-macos-text-muted mx-auto mb-4" />
          <p className="text-macos-text-muted">暂无周期数据</p>
        </div>
      )}
    </div>
  );
}
