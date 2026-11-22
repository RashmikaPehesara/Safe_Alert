import { Location } from '@/types/location.types';
import { ApiClient } from './api-client';
import { SRI_LANKA_LOCATIONS } from './mock-data/sri-lanka-data';

export const LocationService = {
  async getAllLocations(): Promise<Location[]> {
    return ApiClient.get<Location[]>('/locations', SRI_LANKA_LOCATIONS);
  },

  async getLocationById(locationId: string): Promise<Location | null> {
    const locations = await this.getAllLocations();
    return locations.find((loc) => loc.locationId === locationId) || null;
  },

  async searchLocations(query: string): Promise<Location[]> {
    if (!query.trim()) return [];
    const normalized = query.toLowerCase().trim();
    const locations = await this.getAllLocations();
    return locations.filter((loc) => 
      loc.name.toLowerCase().includes(normalized) ||
      loc.district.toLowerCase().includes(normalized) ||
      loc.province.toLowerCase().includes(normalized) ||
      (loc.localName && loc.localName.includes(normalized))
    );
  }
};
