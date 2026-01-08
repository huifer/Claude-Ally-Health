'use client';

import { useSidebar } from '@/hooks/useSidebar';
import { Sidebar } from './Sidebar';
import { MobileHeader } from './MobileHeader';

interface MacOSLayoutProps {
  children: React.ReactNode;
}

export function MacOSLayout({ children }: MacOSLayoutProps) {
  const { isSidebarOpen, closeSidebar, isSidebarCollapsed } = useSidebar();

  return (
    <div className="flex min-h-screen bg-macos-bg-primary">
      {/* Mobile Header */}
      <MobileHeader className="lg:hidden" />

      {/* Sidebar */}
      <aside className={`
        fixed lg:sticky lg:top-0 inset-y-0 left-0 z-50
        ${isSidebarCollapsed ? 'w-sidebar-collapsed' : 'w-sidebar'} bg-macos-bg-sidebar
        border-r border-macos-border
        transform transition-all duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        lg:self-start lg:h-screen lg:overflow-y-auto
      `}>
        <Sidebar />
      </aside>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-0 min-h-screen">
        <div className="container mx-auto px-4 lg:px-6 py-6 lg:py-8 max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  );
}
