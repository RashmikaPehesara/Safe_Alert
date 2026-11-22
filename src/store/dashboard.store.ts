import { create } from 'zustand';
import { DashboardSummary, EnvironmentalSignal } from '@/types/dashboard.types';
import { Alert } from '@/types/alert.types';
import { HelpRequest } from '@/types/help-request.types';
import { DashboardService } from '@/services/dashboard.service';
import { AlertService } from '@/services/alert.service';
import { HelpRequestService } from '@/services/help-request.service';

interface DashboardStoreState {
  summary: DashboardSummary | null;
  signals: EnvironmentalSignal[];
  activeAlerts: Alert[];
  pendingRequests: HelpRequest[];
  highestRainfall: Array<{ location: string; district: string; rainfallAmount: number; unit: string; observedAt: string; riskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL' }>;
  elevatedFloodRisks: Array<{ locationId: string; location: string; district: string; riskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL'; riskScore: number; assessmentTime: string; explanation: string }>;
  
  isLoading: boolean;
  error: string | null;
  lastSyncTime: string;

  fetchDashboardData: () => Promise<void>;
}

export const useDashboardStore = create<DashboardStoreState>((set) => ({
  summary: null,
  signals: [],
  activeAlerts: [],
  pendingRequests: [],
  highestRainfall: [],
  elevatedFloodRisks: [],
  isLoading: true,
  error: null,
  lastSyncTime: new Date().toLocaleTimeString('en-LK', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),

  fetchDashboardData: async () => {
    set({ isLoading: true, error: null });
    try {
      const [summary, signals, alerts, requests, rainfall, floodRisks] = await Promise.all([
        DashboardService.getDashboardSummary(),
        DashboardService.getRecentSignals(),
        AlertService.getActiveAlerts(),
        HelpRequestService.getPendingHelpRequests(),
        DashboardService.getHighestRainfall(),
        DashboardService.getElevatedFloodRisks(),
      ]);

      set({
        summary,
        signals,
        activeAlerts: alerts,
        pendingRequests: requests,
        highestRainfall: rainfall,
        elevatedFloodRisks: floodRisks,
        isLoading: false,
        lastSyncTime: new Date().toLocaleTimeString('en-LK', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      });
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      set({ error: 'Failed to synchronize live telemetry. Operating in resilient offline cache.', isLoading: false });
    }
  },
}));
