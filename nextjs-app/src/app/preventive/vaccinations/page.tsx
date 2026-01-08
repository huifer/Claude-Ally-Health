'use client';

import { useHealthData } from '@/hooks/useHealthData';
import { CardSkeleton } from '@/components/common/LoadingSkeleton';
import { EmptyState } from '@/components/common/EmptyState';
import { Syringe, Calendar, AlertCircle } from 'lucide-react';
import { StatusCard } from '@/components/common/StatusCard';

export default function VaccinationsPage() {
  const { healthData, loading, error } = useHealthData();

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

  if (error || !healthData?.vaccinations) {
    return (
      <EmptyState
        icon={Syringe}
        title="无法加载疫苗数据"
        description={error || '请确保数据文件存在'}
      />
    );
  }

  const vaccinations = healthData.vaccinations;
  const { vaccination_records, statistics } = vaccinations;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-macos-text-primary mb-2">疫苗接种</h1>
        <p className="text-macos-text-muted">管理您的疫苗接种记录和计划</p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatusCard
          title="总记录数"
          value={statistics.total_vaccination_records}
          description="疫苗记录"
          icon={Syringe}
          color="coral"
        />
        <StatusCard
          title="已接种疫苗"
          value={statistics.total_doses_administered}
          description="剂次"
          icon={Syringe}
          color="mint"
        />
        <StatusCard
          title="已完成系列"
          value={statistics.series_completed}
          description="疫苗系列"
          icon={Calendar}
          color="apricot"
        />
        <StatusCard
          title="逾期未种"
          value={statistics.overdue_count}
          description="需要接种"
          icon={AlertCircle}
          color={statistics.overdue_count > 0 ? 'coral' : 'mint'}
        />
      </div>

      {/* Vaccination Records */}
      <div className="bg-macos-bg-card p-6 rounded-2xl border border-macos-border">
        <h2 className="text-xl font-semibold text-macos-text-primary mb-4">接种记录</h2>
        <div className="space-y-4">
          {vaccination_records.map((record) => (
            <div
              key={record.id}
              className="p-4 bg-macos-bg-secondary rounded-lg hover:bg-macos-bg-hover transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-macos-accent-mint/20 rounded-lg">
                    <Syringe className="w-5 h-5 text-macos-accent-mint" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-macos-text-primary">
                      {record.vaccine_name}
                    </h3>
                    <p className="text-xs text-macos-text-muted">
                      {record.dose_number ? `第 ${record.dose_number} 剂` : '单剂'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-macos-text-primary">
                    {record.administration_date}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                {record.next_due_date && (
                  <div>
                    <p className="text-macos-text-muted mb-1">下次接种</p>
                    <p className="font-medium text-macos-text-primary">
                      {record.next_due_date}
                    </p>
                  </div>
                )}
                {record.adverse_reactions && record.adverse_reactions.length > 0 && (
                  <div>
                    <p className="text-macos-text-muted mb-1">不良反应</p>
                    <p className="font-medium text-macos-text-primary">
                      {record.adverse_reactions.join(', ')}
                    </p>
                  </div>
                )}
              </div>

              {record.notes && (
                <div className="mt-3 pt-3 border-t border-macos-border">
                  <p className="text-xs text-macos-text-muted">
                    备注: {record.notes}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {vaccination_records.length === 0 && (
          <div className="text-center py-8">
            <Syringe className="w-12 h-12 text-macos-text-muted mx-auto mb-3" />
            <p className="text-sm text-macos-text-muted">暂无疫苗接种记录</p>
          </div>
        )}
      </div>

      {/* Upcoming Vaccinations */}
      {statistics.upcoming_30_days > 0 && (
        <div className="bg-gradient-to-br from-blue-50 to-blue-100/30 p-6 rounded-2xl border border-blue-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            即将到期疫苗 (30天内)
          </h3>
          <p className="text-sm text-gray-600">
            您有 {statistics.upcoming_30_days} 项疫苗接种即将到期，请及时接种
          </p>
        </div>
      )}
    </div>
  );
}
