'use client';

import { useState } from 'react';
import { Syringe, Calendar, AlertCircle, CheckCircle, Clock, Shield, Building } from 'lucide-react';

export interface VaccinationItem {
  id: string;
  vaccine_name: string;
  vaccine_type: string;
  date?: string;
  facility?: string;
  status?: 'completed' | 'pending' | 'in-progress';
  total_doses?: number;
  doses_taken?: number;
  next_dose_date?: string;
  batch_number?: string;
  manufacturer?: string;
  notes?: string;
  side_effects?: string[];
  contraindications?: string[];
  dose_history?: Array<{
    date: string;
    facility?: string;
  }>;
}

interface VaccinationCardProps {
  vaccination: VaccinationItem;
  expanded?: boolean;
  onToggle?: () => void;
}

export function VaccinationCard({ vaccination, expanded = false, onToggle }: VaccinationCardProps) {
  const [isExpanded, setIsExpanded] = useState(expanded);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
    onToggle?.();
  };

  // Calculate vaccination progress
  const getProgress = () => {
    if (!vaccination.total_doses || vaccination.total_doses <= 1) return null;

    const completed = vaccination.doses_taken || 0;
    const percentage = (completed / vaccination.total_doses) * 100;

    return {
      completed,
      total: vaccination.total_doses,
      percentage: Math.round(percentage),
      remaining: vaccination.total_doses - completed,
    };
  };

  const progress = getProgress();

  // Get next dose status
  const getNextDoseStatus = () => {
    if (!vaccination.next_dose_date) return null;

    const today = new Date();
    const nextDose = new Date(vaccination.next_dose_date);
    const diffTime = nextDose.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return {
      days: diffDays,
      isDue: diffDays <= 0,
      isUpcoming: diffDays > 0 && diffDays <= 30,
      isFuture: diffDays > 30,
    };
  };

  const nextDoseStatus = getNextDoseStatus();

  // Get status badge
  const getStatusBadge = () => {
    if (progress === null) {
      // Single dose
      if (vaccination.date) {
        return (
          <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
            <CheckCircle className="w-3 h-3 mr-1" />
            已接种
          </span>
        );
      }
      return (
        <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
          <Clock className="w-3 h-3 mr-1" />
          待接种
        </span>
      );
    }

    // Multiple doses
    if (progress.completed === progress.total) {
      return (
        <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
          <CheckCircle className="w-3 h-3 mr-1" />
          全部完成
        </span>
      );
    }

    if (nextDoseStatus?.isDue) {
      return (
        <span className="inline-flex items-center px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium">
          <AlertCircle className="w-3 h-3 mr-1" />
          到期未种
        </span>
      );
    }

    if (nextDoseStatus?.isUpcoming) {
      return (
        <span className="inline-flex items-center px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs font-medium">
          <Clock className="w-3 h-3 mr-1" />
          即将到期
        </span>
      );
    }

    return (
      <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
        <Clock className="w-3 h-3 mr-1" />
        进行中
      </span>
    );
  };

  // Get priority color
  const getPriorityColor = () => {
    if (progress === null) {
      return vaccination.status === 'completed' ? 'border-l-green-500' : 'border-l-blue-500';
    }

    if (progress.completed === progress.total) return 'border-l-green-500';
    if (nextDoseStatus?.isDue) return 'border-l-red-500';
    if (nextDoseStatus?.isUpcoming) return 'border-l-orange-500';
    return 'border-l-blue-500';
  };

  return (
    <div
      className={`bg-macos-bg-card rounded-lg border border-macos-border border-l-4 ${getPriorityColor()} transition-all hover:shadow-md`}
    >
      {/* Header */}
      <div className="p-4 cursor-pointer" onClick={handleToggle}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  vaccination.status === 'completed' || progress?.completed === progress?.total
                    ? 'bg-green-100'
                    : nextDoseStatus?.isDue
                    ? 'bg-red-100'
                    : nextDoseStatus?.isUpcoming
                    ? 'bg-orange-100'
                    : 'bg-blue-100'
                }`}
              >
                <Syringe
                  className={`w-5 h-5 ${
                    vaccination.status === 'completed' || progress?.completed === progress?.total
                      ? 'text-green-600'
                      : nextDoseStatus?.isDue
                      ? 'text-red-600'
                      : nextDoseStatus?.isUpcoming
                      ? 'text-orange-600'
                      : 'text-blue-600'
                  }`}
                />
              </div>
              <div>
                <h4 className="text-base font-semibold text-macos-text-primary">
                  {vaccination.vaccine_name}
                </h4>
                <p className="text-xs text-macos-text-muted">{vaccination.vaccine_type}</p>
              </div>
              {getStatusBadge()}
            </div>

            {/* Basic Info */}
            <div className="flex flex-wrap gap-3 text-sm text-macos-text-muted mt-2">
              {vaccination.date && (
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>接种: {vaccination.date}</span>
                </div>
              )}

              {vaccination.facility && (
                <div className="flex items-center space-x-1">
                  <Building className="w-4 h-4" />
                  <span>{vaccination.facility}</span>
                </div>
              )}

              {progress && (
                <div className="flex items-center space-x-1">
                  <Shield className="w-4 h-4" />
                  <span>
                    进度: {progress.completed}/{progress.total} 剂
                  </span>
                </div>
              )}
            </div>

            {/* Progress Bar for Multiple Doses */}
            {progress && progress.total > 1 && (
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs text-macos-text-muted mb-1">
                  <span>接种进度</span>
                  <span>{progress.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      progress.completed === progress.total
                        ? 'bg-green-500'
                        : nextDoseStatus?.isDue
                        ? 'bg-red-500'
                        : nextDoseStatus?.isUpcoming
                        ? 'bg-orange-500'
                        : 'bg-blue-500'
                    }`}
                    style={{ width: `${progress.percentage}%` }}
                  />
                </div>
              </div>
            )}

            {/* Next Dose Info */}
            {vaccination.next_dose_date && progress && progress.completed < progress.total && (
              <div className="mt-2">
                {nextDoseStatus?.isDue && (
                  <p className="text-xs text-red-600">
                    第 {progress.completed + 1} 剂已到期 {Math.abs(nextDoseStatus.days)} 天
                  </p>
                )}
                {nextDoseStatus?.isUpcoming && nextDoseStatus.days >= 0 && (
                  <p className="text-xs text-orange-600">
                    第 {progress.completed + 1} 剂还有 {nextDoseStatus.days} 天
                  </p>
                )}
                {nextDoseStatus?.isFuture && (
                  <p className="text-xs text-blue-600">
                    第 {progress.completed + 1} 剂: {vaccination.next_dose_date}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Expand Icon */}
          <div
            className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''} ml-4`}
          >
            <svg
              className="w-5 h-5 text-macos-text-muted"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-macos-border pt-4">
          <div className="space-y-3">
            {/* Batch Number */}
            {vaccination.batch_number && (
              <div className="flex items-start space-x-2">
                <span className="text-xs text-macos-text-muted flex-shrink-0">批号:</span>
                <span className="text-xs text-macos-text-secondary">{vaccination.batch_number}</span>
              </div>
            )}

            {/* Manufacturer */}
            {vaccination.manufacturer && (
              <div className="flex items-start space-x-2">
                <span className="text-xs text-macos-text-muted flex-shrink-0">生产厂家:</span>
                <span className="text-xs text-macos-text-secondary">{vaccination.manufacturer}</span>
              </div>
            )}

            {/* Notes */}
            {vaccination.notes && (
              <div>
                <p className="text-xs text-macos-text-muted mb-1">备注:</p>
                <p className="text-sm text-macos-text-secondary">{vaccination.notes}</p>
              </div>
            )}

            {/* Side Effects */}
            {vaccination.side_effects && vaccination.side_effects.length > 0 && (
              <div>
                <p className="text-xs text-macos-text-muted mb-1">不良反应:</p>
                <div className="flex flex-wrap gap-1">
                  {vaccination.side_effects.map((effect, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-orange-50 text-orange-700 rounded text-xs"
                    >
                      {effect}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Contraindications */}
            {vaccination.contraindications && vaccination.contraindications.length > 0 && (
              <div className="p-2 bg-red-50 rounded">
                <p className="text-xs text-red-900 mb-1">禁忌症:</p>
                <div className="flex flex-wrap gap-1">
                  {vaccination.contraindications.map((contraindication, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs"
                    >
                      {contraindication}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Dose History for Multiple Doses */}
            {progress && progress.total > 1 && vaccination.dose_history && vaccination.dose_history.length > 0 && (
              <div>
                <p className="text-xs text-macos-text-muted mb-2">接种历史:</p>
                <div className="space-y-2">
                  {vaccination.dose_history.map((dose, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-macos-bg-secondary rounded text-xs"
                    >
                      <div className="flex items-center space-x-2">
                        <span className="w-6 h-6 flex items-center justify-center bg-macos-accent-coral/20 text-macos-accent-coral rounded-full font-semibold">
                          {index + 1}
                        </span>
                        <span className="text-macos-text-secondary">{dose.date}</span>
                      </div>
                      {dose.facility && (
                        <span className="text-macos-text-muted">{dose.facility}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Schedule Next Dose Button */}
            {vaccination.next_dose_date && progress && progress.completed < progress.total && nextDoseStatus?.isUpcoming && (
              <button className="w-full px-3 py-2 bg-macos-accent-coral/10 text-macos-accent-coral rounded text-sm font-medium hover:bg-macos-accent-coral/20 transition-colors">
                预约下一剂接种
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
