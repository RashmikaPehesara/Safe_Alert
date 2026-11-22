'use client';

import React, { useState } from 'react';
import { 
  CloudRain, 
  Waves, 
  ShieldAlert, 
  Activity, 
  Search, 
  Filter, 
  ArrowUpDown, 
  RefreshCw,
  Clock,
  MapPin,
  ExternalLink
} from 'lucide-react';
import { 
  MOCK_HIGHEST_RAINFALL, 
  MOCK_RIVER_OBSERVATIONS, 
  MOCK_ELEVATED_FLOOD_RISK, 
  MOCK_RECENT_SIGNALS 
} from '@/services/mock-data/sri-lanka-data';
import { getRiskLevelBadge, getRiverStatusBadge } from '@/utils/risk-colors';

export default function EnvironmentalOverviewPage() {
  const [rainfallSearch, setRainfallSearch] = useState('');
  const [districtFilter, setDistrictFilter] = useState('ALL');
  const [riverSortAsc, setRiverSortAsc] = useState(false);

  // Filter rainfall data
  const filteredRainfall = MOCK_HIGHEST_RAINFALL.filter((item) => {
    const matchesSearch = item.location.toLowerCase().includes(rainfallSearch.toLowerCase()) || item.district.toLowerCase().includes(rainfallSearch.toLowerCase());
    const matchesDistrict = districtFilter === 'ALL' || item.district === districtFilter;
    return matchesSearch && matchesDistrict;
  });

  // Sort river data
  const sortedRivers = [...MOCK_RIVER_OBSERVATIONS].sort((a, b) => {
    return riverSortAsc ? a.waterLevel - b.waterLevel : b.waterLevel - a.waterLevel;
  });

  const districts = ['ALL', 'Kegalle', 'Ratnapura', 'Matara', 'Kalutara', 'Galle', 'Colombo'];

  return (
    <div className="space-y-6 pb-12 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-surface-border dark:border-surface-darkBorder">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold tracking-tight text-surface-text dark:text-surface-darkText flex items-center gap-2">
            <span>Environmental Telemetry Overview</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-brand border border-teal-200 dark:bg-teal-950 dark:text-brand-glow">
              Live Data
            </span>
          </h1>
          <p className="text-xs text-surface-subtext mt-0.5">
            Aggregated hydro-meteorological telemetry from national weather stations and Department of Irrigation stream gauges.
          </p>
        </div>

        <button 
          onClick={() => alert('Synchronized with LankaTwin environmental data streams.')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand text-white text-xs font-bold shadow-xs hover:bg-brand-hover transition-colors self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Telemetry</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="rounded-2xl bg-white dark:bg-surface-darkCard border border-surface-border dark:border-surface-darkBorder p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-surface-subtext uppercase">Max 24h Rain</span>
            <div className="p-2 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-brand border border-teal-200 dark:border-teal-800">
              <CloudRain className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-extrabold text-surface-text dark:text-surface-darkText">198.5 mm</div>
          <p className="text-xs text-surface-subtext mt-0.5">Deraniyagala (Kegalle District)</p>
        </div>

        <div className="rounded-2xl bg-white dark:bg-surface-darkCard border border-surface-border dark:border-surface-darkBorder p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-surface-subtext uppercase">Critical River Basins</span>
            <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
              <Waves className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-extrabold text-rose-600 dark:text-rose-400">2 Basins</div>
          <p className="text-xs text-surface-subtext mt-0.5">Kalu Ganga & Kelani Ganga Alert</p>
        </div>

        <div className="rounded-2xl bg-white dark:bg-surface-darkCard border border-surface-border dark:border-surface-darkBorder p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-surface-subtext uppercase">Elevated Risk Zones</span>
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-extrabold text-amber-600 dark:text-amber-400">5 Divisions</div>
          <p className="text-xs text-surface-subtext mt-0.5">High soil saturation & runoff peak</p>
        </div>

        <div className="rounded-2xl bg-white dark:bg-surface-darkCard border border-surface-border dark:border-surface-darkBorder p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-surface-subtext uppercase">Grid Sensor Uptime</span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">95.6%</div>
          <p className="text-xs text-surface-subtext mt-0.5">65 of 68 telemetry stations active</p>
        </div>
      </div>

      {/* Grid: 1. Rainfall Ranking Table & 2. River Discharges Table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rainfall Ranking Table */}
        <div className="rounded-2xl bg-white dark:bg-surface-darkCard border border-surface-border dark:border-surface-darkBorder p-4 shadow-sm space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-surface-border dark:border-surface-darkBorder">
            <div className="flex items-center gap-2">
              <CloudRain className="w-4 h-4 text-brand" />
              <h2 className="text-sm font-bold text-surface-text dark:text-surface-darkText">Precipitation Leaderboard (24h)</h2>
            </div>

            {/* Filter controls */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter station..."
                  value={rainfallSearch}
                  onChange={(e) => setRainfallSearch(e.target.value)}
                  className="pl-8 pr-3 py-1 text-xs rounded-xl bg-slate-50 dark:bg-surface-darkSidebar border border-surface-border dark:border-surface-darkBorder text-surface-text dark:text-surface-darkText focus:outline-none focus:border-brand"
                />
              </div>

              <select
                value={districtFilter}
                onChange={(e) => setDistrictFilter(e.target.value)}
                className="px-2 py-1 text-xs rounded-xl bg-slate-50 dark:bg-surface-darkSidebar border border-surface-border dark:border-surface-darkBorder text-surface-text dark:text-surface-darkText focus:outline-none cursor-pointer font-bold"
              >
                {districts.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-surface-darkSidebar text-surface-subtext uppercase text-[10px] font-bold">
                <tr>
                  <th className="py-2.5 px-3">Location / Station</th>
                  <th className="py-2.5 px-3">District</th>
                  <th className="py-2.5 px-3 text-right">Rainfall (24h)</th>
                  <th className="py-2.5 px-3 text-center">Hazard Level</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border dark:divide-surface-darkBorder">
                {filteredRainfall.map((r, i) => {
                  const badge = getRiskLevelBadge(r.riskLevel);
                  return (
                    <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="py-2.5 px-3 font-bold text-surface-text dark:text-surface-darkText">
                        {r.location}
                      </td>
                      <td className="py-2.5 px-3 text-surface-subtext">
                        {r.district}
                      </td>
                      <td className="py-2.5 px-3 text-right font-extrabold text-brand dark:text-brand-glow">
                        {r.rainfallAmount} {r.unit}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase border ${badge.badgeBg}`}>
                          {r.riskLevel}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* River Flow Discharges Table */}
        <div className="rounded-2xl bg-white dark:bg-surface-darkCard border border-surface-border dark:border-surface-darkBorder p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-surface-border dark:border-surface-darkBorder">
            <div className="flex items-center gap-2">
              <Waves className="w-4 h-4 text-sky-600" />
              <h2 className="text-sm font-bold text-surface-text dark:text-surface-darkText">Major Hydrological River Gauges</h2>
            </div>

            <button
              onClick={() => setRiverSortAsc(!riverSortAsc)}
              className="flex items-center gap-1 text-xs text-brand font-bold hover:underline"
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span>Sort Water Level</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-surface-darkSidebar text-surface-subtext uppercase text-[10px] font-bold">
                <tr>
                  <th className="py-2.5 px-3">River & Station</th>
                  <th className="py-2.5 px-3 text-right">Water Level</th>
                  <th className="py-2.5 px-3 text-right">Flow Rate</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border dark:divide-surface-darkBorder">
                {sortedRivers.map((riv) => {
                  const badge = getRiverStatusBadge(riv.dangerLevel);
                  return (
                    <tr key={riv.riverObservationId} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="py-2.5 px-3">
                        <div className="font-bold text-surface-text dark:text-surface-darkText">{riv.riverName}</div>
                        <div className="text-[11px] text-surface-subtext">Gauge: {riv.stationId.replace('st-', '')}</div>
                      </td>
                      <td className="py-2.5 px-3 text-right font-extrabold text-surface-text dark:text-surface-darkText">
                        {riv.waterLevel} {riv.waterLevelUnit}
                      </td>
                      <td className="py-2.5 px-3 text-right text-surface-subtext">
                        {riv.flowRate} {riv.flowRateUnit}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase border ${badge.color}`}>
                          {badge.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Grid: Elevated Risk Locations & Recent Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Elevated Flood-Risk Locations List */}
        <div className="rounded-2xl bg-white dark:bg-surface-darkCard border border-surface-border dark:border-surface-darkBorder p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-surface-border dark:border-surface-darkBorder">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              <h2 className="text-sm font-bold text-surface-text dark:text-surface-darkText">Elevated Flood-Risk Catchments</h2>
            </div>
            <span className="text-[10px] font-bold text-surface-subtext uppercase">AI Assessment</span>
          </div>

          <div className="space-y-2.5">
            {MOCK_ELEVATED_FLOOD_RISK.map((item, idx) => {
              const badge = getRiskLevelBadge(item.riskLevel);
              return (
                <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-surface-darkSidebar border border-surface-border dark:border-surface-darkBorder flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-surface-text dark:text-surface-darkText">{item.location}</span>
                      <span className="text-[11px] text-surface-subtext">({item.district})</span>
                    </div>
                    <p className="text-xs text-surface-subtext mt-0.5 leading-relaxed">{item.explanation}</p>
                    <span className="text-[10px] text-slate-400 mt-1 inline-block">Assessed: {item.assessmentTime}</span>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <div className="text-sm font-extrabold text-surface-text dark:text-surface-darkText">{item.riskScore}/100</div>
                    <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase border ${badge.badgeBg}`}>
                      {item.riskLevel}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Activity Timeline */}
        <div className="rounded-2xl bg-white dark:bg-surface-darkCard border border-surface-border dark:border-surface-darkBorder p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-surface-border dark:border-surface-darkBorder">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-brand" />
              <h2 className="text-sm font-bold text-surface-text dark:text-surface-darkText">Realtime Telemetry Timeline</h2>
            </div>
            <span className="text-[10px] font-bold text-surface-subtext uppercase">Sensor Stream</span>
          </div>

          <div className="space-y-3">
            {MOCK_RECENT_SIGNALS.map((sig) => (
              <div key={sig.id} className="p-3 rounded-xl bg-slate-50 dark:bg-surface-darkSidebar border border-surface-border dark:border-surface-darkBorder">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-surface-text dark:text-surface-darkText">{sig.title}</span>
                  <span className="text-[10px] font-mono font-bold text-brand">{sig.timestamp}</span>
                </div>
                <p className="text-xs text-surface-subtext mt-1">{sig.description}</p>
                <div className="mt-2 pt-1 border-t border-surface-border dark:border-surface-darkBorder flex items-center justify-between text-[11px] text-surface-subtext">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-brand" />
                    <span>{sig.locationName}</span>
                  </span>
                  {sig.value && <strong className="text-surface-text dark:text-surface-darkText">{sig.value}</strong>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
