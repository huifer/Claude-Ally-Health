import { Card, CardContent } from '@/components/ui/card';
import { FileText } from 'lucide-react';

export default function DashboardAnnualPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">年度报告</h1>
        <p className="text-gray-600 mt-1">查看您的年度健康报告</p>
      </div>

      <Card>
        <CardContent className="py-12">
          <div className="text-center text-gray-500">
            <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium">功能开发中</p>
            <p className="text-sm mt-1">年度报告功能即将上线</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
