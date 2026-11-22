import { DisasterType, RiskLevel } from './location.types';

export type AlertStatus = 'ACTIVE' | 'EXPIRED' | 'CANCELLED';

export interface Alert {
  alertId: string;
  alertTitle: string;
  alertDescription: string;
  disasterType: DisasterType;
  severityLevel: RiskLevel;
  alertStatus: AlertStatus;
  locationId: string;
  affectedAreas: string[];
  issuedAt: string;
  expiresAt: string;
  createdBy: string;
  approvedBy?: string;
  approvedAt?: string;
  publishedAt: string;
}
