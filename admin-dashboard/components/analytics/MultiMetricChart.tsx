'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Metric {
  key: string;
  name: string;
  color: string;
  unit: string;
}

interface MultiMetricChartProps {
  data: Array<{ date: string; [key: string]: any }>;
  title: string;
  metrics: Metric[];
  height?: number;
}

export function MultiMetricChart({
  data,
  title,
  metrics,
  height = 350,
}: MultiMetricChartProps) {
  const chartData = data.map(point => ({
    ...point,
    formattedDate: new Date(point.date).toLocaleDateString('zh-CN', {
      month: 'short',
      day: 'numeric'
    })
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis
              dataKey="formattedDate"
              tick={{ fontSize: 12 }}
              stroke="#9ca3af"
            />
            <YAxis
              tick={{ fontSize: 12 }}
              stroke="#9ca3af"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
            />
            <Legend />
            {metrics.map(metric => (
              <Line
                key={metric.key}
                type="monotone"
                dataKey={metric.key}
                stroke={metric.color}
                strokeWidth={2}
                dot={{ fill: metric.color, r: 3 }}
                activeDot={{ r: 5 }}
                name={metric.name}
                unit={metric.unit}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
