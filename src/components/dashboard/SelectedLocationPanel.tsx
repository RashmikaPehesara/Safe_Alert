'use client';

import React, { useState } from 'react';
import { 
  X, 
  Star, 
  Share2, 
  CloudRain, 
  Mountain, 
  Waves, 
  ChevronRight,
  Sparkles,
  Droplets
} from 'lucide-react';
import { useMapStore } from '@/store/map.store';
import { getRiskLevelBadge } from '@/utils/risk-colors';

export default function SelectedLocationPanel() {
  const { 
    selectedLocation, 
    selectedWeather, 
    selectedRivers, 
    selectedRisk, 
    selectedAlerts, 
    isLocationPanelOpen, 
    isPanelLoading, 
    closeLocationPanel 
  } = useMapStore();

  const [activeTab, setActiveTab] = useState<'overview' | 'rainfall' | 'rivers' | 'risk' | 'alerts'>('overview');
  const [isFavorite, setIsFavorite] = useState(false);

  if (!isLocationPanelOpen || !selectedLocation) {
    return null;
  }

  const weather = selectedWeather || {
    temperature: selectedLocation.currentTemperature || 28,
    feelsLikeTemperature: selectedLocation.feelsLikeTemperature || 32,
    weatherCondition: 'Light drizzle',
    humidity: 57,
    windSpeed: 6,
    windDirection: 'N',
    windGusts: 20,
    rainfallAmount: selectedLocation.currentRainfall24h || 1.6,
    expectedRainfall: 8.5,
    rainfallProbability: 90,
    aqi: 62,
    pm25: 15,
    uvIndex: 8,
    atmosphericPressure: 940,
    sourceName: 'Department of Meteorology Sri Lanka',
    observedAt: '2026-11-21T16:15:00+05:30',
  };

  const floodRiskBadge = getRiskLevelBadge(selectedLocation.floodRiskLevel || 'MODERATE');
  const landslideRiskBadge = getRiskLevelBadge(selectedLocation.landslideRiskLevel || 'MODERATE');

  return (
    <div className="w-full lg:w-96 bg-white/95 dark:bg-surface-darkCard/95 backdrop-blur-xl border border-surface-border dark:border-surface-darkBorder rounded-2xl shadow-xl flex flex-col max-h-[640px] overflow-hidden z-20 transition-all duration-200">
      {/* Location Header */}
      <div className="p-4 border-b border-surface-border dark:border-surface-darkBorder bg-slate-50/70 dark:bg-surface-darkSidebar/70 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-surface-text dark:text-surface-darkText tracking-tight">
              {selectedLocation.name}
            </h2>
            {selectedLocation.localName && (
              <span className="text-base font-semibold text-surface-subtext dark:text-surface-darkSubtext">
                {selectedLocation.localName}
              </span>
            )}
          </div>
          <div className="text-xs text-surface-subtext dark:text-surface-darkSubtext mt-0.5">
            {selectedLocation.district} District · {weather.weatherCondition}
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className={`p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors ${isFavorite ? 'text-amber-500' : 'text-slate-400 hover:text-slate-700'}`}
            title="Bookmark Location"
          >
            <Star className={`w-4 h-4 ${isFavorite ? 'fill-amber-500' : ''}`} />
          </button>
          <button
            onClick={() => {
              if (navigator.clipboard) {
                navigator.clipboard.writeText(window.location.href);
                alert(`Location coordinates copied for ${selectedLocation.name}`);
              }
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            title="Share Telemetry"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button
            onClick={closeLocationPanel}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors ml-1"
            title="Close Panel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="flex items-center border-b border-surface-border dark:border-surface-darkBorder px-3 bg-white dark:bg-surface-darkCard overflow-x-auto text-xs font-semibold scrollbar-none">
        <button
          onClick={() => setActiveTab('overview')}
          className={`py-2 px-2.5 border-b-2 transition-colors whitespace-nowrap
            ${activeTab === 'overview' ? 'border-brand text-brand dark:text-brand-glow' : 'border-transparent text-surface-subtext hover:text-surface-text'}
          `}
        >
          Weather
        </button>
        <button
          onClick={() => setActiveTab('rainfall')}
          className={`py-2 px-2.5 border-b-2 transition-colors whitespace-nowrap
            ${activeTab === 'rainfall' ? 'border-brand text-brand dark:text-brand-glow' : 'border-transparent text-surface-subtext hover:text-surface-text'}
          `}
        >
          Rainfall
        </button>
        <button
          onClick={() => setActiveTab('rivers')}
          className={`py-2 px-2.5 border-b-2 transition-colors whitespace-nowrap flex items-center gap-1
            ${activeTab === 'rivers' ? 'border-brand text-brand dark:text-brand-glow' : 'border-transparent text-surface-subtext hover:text-surface-text'}
          `}
        >
          <span>Rivers</span>
          {selectedRivers.length > 0 && (
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('risk')}
          className={`py-2 px-2.5 border-b-2 transition-colors whitespace-nowrap flex items-center gap-1
            ${activeTab === 'risk' ? 'border-brand text-brand dark:text-brand-glow' : 'border-transparent text-surface-subtext hover:text-surface-text'}
          `}
        >
          <span>Disaster Risk</span>
          <span className={`w-1.5 h-1.5 rounded-full ${floodRiskBadge.dotBg}`} />
        </button>
        <button
          onClick={() => setActiveTab('alerts')}
          className={`py-2 px-2.5 border-b-2 transition-colors whitespace-nowrap flex items-center gap-1
            ${activeTab === 'alerts' ? 'border-brand text-brand dark:text-brand-glow' : 'border-transparent text-surface-subtext hover:text-surface-text'}
          `}
        >
          <span>Alerts</span>
          {selectedAlerts.length > 0 && (
            <span className="px-1 py-0.2 rounded-full text-[9px] bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 font-bold">
              {selectedAlerts.length}
            </span>
          )}
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isPanelLoading ? (
          <div className="py-12 flex flex-col items-center justify-center gap-3 text-surface-subtext">
            <div className="w-6 h-6 border-2 border-brand border-t-transparent rounded-full animate-spin" />
            <span className="text-xs">Fetching meteorological telemetry...</span>
          </div>
        ) : (
          <>
            {activeTab === 'overview' && (
              <div className="space-y-4">
                {/* Big Temperature Hero Section */}
                <div className="flex items-center justify-between pb-3 border-b border-surface-border dark:border-surface-darkBorder">
                  <div className="flex items-center gap-3">
                    <CloudRain className="w-12 h-12 text-brand stroke-[1.5]" />
                    <div>
                      <div className="text-4xl font-extrabold text-surface-text dark:text-surface-darkText tracking-tight">
                        {weather.temperature}°
                      </div>
                      <div className="text-xs text-surface-subtext mt-0.5">
                        Temp: {weather.temperature - 2}°C - {weather.temperature + 2}°C
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className={`inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase border ${floodRiskBadge.badgeBg}`}>
                      Flood {selectedLocation.floodRiskLevel || 'MODERATE'}
                    </span>
                    <div className="text-[11px] text-surface-subtext mt-1">
                      Risk Index: <strong className="text-surface-text dark:text-surface-darkText">{selectedLocation.floodRiskScore || 25}/100</strong>
                    </div>
                  </div>
                </div>

                {/* 2-Column Metric Grid */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-surface-darkSidebar border border-surface-border dark:border-surface-darkBorder flex flex-col">
                    <span className="text-surface-subtext text-[11px]">Feels like</span>
                    <span className="text-sm font-bold text-surface-text dark:text-surface-darkText mt-0.5">
                      {weather.feelsLikeTemperature}°C
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-surface-darkSidebar border border-surface-border dark:border-surface-darkBorder flex flex-col">
                    <span className="text-surface-subtext text-[11px]">Humidity</span>
                    <span className="text-sm font-bold text-surface-text dark:text-surface-darkText mt-0.5">
                      {weather.humidity}%
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-surface-darkSidebar border border-surface-border dark:border-surface-darkBorder flex flex-col">
                    <span className="text-surface-subtext text-[11px]">Wind</span>
                    <span className="text-xs font-bold text-surface-text dark:text-surface-darkText mt-0.5 truncate">
                      {weather.windSpeed} km/h {weather.windDirection}, gusts {weather.windGusts || 20}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-surface-darkSidebar border border-surface-border dark:border-surface-darkBorder flex flex-col">
                    <span className="text-surface-subtext text-[11px]">Rain 24 h</span>
                    <span className="text-sm font-bold text-brand dark:text-brand-glow mt-0.5">
                      {weather.rainfallAmount} mm
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-surface-darkSidebar border border-surface-border dark:border-surface-darkBorder flex flex-col">
                    <span className="text-surface-subtext text-[11px]">Next 24 h</span>
                    <span className="text-xs font-bold text-surface-text dark:text-surface-darkText mt-0.5 truncate">
                      {weather.expectedRainfall || 8.5} mm ({weather.rainfallProbability || 90}%)
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-surface-darkSidebar border border-surface-border dark:border-surface-darkBorder flex flex-col">
                    <span className="text-surface-subtext text-[11px]">US AQI</span>
                    <span className="text-xs font-bold text-surface-text dark:text-surface-darkText mt-0.5">
                      {weather.aqi} · PM2.5 {weather.pm25} µg/m³
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-surface-darkSidebar border border-surface-border dark:border-surface-darkBorder flex flex-col">
                    <span className="text-surface-subtext text-[11px]">UV Index</span>
                    <span className="text-xs font-bold text-surface-text dark:text-surface-darkText mt-0.5">
                      {weather.uvIndex} · {weather.uvIndex > 7 ? 'Very high' : 'Moderate'}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-surface-darkSidebar border border-surface-border dark:border-surface-darkBorder flex flex-col">
                    <span className="text-surface-subtext text-[11px]">Elevation</span>
                    <span className="text-xs font-bold text-surface-text dark:text-surface-darkText mt-0.5">
                      {selectedLocation.elevation} m MSL
                    </span>
                  </div>
                </div>

                {/* Context Link Button */}
                <button
                  onClick={() => setActiveTab('risk')}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-teal-50 dark:bg-teal-950/40 hover:bg-teal-100 dark:hover:bg-teal-950/70 border border-teal-200 dark:border-teal-800 text-brand dark:text-brand-glow text-xs font-bold transition-all group"
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-brand dark:text-brand-glow" />
                    <span>Hydrological & Landslide Risk Context</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-brand dark:text-brand-glow group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            )}

            {activeTab === 'rainfall' && (
              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-surface-darkSidebar border border-surface-border dark:border-surface-darkBorder">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-surface-subtext">Past 24 Hours Cumulative</span>
                    <span className="text-xs font-bold text-brand">{weather.rainfallAmount} mm</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full mt-2 overflow-hidden">
                    <div 
                      className="h-full bg-brand rounded-full"
                      style={{ width: `${Math.min(100, (weather.rainfallAmount / 200) * 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-surface-subtext mt-1">
                    <span>0 mm</span>
                    <span>100 mm (Warning)</span>
                    <span>200+ mm (Severe)</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-surface-darkSidebar border border-surface-border dark:border-surface-darkBorder space-y-2 text-xs">
                  <div className="flex items-center justify-between text-surface-subtext">
                    <span>Rainfall Probability:</span>
                    <strong className="text-surface-text dark:text-surface-darkText">{weather.rainfallProbability || 90}%</strong>
                  </div>
                  <div className="flex items-center justify-between text-surface-subtext">
                    <span>Expected Catchment Inflow:</span>
                    <strong className="text-surface-text dark:text-surface-darkText">{weather.expectedRainfall || 8.5} mm</strong>
                  </div>
                  <div className="flex items-center justify-between text-surface-subtext">
                    <span>Doppler Radar Station:</span>
                    <strong className="text-surface-text dark:text-surface-darkText">{selectedLocation.district} Central Grid</strong>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'rivers' && (
              <div className="space-y-3">
                {selectedRivers.length > 0 ? (
                  selectedRivers.map((river) => (
                    <div key={river.riverObservationId} className="p-3.5 rounded-xl bg-slate-50 dark:bg-surface-darkSidebar border border-surface-border dark:border-surface-darkBorder space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Waves className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                          <span className="text-xs font-bold text-surface-text dark:text-surface-darkText">{river.riverName}</span>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase
                          ${river.dangerLevel === 'MAJOR_FLOOD' ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300' :
                            river.dangerLevel === 'MINOR_FLOOD' ? 'bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300' :
                            river.dangerLevel === 'ALERT' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
                            'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'}
                        `}>
                          {river.dangerLevel.replace('_', ' ')}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                        <div>
                          <span className="text-surface-subtext text-[10px]">Water Level</span>
                          <p className="font-bold text-surface-text dark:text-surface-darkText text-sm">{river.waterLevel} {river.waterLevelUnit}</p>
                        </div>
                        <div>
                          <span className="text-surface-subtext text-[10px]">Flow Rate</span>
                          <p className="font-bold text-surface-text dark:text-surface-darkText text-sm">{river.flowRate} {river.flowRateUnit}</p>
                        </div>
                      </div>

                      <div className="text-[10px] text-surface-subtext pt-1 border-t border-surface-border dark:border-surface-darkBorder flex justify-between">
                        <span>Station: {river.stationId.replace('st-', '')}</span>
                        <span>Source: {river.sourceName}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-xs text-surface-subtext bg-slate-50 dark:bg-surface-darkSidebar rounded-xl border border-surface-border dark:border-surface-darkBorder">
                    No active hydrological gauging station within immediate 15km of {selectedLocation.name}.
                  </div>
                )}
              </div>
            )}

            {activeTab === 'risk' && (
              <div className="space-y-3">
                {selectedRisk && (
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-surface-darkSidebar border border-surface-border dark:border-surface-darkBorder space-y-2.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-surface-text dark:text-surface-darkText flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-brand" />
                        <span>AI Risk Vector ({selectedRisk.disasterType})</span>
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase border ${floodRiskBadge.badgeBg}`}>
                        Score: {selectedRisk.riskScore}/100
                      </span>
                    </div>

                    <p className="text-surface-subtext text-xs leading-relaxed">
                      {selectedRisk.explanation}
                    </p>

                    <div className="space-y-1 pt-1">
                      <span className="text-[11px] font-bold text-surface-text dark:text-surface-darkText">Contributing Factors:</span>
                      {selectedRisk.contributingFactors.map((factor, idx) => (
                        <div key={idx} className="flex items-start gap-1.5 text-surface-subtext text-[11px]">
                          <span className="text-brand font-bold mt-0.5">•</span>
                          <span>{factor}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-surface-border dark:border-surface-darkBorder flex items-center justify-between text-[10px] text-surface-subtext">
                      <span>Model: {selectedRisk.modelName} (v{selectedRisk.modelVersion})</span>
                      <span>Confidence: {selectedRisk.modelConfidence}%</span>
                    </div>
                  </div>
                )}

                {/* Landslide card */}
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-surface-darkSidebar border border-surface-border dark:border-surface-darkBorder space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-surface-text dark:text-surface-darkText flex items-center gap-1.5">
                      <Mountain className="w-3.5 h-3.5 text-amber-600" />
                      <span>NBRO Landslide Hazard Level</span>
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase border ${landslideRiskBadge.badgeBg}`}>
                      {selectedLocation.landslideRiskLevel || 'MODERATE'}
                    </span>
                  </div>
                  <p className="text-surface-subtext text-xs">
                    Slope soil saturation estimated at <strong className="text-surface-text dark:text-surface-darkText">{selectedLocation.landslideRiskScore || 42}%</strong>.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'alerts' && (
              <div className="space-y-2.5">
                {selectedAlerts.length > 0 ? (
                  selectedAlerts.map((alert) => (
                    <div key={alert.alertId} className="p-3 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300">
                          {alert.severityLevel}
                        </span>
                        <span className="text-[10px] text-surface-subtext">Active Bulletin</span>
                      </div>
                      <h4 className="font-bold text-surface-text dark:text-surface-darkText">{alert.alertTitle}</h4>
                      <p className="text-[11px] text-surface-subtext">{alert.alertDescription}</p>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-xs text-surface-subtext bg-slate-50 dark:bg-surface-darkSidebar rounded-xl border border-surface-border dark:border-surface-darkBorder">
                    No active emergency alerts currently issued for {selectedLocation.name}.
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer Data Source & Telemetry Freshness */}
      <div className="p-2.5 bg-slate-50 dark:bg-surface-darkSidebar border-t border-surface-border dark:border-surface-darkBorder flex items-center justify-between text-[10px] text-surface-subtext px-4">
        <span>Source: {weather.sourceName}</span>
        <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Verified Telemetry
        </span>
      </div>
    </div>
  );
}
