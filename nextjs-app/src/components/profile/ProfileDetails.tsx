'use client';

import { User, Calendar, Activity, Heart, Droplet } from 'lucide-react';
import { Profile } from '@/types/health-data';

interface ProfileDetailsProps {
  profile: Profile;
}

export function ProfileDetails({ profile }: ProfileDetailsProps) {
  const { basic_info, calculated } = profile;

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { label: '偏瘦', color: 'text-blue-600', bg: 'bg-blue-100' };
    if (bmi < 24) return { label: '正常', color: 'text-green-600', bg: 'bg-green-100' };
    if (bmi < 28) return { label: '偏胖', color: 'text-orange-600', bg: 'bg-orange-100' };
    return { label: '肥胖', color: 'text-red-600', bg: 'bg-red-100' };
  };

  const bmiHighlight = calculated.bmi ? getBMICategory(calculated.bmi) : null;

  // Detail sections
  const basicInfo = [
    { label: '出生日期', value: basic_info.birth_date || '-', icon: Calendar },
    { label: '年龄', value: calculated.age_years !== null ? `${calculated.age_years} 岁` : '-', icon: User },
    { label: '身高', value: basic_info.height ? `${basic_info.height} ${basic_info.height_unit}` : '-', icon: Activity },
    { label: '体重', value: basic_info.weight ? `${basic_info.weight} ${basic_info.weight_unit}` : '-', icon: Activity },
  ];

  const healthInfo = [
    {
      label: 'BMI',
      value: calculated.bmi ? calculated.bmi.toFixed(1) : '-',
      icon: Heart,
      highlight: bmiHighlight,
    },
    {
      label: '体表面积',
      value: calculated.body_surface_area ? `${calculated.body_surface_area} ${calculated.bsa_unit}` : '-',
      icon: Droplet,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <div className="bg-macos-bg-card p-6 rounded-2xl border border-macos-border">
        <h3 className="text-lg font-semibold text-macos-text-primary mb-4">
          基本信息
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {basicInfo.map((item, index) => (
            <div
              key={index}
              className="flex items-center space-x-3 p-3 bg-macos-bg-secondary rounded-lg"
            >
              <div className="w-10 h-10 bg-macos-accent-coral/20 rounded-full flex items-center justify-center flex-shrink-0">
                <item.icon className="w-5 h-5 text-macos-accent-coral" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-macos-text-muted">{item.label}</p>
                <p className="text-sm font-medium text-macos-text-primary">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Health Information */}
      <div className="bg-macos-bg-card p-6 rounded-2xl border border-macos-border">
        <h3 className="text-lg font-semibold text-macos-text-primary mb-4">
          健康指标
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {healthInfo.map((item, index) => (
            <div
              key={index}
              className="flex items-center space-x-3 p-3 bg-macos-bg-secondary rounded-lg"
            >
              <div className="w-10 h-10 bg-macos-accent-mint/20 rounded-full flex items-center justify-center flex-shrink-0">
                <item.icon className="w-5 h-5 text-macos-accent-mint" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-macos-text-muted">{item.label}</p>
                <div className="flex items-center space-x-2">
                  <p className="text-sm font-medium text-macos-text-primary">{item.value}</p>
                  {item.highlight && (
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-medium ${item.highlight.bg} ${item.highlight.color}`}
                    >
                      {item.highlight.label}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* BMI Info */}
        {calculated.bmi && (
          <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
            <p className="text-sm text-blue-900 mb-2">
              <span className="font-semibold">BMI 说明:</span> BMI = 体重(kg) / 身高²(m)
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
              <div className="text-blue-700">
                <span className="font-medium">&lt; 18.5:</span> 偏瘦
              </div>
              <div className="text-green-700">
                <span className="font-medium">18.5-24:</span> 正常
              </div>
              <div className="text-orange-700">
                <span className="font-medium">24-28:</span> 偏胖
              </div>
              <div className="text-red-700">
                <span className="font-medium">&ge; 28:</span> 肥胖
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Data Info */}
      <div className="bg-macos-bg-card p-6 rounded-2xl border border-macos-border">
        <h3 className="text-lg font-semibold text-macos-text-primary mb-4">
          数据信息
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-xs text-macos-text-muted">首次记录</p>
            <p className="text-macos-text-primary">{profile.created_at || '-'}</p>
          </div>
          <div>
            <p className="text-xs text-macos-text-muted">最后更新</p>
            <p className="text-macos-text-primary">{profile.last_updated || '-'}</p>
          </div>
          <div>
            <p className="text-xs text-macos-text-muted">历史记录数</p>
            <p className="text-macos-text-primary">{profile.history.length} 条</p>
          </div>
        </div>
      </div>
    </div>
  );
}
