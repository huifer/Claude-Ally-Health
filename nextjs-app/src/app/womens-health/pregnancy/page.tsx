'use client';

import { useHealthData } from '@/hooks/useHealthData';
import { CardSkeleton } from '@/components/common/LoadingSkeleton';
import { EmptyState } from '@/components/common/EmptyState';
import { Baby, Calendar, CheckCircle, Info } from 'lucide-react';
import { StatusCard } from '@/components/common/StatusCard';

export default function PregnancyTrackerPage() {
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

  if (error || !healthData?.pregnancyTracker) {
    return (
      <EmptyState
        icon={Baby}
        title="无法加载孕期数据"
        description={error || '请确保数据文件存在'}
      />
    );
  }

  const pregnancyTracker = healthData.pregnancyTracker;
  const { current_pregnancy, pregnancy_history, statistics } = pregnancyTracker;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-macos-text-primary mb-2">孕期管理</h1>
        <p className="text-macos-text-muted">追踪您的孕期进度和健康记录</p>
      </div>

      {/* Current Pregnancy Status */}
      {current_pregnancy ? (
        <>
          <div className="bg-gradient-to-br from-green-50 to-green-100/30 p-8 rounded-2xl border border-green-200">
            <div className="flex items-center space-x-4 mb-6">
              <div className="p-4 bg-white rounded-full">
                <Baby className="w-12 h-12 text-green-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">孕期中</h2>
                <p className="text-sm text-gray-600">
                  预产期: {current_pregnancy.due_date}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-4 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">当前孕周</p>
                <p className="text-3xl font-bold text-green-600">
                  {current_pregnancy.current_week}
                </p>
                <p className="text-xs text-gray-500 mt-1">周</p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">孕期开始</p>
                <p className="text-lg font-semibold text-gray-900">
                  {current_pregnancy.start_date}
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">已完成产检</p>
                <p className="text-3xl font-bold text-green-600">
                  {statistics.checkups_completed}
                </p>
                <p className="text-xs text-gray-500 mt-1">次</p>
              </div>
            </div>
          </div>

          {/* Checkup History */}
          {current_pregnancy.checkups && current_pregnancy.checkups.length > 0 && (
            <div className="bg-macos-bg-card p-6 rounded-2xl border border-macos-border">
              <h3 className="text-xl font-semibold text-macos-text-primary mb-4">
                产检记录
              </h3>
              <div className="space-y-3">
                {current_pregnancy.checkups.map((checkup, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-macos-bg-secondary rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <div>
                        <p className="text-sm font-medium text-macos-text-primary">
                          第 {checkup.week} 周产检
                        </p>
                        <p className="text-xs text-macos-text-muted">{checkup.date}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="bg-gradient-to-br from-gray-50 to-gray-100/30 p-8 rounded-2xl border border-gray-200">
          <div className="flex items-center space-x-4">
            <Info className="w-12 h-12 text-gray-400" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">未处于孕期</h2>
              <p className="text-sm text-gray-600">当前没有进行中的孕期记录</p>
            </div>
          </div>
        </div>
      )}

      {/* Pregnancy History */}
      {pregnancy_history && pregnancy_history.length > 0 && (
        <div className="bg-macos-bg-card p-6 rounded-2xl border border-macos-border">
          <h3 className="text-xl font-semibold text-macos-text-primary mb-4">
            妊娠史
          </h3>
          <div className="space-y-3">
            {pregnancy_history.map((pregnancy, index) => (
              <div
                key={index}
                className="p-4 bg-macos-bg-secondary rounded-lg"
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-sm font-medium text-macos-text-primary">
                      {pregnancy.start_date} - {pregnancy.end_date}
                    </p>
                    <p className="text-xs text-macos-text-muted mt-1">
                      结果: {pregnancy.outcome}
                    </p>
                  </div>
                </div>
                {pregnancy.notes && (
                  <p className="text-xs text-macos-text-muted mt-2">
                    备注: {pregnancy.notes}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Statistics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatusCard
          title="总妊娠数"
          value={statistics.total_pregnancies}
          icon={Baby}
          color="mint"
        />
        <StatusCard
          title="体重增加"
          value={statistics.total_weight_gain ? `${statistics.total_weight_gain} kg` : '-'}
          description="总增重"
          icon={Calendar}
          color="purple"
        />
        <StatusCard
          title="产检次数"
          value={statistics.checkups_completed}
          description="已完成"
          icon={CheckCircle}
          color="coral"
        />
      </div>
    </div>
  );
}
