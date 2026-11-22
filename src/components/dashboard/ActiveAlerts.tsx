'use client';

import React from 'react';
import Link from 'next/link';
import { AlertTriangle, Clock, MapPin, ArrowRight } from 'lucide-react';
import { useDashboardStore } from '@/store/dashboard.store';
import { useMapStore } from '@/store/map.store';
import { formatDateTime } from '@/utils/formatters';

export default function ActiveAlerts() {
  const { activeAlerts } = useDashboardStore();
  const { locations, selectLocation } = useMapStore();

  const handleAlertClick = (locationId: string) => {
    const loc = locations.find(l => l.locationId === locationId);
    if (loc) {
      selectLocation(loc);
      window.scrollTo({ top: 180, behavior: 'smooth' });
    }
  };

  return (
    <div className="rounded-2xl bg-white dark:bg-surface-darkCard border border-surface-border dark:border-surface-darkBorder p-4 shadow-sm space-y-3.5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-surface-border dark:border-surface-darkBorder">
        <div>
          <h3 className="text-sm font-bold text-surface-text dark:text-surface-darkText tracking-tight flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            <span>Active National Emergency Alerts</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300">
              {activeAlerts.length} Active
            </span>
          </h3>
          <p className="text-xs text-surface-subtext mt-0.5">
            Official emergency bulletins disseminated by DMC, Irrigation Department & NBRO.
          </p>
        </div>

        <Link
          href="/emergency-management/emergency-alerts"
          className="text-xs text-brand hover:text-brand-hover font-bold flex items-center gap-1 transition-colors self-start sm:self-auto"
        >
          <span>View All Alerts</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {activeAlerts.map((alert) => {
          const isCritical = alert.severityLevel === 'CRITICAL';
          const isHigh = alert.severityLevel === 'HIGH';

          return (
            <div
              key={alert.alertId}
              onClick={() => handleAlertClick(alert.locationId)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer group flex flex-col justify-between shadow-2xs
                ${isCritical 
                  ? 'bg-red-50/60 dark:bg-red-950/20 border-red-200 dark:border-red-900/60 hover:border-red-300' 
                  : isHigh 
                  ? 'bg-orange-50/60 dark:bg-orange-950/20 border-orange-200 dark:border-orange-900/60 hover:border-orange-300' 
                  : 'bg-slate-50 dark:bg-surface-darkSidebar border-surface-border dark:border-surface-darkBorder hover:border-brand/40'
                }
              `}
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider
                      ${isCritical ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300' :
                        isHigh ? 'bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300' :
                        'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'}
                    `}>
                      {alert.severityLevel} · {alert.disasterType}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-emerald-700 dark:text-emerald-400 font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      {alert.alertStatus}
                    </span>
                  </div>

                  <span className="text-[10px] text-brand font-bold flex items-center gap-0.5">
                    <span>Inspect</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>

                <h4 className="text-xs font-bold text-surface-text dark:text-surface-darkText mt-2 group-hover:text-brand transition-colors line-clamp-1">
                  {alert.alertTitle}
                </h4>

                <p className="text-[11px] text-surface-subtext mt-1 line-clamp-2 leading-relaxed">
                  {alert.alertDescription}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-surface-border dark:border-surface-darkBorder flex flex-wrap items-center justify-between gap-2 text-[11px] text-surface-subtext">
                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-brand" />
                  <span className="font-medium text-surface-text dark:text-surface-darkText">{alert.affectedAreas.join(', ')}</span>
                </div>

                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span>Issued: {formatDateTime(alert.issuedAt)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
