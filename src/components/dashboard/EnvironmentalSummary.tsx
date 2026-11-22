'use client';

import React from 'react';
import Link from 'next/link';
import { CloudRain, Waves, ShieldAlert, ArrowRight } from 'lucide-react';
import HighestRainfallList from './HighestRainfallList';
import HighestRiverFlowList from './HighestRiverFlowList';
import ElevatedFloodRiskList from './ElevatedFloodRiskList';

export default function EnvironmentalSummary() {
  return (
    <section className="space-y-3.5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-base lg:text-lg font-bold text-surface-text dark:text-surface-darkText tracking-tight flex items-center gap-2">
            <span>Environmental Telemetry Summary</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-brand border border-teal-200 dark:bg-teal-950/70 dark:text-brand-glow dark:border-teal-800">
              National Grid
            </span>
          </h2>
          <p className="text-xs text-surface-subtext mt-0.5">
            Key precipitation records, river gauge discharges, and LankaHydroAI flood risk scores.
          </p>
        </div>

        <Link
          href="/environmental-monitoring/environmental-overview"
          className="text-xs text-brand hover:text-brand-hover font-bold flex items-center gap-1 transition-colors self-start sm:self-auto"
        >
          <span>View All Environmental Data</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* 3-Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {/* Column 1: Highest Rainfall */}
        <div className="rounded-2xl bg-white dark:bg-surface-darkCard border border-surface-border dark:border-surface-darkBorder p-4 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-surface-border dark:border-surface-darkBorder">
              <div className="flex items-center gap-2 text-brand">
                <CloudRain className="w-4 h-4" />
                <h3 className="text-xs font-bold text-surface-text dark:text-surface-darkText uppercase tracking-wider">Highest Rainfall (24h)</h3>
              </div>
              <span className="text-[10px] text-surface-subtext uppercase font-bold">Rainfall</span>
            </div>
            <HighestRainfallList />
          </div>
          <div className="mt-3 pt-2.5 border-t border-surface-border dark:border-surface-darkBorder text-[11px] text-surface-subtext text-center font-medium">
            Click entry to center on GIS radar.
          </div>
        </div>

        {/* Column 2: Highest River Flow */}
        <div className="rounded-2xl bg-white dark:bg-surface-darkCard border border-surface-border dark:border-surface-darkBorder p-4 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-surface-border dark:border-surface-darkBorder">
              <div className="flex items-center gap-2 text-sky-600">
                <Waves className="w-4 h-4" />
                <h3 className="text-xs font-bold text-surface-text dark:text-surface-darkText uppercase tracking-wider">River Gauge Stages</h3>
              </div>
              <span className="text-[10px] text-surface-subtext uppercase font-bold">Hydrology</span>
            </div>
            <HighestRiverFlowList />
          </div>
          <div className="mt-3 pt-2.5 border-t border-surface-border dark:border-surface-darkBorder text-[11px] text-surface-subtext text-center font-medium">
            Irrigation Department stream gauges.
          </div>
        </div>

        {/* Column 3: Elevated Flood Risk */}
        <div className="rounded-2xl bg-white dark:bg-surface-darkCard border border-surface-border dark:border-surface-darkBorder p-4 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-surface-border dark:border-surface-darkBorder">
              <div className="flex items-center gap-2 text-amber-600">
                <ShieldAlert className="w-4 h-4" />
                <h3 className="text-xs font-bold text-surface-text dark:text-surface-darkText uppercase tracking-wider">Elevated Flood-Risk</h3>
              </div>
              <span className="text-[10px] text-surface-subtext uppercase font-bold">AI Model</span>
            </div>
            <ElevatedFloodRiskList />
          </div>
          <div className="mt-3 pt-2.5 border-t border-surface-border dark:border-surface-darkBorder text-[11px] text-surface-subtext text-center font-medium">
            LankaHydroAI predictive risk scores.
          </div>
        </div>
      </div>
    </section>
  );
}
