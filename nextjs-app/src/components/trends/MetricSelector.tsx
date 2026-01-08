'use client';

import { BarChart3, Check } from 'lucide-react';

interface MetricSelectorProps {
  availableMetrics: string[];
  selectedMetrics: string[];
  onChange: (metrics: string[]) => void;
}

export function MetricSelector({
  availableMetrics,
  selectedMetrics,
  onChange
}: MetricSelectorProps) {
  const allMetrics: Record<string, { label: string; icon: string; color: string }> = {
    weight: { label: '体重', icon: '⚖️', color: '#FF6B6B' },
    bmi: { label: 'BMI', icon: '📊', color: '#FFB347' },
    symptoms: { label: '症状', icon: '📝', color: '#6BCB77' },
    lab_results: { label: '化验', icon: '🔬', color: '#4ECDC4' }
  };

  const toggleMetric = (metric: string) => {
    if (selectedMetrics.includes(metric)) {
      if (selectedMetrics.length > 1) {
        onChange(selectedMetrics.filter(m => m !== metric));
      }
    } else {
      onChange([...selectedMetrics, metric]);
    }
  };

  return (
    <div className="bg-macos-bg-card border border-macos-border rounded-macos shadow-macos p-4">
      <div className="flex items-center gap-2 mb-3">
        <BarChart3 className="w-4 h-4 text-macos-text-muted" />
        <span className="text-sm font-medium text-macos-text-primary">
          选择指标
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {availableMetrics.map(metric => {
          const config = allMetrics[metric];
          const isSelected = selectedMetrics.includes(metric);

          return (
            <button
              key={metric}
              onClick={() => toggleMetric(metric)}
              className={`
                relative px-4 py-2 rounded-macos text-sm font-medium
                border-2 transition-all duration-150
                ${isSelected
                  ? 'border-macos-accent-coral bg-macos-accent-coral/12 text-macos-accent-coral'
                  : 'border-macos-border bg-macos-bg-secondary text-macos-text-secondary hover:bg-macos-bg-primary'
                }
              `}
              style={{
                borderColor: isSelected ? config.color : undefined
              }}
            >
              <span className="mr-2">{config.icon}</span>
              {config.label}
              {isSelected && (
                <Check className="w-4 h-4 absolute -top-1 -right-1 bg-macos-accent-coral text-white rounded-full p-0.5" />
              )}
            </button>
          );
        })}
      </div>
      <p className="text-xs text-macos-text-muted mt-2">
        选择 1-4 个指标进行对比分析
      </p>
    </div>
  );
}
