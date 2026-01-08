'use client';

import { useState } from 'react';
import { Calendar, Syringe, Filter, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { VaccinationItem } from './VaccinationCard';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts/core';

interface VaccinationScheduleProps {
  vaccinations: VaccinationItem[];
}

type ScheduleView = 'timeline' | 'calendar' | 'upcoming';

export function VaccinationSchedule({ vaccinations }: VaccinationScheduleProps) {
  const [view, setView] = useState<ScheduleView>('timeline');

  // Get upcoming vaccinations (next dose within 90 days)
  const getUpcomingVaccinations = () => {
    const today = new Date();

    return vaccinations
      .filter(v => {
        if (!v.next_dose_date) return false;
        if (v.total_doses && v.doses_taken && v.doses_taken >= v.total_doses) return false;

        const nextDose = new Date(v.next_dose_date);
        const diffTime = nextDose.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        return diffDays >= 0 && diffDays <= 90;
      })
      .sort((a, b) => {
        if (!a.next_dose_date) return 1;
        if (!b.next_dose_date) return -1;
        return new Date(a.next_dose_date).getTime() - new Date(b.next_dose_date).getTime();
      });
  };

  // Get overdue vaccinations
  const getOverdueVaccinations = () => {
    const today = new Date();

    return vaccinations.filter(v => {
      if (!v.next_dose_date) return false;
      if (v.total_doses && v.doses_taken && v.doses_taken >= v.total_doses) return false;

      const nextDose = new Date(v.next_dose_date);
      return nextDose < today;
    });
  };

  // Prepare calendar data (vaccinations by month)
  const getMonthlyData = () => {
    const monthMap = new Map<string, number>();

    vaccinations.forEach(v => {
      if (v.date) {
        const month = v.date.substring(0, 7); // YYYY-MM
        monthMap.set(month, (monthMap.get(month) || 0) + 1);
      }

      if (v.dose_history) {
        v.dose_history.forEach(dose => {
          const month = dose.date.substring(0, 7);
          monthMap.set(month, (monthMap.get(month) || 0) + 1);
        });
      }
    });

    return Array.from(monthMap.entries())
      .map(([month, count]) => ({ month, count }))
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-12); // Last 12 months
  };

  const monthlyData = getMonthlyData();
  const upcomingVaccinations = getUpcomingVaccinations();
  const overdueVaccinations = getOverdueVaccinations();

  // Chart configuration
  const getChartOption = () => ({
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => {
        const data = params[0];
        return `${data.name}<br/>接种数: ${data.value}`;
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '10%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: monthlyData.map(d => d.month),
      axisLabel: {
        fontSize: 11,
        rotate: monthlyData.length > 6 ? 45 : 0,
      },
    },
    yAxis: {
      type: 'value',
      name: '接种次数',
    },
    series: [
      {
        type: 'bar',
        data: monthlyData.map(d => d.count),
        itemStyle: {
          color: new (echarts as any).graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#4ECDC4' },
            { offset: 1, color: '#44A08D' },
          ]),
          borderRadius: [8, 8, 0, 0],
        },
      },
    ],
  });

  // Statistics
  const completedVaccinations = vaccinations.filter(v => v.status === 'completed').length;
  const inProgressVaccinations = vaccinations.filter(v =>
    v.total_doses && v.doses_taken && v.doses_taken > 0 && v.doses_taken < v.total_doses
  ).length;

  return (
    <div className="space-y-6">
      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100/30 p-4 rounded-xl border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600 mb-1">疫苗总数</p>
              <p className="text-2xl font-bold text-gray-900">{vaccinations.length}</p>
            </div>
            <Syringe className="w-10 h-10 text-blue-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100/30 p-4 rounded-xl border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600 mb-1">已完成</p>
              <p className="text-2xl font-bold text-gray-900">{completedVaccinations}</p>
            </div>
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100/30 p-4 rounded-xl border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600 mb-1">进行中</p>
              <p className="text-2xl font-bold text-gray-900">{inProgressVaccinations}</p>
            </div>
            <Clock className="w-10 h-10 text-orange-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100/30 p-4 rounded-xl border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600 mb-1">逾期未种</p>
              <p className="text-2xl font-bold text-gray-900">{overdueVaccinations.length}</p>
            </div>
            <AlertCircle className="w-10 h-10 text-red-600" />
          </div>
        </div>
      </div>

      {/* View Toggle */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-macos-text-primary">
          疫苗接种时间表
        </h3>
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-macos-text-muted" />
          <div className="flex bg-macos-bg-secondary rounded-lg p-1">
            <button
              onClick={() => setView('timeline')}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                view === 'timeline'
                  ? 'bg-macos-bg-card text-macos-text-primary shadow-sm'
                  : 'text-macos-text-muted hover:text-macos-text-primary'
              }`}
            >
              时间线
            </button>
            <button
              onClick={() => setView('calendar')}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                view === 'calendar'
                  ? 'bg-macos-bg-card text-macos-text-primary shadow-sm'
                  : 'text-macos-text-muted hover:text-macos-text-primary'
              }`}
            >
              月度统计
            </button>
            <button
              onClick={() => setView('upcoming')}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                view === 'upcoming'
                  ? 'bg-macos-bg-card text-macos-text-primary shadow-sm'
                  : 'text-macos-text-muted hover:text-macos-text-primary'
              }`}
            >
              即将到期
            </button>
          </div>
        </div>
      </div>

      {/* Timeline View */}
      {view === 'timeline' && (
        <div className="space-y-4">
          {vaccinations
            .filter(v => v.date || v.dose_history)
            .sort((a, b) => {
              const dateA = new Date(a.date || a.dose_history?.[0]?.date || '9999-12-31');
              const dateB = new Date(b.date || b.dose_history?.[0]?.date || '9999-12-31');
              return dateB.getTime() - dateA.getTime();
            })
            .slice(0, 10)
            .map((vaccination, index) => (
              <div
                key={index}
                className="bg-macos-bg-card p-4 rounded-lg border border-macos-border"
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Syringe className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-macos-text-primary mb-1">
                      {vaccination.vaccine_name}
                    </h4>
                    <div className="flex items-center space-x-3 text-xs text-macos-text-muted">
                      <span>{vaccination.date}</span>
                      {vaccination.facility && <span>• {vaccination.facility}</span>}
                      {vaccination.total_doses && vaccination.total_doses > 1 && (
                        <span>• 第 {vaccination.doses_taken || 1}/{vaccination.total_doses} 剂</span>
                      )}
                    </div>
                  </div>
                  {vaccination.status === 'completed' && (
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  )}
                </div>
              </div>
            ))}

          {vaccinations.filter(v => v.date || v.dose_history).length === 0 && (
            <div className="text-center py-12">
              <Syringe className="w-16 h-16 text-macos-text-muted mx-auto mb-4" />
              <p className="text-macos-text-muted">暂无接种记录</p>
            </div>
          )}
        </div>
      )}

      {/* Calendar View */}
      {view === 'calendar' && (
        <div className="bg-macos-bg-card p-6 rounded-2xl border border-macos-border">
          <ReactECharts
            option={getChartOption()}
            style={{ height: '350px' }}
            opts={{ renderer: 'svg' }}
          />
        </div>
      )}

      {/* Upcoming View */}
      {view === 'upcoming' && (
        <div className="space-y-3">
          {upcomingVaccinations.length === 0 && overdueVaccinations.length === 0 ? (
            <div className="bg-macos-bg-card p-12 rounded-2xl border border-macos-border text-center">
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <p className="text-macos-text-primary font-semibold mb-2">太棒了！</p>
              <p className="text-sm text-macos-text-muted">
                未来90天内没有需要接种的疫苗
              </p>
            </div>
          ) : (
            <>
              {/* Overdue */}
              {overdueVaccinations.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-red-600 mb-3">
                    已逾期 ({overdueVaccinations.length})
                  </h4>
                  <div className="space-y-2">
                    {overdueVaccinations.map((vaccination, index) => (
                      <div
                        key={index}
                        className="bg-red-50 p-4 rounded-lg border border-red-200"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h5 className="text-sm font-semibold text-gray-900 mb-1">
                              {vaccination.vaccine_name}
                            </h5>
                            <div className="flex items-center space-x-2 text-xs text-gray-600">
                              <Calendar className="w-3 h-3" />
                              <span>应种时间: {vaccination.next_dose_date}</span>
                            </div>
                            {vaccination.total_doses && vaccination.total_doses > 1 && (
                              <span className="text-xs text-gray-600 ml-6">
                                第 {vaccination.doses_taken || 0}/{vaccination.total_doses} 剂
                              </span>
                            )}
                          </div>
                          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 ml-3" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Upcoming */}
              {upcomingVaccinations.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-orange-600 mb-3">
                    即将到期 ({upcomingVaccinations.length})
                  </h4>
                  <div className="space-y-2">
                    {upcomingVaccinations.map((vaccination, index) => {
                      const today = new Date();
                      const nextDose = vaccination.next_dose_date
                        ? new Date(vaccination.next_dose_date)
                        : null;
                      const daysLeft = nextDose
                        ? Math.ceil((nextDose.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
                        : 0;

                      return (
                        <div
                          key={index}
                          className="bg-orange-50 p-4 rounded-lg border border-orange-200"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h5 className="text-sm font-semibold text-gray-900 mb-1">
                                {vaccination.vaccine_name}
                              </h5>
                              <div className="flex items-center space-x-2 text-xs text-gray-600">
                                <Calendar className="w-3 h-3" />
                                <span>{vaccination.next_dose_date}</span>
                                <span className="px-2 py-0.5 bg-orange-200 text-orange-800 rounded text-xs">
                                  {daysLeft} 天后
                                </span>
                              </div>
                              {vaccination.total_doses && vaccination.total_doses > 1 && (
                                <span className="text-xs text-gray-600 ml-6">
                                  第 {(vaccination.doses_taken || 0) + 1}/{vaccination.total_doses} 剂
                                </span>
                              )}
                            </div>
                            <Clock className="w-5 h-5 text-orange-600 flex-shrink-0 ml-3" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
