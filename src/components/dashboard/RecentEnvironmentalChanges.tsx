'use client';

import React from 'react';
import { 
  Activity, 
  Clock, 
  MapPin, 
  Waves, 
  CloudRain, 
  Mountain, 
  BrainCircuit, 
  AlertCircle 
} from 'lucide-react';
import { useDashboardStore } from '@/store/dashboard.store';
import { useMapStore } from '@/store/map.store';

export default function RecentEnvironmentalChanges() {
  const { signals } = useDashboardStore();
  const { locations, selectLocation } = useMapStore();

  const handleSignalClick = (locationId?: string) => {
    if (!locationId) return;
    const loc = locations.find(l => l.locationId === locationId);
    if (loc) {
      selectLocation(loc);
      window.scrollTo({ top: 180, behavior: 'smooth' });
    }
  };

  const getSignalIcon = (type: string) => {
    switch (type) {
      case 'RIVER_LEVEL_RISE':
        return <Waves className="w-3.5 h-3.5 text-sky-600" />;
      case 'RAINFALL_SURGE':
        return <CloudRain className="w-3.5 h-3.5 text-brand" />;
      case 'LANDSLIDE_ALERT':
        return <Mountain className="w-3.5 h-3.5 text-amber-600" />;
      case 'NEW_SENSOR_OBSERVATION':
        return <BrainCircuit className="w-3.5 h-3.5 text-purple-600" />;
      default:
        return <AlertCircle className="w-3.5 h-3.5 text-blue-600" />;
    }
  };

  return (
    <div className="rounded-2xl bg-white dark:bg-surface-darkCard border border-surface-border dark:border-surface-darkBorder p-4 shadow-sm space-y-3.5">
      <div className="flex items-center justify-between pb-3 border-b border-surface-border dark:border-surface-darkBorder">
        <div>
          <h3 className="text-sm font-bold text-surface-text dark:text-surface-darkText tracking-tight flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-600" />
            <span>Recent Environmental Signals</span>
          </h3>
          <p className="text-xs text-surface-subtext mt-0.5">
            Sensory telemetry triggers, river gauge alerts, and automated AI classifications.
          </p>
        </div>

        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 font-bold flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
          Live Log
        </span>
      </div>

      <div className="relative pl-5 space-y-3 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-700">
        {signals.map((sig) => {
          const isCritical = sig.riskLevel === 'CRITICAL';
          const isHigh = sig.riskLevel === 'HIGH';

          return (
            <div
              key={sig.id}
              onClick={() => handleSignalClick(sig.locationId)}
              className="relative group cursor-pointer"
            >
              <div className={`absolute -left-5 top-1 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-slate-800 flex items-center justify-center transition-transform group-hover:scale-125
                ${isCritical ? 'bg-red-600' : isHigh ? 'bg-orange-500' : 'bg-teal-600'}
              `} />

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-surface-darkSidebar border border-surface-border dark:border-surface-darkBorder hover:border-brand/40 hover:bg-teal-50/40 dark:hover:bg-slate-800 transition-all">
                <div className="flex flex-wrap items-center justify-between gap-1.5">
                  <div className="flex items-center gap-2">
                    <div className="p-1 rounded-lg bg-white dark:bg-surface-darkCard border border-surface-border dark:border-surface-darkBorder">
                      {getSignalIcon(sig.type)}
                    </div>
                    <span className="text-xs font-bold text-surface-text dark:text-surface-darkText group-hover:text-brand transition-colors">
                      {sig.title}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {sig.value && (
                      <span className="text-[11px] font-mono font-bold px-1.5 py-0.2 rounded bg-white dark:bg-surface-darkCard text-brand dark:text-brand-glow border border-surface-border dark:border-surface-darkBorder">
                        {sig.value}
                      </span>
                    )}
                    <span className="text-[10px] text-surface-subtext flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{sig.timestamp}</span>
                    </span>
                  </div>
                </div>

                <p className="text-xs text-surface-subtext mt-1.5 leading-relaxed">
                  {sig.description}
                </p>

                <div className="mt-2 pt-1.5 border-t border-surface-border dark:border-surface-darkBorder flex items-center justify-between text-[11px] text-surface-subtext">
                  <span className="flex items-center gap-1 font-medium">
                    <MapPin className="w-3 h-3 text-brand" />
                    <span>{sig.locationName}</span>
                  </span>
                  <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase
                    ${isCritical ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300' :
                      isHigh ? 'bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300' :
                      'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'}
                  `}>
                    {sig.riskLevel}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
