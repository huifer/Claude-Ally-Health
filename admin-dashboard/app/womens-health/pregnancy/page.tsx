import { Card, CardContent } from '@/components/ui/card';
import { Baby } from 'lucide-react';

export default function WomensHealthPregnancyPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">孕期管理</h1>
        <p className="text-gray-600 mt-1">管理孕期健康记录和检查计划</p>
      </div>

      <Card>
        <CardContent className="py-12">
          <div className="text-center text-gray-500">
            <Baby className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium">功能开发中</p>
            <p className="text-sm mt-1">该功能即将上线,敬请期待</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
