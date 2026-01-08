import { User } from 'lucide-react';
import { Profile } from '@/types/health-data';

interface ProfileHeaderProps {
  profile: Profile;
}

export function ProfileHeader({ profile }: ProfileHeaderProps) {
  const { basic_info, calculated } = profile;

  return (
    <div className="bg-gradient-to-br from-macos-accent-coral/10 to-macos-accent-apricot/10 p-8 rounded-2xl border border-macos-accent-coral/20">
      <div className="flex items-center space-x-6">
        <div className="p-4 bg-macos-bg-card rounded-full border-2 border-macos-accent-coral/30">
          <User className="w-12 h-12 text-macos-accent-coral" />
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-macos-text-primary mb-2">
            个人健康档案
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-macos-text-muted">年龄:</span>
              <span className="ml-2 font-semibold text-macos-text-primary">
                {calculated.age ? `${calculated.age} 岁` : '未设置'}
              </span>
            </div>
            <div>
              <span className="text-macos-text-muted">身高:</span>
              <span className="ml-2 font-semibold text-macos-text-primary">
                {basic_info.height ? `${basic_info.height} ${basic_info.height_unit}` : '未设置'}
              </span>
            </div>
            <div>
              <span className="text-macos-text-muted">体重:</span>
              <span className="ml-2 font-semibold text-macos-text-primary">
                {basic_info.weight ? `${basic_info.weight} ${basic_info.weight_unit}` : '未设置'}
              </span>
            </div>
            <div>
              <span className="text-macos-text-muted">BMI:</span>
              <span className="ml-2 font-semibold text-macos-text-primary">
                {calculated.bmi ? calculated.bmi.toFixed(1) : '未计算'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
