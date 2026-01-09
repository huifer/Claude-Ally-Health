'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';

interface MetricOption {
  id: string;
  name: string;
  category: string;
  color: string;
}

interface MetricSelectorProps {
  options: MetricOption[];
  selected: string[];
  onChange: (selected: string[]) => void;
  title?: string;
}

export function MetricSelector({
  options,
  selected,
  onChange,
  title = '选择指标',
}: MetricSelectorProps) {
  const categories = Array.from(new Set(options.map(o => o.category)));

  const toggleMetric = (metricId: string) => {
    if (selected.includes(metricId)) {
      onChange(selected.filter(id => id !== metricId));
    } else {
      onChange([...selected, metricId]);
    }
  };

  const selectAll = () => onChange(options.map(o => o.id));
  const clearAll = () => onChange([]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{title}</CardTitle>
          <div className="flex gap-2">
            <button
              onClick={selectAll}
              className="text-xs text-green-600 hover:text-green-700 font-medium"
            >
              全选
            </button>
            <span className="text-gray-300">|</span>
            <button
              onClick={clearAll}
              className="text-xs text-gray-600 hover:text-gray-700 font-medium"
            >
              清空
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {categories.map(category => (
            <div key={category}>
              <Badge variant="outline" className="mb-2 bg-gray-50">
                {category}
              </Badge>
              <div className="space-y-2">
                {options
                  .filter(o => o.category === category)
                  .map(option => (
                    <div key={option.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={option.id}
                        checked={selected.includes(option.id)}
                        onCheckedChange={() => toggleMetric(option.id)}
                      />
                      <label
                        htmlFor={option.id}
                        className="flex-1 text-sm font-medium cursor-pointer flex items-center gap-2"
                      >
                        <span
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: option.color }}
                        />
                        {option.name}
                      </label>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
