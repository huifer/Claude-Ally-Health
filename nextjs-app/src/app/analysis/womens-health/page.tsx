'use client';

import { useState, useEffect } from 'react';
import { readAllHealthData } from '@/lib/data-reader';
import { HealthData } from '@/types/health-data';
import { Calendar, TrendingUp, Activity, Baby } from 'lucide-react';
import { PageHeader } from '@/components/navigation';
import { SymptomChart } from '@/components/charts/SymptomChart';

export default function WomensHealthPage() {
  const [healthData, setHealthData] = useState<Partial<HealthData> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const response = await fetch('/api/data');
        const result = await response.json();
        if (result.success) {
          setHealthData(result.data);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6B6B] mb-4"></div>
            <p className="text-gray-600">加载数据中...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-[#FFF5F5] rounded-lg">
            <Calendar className="w-6 h-6 text-[#FF6B6B]" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">女性健康追踪</h1>
            <p className="text-gray-600">
              月经周期、孕期、更年期综合健康管理
            </p>
          </div>
        </div>
      </header>

      {/* Overview Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-[#FFF5F5] rounded-lg">
              <Calendar className="w-5 h-5 text-[#FF6B6B]" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">周期追踪</h3>
              <p className="text-sm text-gray-500">Menstrual Cycles</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">已追踪周期</span>
              <span className="font-semibold text-gray-900">
                {healthData?.cycleTracker?.statistics?.total_cycles_tracked || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">平均周期长度</span>
              <span className="font-semibold text-gray-900">
                {healthData?.cycleTracker?.statistics?.average_cycle_length || 'N/A'} 天
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">规律性评分</span>
              <span className="font-semibold text-gray-900">
                {healthData?.cycleTracker?.statistics?.regularity_score || 'N/A'}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Baby className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">孕期监测</h3>
              <p className="text-sm text-gray-500">Pregnancy</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">当前孕期</span>
              <span className="font-semibold text-purple-600">
                {healthData?.pregnancyTracker?.current_pregnancy ? '进行中' : '无'}
              </span>
            </div>
            {healthData?.pregnancyTracker?.current_pregnancy && (
              <>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">孕周</span>
                  <span className="font-semibold text-gray-900">
                    {healthData.pregnancyTracker.current_pregnancy.current_week} 周
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">体重增长</span>
                  <span className="font-semibold text-gray-900">
                    {healthData.pregnancyTracker.statistics?.total_weight_gain || 0} kg
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-orange-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">更年期追踪</h3>
              <p className="text-sm text-gray-500">Menopause</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">追踪状态</span>
              <span className="font-semibold text-orange-600">
                {healthData?.menopauseTracker?.menopause_tracking ? '进行中' : '未开始'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">症状记录</span>
              <span className="font-semibold text-gray-900">
                {healthData?.menopauseTracker?.statistics?.total_symptom_records || 0} 条
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">HRT 使用</span>
              <span className="font-semibold text-gray-900">
                {healthData?.menopauseTracker?.statistics?.hrt_use ? '是' : '否'}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Cycle Tracking Details */}
      {healthData?.cycleTracker?.cycles && healthData.cycleTracker.cycles.length > 0 && (
        <section className="mb-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#FF6B6B]" />
            周期记录详情
          </h2>
          <div className="space-y-4">
            {healthData.cycleTracker.cycles.slice(0, 3).map((cycle, index) => (
              <div key={index} className="border-b pb-4 last:border-0">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-semibold">周期 #{index + 1}</p>
                    <p className="text-sm text-gray-600">
                      {cycle.period_start} 至 {cycle.period_end}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">周期长度</p>
                    <p className="font-semibold">{cycle.cycle_length} 天</p>
                  </div>
                </div>
                {cycle.daily_logs && cycle.daily_logs.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm font-medium text-gray-700 mb-2">症状记录：</p>
                    <div className="flex flex-wrap gap-2">
                      {Array.from(new Set(cycle.daily_logs.flatMap(log => log.symptoms || [])))
                        .slice(0, 5)
                        .map((symptom, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 text-xs bg-[#FFF5F5] text-pink-700 rounded-full"
                          >
                            {symptom}
                          </span>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Symptom Analysis */}
      {healthData?.cycleTracker?.cycles && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#FF6B6B]" />
            症状频率分析
          </h2>
          <div className="bg-white rounded-lg shadow-md p-6">
            <SymptomChart
              data={getSymptomData(healthData.cycleTracker.cycles)}
              type="bar"
            />
          </div>
        </section>
      )}

      {/* Screening Status */}
      {healthData?.screeningTracker && (
        <section className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-green-600" />
            筛查记录
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">宫颈癌筛查</h3>
              <p className="text-sm text-gray-600 mb-2">
                已完成 {healthData.screeningTracker.statistics?.total_cervical_screenings || 0} 次筛查
              </p>
              {healthData.screeningTracker.statistics?.abnormal_results_count > 0 && (
                <p className="text-sm text-red-600">
                  {healthData.screeningTracker.statistics.abnormal_results_count} 次异常结果
                </p>
              )}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">下次筛查</h3>
              <p className="text-sm text-gray-600">
                {healthData.screeningTracker.statistics?.next_screening_due || '未安排'}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Info Section */}
      <section className="bg-pink-50 border-l-4 border-pink-400 p-6 rounded">
        <div className="flex">
          <div className="flex-shrink-0">
            <Calendar className="h-5 w-5 text-pink-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-pink-800 mb-2">
              女性健康追踪说明
            </h3>
            <div className="text-sm text-pink-700 space-y-1">
              <p>• 记录月经周期有助于了解身体状况和规律</p>
              <p>• 孕期监测可以跟踪胎儿发育和健康指标</p>
              <p>• 更年期症状管理有助于改善生活质量</p>
              <p>• 定期筛查是预防妇科疾病的重要手段</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// Helper function to extract symptom data
function getSymptomData(cycles: any[]): Array<{ symptom: string; count: number }> {
  const symptomCounts: Record<string, number> = {};

  cycles.forEach(cycle => {
    cycle.daily_logs?.forEach((log: any) => {
      log.symptoms?.forEach((symptom: string) => {
        symptomCounts[symptom] = (symptomCounts[symptom] || 0) + 1;
      });
    });
  });

  return Object.entries(symptomCounts)
    .map(([symptom, count]) => ({ symptom, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
}
