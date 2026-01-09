'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from 'recharts';
import { RadiationStatistics } from '@/lib/types';
import { getSafetyLevelColor } from '@/lib/analytics/transformers';

interface AnnualDoseComparisonProps {
  statistics: RadiationStatistics;
}

export function AnnualDoseComparison({ statistics }: AnnualDoseComparisonProps) {
  const chartData = statistics.annual_dose_history.map((year) => ({
    year: `${year.year}年`,
    dose: year.dose_msv,
    exams: year.exams,
    color: getSafetyLevelColor(year.dose_msv),
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null;

    const data = payload[0].payload;
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
        <p className="text-sm font-medium text-gray-900 mb-2">{label}</p>
        <p className="text-xs text-gray-600">
          年度剂量: <span className="font-semibold">{data.dose.toFixed(2)} mSv</span>
        </p>
        <p className="text-xs text-gray-600">
          检查次数: <span className="font-semibold">{data.exams}次</span>
        </p>
        <p className="text-xs text-gray-600">
          平均每次: <span className="font-semibold">{(data.dose / data.exams).toFixed(2)} mSv</span>
        </p>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800">
          年度剂量对比
        </CardTitle>
        <p className="text-sm text-gray-600 mt-1">
          对比各年度辐射剂量与检查次数
        </p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis
              dataKey="year"
              tick={{ fontSize: 12 }}
              stroke="#9ca3af"
              axisLine={{ stroke: '#e5e7eb' }}
            />
            <YAxis
              label={{ value: '剂量 (mSv)', angle: -90, position: 'insideLeft' }}
              tick={{ fontSize: 12 }}
              stroke="#9ca3af"
              axisLine={{ stroke: '#e5e7eb' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />

            <ReferenceLine
              y={1}
              label="公众限值 1 mSv/年"
              stroke="#eab308"
              strokeDasharray="5 5"
            />

            <Bar dataKey="dose" name="年度剂量 (mSv)" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        <div className="mt-4 flex flex-wrap gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-green-500"></span>
            <span>&lt; 1 mSv/年 (安全)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
            <span>1-5 mSv/年 (注意)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-orange-500"></span>
            <span>5-10 mSv/年 (警告)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500"></span>
            <span>&gt; 10 mSv/年 (危险)</span>
          </div>
        </div>

        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-gray-700">
            <strong>ICRP安全标准:</strong> 公众照射限值为 1 mSv/年，职业人员限值为 20
            mSv/年(5年平均)。您当前累计剂量{' '}
            <span className="font-semibold text-blue-600">
              {statistics.total_cumulative_dose_msv.toFixed(2)} mSv
            </span>
            ，远低于安全限值。
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
