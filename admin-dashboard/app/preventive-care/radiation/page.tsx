import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

export default function PreventiveCareRadiationPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">辐射安全</h1>
        <p className="text-gray-600 mt-1">追踪医学辐射暴露记录</p>
      </div>

      <Card>
        <CardContent className="py-12">
          <div className="text-center text-gray-500">
            <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium">功能开发中</p>
            <p className="text-sm mt-1">该功能即将上线,敬请期待</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
