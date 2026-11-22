'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Menu, 
  Search, 
  Bell, 
  ChevronDown, 
  User, 
  LogOut, 
  Settings, 
  ShieldCheck, 
  AlertTriangle,
  MapPin,
  ExternalLink,
  Sun,
  Moon
} from 'lucide-react';
import { useMapStore } from '@/store/map.store';
import { useDashboardStore } from '@/store/dashboard.store';
import { useThemeStore } from '@/store/theme.store';
import { LocationService } from '@/services/location.service';
import { Location } from '@/types/location.types';

interface AdminHeaderProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  setIsMobileOpen: (open: boolean) => void;
}

export default function AdminHeader({
  isCollapsed,
  setIsCollapsed,
  setIsMobileOpen,
}: AdminHeaderProps) {
  const pathname = usePathname();
  const { selectLocation } = useMapStore();
  const { activeAlerts } = useDashboardStore();
  const { theme, toggleTheme, setTheme } = useThemeStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Location[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Sync theme with localStorage / system on mount
  useEffect(() => {
    const saved = localStorage.getItem('safealert_theme') as 'light' | 'dark' | null;
    if (saved) {
      setTheme(saved);
    } else {
      setTheme('light');
    }
  }, [setTheme]);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle location search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsSearchOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      const results = await LocationService.searchLocations(searchQuery);
      setSearchResults(results);
      setIsSearchOpen(true);
    }, 150);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSelectLocation = async (location: Location) => {
    await selectLocation(location);
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  // Human readable breadcrumb
  const getBreadcrumbs = () => {
    const parts = pathname.split('/').filter(Boolean);
    if (parts.length === 0 || parts[0] === 'dashboard') {
      return { section: 'Dashboard', page: 'Overview' };
    }
    const sectionName = parts[0].replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
    const pageName = parts[1] ? parts[1].replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) : 'Overview';
    return { section: sectionName, page: pageName };
  };

  const breadcrumbs = getBreadcrumbs();
  const unreadAlertsCount = activeAlerts.length;

  return (
    <header className="sticky top-0 z-30 h-16 bg-white dark:bg-surface-darkSidebar border-b border-surface-border dark:border-surface-darkBorder px-4 lg:px-6 flex items-center justify-between gap-4 transition-colors">
      {/* Left: Sidebar Toggle & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden lg:flex p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          <Menu className="w-5 h-5" />
        </button>

        <button
          onClick={() => setIsMobileOpen(true)}
          className="flex lg:hidden p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Breadcrumb Navigation */}
        <nav className="flex items-center text-xs font-medium">
          <span className="text-surface-subtext dark:text-surface-darkSubtext">{breadcrumbs.section}</span>
          <span className="mx-2 text-slate-400 dark:text-slate-600">/</span>
          <span className="text-brand dark:text-brand-glow font-bold">{breadcrumbs.page}</span>
        </nav>
      </div>

      {/* Middle: Global Location Search */}
      <div ref={searchRef} className="relative flex-1 max-w-md hidden md:block">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => searchQuery.trim() && setIsSearchOpen(true)}
            placeholder="Search province, district, station (e.g. Badulla, Colombo)..."
            className="w-full bg-slate-50 dark:bg-surface-darkCard border border-surface-border dark:border-surface-darkBorder text-xs rounded-xl pl-10 pr-4 py-2 text-surface-text dark:text-surface-darkText placeholder-slate-400 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/40 transition-all"
          />
        </div>

        {/* Search Results Dropdown */}
        {isSearchOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-surface-darkCard border border-surface-border dark:border-surface-darkBorder rounded-xl shadow-2xl overflow-hidden z-50 max-h-80 overflow-y-auto">
            {searchResults.length > 0 ? (
              <div className="p-1">
                <div className="px-3 py-1.5 text-[10px] font-bold uppercase text-surface-subtext dark:text-surface-darkSubtext tracking-wider">
                  Locations & Stations ({searchResults.length})
                </div>
                {searchResults.map((loc) => (
                  <button
                    key={loc.locationId}
                    onClick={() => handleSelectLocation(loc)}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 rounded-lg bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-brand">
                        <MapPin className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-surface-text dark:text-surface-darkText group-hover:text-brand flex items-center gap-1.5">
                          <span>{loc.name}</span>
                          {loc.localName && (
                            <span className="text-[11px] font-normal text-surface-subtext dark:text-surface-darkSubtext">{loc.localName}</span>
                          )}
                        </div>
                        <div className="text-[11px] text-surface-subtext dark:text-surface-darkSubtext">
                          {loc.district} District · {loc.province} Province
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-right">
                      {loc.currentTemperature && (
                        <span className="text-[11px] font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {loc.currentTemperature}°C
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-xs text-surface-subtext">
                No matching locations found in Sri Lanka.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right: Telemetry stream pill, Theme Toggle, Notifications & Profile */}
      <div className="flex items-center gap-2.5">
        {/* Live Stream Indicator Pill */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 text-xs font-semibold">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span>Live Telemetry</span>
        </div>

        {/* Theme Toggle Button (Light / Dark) */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
          aria-label="Toggle Theme"
        >
          {theme === 'light' ? (
            <Moon className="w-4 h-4 text-slate-700" />
          ) : (
            <Sun className="w-4 h-4 text-amber-400" />
          )}
        </button>

        {/* Notifications Popover */}
        <div ref={notificationRef} className="relative">
          <button
            onClick={() => setIsNotificationOpen(!isNotificationOpen)}
            className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Emergency Bulletins"
          >
            <Bell className="w-4 h-4" />
            {unreadAlertsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white shadow-sm">
                {unreadAlertsCount}
              </span>
            )}
          </button>

          {isNotificationOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-surface-darkCard border border-surface-border dark:border-surface-darkBorder rounded-2xl shadow-2xl overflow-hidden z-50">
              <div className="p-3 border-b border-surface-border dark:border-surface-darkBorder flex items-center justify-between bg-slate-50 dark:bg-surface-darkSidebar">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span className="font-bold text-xs text-surface-text dark:text-surface-darkText">Emergency Bulletins</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 font-bold">
                  {unreadAlertsCount} Active
                </span>
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-surface-border dark:divide-surface-darkBorder">
                {activeAlerts.slice(0, 4).map((alert) => (
                  <div key={alert.alertId} className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300">
                        {alert.severityLevel} · {alert.disasterType}
                      </span>
                      <span className="text-[10px] text-surface-subtext">Active</span>
                    </div>
                    <h4 className="text-xs font-bold text-surface-text dark:text-surface-darkText mt-1 line-clamp-1">{alert.alertTitle}</h4>
                    <p className="text-[11px] text-surface-subtext mt-0.5 line-clamp-2">{alert.alertDescription}</p>
                  </div>
                ))}
              </div>

              <div className="p-2.5 border-t border-surface-border dark:border-surface-darkBorder text-center bg-slate-50 dark:bg-surface-darkSidebar">
                <Link
                  href="/emergency-management/emergency-alerts"
                  onClick={() => setIsNotificationOpen(false)}
                  className="text-xs text-brand hover:text-brand-hover font-bold flex items-center justify-center gap-1"
                >
                  <span>View All Alerts</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Administrator Profile Menu */}
        <div ref={profileRef} className="relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand to-brand-accent flex items-center justify-center text-white font-bold text-xs shadow-sm">
              AP
            </div>
            <div className="hidden xl:flex flex-col text-left">
              <span className="text-xs font-bold text-surface-text dark:text-surface-darkText">Dr. Anura Perera</span>
              <span className="text-[10px] text-brand font-semibold">National Coordinator</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-surface-darkCard border border-surface-border dark:border-surface-darkBorder rounded-xl shadow-2xl p-1 z-50">
              <div className="px-3 py-2 border-b border-surface-border dark:border-surface-darkBorder">
                <p className="text-xs font-bold text-surface-text dark:text-surface-darkText">Dr. Anura Perera</p>
                <p className="text-[11px] text-surface-subtext">coordinator@safealert.gov.lk</p>
                <span className="mt-1 inline-block text-[10px] font-bold px-1.5 py-0.5 rounded bg-brand/10 text-brand">
                  Disaster Commander
                </span>
              </div>
              <div className="py-1">
                <Link
                  href="/system-management/user-management"
                  onClick={() => setIsProfileOpen(false)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-600 dark:text-slate-300 hover:text-brand hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors font-medium"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Administrator Profile</span>
                </Link>
                <Link
                  href="/system-management/system-settings"
                  onClick={() => setIsProfileOpen(false)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-600 dark:text-slate-300 hover:text-brand hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors font-medium"
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>System Settings</span>
                </Link>
              </div>
              <div className="pt-1 border-t border-surface-border dark:border-surface-darkBorder">
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    alert('Session ended. In production this redirects to /login.');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors font-semibold"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
