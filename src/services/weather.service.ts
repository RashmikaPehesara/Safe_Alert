import { WeatherObservation, WeatherForecast } from '@/types/weather.types';
import { ApiClient } from './api-client';
import { Location } from '@/types/location.types';
import { getObservationForLocation, getForecastForLocation } from './mock-data/sri-lanka-data';

export const WeatherService = {
  async getWeatherObservation(location: Location): Promise<WeatherObservation> {
    const fallback = getObservationForLocation(location);
    return ApiClient.get<WeatherObservation>(`/weather/observations/${location.locationId}`, fallback);
  },

  async getWeatherForecast(locationId: string): Promise<WeatherForecast[]> {
    const fallback = getForecastForLocation(locationId);
    return ApiClient.get<WeatherForecast[]>(`/weather/forecasts/${locationId}`, fallback);
  }
};
