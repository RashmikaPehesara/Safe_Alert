'use client';

import React from 'react';
import { RefreshCw, Calendar, Clock, Radio } from 'lucide-react';
import { getGreeting } from '@/utils/formatters';
import { useDashboardStore } from '@/store/dashboard.store';

export default function WelcomeHeader() {
  const { lastSyncTime, isLoading, fetchDashboardData } = useDashboardStore();
  const greeting = getGreeting();

  const formattedDate = new Date().toLocaleDateString('en-LK', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-surface-border dark:border-surface-darkBorder">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-surface-text dark:text-surface-darkText">
            {greeting}, <span className="text-brand dark:text-brand-glow">Administrator</span>
          </h1>
          <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-teal-50 text-brand border border-teal-200 dark:bg-teal-950/70 dark:text-brand-glow dark:border-teal-800">
            National EOC
          </span>
        </div>
        <p className="text-xs text-surface-subtext dark:text-surface-darkSubtext mt-1 max-w-2xl">
          National environmental telemetry, real-time hydrometeorological radar, and early disaster warning operations for Sri Lanka.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2.5 text-xs">
        {/* Date & Time */}
        <div className="flex items-center gap-3 px-3 py-1.5 rounded-xl bg-white dark:bg-surface-darkCard border border-surface-border dark:border-surface-darkBorder text-surface-text dark:text-surface-darkText shadow-xs">
          <div className="flex items-center gap-1.5 text-surface-subtext">
            <Calendar className="w-3.5 h-3.5 text-brand" />
            <span className="font-medium">{formattedDate}</span>
          </div>
          <span className="text-slate-300 dark:text-slate-700">|</span>
          <div className="flex items-center gap-1.5 text-surface-subtext">
            <Clock className="w-3.5 h-3.5 text-brand-accent" />
            <span>Synced: <strong className="text-surface-text dark:text-surface-darkText">{lastSyncTime}</strong></span>
          </div>
        </div>

        {/* Sync Status Button */}
        <button
          onClick={() => fetchDashboardData()}
          disabled={isLoading}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-brand hover:bg-brand-hover text-white text-xs font-bold shadow-xs transition-all active:scale-95 disabled:opacity-50"
          title="Force Synchronize Telemetry Grid"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>{isLoading ? 'Syncing...' : 'Sync Telemetry'}</span>
        </button>
      </div>
    </div>
  );
}
