'use client';

import { useHealthData } from '@/hooks/useHealthData';
import { CardSkeleton } from '@/components/common/LoadingSkeleton';
import { EmptyState } from '@/components/common/EmptyState';
import { Activity, Zap, Calendar } from 'lucide-react';
import { StatusCard } from '@/components/common/StatusCard';
import { RadiationTimeline } from '@/components/medical-records/RadiationTimeline';
import { DoseAccumulator } from '@/components/medical-records/DoseAccumulator';

export default function RadiationRecordsPage() {
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

  if (error || !healthData?.radiationRecords) {
    return (
      <EmptyState
        icon={Activity}
        title="无法加载辐射数据"
        description={error || '请确保数据文件存在'}
      />
    );
  }

  const radiationRecords = healthData.radiationRecords;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-macos-text-primary mb-2">辐射记录</h1>
        <p className="text-macos-text-muted">查看您的医疗辐射检查记录和剂量累积</p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatusCard
          title="总检查次数"
          value={radiationRecords.statistics.total_records}
          description="次检查"
          icon={Activity}
          color="coral"
        />
        <StatusCard
          title="累计剂量"
          value={`${radiationRecords.statistics.total_dose.toFixed(2)} mSv`}
          description="总计"
          icon={Zap}
          color="apricot"
        />
        <StatusCard
          title="今年剂量"
          value={`${radiationRecords.statistics.current_year_dose.toFixed(2)} mSv`}
          description="本年度"
          icon={Calendar}
          color="purple"
        />
        <StatusCard
          title="平均剂量"
          value={`${radiationRecords.statistics.effective_dose.toFixed(3)} mSv`}
          description="每次平均"
          icon={Activity}
          color="mint"
        />
      </div>

      {/* Dose Accumulator */}
      <DoseAccumulator data={radiationRecords} />

      {/* Radiation Exposure Info */}
      <div className="bg-gradient-to-br from-blue-50 to-blue-100/30 p-6 rounded-2xl border border-blue-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">辐射剂量参考</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="font-medium text-gray-900">胸部 X 光</p>
            <p className="text-gray-600">约 0.02 mSv</p>
          </div>
          <div>
            <p className="font-medium text-gray-900">乳腺钼靶</p>
            <p className="text-gray-600">约 0.4 mSv</p>
          </div>
          <div>
            <p className="font-medium text-gray-900">CT 扫描</p>
            <p className="text-gray-600">约 2-10 mSv</p>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-3">
          * 一般公众年剂量限值: 1 mSv (职业人员: 20 mSv/年)
        </p>
      </div>

      {/* Radiation Records Timeline */}
      <div className="bg-macos-bg-card p-6 rounded-2xl border border-macos-border">
        <h2 className="text-xl font-semibold text-macos-text-primary mb-4">检查记录</h2>
        <RadiationTimeline data={radiationRecords} />
      </div>
    </div>
  );
}
