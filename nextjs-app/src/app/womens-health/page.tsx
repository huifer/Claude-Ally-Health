'use client';

import Link from 'next/link';
import { Calendar, Baby, TrendingUp, Heart } from 'lucide-react';
import { useHealthData } from '@/hooks/useHealthData';
import { CardSkeleton } from '@/components/common/LoadingSkeleton';
import { EmptyState } from '@/components/common/EmptyState';

interface NavCardProps {
  title: string;
  description: string;
  href: string;
  icon: typeof Heart;
  color: 'pink' | 'green' | 'purple' | 'coral';
}

function NavCard({ title, description, href, icon: Icon, color }: NavCardProps) {
  const colorClasses = {
    pink: 'from-pink-50 to-pink-100/50 border-pink-200 hover:border-pink-300',
    green: 'from-green-50 to-green-100/50 border-green-200 hover:border-green-300',
    purple: 'from-purple-50 to-purple-100/50 border-purple-200 hover:border-purple-300',
    coral: 'from-coral-50 to-coral-100/50 border-coral-200 hover:border-coral-300',
  };

  const iconColors = {
    pink: 'text-pink-600',
    green: 'text-green-600',
    purple: 'text-purple-600',
    coral: 'text-coral-600',
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

export default function WomensHealthHubPage() {
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
        icon={Heart}
        title="无法加载数据"
        description={error || '请确保数据文件存在'}
      />
    );
  }

  const { cycleTracker, pregnancyTracker, menopauseTracker } = healthData;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-macos-text-primary mb-2">女性健康</h1>
        <p className="text-macos-text-muted">管理您的女性健康记录和追踪信息</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-pink-50 to-pink-100/30 p-6 rounded-2xl border border-pink-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">已记录周期</p>
              <p className="text-3xl font-bold text-gray-900">
                {cycleTracker?.statistics.total_cycles_tracked || 0}
              </p>
            </div>
            <Calendar className="w-12 h-12 text-pink-600" />
          </div>
          {cycleTracker?.statistics.average_cycle_length && (
            <p className="text-xs text-gray-500 mt-2">
              平均周期: {cycleTracker.statistics.average_cycle_length} 天
            </p>
          )}
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100/30 p-6 rounded-2xl border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">当前状态</p>
              <p className="text-lg font-bold text-gray-900">
                {pregnancyTracker?.current_pregnancy ? '孕期中' : '未孕期'}
              </p>
            </div>
            <Baby className="w-12 h-12 text-green-600" />
          </div>
          {pregnancyTracker?.current_pregnancy && (
            <p className="text-xs text-gray-500 mt-2">
              孕 {pregnancyTracker.current_pregnancy.current_week} 周
            </p>
          )}
        </div>
      </div>

      {/* Navigation Cards */}
      <div>
        <h2 className="text-xl font-semibold text-macos-text-primary mb-4">健康追踪</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <NavCard
            title="经期追踪"
            description="记录和追踪月经周期、症状和预测"
            href="/womens-health/cycle"
            icon={Calendar}
            color="pink"
          />
          <NavCard
            title="孕期管理"
            description="追踪孕期进度、产检记录和健康指标"
            href="/womens-health/pregnancy"
            icon={Baby}
            color="green"
          />
          <NavCard
            title="更年期"
            description="记录更年期症状和健康变化"
            href="/womens-health/menopause"
            icon={TrendingUp}
            color="purple"
          />
        </div>
      </div>
    </div>
  );
}
