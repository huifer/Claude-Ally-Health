'use client';

import { useState, useEffect } from 'react';
import { Shield, Calendar, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { PageHeader } from '@/components/navigation';
import { HealthData } from '@/types/health-data';

export default function PreventiveCarePage() {
  const [healthData, setHealthData] = useState<Partial<HealthData> | null>(null);
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

  // Calculate age-based recommendations
  const getAgeBasedRecommendations = () => {
    const birthDate = healthData?.profile?.basic_info?.birth_date;
    if (!birthDate) return [];

    const age = new Date().getFullYear() - new Date(birthDate).getFullYear();
    const recommendations = [];

    if (age >= 18 && age < 40) {
      recommendations.push({
        category: '常规体检',
        items: ['血压检查（每2年）', '胆固醇检查（每4-6年）', '糖尿病筛查（每3年）', '体重指数BMI检查']
      });
    } else if (age >= 40 && age < 65) {
      recommendations.push({
        category: '常规体检',
        items: ['血压检查（每年）', '胆固醇检查（每年）', '糖尿病筛查（每3年）', '视力检查（每2-4年）']
      });
    } else if (age >= 65) {
      recommendations.push({
        category: '常规体检',
        items: ['血压检查（每年）', '胆固醇检查（每年）', '糖尿病筛查（每年）', '骨密度检查', '听力检查', '认知功能评估']
      });
    }

    return recommendations;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mb-4"></div>
            <p className="text-gray-600">加载数据中...</p>
          </div>
        </div>
      </div>
    );
  }

  const recommendations = getAgeBasedRecommendations();
  const vaccinationCount = healthData?.vaccinations?.vaccination_records?.length || 0;
  const screeningCount = (healthData?.screeningTracker?.statistics?.total_cervical_screenings || 0) +
    (healthData?.screeningTracker?.cancer_screening?.breast?.length || 0) +
    (healthData?.screeningTracker?.cancer_screening?.colon?.length || 0);
  const abnormalScreenings = healthData?.screeningTracker?.statistics?.abnormal_results_count || 0;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-green-100 rounded-lg">
            <Shield className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">预防保健管理</h1>
            <p className="text-gray-600">
              疫苗接种、筛查计划与健康风险预防
            </p>
          </div>
        </div>
      </header>

      {/* Overview Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Shield className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">疫苗接种</h3>
              <p className="text-sm text-gray-500">Vaccinations</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">已接种疫苗</span>
              <span className="font-semibold text-gray-900">{vaccinationCount} 种</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">接种记录</span>
              <span className="font-semibold text-gray-900">{vaccinationCount} 次</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Calendar className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">筛查检查</h3>
              <p className="text-sm text-gray-500">Screenings</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">筛查次数</span>
              <span className="font-semibold text-gray-900">{screeningCount} 次</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">异常结果</span>
              <span className={`font-semibold ${abnormalScreenings > 0 ? 'text-red-600' : 'text-green-600'}`}>
                {abnormalScreenings} 次
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-orange-100 rounded-lg">
              <AlertCircle className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">风险评估</h3>
              <p className="text-sm text-gray-500">Risk Assessment</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">慢性病风险</span>
              <span className="font-semibold text-yellow-600">中等</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">建议复查</span>
              <span className="font-semibold text-blue-600">
                {healthData?.screeningTracker?.statistics?.next_screening_due || '未安排'}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Vaccination Records */}
      <section className="mb-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-blue-600" />
          疫苗接种记录
        </h2>

        {healthData?.vaccinations?.vaccination_records && healthData.vaccinations.vaccination_records.length > 0 ? (
          <div className="space-y-4">
            {healthData.vaccinations.vaccination_records.slice(0, 5).map((record) => (
              <div key={record.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-gray-900">{record.vaccine_name}</p>
                    {record.next_due_date && (
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                        下次: {record.next_due_date}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">
                    接种日期: {record.administration_date}
                  </p>
                  {record.dose_number && (
                    <p className="text-sm text-gray-600">
                      剂次: {record.dose_number}
                    </p>
                  )}
                  {record.adverse_reactions && record.adverse_reactions.length > 0 && (
                    <p className="text-sm text-red-600 mt-1">
                      不良反应: {record.adverse_reactions.join(', ')}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>暂无疫苗接种记录</p>
          </div>
        )}
      </section>

      {/* Screening Records */}
      <section className="mb-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-purple-600" />
          筛查检查记录
        </h2>

        {healthData?.screeningTracker?.cancer_screening ? (
          <div className="space-y-6">
            {/* Cervical Screening */}
            {healthData.screeningTracker.cancer_screening.cervical &&
              healthData.screeningTracker.cancer_screening.cervical.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">宫颈癌筛查</h3>
                <div className="space-y-3">
                  {healthData.screeningTracker.cancer_screening.cervical.map((test, index) => (
                    <div key={index} className="border-l-4 border-pink-500 bg-pink-50 p-4 rounded">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-gray-900">宫颈涂片检查</p>
                          <p className="text-sm text-gray-600">检查日期: {test.date}</p>
                          {test.hpv_result && (
                            <p className="text-sm text-gray-600">HPV 结果: {test.hpv_result}</p>
                          )}
                        </div>
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                          test.result === 'normal' || test.result === 'negative'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {test.result === 'normal' || test.result === 'negative' ? '正常' : '异常'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Breast Screening */}
            {healthData.screeningTracker.cancer_screening.breast &&
              healthData.screeningTracker.cancer_screening.breast.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">乳腺癌筛查</h3>
                <div className="space-y-3">
                  {healthData.screeningTracker.cancer_screening.breast.map((test, index) => (
                    <div key={index} className="border-l-4 border-purple-500 bg-purple-50 p-4 rounded">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-gray-900">乳腺检查</p>
                          <p className="text-sm text-gray-600">检查日期: {test.date}</p>
                          <p className="text-sm text-gray-600">检查方法: {test.methodology}</p>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                          test.result === 'normal' || test.result === 'negative'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {test.result === 'normal' || test.result === 'negative' ? '正常' : '异常'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Colon Screening */}
            {healthData.screeningTracker.cancer_screening.colon &&
              healthData.screeningTracker.cancer_screening.colon.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">结肠癌筛查</h3>
                <div className="space-y-3">
                  {healthData.screeningTracker.cancer_screening.colon.map((test, index) => (
                    <div key={index} className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-gray-900">结肠检查</p>
                          <p className="text-sm text-gray-600">检查日期: {test.date}</p>
                          <p className="text-sm text-gray-600">检查方法: {test.methodology}</p>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                          test.result === 'normal' || test.result === 'negative'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {test.result === 'normal' || test.result === 'negative' ? '正常' : '异常'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>暂无筛查检查记录</p>
          </div>
        )}
      </section>

      {/* Age-Based Recommendations */}
      <section className="mb-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-orange-600" />
          年龄相关预防建议
        </h2>

        {recommendations.length > 0 ? (
          <div className="space-y-6">
            {recommendations.map((rec, index) => (
              <div key={index} className="border-l-4 border-orange-500 bg-orange-50 p-4 rounded">
                <h3 className="font-semibold text-gray-900 mb-3">{rec.category}</h3>
                <ul className="space-y-2">
                  {rec.items.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>无法根据当前档案信息生成建议</p>
          </div>
        )}
      </section>

      {/* Preventive Care Schedule */}
      <section className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">预防保健时间表</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">每年检查</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• 身体检查和健康评估</li>
              <li>• 血压测量</li>
              <li>• 体重和BMI检查</li>
              <li>• 皮肤检查</li>
              <li>• 口腔检查</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">定期筛查</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• 胆固醇检查（每4-6年）</li>
              <li>• 糖尿病筛查（每3年）</li>
              <li>• 结肠镜检查（45岁起每10年）</li>
              <li>• 宫颈涂片（每3年）</li>
              <li>• 乳腺X光（45岁起每年）</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">疫苗接种</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• 流感疫苗（每年）</li>
              <li>• 破伤风加强针（每10年）</li>
              <li>• 肺炎疫苗（65岁起）</li>
              <li>• 带状疱疹疫苗（50岁起）</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">健康生活方式</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• 均衡饮食，控制热量</li>
              <li>• 规律运动（每周150分钟）</li>
              <li>• 充足睡眠（7-9小时）</li>
              <li>• 戒烟限酒</li>
              <li>• 压力管理</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Alert */}
      <section className="mt-8 bg-green-50 border-l-4 border-green-400 p-6 rounded">
        <div className="flex">
          <div className="flex-shrink-0">
            <Shield className="h-5 w-5 text-green-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-green-800 mb-2">
              预防保健重要性
            </h3>
            <div className="text-sm text-green-700 space-y-1">
              <p>• 预防保健能早期发现潜在健康问题</p>
              <p>• 定期筛查是预防疾病的关键措施</p>
              <p>• 疫苗接种可预防多种传染病</p>
              <p>• 健康生活方式是最好的预防措施</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
