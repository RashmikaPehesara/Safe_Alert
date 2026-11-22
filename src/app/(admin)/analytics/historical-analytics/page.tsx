'use client';

import React, { useState } from 'react';
import { 
  History, 
  Download, 
  Calendar, 
  Filter, 
  TrendingUp, 
  BarChart3, 
  Layers,
  MapPin
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend 
} from 'recharts';

const DISTRICT_COMPARISON_DATA = [
  { district: 'Ratnapura', floodIncidents: 42, landslideIncidents: 28, maxRain: 210 },
  { district: 'Kalutara', floodIncidents: 38, landslideIncidents: 12, maxRain: 185 },
  { district: 'Galle', floodIncidents: 29, landslideIncidents: 8, maxRain: 160 },
  { district: 'Colombo', floodIncidents: 34, landslideIncidents: 2, maxRain: 145 },
  { district: 'Kegalle', floodIncidents: 18, landslideIncidents: 35, maxRain: 195 },
  { district: 'Kandy', floodIncidents: 12, landslideIncidents: 26, maxRain: 130 },
  { district: 'Nuwara Eliya', floodIncidents: 6, landslideIncidents: 31, maxRain: 140 },
  { district: 'Matara', floodIncidents: 22, landslideIncidents: 9, maxRain: 150 },
];

const HISTORICAL_YEARLY_TRENDS = [
  { year: '2020', floodEvents: 145, landslideEvents: 68, damagesMn: 820 },
  { year: '2021', floodEvents: 168, landslideEvents: 84, damagesMn: 1040 },
  { year: '2022', floodEvents: 132, landslideEvents: 52, damagesMn: 680 },
  { year: '2023', floodEvents: 188, landslideEvents: 96, damagesMn: 1250 },
  { year: '2024', floodEvents: 195, landslideEvents: 110, damagesMn: 1420 },
  { year: '2025', floodEvents: 210, landslideEvents: 124, damagesMn: 1580 },
  { year: '2026 (YTD)', floodEvents: 164, landslideEvents: 88, damagesMn: 1120 },
];

export default function HistoricalAnalyticsPage() {
  const [selectedDisaster, setSelectedDisaster] = useState('ALL');
  const [selectedPeriod, setSelectedPeriod] = useState('5Y');

  // Working CSV Export handler
  const handleExportCSV = () => {
    const headers = ['District', 'Flood Incidents', 'Landslide Incidents', 'Max Rainfall (mm)'];
    const rows = DISTRICT_COMPARISON_DATA.map(d => [d.district, d.floodIncidents, d.landslideIncidents, d.maxRain]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SafeAlert_Historical_Disaster_Data_${selectedPeriod}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-surface-border dark:border-surface-darkBorder">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold tracking-tight text-surface-text dark:text-surface-darkText flex items-center gap-2">
            <span>Historical Disaster Analytics & Multi-Year Trends</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-brand border border-teal-200 dark:bg-teal-950 dark:text-brand-glow">
              Archive Telemetry
            </span>
          </h1>
          <p className="text-xs text-surface-subtext mt-0.5">
            Decadal climatological correlations, district-wise incident distributions, and catchment flood frequency analysis.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Working CSV Export Button */}
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand hover:bg-brand-hover text-white text-xs font-bold shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Dataset (CSV)</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-3.5 rounded-2xl bg-white dark:bg-surface-darkCard border border-surface-border dark:border-surface-darkBorder shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-brand" />
          <span className="font-bold text-surface-text dark:text-surface-darkText">Filter Dimensions:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="text-surface-subtext">Hazard Type:</span>
            <select
              value={selectedDisaster}
              onChange={(e) => setSelectedDisaster(e.target.value)}
              className="px-2.5 py-1 text-xs font-bold rounded-xl bg-slate-50 dark:bg-surface-darkSidebar border border-surface-border dark:border-surface-darkBorder text-surface-text dark:text-surface-darkText focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Categories</option>
              <option value="FLOOD">Floods</option>
              <option value="LANDSLIDE">Landslides</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-surface-subtext">Time Horizon:</span>
            <div className="flex items-center p-0.5 rounded-lg bg-slate-100 dark:bg-surface-darkSidebar border border-surface-border dark:border-surface-darkBorder text-xs font-bold">
              {['1Y', '3Y', '5Y', '10Y'].map((p) => (
                <button
                  key={p}
                  onClick={() => setSelectedPeriod(p)}
                  className={`px-2.5 py-0.5 rounded-md transition-colors ${selectedPeriod === p ? 'bg-brand text-white' : 'text-surface-subtext'}`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Chart 1: District Comparison Bar Chart */}
      <div className="rounded-2xl bg-white dark:bg-surface-darkCard border border-surface-border dark:border-surface-darkBorder p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-surface-border dark:border-surface-darkBorder">
          <div>
            <h2 className="text-sm font-bold text-surface-text dark:text-surface-darkText">District-wise Cumulative Flood vs Landslide Occurrence</h2>
            <p className="text-xs text-surface-subtext">Comparing vulnerability indices across high-risk districts ({selectedPeriod} window).</p>
          </div>
          <span className="text-[10px] font-bold text-surface-subtext uppercase">Comparative Bar Chart</span>
        </div>

        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={DISTRICT_COMPARISON_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="district" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} />
              <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }} />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
              <Bar dataKey="floodIncidents" name="Flood Inundations" fill="#0F766E" radius={[4, 4, 0, 0]} />
              <Bar dataKey="landslideIncidents" name="Landslide Hazard Events" fill="#EA580C" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 2: Annual Trend Line Chart */}
      <div className="rounded-2xl bg-white dark:bg-surface-darkCard border border-surface-border dark:border-surface-darkBorder p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-surface-border dark:border-surface-darkBorder">
          <div>
            <h2 className="text-sm font-bold text-surface-text dark:text-surface-darkText">Annual Multi-Hazard Progression Curve (2020 – 2026)</h2>
            <p className="text-xs text-surface-subtext">Progression of recorded national extreme events and estimated infrastructural impact (LKR Millions).</p>
          </div>
          <span className="text-[10px] font-bold text-surface-subtext uppercase">Trend Progression</span>
        </div>

        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={HISTORICAL_YEARLY_TRENDS}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="year" stroke="#64748b" fontSize={11} />
              <YAxis yAxisId="left" stroke="#0F766E" fontSize={11} label={{ value: 'Incident Count', angle: -90, position: 'insideLeft', style: { fill: '#0F766E', fontSize: 10 } }} />
              <YAxis yAxisId="right" orientation="right" stroke="#DC2626" fontSize={11} label={{ value: 'Est. Impact (LKR Mn)', angle: 90, position: 'insideRight', style: { fill: '#DC2626', fontSize: 10 } }} />
              <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }} />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
              <Line yAxisId="left" type="monotone" dataKey="floodEvents" name="Recorded Flood Events" stroke="#0F766E" strokeWidth={2.5} dot={{ r: 4 }} />
              <Line yAxisId="left" type="monotone" dataKey="landslideEvents" name="Recorded Landslides" stroke="#D97706" strokeWidth={2.5} dot={{ r: 4 }} />
              <Line yAxisId="right" type="monotone" dataKey="damagesMn" name="Economic Impact (LKR Mn)" stroke="#DC2626" strokeWidth={2} strokeDasharray="5 5" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
