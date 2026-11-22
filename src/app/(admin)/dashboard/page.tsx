'use client';

import React, { useEffect } from 'react';
import WelcomeHeader from '@/components/dashboard/WelcomeHeader';
import SummaryCards from '@/components/dashboard/SummaryCards';
import SriLankaLiveMap from '@/components/dashboard/SriLankaLiveMap';
import EnvironmentalSummary from '@/components/dashboard/EnvironmentalSummary';
import WeatherForecastSummary from '@/components/dashboard/WeatherForecastSummary';
import RecentEnvironmentalChanges from '@/components/dashboard/RecentEnvironmentalChanges';
import ActiveAlerts from '@/components/dashboard/ActiveAlerts';
import QuickAccessCards from '@/components/dashboard/QuickAccessCards';
import { useDashboardStore } from '@/store/dashboard.store';
import { useMapStore } from '@/store/map.store';

export default function DashboardOverviewPage() {
  const { fetchDashboardData, error } = useDashboardStore();
  const { locations, selectLocation } = useMapStore();

  useEffect(() => {
    fetchDashboardData();
    // Default selected location to Badulla as demonstrated in the reference design
    const badulla = locations.find(l => l.locationId === 'loc-badulla');
    if (badulla) {
      selectLocation(badulla);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-6 pb-12 max-w-[1600px] mx-auto">
      {/* 1. Welcome & Status Header */}
      <WelcomeHeader />

      {/* Resilient Cache Alert if backend error occurs */}
      {error && (
        <div className="px-4 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center justify-between">
          <span>{error}</span>
          <span className="font-semibold text-[11px] underline cursor-pointer" onClick={() => fetchDashboardData()}>
            Retry Sync
          </span>
        </div>
      )}

      {/* 2. Summary Statistics Row */}
      <SummaryCards />

      {/* 3. Main Centerpiece Feature – Interactive Sri Lanka Live Map with Contextual Right-Side Panel */}
      <SriLankaLiveMap />

      {/* 4. Dashboard Environmental Summary (Rainfall, River Flow, Flood Risk) */}
      <EnvironmentalSummary />

      {/* 5. Forecast & Real-Time Event Timeline (2-Column Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <WeatherForecastSummary />
        </div>
        <div className="lg:col-span-5">
          <RecentEnvironmentalChanges />
        </div>
      </div>

      {/* 6. Active Emergency Alerts Section */}
      <ActiveAlerts />

      {/* 7. Emergency Operations Command Quick Access Cards */}
      <QuickAccessCards />
    </div>
  );
}
