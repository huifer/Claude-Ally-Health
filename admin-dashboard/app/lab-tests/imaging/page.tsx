import { Card, CardContent } from '@/components/ui/card';
import { ScanLine } from 'lucide-react';

export default function ImagingTestsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">影像检查</h1>
        <p className="text-gray-600 mt-1">
          查看影像检查记录（X光、CT、MRI等）
        </p>
      </div>

      <Card>
        <CardContent className="py-12">
          <div className="text-center text-gray-500">
            <ScanLine className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium">功能开发中</p>
            <p className="text-sm mt-1">影像检查功能即将上线</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
