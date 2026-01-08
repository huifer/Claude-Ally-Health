'use client';

import { Calendar } from 'lucide-react';

type TimeRange = '3m' | '6m' | '1y' | 'all';

interface TimeRangeSelectorProps {
  value: TimeRange;
  onChange: (range: TimeRange) => void;
}

export function TimeRangeSelector({ value, onChange }: TimeRangeSelectorProps) {
  const ranges = [
    { value: '3m' as TimeRange, label: '近3个月' },
    { value: '6m' as TimeRange, label: '近6个月' },
    { value: '1y' as TimeRange, label: '近1年' },
    { value: 'all' as TimeRange, label: '全部' }
  ];

  return (
    <div className="bg-macos-bg-card border border-macos-border rounded-macos shadow-macos p-4">
      <div className="flex items-center gap-2 mb-3">
        <Calendar className="w-4 h-4 text-macos-text-muted" />
        <span className="text-sm font-medium text-macos-text-primary">
          时间范围
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {ranges.map(range => (
          <button
            key={range.value}
            onClick={() => onChange(range.value)}
            className={`
              px-4 py-2 rounded-macos text-sm font-medium
              transition-all duration-150
              ${value === range.value
                ? 'bg-macos-accent-coral text-white shadow-sm'
                : 'bg-macos-bg-secondary text-macos-text-secondary hover:bg-macos-bg-primary'
              }
            `}
          >
            {range.label}
          </button>
        ))}
      </div>
    </div>
  );
}
