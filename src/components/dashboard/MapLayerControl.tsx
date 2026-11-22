'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Layers, Check, ChevronDown } from 'lucide-react';
import { useMapStore } from '@/store/map.store';
import { MapLayerId } from '@/types/dashboard.types';

interface LayerOption {
  id: MapLayerId;
  label: string;
  category: 'weather' | 'disaster' | 'emergency';
  badgeColor: string;
}

const LAYER_OPTIONS: LayerOption[] = [
  { id: 'temperature', label: 'Temperature Badges', category: 'weather', badgeColor: 'bg-amber-500' },
  { id: 'weatherStations', label: 'Weather Stations', category: 'weather', badgeColor: 'bg-teal-500' },
  { id: 'rainfall', label: 'Rainfall Observations', category: 'weather', badgeColor: 'bg-blue-500' },
  { id: 'riverGauges', label: 'River Gauges & Flow', category: 'disaster', badgeColor: 'bg-sky-500' },
  { id: 'floodRisk', label: 'Flood-Risk Zones', category: 'disaster', badgeColor: 'bg-red-500' },
  { id: 'landslideRisk', label: 'Landslide Hazard (NBRO)', category: 'disaster', badgeColor: 'bg-amber-600' },
  { id: 'emergencyAlerts', label: 'Active Emergency Alerts', category: 'emergency', badgeColor: 'bg-rose-500' },
  { id: 'helpRequests', label: 'Pending Help Requests', category: 'emergency', badgeColor: 'bg-pink-600' },
  { id: 'incidentReports', label: 'Community Incidents', category: 'emergency', badgeColor: 'bg-purple-600' },
];

export default function MapLayerControl() {
  const [isOpen, setIsOpen] = useState(false);
  const { activeLayers, toggleLayer, setAllLayers } = useMapStore();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeCount = Object.values(activeLayers).filter(Boolean).length;

  const handleSelectAll = (enable: boolean) => {
    const updated: Record<MapLayerId, boolean> = {
      weatherStations: enable,
      temperature: enable,
      rainfall: enable,
      riverGauges: enable,
      floodRisk: enable,
      landslideRisk: enable,
      emergencyAlerts: enable,
      helpRequests: enable,
      incidentReports: enable,
    };
    setAllLayers(updated);
  };

  return (
    <div ref={dropdownRef} className="relative z-30">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/95 dark:bg-surface-darkSidebar/95 backdrop-blur-md border border-surface-border dark:border-surface-darkBorder text-xs font-bold text-surface-text dark:text-surface-darkText hover:text-brand shadow-md transition-all"
      >
        <Layers className="w-4 h-4 text-brand dark:text-brand-glow" />
        <span>Map Layers</span>
        <span className="px-1.5 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950 text-brand dark:text-brand-glow border border-teal-200 dark:border-teal-800 text-[10px] font-bold">
          {activeCount}
        </span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-surface-darkCard border border-surface-border dark:border-surface-darkBorder rounded-2xl shadow-2xl p-2.5 z-50">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-surface-border dark:border-surface-darkBorder px-1">
            <span className="text-[11px] font-bold text-surface-subtext dark:text-surface-darkSubtext uppercase tracking-wider">
              Telemetry Layers
            </span>
            <div className="flex items-center gap-2 text-[11px] font-semibold">
              <button 
                onClick={() => handleSelectAll(true)}
                className="text-brand hover:underline"
              >
                All
              </button>
              <span className="text-slate-400">·</span>
              <button 
                onClick={() => handleSelectAll(false)}
                className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              >
                Reset
              </button>
            </div>
          </div>

          <div className="space-y-1">
            {LAYER_OPTIONS.map((layer) => {
              const isChecked = activeLayers[layer.id];

              return (
                <button
                  key={layer.id}
                  onClick={() => toggleLayer(layer.id)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-medium transition-colors
                    ${isChecked 
                      ? 'bg-slate-100 dark:bg-slate-800 text-surface-text dark:text-surface-darkText font-semibold' 
                      : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                    }
                  `}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={`w-2.5 h-2.5 rounded-full ${layer.badgeColor}`} />
                    <span>{layer.label}</span>
                  </div>
                  <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors
                    ${isChecked 
                      ? 'bg-brand border-brand text-white' 
                      : 'border-slate-300 dark:border-slate-600 bg-transparent'
                    }
                  `}>
                    {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
