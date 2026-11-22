import { DisasterType, RiskLevel } from './location.types';

export interface RiskAssessment {
  riskAssessmentId: string;
  locationId: string;
  disasterType: DisasterType;
  riskLevel: RiskLevel;
  riskScore: number; // 0-100
  predictionHorizon: string; // e.g., "Next 24 Hours", "Next 48 Hours"
  predictionTime: string;
  assessmentTime: string;
  modelName: string; // e.g., "LankaHydroAI-v2.4", "NBRO-LandslideNet"
  modelVersion: string;
  modelConfidence: number; // percentage, e.g. 94.5
  contributingFactors: string[];
  explanation: string;
  dataQualityStatus: 'OPTIMAL' | 'ACCEPTABLE' | 'DEGRADED';
}
