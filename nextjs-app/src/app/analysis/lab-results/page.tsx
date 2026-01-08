'use client';

import { useState, useEffect } from 'react';
import { TestTubes, TrendingUp, AlertCircle, Calendar, Filter } from 'lucide-react';
import { PageHeader } from '@/components/navigation';
import { LabResultsChart } from '@/components/charts/LabResultsChart';
import { HealthData } from '@/types/health-data';

export default function LabResultsPage() {
  const [healthData, setHealthData] = useState<Partial<HealthData> | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTestType, setSelectedTestType] = useState<string>('all');
  const [selectedAbnormalOnly, setSelectedAbnormalOnly] = useState(false);

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

  // Get all unique test names from abnormal results
  const abnormalTestNames = healthData?.labResults
    ? Array.from(
        new Set(
          healthData.labResults
            .flatMap(lab => lab.items || [])
            .filter(item => item.is_abnormal)
            .map(item => item.name)
        )
      )
    : [];

  // Get all unique test names
  const allTestNames = healthData?.labResults
    ? Array.from(
        new Set(
          healthData.labResults.flatMap(lab => lab.items || []).map(item => item.name)
        )
      )
    : [];

  // Filter lab results based on selection
  const filteredLabResults = healthData?.labResults?.map(lab => ({
    ...lab,
    items: lab.items?.filter(item => {
      if (selectedAbnormalOnly && !item.is_abnormal) return false;
      if (selectedTestType !== 'all' && item.name !== selectedTestType) return false;
      return true;
    })
  })).filter(lab => lab.items && lab.items.length > 0) || [];

  // Calculate statistics
  const totalLabs = healthData?.labResults?.length || 0;
  const totalTests = healthData?.labResults?.reduce((sum, lab) => sum + (lab.summary?.total_items || 0), 0) || 0;
  const totalAbnormal = healthData?.labResults?.reduce((sum, lab) => sum + (lab.summary?.abnormal_count || 0), 0) || 0;

  // Group abnormal results by test name
  const abnormalResultsGrouped = abnormalTestNames.map(testName => {
    const occurrences: any[] = [];
    healthData?.labResults?.forEach(lab => {
      lab.items?.forEach(item => {
        if (item.name === testName && item.is_abnormal) {
          occurrences.push({
            date: lab.date,
            value: item.value,
            unit: item.unit,
            abnormal_marker: item.abnormal_marker,
            min_ref: item.min_ref,
            max_ref: item.max_ref
          });
        }
      });
    });
    return { testName, occurrences };
  }).filter(group => group.occurrences.length > 0);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
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
          <div className="p-2 bg-purple-100 rounded-lg">
            <TestTubes className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">化验结果深度分析</h1>
            <p className="text-gray-600">
              检验指标趋势追踪与异常值分析
            </p>
          </div>
        </div>
      </header>

      {/* Overview Cards */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3 mb-2">
            <TestTubes className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">化验次数</p>
              <p className="text-2xl font-bold text-gray-900">{totalLabs}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-sm text-gray-600">检查项目</p>
              <p className="text-2xl font-bold text-gray-900">{totalTests}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3 mb-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <div>
              <p className="text-sm text-gray-600">异常项</p>
              <p className="text-2xl font-bold text-red-600">{totalAbnormal}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="w-5 h-5 text-purple-600" />
            <div>
              <p className="text-sm text-gray-600">最近检查</p>
              <p className="text-lg font-bold text-gray-900">
                {healthData?.labResults && healthData.labResults.length > 0
                  ? healthData.labResults[0].date
                  : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="mb-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-600" />
          筛选条件
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              检查项目
            </label>
            <select
              value={selectedTestType}
              onChange={(e) => setSelectedTestType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">全部项目</option>
              {allTestNames.map(name => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedAbnormalOnly}
                onChange={(e) => setSelectedAbnormalOnly(e.target.checked)}
                className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
              />
              <span className="text-sm font-medium text-gray-700">仅显示异常值</span>
            </label>
          </div>
        </div>
      </section>

      {/* Abnormal Results Summary */}
      {abnormalResultsGrouped.length > 0 && (
        <section className="mb-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            异常结果汇总
          </h2>
          <div className="space-y-4">
            {abnormalResultsGrouped.slice(0, 5).map((group, index) => (
              <div key={index} className="border-l-4 border-red-500 bg-red-50 p-4 rounded">
                <h3 className="font-semibold text-gray-900 mb-2">{group.testName}</h3>
                <div className="space-y-2">
                  {group.occurrences.slice(0, 3).map((occ, idx) => (
                    <div key={idx} className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">{occ.date}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-red-600">
                          {occ.value} {occ.unit}
                        </span>
                        <span className="text-red-600">{occ.abnormal_marker}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Lab Results Trend Chart */}
      {allTestNames.length > 0 && (
        <section className="mb-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-600" />
            化验结果趋势
          </h2>
          <LabResultsChart
            labResults={filteredLabResults}
            testNames={selectedTestType !== 'all' ? [selectedTestType] : allTestNames.slice(0, 5)}
          />
        </section>
      )}

      {/* Detailed Lab Results */}
      <section className="mb-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">详细化验记录</h2>

        {filteredLabResults.length > 0 ? (
          <div className="space-y-6">
            {filteredLabResults.map((lab) => (
              <div key={lab.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{lab.type}</h3>
                    <p className="text-sm text-gray-600">
                      {lab.date} | {lab.hospital}
                    </p>
                  </div>
                  {lab.summary && (
                    <div className="text-right">
                      <p className="text-sm text-gray-600">{lab.summary.total_items} 项</p>
                      {lab.summary.abnormal_count > 0 && (
                        <p className="text-sm font-semibold text-red-600">
                          {lab.summary.abnormal_count} 项异常
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {lab.items && lab.items.length > 0 && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2 px-2 font-semibold text-gray-900">项目</th>
                          <th className="text-left py-2 px-2 font-semibold text-gray-900">结果</th>
                          <th className="text-left py-2 px-2 font-semibold text-gray-900">参考范围</th>
                          <th className="text-left py-2 px-2 font-semibold text-gray-900">状态</th>
                        </tr>
                      </thead>
                      <tbody>
                        {lab.items.map((item, index) => (
                          <tr key={index} className={`border-b ${
                            item.is_abnormal ? 'bg-red-50' : 'bg-gray-50'
                          }`}>
                            <td className="py-2 px-2 font-medium">{item.name}</td>
                            <td className={`py-2 px-2 font-semibold ${
                              item.is_abnormal ? 'text-red-600' : 'text-gray-900'
                            }`}>
                              {item.value} {item.unit}
                            </td>
                            <td className="py-2 px-2 text-gray-600">
                              {item.min_ref && item.max_ref ? `${item.min_ref} - ${item.max_ref}` : '-'}
                            </td>
                            <td className="py-2 px-2">
                              {item.is_abnormal ? (
                                <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
                                  {item.abnormal_marker}
                                </span>
                              ) : (
                                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                                  正常
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>没有找到符合条件的化验记录</p>
          </div>
        )}
      </section>

      {/* Reference Ranges Info */}
      <section className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">常见化验参考范围</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">血常规</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">白细胞 (WBC)</span>
                <span className="font-medium">4.0-10.0 ×10⁹/L</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">红细胞 (RBC)</span>
                <span className="font-medium">4.0-5.5 ×10¹²/L</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">血红蛋白 (Hb)</span>
                <span className="font-medium">120-160 g/L</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">血小板 (PLT)</span>
                <span className="font-medium">100-300 ×10⁹/L</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-3">生化检查</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">空腹血糖</span>
                <span className="font-medium">3.9-6.1 mmol/L</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">总胆固醇</span>
                <span className="font-medium">&lt;5.2 mmol/L</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">甘油三酯</span>
                <span className="font-medium">&lt;1.7 mmol/L</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">肌酐</span>
                <span className="font-medium">44-133 μmol/L</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-3">肝功能</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">ALT</span>
                <span className="font-medium">9-50 U/L</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">AST</span>
                <span className="font-medium">15-40 U/L</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">总胆红素</span>
                <span className="font-medium">3.4-20.5 μmol/L</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-3">血脂</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">HDL-C (好胆固醇)</span>
                <span className="font-medium">&gt;1.0 mmol/L</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">LDL-C (坏胆固醇)</span>
                <span className="font-medium">&lt;3.4 mmol/L</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">载脂蛋白A1</span>
                <span className="font-medium">1.0-1.6 g/L</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Alert */}
      <section className="mt-8 bg-purple-50 border-l-4 border-purple-400 p-6 rounded">
        <div className="flex">
          <div className="flex-shrink-0">
            <TestTubes className="h-5 w-5 text-purple-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-purple-800 mb-2">
              化验结果解读说明
            </h3>
            <div className="text-sm text-purple-700 space-y-1">
              <p>• 化验结果应由专业医生结合临床情况综合判断</p>
              <p>• 参考范围可能因实验室、检测方法、年龄性别而有所不同</p>
              <p>• 单次异常结果不一定代表疾病，需动态观察</p>
              <p>• 如有异常，请及时咨询医生并进行进一步检查</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
