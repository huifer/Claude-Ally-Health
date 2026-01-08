'use client';

import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';
import { BackButton } from './BackButton';
import { Breadcrumbs, BreadcrumbItem } from './Breadcrumbs';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  iconColor?: string;
  breadcrumbs?: BreadcrumbItem[];
  backHref?: string;
  showBackButton?: boolean;
  actions?: ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  subtitle,
  icon: Icon,
  iconColor = '#FF6B6B',
  breadcrumbs,
  backHref,
  showBackButton = true,
  actions,
  className = '',
}: PageHeaderProps) {
  return (
    <header className={`mb-8 ${className}`}>
      {/* Navigation row: Back button + Breadcrumbs */}
      {(showBackButton || (breadcrumbs && breadcrumbs.length > 0)) && (
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            {/* Back button */}
            {showBackButton && <BackButton href={backHref} />}

            {/* Breadcrumbs */}
            {breadcrumbs && breadcrumbs.length > 0 && (
              <Breadcrumbs items={breadcrumbs} className="text-sm" />
            )}
          </div>

          {/* Action buttons */}
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}

      {/* Title row: Icon + Title + Subtitle */}
      <div className="flex items-start gap-3">
        {/* Icon */}
        {Icon && (
          <div
            className="p-2 rounded-lg flex-shrink-0"
            style={{ backgroundColor: `${iconColor}20` }}
          >
            <Icon className="w-6 h-6" style={{ color: iconColor }} />
          </div>
        )}

        {/* Title and subtitle */}
        <div className="flex-1 min-w-0">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">{title}</h1>
          {subtitle && (
            <p className="text-gray-600 text-sm sm:text-base">{subtitle}</p>
          )}
        </div>
      </div>
    </header>
  );
}
