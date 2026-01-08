import { AlertCircle, Calendar } from 'lucide-react';
import { SeverityBadge } from './SeverityBadge';

interface AllergyCardProps {
  allergen: string;
  category: string;
  severity: number;
  reactionType: string;
  symptoms: string[];
  onsetDate?: string;
  lastOccurrence?: string;
}

export function AllergyCard({
  allergen,
  category,
  severity,
  reactionType,
  symptoms,
  onsetDate,
  lastOccurrence
}: AllergyCardProps) {
  return (
    <div className="bg-macos-bg-card p-6 rounded-2xl border border-macos-border hover:shadow-md transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-lg font-semibold text-macos-text-primary">{allergen}</h3>
            <SeverityBadge severity={severity} reactionType={reactionType} />
          </div>
          <p className="text-sm text-macos-text-muted">{category}</p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-start space-x-2">
          <AlertCircle className="w-4 h-4 text-macos-accent-coral mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs text-macos-text-muted mb-1">反应类型</p>
            <p className="text-sm text-macos-text-primary">{reactionType}</p>
          </div>
        </div>

        {symptoms.length > 0 && (
          <div>
            <p className="text-xs text-macos-text-muted mb-2">症状</p>
            <div className="flex flex-wrap gap-2">
              {symptoms.map((symptom, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-macos-bg-secondary text-xs text-macos-text-secondary rounded"
                >
                  {symptom}
                </span>
              ))}
            </div>
          </div>
        )}

        {onsetDate && (
          <div className="flex items-center space-x-2 text-xs text-macos-text-muted">
            <Calendar className="w-3 h-3" />
            <span>首次发现: {onsetDate}</span>
          </div>
        )}

        {lastOccurrence && (
          <div className="flex items-center space-x-2 text-xs text-macos-text-muted">
            <Calendar className="w-3 h-3" />
            <span>最近发生: {lastOccurrence}</span>
          </div>
        )}
      </div>
    </div>
  );
}
