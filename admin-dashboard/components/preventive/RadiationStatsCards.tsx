'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Activity, Calendar, AlertTriangle, TrendingUp } from 'lucide-react';
import { RadiationStatistics } from '@/lib/types';
import { getSafetyLevelColor, getSafetyLevelLabel } from '@/lib/analytics/transformers';

interface RadiationStatsCardsProps {
  statistics: RadiationStatistics;
}

export function RadiationStatsCards({ statistics }: RadiationStatsCardsProps) {
  const safetyColor = getSafetyLevelColor(statistics.current_year_dose_msv);
  const safetyLabel = getSafetyLevelLabel(statistics.current_year_dose_msv);

  const cards = [
    {
      title: '累计辐射剂量',
      value: `${statistics.total_cumulative_dose_msv.toFixed(2)} mSv`,
      icon: Activity,
      color: 'blue',
      description: `跟踪 ${statistics.years_of_tracking} 年`,
    },
    {
      title: '本年度剂量',
      value: `${statistics.current_year_dose_msv.toFixed(2)} mSv`,
      icon: Calendar,
      color: 'green',
      description: `共 ${statistics.exams_this_year} 次检查`,
      badge: safetyLabel,
      badgeColor: safetyColor,
    },
    {
      title: '最高单次剂量',
      value: `${statistics.highest_single_dose_msv.toFixed(2)} mSv`,
      icon: AlertTriangle,
      color: 'orange',
      description: `${statistics.highest_dose_exam}`,
    },
    {
      title: '年平均剂量',
      value: `${statistics.average_annual_dose_msv.toFixed(2)} mSv/年`,
      icon: TrendingUp,
      color: 'purple',
      description: '基于历史数据',
    },
  ];

  const colorMap = {
    blue: {
      bg: 'bg-blue-50',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
    green: {
      bg: 'bg-green-50',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
    },
    orange: {
      bg: 'bg-orange-50',
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600',
    },
    purple: {
      bg: 'bg-purple-50',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
    },
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        const colors = colorMap[card.color as keyof typeof colorMap];

        return (
          <Card key={card.title} className={`${colors.bg} border-0`}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className={`${colors.iconBg} p-3 rounded-lg`}>
                  <Icon className={`w-6 h-6 ${colors.iconColor}`} />
                </div>
                {card.badge && (
                  <span
                    className="px-2 py-1 text-xs font-medium rounded-full"
                    style={{
                      backgroundColor: `${card.badgeColor}20`,
                      color: card.badgeColor,
                    }}
                  >
                    {card.badge}
                  </span>
                )}
              </div>
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {card.value}
                </p>
                <p className="text-xs text-gray-500 mt-1">{card.description}</p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
