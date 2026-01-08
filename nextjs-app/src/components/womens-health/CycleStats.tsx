import { Calendar, Clock, Activity } from 'lucide-react';
import { CycleTracker } from '@/types/health-data';
import { StatusCard } from '@/components/common/StatusCard';

interface CycleStatsProps {
  cycleTracker: CycleTracker;
}

export function CycleStats({ cycleTracker }: CycleStatsProps) {
  const { statistics, user_settings, cycles } = cycleTracker;
  const latestCycle = cycles[cycles.length - 1];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatusCard
        title="平均周期"
        value={`${statistics.average_cycle_length || user_settings.average_cycle_length} 天`}
        description="周期长度"
        icon={Calendar}
        color="coral"
      />
      <StatusCard
        title="平均经期"
        value={`${statistics.average_period_length || user_settings.average_period_length} 天`}
        description="经期长度"
        icon={Clock}
        color="purple"
      />
      <StatusCard
        title="规律度"
        value={statistics.regularity_score ? `${Math.round(statistics.regularity_score * 100)}%` : '-'}
        description="周期规律性"
        icon={Activity}
        color="coral"
      />
    </div>
  );
}
