'use client';

import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useMapStore } from '@/store/map.store';
import { getTemperatureColor } from '@/utils/risk-colors';
import { 
  MOCK_RIVER_OBSERVATIONS, 
  MOCK_ALERTS, 
  MOCK_HELP_REQUESTS, 
  MOCK_INCIDENT_REPORTS 
} from '@/services/mock-data/sri-lanka-data';

export default function SriLankaLeafletMap() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerGroupRef = useRef<L.LayerGroup | null>(null);

  const {
    locations,
    selectedLocation,
    selectLocation,
    activeLayers,
    bottomLayerMetric,
    mapCenter,
    mapZoom,
  } = useMapStore();

  // Initialize Leaflet map with standard OpenStreetMap tiles
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Fix default marker icon prototype
    delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });

    const map = L.map(mapContainerRef.current, {
      center: mapCenter,
      zoom: mapZoom,
      minZoom: 7,
      maxZoom: 15,
      zoomControl: false,
      attributionControl: true,
    });

    // Standard OpenStreetMap Tile Layer - No API key required!
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    const layerGroup = L.layerGroup().addTo(map);
    markersLayerGroupRef.current = layerGroup;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update map center/zoom when changed from store
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const currentCenter = mapInstanceRef.current.getCenter();
    const currentZoom = mapInstanceRef.current.getZoom();

    if (
      Math.abs(currentCenter.lat - mapCenter[0]) > 0.001 ||
      Math.abs(currentCenter.lng - mapCenter[1]) > 0.001 ||
      currentZoom !== mapZoom
    ) {
      mapInstanceRef.current.flyTo(mapCenter, mapZoom, {
        duration: 1.0,
        easeLinearity: 0.25,
      });
    }
  }, [mapCenter, mapZoom]);

  // Render markers and overlays
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerGroupRef.current) return;
    const layerGroup = markersLayerGroupRef.current;
    layerGroup.clearLayers();

    // 1. Weather / Temperature Location Badges
    if (activeLayers.temperature || activeLayers.weatherStations) {
      locations.forEach((loc) => {
        const isSelected = selectedLocation?.locationId === loc.locationId;
        const temp = loc.currentTemperature || 30;
        const tempColor = getTemperatureColor(temp);

        let displayValue = `${temp}°`;
        let badgeBg = tempColor;

        if (bottomLayerMetric === 'feels') {
          displayValue = `${loc.feelsLikeTemperature || temp + 4}°`;
        } else if (bottomLayerMetric === 'rain24h') {
          displayValue = `${loc.currentRainfall24h || 0}m`;
          badgeBg = (loc.currentRainfall24h || 0) > 100 ? '#EF4444' : (loc.currentRainfall24h || 0) > 50 ? '#F97316' : '#0D9488';
        } else if (bottomLayerMetric === 'flood') {
          displayValue = `${loc.floodRiskScore || 20}`;
          badgeBg = (loc.floodRiskScore || 0) > 80 ? '#EF4444' : (loc.floodRiskScore || 0) > 60 ? '#F97316' : (loc.floodRiskScore || 0) > 30 ? '#F59E0B' : '#10B981';
        }

        const markerHtml = `
          <div class="relative group cursor-pointer flex flex-col items-center">
            <div 
              style="background-color: ${badgeBg};" 
              class="w-7 h-7 rounded-full flex items-center justify-center text-white font-extrabold text-[11px] shadow-md border-2 ${isSelected ? 'border-brand ring-4 ring-brand/40 scale-125 z-30' : 'border-white dark:border-slate-800'} transition-all duration-150 hover:scale-125"
            >
              ${displayValue}
            </div>
            <div class="mt-0.5 px-1.5 py-0.5 rounded bg-white/95 dark:bg-slate-900/95 text-slate-800 dark:text-slate-200 text-[10px] font-bold whitespace-nowrap border border-slate-300 dark:border-slate-700 shadow-sm pointer-events-none group-hover:text-brand">
              ${loc.name}
            </div>
          </div>
        `;

        const icon = L.divIcon({
          html: markerHtml,
          className: 'custom-temp-marker',
          iconSize: [36, 44],
          iconAnchor: [18, 14],
        });

        const marker = L.marker([loc.latitude, loc.longitude], { icon });
        marker.on('click', () => {
          selectLocation(loc);
        });

        layerGroup.addLayer(marker);
      });
    }

    // 2. River Gauges Layer
    if (activeLayers.riverGauges) {
      MOCK_RIVER_OBSERVATIONS.forEach((river) => {
        const isDanger = river.dangerLevel === 'MAJOR_FLOOD' || river.dangerLevel === 'MINOR_FLOOD';
        const color = river.dangerLevel === 'MAJOR_FLOOD' ? '#DC2626' : river.dangerLevel === 'MINOR_FLOOD' ? '#EA580C' : '#0284C7';

        const riverCoords: Record<string, [number, number]> = {
          'st-putupaula': [6.6120, 80.0540],
          'st-hanwella': [6.9020, 80.0815],
          'st-baddegama': [6.1840, 80.1980],
          'st-pitabeddara': [6.2150, 80.4680],
          'st-peradeniya': [7.2620, 80.5980],
          'st-dunamale': [7.1240, 80.0450],
        };

        const coord = riverCoords[river.stationId];
        if (coord) {
          const riverHtml = `
            <div class="relative cursor-pointer flex flex-col items-center">
              <div 
                style="background-color: ${color};" 
                class="w-6 h-6 rounded-lg flex items-center justify-center text-white text-[11px] font-bold shadow-md border border-white ${isDanger ? 'animate-pulse-ring' : ''}"
                title="${river.riverName} (${river.waterLevel}m)"
              >
                🌊
              </div>
              <div class="mt-0.5 px-1 rounded bg-white dark:bg-slate-900 text-sky-700 dark:text-sky-300 text-[9px] font-bold border border-slate-300 dark:border-slate-700 whitespace-nowrap shadow-xs">
                ${river.waterLevel}m
              </div>
            </div>
          `;

          const riverIcon = L.divIcon({
            html: riverHtml,
            className: 'custom-river-marker',
            iconSize: [28, 36],
            iconAnchor: [14, 12],
          });

          const marker = L.marker(coord, { icon: riverIcon });
          marker.bindPopup(`
            <div class="p-1 font-sans text-xs">
              <strong class="text-sm font-bold text-slate-900">${river.riverName}</strong>
              <div class="text-slate-600">Gauge: ${river.stationId.replace('st-', '')}</div>
              <div class="mt-1">Stage: <strong>${river.waterLevel} ${river.waterLevelUnit}</strong> | Flow: <strong>${river.flowRate} ${river.flowRateUnit}</strong></div>
              <div class="mt-1 font-bold ${isDanger ? 'text-red-600' : 'text-blue-600'}">
                ${river.dangerLevel.replace('_', ' ')}
              </div>
            </div>
          `);
          layerGroup.addLayer(marker);
        }
      });
    }

    // 3. Flood-Risk Zones Layer
    if (activeLayers.floodRisk) {
      const floodZones = [
        { lat: 6.6828, lng: 80.4036, radius: 14000, color: '#DC2626', label: 'Ratnapura Basin (Critical Flood Inundation)' },
        { lat: 6.6120, lng: 80.0540, radius: 12000, color: '#DC2626', label: 'Lower Kalu Ganga (Major Flood Inflow)' },
        { lat: 6.9271, lng: 79.9400, radius: 10000, color: '#EA580C', label: 'Kelani Basin (Kolonnawa & Hanwella Reach)' },
        { lat: 6.1840, lng: 80.1980, radius: 9000, color: '#D97706', label: 'Gin Ganga (Baddegama Sub-Basin)' },
      ];

      floodZones.forEach((zone) => {
        const circle = L.circle([zone.lat, zone.lng], {
          color: zone.color,
          fillColor: zone.color,
          fillOpacity: 0.16,
          weight: 2,
          dashArray: '5, 5',
          radius: zone.radius,
        });
        circle.bindTooltip(zone.label, { permanent: false, direction: 'top' });
        layerGroup.addLayer(circle);
      });
    }

    // 4. Landslide-Risk Zones (NBRO Hazard Map)
    if (activeLayers.landslideRisk) {
      const landslideZones = [
        { lat: 6.7800, lng: 80.4500, label: 'Ratnapura Slopes - Level 2 Amber Hazard' },
        { lat: 7.2000, lng: 80.4000, label: 'Kegalle Mountain Pass Hazard' },
        { lat: 6.9600, lng: 80.7600, label: 'Nuwara Eliya Mountain Escarpment' },
        { lat: 7.2700, lng: 80.6500, label: 'Kandy Highland Ridges' },
      ];

      landslideZones.forEach((zone) => {
        const html = `
          <div class="cursor-pointer" title="${zone.label}">
            <div class="w-6 h-6 rounded-full bg-amber-500 border-2 border-white dark:border-slate-800 flex items-center justify-center text-white text-[10px] font-bold shadow-md">
              ⛰️
            </div>
          </div>
        `;
        const icon = L.divIcon({ html, className: '', iconSize: [24, 24], iconAnchor: [12, 12] });
        const marker = L.marker([zone.lat, zone.lng], { icon });
        marker.bindPopup(`<strong class="text-xs text-slate-900">${zone.label}</strong>`);
        layerGroup.addLayer(marker);
      });
    }

    // 5. Emergency Alerts Layer
    if (activeLayers.emergencyAlerts) {
      MOCK_ALERTS.forEach((alert) => {
        const loc = locations.find((l) => l.locationId === alert.locationId);
        if (loc) {
          const isCritical = alert.severityLevel === 'CRITICAL';
          const alertHtml = `
            <div class="relative cursor-pointer">
              <span class="absolute -inset-1 rounded-full ${isCritical ? 'bg-red-500 animate-ping opacity-75' : 'bg-orange-500 opacity-50'}"></span>
              <div class="relative w-6 h-6 rounded-full ${isCritical ? 'bg-red-600' : 'bg-orange-500'} border-2 border-white flex items-center justify-center text-white text-[10px] font-bold shadow-md">
                ⚠️
              </div>
            </div>
          `;
          const icon = L.divIcon({ html: alertHtml, className: '', iconSize: [24, 24], iconAnchor: [12, 12] });
          const marker = L.marker([loc.latitude + 0.04, loc.longitude - 0.04], { icon });
          marker.bindPopup(`
            <div class="p-1 text-slate-900 text-xs">
              <span class="text-[10px] font-bold px-1 py-0.5 rounded bg-red-100 text-red-700">${alert.severityLevel} ALERT</span>
              <h4 class="font-bold text-xs mt-1">${alert.alertTitle}</h4>
              <p class="text-[11px] text-slate-600 mt-1">${alert.alertDescription}</p>
            </div>
          `);
          layerGroup.addLayer(marker);
        }
      });
    }

    // 6. Help Requests Layer
    if (activeLayers.helpRequests) {
      MOCK_HELP_REQUESTS.forEach((req) => {
        const sosHtml = `
          <div class="cursor-pointer" title="${req.requestNumber} - ${req.requestType}">
            <div class="w-6 h-6 rounded-full bg-rose-600 border-2 border-white flex items-center justify-center text-white text-[10px] font-bold shadow-md animate-bounce">
              🆘
            </div>
          </div>
        `;
        const icon = L.divIcon({ html: sosHtml, className: '', iconSize: [24, 24], iconAnchor: [12, 12] });
        const marker = L.marker([req.latitude, req.longitude], { icon });
        marker.bindPopup(`
          <div class="p-1 text-slate-900 text-xs">
            <span class="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-100 text-rose-700">${req.priorityLevel} · ${req.requestType}</span>
            <h4 class="font-bold text-xs mt-1">${req.requestNumber} (${req.locationName})</h4>
            <p class="text-[11px] text-slate-600 mt-1">${req.requestDescription}</p>
            <div class="text-[10px] text-slate-500 mt-1">Affected: <strong>${req.numberOfPeopleAffected} people</strong></div>
          </div>
        `);
        layerGroup.addLayer(marker);
      });
    }

    // 7. Community Incident Reports Layer
    if (activeLayers.incidentReports) {
      MOCK_INCIDENT_REPORTS.forEach((inc) => {
        const incHtml = `
          <div class="cursor-pointer" title="${inc.incidentType}: ${inc.locationName}">
            <div class="w-5 h-5 rounded-full bg-indigo-600 border border-white flex items-center justify-center text-white text-[9px] font-bold shadow-xs">
              📢
            </div>
          </div>
        `;
        const icon = L.divIcon({ html: incHtml, className: '', iconSize: [20, 20], iconAnchor: [10, 10] });
        const marker = L.marker([inc.latitude, inc.longitude], { icon });
        marker.bindPopup(`
          <div class="p-1 text-slate-900 text-xs">
            <span class="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700">${inc.incidentType}</span>
            <p class="text-xs text-slate-800 font-bold mt-1">${inc.locationName}</p>
            <p class="text-[11px] text-slate-600">${inc.description}</p>
          </div>
        `);
        layerGroup.addLayer(marker);
      });
    }

  }, [locations, selectedLocation, activeLayers, bottomLayerMetric, selectLocation]);

  return <div ref={mapContainerRef} className="w-full h-full min-h-[580px] z-10" />;
}
