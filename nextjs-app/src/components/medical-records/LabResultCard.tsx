import { useState } from 'react';
import { ChevronDown, ChevronRight, Beaker } from 'lucide-react';
import { LabResult } from '@/types/health-data';
import { AbnormalHighlighter } from './AbnormalHighlighter';

interface LabResultCardProps {
  result: LabResult;
  defaultExpanded?: boolean;
}

export function LabResultCard({ result, defaultExpanded = false }: LabResultCardProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const abnormalCount = result.summary?.abnormal_count || 0;

  return (
    <div className="bg-macos-bg-card rounded-2xl border border-macos-border overflow-hidden hover:shadow-md transition-all">
      {/* Header */}
      <div
        className="p-6 cursor-pointer hover:bg-macos-bg-hover transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-lg ${
              abnormalCount > 0
                ? 'bg-orange-100'
                : 'bg-green-100'
            }`}>
              <Beaker className={`w-6 h-6 ${
                abnormalCount > 0
                  ? 'text-orange-600'
                  : 'text-green-600'
              }`} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-macos-text-primary">
                {result.type}
              </h3>
              <p className="text-sm text-macos-text-muted">
                {result.date} • {result.hospital} • {result.department}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {abnormalCount > 0 && (
              <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                {abnormalCount} 项异常
              </span>
            )}
            <span className="text-sm text-macos-text-primary">
              {result.items.length} 项
            </span>
            {isExpanded ? (
              <ChevronDown className="w-5 h-5 text-macos-text-muted" />
            ) : (
              <ChevronRight className="w-5 h-5 text-macos-text-muted" />
            )}
          </div>
        </div>
      </div>

      {/* Detailed Items */}
      {isExpanded && (
        <div className="px-6 pb-6 border-t border-macos-border">
          <div className="mt-4 space-y-2">
            {result.items.map((item, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  item.is_abnormal
                    ? 'bg-orange-50 border border-orange-200'
                    : 'bg-macos-bg-secondary'
                }`}
              >
                <div className="flex-1">
                  <p className={`text-sm font-medium ${
                    item.is_abnormal ? 'text-orange-900' : 'text-macos-text-primary'
                  }`}>
                    {item.name}
                  </p>
                  <p className="text-xs text-macos-text-muted">
                    参考范围: {item.min_ref} - {item.max_ref} {item.unit}
                  </p>
                </div>
                <div className="text-right">
                  <AbnormalHighlighter
                    value={item.value}
                    isAbnormal={item.is_abnormal}
                    unit={item.unit}
                    reference={`${item.min_ref}-${item.max_ref}`}
                  />
                </div>
              </div>
            ))}
          </div>
          {result.summary && result.summary.abnormal_items.length > 0 && (
            <div className="mt-4 p-3 bg-orange-50 rounded-lg">
              <p className="text-xs font-medium text-orange-900 mb-2">
                异常项目:
              </p>
              <div className="flex flex-wrap gap-2">
                {result.summary.abnormal_items.map((item, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-orange-200 text-orange-800 rounded text-xs"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
