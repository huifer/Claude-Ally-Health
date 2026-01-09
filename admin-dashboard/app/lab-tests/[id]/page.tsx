import { loadLabTestById } from '@/lib/data/loader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default function LabTestDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const test = loadLabTestById(params.id);

  if (!test) {
    notFound();
  }

  const abnormalItems = test.items.filter(item => item.is_abnormal);
  const normalItems = test.items.filter(item => !item.is_abnormal);

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link href="/lab-tests">
        <Button variant="ghost" className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          返回检查列表
        </Button>
      </Link>

      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{test.type}</h1>
        <p className="text-gray-600 mt-1">
          {test.date}
          {test.hospital && ` · ${test.hospital}`}
          {test.department && ` · ${test.department}`}
        </p>
      </div>

      {/* Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle>检查摘要</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-sm text-gray-600">总指标数</div>
              <div className="text-2xl font-bold text-gray-900 mt-1">
                {test.items.length}
              </div>
            </div>

            <div className="p-4 bg-red-50 rounded-lg">
              <div className="text-sm text-gray-600">异常指标</div>
              <div className="text-2xl font-bold text-red-600 mt-1">
                {abnormalItems.length}
              </div>
            </div>

            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-sm text-gray-600">正常指标</div>
              <div className="text-2xl font-bold text-green-600 mt-1">
                {normalItems.length}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Abnormal Items */}
      {abnormalItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              异常指标 ({abnormalItems.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {abnormalItems.map((item, index) => (
                <div
                  key={index}
                  className="p-4 border border-red-200 bg-red-50 rounded-lg"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        参考范围: {item.min_ref} - {item.max_ref} {item.unit}
                      </p>
                    </div>
                    <Badge variant="destructive" className="ml-2">
                      {item.abnormal_type === 'high' ? '偏高' : '偏低'}
                    </Badge>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-2xl font-bold text-red-600">
                      {item.value}
                    </span>
                    <span className="text-gray-600">{item.unit}</span>
                  </div>
                  {item.clinical_significance && (
                    <p className="text-sm text-gray-700 mt-2 p-3 bg-white rounded border">
                      <strong>临床意义:</strong> {item.clinical_significance}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Normal Items */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            正常指标 ({normalItems.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">
                    指标名称
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700">
                    检测值
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700">
                    单位
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700">
                    参考范围
                  </th>
                </tr>
              </thead>
              <tbody>
                {normalItems.map((item, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      {item.name}
                    </td>
                    <td className="py-3 px-4 text-right font-medium">
                      {item.value}
                    </td>
                    <td className="py-3 px-4 text-right text-gray-600">
                      {item.unit}
                    </td>
                    <td className="py-3 px-4 text-right text-sm text-gray-600">
                      {item.min_ref} - {item.max_ref}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Notes */}
      {(test.notes || test.doctor_advice) && (
        <Card>
          <CardHeader>
            <CardTitle>备注与建议</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {test.notes && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">备注</h3>
                  <p className="text-gray-700">{test.notes}</p>
                </div>
              )}
              {test.doctor_advice && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">医生建议</h3>
                  <p className="text-gray-700">{test.doctor_advice}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
