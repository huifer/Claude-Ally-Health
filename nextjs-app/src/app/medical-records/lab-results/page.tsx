'use client';

import { useHealthData } from '@/hooks/useHealthData';
import { CardSkeleton } from '@/components/common/LoadingSkeleton';
import { EmptyState } from '@/components/common/EmptyState';
import { Beaker, AlertTriangle, FileText, Filter } from 'lucide-react';
import { LabResultCard } from '@/components/medical-records/LabResultCard';
import { LabResultTable } from '@/components/medical-records/LabResultTable';
import { useState } from 'react';

export default function LabResultsPage() {
  const { healthData, loading, error } = useHealthData();
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card');

  if (loading) {
    return (
      <div className="space-y-6">
        <CardSkeleton />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    );
  }

  if (error || !healthData?.labResults) {
    return (
      <EmptyState
        icon={Beaker}
        title="无法加载化验数据"
        description={error || '请确保数据文件存在'}
      />
    );
  }

  const labResults = healthData.labResults;

  // Sort by date (newest first)
  const sortedResults = [...labResults].sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const totalAbnormal = labResults.reduce((sum, r) => sum + (r.summary?.abnormal_count || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-macos-text-primary mb-2">化验结果</h1>
          <p className="text-macos-text-muted">查看您的各类化验检查结果</p>
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-macos-text-muted" />
          <button
            onClick={() => setViewMode(viewMode === 'card' ? 'table' : 'card')}
            className="px-4 py-2 bg-macos-bg-card border border-macos-border rounded-lg text-sm hover:bg-macos-bg-hover transition-colors"
          >
            {viewMode === 'card' ? '表格视图' : '卡片视图'}
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100/30 p-6 rounded-2xl border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">总报告数</p>
              <p className="text-3xl font-bold text-gray-900">{labResults.length}</p>
            </div>
            <FileText className="w-12 h-12 text-blue-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100/30 p-6 rounded-2xl border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">异常项目</p>
              <p className="text-3xl font-bold text-orange-600">{totalAbnormal}</p>
            </div>
            <AlertTriangle className="w-12 h-12 text-orange-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100/30 p-6 rounded-2xl border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">最新报告</p>
              <p className="text-lg font-semibold text-gray-900">
                {sortedResults[0]?.date || '-'}
              </p>
            </div>
            <Beaker className="w-12 h-12 text-green-600" />
          </div>
        </div>
      </div>

      {/* Lab Results Display */}
      {viewMode === 'card' ? (
        <div className="space-y-4">
          {sortedResults.map((result, index) => (
            <LabResultCard
              key={result.id || index}
              result={result}
              defaultExpanded={index === 0}
            />
          ))}
        </div>
      ) : (
        <LabResultTable results={sortedResults} showAbnormalOnly={false} />
      )}

      {labResults.length === 0 && (
        <EmptyState
          icon={Beaker}
          title="暂无化验结果"
          description="当有化验记录时，这里会显示"
        />
      )}
    </div>
  );
}
