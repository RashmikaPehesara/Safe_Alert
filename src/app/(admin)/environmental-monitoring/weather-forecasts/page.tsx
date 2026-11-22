'use client';

import React, { useState } from 'react';
import { 
  CloudSun, 
  CloudRain, 
  Sun, 
  Droplets, 
  Wind, 
  Compass, 
  Gauge, 
  Eye, 
  Sparkles, 
  MapPin, 
  Search, 
  Calendar,
  Clock
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';
import { SRI_LANKA_LOCATIONS, getObservationForLocation, getForecastForLocation } from '@/services/mock-data/sri-lanka-data';

// Administrative hierarchy for dependent dropdowns
const SRI_LANKA_PROVINCES: Record<string, Record<string, string[]>> = {
  'Western': {
    'Colombo': ['Colombo City', 'Kolonnawa', 'Hanwella', 'Kaduwela', 'Homagama'],
    'Gampaha': ['Gampaha Town', 'Negombo', 'Kelaniya', 'Biyagama', 'Mirigama'],
    'Kalutara': ['Kalutara South', 'Panadura', 'Horana', 'Bulathsinhala', 'Matugama']
  },
  'Central': {
    'Kandy': ['Kandy City', 'Peradeniya', 'Gampola', 'Nawalapitiya', 'Katugastota'],
    'Matale': ['Matale Town', 'Dambulla', 'Sigiriya', 'Ukuwela'],
    'Nuwara Eliya': ['Nuwara Eliya Town', 'Hatton', 'Talawakele', 'Nanu Oya']
  },
  'Southern': {
    'Galle': ['Galle Fort', 'Baddegama', 'Hikkaduwa', 'Bentota', 'Elpitiya'],
    'Matara': ['Matara City', 'Deniyaya', 'Weligama', 'Akuressa', 'Kamburupitiya'],
    'Hambantota': ['Hambantota Town', 'Tangalle', 'Tissamaharama', 'Ambalantota']
  },
  'Uva': {
    'Badulla': ['Badulla City', 'Bandarawela', 'Haputale', 'Ella', 'Mahiyangana'],
    'Monaragala': ['Monaragala Town', 'Wellawaya', 'Bibile', 'Kataragama']
  },
  'Sabaragamuwa': {
    'Ratnapura': ['Ratnapura City', 'Pelmadulla', 'Balangoda', 'Kuruwita', 'Eheliyagoda'],
    'Kegalle': ['Kegalle Town', 'Deraniyagala', 'Kitulgala', 'Mawanella', 'Warakapola']
  },
  'Northern': {
    'Jaffna': ['Jaffna City', 'Chavakachcheri', 'Point Pedro', 'Nallur'],
    'Kilinochchi': ['Kilinochchi Town', 'Paranthan'],
    'Mannar': ['Mannar Town', 'Talaimannar']
  },
  'Eastern': {
    'Trincomalee': ['Trincomalee Port', 'Kinniya', 'Kantale'],
    'Batticaloa': ['Batticaloa Town', 'Kattankudy', 'Valaichchenai'],
    'Ampara': ['Ampara Town', 'Kalmunai', 'Akkaraipattu']
  },
  'North Central': {
    'Anuradhapura': ['Anuradhapura Sacred City', 'Kekirawa', 'Medawachchiya'],
    'Polonnaruwa': ['Polonnaruwa Town', 'Kaduruwela', 'Hingurakgoda']
  },
  'North Western': {
    'Kurunegala': ['Kurunegala Town', 'Kuliyapitiya', 'Pannala'],
    'Puttalam': ['Puttalam Town', 'Chilaw', 'Wennappuwa']
  }
};

export default function WeatherForecastsPage() {
  const [selectedProvince, setSelectedProvince] = useState('Uva');
  const [selectedDistrict, setSelectedDistrict] = useState('Badulla');
  const [selectedCity, setSelectedCity] = useState('Badulla City');
  const [chartMetric, setChartMetric] = useState<'temp' | 'rain' | 'humidity'>('temp');
  const [forecastView, setForecastView] = useState<'hourly' | 'daily'>('daily');

  // Handle dependent dropdown changes
  const handleProvinceChange = (prov: string) => {
    setSelectedProvince(prov);
    const districts = Object.keys(SRI_LANKA_PROVINCES[prov] || {});
    const firstDistrict = districts[0] || '';
    setSelectedDistrict(firstDistrict);
    const cities = SRI_LANKA_PROVINCES[prov]?.[firstDistrict] || [];
    setSelectedCity(cities[0] || '');
  };

  const handleDistrictChange = (dist: string) => {
    setSelectedDistrict(dist);
    const cities = SRI_LANKA_PROVINCES[selectedProvince]?.[dist] || [];
    setSelectedCity(cities[0] || '');
  };

  // Find corresponding location or fallback
  const locationObj = SRI_LANKA_LOCATIONS.find(l => l.district.toLowerCase() === selectedDistrict.toLowerCase()) || SRI_LANKA_LOCATIONS[0];
  const observation = getObservationForLocation(locationObj);
  const dailyForecasts = getForecastForLocation(locationObj.locationId);

  // Hourly forecast synthetic telemetry
  const hourlyData = [
    { time: '06:00', temp: observation.temperature - 3, rainProb: 20, humidity: 85, wind: 6 },
    { time: '09:00', temp: observation.temperature - 1, rainProb: 40, humidity: 76, wind: 8 },
    { time: '12:00', temp: observation.temperature + 2, rainProb: 65, humidity: 62, wind: 12 },
    { time: '15:00', temp: observation.temperature + 1, rainProb: 85, humidity: 74, wind: 15 },
    { time: '18:00', temp: observation.temperature - 1, rainProb: 75, humidity: 82, wind: 10 },
    { time: '21:00', temp: observation.temperature - 2, rainProb: 45, humidity: 88, wind: 7 },
    { time: '00:00', temp: observation.temperature - 4, rainProb: 30, humidity: 90, wind: 5 },
  ];

  // Daily chart data
  const dailyChartData = dailyForecasts.map(f => ({
    date: f.forecastDate.split('-').slice(1).join('/'),
    tempMax: f.temperatureMax,
    tempMin: f.temperatureMin,
    rainfall: f.expectedRainfall,
    rainProb: f.rainfallProbability,
    humidity: 65 + Math.round(f.rainfallProbability * 0.25),
  }));

  const currentDistricts = Object.keys(SRI_LANKA_PROVINCES[selectedProvince] || {});
  const currentCities = SRI_LANKA_PROVINCES[selectedProvince]?.[selectedDistrict] || [];

  return (
    <div className="space-y-6 pb-12 max-w-[1600px] mx-auto">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-surface-border dark:border-surface-darkBorder">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold tracking-tight text-surface-text dark:text-surface-darkText flex items-center gap-2">
            <span>Weather & Synoptic Forecasts</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-brand border border-teal-200 dark:bg-teal-950 dark:text-brand-glow">
              Automated Telemetry
            </span>
          </h1>
          <p className="text-xs text-surface-subtext mt-0.5">
            Microclimatic observations, Doppler radar metrics, and synoptic 7-day numerical weather predictions.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-surface-subtext">
          <Clock className="w-3.5 h-3.5 text-brand" />
          <span>Last Observation: <strong>{observation.observedAt.split('T')[1].slice(0, 5)} SLST</strong></span>
        </div>
      </div>

      {/* Dependent Location Selector (Province -> District -> City) */}
      <div className="p-4 rounded-2xl bg-white dark:bg-surface-darkCard border border-surface-border dark:border-surface-darkBorder shadow-sm space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-surface-text dark:text-surface-darkText uppercase tracking-wider">
          <MapPin className="w-4 h-4 text-brand" />
          <span>Administrative Division Telemetry Selector</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-surface-subtext mb-1">Province</label>
            <select
              value={selectedProvince}
              onChange={(e) => handleProvinceChange(e.target.value)}
              className="w-full px-3 py-2 text-xs font-bold rounded-xl bg-slate-50 dark:bg-surface-darkSidebar border border-surface-border dark:border-surface-darkBorder text-surface-text dark:text-surface-darkText focus:outline-none focus:border-brand cursor-pointer"
            >
              {Object.keys(SRI_LANKA_PROVINCES).map(prov => (
                <option key={prov} value={prov}>{prov} Province</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-surface-subtext mb-1">District</label>
            <select
              value={selectedDistrict}
              onChange={(e) => handleDistrictChange(e.target.value)}
              className="w-full px-3 py-2 text-xs font-bold rounded-xl bg-slate-50 dark:bg-surface-darkSidebar border border-surface-border dark:border-surface-darkBorder text-surface-text dark:text-surface-darkText focus:outline-none focus:border-brand cursor-pointer"
            >
              {currentDistricts.map(dist => (
                <option key={dist} value={dist}>{dist} District</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-surface-subtext mb-1">City / Division</label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full px-3 py-2 text-xs font-bold rounded-xl bg-slate-50 dark:bg-surface-darkSidebar border border-surface-border dark:border-surface-darkBorder text-surface-text dark:text-surface-darkText focus:outline-none focus:border-brand cursor-pointer"
            >
              {currentCities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Current Weather Details Section */}
      <div className="rounded-2xl bg-white dark:bg-surface-darkCard border border-surface-border dark:border-surface-darkBorder p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-surface-border dark:border-surface-darkBorder">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-surface-text dark:text-surface-darkText">{selectedCity}</h2>
              <span className="text-sm font-semibold text-surface-subtext">· {selectedDistrict} District</span>
            </div>
            <p className="text-xs text-surface-subtext mt-0.5">{observation.weatherCondition} · Station: {observation.sourceName}</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-3xl font-extrabold text-surface-text dark:text-surface-darkText">{observation.temperature}°C</div>
              <span className="text-xs text-surface-subtext">Feels like {observation.feelsLikeTemperature}°C</span>
            </div>
            <CloudRain className="w-12 h-12 text-brand stroke-[1.5]" />
          </div>
        </div>

        {/* Full Comprehensive 12-Metric Telemetry Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-surface-darkSidebar border border-surface-border dark:border-surface-darkBorder">
            <span className="text-[11px] font-bold text-surface-subtext">Humidity</span>
            <div className="text-base font-extrabold text-surface-text dark:text-surface-darkText mt-0.5">{observation.humidity}%</div>
            <span className="text-[10px] text-surface-subtext">Relative saturation</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-surface-darkSidebar border border-surface-border dark:border-surface-darkBorder">
            <span className="text-[11px] font-bold text-surface-subtext">Wind Speed & Gusts</span>
            <div className="text-base font-extrabold text-surface-text dark:text-surface-darkText mt-0.5">{observation.windSpeed} km/h</div>
            <span className="text-[10px] text-surface-subtext">Gusts to {observation.windGusts || 20} km/h</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-surface-darkSidebar border border-surface-border dark:border-surface-darkBorder">
            <span className="text-[11px] font-bold text-surface-subtext">Wind Direction</span>
            <div className="text-base font-extrabold text-surface-text dark:text-surface-darkText mt-0.5">{observation.windDirection} (Compass)</div>
            <span className="text-[10px] text-surface-subtext">Azimuth vector</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-surface-darkSidebar border border-surface-border dark:border-surface-darkBorder">
            <span className="text-[11px] font-bold text-surface-subtext">Precipitation (24h)</span>
            <div className="text-base font-extrabold text-brand dark:text-brand-glow mt-0.5">{observation.rainfallAmount} mm</div>
            <span className="text-[10px] text-surface-subtext">Rain gauge total</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-surface-darkSidebar border border-surface-border dark:border-surface-darkBorder">
            <span className="text-[11px] font-bold text-surface-subtext">Expected Rain (24h)</span>
            <div className="text-base font-extrabold text-surface-text dark:text-surface-darkText mt-0.5">{observation.expectedRainfall || 8.5} mm</div>
            <span className="text-[10px] text-surface-subtext">{observation.rainfallProbability || 90}% Probability</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-surface-darkSidebar border border-surface-border dark:border-surface-darkBorder">
            <span className="text-[11px] font-bold text-surface-subtext">Atmospheric Pressure</span>
            <div className="text-base font-extrabold text-surface-text dark:text-surface-darkText mt-0.5">{observation.atmosphericPressure} hPa</div>
            <span className="text-[10px] text-surface-subtext">Barometric trend</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-surface-darkSidebar border border-surface-border dark:border-surface-darkBorder">
            <span className="text-[11px] font-bold text-surface-subtext">Air Quality (AQI)</span>
            <div className="text-base font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5">{observation.aqi} AQI</div>
            <span className="text-[10px] text-surface-subtext">Moderate Clean Air</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-surface-darkSidebar border border-surface-border dark:border-surface-darkBorder">
            <span className="text-[11px] font-bold text-surface-subtext">Particulate Matter</span>
            <div className="text-base font-extrabold text-surface-text dark:text-surface-darkText mt-0.5">{observation.pm25} µg/m³</div>
            <span className="text-[10px] text-surface-subtext">PM2.5 Sensor</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-surface-darkSidebar border border-surface-border dark:border-surface-darkBorder">
            <span className="text-[11px] font-bold text-surface-subtext">UV Radiation Index</span>
            <div className="text-base font-extrabold text-amber-600 dark:text-amber-400 mt-0.5">{observation.uvIndex} / 12</div>
            <span className="text-[10px] text-surface-subtext">{observation.uvIndex > 7 ? 'High Solar Index' : 'Moderate'}</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-surface-darkSidebar border border-surface-border dark:border-surface-darkBorder">
            <span className="text-[11px] font-bold text-surface-subtext">Elevation (MSL)</span>
            <div className="text-base font-extrabold text-surface-text dark:text-surface-darkText mt-0.5">{locationObj.elevation} m</div>
            <span className="text-[10px] text-surface-subtext">Topographical height</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-surface-darkSidebar border border-surface-border dark:border-surface-darkBorder">
            <span className="text-[11px] font-bold text-surface-subtext">Flood Risk Vector</span>
            <div className="text-base font-extrabold text-amber-600 dark:text-amber-400 mt-0.5">{locationObj.floodRiskScore || 25}/100</div>
            <span className="text-[10px] text-surface-subtext">{locationObj.floodRiskLevel || 'MODERATE'}</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-surface-darkSidebar border border-surface-border dark:border-surface-darkBorder">
            <span className="text-[11px] font-bold text-surface-subtext">Landslide Hazard</span>
            <div className="text-base font-extrabold text-amber-600 dark:text-amber-400 mt-0.5">{locationObj.landslideRiskScore || 42}%</div>
            <span className="text-[10px] text-surface-subtext">NBRO Soil saturation</span>
          </div>
        </div>
      </div>

      {/* Forecast Section with Segmented Controls & Multi-Chart View */}
      <div className="rounded-2xl bg-white dark:bg-surface-darkCard border border-surface-border dark:border-surface-darkBorder p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-surface-border dark:border-surface-darkBorder">
          <div>
            <h3 className="text-base font-bold text-surface-text dark:text-surface-darkText">Numerical Weather Prediction Outlook</h3>
            <p className="text-xs text-surface-subtext mt-0.5">Toggle between hourly micro-forecast and 7-day synoptic projections.</p>
          </div>

          <div className="flex items-center gap-2">
            {/* View Switcher: Hourly vs Daily */}
            <div className="flex items-center p-0.5 rounded-xl bg-slate-100 dark:bg-surface-darkSidebar border border-surface-border dark:border-surface-darkBorder text-xs font-bold">
              <button
                onClick={() => setForecastView('hourly')}
                className={`px-3 py-1 rounded-lg transition-colors ${forecastView === 'hourly' ? 'bg-white dark:bg-surface-darkCard text-brand shadow-xs' : 'text-surface-subtext'}`}
              >
                Hourly (24h)
              </button>
              <button
                onClick={() => setForecastView('daily')}
                className={`px-3 py-1 rounded-lg transition-colors ${forecastView === 'daily' ? 'bg-white dark:bg-surface-darkCard text-brand shadow-xs' : 'text-surface-subtext'}`}
              >
                7-Day Forecast
              </button>
            </div>

            {/* Metric Switcher: Temp, Rain, Humidity */}
            <div className="flex items-center p-0.5 rounded-xl bg-slate-100 dark:bg-surface-darkSidebar border border-surface-border dark:border-surface-darkBorder text-xs font-bold">
              <button
                onClick={() => setChartMetric('temp')}
                className={`px-2.5 py-1 rounded-lg transition-colors ${chartMetric === 'temp' ? 'bg-brand text-white shadow-xs' : 'text-surface-subtext'}`}
              >
                Temp
              </button>
              <button
                onClick={() => setChartMetric('rain')}
                className={`px-2.5 py-1 rounded-lg transition-colors ${chartMetric === 'rain' ? 'bg-brand text-white shadow-xs' : 'text-surface-subtext'}`}
              >
                Rain
              </button>
              <button
                onClick={() => setChartMetric('humidity')}
                className={`px-2.5 py-1 rounded-lg transition-colors ${chartMetric === 'humidity' ? 'bg-brand text-white shadow-xs' : 'text-surface-subtext'}`}
              >
                Humidity
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Chart Display based on selected metric */}
        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            {chartMetric === 'temp' ? (
              <AreaChart data={forecastView === 'hourly' ? hourlyData : dailyChartData}>
                <defs>
                  <linearGradient id="chartTempGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0F766E" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#0F766E" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey={forecastView === 'hourly' ? 'time' : 'date'} stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} domain={['dataMin - 2', 'dataMax + 2']} />
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }} />
                <Area type="monotone" dataKey={forecastView === 'hourly' ? 'temp' : 'tempMax'} name="Temperature (°C)" stroke="#0F766E" strokeWidth={2.5} fill="url(#chartTempGrad)" />
              </AreaChart>
            ) : chartMetric === 'rain' ? (
              <BarChart data={forecastView === 'hourly' ? hourlyData : dailyChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey={forecastView === 'hourly' ? 'time' : 'date'} stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }} />
                <Bar dataKey={forecastView === 'hourly' ? 'rainProb' : 'rainfall'} name={forecastView === 'hourly' ? 'Rainfall Probability (%)' : 'Expected Rainfall (mm)'} fill="#0D9488" radius={[4, 4, 0, 0]} />
              </BarChart>
            ) : (
              <LineChart data={forecastView === 'hourly' ? hourlyData : dailyChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey={forecastView === 'hourly' ? 'time' : 'date'} stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} domain={[40, 100]} />
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }} />
                <Line type="monotone" dataKey="humidity" name="Relative Humidity (%)" stroke="#0284C7" strokeWidth={2.5} dot={{ r: 4 }} />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Forecast Card Breakdown */}
        {forecastView === 'hourly' ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 pt-2">
            {hourlyData.map((h, i) => (
              <div key={i} className="p-3 rounded-xl bg-slate-50 dark:bg-surface-darkSidebar border border-surface-border dark:border-surface-darkBorder text-center">
                <span className="text-xs font-bold text-surface-subtext">{h.time}</span>
                <div className="my-1 text-base font-extrabold text-surface-text dark:text-surface-darkText">{h.temp}°C</div>
                <div className="flex items-center justify-center gap-1 text-[11px] text-brand font-bold">
                  <Droplets className="w-3 h-3" />
                  <span>{h.rainProb}%</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 pt-2">
            {dailyForecasts.map((d, i) => (
              <div key={d.forecastId} className="p-3 rounded-xl bg-slate-50 dark:bg-surface-darkSidebar border border-surface-border dark:border-surface-darkBorder text-center">
                <span className="text-xs font-bold text-surface-subtext">
                  {i === 0 ? 'Today' : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][(new Date(d.forecastDate)).getDay()]}
                </span>
                <div className="my-1 text-base font-extrabold text-surface-text dark:text-surface-darkText">{d.temperatureMax}°</div>
                <span className="text-[10px] text-surface-subtext">Low {d.temperatureMin}°</span>
                <div className="mt-1 text-[11px] text-brand font-bold">{d.expectedRainfall} mm</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
