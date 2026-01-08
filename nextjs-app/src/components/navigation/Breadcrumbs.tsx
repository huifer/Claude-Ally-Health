'use client';

import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { ReactNode } from 'react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: ReactNode;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  homeHref?: string;
  showHomeIcon?: boolean;
  className?: string;
}

export function Breadcrumbs({
  items,
  homeHref = '/',
  showHomeIcon = true,
  className = '',
}: BreadcrumbsProps) {
  if (!items || items.length === 0) {
    return null;
  }

  // Add home as first item if showHomeIcon is true
  const homeItem: BreadcrumbItem = {
    label: '首页',
    href: homeHref,
    icon: <Home className="w-4 h-4" />
  };

  const allItems = showHomeIcon
    ? [homeItem, ...items]
    : items;

  return (
    <nav aria-label="面包屑导航" className={`flex items-center gap-1 text-sm ${className}`}>
      {allItems.map((item, index) => {
        const isLast = index === allItems.length - 1;

        return (
          <div key={index} className="flex items-center gap-1">
            {/* Add chevron separator between items */}
            {index > 0 && (
              <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
            )}

            {/* Breadcrumb item */}
            {isLast ? (
              // Current page - no link
              <span className="flex items-center gap-1 text-[#FF6B6B] font-medium">
                {item.icon && <span className="w-4 h-4 flex-shrink-0">{item.icon}</span>}
                <span className="truncate max-w-[200px] sm:max-w-xs md:max-w-sm">
                  {item.label}
                </span>
              </span>
            ) : (
              // Parent page - clickable link
              <Link
                href={item.href || '#'}
                className="flex items-center gap-1 text-gray-600 hover:text-[#FF8787] transition-colors duration-150 group"
              >
                {item.icon && (
                  <span className="w-4 h-4 flex-shrink-0 group-hover:scale-110 transition-transform">
                    {item.icon}
                  </span>
                )}
                <span className="truncate max-w-[150px] sm:max-w-xs md:max-w-sm group-hover:underline">
                  {item.label}
                </span>
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
