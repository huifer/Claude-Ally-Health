import { Card, CardContent } from '@/components/ui/card';
import { LineChart } from 'lucide-react';

export default function AnalyticsLabTrendsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">检查趋势</h1>
        <p className="text-gray-600 mt-1">追踪检查检验指标的变化趋势</p>
      </div>

      <Card>
        <CardContent className="py-12">
          <div className="text-center text-gray-500">
            <LineChart className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium">功能开发中</p>
            <p className="text-sm mt-1">该功能即将上线,敬请期待</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
