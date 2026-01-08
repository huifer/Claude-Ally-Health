'use client';

import { Calendar, Baby, Activity } from 'lucide-react';
import { PregnancyTracker } from '@/types/health-data';

interface PregnancyTimelineProps {
  data: PregnancyTracker;
}

export function PregnancyTimeline({ data }: PregnancyTimelineProps) {
  const { current_pregnancy, statistics } = data;

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      {current_pregnancy && (
        <div className="bg-gradient-to-br from-pink-50 to-purple-50/30 p-6 rounded-2xl border border-pink-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-pink-200 rounded-full flex items-center justify-center">
                <Baby className="w-6 h-6 text-pink-700" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  第 {statistics.current_pregnancy_week || current_pregnancy.current_week} 周
                </h3>
                <p className="text-sm text-gray-600">
                  预产期 {current_pregnancy.due_date}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Checkups */}
      {current_pregnancy?.checkups && current_pregnancy.checkups.length > 0 && (
        <div className="bg-macos-bg-card p-6 rounded-2xl border border-macos-border">
          <h2 className="text-xl font-semibold text-macos-text-primary mb-4">检查记录</h2>
          <div className="space-y-3">
            {current_pregnancy.checkups.map((checkup, index) => (
              <div
                key={index}
                className="flex items-center space-x-4 p-4 bg-macos-bg-secondary rounded-lg"
              >
                <div className="w-10 h-10 bg-macos-accent-coral/20 rounded-full flex items-center justify-center">
                  <Activity className="w-5 h-5 text-macos-accent-coral" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-semibold text-macos-text-primary">
                        第 {checkup.week} 周检查
                      </h4>
                      <p className="text-xs text-macos-text-muted">
                        <Calendar className="w-3 h-3 inline mr-1" />
                        {checkup.date}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!current_pregnancy && (
        <div className="text-center py-12">
          <Baby className="w-16 h-16 text-macos-text-muted mx-auto mb-4" />
          <p className="text-macos-text-muted">暂无孕期记录</p>
        </div>
      )}
    </div>
  );
}
