'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  ShieldAlert, 
  LayoutDashboard, 
  Layers, 
  CloudSun, 
  Waves, 
  MapPin, 
  BrainCircuit, 
  History, 
  FileText, 
  AlertTriangle, 
  LifeBuoy, 
  Users, 
  Settings, 
  Bell, 
  ChevronDown, 
  ChevronRight,
  Radio,
  X,
  Map
} from 'lucide-react';

interface AdminSidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface NavGroup {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  items: NavItem[];
}

export const NAVIGATION_GROUPS: NavGroup[] = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    icon: LayoutDashboard,
    items: [
      { name: 'Dashboard Overview', href: '/dashboard', icon: LayoutDashboard },
    ],
  },
  {
    id: 'environmental',
    name: 'Environmental Monitoring',
    icon: Layers,
    items: [
      { name: 'Environmental Overview', href: '/environmental-monitoring/environmental-overview', icon: Layers },
      { name: 'Weather & Forecasts', href: '/environmental-monitoring/weather-forecasts', icon: CloudSun },
      { name: 'River & Rainfall Monitoring', href: '/environmental-monitoring/river-rainfall', icon: Waves },
      { name: 'Live Disaster Map', href: '/environmental-monitoring/live-disaster-map', icon: Map },
    ],
  },
  {
    id: 'analytics',
    name: 'Analytics',
    icon: BrainCircuit,
    items: [
      { name: 'AI Risk Assessment', href: '/analytics/ai-risk-assessment', icon: BrainCircuit },
      { name: 'Historical Analytics', href: '/analytics/historical-analytics', icon: History },
      { name: 'Emergency & System Reports', href: '/analytics/emergency-reports', icon: FileText },
    ],
  },
  {
    id: 'emergency',
    name: 'Emergency Management',
    icon: AlertTriangle,
    items: [
      { name: 'Emergency Alerts', href: '/emergency-management/emergency-alerts', icon: AlertTriangle },
      { name: 'Geographic Areas & Risk Zones', href: '/emergency-management/geographic-risk-zones', icon: MapPin },
      { name: 'Emergency Help & Incident Reports', href: '/emergency-management/help-incident-reports', icon: LifeBuoy },
      { name: 'Response Teams & Shelters', href: '/emergency-management/response-teams-shelters', icon: Users },
    ],
  },
  {
    id: 'system',
    name: 'System Management',
    icon: Settings,
    items: [
      { name: 'User Management', href: '/system-management/user-management', icon: Users },
      { name: 'Notifications', href: '/system-management/notifications', icon: Bell },
      { name: 'System Settings', href: '/system-management/system-settings', icon: Settings },
    ],
  },
];

