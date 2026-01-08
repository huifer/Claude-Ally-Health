'use client';

import { HealthData } from '@/types/health-data';
import { Activity, Heart, AlertCircle, Pill, Calendar, TrendingUp } from 'lucide-react';

interface SummaryCardsProps {
  healthData: Partial<HealthData>;
}

export function SummaryCards({ healthData }: SummaryCardsProps) {
  const cards = [
    {
      title: '体重变化',
      value: calculateWeightChange(healthData.profile),
      subtext: getWeightTrend(healthData.profile),
      icon: Activity,
      color: 'text-[#FF6B6B]',
      bgColor: 'bg-[#FFF5F5]'
    },
    {
      title: 'BMI 指数',
      value: healthData.profile?.calculated?.bmi?.toFixed(1) || 'N/A',
      subtext: getBMIStatus(healthData.profile?.calculated?.bmi),
      icon: Heart,
      color: 'text-[#FF8787]',
      bgColor: 'bg-[#FFF0F0]'
    },
    {
      title: '化验异常',
      value: countAbnormalLabs(healthData.labResults).toString(),
      subtext: '项异常指标',
      icon: AlertCircle,
      color: 'text-[#FFB347]',
      bgColor: 'bg-[#FFFBF0]'
    },
    {
      title: '疫苗接种',
      value: healthData.vaccinations?.statistics?.total_doses_administered?.toString() || '0',
      subtext: '剂次',
      icon: Pill,
      color: 'text-[#6BCB77]',
      bgColor: 'bg-[#F0FFF4]'
    },
    {
      title: '追踪周期',
      value: healthData.cycleTracker?.statistics?.total_cycles_tracked?.toString() || '0',
      subtext: '个周期',
      icon: Calendar,
      color: 'text-[#FF6B6B]',
      bgColor: 'bg-[#FFF5F5]'
    },
    {
      title: '过敏记录',
      value: healthData.allergies?.statistics?.total_allergies?.toString() || '0',
      subtext: `${healthData.allergies?.statistics?.severe_count || 0} 项严重`,
      icon: AlertCircle,
      color: 'text-[#FFA94D]',
      bgColor: 'bg-[#FFFAF5]'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={index}
            className="bg-macos-bg-card border border-macos-border rounded-macos shadow-macos p-5 hover:shadow-macos-lg transition-all duration-150 ease-out hover:-translate-y-0.5"
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`p-2 rounded-macos ${card.bgColor}`}>
                <Icon className={`w-5 h-5 ${card.color}`} />
              </div>
              {card.subtext && card.subtext !== '未知' && (
                <span className={`text-xs font-medium px-2 py-1 rounded-macos ${card.bgColor} ${card.color}`}>
                  {card.subtext}
                </span>
              )}
            </div>
            <h3 className="text-sm font-medium text-macos-text-secondary mb-1">{card.title}</h3>
            <p className="text-3xl font-bold text-macos-text-primary">{card.value}</p>
          </div>
        );
      })}
    </div>
  );
}

function calculateWeightChange(profile?: any): string {
  if (!profile?.history || profile.history.length < 2) return 'N/A';

  const latest = profile.history[profile.history.length - 1].weight;
  const earliest = profile.history[0].weight;
  const change = latest - earliest;

  if (Math.abs(change) < 0.1) return '稳定';

  const sign = change > 0 ? '+' : '';
  return `${sign}${change.toFixed(1)} kg`;
}

function getWeightTrend(profile?: any): string {
  if (!profile?.history || profile.history.length < 2) return '暂无数据';

  const weights = profile.history.map((h: any) => h.weight);
  const first = weights[0];
  const last = weights[weights.length - 1];
  const change = last - first;

  if (Math.abs(change) < 0.1) return '稳定';
  if (change > 0) return '增加';
  return '减少';
}

function getBMIStatus(bmi?: number | null): string {
  if (!bmi) return '未知';
  if (bmi < 18.5) return '偏瘦';
  if (bmi < 24) return '正常';
  if (bmi < 28) return '超重';
  return '肥胖';
}

function countAbnormalLabs(labResults?: any[]): number {
  if (!labResults) return 0;

  return labResults.reduce((count, result) => {
    const abnormal = result.items?.filter((item: any) => item.is_abnormal).length || 0;
    return count + abnormal;
  }, 0);
}
