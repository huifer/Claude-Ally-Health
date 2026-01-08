import { Activity, Target, TrendingDown } from 'lucide-react';
import { Profile } from '@/types/health-data';
import { StatusCard } from '@/components/common/StatusCard';

interface ProfileStatsProps {
  profile: Profile;
}

export function ProfileStats({ profile }: ProfileStatsProps) {
  const { calculated, history } = profile;
  const latestWeight = history[history.length - 1];

  // Calculate weight change
  const weightChange = history.length > 1
    ? ((latestWeight.weight - history[history.length - 2].weight) / history[history.length - 2].weight) * 100
    : 0;

  // BMI status category
  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { label: '偏瘦', color: 'teal' as const };
    if (bmi < 24) return { label: '正常', color: 'mint' as const };
    if (bmi < 28) return { label: '超重', color: 'apricot' as const };
    return { label: '肥胖', color: 'coral' as const };
  };

  const bmiCategory = calculated.bmi ? getBMICategory(calculated.bmi) : null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatusCard
        title="体重"
        value={`${latestWeight.weight} kg`}
        icon={Activity}
        description={latestWeight.date}
        trend={{
          value: Math.abs(weightChange),
          isPositive: weightChange < 0 // Weight loss is positive for health
        }}
        color="coral"
      />
      <StatusCard
        title="BMI 指数"
        value={calculated.bmi ? calculated.bmi.toFixed(1) : '-'}
        description={bmiCategory?.label || ''}
        icon={Target}
        color={bmiCategory?.color || 'default'}
      />
      <StatusCard
        title="体表面积"
        value={calculated.body_surface_area ? `${calculated.body_surface_area.toFixed(2)} m²` : '-'}
        description={calculated.bsa_unit}
        icon={TrendingDown}
        color="purple"
      />
    </div>
  );
}
