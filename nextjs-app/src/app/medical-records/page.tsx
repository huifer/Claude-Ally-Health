'use client';

import Link from 'next/link';
import { FileText, Beaker, Activity } from 'lucide-react';
import { useHealthData } from '@/hooks/useHealthData';
import { CardSkeleton } from '@/components/common/LoadingSkeleton';
import { EmptyState } from '@/components/common/EmptyState';

interface NavCardProps {
  title: string;
  description: string;
  href: string;
  icon: typeof FileText;
  color: 'blue' | 'purple' | 'orange';
}

function NavCard({ title, description, href, icon: Icon, color }: NavCardProps) {
  const colorClasses = {
    blue: 'from-blue-50 to-blue-100/50 border-blue-200 hover:border-blue-300',
    purple: 'from-purple-50 to-purple-100/50 border-purple-200 hover:border-purple-300',
    orange: 'from-orange-50 to-orange-100/50 border-orange-200 hover:border-orange-300',
  };

  const iconColors = {
    blue: 'text-blue-600',
    purple: 'text-purple-600',
    orange: 'text-orange-600',
  };

  return (
    <Link href={href}>
      <div className={`p-6 rounded-2xl border-2 bg-gradient-to-br transition-all hover:shadow-lg ${colorClasses[color]}`}>
        <div className="flex items-start space-x-4">
          <div className={`p-3 bg-white rounded-lg ${iconColors[color]}`}>
            <Icon className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
            <p className="text-sm text-gray-600">{description}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function MedicalRecordsHubPage() {
  const { healthData, loading, error } = useHealthData();

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

  if (error || !healthData) {
    return (
      <EmptyState
        icon={FileText}
        title="无法加载数据"
        description={error || '请确保数据文件存在'}
      />
    );
  }

  const { labResults, radiationRecords } = healthData;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-macos-text-primary mb-2">检查记录</h1>
        <p className="text-macos-text-muted">查看和管理您的各类检查记录</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100/30 p-6 rounded-2xl border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">化验结果</p>
              <p className="text-3xl font-bold text-gray-900">
                {labResults?.length || 0}
              </p>
              <p className="text-xs text-gray-500 mt-1">份报告</p>
            </div>
            <Beaker className="w-12 h-12 text-blue-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100/30 p-6 rounded-2xl border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">辐射检查</p>
              <p className="text-3xl font-bold text-gray-900">
                {radiationRecords?.statistics.total_records || 0}
              </p>
              <p className="text-xs text-gray-500 mt-1">次检查</p>
            </div>
            <Activity className="w-12 h-12 text-orange-600" />
          </div>
          {radiationRecords && (
            <p className="text-xs text-gray-500 mt-2">
              累计: {radiationRecords.statistics.total_dose.toFixed(2)} mSv
            </p>
          )}
        </div>
      </div>

      {/* Navigation Cards */}
      <div>
        <h2 className="text-xl font-semibold text-macos-text-primary mb-4">检查记录</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <NavCard
            title="化验结果"
            description="查看血常规、生化等化验结果"
            href="/medical-records/lab-results"
            icon={Beaker}
            color="blue"
          />
          <NavCard
            title="辐射记录"
            description="查看 X 光、CT 等辐射检查记录"
            href="/medical-records/radiation"
            icon={Activity}
            color="orange"
          />
        </div>
      </div>
    </div>
  );
}
