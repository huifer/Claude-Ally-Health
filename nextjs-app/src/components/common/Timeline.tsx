'use client';

import { ReactNode } from 'react';

export interface TimelineItem {
  id: string;
  title: string;
  date: string;
  description?: string;
  icon?: ReactNode;
  status?: 'completed' | 'pending' | 'overdue' | 'upcoming';
  metadata?: Record<string, ReactNode>;
  content?: ReactNode;
}

interface TimelineProps {
  items: TimelineItem[];
  variant?: 'default' | 'compact' | 'detailed';
  showIcon?: boolean;
  onItemClick?: (item: TimelineItem) => void;
}

export function Timeline({
  items,
  variant = 'default',
  showIcon = true,
  onItemClick,
}: TimelineProps) {
  // Get status color
  const getStatusColor = (status?: TimelineItem['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'overdue':
        return 'bg-red-500';
      case 'upcoming':
        return 'bg-orange-500';
      case 'pending':
      default:
        return 'bg-blue-500';
    }
  };

  // Get status background color
  const getStatusBgColor = (status?: TimelineItem['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100';
      case 'overdue':
        return 'bg-red-100';
      case 'upcoming':
        return 'bg-orange-100';
      case 'pending':
      default:
        return 'bg-blue-100';
    }
  };

  // Get status icon color
  const getStatusIconColor = (status?: TimelineItem['status']) => {
    switch (status) {
      case 'completed':
        return 'text-green-600';
      case 'overdue':
        return 'text-red-600';
      case 'upcoming':
        return 'text-orange-600';
      case 'pending':
      default:
        return 'text-blue-600';
    }
  };

  // Get status text color
  const getStatusTextColor = (status?: TimelineItem['status']) => {
    switch (status) {
      case 'completed':
        return 'text-green-700';
      case 'overdue':
        return 'text-red-700';
      case 'upcoming':
        return 'text-orange-700';
      case 'pending':
      default:
        return 'text-blue-700';
    }
  };

  return (
    <div className="space-y-4">
      {items.map((item, index) => {
        const isLastItem = index === items.length - 1;

        return (
          <div key={item.id} className="flex items-start space-x-4">
            {/* Timeline Icon and Line */}
            {showIcon && (
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${getStatusBgColor(item.status)}`}
                >
                  {item.icon || (
                    <div
                      className={`w-3 h-3 rounded-full ${getStatusColor(item.status)}`}
                    />
                  )}
                </div>
                {!isLastItem && (
                  <div className={`w-0.5 h-full mt-2 ${getStatusColor(item.status)} opacity-30`} />
                )}
              </div>
            )}

            {/* Card Content */}
            <div className={`flex-1 ${!isLastItem ? 'pb-8' : ''}`}>
              <div
                className={`bg-macos-bg-card p-4 rounded-lg border transition-all ${
                  variant === 'compact' ? 'border-macos-border' : 'border-macos-border hover:shadow-md'
                } ${onItemClick ? 'cursor-pointer' : ''}`}
                onClick={() => onItemClick?.(item)}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4
                      className={`text-base font-semibold ${
                        item.status === 'completed'
                          ? 'text-macos-text-primary'
                          : getStatusTextColor(item.status)
                      }`}
                    >
                      {item.title}
                    </h4>

                    {variant !== 'compact' && item.description && (
                      <p className="text-sm text-macos-text-muted mt-1">{item.description}</p>
                    )}
                  </div>

                  {/* Status Badge */}
                  {item.status && variant !== 'compact' && (
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${getStatusBgColor(item.status)} ${getStatusTextColor(item.status)}`}
                    >
                      {item.status === 'completed'
                        ? '已完成'
                        : item.status === 'overdue'
                        ? '已过期'
                        : item.status === 'upcoming'
                        ? '即将到期'
                        : '待处理'}
                    </span>
                  )}
                </div>

                {/* Date */}
                <div className={`text-sm text-macos-text-muted ${variant === 'compact' ? '' : 'mb-2'}`}>
                  {item.date}
                </div>

                {/* Metadata */}
                {item.metadata && variant !== 'compact' && (
                  <div className="flex flex-wrap gap-3 text-xs text-macos-text-muted">
                    {Object.entries(item.metadata).map(([key, value]) => (
                      <div key={key} className="flex items-center space-x-1">
                        <span className="font-medium">{key}:</span>
                        <span>{value}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Custom Content */}
                {item.content && (
                  <div className="mt-3 pt-3 border-t border-macos-border">{item.content}</div>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {/* Empty State */}
      {items.length === 0 && (
        <div className="text-center py-12">
          <p className="text-macos-text-muted">暂无时间轴记录</p>
        </div>
      )}
    </div>
  );
}
