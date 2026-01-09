import { loadProfileData } from '@/lib/data/loader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Calendar, Activity, Target } from 'lucide-react';

export default function ProfilePage() {
  const profile = loadProfileData();
  const { basic_info, calculated } = profile;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">个人档案</h1>
        <p className="text-gray-600 mt-1">
          查看和管理您的基本健康信息
        </p>
      </div>

      {/* Basic Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            基本信息
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm text-gray-600">出生日期</label>
              <div className="flex items-center gap-2 mt-1">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="font-medium">{basic_info.birth_date}</span>
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-600">年龄</label>
              <div className="flex items-center gap-2 mt-1">
                <Activity className="w-4 h-4 text-gray-400" />
                <span className="font-medium">{calculated.age} 岁</span>
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-600">身高</label>
              <div className="flex items-center gap-2 mt-1">
                <Target className="w-4 h-4 text-gray-400" />
                <span className="font-medium">
                  {basic_info.height} {basic_info.height_unit}
                </span>
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-600">体重</label>
              <div className="flex items-center gap-2 mt-1">
                <Target className="w-4 h-4 text-gray-400" />
                <span className="font-medium">
                  {basic_info.weight} {basic_info.weight_unit}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Health Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle>健康指标总结</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">BMI</div>
              <div className="text-2xl font-bold text-gray-900">
                {calculated.bmi}
              </div>
              <Badge className="mt-2" variant="secondary">
                {calculated.bmi_status}
              </Badge>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">体表面积</div>
              <div className="text-2xl font-bold text-gray-900">
                {calculated.body_surface_area}
              </div>
              <div className="text-sm text-gray-600 mt-2">
                {calculated.bsa_unit}
              </div>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">历史记录</div>
              <div className="text-2xl font-bold text-gray-900">
                {profile.history.length}
              </div>
              <div className="text-sm text-gray-600 mt-2">
                条体重记录
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Links */}
      <Card>
        <CardHeader>
          <CardTitle>快速访问</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="/profile/weight"
              className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="font-medium text-gray-900">体量管理</div>
              <div className="text-sm text-gray-600 mt-1">
                查看体重/BMI 历史趋势
              </div>
            </a>
            <a
              href="/profile/allergies"
              className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="font-medium text-gray-900">过敏史</div>
              <div className="text-sm text-gray-600 mt-1">
                查看过敏原记录
              </div>
            </a>
            <a
              href="/profile/medications"
              className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="font-medium text-gray-900">用药记录</div>
              <div className="text-sm text-gray-600 mt-1">
                查看当前用药清单
              </div>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
