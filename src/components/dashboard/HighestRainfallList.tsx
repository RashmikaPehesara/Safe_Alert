'use client';

import React from 'react';
import { useDashboardStore } from '@/store/dashboard.store';
import { useMapStore } from '@/store/map.store';

export default function HighestRainfallList() {
  const { highestRainfall } = useDashboardStore();
  const { locations, selectLocation } = useMapStore();

  const handleRowClick = (locName: string) => {
    const loc = locations.find(l => l.name.toLowerCase() === locName.toLowerCase() || l.district.toLowerCase() === locName.toLowerCase());
    if (loc) {
      selectLocation(loc);
      window.scrollTo({ top: 180, behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-2">
      {highestRainfall.slice(0, 5).map((item, index) => (
        <div
          key={index}
          onClick={() => handleRowClick(item.location)}
          className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-surface-darkSidebar border border-surface-border dark:border-surface-darkBorder hover:border-brand/40 hover:bg-teal-50/50 dark:hover:bg-slate-800 cursor-pointer transition-all group"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-5 h-5 rounded-lg bg-white dark:bg-surface-darkCard border border-surface-border dark:border-surface-darkBorder text-brand dark:text-brand-glow font-bold text-xs flex items-center justify-center flex-shrink-0 shadow-xs">
              {index + 1}
            </div>
            <div>
              <div className="text-xs font-bold text-surface-text dark:text-surface-darkText group-hover:text-brand transition-colors">
                {item.location}
              </div>
              <div className="text-[11px] text-surface-subtext">
                {item.district} District · {item.observedAt}
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="text-xs font-extrabold text-brand dark:text-brand-glow">
              {item.rainfallAmount} <span className="text-[10px] font-normal text-surface-subtext">{item.unit}</span>
            </div>
            <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase
              ${item.riskLevel === 'CRITICAL' ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300' :
                item.riskLevel === 'HIGH' ? 'bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300' :
                'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'}
            `}>
              {item.riskLevel}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
