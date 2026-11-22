export type RiverDangerLevel = 'NORMAL' | 'ALERT' | 'MINOR_FLOOD' | 'MAJOR_FLOOD';

export interface RiverObservation {
  riverObservationId: string;
  stationId: string;
  riverName: string; // e.g. "Kelani Ganga", "Kalu Ganga", "Gin Ganga", "Nilwala Ganga"
  locationId: string;
  waterLevel: number; // e.g. 5.4
  waterLevelUnit: string; // 'm'
  flowRate: number; // e.g. 340
  flowRateUnit: string; // 'm³/s'
  dangerLevel: RiverDangerLevel;
  observedAt: string;
  sourceName: string; // e.g. "Irrigation Department Sri Lanka"
  dataStatus: 'ACTIVE' | 'CALIBRATING' | 'OFFLINE';
  minorFloodLevel?: number;
  majorFloodLevel?: number;
}
