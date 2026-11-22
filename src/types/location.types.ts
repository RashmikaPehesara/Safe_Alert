export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

export type DisasterType = 'FLOOD' | 'LANDSLIDE' | 'SEVERE_STORM' | 'TSUNAMI' | 'DROUGHT' | 'OTHER';

export interface Location {
  locationId: string;
  name: string;
  localName?: string; // Sinhala/Tamil name e.g. "බදුල්ල"
  district: string;
  province: string;
  latitude: number;
  longitude: number;
  elevation: number; // meters
  isMonitoringStation?: boolean;
  stationType?: 'WEATHER' | 'RIVER_GAUGE' | 'RAINFALL' | 'MULTI_SENSOR';
  currentTemperature?: number;
  feelsLikeTemperature?: number;
  currentRainfall24h?: number;
  floodRiskLevel?: RiskLevel;
  floodRiskScore?: number;
  landslideRiskLevel?: RiskLevel;
  landslideRiskScore?: number;
}
