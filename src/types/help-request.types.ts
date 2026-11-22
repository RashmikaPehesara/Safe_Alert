export type RequestType = 'EVACUATION' | 'MEDICAL' | 'FOOD_WATER' | 'SHELTER' | 'RESCUE';
export type RequestPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type RequestStatus = 'PENDING' | 'VERIFIED' | 'ASSIGNED' | 'RESOLVED';

export interface HelpRequest {
  helpRequestId: string;
  requestNumber: string; // e.g. "REQ-2026-0842"
  requestType: RequestType;
  requestDescription: string;
  numberOfPeopleAffected: number;
  locationId: string;
  locationName?: string;
  latitude: number;
  longitude: number;
  priorityLevel: RequestPriority;
  requestStatus: RequestStatus;
  assignedTeamId?: string;
  createdAt: string;
}

export interface IncidentReport {
  incidentId: string;
  incidentType: 'FLOODING' | 'LANDSLIDE' | 'FALLEN_TREES' | 'BLOCKED_ROADS' | 'OTHER';
  description: string;
  locationName: string;
  latitude: number;
  longitude: number;
  status: 'PENDING' | 'VERIFIED' | 'INVESTIGATING' | 'RESOLVED';
  reportedAt: string;
}
