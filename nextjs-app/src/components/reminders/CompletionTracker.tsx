'use client';

import { CheckCircle, TrendingUp, AlertCircle } from 'lucide-react';

interface CompletionTrackerProps {
  completed: number;
  total: number;
  title?: string;
  showTrend?: boolean;
  trend?: 'up' | 'down' | 'neutral';
}

export function CompletionTracker({
  completed,
  total,
  title = '完成率',
  showTrend = false,
  trend = 'neutral',
}: CompletionTrackerProps) {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  const remaining = total - completed;

  const getStatusColor = () => {
    if (percentage >= 80) return 'green';
    if (percentage >= 50) return 'orange';
    return 'red';
  };

  const statusColor = getStatusColor();

  const getTrendIcon = () => {
    if (!showTrend) return null;

    if (trend === 'up') {
      return (
        <div className="flex items-center space-x-1 text-green-600">
          <TrendingUp className="w-4 h-4" />
          <span className="text-xs">进步中</span>
        </div>
      );
    }

    if (trend === 'down') {
      return (
        <div className="flex items-center space-x-1 text-red-600">
          <AlertCircle className="w-4 h-4" />
          <span className="text-xs">需关注</span>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="space-y-4">
      {/* Main Card */}
      <div
        className={`bg-gradient-to-br ${
          statusColor === 'green'
            ? 'from-green-50 to-green-100/30'
            : statusColor === 'orange'
            ? 'from-orange-50 to-orange-100/30'
            : 'from-red-50 to-red-100/30'
        } p-6 rounded-2xl border ${
          statusColor === 'green'
            ? 'border-green-200'
            : statusColor === 'orange'
            ? 'border-orange-200'
            : 'border-red-200'
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center ${
                statusColor === 'green'
                  ? 'bg-green-200'
                  : statusColor === 'orange'
                  ? 'bg-orange-200'
                  : 'bg-red-200'
              }`}
            >
              <CheckCircle
                className={`w-6 h-6 ${
                  statusColor === 'green'
                    ? 'text-green-700'
                    : statusColor === 'orange'
                    ? 'text-orange-700'
                    : 'text-red-700'
                }`}
              />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              <p className="text-sm text-gray-600">
                已完成 {completed}/{total} 项
              </p>
            </div>
          </div>
          <div className="text-right">
            <div
              className={`text-3xl font-bold ${
                statusColor === 'green'
                  ? 'text-green-700'
                  : statusColor === 'orange'
                  ? 'text-orange-700'
                  : 'text-red-700'
              }`}
            >
              {percentage}%
            </div>
            {getTrendIcon()}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="w-full bg-white rounded-full h-4 overflow-hidden border border-gray-200">
            <div
              className={`h-full rounded-full transition-all ${
                statusColor === 'green'
                  ? 'bg-green-500'
                  : statusColor === 'orange'
                  ? 'bg-orange-500'
                  : 'bg-red-500'
              }`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-xs text-gray-600 mb-1">已完成</p>
            <p className="text-xl font-bold text-gray-900">{completed}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">待完成</p>
            <p className="text-xl font-bold text-gray-900">{remaining}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">总计</p>
            <p className="text-xl font-bold text-gray-900">{total}</p>
          </div>
        </div>
      </div>

      {/* Encouragement Message */}
      {percentage === 100 && (
        <div className="bg-green-50 p-4 rounded-xl border border-green-200">
          <p className="text-sm text-green-900 text-center font-medium">
            太棒了！所有任务都已完成 🎉
          </p>
        </div>
      )}

      {percentage >= 80 && percentage < 100 && (
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
          <p className="text-sm text-blue-900 text-center">
            很好！还剩 {remaining} 项任务，继续加油！
          </p>
        </div>
      )}

      {percentage >= 50 && percentage < 80 && (
        <div className="bg-orange-50 p-4 rounded-xl border border-orange-200">
          <p className="text-sm text-orange-900 text-center">
            已完成过半，还有 {remaining} 项任务待完成
          </p>
        </div>
      )}

      {percentage < 50 && total > 0 && (
        <div className="bg-red-50 p-4 rounded-xl border border-red-200">
          <p className="text-sm text-red-900 text-center">
            需要加油哦，还有 {remaining} 项任务待完成
          </p>
        </div>
      )}
    </div>
  );
}
