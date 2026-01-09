import { loadAllergies } from '@/lib/data/loader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Pill, Apple, Wind } from 'lucide-react';

export default function AllergiesPage() {
  const allergyData = loadAllergies();

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'drug':
        return Pill;
      case 'food':
        return Apple;
      case 'environmental':
        return Wind;
      default:
        return AlertTriangle;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'severe':
        return 'destructive';
      case 'moderate':
        return 'default';
      case 'mild':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getSeverityLabel = (severity: string) => {
    switch (severity) {
      case 'severe':
        return '严重';
      case 'moderate':
        return '中等';
      case 'mild':
        return '轻微';
      default:
        return severity;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'drug':
        return '药物';
      case 'food':
        return '食物';
      case 'environmental':
        return '环境';
      default:
        return category;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">过敏史</h1>
        <p className="text-gray-600 mt-1">
          查看您的过敏原记录和相关信息
        </p>
      </div>

      {/* Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle>过敏概览</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-red-50 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                <span className="text-sm text-gray-600">严重过敏</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 mt-2">
                {allergyData.allergies.filter(a => a.severity === 'severe').length}
              </div>
            </div>

            <div className="p-4 bg-yellow-50 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
                <span className="text-sm text-gray-600">中度过敏</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 mt-2">
                {allergyData.allergies.filter(a => a.severity === 'moderate').length}
              </div>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-blue-500" />
                <span className="text-sm text-gray-600">轻微过敏</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 mt-2">
                {allergyData.allergies.filter(a => a.severity === 'mild').length}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Allergies List */}
      {allergyData.allergies.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-gray-500">
              <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">暂无过敏记录</p>
              <p className="text-sm mt-1">如果您有过敏史，请及时记录</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {allergyData.allergies.map((allergy) => {
            const Icon = getCategoryIcon(allergy.category);

            return (
              <Card key={allergy.allergen}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">
                          {allergy.allergen}
                        </CardTitle>
                        <p className="text-sm text-gray-600 mt-1">
                          {getCategoryLabel(allergy.category)}
                        </p>
                      </div>
                    </div>
                    <Badge variant={getSeverityColor(allergy.severity) as any}>
                      {getSeverityLabel(allergy.severity)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-gray-600">症状</label>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {allergy.symptoms.map((symptom, index) => (
                          <Badge key={index} variant="outline">
                            {symptom}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm text-gray-600">首次发现</label>
                      <p className="text-sm font-medium mt-1">
                        {allergy.onset_date}
                      </p>
                    </div>

                    <div>
                      <label className="text-sm text-gray-600">最近发作</label>
                      <p className="text-sm font-medium mt-1">
                        {allergy.last_occurrence}
                      </p>
                    </div>

                    <div>
                      <label className="text-sm text-gray-600">确认方式</label>
                      <p className="text-sm font-medium mt-1">
                        {allergy.confirmed_by}
                      </p>
                    </div>

                    {allergy.notes && (
                      <div>
                        <label className="text-sm text-gray-600">备注</label>
                        <p className="text-sm text-gray-700 mt-1">
                          {allergy.notes}
                        </p>
                      </div>
                    )}
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
