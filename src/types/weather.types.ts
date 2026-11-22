export interface WeatherObservation {
  weatherObservationId: string;
  locationId: string;
  temperature: number; // Celsius
  feelsLikeTemperature: number;
  humidity: number; // %
  windSpeed: number; // km/h
  windDirection: string; // e.g., 'N', 'NE', 'SW'
  windGusts?: number; // km/h
  atmosphericPressure: number; // hPa
  rainfallAmount: number; // mm
  rainfallProbability?: number; // %
  expectedRainfall?: number; // mm
  weatherCondition: string; // e.g. "Light drizzle", "Scattered thunderstorms", "Sunny", "Overcast"
  uvIndex: number;
  aqi: number; // Air Quality Index
  pm25: number; // µg/m³
  sourceName: string; // e.g. "Department of Meteorology Sri Lanka"
  observedAt: string; // ISO string
  fetchedAt: string;
  dataQualityStatus?: 'VERIFIED' | 'PRELIMINARY' | 'STALE';
}

export interface WeatherForecast {
  forecastId: string;
  locationId: string;
  forecastType: 'DAILY' | 'HOURLY';
  forecastDate: string; // ISO string or YYYY-MM-DD
  temperatureMin: number;
  temperatureMax: number;
  rainfallProbability: number; // %
  expectedRainfall: number; // mm
  weatherCondition: string;
  sourceName: string;
  fetchedAt: string;
}
