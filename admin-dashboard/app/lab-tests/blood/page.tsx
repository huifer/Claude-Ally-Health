import { Card, CardContent } from '@/components/ui/card';
import { TestTube } from 'lucide-react';
import Link from 'next/link';

export default function BloodTestsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">生化检查</h1>
        <p className="text-gray-600 mt-1">
          查看血液生化检查记录
        </p>
      </div>

      <Card>
        <CardContent className="py-12">
          <div className="text-center text-gray-500">
            <TestTube className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium">所有生化检查</p>
            <p className="text-sm mt-1">
              请前往<Link href="/lab-tests" className="text-primary underline ml-1">检查列表</Link>查看所有检查记录
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
