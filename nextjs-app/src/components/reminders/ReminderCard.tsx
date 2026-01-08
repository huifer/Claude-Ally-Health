'use client';

import { CheckCircle, Calendar, Clock } from 'lucide-react';
import { TypeBadge } from './TypeBadge';

interface ReminderCardProps {
  id: string;
  title: string;
  description: string;
  type: string;
  date?: string;
  time?: string;
  hospital?: string;
  nextReminder: string;
  notes?: string;
  completed?: boolean;
  onToggle?: (id: string) => void;
}

export function ReminderCard({
  id,
  title,
  description,
  type,
  date,
  time,
  hospital,
  nextReminder,
  notes,
  completed = false,
  onToggle,
}: ReminderCardProps) {
  const isOverdue = new Date(nextReminder) < new Date();

  const handleToggle = () => {
    onToggle?.(id);
  };

  return (
    <div
      className={`bg-macos-bg-card p-5 rounded-xl border transition-all ${
        completed
          ? 'opacity-60 border-macos-border'
          : isOverdue
          ? 'border-red-200 bg-red-50/30'
          : 'border-macos-border hover:shadow-md'
      }`}
    >
      <div className="flex items-start space-x-4">
        {/* Checkbox */}
        {onToggle && (
          <button
            onClick={handleToggle}
            className={`mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors flex-shrink-0 ${
              completed
                ? 'bg-green-500 border-green-500'
                : 'border-macos-border hover:border-macos-accent-coral'
            }`}
          >
            {completed && <CheckCircle className="w-4 h-4 text-white" />}
          </button>
        )}

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3
                className={`text-base font-semibold ${
                  completed ? 'text-macos-text-muted line-through' : 'text-macos-text-primary'
                }`}
              >
                {title}
              </h3>
              <p className="text-sm text-macos-text-muted mt-1">{description}</p>
            </div>
            <TypeBadge type={type} />
          </div>

          <div className="flex items-center flex-wrap gap-4 text-xs text-macos-text-muted">
            <div className="flex items-center space-x-1">
              <Calendar className="w-3 h-3" />
              <span>{date ? date : nextReminder.split('T')[0]}</span>
            </div>
            {time && (
              <div className="flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>{time}</span>
              </div>
            )}
            {hospital && <span>{hospital}</span>}
            {isOverdue && !completed && (
              <span className="text-red-600 font-medium">已逾期</span>
            )}
          </div>

          {notes && (
            <p className="text-xs text-macos-text-muted mt-2 bg-macos-bg-secondary p-2 rounded">
              备注: {notes}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
