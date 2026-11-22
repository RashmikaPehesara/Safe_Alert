'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { 
  Plus, 
  Minus, 
  Maximize2, 
  Minimize2, 
  Crosshair, 
  MapPin
} from 'lucide-react';
import MapLayerControl from './MapLayerControl';
import SelectedLocationPanel from './SelectedLocationPanel';
import { useMapStore } from '@/store/map.store';
import { BottomLayerMetric } from '@/types/dashboard.types';

// Dynamic import with ssr: false for Leaflet
const SriLankaLeafletMap = dynamic(() => import('./SriLankaLeafletMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[580px] bg-slate-100 dark:bg-surface-darkCard flex flex-col items-center justify-center gap-3">
      <div className="w-8 h-8 border-3 border-brand border-t-transparent rounded-full animate-spin" />
      <span className="text-xs text-surface-subtext font-semibold">Initializing Sri Lanka GIS Telemetry Map...</span>
    </div>
  ),
});

const BOTTOM_METRICS: { id: BottomLayerMetric; label: string }[] = [
  { id: 'temp', label: 'Temp' },
  { id: 'feels', label: 'Feels' },
  { id: 'rain24h', label: 'Rain 24h' },
  { id: 'next24h', label: 'Next 24h' },
  { id: 'flood', label: 'Flood Risk' },
  { id: 'humidity', label: 'Humidity' },
  { id: 'gusts', label: 'Gusts' },
  { id: 'aqi', label: 'AQI' },
  { id: 'pm25', label: 'PM2.5' },
];

export default function SriLankaLiveMap() {
  const { 
    bottomLayerMetric, 
    setBottomLayerMetric, 
    mapZoom, 
    setMapViewport, 
    mapCenter, 
    resetMapView, 
    isLocationPanelOpen, 
    openLocationPanel,
    selectedLocation 
  } = useMapStore();

  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleZoomIn = () => {
    setMapViewport(mapCenter, Math.min(14, mapZoom + 1));
  };

  const handleZoomOut = () => {
    setMapViewport(mapCenter, Math.max(7, mapZoom - 1));
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <section 
      className={`relative w-full rounded-2xl bg-white dark:bg-surface-darkCard border border-surface-border dark:border-surface-darkBorder shadow-sm overflow-hidden transition-all duration-200
        ${isFullscreen ? 'fixed inset-0 z-50 rounded-none h-screen' : 'h-[640px]'}
      `}
    >
      {/* Top Left Controls: Layers & Center Reset */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
        <MapLayerControl />
        <button
          onClick={resetMapView}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/95 dark:bg-surface-darkSidebar/95 backdrop-blur-md border border-surface-border dark:border-surface-darkBorder text-xs font-bold text-surface-text dark:text-surface-darkText hover:text-brand shadow-md transition-all"
          title="Reset to Sri Lanka Center"
        >
          <Crosshair className="w-3.5 h-3.5 text-brand" />
          <span>Reset View</span>
        </button>
      </div>

      {/* Top Right Controls: Zoom & Fullscreen */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-1.5">
        <div className="bg-white/95 dark:bg-surface-darkSidebar/95 backdrop-blur-md border border-surface-border dark:border-surface-darkBorder rounded-xl p-1 shadow-md flex flex-col gap-1">
          <button
            onClick={handleZoomIn}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:text-brand hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Zoom In"
          >
            <Plus className="w-4 h-4" />
          </button>
          <div className="h-px bg-surface-border dark:bg-surface-darkBorder mx-1" />
          <button
            onClick={handleZoomOut}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:text-brand hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Zoom Out"
          >
            <Minus className="w-4 h-4" />
          </button>
        </div>

        <button
          onClick={toggleFullscreen}
          className="p-2 rounded-xl bg-white/95 dark:bg-surface-darkSidebar/95 backdrop-blur-md border border-surface-border dark:border-surface-darkBorder text-slate-600 dark:text-slate-300 hover:text-brand hover:bg-slate-100 dark:hover:bg-slate-800 shadow-md transition-colors"
          title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Map'}
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Re-open Location Panel Pill (if closed) */}
      {!isLocationPanelOpen && selectedLocation && (
        <button
          onClick={openLocationPanel}
          className="absolute top-16 right-4 z-20 flex items-center gap-2 px-3.5 py-2 rounded-xl bg-brand text-white text-xs font-bold shadow-lg hover:bg-brand-hover transition-all animate-bounce"
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>{selectedLocation.name} Telemetry</span>
        </button>
      )}

      {/* Leaflet Map Layer */}
      <div className="w-full h-full">
        <SriLankaLeafletMap />
      </div>

      {/* Contextual Selected Location Details Panel */}
      <div className="absolute top-4 right-4 bottom-16 z-20 pointer-events-none hidden sm:flex justify-end">
        <div className="pointer-events-auto h-full">
          <SelectedLocationPanel />
        </div>
      </div>

      {/* Bottom Floating Bar: Temperature Legend & Metric Tabs */}
      <div className="absolute bottom-3 left-3 right-3 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        {/* Air Temperature Legend */}
        <div className="pointer-events-auto flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/95 dark:bg-surface-darkSidebar/95 backdrop-blur-md border border-surface-border dark:border-surface-darkBorder text-xs shadow-md">
          <span className="text-[11px] font-bold text-surface-text dark:text-surface-darkText">Air Temp °C</span>
          <div className="flex items-center text-[10px] font-bold text-white shadow-xs">
            <span className="px-1.5 py-0.5 rounded-l bg-blue-600">&lt;20</span>
            <span className="px-1.5 py-0.5 bg-teal-600">20-24</span>
            <span className="px-1.5 py-0.5 bg-emerald-600">24-27</span>
            <span className="px-1.5 py-0.5 bg-amber-500">27-30</span>
            <span className="px-1.5 py-0.5 bg-orange-500">30-33</span>
            <span className="px-1.5 py-0.5 rounded-r bg-red-600">33+</span>
          </div>
        </div>

        {/* Bottom Layer Metric Selector Tabs */}
        <div className="pointer-events-auto flex items-center p-1 rounded-xl bg-white/95 dark:bg-surface-darkSidebar/95 backdrop-blur-md border border-surface-border dark:border-surface-darkBorder shadow-md overflow-x-auto max-w-full">
          {BOTTOM_METRICS.map((metric) => {
            const isSelected = bottomLayerMetric === metric.id;

            return (
              <button
                key={metric.id}
                onClick={() => setBottomLayerMetric(metric.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-all
                  ${isSelected 
                    ? 'bg-brand text-white shadow-xs' 
                    : 'text-surface-subtext hover:text-surface-text hover:bg-slate-100 dark:hover:bg-slate-800'
                  }
                `}
              >
                {metric.label}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
