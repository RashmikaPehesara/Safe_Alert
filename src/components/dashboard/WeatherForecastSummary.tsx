'use client';

import React, { useState } from 'react';
import { 
  CloudSun, 
  CloudRain, 
  Sun, 
  Droplets, 
  MapPin
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { useMapStore } from '@/store/map.store';
import { getForecastForLocation } from '@/services/mock-data/sri-lanka-data';

export default function WeatherForecastSummary() {
  const { locations, selectedLocation, selectLocation } = useMapStore();
  const [selectedLocId, setSelectedLocId] = useState<string>(selectedLocation?.locationId || 'loc-badulla');

  const activeLoc = locations.find(l => l.locationId === selectedLocId) || locations[0];
  const forecasts = getForecastForLocation(activeLoc.locationId);

  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const locId = e.target.value;
    setSelectedLocId(locId);
    const loc = locations.find(l => l.locationId === locId);
    if (loc) {
      selectLocation(loc);
    }
  };

  const chartData = forecasts.map(f => ({
    day: f.forecastDate.split('-').slice(1).join('/'),
    tempMax: f.temperatureMax,
    tempMin: f.temperatureMin,
    rainProb: f.rainfallProbability,
  }));

  const getWeatherIcon = (condition: string) => {
    if (condition.toLowerCase().includes('rain') || condition.toLowerCase().includes('drizzle')) {
      return <CloudRain className="w-5 h-5 text-brand" />;
    }
    if (condition.toLowerCase().includes('mist') || condition.toLowerCase().includes('cloud')) {
      return <CloudSun className="w-5 h-5 text-amber-500" />;
    }
    return <Sun className="w-5 h-5 text-amber-500" />;
  };

  return (
    <div className="rounded-2xl bg-white dark:bg-surface-darkCard border border-surface-border dark:border-surface-darkBorder p-4 shadow-sm space-y-3.5">
      {/* Header & Location Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-surface-border dark:border-surface-darkBorder">
        <div>
          <h3 className="text-sm font-bold text-surface-text dark:text-surface-darkText tracking-tight flex items-center gap-2">
            <span>7-Day Synoptic Weather Outlook</span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              Department of Meteorology
            </span>
          </h3>
          <p className="text-xs text-surface-subtext mt-0.5">
            Temperature trends and precipitation probabilities for selected district.
          </p>
        </div>

        {/* Location Dropdown */}
        <div className="relative">
          <div className="flex items-center gap-2 bg-slate-50 dark:bg-surface-darkSidebar border border-surface-border dark:border-surface-darkBorder rounded-xl px-2.5 py-1.5 text-xs text-surface-text dark:text-surface-darkText">
            <MapPin className="w-3.5 h-3.5 text-brand" />
            <select
              value={selectedLocId}
              onChange={handleLocationChange}
              className="bg-transparent border-none text-surface-text dark:text-surface-darkText focus:outline-none cursor-pointer pr-4 font-bold text-xs"
            >
              {locations.map((loc) => (
                <option key={loc.locationId} value={loc.locationId} className="bg-white dark:bg-surface-darkCard text-surface-text dark:text-surface-darkText">
                  {loc.name} ({loc.district})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Mini Trend Area Chart */}
      <div className="h-32 w-full pt-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
            <defs>
              <linearGradient id="tempGradientLight" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0F766E" stopOpacity={0.25}/>
                <stop offset="95%" stopColor="#0F766E" stopOpacity={0.0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="day" stroke="#94a3b8" fontSize={10} tickLine={false} />
            <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} domain={['dataMin - 2', 'dataMax + 2']} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#FFFFFF',
                borderColor: '#E2E8F0',
                borderRadius: '8px',
                fontSize: '11px',
                color: '#172033',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
            />
            <Area 
              type="monotone" 
              dataKey="tempMax" 
              name="Max Temp (°C)"
              stroke="#0F766E" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#tempGradientLight)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* 7-Day Forecast Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
        {forecasts.map((f, i) => (
          <div
            key={f.forecastId}
            className={`p-2.5 rounded-xl border flex flex-col items-center text-center transition-all
              ${i === 0 
                ? 'bg-teal-50/70 border-teal-300 dark:bg-teal-950/40 dark:border-teal-800 shadow-xs' 
                : 'bg-slate-50 dark:bg-surface-darkSidebar border-surface-border dark:border-surface-darkBorder'
              }
            `}
          >
            <span className="text-[11px] font-bold text-surface-subtext">
              {i === 0 ? 'Today' : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][(new Date(f.forecastDate)).getDay()]}
            </span>

            <div className="my-1.5">
              {getWeatherIcon(f.weatherCondition)}
            </div>

            <div className="text-sm font-extrabold text-surface-text dark:text-surface-darkText">
              {f.temperatureMax}°
            </div>
            <span className="text-[10px] text-surface-subtext">
              Low {f.temperatureMin}°
            </span>

            <div className="mt-1.5 pt-1.5 border-t border-surface-border dark:border-surface-darkBorder w-full flex items-center justify-center gap-1 text-[10px] text-brand dark:text-brand-glow font-bold">
              <Droplets className="w-2.5 h-2.5" />
              <span>{f.rainfallProbability}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
