'use client';

import Link from 'next/link';
import { LucideIcon } from 'lucide-react';
import { useSidebar } from '@/hooks/useSidebar';

interface SidebarNavItemProps {
  href: string;
  icon: LucideIcon;
  title: string;
  isActive?: boolean;
  isCollapsed?: boolean;
}

export function SidebarNavItem({
  href,
  icon: Icon,
  title,
  isActive = false,
  isCollapsed = false
}: SidebarNavItemProps) {
  const { closeSidebar } = useSidebar();

  return (
    <Link
      href={href}
      onClick={closeSidebar}
      scroll={false}
      className={`
        flex items-center gap-3 px-3 py-2.5
        rounded-macos
        text-sm font-medium
        transition-all duration-150 ease-out
        relative group
        ${isActive
          ? 'bg-macos-accent-coral/12 text-macos-accent-coral'
          : 'text-macos-text-secondary hover:bg-macos-accent-coral/8 hover:text-macos-text-primary'
        }
      `}
      title={isCollapsed ? title : undefined}
    >
      <Icon className={`w-5 h-5 ${isActive ? 'text-macos-accent-coral' : ''} flex-shrink-0`} />
      {!isCollapsed && <span>{title}</span>}

      {/* Tooltip for collapsed state */}
      {isCollapsed && (
        <div className="hidden lg:block absolute left-full ml-2 px-2 py-1
                        bg-macos-bg-card border border-macos-border rounded-macos
                        text-xs text-macos-text-primary whitespace-nowrap
                        opacity-0 group-hover:opacity-100 pointer-events-none
                        transition-opacity z-50 shadow-macos">
          {title}
        </div>
      )}
    </Link>
  );
}
