'use client';

import React, { useState } from 'react';
import { 
  BrainCircuit, 
  Sparkles, 
  ShieldAlert, 
  Mountain, 
  Waves, 
  Filter, 
  Search, 
  CheckCircle2, 
  AlertTriangle,
  Clock,
  Info
} from 'lucide-react';
import { SRI_LANKA_LOCATIONS } from '@/services/mock-data/sri-lanka-data';
import { getRiskLevelBadge } from '@/utils/risk-colors';

export default function AiRiskAssessmentPage() {
  const [selectedDisaster, setSelectedDisaster] = useState<'FLOOD' | 'LANDSLIDE'>('FLOOD');
  const [selectedHorizon, setSelectedHorizon] = useState('24h');
  const [selectedLocationId, setSelectedLocationId] = useState('loc-ratnapura');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected Location Object
  const selectedLocation = SRI_LANKA_LOCATIONS.find(l => l.locationId === selectedLocationId) || SRI_LANKA_LOCATIONS[2];

  // Model details depending on disaster type
  const isFlood = selectedDisaster === 'FLOOD';
  const riskScore = isFlood ? (selectedLocation.floodRiskScore || 88) : (selectedLocation.landslideRiskScore || 74);
  const riskLevel = isFlood ? (selectedLocation.floodRiskLevel || 'CRITICAL') : (selectedLocation.landslideRiskLevel || 'HIGH');
  const badge = getRiskLevelBadge(riskLevel);

  const modelInfo = isFlood ? {
    name: 'LankaHydroAI',
    version: '2.4.1-ensemble',
    confidence: 96.2,
    factors: [
      `Catchment Saturated Runoff: ${(selectedLocation.currentRainfall24h || 12) > 80 ? 'Severe (Over 90%)' : 'Moderate'}`,
      `Upstream Inflow Surge: Peak velocity estimated at 480 m³/s`,
      `Soil Porosity Index: Infiltration rate exceeded by 240%`,
      `Estuary Tidal Restriction: Low clearance during afternoon high tide`
    ],
    rationale: `Neural hydrological analysis predicts high risk of stream bank overflow within 6 to 12 hours based on continuous rainfall in the upper river catchment.`
  } : {
    name: 'NBRO-LandslideNet',
    version: '1.8.4',
    confidence: 93.8,
    factors: [
      `Cumulative 72h Precipitation: Exceeded 250mm critical threshold`,
      `Slope Gradient Index: Steep escarpment (>35 degrees slope)`,
      `Geological Shear Stress: Significant soil pore-water pressure increase`,
      `Historical Slide Recurrence: High vulnerability zone`
    ],
    rationale: `Geotechnical neural model indicates severe slope instability. Pre-warning evacuation protocols are strongly indicated for designated hilly terrains.`
  };

  // Filtered locations table
  const filteredLocations = SRI_LANKA_LOCATIONS.filter(l => 
    l.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    l.district.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-surface-border dark:border-surface-darkBorder">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold tracking-tight text-surface-text dark:text-surface-darkText flex items-center gap-2">
            <span>AI Predictive Disaster Risk Assessment</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-950 dark:text-purple-300">
              Neural Net Inference
            </span>
          </h1>
          <p className="text-xs text-surface-subtext mt-0.5">
            Deep-learning catchment runoff models and slope stability indices. Predictions provide early decision support and require EOC coordinator validation.
          </p>
        </div>

        {/* Disaster Type Toggle */}
        <div className="flex items-center p-0.5 rounded-xl bg-slate-100 dark:bg-surface-darkSidebar border border-surface-border dark:border-surface-darkBorder text-xs font-bold self-start sm:self-auto">
          <button
            onClick={() => setSelectedDisaster('FLOOD')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${selectedDisaster === 'FLOOD' ? 'bg-white dark:bg-surface-darkCard text-brand shadow-xs' : 'text-surface-subtext'}`}
          >
            <Waves className="w-3.5 h-3.5" />
            <span>Flood Risk Model</span>
          </button>
          <button
            onClick={() => setSelectedDisaster('LANDSLIDE')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${selectedDisaster === 'LANDSLIDE' ? 'bg-white dark:bg-surface-darkCard text-amber-600 shadow-xs' : 'text-surface-subtext'}`}
          >
            <Mountain className="w-3.5 h-3.5" />
            <span>Landslide Model</span>
          </button>
        </div>
      </div>

      {/* Advisory Banner */}
      <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 flex items-center gap-2.5 text-xs text-blue-900 dark:text-blue-300">
        <Info className="w-4 h-4 flex-shrink-0 text-blue-600 dark:text-blue-400" />
        <span>
          <strong>Operational Policy Note:</strong> AI predictive assessments are advisory simulations generated by LankaHydroAI and NBRO models. They do not constitute official public evacuation orders until authorized by the Ministry of Defence and DMC Director General.
        </span>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="rounded-2xl bg-white dark:bg-surface-darkCard border border-surface-border dark:border-surface-darkBorder p-4 shadow-sm">
          <span className="text-xs font-bold text-surface-subtext uppercase">Very High Risk Divisions</span>
          <div className="mt-1 text-2xl font-extrabold text-red-600 dark:text-red-400">4 Zones</div>
          <p className="text-xs text-surface-subtext mt-0.5">Ratnapura, Kalutara, Hanwella, Baddegama</p>
        </div>

        <div className="rounded-2xl bg-white dark:bg-surface-darkCard border border-surface-border dark:border-surface-darkBorder p-4 shadow-sm">
          <span className="text-xs font-bold text-surface-subtext uppercase">High Risk Divisions</span>
          <div className="mt-1 text-2xl font-extrabold text-orange-600 dark:text-orange-400">10 Zones</div>
          <p className="text-xs text-surface-subtext mt-0.5">Kegalle, Nuwara Eliya, Galle, Matara</p>
        </div>

        <div className="rounded-2xl bg-white dark:bg-surface-darkCard border border-surface-border dark:border-surface-darkBorder p-4 shadow-sm">
          <span className="text-xs font-bold text-surface-subtext uppercase">Average Model Confidence</span>
          <div className="mt-1 text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">{modelInfo.confidence}%</div>
          <p className="text-xs text-surface-subtext mt-0.5">Cross-validated against historical ground truth</p>
        </div>

        <div className="rounded-2xl bg-white dark:bg-surface-darkCard border border-surface-border dark:border-surface-darkBorder p-4 shadow-sm">
          <span className="text-xs font-bold text-surface-subtext uppercase">Active Neural Model</span>
          <div className="mt-1 text-lg font-extrabold text-brand dark:text-brand-glow">{modelInfo.name}</div>
          <p className="text-xs text-surface-subtext mt-0.5">Version {modelInfo.version}</p>
        </div>
      </div>

      {/* Main Analysis Card for Selected Location */}
      <div className="rounded-2xl bg-white dark:bg-surface-darkCard border border-surface-border dark:border-surface-darkBorder p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-surface-border dark:border-surface-darkBorder">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-surface-text dark:text-surface-darkText">
                {selectedLocation.name} AI Risk Vector Profile
              </h2>
              <span className="text-xs text-surface-subtext">({selectedLocation.district} District · {selectedLocation.province} Province)</span>
            </div>
            <p className="text-xs text-surface-subtext mt-0.5">Inference Model: {modelInfo.name} (v{modelInfo.version}) · Confidence: {modelInfo.confidence}%</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-surface-subtext">Horizon:</span>
            <div className="flex items-center p-0.5 rounded-lg bg-slate-100 dark:bg-surface-darkSidebar border border-surface-border dark:border-surface-darkBorder text-xs font-bold">
              {['12h', '24h', '48h', '72h'].map(h => (
                <button
                  key={h}
                  onClick={() => setSelectedHorizon(h)}
                  className={`px-2.5 py-1 rounded-md transition-colors ${selectedHorizon === h ? 'bg-brand text-white' : 'text-surface-subtext'}`}
                >
                  {h}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Risk Score Progress Bar & Rating */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-surface-darkSidebar border border-surface-border dark:border-surface-darkBorder space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-surface-text dark:text-surface-darkText">Composite Threat Index:</span>
              <span className={`text-xs font-extrabold px-2 py-0.5 rounded uppercase border ${badge.badgeBg}`}>
                {riskLevel} RISK ({riskScore} / 100)
              </span>
            </div>
            <span className="text-xs text-surface-subtext font-mono font-bold">Prediction Horizon: Next {selectedHorizon}</span>
          </div>

          <div className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500
                ${riskScore > 80 ? 'bg-red-600' : riskScore > 60 ? 'bg-orange-500' : riskScore > 30 ? 'bg-amber-500' : 'bg-emerald-500'}
              `}
              style={{ width: `${riskScore}%` }}
            />
          </div>

          <div className="flex justify-between text-[10px] text-surface-subtext font-semibold">
            <span>0 - Normal</span>
            <span>30 - Moderate</span>
            <span>60 - High Hazard</span>
            <span>85+ Critical Threat</span>
          </div>
        </div>

        {/* Contributing Factors & Rationale */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-surface-darkSidebar border border-surface-border dark:border-surface-darkBorder space-y-2">
            <h3 className="font-bold text-surface-text dark:text-surface-darkText flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-brand" />
              <span>Primary Contributing Neural Features</span>
            </h3>
            <div className="space-y-1.5 pt-1">
              {modelInfo.factors.map((f, i) => (
                <div key={i} className="flex items-start gap-1.5 text-surface-subtext">
                  <span className="text-brand font-bold mt-0.5">•</span>
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-surface-darkSidebar border border-surface-border dark:border-surface-darkBorder space-y-2">
            <h3 className="font-bold text-surface-text dark:text-surface-darkText flex items-center gap-1.5">
              <BrainCircuit className="w-3.5 h-3.5 text-purple-600" />
              <span>Synthesized Model Rationale</span>
            </h3>
            <p className="text-surface-subtext leading-relaxed">
              {modelInfo.rationale}
            </p>
            <div className="mt-2 pt-2 border-t border-surface-border dark:border-surface-darkBorder flex items-center justify-between text-[11px] text-surface-subtext">
              <span>Ground Truth Data Status: Optimal</span>
              <span>Inference Latency: 142 ms</span>
            </div>
          </div>
        </div>
      </div>

      {/* Location-wise Risk Analysis Table */}
      <div className="rounded-2xl bg-white dark:bg-surface-darkCard border border-surface-border dark:border-surface-darkBorder p-4 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-surface-border dark:border-surface-darkBorder">
          <div>
            <h3 className="text-sm font-bold text-surface-text dark:text-surface-darkText">National Division Risk Classification Leaderboard</h3>
            <p className="text-xs text-surface-subtext mt-0.5">Click any division to inspect its individual neural feature breakdown.</p>
          </div>

          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search location or district..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-surface-darkSidebar border border-surface-border dark:border-surface-darkBorder text-surface-text dark:text-surface-darkText focus:outline-none focus:border-brand"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-surface-darkSidebar text-surface-subtext uppercase text-[10px] font-bold">
              <tr>
                <th className="py-2.5 px-3">Administrative Division</th>
                <th className="py-2.5 px-3">District & Province</th>
                <th className="py-2.5 px-3 text-right">Flood Risk Score</th>
                <th className="py-2.5 px-3 text-right">Landslide Hazard</th>
                <th className="py-2.5 px-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border dark:divide-surface-darkBorder">
              {filteredLocations.map((loc) => {
                const isSelected = loc.locationId === selectedLocationId;
                const fBadge = getRiskLevelBadge(loc.floodRiskLevel);
                const lBadge = getRiskLevelBadge(loc.landslideRiskLevel);

                return (
                  <tr 
                    key={loc.locationId}
                    onClick={() => setSelectedLocationId(loc.locationId)}
                    className={`cursor-pointer transition-colors ${isSelected ? 'bg-teal-50/70 dark:bg-teal-950/40 font-bold' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
                  >
                    <td className="py-2.5 px-3 text-surface-text dark:text-surface-darkText">
                      {loc.name} {loc.localName && <span className="text-[11px] font-normal text-surface-subtext">({loc.localName})</span>}
                    </td>
                    <td className="py-2.5 px-3 text-surface-subtext font-medium">
                      {loc.district} · {loc.province}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded uppercase border ${fBadge.badgeBg}`}>
                        {loc.floodRiskScore || 25}/100 ({loc.floodRiskLevel || 'MOD'})
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded uppercase border ${lBadge.badgeBg}`}>
                        {loc.landslideRiskScore || 30}% ({loc.landslideRiskLevel || 'LOW'})
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <button 
                        onClick={() => setSelectedLocationId(loc.locationId)}
                        className="text-[11px] font-bold text-brand hover:underline"
                      >
                        Inspect
                      </button>
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
