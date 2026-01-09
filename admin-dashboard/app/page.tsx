import { loadProfileData, loadLabTests, loadReminders } from '@/lib/data/loader';
import { BasicMetricsCard } from '@/components/dashboard/BasicMetricsCard';
import { RecentTests } from '@/components/dashboard/RecentTests';
import { UpcomingReminders } from '@/components/dashboard/UpcomingReminders';
import { TrendMiniCharts } from '@/components/dashboard/TrendMiniCharts';

export default function HomePage() {
  const profile = loadProfileData();
  const labTests = loadLabTests();
  const reminders = loadReminders();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">健康概览</h1>
        <p className="text-gray-600 mt-1">
          欢迎回来，查看您的健康状况概览
        </p>
      </div>

      {/* Basic Metrics */}
      <BasicMetricsCard profile={profile} />

      {/* Charts and Reminders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TrendMiniCharts profile={profile} />
        </div>
        <div>
          <UpcomingReminders reminders={reminders} />
        </div>
      </div>

      {/* Recent Tests */}
      <RecentTests tests={labTests.slice(0, 3)} />
    </div>
  );
}
