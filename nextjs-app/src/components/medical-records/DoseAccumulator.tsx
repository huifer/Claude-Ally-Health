import { TrendingUp, AlertTriangle } from 'lucide-react';
import { RadiationRecords } from '@/types/health-data';

interface DoseAccumulatorProps {
  data: RadiationRecords;
}

export function DoseAccumulator({ data }: DoseAccumulatorProps) {
  const { statistics, records } = data;
  const avgDosePerExam = records.length > 0 ? statistics.total_dose / records.length : 0;

  // Get current year
  const currentYear = new Date().getFullYear();
  const currentYearDose = records
    .filter(r => r.date.startsWith(currentYear.toString()))
    .reduce((sum, r) => sum + r.effective_dose, 0);

  // Annual limit (general public: 1 mSv)
  const annualLimit = 1.0;
  const percentageOfLimit = (currentYearDose / annualLimit) * 100;

  return (
    <div className="space-y-4">
      {/* Total Cumulative Dose */}
      <div className="bg-gradient-to-br from-blue-50 to-blue-100/30 p-6 rounded-2xl border border-blue-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">累计总剂量</p>
            <p className="text-3xl font-bold text-gray-900">
              {statistics.total_dose.toFixed(3)} mSv
            </p>
          </div>
          <TrendingUp className="w-12 h-12 text-blue-600" />
        </div>
        <p className="text-xs text-gray-500 mt-2">
          基于所有 {records.length} 次检查记录
        </p>
      </div>

      {/* Current Year Progress */}
      <div className="bg-macos-bg-card p-6 rounded-2xl border border-macos-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-macos-text-primary">
            {currentYear}年剂量
          </h3>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            currentYearDose > annualLimit
              ? 'bg-red-100 text-red-700'
              : currentYearDose > annualLimit * 0.8
              ? 'bg-orange-100 text-orange-700'
              : 'bg-green-100 text-green-700'
          }`}>
            {percentageOfLimit.toFixed(0)}% 年限值
          </span>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm text-macos-text-muted mb-2">
            <span>{currentYearDose.toFixed(3)} mSv</span>
            <span>限额: {annualLimit} mSv</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                currentYearDose > annualLimit
                  ? 'bg-red-500'
                  : currentYearDose > annualLimit * 0.8
                  ? 'bg-orange-500'
                  : 'bg-green-500'
              }`}
              style={{ width: `${Math.min(percentageOfLimit, 100)}%` }}
            />
          </div>
        </div>

        {currentYearDose > annualLimit && (
          <div className="flex items-start space-x-2 p-3 bg-red-50 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-red-900">
              <p className="font-semibold">超过年限值</p>
              <p className="text-xs mt-1">本年度辐射剂量已超过公众年剂量限值</p>
            </div>
          </div>
        )}
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-macos-bg-card p-4 rounded-xl border border-macos-border">
          <p className="text-xs text-macos-text-muted mb-1">本年度</p>
          <p className="text-xl font-bold text-macos-text-primary">
            {currentYearDose.toFixed(3)}
          </p>
          <p className="text-xs text-macos-text-muted">mSv</p>
        </div>

        <div className="bg-macos-bg-card p-4 rounded-xl border border-macos-border">
          <p className="text-xs text-macos-text-muted mb-1">平均每次</p>
          <p className="text-xl font-bold text-macos-text-primary">
            {avgDosePerExam.toFixed(3)}
          </p>
          <p className="text-xs text-macos-text-muted">mSv</p>
        </div>
      </div>
    </div>
  );
}
