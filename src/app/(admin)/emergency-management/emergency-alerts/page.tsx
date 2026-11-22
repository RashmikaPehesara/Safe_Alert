'use client';

import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  X, 
  ShieldAlert, 
  Send,
  Eye,
  FileCheck
} from 'lucide-react';
import { MOCK_ALERTS } from '@/services/mock-data/sri-lanka-data';
import { Alert } from '@/types/alert.types';
import { getRiskLevelBadge } from '@/utils/risk-colors';
import { formatDateTime } from '@/utils/formatters';

export default function EmergencyAlertsPage() {
  const [alertsList, setAlertsList] = useState<Alert[]>(MOCK_ALERTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [disasterFilter, setDisasterFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedAlertForView, setSelectedAlertForView] = useState<Alert | null>(null);

  // New alert form state
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formDisasterType, setFormDisasterType] = useState<'FLOOD' | 'LANDSLIDE' | 'SEVERE_STORM' | 'TSUNAMI' | 'OTHER'>('FLOOD');
  const [formSeverity, setFormSeverity] = useState<'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL'>('HIGH');
  const [formAreas, setFormAreas] = useState('Ratnapura, Kalutara, Colombo');
  const [formSafetyInstructions, setFormSafetyInstructions] = useState('Move to designated high-ground emergency shelters immediately. Do not cross flooded causeways.');

  // Filter alerts
  const filteredAlerts = alertsList.filter((alert) => {
    const matchesSearch = alert.alertTitle.toLowerCase().includes(searchQuery.toLowerCase()) || alert.affectedAreas.some(a => a.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesDisaster = disasterFilter === 'ALL' || alert.disasterType === disasterFilter;
    const matchesStatus = statusFilter === 'ALL' || alert.alertStatus === statusFilter;
    return matchesSearch && matchesDisaster && matchesStatus;
  });

  const handleCreateAlertSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      alert('Please enter an alert title.');
      return;
    }

    const newAlert: Alert = {
      alertId: `alt-2026-${Date.now().toString().slice(-4)}`,
      alertTitle: formTitle,
      alertDescription: formDescription || 'Official emergency bulletin issued by Disaster Management Centre.',
      disasterType: formDisasterType,
      severityLevel: formSeverity,
      alertStatus: 'ACTIVE',
      locationId: 'loc-ratnapura',
      affectedAreas: formAreas.split(',').map(s => s.trim()),
      issuedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 86400000).toISOString(),
      createdBy: 'Dr. Anura Perera',
      approvedBy: 'Secretary to Ministry of Defence',
      publishedAt: new Date().toISOString(),
    };

    setAlertsList([newAlert, ...alertsList]);
    setIsCreateModalOpen(false);
    // Reset form
    setFormTitle('');
    setFormDescription('');
    alert(`Emergency alert "${newAlert.alertTitle}" published successfully to all broadcast channels.`);
  };

  const handleCancelAlert = (alertId: string) => {
    if (confirm('Are you sure you want to cancel this emergency alert? This will broadcast an alert stand-down notification.')) {
      setAlertsList(prev => prev.map(a => a.alertId === alertId ? { ...a, alertStatus: 'CANCELLED' } : a));
    }
  };

  const activeCount = alertsList.filter(a => a.alertStatus === 'ACTIVE').length;
  const criticalCount = alertsList.filter(a => a.severityLevel === 'CRITICAL' && a.alertStatus === 'ACTIVE').length;

  return (
    <div className="space-y-6 pb-12 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-surface-border dark:border-surface-darkBorder">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold tracking-tight text-surface-text dark:text-surface-darkText flex items-center gap-2">
            <span>National Early Warning & Emergency Alerts</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300">
              {activeCount} Active
            </span>
          </h1>
          <p className="text-xs text-surface-subtext mt-0.5">
            Issue, verify, and broadcast official DMC bulletins across cellular networks, mobile applications, and emergency sirens.
          </p>
        </div>

        {/* Create Alert Button */}
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Issue New Emergency Alert</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="rounded-2xl bg-white dark:bg-surface-darkCard border border-surface-border dark:border-surface-darkBorder p-4 shadow-sm">
          <span className="text-xs font-bold text-surface-subtext uppercase">Active Bulletins</span>
          <div className="mt-1 text-2xl font-extrabold text-surface-text dark:text-surface-darkText">{activeCount} Alerts</div>
          <p className="text-xs text-surface-subtext mt-0.5">Under continuous EOC monitoring</p>
        </div>

        <div className="rounded-2xl bg-white dark:bg-surface-darkCard border border-surface-border dark:border-surface-darkBorder p-4 shadow-sm">
          <span className="text-xs font-bold text-surface-subtext uppercase">Critical Red Severity</span>
          <div className="mt-1 text-2xl font-extrabold text-red-600 dark:text-red-400">{criticalCount} Warnings</div>
          <p className="text-xs text-surface-subtext mt-0.5">Mandatory evacuation protocols active</p>
        </div>

        <div className="rounded-2xl bg-white dark:bg-surface-darkCard border border-surface-border dark:border-surface-darkBorder p-4 shadow-sm">
          <span className="text-xs font-bold text-surface-subtext uppercase">Average Dissemination</span>
          <div className="mt-1 text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">45 seconds</div>
          <p className="text-xs text-surface-subtext mt-0.5">From EOC approval to nationwide push</p>
        </div>

        <div className="rounded-2xl bg-white dark:bg-surface-darkCard border border-surface-border dark:border-surface-darkBorder p-4 shadow-sm">
          <span className="text-xs font-bold text-surface-subtext uppercase">Disaster Types Covered</span>
          <div className="mt-1 text-2xl font-extrabold text-brand dark:text-brand-glow">4 Categories</div>
          <p className="text-xs text-surface-subtext mt-0.5">Flood, Landslide, Storm, Coastal Surge</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="p-3.5 rounded-2xl bg-white dark:bg-surface-darkCard border border-surface-border dark:border-surface-darkBorder shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search alerts by title or affected region..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-surface-darkSidebar border border-surface-border dark:border-surface-darkBorder text-surface-text dark:text-surface-darkText focus:outline-none focus:border-brand"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={disasterFilter}
            onChange={(e) => setDisasterFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs font-bold rounded-xl bg-slate-50 dark:bg-surface-darkSidebar border border-surface-border dark:border-surface-darkBorder text-surface-text dark:text-surface-darkText focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Disaster Types</option>
            <option value="FLOOD">Floods Only</option>
            <option value="LANDSLIDE">Landslides Only</option>
            <option value="SEVERE_STORM">Storms Only</option>
            <option value="OTHER">Other Hazards</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs font-bold rounded-xl bg-slate-50 dark:bg-surface-darkSidebar border border-surface-border dark:border-surface-darkBorder text-surface-text dark:text-surface-darkText focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active Alerts</option>
            <option value="EXPIRED">Expired Alerts</option>
            <option value="CANCELLED">Cancelled Alerts</option>
          </select>
        </div>
      </div>

      {/* Alerts Table */}
      <div className="rounded-2xl bg-white dark:bg-surface-darkCard border border-surface-border dark:border-surface-darkBorder shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-surface-darkSidebar text-surface-subtext uppercase text-[10px] font-bold border-b border-surface-border dark:border-surface-darkBorder">
              <tr>
                <th className="py-3 px-4">Severity & Category</th>
                <th className="py-3 px-4">Alert Title</th>
                <th className="py-3 px-4">Affected Regions</th>
                <th className="py-3 px-4">Issued Timestamp</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border dark:divide-surface-darkBorder">
              {filteredAlerts.map((alert) => {
                const badge = getRiskLevelBadge(alert.severityLevel);
                const isActive = alert.alertStatus === 'ACTIVE';

                return (
                  <tr key={alert.alertId} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded uppercase border ${badge.badgeBg}`}>
                        {alert.severityLevel} · {alert.disasterType}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-surface-text dark:text-surface-darkText max-w-xs truncate">
                      {alert.alertTitle}
                    </td>
                    <td className="py-3 px-4 text-surface-subtext max-w-xs truncate">
                      {alert.affectedAreas.join(', ')}
                    </td>
                    <td className="py-3 px-4 text-surface-subtext whitespace-nowrap">
                      {formatDateTime(alert.issuedAt)}
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full
                        ${alert.alertStatus === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                          alert.alertStatus === 'EXPIRED' ? 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300' :
                          'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'}
                      `}>
                        {alert.alertStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap space-x-2">
                      <button
                        onClick={() => setSelectedAlertForView(alert)}
                        className="text-xs font-bold text-brand hover:underline"
                      >
                        Inspect
                      </button>
                      {isActive && (
                        <button
                          onClick={() => handleCancelAlert(alert.alertId)}
                          className="text-xs font-bold text-rose-600 hover:underline"
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Functional Modal: Create New Alert */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-white dark:bg-surface-darkCard border border-surface-border dark:border-surface-darkBorder rounded-2xl shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-surface-border dark:border-surface-darkBorder">
              <div className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="w-5 h-5" />
                <h2 className="text-base font-bold text-surface-text dark:text-surface-darkText">Issue National Emergency Bulletin</h2>
              </div>
              <button 
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAlertSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-surface-subtext mb-1">Alert Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., CRITICAL FLOOD WARNING: Lower Kalu Ganga Basin Breach"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-bold rounded-xl bg-slate-50 dark:bg-surface-darkSidebar border border-surface-border dark:border-surface-darkBorder text-surface-text dark:text-surface-darkText focus:outline-none focus:border-brand"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-surface-subtext mb-1">Disaster Category</label>
                  <select
                    value={formDisasterType}
                    onChange={(e) => setFormDisasterType(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs font-bold rounded-xl bg-slate-50 dark:bg-surface-darkSidebar border border-surface-border dark:border-surface-darkBorder text-surface-text dark:text-surface-darkText focus:outline-none cursor-pointer"
                  >
                    <option value="FLOOD">Flood Hazard</option>
                    <option value="LANDSLIDE">Landslide Hazard</option>
                    <option value="SEVERE_STORM">Severe Storm / Cyclone</option>
                    <option value="TSUNAMI">Tsunami Advisory</option>
                    <option value="OTHER">Other Hazard</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-surface-subtext mb-1">Severity Level</label>
                  <select
                    value={formSeverity}
                    onChange={(e) => setFormSeverity(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs font-bold rounded-xl bg-slate-50 dark:bg-surface-darkSidebar border border-surface-border dark:border-surface-darkBorder text-surface-text dark:text-surface-darkText focus:outline-none cursor-pointer"
                  >
                    <option value="LOW">Low (Advisory)</option>
                    <option value="MODERATE">Moderate (Yellow)</option>
                    <option value="HIGH">High (Amber Warning)</option>
                    <option value="CRITICAL">Critical (Red Evacuation)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-surface-subtext mb-1">Affected Geographic Areas (Comma Separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Ratnapura, Pelmadulla, Kuruwita, Kalutara South"
                  value={formAreas}
                  onChange={(e) => setFormAreas(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-surface-darkSidebar border border-surface-border dark:border-surface-darkBorder text-surface-text dark:text-surface-darkText focus:outline-none focus:border-brand"
                />
              </div>

              <div>
                <label className="block font-bold text-surface-subtext mb-1">Detailed Technical Bulletin</label>
                <textarea
                  rows={3}
                  placeholder="Details of water level breach, precipitation rate, and expected impact duration..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-surface-darkSidebar border border-surface-border dark:border-surface-darkBorder text-surface-text dark:text-surface-darkText focus:outline-none focus:border-brand"
                />
              </div>

              <div>
                <label className="block font-bold text-surface-subtext mb-1">Public Safety Instructions</label>
                <textarea
                  rows={2}
                  value={formSafetyInstructions}
                  onChange={(e) => setFormSafetyInstructions(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-surface-darkSidebar border border-surface-border dark:border-surface-darkBorder text-surface-text dark:text-surface-darkText focus:outline-none focus:border-brand"
                />
              </div>

              <div className="pt-3 border-t border-surface-border dark:border-surface-darkBorder flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-surface-subtext hover:text-surface-text text-xs font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-xs transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Authorize & Disseminate</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Inspect Alert Modal */}
      {selectedAlertForView && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white dark:bg-surface-darkCard border border-surface-border dark:border-surface-darkBorder rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-surface-border dark:border-surface-darkBorder">
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase bg-red-100 text-red-800">
                  {selectedAlertForView.severityLevel} · {selectedAlertForView.disasterType}
                </span>
                <h3 className="text-base font-bold text-surface-text dark:text-surface-darkText mt-1">
                  {selectedAlertForView.alertTitle}
                </h3>
              </div>
              <button 
                onClick={() => setSelectedAlertForView(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-surface-subtext leading-relaxed">
                {selectedAlertForView.alertDescription}
              </p>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-surface-darkSidebar border border-surface-border dark:border-surface-darkBorder space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-surface-subtext">Affected Zones:</span>
                  <strong className="text-surface-text dark:text-surface-darkText">{selectedAlertForView.affectedAreas.join(', ')}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-surface-subtext">Issued Timestamp:</span>
                  <strong className="text-surface-text dark:text-surface-darkText">{formatDateTime(selectedAlertForView.issuedAt)}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-surface-subtext">Approved By:</span>
                  <strong className="text-surface-text dark:text-surface-darkText">{selectedAlertForView.approvedBy || 'Disaster Management Centre'}</strong>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedAlertForView(null)}
                className="px-4 py-2 rounded-xl bg-brand text-white text-xs font-bold"
              >
                Close Bulletin
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
