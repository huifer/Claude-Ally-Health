'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  ComposedChart,
} from 'recharts';
import { RadiationRecord } from '@/lib/types';
import { getExamTypeColor, calculateCumulativeDose } from '@/lib/analytics/transformers';

interface RadiationTimelineChartProps {
  records: RadiationRecord[];
  showThresholds?: boolean;
  height?: number;
}

export function RadiationTimelineChart({
  records,
  showThresholds = true,
  height = 400,
}: RadiationTimelineChartProps) {
  // Calculate cumulative dose
  const cumulativeData = calculateCumulativeDose(records);

  // Format data for chart
  const chartData = records
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((record, index) => {
      const cumulative = cumulativeData[index]?.cumulative || 0;
      return {
        date: new Date(record.date).toLocaleDateString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        }),
        examDate: record.date,
        dose: record.effective_dose,
        cumulative,
        examType: record.exam_type,
        bodyPart: record.body_part,
        hospital: record.hospital,
        fill: getExamTypeColor(record.exam_type)
      };
    });

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null;

    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
        <p className="text-sm font-medium text-gray-900 mb-2">{label}</p>
        {payload.map((entry: any, index: number) => {
          const doseData = chartData[entry.payload?.index || 0];
          return (
            <div key={index} className="text-xs">
              <p className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="font-medium">
                  {entry.name}: {entry.value.toFixed(2)} mSv
                </span>
              </p>
              {doseData && index === 0 && (
                <div className="ml-5 mt-1 text-gray-600">
                  <p>检查类型: {doseData.examType}</p>
                  <p>检查部位: {doseData.bodyPart}</p>
                  <p>医院: {doseData.hospital}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800">
          辐射剂量时间线
        </CardTitle>
        <p className="text-sm text-gray-600 mt-1">
          显示每次检查的辐射剂量及累计剂量
        </p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <ComposedChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12 }}
              stroke="#9ca3af"
              axisLine={{ stroke: '#e5e7eb' }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis
              yAxisId="left"
              label={{ value: '单次剂量 (mSv)', angle: -90, position: 'insideLeft' }}
              tick={{ fontSize: 12 }}
              stroke="#9ca3af"
              axisLine={{ stroke: '#e5e7eb' }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              label={{ value: '累计剂量 (mSv)', angle: 90, position: 'insideRight' }}
              tick={{ fontSize: 12 }}
              stroke="#9ca3af"
              axisLine={{ stroke: '#e5e7eb' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />

            {showThresholds && (
              <>
                <ReferenceLine
                  yAxisId="right"
                  y={1}
                  label="公众限值 1 mSv/年"
                  stroke="#eab308"
                  strokeDasharray="5 5"
                />
                <ReferenceLine
                  yAxisId="right"
                  y={20}
                  label="职业限值 20 mSv/年"
                  stroke="#ef4444"
                  strokeDasharray="5 5"
                />
              </>
            )}

            <Bar
              yAxisId="left"
              dataKey="dose"
              name="单次剂量"
              fill="#3b82f6"
              radius={[4, 4, 0, 0]}
            />

            <Line
              yAxisId="right"
              type="monotone"
              dataKey="cumulative"
              stroke="#ef4444"
              strokeWidth={3}
              dot={{ fill: '#ef4444', r: 4 }}
              activeDot={{ r: 6 }}
              name="累计剂量"
            />
          </ComposedChart>
        </ResponsiveContainer>

        <div className="mt-4 flex flex-wrap gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-blue-500"></span>
            <span>X光检查</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500"></span>
            <span>CT检查</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-purple-500"></span>
            <span>乳腺钼靶</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-green-500"></span>
            <span>超声检查(无辐射)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
