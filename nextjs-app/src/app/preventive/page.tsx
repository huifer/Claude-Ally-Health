'use client';

import Link from 'next/link';
import { Search, Syringe, Shield } from 'lucide-react';
import { useHealthData } from '@/hooks/useHealthData';
import { CardSkeleton } from '@/components/common/LoadingSkeleton';
import { EmptyState } from '@/components/common/EmptyState';

interface NavCardProps {
  title: string;
  description: string;
  href: string;
  icon: typeof Shield;
  color: 'orange' | 'green' | 'blue';
}

function NavCard({ title, description, href, icon: Icon, color }: NavCardProps) {
  const colorClasses = {
    orange: 'from-orange-50 to-orange-100/50 border-orange-200 hover:border-orange-300',
    green: 'from-green-50 to-green-100/50 border-green-200 hover:border-green-300',
    blue: 'from-blue-50 to-blue-100/50 border-blue-200 hover:border-blue-300',
  };

  const iconColors = {
    orange: 'text-orange-600',
    green: 'text-green-600',
    blue: 'text-blue-600',
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

export default function PreventiveCareHubPage() {
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
        icon={Shield}
        title="无法加载数据"
        description={error || '请确保数据文件存在'}
      />
    );
  }

  const { screeningTracker, vaccinations } = healthData;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-macos-text-primary mb-2">预防保健</h1>
        <p className="text-macos-text-muted">管理您的筛查和疫苗接种记录</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-orange-50 to-orange-100/30 p-6 rounded-2xl border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">筛查状态</p>
              <p className="text-2xl font-bold text-gray-900">
                {screeningTracker?.statistics.screening_uptodate ? '最新' : '需要更新'}
              </p>
            </div>
            <Search className="w-12 h-12 text-orange-600" />
          </div>
          {screeningTracker?.statistics.next_screening_due && (
            <p className="text-xs text-gray-500 mt-2">
              下次: {screeningTracker.statistics.next_screening_due}
            </p>
          )}
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100/30 p-6 rounded-2xl border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">疫苗接种</p>
              <p className="text-3xl font-bold text-gray-900">
                {vaccinations?.statistics.series_completed || 0}
              </p>
              <p className="text-xs text-gray-500 mt-1">已完成系列</p>
            </div>
            <Syringe className="w-12 h-12 text-green-600" />
          </div>
          {vaccinations?.statistics.overdue_count === 0 ? (
            <p className="text-xs text-green-600 mt-2">✓ 无逾期</p>
          ) : (
            <p className="text-xs text-red-600 mt-2">
              {vaccinations?.statistics.overdue_count} 项逾期
            </p>
          )}
        </div>
      </div>

      {/* Navigation Cards */}
      <div>
        <h2 className="text-xl font-semibold text-macos-text-primary mb-4">预防保健记录</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <NavCard
            title="癌症筛查"
            description="查看宫颈癌、乳腺癌、结肠癌筛查记录"
            href="/preventive/screenings"
            icon={Search}
            color="orange"
          />
          <NavCard
            title="疫苗接种"
            description="管理疫苗接种记录和接种计划"
            href="/preventive/vaccinations"
            icon={Syringe}
            color="green"
          />
        </div>
      </div>
    </div>
  );
}
