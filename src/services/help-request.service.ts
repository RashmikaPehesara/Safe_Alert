import { HelpRequest, IncidentReport } from '@/types/help-request.types';
import { ApiClient } from './api-client';
import { MOCK_HELP_REQUESTS, MOCK_INCIDENT_REPORTS } from './mock-data/sri-lanka-data';

export const HelpRequestService = {
  async getPendingHelpRequests(): Promise<HelpRequest[]> {
    return ApiClient.get<HelpRequest[]>('/help-requests/pending', MOCK_HELP_REQUESTS);
  },

  async getIncidentReports(): Promise<IncidentReport[]> {
    return ApiClient.get<IncidentReport[]>('/incidents/recent', MOCK_INCIDENT_REPORTS);
  }
};
