'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { 
  MapPin, 
  ShieldAlert, 
  Mountain, 
  Layers, 
  Filter, 
  Search, 
  Plus, 
  CheckCircle2, 
  Calendar 
} from 'lucide-react';
import SriLankaLiveMap from '@/components/dashboard/SriLankaLiveMap';
import { SRI_LANKA_LOCATIONS } from '@/services/mock-data/sri-lanka-data';
import { getRiskLevelBadge } from '@/utils/risk-colors';

const MANAGED_RISK_ZONES = [
  { id: 'zone-01', name: 'Kalu Ganga Lower Alluvial Basin', district: 'Kalutara / Ratnapura', type: 'FLOOD', level: 'CRITICAL', areaSqKm: 142.5, lastUpdated: 'Today 14:30', activeAlert: true },
  { id: 'zone-02', name: 'Kelani Ganga Middle Reach - Hanwella', district: 'Colombo / Gampaha', type: 'FLOOD', level: 'HIGH', areaSqKm: 98.0, lastUpdated: 'Today 12:00', activeAlert: true },
  { id: 'zone-03', name: 'Ratnapura Mountain Escarpment', district: 'Ratnapura', type: 'LANDSLIDE', level: 'CRITICAL', areaSqKm: 64.2, lastUpdated: 'Today 10:15', activeAlert: true },
  { id: 'zone-04', name: 'Kegalle - Deraniyagala Valley', district: 'Kegalle', type: 'LANDSLIDE', level: 'CRITICAL', areaSqKm: 55.0, lastUpdated: 'Yesterday 18:00', activeAlert: false },
  { id: 'zone-05', name: 'Gin Ganga Baddegama Catchment', district: 'Galle', type: 'FLOOD', level: 'HIGH', areaSqKm: 88.4, lastUpdated: 'Today 08:30', activeAlert: true },
  { id: 'zone-06', name: 'Nuwara Eliya High Elevation Slopes', district: 'Nuwara Eliya', type: 'LANDSLIDE', level: 'HIGH', areaSqKm: 46.1, lastUpdated: '2 days ago', activeAlert: false },
];

export default function GeographicRiskZonesPage() {
  const [hazardFilter, setHazardFilter] = useState('ALL');
  const [levelFilter, setLevelFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredZones = MANAGED_RISK_ZONES.filter((z) => {
    const matchesHazard = hazardFilter === 'ALL' || z.type === hazardFilter;
    const matchesLevel = levelFilter === 'ALL' || z.level === levelFilter;
    const matchesSearch = z.name.toLowerCase().includes(searchQuery.toLowerCase()) || z.district.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesHazard && matchesLevel && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-12 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-surface-border dark:border-surface-darkBorder">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold tracking-tight text-surface-text dark:text-surface-darkText flex items-center gap-2">
            <span>Geographic Hazard Areas & Risk Zones</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-brand border border-teal-200 dark:bg-teal-950 dark:text-brand-glow">
              GIS Boundary Registry
            </span>
          </h1>
          <p className="text-xs text-surface-subtext mt-0.5">
            Administration of calibrated flood inundation basins, NBRO slope hazard sectors, and administrative evacuation zones.
          </p>
        </div>

        <button
          onClick={() => alert('New Zone Boundary Polygon Creator initialized.')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand hover:bg-brand-hover text-white text-xs font-bold shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Define Custom Risk Zone</span>
        </button>
      </div>

      {/* Map Overview Section */}
      <div className="h-[520px] w-full rounded-2xl overflow-hidden shadow-sm border border-surface-border dark:border-surface-darkBorder">
        <SriLankaLiveMap />
      </div>

      {/* Boundary Management Table */}
      <div className="rounded-2xl bg-white dark:bg-surface-darkCard border border-surface-border dark:border-surface-darkBorder p-4 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-surface-border dark:border-surface-darkBorder">
          <div>
            <h2 className="text-sm font-bold text-surface-text dark:text-surface-darkText">Registered Disaster Hazard Boundaries</h2>
            <p className="text-xs text-surface-subtext mt-0.5">Georeferenced zones used for automated early warning push triggers.</p>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search zone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-surface-darkSidebar border border-surface-border dark:border-surface-darkBorder text-surface-text dark:text-surface-darkText focus:outline-none focus:border-brand"
              />
            </div>

            <select
              value={hazardFilter}
              onChange={(e) => setHazardFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs font-bold rounded-xl bg-slate-50 dark:bg-surface-darkSidebar border border-surface-border dark:border-surface-darkBorder text-surface-text dark:text-surface-darkText focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Hazard Types</option>
              <option value="FLOOD">Flood Zones</option>
              <option value="LANDSLIDE">Landslide Zones</option>
            </select>

            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs font-bold rounded-xl bg-slate-50 dark:bg-surface-darkSidebar border border-surface-border dark:border-surface-darkBorder text-surface-text dark:text-surface-darkText focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Hazard Levels</option>
              <option value="CRITICAL">Critical Only</option>
              <option value="HIGH">High Only</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-surface-darkSidebar text-surface-subtext uppercase text-[10px] font-bold">
              <tr>
                <th className="py-2.5 px-3">Zone Identifier & Name</th>
                <th className="py-2.5 px-3">Hazard Category</th>
                <th className="py-2.5 px-3">District Sector</th>
                <th className="py-2.5 px-3 text-right">Coverage (km²)</th>
                <th className="py-2.5 px-3 text-center">Threat Classification</th>
                <th className="py-2.5 px-3 text-right">Last Calibration</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border dark:divide-surface-darkBorder">
              {filteredZones.map((zone) => {
                const badge = getRiskLevelBadge(zone.level);

                return (
                  <tr key={zone.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-2.5 px-3">
                      <div className="font-bold text-surface-text dark:text-surface-darkText">{zone.name}</div>
                      <div className="text-[10px] text-surface-subtext font-mono">ID: {zone.id}</div>
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-surface-text dark:text-surface-darkText">
                      {zone.type === 'FLOOD' ? '🌊 Inundation Plain' : '⛰️ Slope Stability'}
                    </td>
                    <td className="py-2.5 px-3 text-surface-subtext font-medium">
                      {zone.district}
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-surface-text dark:text-surface-darkText">
                      {zone.areaSqKm} km²
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase border ${badge.badgeBg}`}>
                        {zone.level}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right text-surface-subtext">
                      {zone.lastUpdated}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
