'use client';

import { useState } from 'react';
import { Calendar, Clock, TrendingUp } from 'lucide-react';

interface TimeRangeSelectorProps {
  onRangeChange?: (range: { start: string; end: string }) => void;
  className?: string;
}

export function TimeRangeSelector({ onRangeChange, className = '' }: TimeRangeSelectorProps) {
  const [selectedRange, setSelectedRange] = useState<string>('3m');

  const ranges = [
    { id: '1w', label: '近1周', icon: Clock, days: 7 },
    { id: '1m', label: '近1月', icon: Calendar, days: 30 },
    { id: '3m', label: '近3月', icon: TrendingUp, days: 90 },
    { id: '6m', label: '近6月', icon: TrendingUp, days: 180 },
    { id: '1y', label: '近1年', icon: Calendar, days: 365 },
    { id: 'all', label: '全部', icon: Clock, days: null }
  ];

  const handleRangeChange = (rangeId: string) => {
    setSelectedRange(rangeId);

    const range = ranges.find(r => r.id === rangeId);
    if (!range) return;

    const endDate = new Date();
    const startDate = range.days
      ? new Date(endDate.getTime() - range.days * 24 * 60 * 60 * 1000)
      : new Date(2020, 0, 1); // Default start date for "all"

    if (onRangeChange) {
      onRangeChange({
        start: startDate.toISOString().split('T')[0],
        end: endDate.toISOString().split('T')[0]
      });
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-4 ${className}`}>
      <div className="flex flex-wrap gap-2">
        {ranges.map((range) => {
          const Icon = range.icon;
          const isSelected = selectedRange === range.id;

          return (
            <button
              key={range.id}
              onClick={() => handleRangeChange(range.id)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200
                ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-md hover:bg-blue-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
              `}
            >
              <Icon className="w-4 h-4" />
              <span className="font-medium">{range.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
