import { Alert } from '@/types/alert.types';
import { ApiClient } from './api-client';
import { MOCK_ALERTS } from './mock-data/sri-lanka-data';

export const AlertService = {
  async getActiveAlerts(): Promise<Alert[]> {
    return ApiClient.get<Alert[]>('/alerts/active', MOCK_ALERTS);
  },

  async getAlertsByLocation(locationId: string): Promise<Alert[]> {
    const alerts = await this.getActiveAlerts();
    return alerts.filter((a) => a.locationId === locationId || a.affectedAreas.some(area => area.toLowerCase().includes(locationId.replace('loc-', ''))));
  }
};
