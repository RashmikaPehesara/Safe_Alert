'use client';

import React from 'react';
import { 
  AlertTriangle, 
  MapPinOff, 
  LifeBuoy, 
  Activity, 
  Home, 
  CheckCircle2
} from 'lucide-react';
import { useDashboardStore } from '@/store/dashboard.store';

export default function SummaryCards() {
  const { summary, isLoading } = useDashboardStore();

  const cards = [
    {
      id: 'active-alerts',
      title: 'Active Emergency Alerts',
      value: summary ? summary.activeAlerts : '5',
      subText: `${summary?.criticalAlerts || 2} Critical · 3 Warnings`,
      statusText: 'Action Required',
      statusType: 'critical' as const,
      icon: AlertTriangle,
      color: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-900',
      badgeColor: 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300',
    },
    {
      id: 'high-risk',
      title: 'High-Risk Locations',
      value: summary ? summary.highRiskLocations : '14',
      subText: `${summary?.veryHighRiskLocations || 4} Very High Risk`,
      statusText: 'Flood & Landslides',
      statusType: 'high' as const,
      icon: MapPinOff,
      color: 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/40 dark:text-orange-400 dark:border-orange-900',
      badgeColor: 'bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300',
    },
    {
      id: 'pending-requests',
      title: 'Pending Help Requests',
      value: summary ? summary.pendingHelpRequests : '8',
      subText: '3 Evacuation · 5 Relief',
      statusText: 'Triaged by EOC',
      statusType: 'warning' as const,
      icon: LifeBuoy,
      color: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900',
      badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
    },
    {
      id: 'monitoring-stations',
      title: 'Total Monitoring Stations',
      value: summary ? summary.totalMonitoringStations : '68',
      subText: `${summary?.onlineMonitoringStations || 65} Online (95.6%)`,
      statusText: 'Telemetry Healthy',
      statusType: 'normal' as const,
      icon: Activity,
      color: 'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/40 dark:text-teal-400 dark:border-teal-900',
      badgeColor: 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300',
    },
    {
      id: 'emergency-shelters',
      title: 'Available Emergency Shelters',
      value: summary ? summary.availableShelters : '142',
      subText: `${summary?.totalShelters || 160} Total (88% Ready)`,
      statusText: 'Ready for Intake',
      statusType: 'normal' as const,
      icon: Home,
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900',
      badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.id}
            className="rounded-2xl bg-white dark:bg-surface-darkCard border border-surface-border dark:border-surface-darkBorder p-4 shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-surface-subtext uppercase tracking-wider">
                  {card.title}
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-surface-text dark:text-surface-darkText tracking-tight">
                    {isLoading ? '...' : card.value}
                  </span>
                </div>
              </div>

              <div className={`p-2.5 rounded-xl border ${card.color}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>

            <div className="mt-3.5 pt-3 border-t border-surface-border dark:border-surface-darkBorder flex items-center justify-between text-xs">
              <span className="text-surface-subtext font-medium truncate max-w-[130px]">
                {card.subText}
              </span>

              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${card.badgeColor}`}>
                {card.statusType === 'normal' && <CheckCircle2 className="w-2.5 h-2.5" />}
                {card.statusText}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
