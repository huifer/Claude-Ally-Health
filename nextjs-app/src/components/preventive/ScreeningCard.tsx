'use client';

import { useState } from 'react';
import { Calendar, AlertCircle, CheckCircle, Clock, FileText, Building } from 'lucide-react';

export interface ScreeningItem {
  screening_type: string;
  date?: string;
  last_screening_date?: string;
  due_date?: string;
  facility?: string;
  status?: 'completed' | 'pending' | 'overdue';
  risk_level?: 'low' | 'medium' | 'high';
  result?: string;
  notes?: string;
  recommendations?: string[];
  next_screening?: string;
}

interface ScreeningCardProps {
  screening: ScreeningItem;
  expanded?: boolean;
  onToggle?: () => void;
}

export function ScreeningCard({ screening, expanded = false, onToggle }: ScreeningCardProps) {
  const [isExpanded, setIsExpanded] = useState(expanded);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
    onToggle?.();
  };

  // Calculate days until/overdue
  const getDaysStatus = () => {
    if (!screening.due_date) return null;

    const today = new Date();
    const dueDate = new Date(screening.due_date);
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return {
      days: diffDays,
      isOverdue: diffDays < 0,
      isUpcoming: diffDays >= 0 && diffDays <= 30,
      isFuture: diffDays > 30,
    };
  };

  const daysStatus = getDaysStatus();

  // Get status badge
  const getStatusBadge = () => {
    if (screening.status === 'completed') {
      return (
        <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
          <CheckCircle className="w-3 h-3 mr-1" />
          已完成
        </span>
      );
    }

    if (daysStatus?.isOverdue) {
      return (
        <span className="inline-flex items-center px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium">
          <AlertCircle className="w-3 h-3 mr-1" />
          已过期
        </span>
      );
    }

    if (daysStatus?.isUpcoming) {
      return (
        <span className="inline-flex items-center px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs font-medium">
          <Clock className="w-3 h-3 mr-1" />
          即将到期
        </span>
      );
    }

    return (
      <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
        <Clock className="w-3 h-3 mr-1" />
        未来安排
      </span>
    );
  };

  // Get priority color
  const getPriorityColor = () => {
    if (screening.status === 'completed') return 'border-l-green-500';

    if (daysStatus?.isOverdue) return 'border-l-red-500';
    if (daysStatus?.isUpcoming) return 'border-l-orange-500';
    return 'border-l-blue-500';
  };

  return (
    <div
      className={`bg-macos-bg-card rounded-lg border border-macos-border border-l-4 ${getPriorityColor()} transition-all hover:shadow-md`}
    >
      {/* Header */}
      <div
        className="p-4 cursor-pointer"
        onClick={handleToggle}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h4 className="text-base font-semibold text-macos-text-primary">
                {screening.screening_type}
              </h4>
              {getStatusBadge()}
            </div>

            {/* Basic Info */}
            <div className="flex flex-wrap gap-3 text-sm text-macos-text-muted">
              {screening.due_date && (
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>到期: {screening.due_date}</span>
                </div>
              )}

              {screening.last_screening_date && (
                <div className="flex items-center space-x-1">
                  <FileText className="w-4 h-4" />
                  <span>上次: {screening.last_screening_date}</span>
                </div>
              )}

              {screening.facility && (
                <div className="flex items-center space-x-1">
                  <Building className="w-4 h-4" />
                  <span>{screening.facility}</span>
                </div>
              )}
            </div>

            {/* Days Status */}
            {daysStatus && screening.status !== 'completed' && (
              <div className="mt-2">
                {daysStatus.isOverdue && (
                  <p className="text-xs text-red-600">
                    已过期 {Math.abs(daysStatus.days)} 天
                  </p>
                )}
                {daysStatus.isUpcoming && daysStatus.days >= 0 && (
                  <p className="text-xs text-orange-600">
                    还剩 {daysStatus.days} 天到期
                  </p>
                )}
                {daysStatus.isFuture && (
                  <p className="text-xs text-blue-600">
                    {daysStatus.days} 天后到期
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Expand Icon */}
          <div className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
            <svg
              className="w-5 h-5 text-macos-text-muted"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-macos-border pt-4">
          <div className="space-y-3">
            {/* Risk Level */}
            {screening.risk_level && (
              <div className="flex items-start space-x-2">
                <span className="text-xs text-macos-text-muted flex-shrink-0">风险等级:</span>
                <span className={`text-xs font-medium ${
                  screening.risk_level === 'high'
                    ? 'text-red-600'
                    : screening.risk_level === 'medium'
                    ? 'text-orange-600'
                    : 'text-green-600'
                }`}>
                  {screening.risk_level === 'high' ? '高风险' : screening.risk_level === 'medium' ? '中风险' : '低风险'}
                </span>
              </div>
            )}

            {/* Notes */}
            {screening.notes && (
              <div>
                <p className="text-xs text-macos-text-muted mb-1">备注:</p>
                <p className="text-sm text-macos-text-secondary">{screening.notes}</p>
              </div>
            )}

            {/* Results */}
            {screening.result && (
              <div>
                <p className="text-xs text-macos-text-muted mb-1">检查结果:</p>
                <div className="p-2 bg-macos-bg-secondary rounded">
                  <p className="text-sm text-macos-text-primary">{screening.result}</p>
                </div>
              </div>
            )}

            {/* Recommendations */}
            {screening.recommendations && screening.recommendations.length > 0 && (
              <div>
                <p className="text-xs text-macos-text-muted mb-1">建议:</p>
                <ul className="space-y-1">
                  {screening.recommendations.map((rec, index) => (
                    <li
                      key={index}
                      className="text-xs text-macos-text-secondary flex items-start space-x-2"
                    >
                      <div className="w-1 h-1 rounded-full bg-macos-accent-coral mt-1.5 flex-shrink-0" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Next Screening */}
            {screening.next_screening && (
              <div className="p-2 bg-blue-50 rounded">
                <p className="text-xs text-blue-900">
                  <span className="font-medium">下次检查:</span> {screening.next_screening}
                </p>
              </div>
            )}

            {/* Action Button */}
            {screening.status !== 'completed' && daysStatus?.isUpcoming && (
              <button className="w-full px-3 py-2 bg-macos-accent-coral/10 text-macos-accent-coral rounded text-sm font-medium hover:bg-macos-accent-coral/20 transition-colors">
                安排检查
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
