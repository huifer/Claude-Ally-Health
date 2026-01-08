'use client';

import { useState } from 'react';
import { useRemindersData } from '@/hooks/useRemindersData';
import { CardSkeleton } from '@/components/common/LoadingSkeleton';
import { EmptyState } from '@/components/common/EmptyState';
import { Bell, Calendar, Clock, CheckCircle, Pill } from 'lucide-react';
import { StatusCard } from '@/components/common/StatusCard';
import { TypeBadge } from '@/components/reminders/TypeBadge';

export default function RemindersPage() {
  const { reminders, loading, error } = useRemindersData();
  const [selectedType, setSelectedType] = useState<string>('all');
  const [completedReminders, setCompletedReminders] = useState<Set<string>>(new Set());

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    );
  }

  if (error || !reminders) {
    return (
      <EmptyState
        icon={Bell}
        title="无法加载提醒数据"
        description={error || '请确保数据文件存在'}
      />
    );
  }

  const { reminders: reminderList, statistics } = reminders;

  // Filter reminders
  const filteredReminders = selectedType === 'all'
    ? reminderList.filter(r => r.active)
    : reminderList.filter(r => r.active && r.type === selectedType);

  const types = ['all', 'medication', 'appointment', 'screening', 'vaccination'];
  const typeLabels: Record<string, string> = {
    all: '全部',
    medication: '用药',
    appointment: '预约',
    screening: '筛查',
    vaccination: '疫苗',
  };

  const toggleComplete = (id: string) => {
    const newCompleted = new Set(completedReminders);
    if (newCompleted.has(id)) {
      newCompleted.delete(id);
    } else {
      newCompleted.add(id);
    }
    setCompletedReminders(newCompleted);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-macos-text-primary mb-2">健康提醒</h1>
        <p className="text-macos-text-muted">管理您的健康提醒和待办事项</p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatusCard
          title="总提醒"
          value={statistics.total_reminders}
          description="项提醒"
          icon={Bell}
          color="coral"
        />
        <StatusCard
          title="活跃提醒"
          value={statistics.active_reminders}
          description="进行中"
          icon={Clock}
          color="apricot"
        />
        <StatusCard
          title="7天内"
          value={statistics.upcoming_7_days}
          description="即将到期"
          icon={Calendar}
          color="purple"
        />
        <StatusCard
          title="完成率"
          value={`${statistics.completion_rate}%`}
          description="历史完成"
          icon={CheckCircle}
          color={statistics.completion_rate >= 80 ? 'mint' : 'coral'}
        />
      </div>

      {/* Type Filter */}
      <div className="flex items-center space-x-2 border-b border-macos-border">
        {types.map((type) => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            className={`px-4 py-2 text-sm font-medium transition-colors relative ${
              selectedType === type
                ? 'text-macos-accent-coral'
                : 'text-macos-text-muted hover:text-macos-text-primary'
            }`}
          >
            {typeLabels[type]}
            {selectedType === type && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-macos-accent-coral rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Reminder List */}
      <div className="space-y-3">
        {filteredReminders.map((reminder) => {
          const isCompleted = completedReminders.has(reminder.id);
          const isOverdue = new Date(reminder.next_reminder) < new Date();

          return (
            <div
              key={reminder.id}
              className={`bg-macos-bg-card p-5 rounded-xl border transition-all ${
                isCompleted
                  ? 'opacity-60 border-macos-border'
                  : isOverdue
                  ? 'border-red-200 bg-red-50/30'
                  : 'border-macos-border hover:shadow-md'
              }`}
            >
              <div className="flex items-start space-x-4">
                {/* Checkbox */}
                <button
                  onClick={() => toggleComplete(reminder.id)}
                  className={`mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                    isCompleted
                      ? 'bg-green-500 border-green-500'
                      : 'border-macos-border hover:border-macos-accent-coral'
                  }`}
                >
                  {isCompleted && (
                    <CheckCircle className="w-4 h-4 text-white" />
                  )}
                </button>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className={`text-base font-semibold ${
                        isCompleted
                          ? 'text-macos-text-muted line-through'
                          : 'text-macos-text-primary'
                      }`}>
                        {reminder.title}
                      </h3>
                      <p className="text-sm text-macos-text-muted mt-1">
                        {reminder.description}
                      </p>
                    </div>
                    <TypeBadge type={reminder.type} />
                  </div>

                  <div className="flex items-center space-x-4 text-xs text-macos-text-muted">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>
                        {reminder.date
                          ? reminder.date
                          : reminder.next_reminder.split('T')[0]
                        }
                      </span>
                    </div>
                    {reminder.time && (
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{reminder.time}</span>
                      </div>
                    )}
                    {reminder.hospital && (
                      <div className="flex items-center space-x-1">
                        <span>{reminder.hospital}</span>
                      </div>
                    )}
                    {isOverdue && !isCompleted && (
                      <span className="text-red-600 font-medium">已逾期</span>
                    )}
                  </div>

                  {reminder.notes && (
                    <p className="text-xs text-macos-text-muted mt-2 bg-macos-bg-secondary p-2 rounded">
                      备注: {reminder.notes}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {filteredReminders.length === 0 && (
          <EmptyState
            icon={Bell}
            title={`没有${typeLabels[selectedType]}提醒`}
            description="当前没有相关提醒"
          />
        )}
      </div>

      {/* Overdue Warning */}
      {statistics.overdue_count > 0 && (
        <div className="bg-gradient-to-br from-red-50 to-red-100/30 p-6 rounded-2xl border border-red-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-200 rounded-full">
              <Bell className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                有 {statistics.overdue_count} 项逾期提醒
              </h3>
              <p className="text-sm text-gray-600">请尽快处理这些提醒</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
