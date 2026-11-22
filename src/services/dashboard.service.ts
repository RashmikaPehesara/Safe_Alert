import { DashboardSummary, EnvironmentalSignal } from '@/types/dashboard.types';
import { ApiClient } from './api-client';
import { 
  MOCK_DASHBOARD_SUMMARY, 
  MOCK_RECENT_SIGNALS, 
  MOCK_HIGHEST_RAINFALL, 
  MOCK_ELEVATED_FLOOD_RISK 
} from './mock-data/sri-lanka-data';

export const DashboardService = {
  async getDashboardSummary(): Promise<DashboardSummary> {
    return ApiClient.get<DashboardSummary>('/dashboard/summary', MOCK_DASHBOARD_SUMMARY);
  },

  async getRecentSignals(): Promise<EnvironmentalSignal[]> {
    return ApiClient.get<EnvironmentalSignal[]>('/dashboard/signals', MOCK_RECENT_SIGNALS);
  },

  async getHighestRainfall() {
    return ApiClient.get('/dashboard/highest-rainfall', MOCK_HIGHEST_RAINFALL);
  },

  async getElevatedFloodRisks() {
    return ApiClient.get('/dashboard/elevated-flood-risks', MOCK_ELEVATED_FLOOD_RISK);
  }
};
