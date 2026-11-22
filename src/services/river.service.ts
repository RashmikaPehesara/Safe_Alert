import { RiverObservation } from '@/types/river.types';
import { ApiClient } from './api-client';
import { MOCK_RIVER_OBSERVATIONS } from './mock-data/sri-lanka-data';

export const RiverService = {
  async getAllRiverObservations(): Promise<RiverObservation[]> {
    return ApiClient.get<RiverObservation[]>('/rivers/observations', MOCK_RIVER_OBSERVATIONS);
  },

  async getRiverObservationsByLocation(locationId: string): Promise<RiverObservation[]> {
    const all = await this.getAllRiverObservations();
    return all.filter((r) => r.locationId === locationId);
  }
};
