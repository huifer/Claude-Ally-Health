'use client';

import { useState, useEffect } from 'react';
import { Heart, Activity, TrendingDown, Pill } from 'lucide-react';
import { PageHeader } from '@/components/navigation';

export default function ChronicDiseasePage() {
  const [healthData, setHealthData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const response = await fetch('/api/data');
        const result = await response.json();
        if (result.success) {
          setHealthData(result.data);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Mock chronic disease data for demonstration
  const chronicConditions = [
    {
      name: '高血压',
      status: 'controlled',
      icon: Heart,
      color: 'red',
      metrics: {
        targetBP: '130/80',
        currentBP: '128/78',
        goalAttainment: 85,
        medications: 2
      }
    },
    {
      name: '糖尿病',
      status: 'managed',
      icon: Activity,
      color: 'blue',
      metrics: {
        targetHbA1c: '<7.0%',
        currentHbA1c: '6.8%',
        goalAttainment: 90,
        medications: 1
      }
    }
  ];

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mb-4"></div>
            <p className="text-gray-600">加载数据中...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-red-100 rounded-lg">
            <Heart className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">慢性病管理</h1>
            <p className="text-gray-600">
              高血压、糖尿病等慢性疾病的长期管理和监测
            </p>
          </div>
        </div>
      </header>

      {/* Disease Management Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {chronicConditions.map((condition, index) => {
          const Icon = condition.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 bg-${condition.color}-100 rounded-lg`}>
                    <Icon className={`w-5 h-5 text-${condition.color}-600`} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{condition.name}</h3>
                    <p className="text-sm text-gray-500">Chronic Disease</p>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  condition.status === 'controlled'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {condition.status === 'controlled' ? '✓ 已控制' : '管理中'}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">目标达成率</span>
                  <span className="font-bold text-lg">
                    {condition.metrics.goalAttainment}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`bg-${condition.color}-500 h-2 rounded-full`}
                    style={{ width: `${condition.metrics.goalAttainment}%` }}
                  />
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">用药数量</span>
                  <span className="font-semibold">{condition.metrics.medications} 种</span>
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* Blood Pressure Monitoring */}
      <section className="mb-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Heart className="w-5 h-5 text-red-600" />
          血压监测
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">当前血压</p>
            <p className="text-3xl font-bold text-green-700">128/78</p>
            <p className="text-xs text-gray-500">mmHg</p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">目标血压</p>
            <p className="text-3xl font-bold text-blue-700">130/80</p>
            <p className="text-xs text-gray-500">mmHg</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">达标率</p>
            <p className="text-3xl font-bold text-purple-700">85%</p>
            <p className="text-xs text-gray-500">最近30天</p>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-2">血压分类标准</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">正常血压</span>
              <span className="font-medium">&lt;120/80 mmHg</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">高血压前期</span>
              <span className="font-medium">120-139/80-89 mmHg</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">高血压1期</span>
              <span className="font-medium">140-159/90-99 mmHg</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">高血压2期</span>
              <span className="font-medium">≥160/100 mmHg</span>
            </div>
          </div>
        </div>
      </section>

      {/* Blood Sugar Monitoring */}
      <section className="mb-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-600" />
          血糖监测
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">最近 HbA1c</p>
            <p className="text-3xl font-bold text-green-700">6.8%</p>
            <p className="text-xs text-gray-500">糖化血红蛋白</p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">目标 HbA1c</p>
            <p className="text-3xl font-bold text-blue-700">&lt;7.0%</p>
            <p className="text-xs text-gray-500">糖尿病控制</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">达标率</p>
            <p className="text-3xl font-bold text-purple-700">90%</p>
            <p className="text-xs text-gray-500">最近3个月</p>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-2">血糖控制标准</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium text-green-700 mb-1">✓ 良好控制</p>
              <p className="text-gray-600">HbA1c &lt; 7.0%</p>
            </div>
            <div>
              <p className="font-medium text-yellow-700 mb-1">⚠ 一般控制</p>
              <p className="text-gray-600">HbA1c 7.0-8.0%</p>
            </div>
            <div>
              <p className="font-medium text-orange-700 mb-1">⚠ 控制不佳</p>
              <p className="text-gray-600">HbA1c &gt; 8.0%</p>
            </div>
          </div>
        </div>
      </section>

      {/* Medication Adherence */}
      <section className="mb-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Pill className="w-5 h-5 text-purple-600" />
          用药依从性
        </h2>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-semibold text-gray-900">降压药</p>
              <p className="text-sm text-gray-600">每日1次，早晨服用</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">依从性</span>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                92%
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-semibold text-gray-900">降糖药</p>
              <p className="text-sm text-gray-600">每日2次，餐前服用</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">依从性</span>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                88%
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Lifestyle Recommendations */}
      <section className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">生活方式建议</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">饮食建议</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• 低盐饮食：每日盐摄入 &lt;6g</li>
              <li>• 控制碳水化物摄入</li>
              <li>• 增加蔬菜水果摄入</li>
              <li>• 限制酒精摄入</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">运动建议</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• 每周至少150分钟中等强度运动</li>
              <li>• 有氧运动：快走、游泳、骑行</li>
              <li>• 力量训练：每周2-3次</li>
              <li>• 避免久坐，定时活动</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">监测建议</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• 血压：每周至少测量2-3次</li>
              <li>• 血糖：定期检测空腹和餐后血糖</li>
              <li>• 体重：每月至少测量1次</li>
              <li>• HbA1c：每3-6个月检测1次</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">定期复查</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• 每3-6个月复查一次</li>
              <li>• 每年进行全面体检</li>
              <li>• 定期监测并发症</li>
              <li>• 调整治疗方案</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Alert */}
      <section className="bg-red-50 border-l-4 border-red-400 p-6 rounded">
        <div className="flex">
          <div className="flex-shrink-0">
            <Activity className="h-5 w-5 text-red-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800 mb-2">
              重要提示
            </h3>
            <div className="text-sm text-red-700 space-y-1">
              <p>• 本页面数据为演示数据，实际请根据真实健康数据调整</p>
              <p>• 慢性病管理需遵医嘱，不可自行停药或调药</p>
              <p>• 如有不适请及时就医</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
