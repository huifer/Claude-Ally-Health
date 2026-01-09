import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Pill } from 'lucide-react';

export default function MedicationsPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">用药记录</h1>
        <p className="text-gray-600 mt-1">
          查看您的当前用药清单和历史记录
        </p>
      </div>

      {/* Placeholder */}
      <Card>
        <CardContent className="py-12">
          <div className="text-center text-gray-500">
            <Pill className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium">功能开发中</p>
            <p className="text-sm mt-1">用药记录功能即将上线</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
