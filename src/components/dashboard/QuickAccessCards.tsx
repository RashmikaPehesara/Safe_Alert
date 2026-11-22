'use client';

import React from 'react';
import Link from 'next/link';
import { 
  AlertTriangle, 
  BrainCircuit, 
  LifeBuoy, 
  Map, 
  CloudSun, 
  Home, 
  ArrowUpRight 
} from 'lucide-react';

const QUICK_ACTIONS = [
  {
    title: 'Create Emergency Alert',
    description: 'Issue official national or district-level early warning bulletin',
    href: '/emergency-management/emergency-alerts',
    icon: AlertTriangle,
    iconColor: 'text-red-700 dark:text-red-400',
    iconBg: 'bg-red-50 dark:bg-red-950/60 border-red-200 dark:border-red-900',
    btnText: 'Issue Alert',
  },
  {
    title: 'AI Risk Assessment',
    description: 'Run neural predictive models for flood and landslide vector analysis',
    href: '/analytics/ai-risk-assessment',
    icon: BrainCircuit,
    iconColor: 'text-purple-700 dark:text-purple-400',
    iconBg: 'bg-purple-50 dark:bg-purple-950/60 border-purple-200 dark:border-purple-900',
    btnText: 'Run AI Model',
  },
  {
    title: 'Emergency Help Requests',
    description: 'Triage pending citizen evacuation, medical, and rescue calls',
    href: '/emergency-management/help-incident-reports',
    icon: LifeBuoy,
    iconColor: 'text-amber-700 dark:text-amber-400',
    iconBg: 'bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-900',
    btnText: 'Coordinate Triage',
  },
  {
    title: 'Live Disaster Map',
    description: 'Dedicated full GIS layers with meteorological radars and river telemetry',
    href: '/environmental-monitoring/live-disaster-map',
    icon: Map,
    iconColor: 'text-brand dark:text-brand-glow',
    iconBg: 'bg-teal-50 dark:bg-teal-950/60 border-teal-200 dark:border-teal-900',
    btnText: 'Open Full GIS',
  },
  {
    title: 'Weather & Forecasts',
    description: 'Comprehensive Doppler radar, precipitation thresholds, and synoptic maps',
    href: '/environmental-monitoring/weather-forecasts',
    icon: CloudSun,
    iconColor: 'text-sky-700 dark:text-sky-400',
    iconBg: 'bg-sky-50 dark:bg-sky-950/60 border-sky-200 dark:border-sky-900',
    btnText: 'View Telemetry',
  },
  {
    title: 'Response Teams & Shelters',
    description: 'Review shelter occupancy capacities, rescue teams, and relief logistics',
    href: '/emergency-management/response-teams-shelters',
    icon: Home,
    iconColor: 'text-emerald-700 dark:text-emerald-400',
    iconBg: 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-900',
    btnText: 'Manage Intake',
  },
];

export default function QuickAccessCards() {
  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-sm font-bold text-surface-text dark:text-surface-darkText tracking-tight">
          Emergency Operations Command Quick Access
        </h3>
        <p className="text-xs text-surface-subtext mt-0.5">
          Key operational modules for rapid incident response and protocol execution.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {QUICK_ACTIONS.map((action, i) => {
          const Icon = action.icon;

          return (
            <Link
              key={i}
              href={action.href}
              className="p-3.5 rounded-2xl bg-white dark:bg-surface-darkCard border border-surface-border dark:border-surface-darkBorder hover:border-brand/40 hover:shadow-md transition-all duration-150 group flex flex-col justify-between"
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-xl border ${action.iconBg} ${action.iconColor} flex-shrink-0 group-hover:scale-105 transition-transform`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-surface-text dark:text-surface-darkText group-hover:text-brand transition-colors">
                    {action.title}
                  </h4>
                  <p className="text-[11px] text-surface-subtext mt-0.5 leading-relaxed">
                    {action.description}
                  </p>
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-surface-border dark:border-surface-darkBorder flex items-center justify-between text-xs font-bold text-brand dark:text-brand-glow group-hover:text-brand-hover">
                <span>{action.btnText}</span>
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
