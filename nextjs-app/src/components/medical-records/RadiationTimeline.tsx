import { Activity, Calendar, Zap } from 'lucide-react';
import { RadiationRecords } from '@/types/health-data';

interface RadiationTimelineProps {
  data: RadiationRecords;
}

export function RadiationTimeline({ data }: RadiationTimelineProps) {
  // Sort by date (newest first)
  const sortedRecords = [...data.records].sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="space-y-4">
      {sortedRecords.map((record) => {
        const isHighDose = record.effective_dose > 1.0; // > 1 mSv considered high

        return (
          <div
            key={record.id}
            className={`flex items-start space-x-4 p-4 rounded-lg transition-colors ${
              isHighDose
                ? 'bg-orange-50 border border-orange-200'
                : 'bg-macos-bg-secondary border border-transparent'
            }`}
          >
            <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
              isHighDose ? 'bg-orange-200' : 'bg-macos-accent-coral/20'
            }`}>
              <Activity className={`w-5 h-5 ${isHighDose ? 'text-orange-600' : 'text-macos-accent-coral'}`} />
            </div>

            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-macos-text-primary">
                    {record.exam_type}
                  </h4>
                  <p className="text-xs text-macos-text-muted mt-1">
                    <Calendar className="w-3 h-3 inline mr-1" />
                    {record.date} • {record.body_part}
                  </p>
                </div>
                <div className="text-right ml-4">
                  <div className={`text-lg font-bold ${
                    isHighDose ? 'text-orange-600' : 'text-macos-text-primary'
                  }`}>
                    {record.effective_dose.toFixed(3)}
                  </div>
                  <p className="text-xs text-macos-text-muted">{record.dose_unit}</p>
                </div>
              </div>

              {isHighDose && (
                <div className="mt-2 flex items-center space-x-2 text-xs text-orange-700">
                  <Zap className="w-3 h-3" />
                  <span>高剂量检查 - 注意累积剂量</span>
                </div>
              )}
            </div>
          </div>
        );
      })}

      {sortedRecords.length === 0 && (
        <div className="text-center py-8">
          <Activity className="w-12 h-12 text-macos-text-muted mx-auto mb-3" />
          <p className="text-sm text-macos-text-muted">暂无辐射检查记录</p>
        </div>
      )}
    </div>
  );
}
