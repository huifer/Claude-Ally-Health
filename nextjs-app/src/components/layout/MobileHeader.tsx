'use client';

import { Menu } from 'lucide-react';
import { useSidebar } from '@/hooks/useSidebar';
import { cn } from '@/lib/utils';

interface MobileHeaderProps {
  className?: string;
}

export function MobileHeader({ className }: MobileHeaderProps) {
  const { toggleSidebar } = useSidebar();

  return (
    <header className={cn(
      'fixed top-0 left-0 right-0 z-30',
      'bg-macos-bg-card border-b border-macos-border',
      'lg:hidden',
      className
    )}>
      <div className="flex items-center justify-between px-4 py-3">
        <button
          onClick={toggleSidebar}
          className="p-2 -ml-2 rounded-macos hover:bg-macos-bg-secondary transition-colors"
          aria-label="打开菜单"
        >
          <Menu className="w-5 h-5 text-macos-text-primary" />
        </button>

        <div className="flex-1 text-center">
          <h1 className="text-base font-semibold text-macos-text-primary">
            健康数据看板
          </h1>
        </div>

        <div className="w-8" /> {/* Spacer for balance */}
      </div>
    </header>
  );
}
