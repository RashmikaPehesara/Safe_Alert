'use client';

import React, { useState } from 'react';
import { 
  Waves, 
  CloudRain, 
  Activity, 
  Calendar, 
  Filter, 
  Search, 
  ArrowUpDown,
  Download,
  AlertTriangle,
  Clock,
  Radio
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend 
} from 'recharts';
import { MOCK_RIVER_OBSERVATIONS, MOCK_HIGHEST_RAINFALL } from '@/services/mock-data/sri-lanka-data';
import { getRiverStatusBadge, getRiskLevelBadge } from '@/utils/risk-colors';

// Sample 7-day historical telemetry data for rivers & precipitation
const HISTORICAL_HYDRO_DATA = [
  { date: '15 Nov', kaluLevel: 4.8, kelaniLevel: 5.2, ginLevel: 3.1, rainfall: 45 },
  { date: '16 Nov', kaluLevel: 5.2, kelaniLevel: 5.8, ginLevel: 3.3, rainfall: 68 },
  { date: '17 Nov', kaluLevel: 5.9, kelaniLevel: 6.4, ginLevel: 3.6, rainfall: 92 },
  { date: '18 Nov', kaluLevel: 6.3, kelaniLevel: 7.1, ginLevel: 3.8, rainfall: 120 },
  { date: '19 Nov', kaluLevel: 6.8, kelaniLevel: 7.9, ginLevel: 4.0, rainfall: 154 },
  { date: '20 Nov', kaluLevel: 7.0, kelaniLevel: 8.4, ginLevel: 4.1, rainfall: 180 },
  { date: '21 Nov', kaluLevel: 7.12, kelaniLevel: 8.95, ginLevel: 4.22, rainfall: 198.5 },
];

