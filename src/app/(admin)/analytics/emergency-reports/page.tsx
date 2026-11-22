'use client';

import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Send, 
  BrainCircuit, 
  Filter,
  Printer
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  Legend 
} from 'recharts';

const HELP_STATUS_PIE = [
  { name: 'Resolved', value: 48, color: '#10B981' },
  { name: 'Assigned / In Progress', value: 24, color: '#0EA5E9' },
  { name: 'Verified Pending Team', value: 16, color: '#F59E0B' },
  { name: 'Pending Verification', value: 8, color: '#EF4444' },
];

const NOTIFICATION_CHANNEL_PIE = [
  { name: 'Mobile App Push (FCM)', value: 68, color: '#0F766E' },
  { name: 'Gov SMS Broadcast (Cell Broadcast)', value: 22, color: '#0284C7' },
  { name: 'EOC Webhooks / Media Radio', value: 10, color: '#8B5CF6' },
];

export default function EmergencyReportsPage() {
  const [selectedRange, setSelectedRange] = useState('30D');

  const handleExportCSV = () => {
    const headers = ['Category', 'Metric', 'Value', 'Benchmark Target', 'Status'];
    const rows = [
      ['Alerts', 'Disseminated Bulletins', '34', '100% within 15 mins', 'Compliant'],
      ['Response', 'Average Triage Time', '14.2 mins', '< 20 mins', 'Optimal'],
      ['Notifications', 'Push Delivery Success Rate', '99.4%', '> 98.0%', 'Optimal'],
      ['Notifications', 'SMS Cell Broadcast Rate', '97.8%', '> 95.0%', 'Optimal'],
      ['AI Precision', 'LankaHydroAI Flood F1-Score', '0.94', '> 0.88', 'Exceeding'],
      ['Shelters', 'Mean Intake Capacity', '88% Ready', '> 80%', 'Ready']
    ];
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SafeAlert_Executive_EOC_Report_${selectedRange}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-12 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-surface-border dark:border-surface-darkBorder">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold tracking-tight text-surface-text dark:text-surface-darkText flex items-center gap-2">
            <span>Executive EOC Emergency & System Performance Reports</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-brand border border-teal-200 dark:bg-teal-950 dark:text-brand-glow">
              Audit Grade
            </span>
          </h1>
          <p className="text-xs text-surface-subtext mt-0.5">
            Operational metrics, notification throughput, response team SLAs, and AI model verification benchmarks.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrintReport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-surface-text dark:text-surface-darkText text-xs font-bold hover:bg-slate-200 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report (PDF)</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand hover:bg-brand-hover text-white text-xs font-bold shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Executive CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="rounded-2xl bg-white dark:bg-surface-darkCard border border-surface-border dark:border-surface-darkBorder p-4 shadow-sm">
          <span className="text-xs font-bold text-surface-subtext uppercase">Broadcast Success Rate</span>
          <div className="mt-1 text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">99.4%</div>
          <p className="text-xs text-surface-subtext mt-0.5">2.4 Million civilians alerted</p>
        </div>

        <div className="rounded-2xl bg-white dark:bg-surface-darkCard border border-surface-border dark:border-surface-darkBorder p-4 shadow-sm">
          <span className="text-xs font-bold text-surface-subtext uppercase">Average Response Triage</span>
          <div className="mt-1 text-2xl font-extrabold text-surface-text dark:text-surface-darkText">14.2 min</div>
          <p className="text-xs text-surface-subtext mt-0.5">From SOS trigger to team dispatch</p>
        </div>

        <div className="rounded-2xl bg-white dark:bg-surface-darkCard border border-surface-border dark:border-surface-darkBorder p-4 shadow-sm">
          <span className="text-xs font-bold text-surface-subtext uppercase">AI Prediction Accuracy</span>
          <div className="mt-1 text-2xl font-extrabold text-brand dark:text-brand-glow">94.1% F1</div>
          <p className="text-xs text-surface-subtext mt-0.5">LankaHydroAI 24h catchment model</p>
        </div>

        <div className="rounded-2xl bg-white dark:bg-surface-darkCard border border-surface-border dark:border-surface-darkBorder p-4 shadow-sm">
          <span className="text-xs font-bold text-surface-subtext uppercase">Help Requests Resolved</span>
          <div className="mt-1 text-2xl font-extrabold text-purple-600 dark:text-purple-400">84.5%</div>
          <p className="text-xs text-surface-subtext mt-0.5">72 of 86 emergency calls closed</p>
        </div>
      </div>

      {/* Distribution Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Help Requests Status Distribution */}
        <div className="rounded-2xl bg-white dark:bg-surface-darkCard border border-surface-border dark:border-surface-darkBorder p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-surface-border dark:border-surface-darkBorder">
            <div>
              <h2 className="text-sm font-bold text-surface-text dark:text-surface-darkText">Emergency Help Request Disposition</h2>
              <p className="text-xs text-surface-subtext">Current lifecycle status across all triaged civilian incidents.</p>
            </div>
            <span className="text-[10px] font-bold text-surface-subtext uppercase">Lifecycle Ratio</span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={HELP_STATUS_PIE} cx="50%" cy="50%" innerRadius={60} outerRadius={85} paddingAngle={4} dataKey="value">
                  {HELP_STATUS_PIE.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Notification Channel Breakdown */}
        <div className="rounded-2xl bg-white dark:bg-surface-darkCard border border-surface-border dark:border-surface-darkBorder p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-surface-border dark:border-surface-darkBorder">
            <div>
              <h2 className="text-sm font-bold text-surface-text dark:text-surface-darkText">Early Warning Dissemination Channels</h2>
              <p className="text-xs text-surface-subtext">Distribution across Mobile Push, Cellular Broadcast, and Media Gateways.</p>
            </div>
            <span className="text-[10px] font-bold text-surface-subtext uppercase">Channel Ratio</span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={NOTIFICATION_CHANNEL_PIE} cx="50%" cy="50%" innerRadius={60} outerRadius={85} paddingAngle={4} dataKey="value">
                  {NOTIFICATION_CHANNEL_PIE.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
