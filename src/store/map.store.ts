import { create } from 'zustand';
import { Location } from '@/types/location.types';
import { MapLayerId, BottomLayerMetric } from '@/types/dashboard.types';
import { WeatherObservation, WeatherForecast } from '@/types/weather.types';
import { RiverObservation } from '@/types/river.types';
import { RiskAssessment } from '@/types/risk-assessment.types';
import { Alert } from '@/types/alert.types';
import { SRI_LANKA_LOCATIONS } from '@/services/mock-data/sri-lanka-data';
import { WeatherService } from '@/services/weather.service';
import { RiverService } from '@/services/river.service';
import { RiskAssessmentService } from '@/services/risk-assessment.service';
import { AlertService } from '@/services/alert.service';

interface MapStoreState {
  // Locations & Selection
  locations: Location[];
  selectedLocation: Location | null;
  isLocationPanelOpen: boolean;
  isPanelLoading: boolean;

  // Selected Location Detailed Telemetry
  selectedWeather: WeatherObservation | null;
  selectedForecasts: WeatherForecast[];
  selectedRivers: RiverObservation[];
  selectedRisk: RiskAssessment | null;
  selectedAlerts: Alert[];

  // Layer toggles
  activeLayers: Record<MapLayerId, boolean>;
  bottomLayerMetric: BottomLayerMetric;

  // Map viewport
  mapCenter: [number, number];
  mapZoom: number;

  // Actions
  selectLocation: (location: Location | null) => Promise<void>;
  selectLocationById: (locationId: string) => Promise<void>;
  closeLocationPanel: () => void;
  openLocationPanel: () => void;
  toggleLayer: (layerId: MapLayerId) => void;
  setAllLayers: (layers: Record<MapLayerId, boolean>) => void;
  setBottomLayerMetric: (metric: BottomLayerMetric) => void;
  setMapViewport: (center: [number, number], zoom: number) => void;
  resetMapView: () => void;
}

const DEFAULT_LAYERS: Record<MapLayerId, boolean> = {
  weatherStations: true,
  temperature: true,
  rainfall: true,
  riverGauges: true,
  floodRisk: true,
  landslideRisk: true,
  emergencyAlerts: true,
  helpRequests: true,
  incidentReports: true,
};

const SRI_LANKA_CENTER: [number, number] = [7.8731, 80.7718];
const DEFAULT_ZOOM = 8;

export const useMapStore = create<MapStoreState>((set, get) => ({
  locations: SRI_LANKA_LOCATIONS,
  selectedLocation: SRI_LANKA_LOCATIONS.find((l) => l.locationId === 'loc-badulla') || SRI_LANKA_LOCATIONS[0],
  isLocationPanelOpen: true,
  isPanelLoading: false,

  selectedWeather: null,
  selectedForecasts: [],
  selectedRivers: [],
  selectedRisk: null,
  selectedAlerts: [],

  activeLayers: DEFAULT_LAYERS,
  bottomLayerMetric: 'temp',

  mapCenter: SRI_LANKA_CENTER,
  mapZoom: DEFAULT_ZOOM,

  selectLocation: async (location: Location | null) => {
    if (!location) {
      set({ selectedLocation: null, isLocationPanelOpen: false });
      return;
    }

    set({ 
      selectedLocation: location, 
      isLocationPanelOpen: true, 
      isPanelLoading: true,
      mapCenter: [location.latitude, location.longitude],
      mapZoom: 10
    });

    try {
      const [weather, forecasts, rivers, risk, alerts] = await Promise.all([
        WeatherService.getWeatherObservation(location),
        WeatherService.getWeatherForecast(location.locationId),
        RiverService.getRiverObservationsByLocation(location.locationId),
        RiskAssessmentService.getRiskAssessment(location),
        AlertService.getAlertsByLocation(location.locationId),
      ]);

      set({
        selectedWeather: weather,
        selectedForecasts: forecasts,
        selectedRivers: rivers,
        selectedRisk: risk,
        selectedAlerts: alerts,
        isPanelLoading: false,
      });
    } catch (e) {
      console.error('Error fetching location telemetry:', e);
      set({ isPanelLoading: false });
    }
  },

  selectLocationById: async (locationId: string) => {
    const loc = get().locations.find((l) => l.locationId === locationId);
    if (loc) {
      await get().selectLocation(loc);
    }
  },

  closeLocationPanel: () => {
    set({ isLocationPanelOpen: false });
  },

  openLocationPanel: () => {
    if (get().selectedLocation) {
      set({ isLocationPanelOpen: true });
    }
  },

  toggleLayer: (layerId: MapLayerId) => {
    set((state) => ({
      activeLayers: {
        ...state.activeLayers,
        [layerId]: !state.activeLayers[layerId],
      },
    }));
  },

  setAllLayers: (layers: Record<MapLayerId, boolean>) => {
    set({ activeLayers: layers });
  },

  setBottomLayerMetric: (metric: BottomLayerMetric) => {
    set({ bottomLayerMetric: metric });
  },

  setMapViewport: (center: [number, number], zoom: number) => {
    set({ mapCenter: center, mapZoom: zoom });
  },

  resetMapView: () => {
    set({ mapCenter: SRI_LANKA_CENTER, mapZoom: DEFAULT_ZOOM });
  },
}));