export default function RiverRainfallMonitoringPage() {
  const [selectedRiverFilter, setSelectedRiverFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'rivers' | 'rainfall' | 'historical'>('rivers');

  // Filter rivers
  const filteredRivers = MOCK_RIVER_OBSERVATIONS.filter((r) => {
    const matchesRiver = selectedRiverFilter === 'ALL' || r.riverName.toLowerCase().includes(selectedRiverFilter.toLowerCase());
    const matchesSearch = r.riverName.toLowerCase().includes(searchQuery.toLowerCase()) || r.stationId.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRiver && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-12 max-w-[1600px] mx-auto">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-surface-border dark:border-surface-darkBorder">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold tracking-tight text-surface-text dark:text-surface-darkText flex items-center gap-2">
            <span>River & Precipitation Telemetry Grid</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-brand border border-teal-200 dark:bg-teal-950 dark:text-brand-glow">
              Irrigation Department
            </span>
          </h1>
          <p className="text-xs text-surface-subtext mt-0.5">
            Real-time river stage levels, stream discharge flow meters, and rainfall station sensors.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center p-0.5 rounded-xl bg-slate-100 dark:bg-surface-darkSidebar border border-surface-border dark:border-surface-darkBorder text-xs font-bold self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('rivers')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${activeTab === 'rivers' ? 'bg-white dark:bg-surface-darkCard text-brand shadow-xs' : 'text-surface-subtext'}`}
          >
            <Waves className="w-3.5 h-3.5" />
            <span>River Gauges</span>
          </button>
          <button
            onClick={() => setActiveTab('rainfall')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${activeTab === 'rainfall' ? 'bg-white dark:bg-surface-darkCard text-brand shadow-xs' : 'text-surface-subtext'}`}
          >
            <CloudRain className="w-3.5 h-3.5" />
            <span>Rainfall Grid</span>
          </button>
          <button
            onClick={() => setActiveTab('historical')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${activeTab === 'historical' ? 'bg-white dark:bg-surface-darkCard text-brand shadow-xs' : 'text-surface-subtext'}`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Hydro Trends</span>
          </button>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="rounded-2xl bg-white dark:bg-surface-darkCard border border-surface-border dark:border-surface-darkBorder p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-surface-subtext uppercase">Peak Gauge Stage</span>
            <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-extrabold text-rose-600 dark:text-rose-400">8.95 m</div>
          <p className="text-xs text-surface-subtext mt-0.5">Hanwella (Kelani River - Minor Flood)</p>
        </div>

        <div className="rounded-2xl bg-white dark:bg-surface-darkCard border border-surface-border dark:border-surface-darkBorder p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-surface-subtext uppercase">Max Discharge Rate</span>
            <div className="p-2 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-400 border border-sky-200 dark:border-sky-800">
              <Waves className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-extrabold text-surface-text dark:text-surface-darkText">780 m³/s</div>
          <p className="text-xs text-surface-subtext mt-0.5">Kelani Ganga Downstream Velocity</p>
        </div>

        <div className="rounded-2xl bg-white dark:bg-surface-darkCard border border-surface-border dark:border-surface-darkBorder p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-surface-subtext uppercase">Active Stream Gauges</span>
            <div className="p-2 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-brand border border-teal-200 dark:border-teal-800">
              <Radio className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-extrabold text-brand dark:text-brand-glow">6 Stations</div>
          <p className="text-xs text-surface-subtext mt-0.5">All telemetry nodes communicating</p>
        </div>

        <div className="rounded-2xl bg-white dark:bg-surface-darkCard border border-surface-border dark:border-surface-darkBorder p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-surface-subtext uppercase">Critical Threshold Alert</span>
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-extrabold text-amber-600 dark:text-amber-400">Putupaula (7.12m)</div>
          <p className="text-xs text-surface-subtext mt-0.5">Breached 6.8m Major Flood Datum</p>
        </div>
      </div>

      {/* Tab 1: River Gauges Table */}
      {activeTab === 'rivers' && (
        <div className="rounded-2xl bg-white dark:bg-surface-darkCard border border-surface-border dark:border-surface-darkBorder p-4 shadow-sm space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-surface-border dark:border-surface-darkBorder">
            <div className="flex items-center gap-2">
              <Waves className="w-4 h-4 text-brand" />
              <h2 className="text-sm font-bold text-surface-text dark:text-surface-darkText">National Hydrological Gauge Network</h2>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search river or station..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-surface-darkSidebar border border-surface-border dark:border-surface-darkBorder text-surface-text dark:text-surface-darkText focus:outline-none focus:border-brand"
                />
              </div>

              <select
                value={selectedRiverFilter}
                onChange={(e) => setSelectedRiverFilter(e.target.value)}
                className="px-2.5 py-1.5 text-xs font-bold rounded-xl bg-slate-50 dark:bg-surface-darkSidebar border border-surface-border dark:border-surface-darkBorder text-surface-text dark:text-surface-darkText focus:outline-none cursor-pointer"
              >
                <option value="ALL">All River Basins</option>
                <option value="Kelani">Kelani Ganga</option>
                <option value="Kalu">Kalu Ganga</option>
                <option value="Gin">Gin Ganga</option>
                <option value="Nilwala">Nilwala Ganga</option>
                <option value="Mahaweli">Mahaweli Ganga</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-surface-darkSidebar text-surface-subtext uppercase text-[10px] font-bold">
                <tr>
                  <th className="py-2.5 px-3">River Name</th>
                  <th className="py-2.5 px-3">Station Name & ID</th>
                  <th className="py-2.5 px-3 text-right">Water Level</th>
                  <th className="py-2.5 px-3 text-right">Flow Rate</th>
                  <th className="py-2.5 px-3 text-center">Flood Stage</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                  <th className="py-2.5 px-3 text-right">Observed At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border dark:divide-surface-darkBorder">
                {filteredRivers.map((riv) => {
                  const badge = getRiverStatusBadge(riv.dangerLevel);
                  return (
                    <tr key={riv.riverObservationId} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="py-2.5 px-3 font-bold text-surface-text dark:text-surface-darkText">
                        {riv.riverName}
                      </td>
                      <td className="py-2.5 px-3 text-surface-subtext font-medium">
                        {riv.stationId.replace('st-', '').toUpperCase()} ({riv.stationId})
                      </td>
                      <td className="py-2.5 px-3 text-right font-extrabold text-surface-text dark:text-surface-darkText">
                        {riv.waterLevel} {riv.waterLevelUnit}
                      </td>
                      <td className="py-2.5 px-3 text-right font-semibold text-surface-subtext">
                        {riv.flowRate} {riv.flowRateUnit}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase border ${badge.color}`}>
                          {badge.label}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          {riv.dataStatus}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right text-surface-subtext">
                        {riv.observedAt.split('T')[1].slice(0, 5)} SLST
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Rainfall Grid Table */}
      {activeTab === 'rainfall' && (
        <div className="rounded-2xl bg-white dark:bg-surface-darkCard border border-surface-border dark:border-surface-darkBorder p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-surface-border dark:border-surface-darkBorder">
            <div className="flex items-center gap-2">
              <CloudRain className="w-4 h-4 text-brand" />
              <h2 className="text-sm font-bold text-surface-text dark:text-surface-darkText">National Automated Rainfall Station Grid</h2>
            </div>
            <span className="text-xs text-surface-subtext font-bold">Past 24 Hours Observations</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-surface-darkSidebar text-surface-subtext uppercase text-[10px] font-bold">
                <tr>
                  <th className="py-2.5 px-3">Telemetry Station</th>
                  <th className="py-2.5 px-3">District</th>
                  <th className="py-2.5 px-3 text-right">Precipitation (24h)</th>
                  <th className="py-2.5 px-3 text-center">Precipitation Intensity</th>
                  <th className="py-2.5 px-3 text-center">Hazard Warning</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border dark:divide-surface-darkBorder">
                {MOCK_HIGHEST_RAINFALL.map((item, idx) => {
                  const badge = getRiskLevelBadge(item.riskLevel);
                  return (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="py-2.5 px-3 font-bold text-surface-text dark:text-surface-darkText">
                        {item.location} Central Sensor
                      </td>
                      <td className="py-2.5 px-3 text-surface-subtext font-medium">
                        {item.district} District
                      </td>
                      <td className="py-2.5 px-3 text-right font-extrabold text-brand dark:text-brand-glow">
                        {item.rainfallAmount} {item.unit}
                      </td>
                      <td className="py-2.5 px-3 text-center font-semibold text-surface-subtext">
                        {item.rainfallAmount > 150 ? 'Torrential (>150mm)' : item.rainfallAmount > 100 ? 'Heavy Rainfall' : 'Moderate'}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase border ${badge.badgeBg}`}>
                          {item.riskLevel}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Historical Hydro Trends & Dual Chart */}
      {activeTab === 'historical' && (
        <div className="rounded-2xl bg-white dark:bg-surface-darkCard border border-surface-border dark:border-surface-darkBorder p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-surface-border dark:border-surface-darkBorder">
            <div>
              <h2 className="text-sm font-bold text-surface-text dark:text-surface-darkText">7-Day Hydrological River Gauge Curves vs Precipitation Surge</h2>
              <p className="text-xs text-surface-subtext mt-0.5">Correlating catchment precipitation bursts with downstream flood stage heights.</p>
            </div>
            <button
              onClick={() => alert('Exporting historical hydrological series CSV...')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-surface-text dark:text-surface-darkText text-xs font-bold hover:bg-slate-200 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-brand" />
              <span>Export Series CSV</span>
            </button>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={HISTORICAL_HYDRO_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
                <YAxis yAxisId="left" stroke="#0F766E" fontSize={11} domain={[2, 10]} label={{ value: 'Water Level (m)', angle: -90, position: 'insideLeft', style: { fill: '#0F766E', fontSize: 10 } }} />
                <YAxis yAxisId="right" orientation="right" stroke="#DC2626" fontSize={11} domain={[0, 250]} label={{ value: 'Rainfall (mm)', angle: 90, position: 'insideRight', style: { fill: '#DC2626', fontSize: 10 } }} />
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Line yAxisId="left" type="monotone" dataKey="kaluLevel" name="Kalu Ganga (Putupaula)" stroke="#0F766E" strokeWidth={2.5} dot={{ r: 3 }} />
                <Line yAxisId="left" type="monotone" dataKey="kelaniLevel" name="Kelani Ganga (Hanwella)" stroke="#0284C7" strokeWidth={2.5} dot={{ r: 3 }} />
                <Line yAxisId="left" type="monotone" dataKey="ginLevel" name="Gin Ganga (Baddegama)" stroke="#D97706" strokeWidth={2} dot={{ r: 3 }} />
                <Line yAxisId="right" type="monotone" dataKey="rainfall" name="Deraniyagala Precipitation (mm)" stroke="#DC2626" strokeWidth={2} strokeDasharray="4 4" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
