'use client';

import { useHealthData } from '@/hooks/useHealthData';
import { CardSkeleton } from '@/components/common/LoadingSkeleton';
import { EmptyState } from '@/components/common/EmptyState';
import { TrendingUp, Calendar, Activity, Info } from 'lucide-react';
import { StatusCard } from '@/components/common/StatusCard';

export default function MenopauseTrackerPage() {
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

  if (error || !healthData?.menopauseTracker) {
    return (
      <EmptyState
        icon={TrendingUp}
        title="无法加载更年期数据"
        description={error || '请确保数据文件存在'}
      />
    );
  }

  const menopauseTracker = healthData.menopauseTracker;
  const { statistics, menopause_tracking } = menopauseTracker;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-macos-text-primary mb-2">更年期追踪</h1>
        <p className="text-macos-text-muted">记录更年期症状和健康变化</p>
      </div>

      {/* Tracking Status */}
      {menopause_tracking ? (
        <div className="bg-gradient-to-br from-purple-50 to-purple-100/30 p-8 rounded-2xl border border-purple-200">
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-4 bg-white rounded-full">
              <TrendingUp className="w-12 h-12 text-purple-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">追踪中</h2>
              <p className="text-sm text-gray-600">
                开始日期: {menopause_tracking.start_date}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-4 rounded-lg">
              <p className="text-xs text-gray-600 mb-1">追踪时长</p>
              <p className="text-3xl font-bold text-purple-600">
                {statistics.tracking_duration_months}
              </p>
              <p className="text-xs text-gray-500 mt-1">个月</p>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <p className="text-xs text-gray-600 mb-1">症状记录</p>
              <p className="text-3xl font-bold text-purple-600">
                {statistics.total_symptom_records}
              </p>
              <p className="text-xs text-gray-500 mt-1">条</p>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <p className="text-xs text-gray-600 mb-1">趋势</p>
              <p className="text-lg font-semibold text-gray-900">
                {statistics.symptom_trend || '-'}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-br from-gray-50 to-gray-100/30 p-8 rounded-2xl border border-gray-200">
          <div className="flex items-center space-x-4">
            <Info className="w-12 h-12 text-gray-400" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">未开始追踪</h2>
              <p className="text-sm text-gray-600">当前没有进行更年期追踪</p>
            </div>
          </div>
        </div>
      )}

      {/* Symptom Records */}
      {menopause_tracking?.symptoms && menopause_tracking.symptoms.length > 0 && (
        <div className="bg-macos-bg-card p-6 rounded-2xl border border-macos-border">
          <h3 className="text-xl font-semibold text-macos-text-primary mb-4">
            症状记录
          </h3>
          <div className="space-y-3">
            {menopause_tracking.symptoms.slice(-5).reverse().map((symptom, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-macos-bg-secondary rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <Activity className="w-5 h-5 text-purple-500" />
                  <div>
                    <p className="text-sm font-medium text-macos-text-primary">
                      {symptom.symptom}
                    </p>
                    <p className="text-xs text-macos-text-muted">{symptom.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                    {symptom.severity}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-macos-text-muted mt-4">
            显示最近 5 条记录 • 共 {statistics.total_symptom_records} 条
          </p>
        </div>
      )}

      {/* Statistics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatusCard
          title="骨密度检查"
          value={statistics.bone_density_tests}
          description="已完成检查"
          icon={Calendar}
          color="purple"
        />
        <StatusCard
          title="HRT 使用"
          value={statistics.hrt_use ? '是' : '否'}
          description="激素替代疗法"
          icon={Activity}
          color="coral"
        />
        <StatusCard
          title="追踪时长"
          value={`${statistics.tracking_duration_months} 个月`}
          description="开始追踪以来"
          icon={TrendingUp}
          color="purple"
        />
      </div>
    </div>
  );
}
