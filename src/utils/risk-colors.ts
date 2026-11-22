export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'VERY_HIGH' | 'CRITICAL';

export interface RiskColorStyle {
  bg: string;
  text: string;
  border: string;
  badgeBg: string;
  badgeText: string;
  dotBg: string;
  hex: string;
}

export const RISK_COLORS: Record<string, RiskColorStyle> = {
  LOW: {
    bg: 'bg-emerald-50 dark:bg-emerald-950/40',
    text: 'text-emerald-700 dark:text-emerald-400',
    border: 'border-emerald-200 dark:border-emerald-800',
    badgeBg: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    badgeText: 'text-emerald-800 dark:text-emerald-300',
    dotBg: 'bg-emerald-500',
    hex: '#10B981',
  },
  MODERATE: {
    bg: 'bg-amber-50 dark:bg-amber-950/40',
    text: 'text-amber-700 dark:text-amber-400',
    border: 'border-amber-200 dark:border-amber-800',
    badgeBg: 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    badgeText: 'text-amber-800 dark:text-amber-300',
    dotBg: 'bg-amber-500',
    hex: '#F59E0B',
  },
  HIGH: {
    bg: 'bg-orange-50 dark:bg-orange-950/40',
    text: 'text-orange-700 dark:text-orange-400',
    border: 'border-orange-200 dark:border-orange-800',
    badgeBg: 'bg-orange-100 text-orange-800 dark:bg-orange-950/70 dark:text-orange-300 border-orange-200 dark:border-orange-800',
    badgeText: 'text-orange-800 dark:text-orange-300',
    dotBg: 'bg-orange-500',
    hex: '#F97316',
  },
  VERY_HIGH: {
    bg: 'bg-red-50 dark:bg-red-950/40',
    text: 'text-red-700 dark:text-red-400',
    border: 'border-red-200 dark:border-red-800',
    badgeBg: 'bg-red-100 text-red-800 dark:bg-red-950/70 dark:text-red-300 border-red-200 dark:border-red-800',
    badgeText: 'text-red-800 dark:text-red-300',
    dotBg: 'bg-red-500',
    hex: '#EF4444',
  },
  CRITICAL: {
    bg: 'bg-rose-50 dark:bg-rose-950/50',
    text: 'text-rose-800 dark:text-rose-400',
    border: 'border-rose-300 dark:border-rose-800',
    badgeBg: 'bg-rose-200 text-rose-900 dark:bg-rose-950 dark:text-rose-200 border-rose-300 dark:border-rose-700',
    badgeText: 'text-rose-900 dark:text-rose-200',
    dotBg: 'bg-rose-700',
    hex: '#991B1B',
  },
};

export function getRiskLevelBadge(level: string | undefined): RiskColorStyle {
  if (!level) return RISK_COLORS.LOW;
  const upper = level.toUpperCase().replace(/\s+/g, '_');
  return RISK_COLORS[upper] || RISK_COLORS.LOW;
}

export function getTemperatureColor(temp: number): string {
  if (temp < 20) return '#2563EB'; // Blue
  if (temp < 24) return '#0D9488'; // Teal
  if (temp < 27) return '#10B981'; // Green
  if (temp < 30) return '#F59E0B'; // Amber
  if (temp < 33) return '#EA580C'; // Orange
  return '#DC2626'; // Red
}

export function getRiverStatusBadge(status: string) {
  switch (status) {
    case 'MAJOR_FLOOD':
      return { 
        label: 'Major Flood', 
        color: 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950/70 dark:text-rose-300 dark:border-rose-800' 
      };
    case 'MINOR_FLOOD':
      return { 
        label: 'Minor Flood', 
        color: 'bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-950/70 dark:text-orange-300 dark:border-orange-800' 
      };
    case 'ALERT':
      return { 
        label: 'Alert Level', 
        color: 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/70 dark:text-amber-300 dark:border-amber-800' 
      };
    default:
      return { 
        label: 'Normal Flow', 
        color: 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/70 dark:text-emerald-300 dark:border-emerald-800' 
      };
  }
}
