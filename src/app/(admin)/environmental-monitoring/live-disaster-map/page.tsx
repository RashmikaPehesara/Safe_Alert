'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { 
  Filter, 
  MapPin, 
  ShieldAlert, 
  Layers, 
  Search, 
  Compass, 
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import SriLankaLiveMap from '@/components/dashboard/SriLankaLiveMap';
import { SRI_LANKA_LOCATIONS } from '@/services/mock-data/sri-lanka-data';
import { useMapStore } from '@/store/map.store';

export default function LiveDisasterMapPage() {
  const { selectLocation, activeLayers, toggleLayer } = useMapStore();
  const [selectedDisasterType, setSelectedDisasterType] = useState('ALL');
  const [selectedDistrict, setSelectedDistrict] = useState('ALL');

  const districts = ['ALL', 'Badulla', 'Colombo', 'Ratnapura', 'Kandy', 'Galle', 'Kalutara', 'Kegalle', 'Nuwara Eliya', 'Matara', 'Jaffna', 'Trincomalee'];

  const handleDistrictChange = (dist: string) => {
    setSelectedDistrict(dist);
    if (dist !== 'ALL') {
      const loc = SRI_LANKA_LOCATIONS.find(l => l.district.toLowerCase() === dist.toLowerCase());
      if (loc) {
        selectLocation(loc);
      }
    }
  };

  return (
    <div className="space-y-4 pb-12 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-surface-border dark:border-surface-darkBorder">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold tracking-tight text-surface-text dark:text-surface-darkText flex items-center gap-2">
            <span>National Live GIS Disaster Map</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-brand border border-teal-200 dark:bg-teal-950 dark:text-brand-glow">
              High-Precision GIS
            </span>
          </h1>
          <p className="text-xs text-surface-subtext mt-0.5">
            Full-screen geospatial intelligence dashboard combining weather telemetry, river stage alerts, and NBRO landslide hazard zones.
          </p>
        </div>

        {/* Quick Filter Bar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Disaster Type Filter */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-surface-darkCard border border-surface-border dark:border-surface-darkBorder text-xs shadow-xs">
            <Filter className="w-3.5 h-3.5 text-brand" />
            <select
              value={selectedDisasterType}
              onChange={(e) => setSelectedDisasterType(e.target.value)}
              className="bg-transparent text-xs font-bold text-surface-text dark:text-surface-darkText focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Hazard Vectors</option>
              <option value="FLOOD">Floods Only</option>
              <option value="LANDSLIDE">Landslides Only</option>
              <option value="STORM">Storm Warnings Only</option>
            </select>
          </div>

          {/* District Selector Filter */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-surface-darkCard border border-surface-border dark:border-surface-darkBorder text-xs shadow-xs">
            <MapPin className="w-3.5 h-3.5 text-brand" />
            <select
              value={selectedDistrict}
              onChange={(e) => handleDistrictChange(e.target.value)}
              className="bg-transparent text-xs font-bold text-surface-text dark:text-surface-darkText focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Districts</option>
              {districts.filter(d => d !== 'ALL').map(d => (
                <option key={d} value={d}>{d} District</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Full Dedicated Live Map */}
      <div className="h-[750px] w-full rounded-2xl overflow-hidden shadow-sm border border-surface-border dark:border-surface-darkBorder">
        <SriLankaLiveMap />
      </div>

      {/* Disaster Intelligence Map Legend & Operational Notes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        <div className="p-3.5 rounded-xl bg-white dark:bg-surface-darkCard border border-surface-border dark:border-surface-darkBorder shadow-xs space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-bold text-surface-text dark:text-surface-darkText">
            <span className="w-3 h-3 rounded-full bg-red-600 inline-block animate-ping" />
            <span>Active Flood Inundation Zones</span>
          </div>
          <p className="text-xs text-surface-subtext">
            Dashed red radius highlights low-lying alluvial plains in Ratnapura and Kalutara with upstream gauge breaches.
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-surface-darkCard border border-surface-border dark:border-surface-darkBorder shadow-xs space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-bold text-surface-text dark:text-surface-darkText">
            <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
            <span>NBRO Landslide Hazard Markers</span>
          </div>
          <p className="text-xs text-surface-subtext">
            Amber and red mountain indicators designate Level 2 (Amber) and Level 3 (Evacuate) mountain escarpments.
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-surface-darkCard border border-surface-border dark:border-surface-darkBorder shadow-xs space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-bold text-surface-text dark:text-surface-darkText">
            <span className="w-3 h-3 rounded-full bg-rose-600 inline-block" />
            <span>SOS Help Request Beacons</span>
          </div>
          <p className="text-xs text-surface-subtext">
            Civilian distress signals verified by Disaster Management Centre emergency dispatchers.
          </p>
        </div>
      </div>
    </div>
  );
}
