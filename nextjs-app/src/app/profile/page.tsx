'use client';

import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { ProfileStats } from '@/components/profile/ProfileStats';
import { useProfileData } from '@/hooks/useProfileData';
import { CardSkeleton } from '@/components/common/LoadingSkeleton';
import { EmptyState } from '@/components/common/EmptyState';
import { FileText } from 'lucide-react';

export default function ProfilePage() {
  const { profile, loading, error } = useProfileData();

  if (loading) {
    return (
      <div className="space-y-6">
        <CardSkeleton />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <EmptyState
        icon={FileText}
        title="无法加载个人档案"
        description={error || '请确保数据文件存在'}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-macos-text-primary mb-2">个人档案</h1>
        <p className="text-macos-text-muted">查看和管理您的个人健康信息</p>
      </div>

      <ProfileHeader profile={profile} />
      <ProfileStats profile={profile} />

      {/* Weight History Section */}
      <div className="bg-macos-bg-card p-6 rounded-2xl border border-macos-border">
        <h2 className="text-xl font-semibold text-macos-text-primary mb-4">
          体重历史记录
        </h2>
        <div className="space-y-2">
          {profile.history.slice(-5).reverse().map((record, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-macos-bg-secondary rounded-lg hover:bg-macos-bg-hover transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-macos-accent-coral rounded-full"></div>
                <span className="text-sm text-macos-text-muted">{record.date}</span>
              </div>
              <div className="text-right">
                <span className="text-lg font-semibold text-macos-text-primary">
                  {record.weight} kg
                </span>
                <span className="ml-3 text-sm text-macos-text-muted">
                  BMI: {record.bmi.toFixed(1)}
                </span>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-macos-text-muted mt-4">
          显示最近 5 条记录 • 共 {profile.history.length} 条记录
        </p>
      </div>
    </div>
  );
}
