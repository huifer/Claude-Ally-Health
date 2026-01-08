'use client';

import { CycleStats } from '@/components/womens-health/CycleStats';
import { useHealthData } from '@/hooks/useHealthData';
import { CardSkeleton } from '@/components/common/LoadingSkeleton';
import { EmptyState } from '@/components/common/EmptyState';
import { Calendar, Calendar as CalendarIcon, TrendingUp } from 'lucide-react';
import { StatusCard } from '@/components/common/StatusCard';

export default function CycleTrackerPage() {
  const { healthData, loading, error } = useHealthData();

  if (loading) {
    return (
      <div className="space-y-6">
        <CardSkeleton />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    );
  }

  if (error || !healthData?.cycleTracker) {
    return (
      <EmptyState
        icon={Calendar}
        title="无法加载经期数据"
        description={error || '请确保数据文件存在'}
      />
    );
  }

  const cycleTracker = healthData.cycleTracker;
  const { cycles, statistics, user_settings } = cycleTracker;

  // Get recent cycles
  const recentCycles = cycles.slice(-5).reverse();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-macos-text-primary mb-2">经期追踪</h1>
        <p className="text-macos-text-muted">记录和追踪您的月经周期</p>
      </div>

      <CycleStats cycleTracker={cycleTracker} />

      {/* Latest Period Info */}
      {cycles.length > 0 && (
        <div className="bg-gradient-to-br from-pink-50 to-pink-100/30 p-6 rounded-2xl border border-pink-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">最近周期</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-gray-600 mb-1">开始日期</p>
              <p className="text-sm font-semibold text-gray-900">
                {recentCycles[0].period_start}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-1">结束日期</p>
              <p className="text-sm font-semibold text-gray-900">
                {recentCycles[0].period_end}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-1">经期长度</p>
              <p className="text-sm font-semibold text-gray-900">
                {recentCycles[0].period_length} 天
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-1">周期长度</p>
              <p className="text-sm font-semibold text-gray-900">
                {recentCycles[0].cycle_length} 天
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Cycle History */}
      <div className="bg-macos-bg-card p-6 rounded-2xl border border-macos-border">
        <h2 className="text-xl font-semibold text-macos-text-primary mb-4">周期历史</h2>
        <div className="space-y-3">
          {recentCycles.map((cycle, index) => (
            <div
              key={cycle.id || index}
              className="flex items-center justify-between p-4 bg-macos-bg-secondary rounded-lg hover:bg-macos-bg-hover transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium text-macos-text-primary">
                    {cycle.period_start}
                  </p>
                  <p className="text-xs text-macos-text-muted">
                    经期 {cycle.period_length} 天 • 周期 {cycle.cycle_length} 天
                  </p>
                </div>
              </div>
              {cycle.daily_logs && cycle.daily_logs.length > 0 && (
                <div className="text-xs text-macos-text-muted">
                  {cycle.daily_logs.length} 条记录
                </div>
              )}
            </div>
          ))}
        </div>
        <p className="text-xs text-macos-text-muted mt-4">
          显示最近 5 个周期 • 共 {statistics.total_cycles_tracked} 个周期
        </p>
      </div>

      {/* User Settings */}
      <div className="bg-macos-bg-card p-6 rounded-2xl border border-macos-border">
        <h2 className="text-xl font-semibold text-macos-text-primary mb-4">设置</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-macos-text-muted mb-1">平均周期长度</p>
            <p className="text-sm font-semibold text-macos-text-primary">
              {user_settings.average_cycle_length} 天
            </p>
          </div>
          <div>
            <p className="text-xs text-macos-text-muted mb-1">平均经期长度</p>
            <p className="text-sm font-semibold text-macos-text-primary">
              {user_settings.average_period_length} 天
            </p>
          </div>
          <div>
            <p className="text-xs text-macos-text-muted mb-1">孕期计划</p>
            <p className="text-sm font-semibold text-macos-text-primary">
              {user_settings.pregnancy_planning ? '是' : '否'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
