'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface FilterProps {
  dateRange: {
    type: 'preset' | 'custom';
    preset?: string;
    start?: string;
    end?: string;
  };
  onDateRangeChange: (range: any) => void;
  aggregation: string;
  onAggregationChange: (value: string) => void;
}

export function AnalyticsFilters({
  dateRange,
  onDateRangeChange,
  aggregation,
  onAggregationChange,
}: FilterProps) {
  const presets = ['3M', '6M', '1Y', '3Y', 'ALL'];
  const presetLabels = {
    '3M': '3个月',
    '6M': '6个月',
    '1Y': '1年',
    '3Y': '3年',
    'ALL': '全部'
  };

  const aggregations = [
    { value: 'daily', label: '按天' },
    { value: 'weekly', label: '按周' },
    { value: 'monthly', label: '按月' },
    { value: 'quarterly', label: '按季度' },
    { value: 'yearly', label: '按年' },
  ];

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {/* Date Range Presets */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              时间范围
            </label>
            <Tabs
              value={dateRange.preset || 'ALL'}
              onValueChange={(value) => onDateRangeChange({ type: 'preset', preset: value })}
            >
              <TabsList className="grid w-full grid-cols-5">
                {presets.map(preset => (
                  <TabsTrigger key={preset} value={preset}>
                    {presetLabels[preset as keyof typeof presetLabels]}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          {/* Aggregation Period */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              数据聚合
            </label>
            <div className="flex flex-wrap gap-2">
              {aggregations.map(agg => (
                <Button
                  key={agg.value}
                  variant={aggregation === agg.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onAggregationChange(agg.value)}
                  className={aggregation === agg.value ? 'bg-green-600 hover:bg-green-700' : ''}
                >
                  {agg.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
