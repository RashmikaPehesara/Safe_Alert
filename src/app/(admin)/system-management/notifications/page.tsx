'use client';

import React, { useState } from 'react';
import { 
  Bell, 
  Send, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Search, 
  Filter, 
  Radio, 
  Smartphone,
  Eye,
  XCircle
} from 'lucide-react';
import { Notification } from '@/types/dashboard.types';

// Mock notifications with distinct sent, delivered, failed, read timestamps
const MOCK_NOTIFICATIONS = [
  {
    notificationId: 'notif-01',
    notificationTitle: 'CRITICAL FLOOD WARNING: Putupaula Gauge Breach',
    notificationMessage: 'Immediate evacuation advisory for lower Kalu Ganga alluvial reach. High tide surge coinciding with 7.12m river height.',
    notificationType: 'ALERT_BROADCAST',
    deliveryChannel: 'SMS_CELL_BROADCAST',
    notificationStatus: 'DELIVERED',
    sentAt: 'Today 14:32 SLST',
    deliveredAt: 'Today 14:33 SLST',
    readAt: 'Today 14:35 SLST',
    recipientCount: '480,000 Phones'
  },
  {
    notificationId: 'notif-02',
    notificationTitle: 'NBRO Landslide Hazard Level 2 (Amber)',
    notificationMessage: 'Cumulative precipitation surpassed 150mm in Ratnapura slopes. Residents along hill cuttings advised to evacuate.',
    notificationType: 'ALERT_BROADCAST',
    deliveryChannel: 'PUSH',
    notificationStatus: 'READ',
    sentAt: 'Today 12:05 SLST',
    deliveredAt: 'Today 12:05 SLST',
    readAt: 'Today 12:10 SLST',
    recipientCount: '1,240,000 App Users'
  },
  {
    notificationId: 'notif-03',
    notificationTitle: 'Kelani Basin Water Level Advisory (Hanwella)',
    notificationMessage: 'Hanwella gauging station entered minor flood stage (8.95m). Kolonnawa residents should monitor early warning radio.',
    notificationType: 'STATUS_UPDATE',
    deliveryChannel: 'PUSH',
    notificationStatus: 'DELIVERED',
    sentAt: 'Today 15:02 SLST',
    deliveredAt: 'Today 15:03 SLST',
    readAt: null,
    recipientCount: '890,000 App Users'
  },
  {
    notificationId: 'notif-04',
    notificationTitle: 'Weather Radar Gateway Synchronization Failure',
    notificationMessage: 'Doppler radar station at Deniyaya entered diagnostic calibration mode.',
    notificationType: 'SYSTEM_NOTICE',
    deliveryChannel: 'WEBHOOK',
    notificationStatus: 'DELIVERED',
    sentAt: 'Today 09:15 SLST',
    deliveredAt: 'Today 09:15 SLST',
    readAt: 'Today 09:16 SLST',
    recipientCount: 'EOC Engineering Team'
  },
  {
    notificationId: 'notif-05',
    notificationTitle: 'Emergency SMS Gateway Carrier Routing Timeout',
    notificationMessage: 'Cell broadcast carrier tower #44 in Deraniyagala valley delayed due to power generator transfer.',
    notificationType: 'ALERT_BROADCAST',
    deliveryChannel: 'SMS_CELL_BROADCAST',
    notificationStatus: 'FAILED',
    sentAt: 'Today 13:10 SLST',
    deliveredAt: null,
    readAt: null,
    recipientCount: '12,500 Phones'
  }
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [channelFilter, setChannelFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredNotifs = notifications.filter((n) => {
    const matchesSearch = n.notificationTitle.toLowerCase().includes(searchQuery.toLowerCase()) || n.notificationMessage.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesChannel = channelFilter === 'ALL' || n.deliveryChannel === channelFilter;
    const matchesStatus = statusFilter === 'ALL' || n.notificationStatus === statusFilter;
    return matchesSearch && matchesChannel && matchesStatus;
  });

  return (
    <div className="space-y-6 pb-12 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-surface-border dark:border-surface-darkBorder">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold tracking-tight text-surface-text dark:text-surface-darkText flex items-center gap-2">
            <span>Push Notification & Broadcast Delivery Gateway</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-brand border border-teal-200 dark:bg-teal-950 dark:text-brand-glow">
              FCM / Cell Broadcast
            </span>
          </h1>
          <p className="text-xs text-surface-subtext mt-0.5">
            Audit logs for nationwide emergency mobile alerts, SMS cell broadcast handshakes, and delivery latency metrics.
          </p>
        </div>

        <button
          onClick={() => alert('Broadcast Test Ping dispatched to EOC simulator devices.')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand hover:bg-brand-hover text-white text-xs font-bold shadow-xs transition-colors self-start sm:self-auto"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Dispatch Diagnostic Ping</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="rounded-2xl bg-white dark:bg-surface-darkCard border border-surface-border dark:border-surface-darkBorder p-4 shadow-sm">
          <span className="text-xs font-bold text-surface-subtext uppercase">Broadcasts Dispatched</span>
          <div className="mt-1 text-2xl font-extrabold text-surface-text dark:text-surface-darkText">5 Bulletins</div>
          <p className="text-xs text-surface-subtext mt-0.5">2.6 Million recipients targeted</p>
        </div>

        <div className="rounded-2xl bg-white dark:bg-surface-darkCard border border-surface-border dark:border-surface-darkBorder p-4 shadow-sm">
          <span className="text-xs font-bold text-surface-subtext uppercase">Delivery Acknowledged</span>
          <div className="mt-1 text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">99.4%</div>
          <p className="text-xs text-surface-subtext mt-0.5">Handshake verified by mobile carriers</p>
        </div>

        <div className="rounded-2xl bg-white dark:bg-surface-darkCard border border-surface-border dark:border-surface-darkBorder p-4 shadow-sm">
          <span className="text-xs font-bold text-surface-subtext uppercase">Average Delivery Latency</span>
          <div className="mt-1 text-2xl font-extrabold text-brand dark:text-brand-glow">1.8 Seconds</div>
          <p className="text-xs text-surface-subtext mt-0.5">Firebase Cloud Messaging (FCM)</p>
        </div>

        <div className="rounded-2xl bg-white dark:bg-surface-darkCard border border-surface-border dark:border-surface-darkBorder p-4 shadow-sm">
          <span className="text-xs font-bold text-surface-subtext uppercase">Failed Broadcasts</span>
          <div className="mt-1 text-2xl font-extrabold text-rose-600 dark:text-rose-400">1 Queue Retry</div>
          <p className="text-xs text-surface-subtext mt-0.5">Cell tower timeout in Deraniyagala</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-3.5 rounded-2xl bg-white dark:bg-surface-darkCard border border-surface-border dark:border-surface-darkBorder shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search notifications by title or message..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-surface-darkSidebar border border-surface-border dark:border-surface-darkBorder text-surface-text dark:text-surface-darkText focus:outline-none focus:border-brand"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={channelFilter}
            onChange={(e) => setChannelFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs font-bold rounded-xl bg-slate-50 dark:bg-surface-darkSidebar border border-surface-border dark:border-surface-darkBorder text-surface-text dark:text-surface-darkText focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Delivery Channels</option>
            <option value="PUSH">Mobile App Push (FCM)</option>
            <option value="SMS_CELL_BROADCAST">Gov Cell Broadcast</option>
            <option value="WEBHOOK">EOC Webhook</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs font-bold rounded-xl bg-slate-50 dark:bg-surface-darkSidebar border border-surface-border dark:border-surface-darkBorder text-surface-text dark:text-surface-darkText focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="DELIVERED">Delivered</option>
            <option value="READ">Read / Opened</option>
            <option value="FAILED">Failed</option>
          </select>
        </div>
      </div>

      {/* Notifications Table */}
      <div className="rounded-2xl bg-white dark:bg-surface-darkCard border border-surface-border dark:border-surface-darkBorder shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-surface-darkSidebar text-surface-subtext uppercase text-[10px] font-bold border-b border-surface-border dark:border-surface-darkBorder">
              <tr>
                <th className="py-3 px-4">Notification Title & Content</th>
                <th className="py-3 px-4">Delivery Channel</th>
                <th className="py-3 px-4">Recipients</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4">Sent At</th>
                <th className="py-3 px-4">Delivered At</th>
                <th className="py-3 px-4 text-right">Read Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border dark:divide-surface-darkBorder">
              {filteredNotifs.map((n) => (
                <tr key={n.notificationId} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="py-3 px-4 max-w-sm">
                    <div className="font-bold text-surface-text dark:text-surface-darkText">{n.notificationTitle}</div>
                    <div className="text-[11px] text-surface-subtext mt-0.5 line-clamp-1">{n.notificationMessage}</div>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className="font-semibold text-brand">{n.deliveryChannel.replace(/_/g, ' ')}</span>
                  </td>
                  <td className="py-3 px-4 text-surface-subtext font-medium whitespace-nowrap">
                    {n.recipientCount}
                  </td>
                  <td className="py-3 px-4 text-center whitespace-nowrap">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full
                      ${n.notificationStatus === 'READ' ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300' :
                        n.notificationStatus === 'DELIVERED' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                        'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'}
                    `}>
                      {n.notificationStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-surface-subtext whitespace-nowrap">
                    {n.sentAt}
                  </td>
                  <td className="py-3 px-4 text-surface-subtext whitespace-nowrap">
                    {n.deliveredAt || '— (Pending)'}
                  </td>
                  <td className="py-3 px-4 text-right text-surface-subtext whitespace-nowrap">
                    {n.readAt || '— (Unconfirmed)'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
