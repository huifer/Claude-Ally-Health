import { loadProfileData } from '@/lib/data/loader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { WeightChart, BMIChart } from '@/components/profile/WeightCharts';

export default function WeightPage() {
  const profile = loadProfileData();

  const chartData = profile.history
    .slice(-20)
    .map((h) => ({
      date: new Date(h.date).toLocaleDateString('zh-CN', {
        year: '2-digit',
        month: '2-digit',
        day: '2-digit',
      }),
      weight: h.weight,
      bmi: h.bmi,
    }))
    .reverse();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">体量管理</h1>
        <p className="text-gray-600 mt-1">
          查看您的体重和 BMI 历史趋势
        </p>
      </div>

      {/* Current Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>当前体重</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-gray-900">
              {profile.basic_info.weight} {profile.basic_info.weight_unit}
            </div>
            <p className="text-sm text-gray-600 mt-2">
              BMI: {profile.calculated.bmi} ({profile.calculated.bmi_status})
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>历史记录</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-gray-900">
              {profile.history.length}
            </div>
            <p className="text-sm text-gray-600 mt-2">
              条记录
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Weight Chart */}
      <Card>
        <CardHeader>
          <CardTitle>体重趋势</CardTitle>
        </CardHeader>
        <CardContent>
          <WeightChart chartData={chartData} />
        </CardContent>
      </Card>

      {/* BMI Chart */}
      <Card>
        <CardHeader>
          <CardTitle>BMI 趋势</CardTitle>
        </CardHeader>
        <CardContent>
          <BMIChart chartData={chartData} />
        </CardContent>
      </Card>

      {/* History Table */}
      <Card>
        <CardHeader>
          <CardTitle>历史记录</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>日期</TableHead>
                  <TableHead>体重</TableHead>
                  <TableHead>BMI</TableHead>
                  <TableHead>备注</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {profile.history.slice(0, 20).map((record, index) => (
                  <TableRow key={index}>
                    <TableCell>{record.date}</TableCell>
                    <TableCell className="font-medium">
                      {record.weight} kg
                    </TableCell>
                    <TableCell>{record.bmi}</TableCell>
                    <TableCell className="text-gray-600">
                      {record.notes}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