export default function AdminSidebar({
  isCollapsed,
  setIsCollapsed,
  isMobileOpen,
  setIsMobileOpen,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    dashboard: true,
    environmental: true,
    analytics: true,
    emergency: true,
    system: true,
  });

  const toggleGroup = (groupId: string) => {
    if (isCollapsed) {
      setIsCollapsed(false);
      setExpandedGroups((prev) => ({ ...prev, [groupId]: true }));
    } else {
      setExpandedGroups((prev) => ({ ...prev, [groupId]: !prev[groupId] }));
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-surface-sidebar dark:bg-surface-darkSidebar border-r border-surface-border dark:border-surface-darkBorder transition-all duration-200 ease-in-out
          ${isCollapsed ? 'w-20' : 'w-72'}
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-surface-border dark:border-surface-darkBorder bg-white dark:bg-surface-darkSidebar">
          <Link href="/dashboard" className="flex items-center gap-3 overflow-hidden group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-hover to-brand-accent p-[2px] shadow-sm flex-shrink-0">
              <div className="w-full h-full bg-white dark:bg-surface-darkCard rounded-[10px] flex items-center justify-center">
                <ShieldAlert className="w-5 h-5 text-brand group-hover:scale-105 transition-transform" />
              </div>
            </div>
            {!isCollapsed && (
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-base tracking-tight text-surface-text dark:text-surface-darkText">SafeAlert</span>
                  <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-brand/10 text-brand dark:bg-brand/20 dark:text-brand-glow">LK</span>
                </div>
                <span className="text-[11px] text-surface-subtext dark:text-surface-darkSubtext truncate">Disaster Management System</span>
              </div>
            )}
          </Link>

          {/* Mobile Close Button */}
          <button
            onClick={() => setIsMobileOpen(false)}
            className="p-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Groups List */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
          {NAVIGATION_GROUPS.map((group) => {
            const isGroupExpanded = expandedGroups[group.id];
            const GroupIcon = group.icon;

            return (
              <div key={group.id} className="space-y-1">
                {/* Group Title Accordion Header */}
                {!isCollapsed ? (
                  <button
                    onClick={() => toggleGroup(group.id)}
                    className="w-full flex items-center justify-between px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-surface-subtext dark:text-surface-darkSubtext hover:text-brand dark:hover:text-brand-glow transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <GroupIcon className="w-3.5 h-3.5 text-brand dark:text-brand-glow" />
                      <span>{group.name}</span>
                    </div>
                    {isGroupExpanded ? (
                      <ChevronDown className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5" />
                    )}
                  </button>
                ) : (
                  <div className="flex justify-center py-1">
                    <div className="w-6 h-0.5 bg-surface-border dark:bg-surface-darkBorder rounded-full" />
                  </div>
                )}

                {/* Subitems */}
                <div className={`space-y-0.5 ${!isGroupExpanded && !isCollapsed ? 'hidden' : 'block'}`}>
                  {group.items.map((item) => {
                    const ItemIcon = item.icon;
                    const isActive = pathname === item.href || (item.href === '/dashboard' && pathname === '/');

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        title={isCollapsed ? item.name : undefined}
                        onClick={() => setIsMobileOpen(false)}
                        className={`group relative flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150
                          ${isActive 
                            ? 'bg-brand/10 text-brand dark:bg-brand/20 dark:text-brand-glow shadow-sm' 
                            : 'text-slate-600 dark:text-slate-300 hover:text-surface-text dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                          }
                          ${isCollapsed ? 'justify-center py-2.5' : ''}
                        `}
                      >
                        <ItemIcon className={`w-4 h-4 flex-shrink-0 transition-colors ${isActive ? 'text-brand dark:text-brand-glow' : 'text-slate-400 group-hover:text-brand'}`} />
                        
                        {!isCollapsed && (
                          <div className="flex items-center justify-between flex-1 min-w-0">
                            <span className="truncate">{item.name}</span>
                            {isActive && (
                              <span className="w-1.5 h-1.5 rounded-full bg-brand dark:bg-brand-glow" />
                            )}
                          </div>
                        )}

                        {/* Collapsed Tooltip */}
                        {isCollapsed && (
                          <div className="absolute left-full ml-3 px-2.5 py-1 bg-slate-900 text-white dark:bg-slate-800 text-xs rounded-md shadow-xl border border-slate-700 pointer-events-none whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50">
                            {item.name}
                          </div>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Operational Status Footer */}
        <div className="p-3 border-t border-surface-border dark:border-surface-darkBorder bg-slate-50 dark:bg-surface-darkSidebar">
          {!isCollapsed ? (
            <div className="p-2.5 rounded-xl bg-white dark:bg-surface-darkCard border border-surface-border dark:border-surface-darkBorder flex items-center gap-2.5 shadow-sm">
              <div className="relative flex-shrink-0">
                <Radio className="w-4 h-4 text-emerald-600 dark:text-emerald-400 animate-pulse" />
                <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-emerald-500" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-surface-text dark:text-surface-darkText">Sensor Grid Active</span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">99.8%</span>
                </div>
                
              </div>
            </div>
          ) : (
            <div className="flex justify-center" title="LankaTwin Telemetry Online (99.8%)">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
