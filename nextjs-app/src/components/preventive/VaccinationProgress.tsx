'use client';

import { Shield, CheckCircle, Clock, AlertCircle, TrendingUp } from 'lucide-react';
import { VaccinationItem } from './VaccinationCard';

interface VaccinationProgressProps {
  vaccinations: VaccinationItem[];
}

export function VaccinationProgress({ vaccinations }: VaccinationProgressProps) {

  // Calculate overall statistics
  const getStatistics = () => {
    const totalVaccinations = vaccinations.length;
    const completedVaccinations = vaccinations.filter(v => v.status === 'completed').length;
    const inProgressVaccinations = vaccinations.filter(v =>
      v.total_doses && v.doses_taken && v.doses_taken > 0 && v.doses_taken < v.total_doses
    ).length;

    // Calculate total doses
    let totalDoses = 0;
    let takenDoses = 0;

    vaccinations.forEach(v => {
      if (v.total_doses) {
        totalDoses += v.total_doses;
        takenDoses += v.doses_taken || 0;
      } else {
        totalDoses += 1;
        takenDoses += v.status === 'completed' ? 1 : 0;
      }
    });

    const overallProgress = totalDoses > 0 ? (takenDoses / totalDoses) * 100 : 0;

    return {
      totalVaccinations,
      completedVaccinations,
      inProgressVaccinations,
      totalDoses,
      takenDoses,
      overallProgress: Math.round(overallProgress),
    };
  };

  const stats = getStatistics();

  // Get vaccination categories
  const getCategories = () => {
    const categories = new Map<string, { total: number; completed: number; inProgress: number }>();

    vaccinations.forEach(v => {
      const category = v.vaccine_type || '其他';

      if (!categories.has(category)) {
        categories.set(category, { total: 0, completed: 0, inProgress: 0 });
      }

      const cat = categories.get(category)!;
      cat.total++;

      if (v.status === 'completed') {
        cat.completed++;
      } else if (v.total_doses && v.doses_taken && v.doses_taken > 0) {
        cat.inProgress++;
      }
    });

    return Array.from(categories.entries()).map(([name, data]) => ({
      name,
      ...data,
      progress: data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0,
    }));
  };

  const categories = getCategories();

  // Get recent activity
  const getRecentActivity = () => {
    const activities: Array<{
      date: string;
      vaccine: string;
      type: string;
      dose?: string;
    }> = [];

    vaccinations.forEach(v => {
      if (v.date) {
        activities.push({
          date: v.date,
          vaccine: v.vaccine_name,
          type: 'completed',
          dose: v.total_doses && v.total_doses > 1 ? `第 ${v.doses_taken || 1}/${v.total_doses} 剂` : undefined,
        });
      }

      if (v.dose_history) {
        v.dose_history.forEach((dose, index) => {
          activities.push({
            date: dose.date,
            vaccine: v.vaccine_name,
            type: 'dose',
            dose: `第 ${index + 1} 剂`,
          });
        });
      }
    });

    return activities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);
  };

  const recentActivity = getRecentActivity();

  return (
    <div className="space-y-6">
      {/* Overall Progress Card */}
      <div className="bg-gradient-to-br from-teal-50 to-teal-100/30 p-6 rounded-2xl border border-teal-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-teal-200 rounded-full flex items-center justify-center">
              <Shield className="w-6 h-6 text-teal-700" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">疫苗接种总进度</h3>
              <p className="text-sm text-gray-600">
                已完成 {stats.completedVaccinations}/{stats.totalVaccinations} 种疫苗
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-teal-700">{stats.overallProgress}%</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="w-full bg-white rounded-full h-4 overflow-hidden border border-teal-200">
            <div
              className="h-full bg-gradient-to-r from-teal-400 to-teal-600 rounded-full transition-all"
              style={{ width: `${stats.overallProgress}%` }}
            />
          </div>
        </div>

        {/* Doses Statistics */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-xs text-gray-600 mb-1">总剂数</p>
            <p className="text-xl font-bold text-gray-900">{stats.totalDoses}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">已接种</p>
            <p className="text-xl font-bold text-teal-700">{stats.takenDoses}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">待接种</p>
            <p className="text-xl font-bold text-orange-600">{stats.totalDoses - stats.takenDoses}</p>
          </div>
        </div>
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-green-50 p-4 rounded-xl border border-green-200">
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.completedVaccinations}</p>
              <p className="text-xs text-gray-600">已完成疫苗接种</p>
            </div>
          </div>
        </div>

        <div className="bg-orange-50 p-4 rounded-xl border border-orange-200">
          <div className="flex items-center space-x-3">
            <Clock className="w-8 h-8 text-orange-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.inProgressVaccinations}</p>
              <p className="text-xs text-gray-600">接种中（多剂次）</p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
          <div className="flex items-center space-x-3">
            <TrendingUp className="w-8 h-8 text-blue-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
              <p className="text-xs text-gray-600">疫苗类别</p>
            </div>
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-macos-bg-card p-6 rounded-2xl border border-macos-border">
        <h3 className="text-lg font-semibold text-macos-text-primary mb-4">
          分类进度
        </h3>
        <div className="space-y-4">
          {categories.map(category => {
            const remaining = category.total - category.completed;

            return (
              <div key={category.name} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-macos-text-primary">{category.name}</span>
                  <span className="text-macos-text-muted">
                    {category.completed}/{category.total} 已完成
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      category.progress === 100
                        ? 'bg-green-500'
                        : category.progress >= 50
                        ? 'bg-blue-500'
                        : 'bg-orange-500'
                    }`}
                    style={{ width: `${category.progress}%` }}
                  />
                </div>
                {category.inProgress > 0 && (
                  <p className="text-xs text-macos-text-muted">
                    {category.inProgress} 种正在进行中
                  </p>
                )}
                {remaining > 0 && category.inProgress === 0 && (
                  <p className="text-xs text-macos-text-muted">
                    {remaining} 种待接种
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      {recentActivity.length > 0 && (
        <div className="bg-macos-bg-card p-6 rounded-2xl border border-macos-border">
          <h3 className="text-lg font-semibold text-macos-text-primary mb-4">
            最近接种记录
          </h3>
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div
                key={index}
                className="flex items-start space-x-3 p-3 bg-macos-bg-secondary rounded-lg"
              >
                <div className="flex-shrink-0 w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                  <Shield className="w-5 h-5 text-teal-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-macos-text-primary">
                        {activity.vaccine}
                      </h4>
                      <p className="text-xs text-macos-text-muted mt-0.5">
                        {activity.date}
                      </p>
                    </div>
                    {activity.dose && (
                      <span className="px-2 py-1 bg-teal-100 text-teal-700 rounded text-xs">
                        {activity.dose}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      <div className="bg-blue-50 p-6 rounded-2xl border border-blue-200">
        <h3 className="text-md font-semibold text-gray-900 mb-3">
          接种建议
        </h3>
        <ul className="space-y-2 text-sm">
          {stats.totalDoses - stats.takenDoses > 0 && (
            <li className="flex items-start space-x-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
              <span className="text-gray-700">
                还有 {stats.totalDoses - stats.takenDoses} 剂疫苗待接种，请按时完成接种程序
              </span>
            </li>
          )}
          {stats.inProgressVaccinations > 0 && (
            <li className="flex items-start space-x-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
              <span className="text-gray-700">
                有 {stats.inProgressVaccinations} 种多剂次疫苗正在进行中，请关注接种时间表
              </span>
            </li>
          )}
          <li className="flex items-start space-x-2">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
            <span className="text-gray-700">
              建议保存好疫苗接种记录，以便后续查询和出国使用
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
