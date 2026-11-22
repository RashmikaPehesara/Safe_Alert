'use client';

import React from 'react';
import { ShieldAlert } from 'lucide-react';
import { useDashboardStore } from '@/store/dashboard.store';
import { useMapStore } from '@/store/map.store';

export default function ElevatedFloodRiskList() {
  const { elevatedFloodRisks } = useDashboardStore();
  const { locations, selectLocation } = useMapStore();

  const handleRowClick = (locationId: string) => {
    const loc = locations.find(l => l.locationId === locationId);
    if (loc) {
      selectLocation(loc);
      window.scrollTo({ top: 180, behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-2">
      {elevatedFloodRisks.slice(0, 5).map((risk, index) => (
        <div
          key={index}
          onClick={() => handleRowClick(risk.locationId)}
          className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-surface-darkSidebar border border-surface-border dark:border-surface-darkBorder hover:border-brand/40 hover:bg-teal-50/50 dark:hover:bg-slate-800 cursor-pointer transition-all group"
        >
          <div className="flex items-center gap-2.5">
            <div className={`p-1.5 rounded-lg border text-xs font-bold
              ${risk.riskLevel === 'CRITICAL' ? 'bg-red-50 border-red-200 text-red-700 dark:bg-red-950/60 dark:border-red-800 dark:text-red-300' :
                risk.riskLevel === 'HIGH' ? 'bg-orange-50 border-orange-200 text-orange-700 dark:bg-orange-950/60 dark:border-orange-800 dark:text-orange-300' :
                'bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-950/60 dark:border-amber-800 dark:text-amber-300'}
            `}>
              <ShieldAlert className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="text-xs font-bold text-surface-text dark:text-surface-darkText group-hover:text-brand transition-colors">
                {risk.location}
              </div>
              <div className="text-[11px] text-surface-subtext line-clamp-1 max-w-[190px]">
                {risk.explanation}
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="text-xs font-extrabold text-surface-text dark:text-surface-darkText">
              {risk.riskScore}<span className="text-[10px] font-normal text-surface-subtext">/100</span>
            </div>
            <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase
              ${risk.riskLevel === 'CRITICAL' ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300' :
                risk.riskLevel === 'HIGH' ? 'bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300' :
                'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'}
            `}>
              {risk.riskLevel}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
