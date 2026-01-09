import { loadLabTests } from '@/lib/data/loader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, AlertCircle, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function LabTestsPage() {
  const labTests = loadLabTests();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">检查检验</h1>
        <p className="text-gray-600 mt-1">
          查看您的所有检查记录和结果
        </p>
      </div>

      {/* Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle>检查概览</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-500" />
                <span className="text-sm text-gray-600">总检查数</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 mt-2">
                {labTests.length}
              </div>
            </div>

            <div className="p-4 bg-red-50 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <span className="text-sm text-gray-600">异常检查</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 mt-2">
                {labTests.filter(test =>
                  test.items.some(item => item.is_abnormal)
                ).length}
              </div>
            </div>

            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-green-500" />
                <span className="text-sm text-gray-600">正常检查</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 mt-2">
                {labTests.filter(test =>
                  !test.items.some(item => item.is_abnormal)
                ).length}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tests List */}
      {labTests.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">暂无检查记录</p>
              <p className="text-sm mt-1">您的检查记录将显示在这里</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {labTests.map((test) => {
            const abnormalCount = test.items.filter(item => item.is_abnormal).length;
            const totalCount = test.items.length;

            return (
              <Card key={test.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        abnormalCount > 0 ? 'bg-red-100' : 'bg-primary/10'
                      }`}>
                        <FileText className={`w-6 h-6 ${
                          abnormalCount > 0 ? 'text-red-600' : 'text-primary'
                        }`} />
                      </div>

                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {test.type}
                        </h3>

                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{test.date}</span>
                          </div>

                          {test.hospital && (
                            <span>{test.hospital}</span>
                          )}

                          {test.department && (
                            <span>{test.department}</span>
                          )}
                        </div>

                        <div className="flex items-center gap-4 mt-3">
                          <span className="text-sm text-gray-600">
                            共 {totalCount} 项指标
                          </span>

                          {abnormalCount > 0 && (
                            <Badge variant="destructive" className="flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" />
                              {abnormalCount} 项异常
                            </Badge>
                          )}

                          {abnormalCount === 0 && (
                            <Badge variant="secondary" className="bg-green-100 text-green-700">
                              全部正常
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    <Link href={`/lab-tests/${test.id}`}>
                      <Button variant="outline">
                        查看详情
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
