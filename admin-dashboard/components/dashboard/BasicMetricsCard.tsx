import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Profile } from '@/lib/types';
import { Activity, Target, Ruler } from 'lucide-react';

interface Props {
  profile: Profile;
}

export function BasicMetricsCard({ profile }: Props) {
  const { basic_info, calculated } = profile;

  const metrics = [
    {
      label: '年龄',
      value: calculated.age,
      unit: '岁',
      icon: Activity,
      color: 'bg-primary-500',
    },
    {
      label: '身高',
      value: basic_info.height,
      unit: basic_info.height_unit,
      icon: Ruler,
      color: 'bg-primary-400',
    },
    {
      label: '体重',
      value: basic_info.weight,
      unit: basic_info.weight_unit,
      icon: Target,
      color: 'bg-primary-600',
    },
    {
      label: 'BMI',
      value: calculated.bmi,
      unit: calculated.bmi_status,
      icon: Activity,
      color: 'bg-primary-700',
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>基础指标</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {metrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <div
                key={metric.label}
                className="flex flex-col items-center p-4 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors cursor-pointer"
              >
                <div className={`w-10 h-10 ${metric.color} rounded-full flex items-center justify-center mb-3`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="text-sm text-gray-600 mb-1">{metric.label}</div>
                <div className="text-2xl font-bold text-gray-900">
                  {metric.value}
                </div>
                <div className="text-sm text-gray-500">{metric.unit}</div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
