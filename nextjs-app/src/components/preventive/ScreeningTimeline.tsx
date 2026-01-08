'use client';

import { Calendar, CheckCircle, AlertCircle, Clock, Filter } from 'lucide-react';
import { ScreeningItem } from './ScreeningCard';
import { useState } from 'react';

interface ScreeningTimelineProps {
  screenings: ScreeningItem[];
}

type TimelineFilter = 'all' | 'completed' | 'upcoming' | 'overdue';

export function ScreeningTimeline({ screenings }: ScreeningTimelineProps) {
  const [filter, setFilter] = useState<TimelineFilter>('all');

  // Filter and sort screenings
  const getFilteredScreenings = () => {
    const today = new Date();

    return screenings
      .filter(screening => {
        if (filter === 'all') return true;

        if (filter === 'completed') return screening.status === 'completed';

        if (filter === 'upcoming' || filter === 'overdue') {
          if (screening.status === 'completed') return false;

          if (!screening.due_date) return false;

          const dueDate = new Date(screening.due_date);
          const diffTime = dueDate.getTime() - today.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

          if (filter === 'upcoming') return diffDays >= 0 && diffDays <= 90; // Within 90 days
          if (filter === 'overdue') return diffDays < 0;

          return false;
        }

        return true;
      })
      .sort((a, b) => {
        // Sort by due date
        if (!a.due_date) return 1;
        if (!b.due_date) return -1;

        return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
      });
  };

  const filteredScreenings = getFilteredScreenings();

  // Get screening status
  const getStatus = (screening: ScreeningItem) => {
    if (screening.status === 'completed') return 'completed';

    if (!screening.due_date) return 'unknown';

    const today = new Date();
    const dueDate = new Date(screening.due_date);
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'overdue';
    if (diffDays <= 30) return 'urgent';
    return 'upcoming';
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'overdue':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'urgent':
        return <Clock className="w-5 h-5 text-orange-600" />;
      case 'upcoming':
        return <Calendar className="w-5 h-5 text-blue-600" />;
      default:
        return <Calendar className="w-5 h-5 text-gray-400" />;
    }
  };

  // Get timeline color
  const getTimelineColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'overdue':
        return 'bg-red-500';
      case 'urgent':
        return 'bg-orange-500';
      case 'upcoming':
        return 'bg-blue-500';
      default:
        return 'bg-gray-300';
    }
  };

  // Statistics
  const today = new Date();
  const completedCount = screenings.filter(s => s.status === 'completed').length;
  const overdueCount = screenings.filter(s => {
    if (s.status === 'completed' || !s.due_date) return false;
    const dueDate = new Date(s.due_date);
    return dueDate < today;
  }).length;
  const upcomingCount = screenings.filter(s => {
    if (s.status === 'completed' || !s.due_date) return false;
    const dueDate = new Date(s.due_date);
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 90;
  }).length;

  return (
    <div className="space-y-6">
      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100/30 p-4 rounded-xl border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600 mb-1">总筛查数</p>
              <p className="text-2xl font-bold text-gray-900">{screenings.length}</p>
            </div>
            <Calendar className="w-10 h-10 text-blue-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100/30 p-4 rounded-xl border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600 mb-1">已完成</p>
              <p className="text-2xl font-bold text-gray-900">{completedCount}</p>
            </div>
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100/30 p-4 rounded-xl border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600 mb-1">即将到期</p>
              <p className="text-2xl font-bold text-gray-900">{upcomingCount}</p>
            </div>
            <Clock className="w-10 h-10 text-orange-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100/30 p-4 rounded-xl border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600 mb-1">已过期</p>
              <p className="text-2xl font-bold text-gray-900">{overdueCount}</p>
            </div>
            <AlertCircle className="w-10 h-10 text-red-600" />
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-macos-text-primary">
          筛查时间线
        </h3>
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-macos-text-muted" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as TimelineFilter)}
            className="px-3 py-2 bg-macos-bg-secondary border border-macos-border rounded-lg text-sm"
          >
            <option value="all">全部</option>
            <option value="completed">已完成</option>
            <option value="upcoming">即将到期 (90天内)</option>
            <option value="overdue">已过期</option>
          </select>
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-4">
        {filteredScreenings.map((screening, index) => {
          const status = getStatus(screening);
          const isLastItem = index === filteredScreenings.length - 1;

          return (
            <div key={index} className="flex items-start space-x-4">
              {/* Timeline Icon */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${status === 'completed' ? 'bg-green-100' : status === 'overdue' ? 'bg-red-100' : status === 'urgent' ? 'bg-orange-100' : 'bg-blue-100'}`}
                >
                  {getStatusIcon(status)}
                </div>
                {!isLastItem && (
                  <div
                    className={`w-0.5 h-full mt-2 ${getTimelineColor(status)} opacity-30`}
                  />
                )}
              </div>

              {/* Card Content */}
              <div className="flex-1 pb-8">
                <div
                  className={`bg-macos-bg-card p-5 rounded-lg border transition-all hover:shadow-md ${
                    status === 'overdue'
                      ? 'border-red-200 bg-red-50/30'
                      : status === 'urgent'
                      ? 'border-orange-200'
                      : 'border-macos-border'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="text-base font-semibold text-macos-text-primary mb-2">
                        {screening.screening_type}
                      </h4>

                      <div className="flex flex-wrap gap-3 text-sm text-macos-text-muted">
                        {screening.due_date && (
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>到期: {screening.due_date}</span>
                          </div>
                        )}

                        {screening.last_screening_date && (
                          <span>上次: {screening.last_screening_date}</span>
                        )}

                        {screening.facility && (
                          <span>• {screening.facility}</span>
                        )}
                      </div>
                    </div>

                    {/* Status Badge */}
                    {status === 'completed' && (
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                        已完成
                      </span>
                    )}
                    {status === 'overdue' && (
                      <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium">
                        已过期
                      </span>
                    )}
                    {status === 'urgent' && (
                      <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs font-medium">
                        即将到期
                      </span>
                    )}
                    {status === 'upcoming' && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                        未来安排
                      </span>
                    )}
                  </div>

                  {/* Additional Info */}
                  {(screening.result || screening.notes) && (
                    <div className="pt-3 border-t border-macos-border">
                      {screening.result && (
                        <div className="mb-2">
                          <p className="text-xs text-macos-text-muted mb-1">检查结果:</p>
                          <p className="text-sm text-macos-text-secondary">{screening.result}</p>
                        </div>
                      )}
                      {screening.notes && !screening.result && (
                        <div>
                          <p className="text-xs text-macos-text-muted mb-1">备注:</p>
                          <p className="text-sm text-macos-text-secondary">{screening.notes}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {filteredScreenings.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-macos-text-muted mx-auto mb-4" />
            <p className="text-macos-text-muted">暂无筛查记录</p>
            <p className="text-sm text-macos-text-muted mt-2">
              {filter === 'all' ? '开始记录您的癌症筛查情况' : '该筛选条件下暂无记录'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
