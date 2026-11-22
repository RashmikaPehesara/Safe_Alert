'use client';

import React from 'react';
import { Waves } from 'lucide-react';
import { MOCK_RIVER_OBSERVATIONS } from '@/services/mock-data/sri-lanka-data';
import { useMapStore } from '@/store/map.store';
import { getRiverStatusBadge } from '@/utils/risk-colors';

export default function HighestRiverFlowList() {
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
      {MOCK_RIVER_OBSERVATIONS.slice(0, 5).map((river) => {
        const badge = getRiverStatusBadge(river.dangerLevel);

        return (
          <div
            key={river.riverObservationId}
            onClick={() => handleRowClick(river.locationId)}
            className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-surface-darkSidebar border border-surface-border dark:border-surface-darkBorder hover:border-brand/40 hover:bg-teal-50/50 dark:hover:bg-slate-800 cursor-pointer transition-all group"
          >
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 text-sky-700 dark:text-sky-300">
                <Waves className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="text-xs font-bold text-surface-text dark:text-surface-darkText group-hover:text-brand transition-colors">
                  {river.riverName}
                </div>
                <div className="text-[11px] text-surface-subtext">
                  Gauge: {river.stationId.replace('st-', '')} · {river.flowRate} {river.flowRateUnit}
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-xs font-extrabold text-surface-text dark:text-surface-darkText">
                {river.waterLevel} <span className="text-[10px] font-normal text-surface-subtext">{river.waterLevelUnit}</span>
              </div>
              <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase border ${badge.color}`}>
                {badge.label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
