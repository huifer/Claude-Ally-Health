'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  User,
  Activity,
  Heart,
  Shield,
  Pill,
  BarChart3,
  Settings,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface MenuItem {
  title: string;
  icon: any;
  path: string;
  subItems?: { title: string; path: string }[];
}

const menuItems: MenuItem[] = [
  {
    title: '健康概览',
    icon: LayoutDashboard,
    path: '/',
    subItems: [
      { title: '健康仪表盘', path: '/' },
      { title: '健康趋势', path: '/dashboard/trends' },
      { title: '年度报告', path: '/dashboard/annual' },
    ],
  },
  {
    title: '个人档案',
    icon: User,
    path: '/profile',
    subItems: [
      { title: '基本信息', path: '/profile' },
      { title: '体量管理', path: '/profile/weight' },
      { title: '过敏史', path: '/profile/allergies' },
      { title: '用药记录', path: '/profile/medications' },
    ],
  },
  {
    title: '检查检验',
    icon: Activity,
    path: '/lab-tests',
    subItems: [
      { title: '生化检查', path: '/lab-tests/blood' },
      { title: '影像检查', path: '/lab-tests/imaging' },
      { title: '检查历史', path: '/lab-tests/history' },
      { title: '检查对比', path: '/lab-tests/compare' },
    ],
  },
  {
    title: '女性健康',
    icon: Heart,
    path: '/womens-health',
    subItems: [
      { title: '月经周期', path: '/womens-health/cycle' },
      { title: '孕期管理', path: '/womens-health/pregnancy' },
      { title: '更年期', path: '/womens-health/menopause' },
      { title: '周期日历', path: '/womens-health/calendar' },
    ],
  },
  {
    title: '预防保健',
    icon: Shield,
    path: '/preventive-care',
    subItems: [
      { title: '癌症筛查', path: '/preventive-care/screening' },
      { title: '疫苗接种', path: '/preventive-care/vaccines' },
      { title: '筛查计划', path: '/preventive-care/plan' },
      { title: '辐射安全', path: '/preventive-care/radiation' },
    ],
  },
  {
    title: '药物管理',
    icon: Pill,
    path: '/medication',
    subItems: [
      { title: '用药计划', path: '/medication/plan' },
      { title: '相互作用检查', path: '/medication/interactions' },
      { title: '用药提醒', path: '/medication/reminders' },
      { title: '用药历史', path: '/medication/history' },
    ],
  },
  {
    title: '数据分析',
    icon: BarChart3,
    path: '/analytics',
    subItems: [
      { title: '健康趋势', path: '/analytics/health-trends' },
      { title: '检查趋势', path: '/analytics/lab-trends' },
      { title: '统计报告', path: '/analytics/statistics' },
      { title: '数据导出', path: '/analytics/export' },
    ],
  },
  {
    title: '系统设置',
    icon: Settings,
    path: '/settings',
    subItems: [
      { title: '提醒设置', path: '/settings/reminders' },
      { title: '数据备份', path: '/settings/backup' },
      { title: '隐私设置', path: '/settings/privacy' },
      { title: '帮助中心', path: '/settings/help' },
    ],
  },
];

function SidebarMenuItem({ item, pathname }: { item: MenuItem; pathname: string }) {
  const Icon = item.icon;

  // 检查是否在父菜单的精确路径上
  const isParentActive = pathname === item.path || (item.path === '/' && pathname === '/');

  // 检查是否有子菜单项处于激活状态
  const hasActiveChild = item.subItems?.some(subItem => pathname.startsWith(subItem.path));

  // 确定菜单部分是否应该展开
  const shouldExpand = isParentActive || hasActiveChild;

  const [isExpanded, setIsExpanded] = useState(shouldExpand);

  // 在 pathname 变化时更新展开状态
  useEffect(() => {
    setIsExpanded(shouldExpand);
  }, [pathname, shouldExpand]);

  return (
    <div>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          'w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer',
          isParentActive
            ? 'bg-primary-600 text-white hover:bg-primary-700'
            : hasActiveChild
            ? 'bg-primary-100 text-primary-700 hover:bg-primary-200'
            : 'text-gray-700 hover:bg-primary-50 hover:text-primary-600'
        )}
      >
        <span className="flex items-center">
          <Icon className="w-5 h-5 mr-3" />
          {item.title}
        </span>
        {item.subItems && (
          <ChevronRight
            className={cn(
              'w-4 h-4 transition-transform',
              isExpanded && 'rotate-90'
            )}
          />
        )}
      </button>

      {isExpanded && item.subItems && (
        <ul className="mt-1 ml-9 space-y-1">
          {item.subItems.map((subItem) => (
            <li key={subItem.path}>
              <Link
                href={subItem.path}
                className={cn(
                  'block px-4 py-2 rounded-lg text-sm transition-colors cursor-pointer',
                  pathname === subItem.path
                    ? 'text-primary-600 font-semibold bg-primary-50'
                    : 'text-gray-600 hover:text-primary-600 hover:bg-primary-50'
                )}
              >
                {subItem.title}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-gray-200 bg-white h-full flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-gray-200">
        <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center mr-3 shadow-sm">
          <Heart className="w-5 h-5 text-white" />
        </div>
        <span className="text-lg font-semibold text-primary-600">健康管家</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.path}>
              <SidebarMenuItem item={item} pathname={pathname} />
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
