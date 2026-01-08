'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  TrendingUp,
  Brain,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  User,
  AlertTriangle,
  Heart,
  Calendar,
  Baby,
  Shield,
  Search,
  Syringe,
  Activity,
  Beaker,
  Bell
} from 'lucide-react';
import { SidebarNavItem } from './SidebarNavItem';
import { SidebarCategory } from './SidebarCategory';
import { useSidebar } from '@/hooks/useSidebar';
import { LucideIcon } from 'lucide-react';

interface NavigationItem {
  title: string;
  href: string;
  icon: LucideIcon;
}

interface NavigationCategory {
  category: string;
  items: NavigationItem[];
}

const navigationCategories: NavigationCategory[] = [
  {
    category: '个人健康',
    items: [
      { title: '概览', href: '/', icon: LayoutDashboard },
      { title: '个人档案', href: '/profile', icon: User },
      { title: '过敏记录', href: '/allergies', icon: AlertTriangle },
    ]
  },
  {
    category: '女性健康',
    items: [
      { title: '女性健康', href: '/womens-health', icon: Heart },
      { title: '经期追踪', href: '/womens-health/cycle', icon: Calendar },
      { title: '孕期管理', href: '/womens-health/pregnancy', icon: Baby },
      { title: '更年期', href: '/womens-health/menopause', icon: TrendingUp },
    ]
  },
  {
    category: '预防保健',
    items: [
      { title: '预防保健', href: '/preventive', icon: Shield },
      { title: '癌症筛查', href: '/preventive/screenings', icon: Search },
      { title: '疫苗接种', href: '/preventive/vaccinations', icon: Syringe },
    ]
  },
  {
    category: '检查记录',
    items: [
      { title: '检查记录', href: '/medical-records', icon: FileText },
      { title: '化验结果', href: '/medical-records/lab-results', icon: Beaker },
      { title: '辐射记录', href: '/medical-records/radiation', icon: Activity },
    ]
  },
  {
    category: '管理',
    items: [
      { title: '健康提醒', href: '/reminders', icon: Bell },
      { title: '健康趋势', href: '/trends', icon: TrendingUp },
      { title: 'AI 分析', href: '/analysis', icon: Brain },
      { title: '报告中心', href: '/reports', icon: FileText },
    ]
  }
];

export function Sidebar() {
  const pathname = usePathname();
  const { isSidebarCollapsed, toggleSidebarCollapse } = useSidebar();

  return (
    <div className="flex flex-col h-full py-6 relative">
      {/* Logo Area */}
      <div className={`px-6 mb-8 ${isSidebarCollapsed ? 'text-center' : ''}`}>
        {!isSidebarCollapsed ? (
          <>
            <h1 className="text-xl font-bold text-macos-text-primary">
              健康数据看板
            </h1>
            <p className="text-xs text-macos-text-muted mt-1">
              Personal Health Dashboard
            </p>
          </>
        ) : (
          <div className="w-8 h-8 bg-macos-accent-coral/20 rounded-lg flex items-center justify-center mx-auto">
            <span className="text-lg font-bold text-macos-accent-coral">H</span>
          </div>
        )}
      </div>

      {/* Collapse Toggle Button - Desktop Only */}
      <button
        onClick={toggleSidebarCollapse}
        className="hidden lg:flex absolute top-6 -right-3 z-50
                   w-6 h-6 bg-macos-bg-card border border-macos-border
                   rounded-full items-center justify-center
                   hover:bg-macos-bg-secondary transition-colors
                   shadow-sm"
        aria-label={isSidebarCollapsed ? '展开侧边栏' : '折叠侧边栏'}
      >
        {isSidebarCollapsed ? (
          <ChevronRight className="w-3 h-3 text-macos-text-muted" />
        ) : (
          <ChevronLeft className="w-3 h-3 text-macos-text-muted" />
        )}
      </button>

      {/* Navigation */}
      <nav className="flex-1 px-3 overflow-y-auto">
        <ul className="space-y-1">
          {navigationCategories.map((navCategory) => (
            <li key={navCategory.category}>
              <SidebarCategory
                category={navCategory.category}
                isCollapsed={isSidebarCollapsed}
              />
              {navCategory.items.map((item) => (
                <SidebarNavItem
                  key={item.href}
                  href={item.href}
                  icon={item.icon}
                  title={item.title}
                  isActive={pathname === item.href}
                  isCollapsed={isSidebarCollapsed}
                />
              ))}
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className={`px-6 mt-auto ${isSidebarCollapsed ? 'text-center' : ''}`}>
        {!isSidebarCollapsed ? (
          <p className="text-xs text-macos-text-muted">v0.1.0</p>
        ) : (
          <p className="text-xs text-macos-text-muted">v0.1</p>
        )}
      </div>
    </div>
  );
}
