import { RiskLevel } from './location.types';

export interface DashboardSummary {
  activeAlerts: number;
  criticalAlerts: number;
  highRiskLocations: number;
  veryHighRiskLocations: number;
  pendingHelpRequests: number;
  totalMonitoringStations: number;
  onlineMonitoringStations: number;
  availableShelters: number;
  totalShelters: number;
  lastDataUpdate: string;
  dataConnectionStatus: 'LIVE' | 'SYNCING' | 'OFFLINE';
}

export interface EnvironmentalSignal {
  id: string;
  type: 'RAINFALL_SURGE' | 'RIVER_LEVEL_RISE' | 'FLOOD_WARNING' | 'LANDSLIDE_ALERT' | 'NEW_SENSOR_OBSERVATION';
  title: string;
  description: string;
  locationName: string;
  locationId?: string;
  riskLevel: RiskLevel;
  value?: string;
  timestamp: string;
}

export type MapLayerId = 
  | 'weatherStations'
  | 'temperature'
  | 'rainfall'
  | 'riverGauges'
  | 'floodRisk'
  | 'landslideRisk'
  | 'emergencyAlerts'
  | 'helpRequests'
  | 'incidentReports';

export type BottomLayerMetric =
  | 'temp'
  | 'feels'
  | 'rain24h'
  | 'next24h'
  | 'flood'
  | 'humidity'
  | 'gusts'
  | 'aqi'
  | 'pm25';
