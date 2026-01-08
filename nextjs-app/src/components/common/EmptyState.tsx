import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      {Icon && (
        <div className="p-4 bg-macos-bg-secondary rounded-full mb-4">
          <Icon className="w-12 h-12 text-macos-text-muted" />
        </div>
      )}
      <h3 className="text-lg font-semibold text-macos-text-primary mb-2">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-macos-text-muted max-w-md mb-6">
          {description}
        </p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className="px-6 py-2 bg-macos-accent-coral text-white rounded-lg hover:bg-macos-accent-coral/90 transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
