'use client';

import { useState } from 'react';
import { useHealthData } from '@/hooks/useHealthData';
import { CardSkeleton } from '@/components/common/LoadingSkeleton';
import { EmptyState } from '@/components/common/EmptyState';
import { Search, Calendar } from 'lucide-react';
import { StatusBadge } from '@/components/preventive/StatusBadge';
import { StatusCard } from '@/components/common/StatusCard';

export default function ScreeningsPage() {
  const { healthData, loading, error } = useHealthData();
  const [selectedType, setSelectedType] = useState<string>('all');

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

  if (error || !healthData?.screeningTracker) {
    return (
      <EmptyState
        icon={Search}
        title="无法加载筛查数据"
        description={error || '请确保数据文件存在'}
      />
    );
  }

  const screeningTracker = healthData.screeningTracker;
  const { cancer_screening, statistics } = screeningTracker;

  const screeningTypes = ['all', 'cervical', 'breast', 'colon'];
  const typeLabels: Record<string, string> = {
    all: '全部',
    cervical: '宫颈癌筛查',
    breast: '乳腺癌筛查',
    colon: '结肠癌筛查',
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-macos-text-primary mb-2">癌症筛查</h1>
        <p className="text-macos-text-muted">管理您的癌症筛查记录和计划</p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatusCard
          title="总筛查次数"
          value={statistics.total_cervical_screenings}
          description="宫颈癌筛查"
          icon={Search}
          color="coral"
        />
        <StatusCard
          title="筛查年限"
          value={statistics.years_of_screening}
          description="年"
          icon={Calendar}
          color="apricot"
        />
        <StatusCard
          title="异常结果"
          value={statistics.abnormal_results_count}
          description="需要关注"
          icon={Search}
          color="coral"
        />
        <StatusCard
          title="状态"
          value={statistics.screening_uptodate ? '最新' : '需更新'}
          description={statistics.next_screening_due || '未知'}
          icon={Search}
          color={statistics.screening_uptodate ? 'mint' : 'coral'}
        />
      </div>

      {/* Type Filter */}
      <div className="flex items-center space-x-2 border-b border-macos-border">
        {screeningTypes.map((type) => (
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

      {/* Screening Records */}
      <div className="space-y-6">
        {/* Cervical Cancer Screenings */}
        {(selectedType === 'all' || selectedType === 'cervical') && cancer_screening?.cervical && (
          <div className="bg-macos-bg-card p-6 rounded-2xl border border-macos-border">
            <h3 className="text-lg font-semibold text-macos-text-primary mb-4">
              宫颈癌筛查
            </h3>
            <div className="space-y-3">
              {cancer_screening.cervical.map((screening, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-macos-bg-secondary rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <Search className="w-5 h-5 text-macos-accent-coral" />
                    <div>
                      <p className="text-sm font-medium text-macos-text-primary">
                        {screening.date}
                      </p>
                      <p className="text-xs text-macos-text-muted">
                        {screening.hpv_result && `HPV: ${screening.hpv_result}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-macos-text-primary">
                      {screening.result}
                    </span>
                    <StatusBadge status="normal" result={screening.result} />
                  </div>
                </div>
              ))}
              {cancer_screening.cervical.length === 0 && (
                <p className="text-sm text-macos-text-muted text-center py-4">
                  暂无记录
                </p>
              )}
            </div>
          </div>
        )}

        {/* Breast Cancer Screenings */}
        {(selectedType === 'all' || selectedType === 'breast') && cancer_screening?.breast && (
          <div className="bg-macos-bg-card p-6 rounded-2xl border border-macos-border">
            <h3 className="text-lg font-semibold text-macos-text-primary mb-4">
              乳腺癌筛查
            </h3>
            <div className="space-y-3">
              {cancer_screening.breast.map((screening, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-macos-bg-secondary rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <Search className="w-5 h-5 text-macos-accent-coral" />
                    <div>
                      <p className="text-sm font-medium text-macos-text-primary">
                        {screening.date}
                      </p>
                      <p className="text-xs text-macos-text-muted">
                        方法: {screening.methodology}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-macos-text-primary">
                      {screening.result}
                    </span>
                    <StatusBadge status="normal" result={screening.result} />
                  </div>
                </div>
              ))}
              {cancer_screening.breast.length === 0 && (
                <p className="text-sm text-macos-text-muted text-center py-4">
                  暂无记录
                </p>
              )}
            </div>
          </div>
        )}

        {/* Colon Cancer Screenings */}
        {(selectedType === 'all' || selectedType === 'colon') && cancer_screening?.colon && (
          <div className="bg-macos-bg-card p-6 rounded-2xl border border-macos-border">
            <h3 className="text-lg font-semibold text-macos-text-primary mb-4">
              结肠癌筛查
            </h3>
            <div className="space-y-3">
              {cancer_screening.colon.map((screening, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-macos-bg-secondary rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <Search className="w-5 h-5 text-macos-accent-coral" />
                    <div>
                      <p className="text-sm font-medium text-macos-text-primary">
                        {screening.date}
                      </p>
                      <p className="text-xs text-macos-text-muted">
                        方法: {screening.methodology}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-macos-text-primary">
                      {screening.result}
                    </span>
                    <StatusBadge status="normal" result={screening.result} />
                  </div>
                </div>
              ))}
              {cancer_screening.colon.length === 0 && (
                <p className="text-sm text-macos-text-muted text-center py-4">
                  暂无记录
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
