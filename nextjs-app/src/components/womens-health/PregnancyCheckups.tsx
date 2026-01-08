'use client';

import { useState } from 'react';
import { Calendar, Activity, CheckCircle, Clock } from 'lucide-react';
import { PregnancyTracker } from '@/types/health-data';

interface PregnancyCheckupsProps {
  data: PregnancyTracker;
}

export function PregnancyCheckups({ data }: PregnancyCheckupsProps) {
  const checkups = data.current_pregnancy?.checkups || [];

  // Statistics
  const today = new Date();
  const completedCount = checkups.filter(c => new Date(c.date) <= today).length;
  const upcomingCount = checkups.filter(c => new Date(c.date) > today).length;

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-green-50 to-green-100/30 p-4 rounded-xl border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600 mb-1">已完成检查</p>
              <p className="text-2xl font-bold text-gray-900">{completedCount}</p>
            </div>
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100/30 p-4 rounded-xl border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600 mb-1">即将到来</p>
              <p className="text-2xl font-bold text-gray-900">{upcomingCount}</p>
            </div>
            <Clock className="w-10 h-10 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Checkups List */}
      <div className="bg-macos-bg-card p-6 rounded-2xl border border-macos-border">
        <h3 className="text-lg font-semibold text-macos-text-primary mb-4">
          产检记录
        </h3>
        <div className="space-y-3">
          {checkups.map((checkup, index) => {
            const checkupDate = new Date(checkup.date);
            const isCompleted = checkupDate <= today;

            return (
              <div
                key={index}
                className={`p-4 rounded-lg border transition-all ${
                  isCompleted
                    ? 'border-green-200 bg-green-50/30'
                    : 'border-blue-200 bg-blue-50/30'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-macos-accent-coral/20 rounded-full flex items-center justify-center">
                    <Activity className="w-5 h-5 text-macos-accent-coral" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-sm font-semibold text-macos-text-primary">
                          第 {checkup.week} 周产检
                        </h4>
                        <p className="text-xs text-macos-text-muted mt-1">
                          <Calendar className="w-3 h-3 inline mr-1" />
                          {checkup.date}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        isCompleted
                          ? 'bg-green-100 text-green-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {isCompleted ? '已完成' : '即将到来'}
                      </span>
                    </div>
                    {checkup.results && (
                      <div className="mt-2 p-2 bg-white/50 rounded text-xs">
                        <p className="text-macos-text-muted">结果: {JSON.stringify(checkup.results)}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {checkups.length === 0 && (
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 text-macos-text-muted mx-auto mb-3" />
            <p className="text-sm text-macos-text-muted">暂无产检记录</p>
          </div>
        )}
      </div>
    </div>
  );
}
