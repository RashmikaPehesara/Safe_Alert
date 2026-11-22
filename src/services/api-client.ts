/**
 * Centralized API Client for SafeAlert
 * Pre-configured for LankaTwin & SafeAlert backend integration
 * Supports graceful fallback to high-fidelity calibrated mock data
 */

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.safealert.gov.lk/v1';

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  source: string;
  timestamp: string;
}

export class ApiClient {
  private static baseUrl = API_BASE_URL;

  static async get<T>(endpoint: string, fallbackData: T): Promise<T> {
    try {
      // If no live backend is configured or in mock/dev mode, return verified mock data directly
      if (!process.env.NEXT_PUBLIC_API_URL) {
        return fallbackData;
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        console.warn(`[SafeAlert API] Warning: ${endpoint} returned status ${response.status}. Using fallback telemetry.`);
        return fallbackData;
      }

      const json = await response.json();
      return (json.data ?? json) as T;
    } catch {
      console.warn(`[SafeAlert API] Note: Endpoint ${endpoint} unreachable. Operating in resilient offline/mock mode.`);
      return fallbackData;
    }
  }
}
