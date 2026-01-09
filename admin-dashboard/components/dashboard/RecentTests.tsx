import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LabTest } from '@/lib/types';
import { FileText, AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface Props {
  tests: LabTest[];
}

export function RecentTests({ tests }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>最近检查结果</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tests.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">暂无检查记录</p>
          ) : (
            tests.map((test) => {
              const abnormalCount = test.items.filter(item => item.is_abnormal).length;

              return (
                <div
                  key={test.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-primary-50 hover:border-primary-200 transition-all cursor-pointer"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <FileText className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{test.type}</h3>
                      <p className="text-sm text-gray-600">{test.date}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    {abnormalCount > 0 && (
                      <Badge variant="destructive" className="flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {abnormalCount} 项异常
                      </Badge>
                    )}
                    <Link href={`/lab-tests/${test.id}`}>
                      <Button variant="outline" size="sm" className="hover:bg-primary-600 hover:text-white hover:border-primary-600">
                        查看详情
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
