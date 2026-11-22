'use client';

import React, { useState } from 'react';
import { 
  Shield, 
  Sliders, 
  Radio, 
  Bell, 
  AlertTriangle, 
  Server, 
  Globe, 
  Save, 
  RotateCcw, 
  Lock, 
  CheckCircle2, 
  Power, 
  Users, 
  CloudRain, 
  Activity, 
  Wifi, 
  PhoneCall, 
  Database, 
  Key, 
  Check, 
  X,
  Volume2,
  Info
} from 'lucide-react';

export default function SystemSettingsPage() {
  const [activeTab, setActiveTab] = useState<'roles' | 'disaster' | 'severity' | 'thresholds' | 'gateways' | 'general'>('roles');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // 1. Roles & Permissions State
  const [rolesPermissions, setRolesPermissions] = useState([
    {
      role: 'System Administrator',
      code: 'SYS_ADMIN',
      desc: 'Full operational control, security policies, and credential authority',
      usersCount: 3,
      perms: { viewData: true, triggerAi: true, issueAlerts: true, approveEvac: true, manageUsers: true, configSystem: true }
    },
    {
      role: 'Disaster Coordinator (DMC)',
      code: 'DISASTER_COORD',
      desc: 'Operational lead for hazard warnings, evacuations, and inter-agency dispatch',
      usersCount: 8,
      perms: { viewData: true, triggerAi: true, issueAlerts: true, approveEvac: true, manageUsers: false, configSystem: false }
    },
    {
      role: 'Field Officer / Responder',
      code: 'FIELD_OFFICER',
      desc: 'District disaster management unit, shelter supervisor, on-ground verification',
      usersCount: 34,
      perms: { viewData: true, triggerAi: false, issueAlerts: false, approveEvac: false, manageUsers: false, configSystem: false }
    },
    {
      role: 'Meteorologist / Data Analyst',
      code: 'MET_ANALYST',
      desc: 'National Department of Meteorology, LankaHydroAI parameter calibration',
      usersCount: 6,
      perms: { viewData: true, triggerAi: true, issueAlerts: false, approveEvac: false, manageUsers: false, configSystem: false }
    },
    {
      role: 'Public Information Officer',
      code: 'PIO_MEDIA',
      desc: 'Media liaison, citizen broadcast summaries, public advisory releases',
      usersCount: 4,
      perms: { viewData: true, triggerAi: false, issueAlerts: true, approveEvac: false, manageUsers: false, configSystem: false }
    }
  ]);

  const [sessionTimeout, setSessionTimeout] = useState('30');
  const [mfaEnforced, setMfaEnforced] = useState(true);

  // 2. Disaster Categories State
  const [disasterCategories, setDisasterCategories] = useState([
    { id: 'cat-1', name: 'Riverine Flood', enabled: true, priority: 'CRITICAL', leadAgency: 'Irrigation Department & DMC', autoModel: 'LankaHydroAI v3.2' },
    { id: 'cat-2', name: 'Flash Flood & Urban Inundation', enabled: true, priority: 'HIGH', leadAgency: 'SLLRDC & Municipal Councils', autoModel: 'UrbanStormFlow v2' },
    { id: 'cat-3', name: 'Landslide & Slope Mudflow', enabled: true, priority: 'CRITICAL', leadAgency: 'National Building Research Organisation (NBRO)', autoModel: 'GeoSlopeSat v4.1' },
    { id: 'cat-4', name: 'Cyclone / Tropical Storm', enabled: true, priority: 'HIGH', leadAgency: 'Department of Meteorology', autoModel: 'BayCycloneTracker' },
    { id: 'cat-5', name: 'Coastal Surge & Tsunami Watch', enabled: true, priority: 'CRITICAL', leadAgency: 'DMC Oceanographic Unit & SL Navy', autoModel: 'IndianOceanEarlyWarning' },
    { id: 'cat-6', name: 'Reservoir Dam Spillage Surge', enabled: true, priority: 'HIGH', leadAgency: 'Mahaweli Authority & CEB Hydro', autoModel: 'DamSpillPredictor' },
    { id: 'cat-7', name: 'Agricultural Drought & Heatwave', enabled: false, priority: 'MODERATE', leadAgency: 'Department of Agriculture', autoModel: 'DroughtIndexML' }
  ]);

  // 3. Alert Severity Levels State
  const [severitySettings, setSeveritySettings] = useState([
    {
      level: 'LOW',
      label: 'Advisory (Green)',
      color: '#10B981',
      channels: ['App Push', 'Web Dashboard'],
      sirenActive: false,
      approvalRequired: 'Single Officer',
      autoExpireHours: 48,
      criteria: 'Minor rainfall or normal seasonal water elevation. No immediate danger to life or property.'
    },
    {
      level: 'MODERATE',
      label: 'Watch (Yellow)',
      color: '#F59E0B',
      channels: ['App Push', 'Web Dashboard', 'SMS (Volunteers)'],
      sirenActive: false,
      approvalRequired: 'Duty Coordinator',
      autoExpireHours: 24,
      criteria: 'Rapidly rising water tables, 75mm+ rainfall. Communities alerted to stage provisions.'
    },
    {
      level: 'HIGH',
      label: 'Warning (Orange)',
      color: '#F97316',
      channels: ['App Push', 'Cell Broadcast SMS', 'Media Wire', 'VHF Relay'],
      sirenActive: false,
      approvalRequired: 'Senior Coordinator',
      autoExpireHours: 12,
      criteria: 'Bank overtopping imminent within 12h, 150mm+ precipitation, NBRO Level 2 Amber warning.'
    },
    {
      level: 'CRITICAL',
      label: 'Emergency / Mandatory Evac (Red)',
      color: '#EF4444',
      channels: ['All Channels', 'Cell Broadcast SOS', '77 Coastal Sirens', 'TV Crawl'],
      sirenActive: true,
      approvalRequired: 'Director General / EOC Lead',
      autoExpireHours: 6,
      criteria: 'Life safety threat imminent. Dam discharge or structural failure. Immediate evacuation required.'
    }
  ]);

  // 4. Risk Thresholds State
  const [thresholds, setThresholds] = useState({
    rainfallAdvisory: 50,
    rainfallAmber: 100,
    rainfallRed: 150,
    rainfallExtreme: 200,
    soilSaturationAlertPct: 80,
    soilSaturationCriticalPct: 92,
    aiAutoRecommendCutoff: 0.75,
    windGustCycloneThresholdKph: 88,
    kelaniMinorFloodMeters: 5.5,
    kelaniMajorFloodMeters: 7.5,
    kaluMinorFloodMeters: 5.2,
    kaluMajorFloodMeters: 7.0
  });

  // 5. Notification Gateways State
  const [gateways, setGateways] = useState({
    smsDialog: { status: 'ONLINE', balance: '1,420,000 SMS', latencyMs: 240, rateLimit: '1,000/sec' },
    smsMobitel: { status: 'ONLINE', balance: '980,000 SMS', latencyMs: 280, rateLimit: '1,000/sec' },
    smsHutch: { status: 'ONLINE', balance: '450,000 SMS', latencyMs: 310, rateLimit: '500/sec' },
    fcmPush: { status: 'ONLINE', quota: 'Unlimited (Enterprise)', latencyMs: 85, activeDevices: '1,248,500' },
    sirenNetwork: { totalSirens: 77, online: 75, testingMode: false, batteryBackupOk: true },
    lgnVpn: { status: 'CONNECTED', ip: '10.128.4.15 (Secured)', protocol: 'IPsec AES-256-GCM', ping: '12ms' },
    whatsappBroadcast: { status: 'ACTIVE', tier: 'Verified Gov Emergency API', broadcastLimit: '100,000/hr' }
  });

  // 6. General System Preferences State
  const [generalConfig, setGeneralConfig] = useState({
    platformName: 'SafeAlert National Early Warning System',
    emergencyHotline: '117',
    policeHelpline: '119',
    lankaTwinSyncIntervalMin: 5,
    primaryWeatherFeed: 'Department of Meteorology Sri Lanka (DoM) + ECMWF Blend',
    defaultLanguage: 'en',
    mapCenterLat: 7.8731,
    mapCenterLng: 80.7718,
    mapZoom: 8,
    auditLogRetentionDays: 365,
    maintenanceMode: false
  });

  const handleSave = () => {
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 3500);
  };

  const handleTogglePerm = (roleIndex: number, permKey: string) => {
    const updated = [...rolesPermissions];
    // @ts-expect-error dynamic key access
    updated[roleIndex].perms[permKey] = !updated[roleIndex].perms[permKey];
    setRolesPermissions(updated);
  };

  const handleToggleDisaster = (catId: string) => {
    setDisasterCategories(prev =>
      prev.map(cat => cat.id === catId ? { ...cat, enabled: !cat.enabled } : cat)
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#172033] dark:text-[#F8FAFC] flex items-center gap-2">
            <Sliders className="w-6 h-6 text-[#0F766E] dark:text-[#2DD4BF]" />
            System Settings & Platform Configuration
          </h1>
          <p className="text-sm text-[#64748B] dark:text-[#94A3B8] mt-1">
            Configure administrative authorization, alert severity limits, disaster telemetry thresholds, and notification gateways.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {saveSuccess && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold animate-in fade-in">
              <CheckCircle2 className="w-4 h-4" />
              Settings Saved Successfully
            </div>
          )}
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-[#64748B] dark:text-[#94A3B8] bg-white dark:bg-[#172033] border border-[#E2E8F0] dark:border-[#263449] rounded-lg hover:bg-slate-50 dark:hover:bg-[#1E293B] transition"
          >
            <RotateCcw className="w-4 h-4" />
            Reset Defaults
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-[#0F766E] hover:bg-[#0D655E] dark:bg-[#2DD4BF] dark:text-[#0B1220] dark:hover:bg-[#14B8A6] rounded-lg shadow-sm transition"
          >
            <Save className="w-4 h-4" />
            Save Configuration
          </button>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-[#E2E8F0] dark:border-[#263449] pb-px">
        {[
          { key: 'roles', label: 'Roles & Permissions', icon: Shield },
          { key: 'disaster', label: 'Disaster Categories', icon: CloudRain },
          { key: 'severity', label: 'Alert Severity Rules', icon: AlertTriangle },
          { key: 'thresholds', label: 'Risk Thresholds', icon: Activity },
          { key: 'gateways', label: 'Notification Gateways', icon: Radio },
          { key: 'general', label: 'General Preferences', icon: Globe },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold rounded-t-lg transition border-b-2 whitespace-nowrap ${
                isActive
                  ? 'border-[#0F766E] dark:border-[#2DD4BF] text-[#0F766E] dark:text-[#2DD4BF] bg-[#F0FDFA] dark:bg-[#0F766E]/10'
                  : 'border-transparent text-[#64748B] dark:text-[#94A3B8] hover:text-[#172033] dark:hover:text-[#F8FAFC]'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab 1: Roles & Permissions */}
      {activeTab === 'roles' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-[#172033] border border-[#E2E8F0] dark:border-[#263449] rounded-xl p-5 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E2E8F0] dark:border-[#263449] gap-4">
              <div>
                <h3 className="text-base font-bold text-[#172033] dark:text-[#F8FAFC]">
                  Role-Based Access Control (RBAC) Permission Matrix
                </h3>
                <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-1">
                  Define capability boundaries for emergency personnel across early warning workflows.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-[#64748B] dark:text-[#94A3B8]">Session Inactivity Timeout:</span>
                <select
                  value={sessionTimeout}
                  onChange={(e) => setSessionTimeout(e.target.value)}
                  className="px-2.5 py-1.5 text-xs bg-[#F8FAFC] dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#263449] rounded-lg text-[#172033] dark:text-[#F8FAFC] font-semibold"
                >
                  <option value="15">15 Minutes</option>
                  <option value="30">30 Minutes (Recommended)</option>
                  <option value="60">60 Minutes</option>
                  <option value="120">2 Hours</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto mt-4">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#E2E8F0] dark:border-[#263449] bg-[#F8FAFC] dark:bg-[#111827]/60 text-[#64748B] dark:text-[#94A3B8]">
                    <th className="py-3 px-4 font-semibold">Role Name & Identifier</th>
                    <th className="py-3 px-4 font-semibold text-center">View Telemetry</th>
                    <th className="py-3 px-4 font-semibold text-center">Trigger AI Models</th>
                    <th className="py-3 px-4 font-semibold text-center">Issue Public Alerts</th>
                    <th className="py-3 px-4 font-semibold text-center">Approve Evacuations</th>
                    <th className="py-3 px-4 font-semibold text-center">Manage Personnel</th>
                    <th className="py-3 px-4 font-semibold text-center">Configure System</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0] dark:divide-[#263449]">
                  {rolesPermissions.map((rp, idx) => (
                    <tr key={rp.code} className="hover:bg-slate-50 dark:hover:bg-[#1E293B]/50 transition">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-[#172033] dark:text-[#F8FAFC]">{rp.role}</div>
                        <div className="text-[11px] text-[#64748B] dark:text-[#94A3B8] mt-0.5">{rp.desc}</div>
                        <div className="text-[10px] text-[#0F766E] dark:text-[#2DD4BF] font-mono mt-1">
                          {rp.usersCount} Active Users Assigned
                        </div>
                      </td>
                      {(['viewData', 'triggerAi', 'issueAlerts', 'approveEvac', 'manageUsers', 'configSystem'] as const).map(pKey => {
                        const isGranted = rp.perms[pKey];
                        return (
                          <td key={pKey} className="py-3.5 px-4 text-center">
                            <button
                              onClick={() => handleTogglePerm(idx, pKey)}
                              className={`w-7 h-7 rounded-lg inline-flex items-center justify-center transition ${
                                isGranted 
                                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30' 
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border border-transparent'
                              }`}
                              title={isGranted ? 'Permission Granted - Click to Revoke' : 'Permission Denied - Click to Grant'}
                            >
                              {isGranted ? <Check className="w-4 h-4 stroke-[2.5]" /> : <X className="w-3.5 h-3.5" />}
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 pt-4 border-t border-[#E2E8F0] dark:border-[#263449] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="mfa"
                  checked={mfaEnforced}
                  onChange={(e) => setMfaEnforced(e.target.checked)}
                  className="rounded border-[#E2E8F0] text-[#0F766E] focus:ring-[#0F766E] w-4 h-4"
                />
                <label htmlFor="mfa" className="text-xs font-semibold text-[#172033] dark:text-[#F8FAFC] cursor-pointer">
                  Mandatory Multi-Factor Authentication (MFA via Authenticator / SMS) for all Coordinator & Admin roles
                </label>
              </div>
              <span className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-semibold">
                <Lock className="w-3.5 h-3.5" />
                Lanka Government Network PKI Active
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Disaster Categories */}
      {activeTab === 'disaster' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-[#172033] border border-[#E2E8F0] dark:border-[#263449] rounded-xl p-5 shadow-sm">
            <div>
              <h3 className="text-base font-bold text-[#172033] dark:text-[#F8FAFC]">
                Disaster Hazard Types & Inter-Agency Routing
              </h3>
              <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-1">
                Enable or isolate monitoring domains, configure primary responding authorities, and associate automated ML inference models.
              </p>
            </div>

            <div className="mt-5 space-y-3">
              {disasterCategories.map(cat => (
                <div
                  key={cat.id}
                  className={`p-4 rounded-xl border transition flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                    cat.enabled
                      ? 'border-[#E2E8F0] dark:border-[#263449] bg-white dark:bg-[#111827]/40'
                      : 'border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#111827]/20 opacity-60'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => handleToggleDisaster(cat.id)}
                      className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs transition ${
                        cat.enabled
                          ? 'bg-[#0F766E]/10 text-[#0F766E] dark:bg-[#2DD4BF]/10 dark:text-[#2DD4BF] border border-[#0F766E]/20'
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                      }`}
                    >
                      <Power className="w-4 h-4" />
                    </button>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#172033] dark:text-[#F8FAFC]">
                          {cat.name}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          cat.priority === 'CRITICAL'
                            ? 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20'
                            : cat.priority === 'HIGH'
                            ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                            : 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                        }`}>
                          {cat.priority}
                        </span>
                      </div>
                      <div className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-1">
                        Lead Responding Agency: <strong className="text-[#172033] dark:text-[#F8FAFC]">{cat.leadAgency}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs">
                    <div className="bg-[#F8FAFC] dark:bg-[#172033] px-3 py-1.5 rounded-lg border border-[#E2E8F0] dark:border-[#263449]">
                      <span className="text-[#64748B] dark:text-[#94A3B8]">AI Inference Pipeline: </span>
                      <span className="font-mono font-semibold text-[#0F766E] dark:text-[#2DD4BF]">{cat.autoModel}</span>
                    </div>

                    <button
                      onClick={() => handleToggleDisaster(cat.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                        cat.enabled
                          ? 'bg-red-500/10 text-red-600 hover:bg-red-500/20'
                          : 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20'
                      }`}
                    >
                      {cat.enabled ? 'Deactivate' : 'Activate'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Alert Severity Levels */}
      {activeTab === 'severity' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-[#172033] border border-[#E2E8F0] dark:border-[#263449] rounded-xl p-5 shadow-sm">
            <div>
              <h3 className="text-base font-bold text-[#172033] dark:text-[#F8FAFC]">
                Severity Hierarchy, Dissemination Channels & Siren Protocols
              </h3>
              <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-1">
                Specify criteria, required authorization thresholds, and broadcast channel targets for each warning tier.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
              {severitySettings.map(sev => (
                <div
                  key={sev.level}
                  className="p-5 rounded-xl border border-[#E2E8F0] dark:border-[#263449] bg-white dark:bg-[#111827]/40 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: sev.color }}
                      />
                      <span className="font-bold text-sm text-[#172033] dark:text-[#F8FAFC]">
                        {sev.label}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      Tier: {sev.level}
                    </span>
                  </div>

                  <p className="text-xs text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
                    {sev.criteria}
                  </p>

                  <div className="pt-3 border-t border-[#E2E8F0] dark:border-[#263449] space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-[#64748B] dark:text-[#94A3B8]">Approval Authority:</span>
                      <span className="font-semibold text-[#172033] dark:text-[#F8FAFC]">{sev.approvalRequired}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#64748B] dark:text-[#94A3B8]">Auto-Expiry Duration:</span>
                      <span className="font-semibold text-[#172033] dark:text-[#F8FAFC]">{sev.autoExpireHours} Hours</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#64748B] dark:text-[#94A3B8]">Early Warning Sirens:</span>
                      <span className={`font-bold ${sev.sirenActive ? 'text-red-600 dark:text-red-400' : 'text-slate-400'}`}>
                        {sev.sirenActive ? 'AUTOMATIC ACOUSTIC SOUNDING' : 'Disabled (Silent)'}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <span className="text-[11px] font-semibold text-[#64748B] dark:text-[#94A3B8]">Active Channels:</span>
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {sev.channels.map(ch => (
                        <span key={ch} className="px-2 py-0.5 text-[10px] font-semibold bg-[#F0FDFA] dark:bg-[#0F766E]/20 text-[#0F766E] dark:text-[#2DD4BF] rounded-md border border-[#0F766E]/20">
                          {ch}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Risk Thresholds */}
      {activeTab === 'thresholds' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-[#172033] border border-[#E2E8F0] dark:border-[#263449] rounded-xl p-5 shadow-sm space-y-6">
            <div>
              <h3 className="text-base font-bold text-[#172033] dark:text-[#F8FAFC]">
                Hydrometeorological & Geological Alert Thresholds
              </h3>
              <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-1">
                Tune physical trigger values that govern automated early warning generation across Sri Lankan river basins and hillside slopes.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {/* Rainfall Accumulation */}
              <div className="p-4 rounded-xl border border-[#E2E8F0] dark:border-[#263449] bg-[#F8FAFC] dark:bg-[#111827]/60 space-y-3">
                <div className="flex items-center gap-2 font-bold text-xs text-[#172033] dark:text-[#F8FAFC]">
                  <CloudRain className="w-4 h-4 text-blue-500" />
                  24-Hour Precipitation Triggers (mm)
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[#64748B] dark:text-[#94A3B8]">Advisory (Yellow):</span>
                    <input
                      type="number"
                      value={thresholds.rainfallAdvisory}
                      onChange={(e) => setThresholds({ ...thresholds, rainfallAdvisory: Number(e.target.value) })}
                      className="w-20 px-2 py-1 text-right bg-white dark:bg-[#172033] border border-[#E2E8F0] dark:border-[#263449] rounded font-mono font-bold"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#64748B] dark:text-[#94A3B8]">Amber Warning:</span>
                    <input
                      type="number"
                      value={thresholds.rainfallAmber}
                      onChange={(e) => setThresholds({ ...thresholds, rainfallAmber: Number(e.target.value) })}
                      className="w-20 px-2 py-1 text-right bg-white dark:bg-[#172033] border border-[#E2E8F0] dark:border-[#263449] rounded font-mono font-bold"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#64748B] dark:text-[#94A3B8]">Red Critical Warning:</span>
                    <input
                      type="number"
                      value={thresholds.rainfallRed}
                      onChange={(e) => setThresholds({ ...thresholds, rainfallRed: Number(e.target.value) })}
                      className="w-20 px-2 py-1 text-right bg-white dark:bg-[#172033] border border-[#E2E8F0] dark:border-[#263449] rounded font-mono font-bold"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#64748B] dark:text-[#94A3B8]">Extreme Catastrophic:</span>
                    <input
                      type="number"
                      value={thresholds.rainfallExtreme}
                      onChange={(e) => setThresholds({ ...thresholds, rainfallExtreme: Number(e.target.value) })}
                      className="w-20 px-2 py-1 text-right bg-white dark:bg-[#172033] border border-[#E2E8F0] dark:border-[#263449] rounded font-mono font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* River Gauges Thresholds */}
              <div className="p-4 rounded-xl border border-[#E2E8F0] dark:border-[#263449] bg-[#F8FAFC] dark:bg-[#111827]/60 space-y-3">
                <div className="flex items-center gap-2 font-bold text-xs text-[#172033] dark:text-[#F8FAFC]">
                  <Activity className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  Key River Gauge Heights (m)
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[#64748B] dark:text-[#94A3B8]">Kelani (Hanwella Minor):</span>
                    <input
                      type="number"
                      step="0.1"
                      value={thresholds.kelaniMinorFloodMeters}
                      onChange={(e) => setThresholds({ ...thresholds, kelaniMinorFloodMeters: Number(e.target.value) })}
                      className="w-20 px-2 py-1 text-right bg-white dark:bg-[#172033] border border-[#E2E8F0] dark:border-[#263449] rounded font-mono font-bold"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#64748B] dark:text-[#94A3B8]">Kelani (Hanwella Major):</span>
                    <input
                      type="number"
                      step="0.1"
                      value={thresholds.kelaniMajorFloodMeters}
                      onChange={(e) => setThresholds({ ...thresholds, kelaniMajorFloodMeters: Number(e.target.value) })}
                      className="w-20 px-2 py-1 text-right bg-white dark:bg-[#172033] border border-[#E2E8F0] dark:border-[#263449] rounded font-mono font-bold"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#64748B] dark:text-[#94A3B8]">Kalu (Putupaula Minor):</span>
                    <input
                      type="number"
                      step="0.1"
                      value={thresholds.kaluMinorFloodMeters}
                      onChange={(e) => setThresholds({ ...thresholds, kaluMinorFloodMeters: Number(e.target.value) })}
                      className="w-20 px-2 py-1 text-right bg-white dark:bg-[#172033] border border-[#E2E8F0] dark:border-[#263449] rounded font-mono font-bold"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#64748B] dark:text-[#94A3B8]">Kalu (Putupaula Major):</span>
                    <input
                      type="number"
                      step="0.1"
                      value={thresholds.kaluMajorFloodMeters}
                      onChange={(e) => setThresholds({ ...thresholds, kaluMajorFloodMeters: Number(e.target.value) })}
                      className="w-20 px-2 py-1 text-right bg-white dark:bg-[#172033] border border-[#E2E8F0] dark:border-[#263449] rounded font-mono font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* Slope & AI Triggers */}
              <div className="p-4 rounded-xl border border-[#E2E8F0] dark:border-[#263449] bg-[#F8FAFC] dark:bg-[#111827]/60 space-y-3">
                <div className="flex items-center gap-2 font-bold text-xs text-[#172033] dark:text-[#F8FAFC]">
                  <Shield className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  NBRO Slope & AI Auto-Notification
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[#64748B] dark:text-[#94A3B8]">Soil Moisture Alert %:</span>
                    <input
                      type="number"
                      value={thresholds.soilSaturationAlertPct}
                      onChange={(e) => setThresholds({ ...thresholds, soilSaturationAlertPct: Number(e.target.value) })}
                      className="w-20 px-2 py-1 text-right bg-white dark:bg-[#172033] border border-[#E2E8F0] dark:border-[#263449] rounded font-mono font-bold"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#64748B] dark:text-[#94A3B8]">Soil Moisture Evac %:</span>
                    <input
                      type="number"
                      value={thresholds.soilSaturationCriticalPct}
                      onChange={(e) => setThresholds({ ...thresholds, soilSaturationCriticalPct: Number(e.target.value) })}
                      className="w-20 px-2 py-1 text-right bg-white dark:bg-[#172033] border border-[#E2E8F0] dark:border-[#263449] rounded font-mono font-bold"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#64748B] dark:text-[#94A3B8]">AI Composite Auto-Trigger:</span>
                    <input
                      type="number"
                      step="0.05"
                      min="0"
                      max="1"
                      value={thresholds.aiAutoRecommendCutoff}
                      onChange={(e) => setThresholds({ ...thresholds, aiAutoRecommendCutoff: Number(e.target.value) })}
                      className="w-20 px-2 py-1 text-right bg-white dark:bg-[#172033] border border-[#E2E8F0] dark:border-[#263449] rounded font-mono font-bold text-[#0F766E] dark:text-[#2DD4BF]"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#64748B] dark:text-[#94A3B8]">Gale Wind Gust (km/h):</span>
                    <input
                      type="number"
                      value={thresholds.windGustCycloneThresholdKph}
                      onChange={(e) => setThresholds({ ...thresholds, windGustCycloneThresholdKph: Number(e.target.value) })}
                      className="w-20 px-2 py-1 text-right bg-white dark:bg-[#172033] border border-[#E2E8F0] dark:border-[#263449] rounded font-mono font-bold"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Notification Gateways */}
      {activeTab === 'gateways' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-[#172033] border border-[#E2E8F0] dark:border-[#263449] rounded-xl p-5 shadow-sm space-y-6">
            <div>
              <h3 className="text-base font-bold text-[#172033] dark:text-[#F8FAFC]">
                Telecommunication Gateways & Early Warning Siren Backbone
              </h3>
              <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-1">
                Real-time connection metrics for cellular broadcast partners, push notification relays, and coastal siren arrays.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Dialog SMS */}
              <div className="p-4 rounded-xl border border-[#E2E8F0] dark:border-[#263449] bg-white dark:bg-[#111827]/40 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <PhoneCall className="w-4 h-4 text-[#0F766E] dark:text-[#2DD4BF]" />
                    <span className="font-bold text-xs text-[#172033] dark:text-[#F8FAFC]">Dialog Cell Broadcast</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    {gateways.smsDialog.status}
                  </span>
                </div>
                <div className="space-y-1.5 text-xs text-[#64748B] dark:text-[#94A3B8]">
                  <div className="flex justify-between">
                    <span>Credit Pool:</span>
                    <strong className="text-[#172033] dark:text-[#F8FAFC]">{gateways.smsDialog.balance}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Avg Handshake Latency:</span>
                    <span className="font-mono">{gateways.smsDialog.latencyMs} ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Throughput Limit:</span>
                    <span className="font-mono">{gateways.smsDialog.rateLimit}</span>
                  </div>
                </div>
              </div>

              {/* Mobitel SMS */}
              <div className="p-4 rounded-xl border border-[#E2E8F0] dark:border-[#263449] bg-white dark:bg-[#111827]/40 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <PhoneCall className="w-4 h-4 text-[#0F766E] dark:text-[#2DD4BF]" />
                    <span className="font-bold text-xs text-[#172033] dark:text-[#F8FAFC]">SLT-Mobitel Gateway</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    {gateways.smsMobitel.status}
                  </span>
                </div>
                <div className="space-y-1.5 text-xs text-[#64748B] dark:text-[#94A3B8]">
                  <div className="flex justify-between">
                    <span>Credit Pool:</span>
                    <strong className="text-[#172033] dark:text-[#F8FAFC]">{gateways.smsMobitel.balance}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Avg Handshake Latency:</span>
                    <span className="font-mono">{gateways.smsMobitel.latencyMs} ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Throughput Limit:</span>
                    <span className="font-mono">{gateways.smsMobitel.rateLimit}</span>
                  </div>
                </div>
              </div>

              {/* FCM Push */}
              <div className="p-4 rounded-xl border border-[#E2E8F0] dark:border-[#263449] bg-white dark:bg-[#111827]/40 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-indigo-500" />
                    <span className="font-bold text-xs text-[#172033] dark:text-[#F8FAFC]">Firebase Cloud Messaging</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    {gateways.fcmPush.status}
                  </span>
                </div>
                <div className="space-y-1.5 text-xs text-[#64748B] dark:text-[#94A3B8]">
                  <div className="flex justify-between">
                    <span>Active Subscribed Tokens:</span>
                    <strong className="text-[#172033] dark:text-[#F8FAFC]">{gateways.fcmPush.activeDevices}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>FCM Edge Latency:</span>
                    <span className="font-mono">{gateways.fcmPush.latencyMs} ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Quota:</span>
                    <span className="font-mono text-emerald-600 dark:text-emerald-400">{gateways.fcmPush.quota}</span>
                  </div>
                </div>
              </div>

              {/* 77 Siren Network */}
              <div className="p-4 rounded-xl border border-[#E2E8F0] dark:border-[#263449] bg-white dark:bg-[#111827]/40 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-red-500" />
                    <span className="font-bold text-xs text-[#172033] dark:text-[#F8FAFC]">77 Coastal Siren Array</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    75/77 ARMED
                  </span>
                </div>
                <div className="space-y-1.5 text-xs text-[#64748B] dark:text-[#94A3B8]">
                  <div className="flex justify-between">
                    <span>Solar + Battery Health:</span>
                    <strong className="text-emerald-600 dark:text-emerald-400">Nominal (100%)</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Last Acoustic Test:</span>
                    <span>1st Sunday of Month (09:00)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Satellite Link Override:</span>
                    <span className="font-mono text-[#0F766E] dark:text-[#2DD4BF]">Inmarsat C Ready</span>
                  </div>
                </div>
              </div>

              {/* Lanka Government Network (LGN) VPN */}
              <div className="p-4 rounded-xl border border-[#E2E8F0] dark:border-[#263449] bg-white dark:bg-[#111827]/40 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Wifi className="w-4 h-4 text-emerald-500" />
                    <span className="font-bold text-xs text-[#172033] dark:text-[#F8FAFC]">Lanka Government Network (LGN)</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    {gateways.lgnVpn.status}
                  </span>
                </div>
                <div className="space-y-1.5 text-xs text-[#64748B] dark:text-[#94A3B8]">
                  <div className="flex justify-between">
                    <span>Tunnel IP:</span>
                    <span className="font-mono text-[#172033] dark:text-[#F8FAFC]">{gateways.lgnVpn.ip}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cipher Suite:</span>
                    <span className="font-mono">{gateways.lgnVpn.protocol}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Backbone Latency:</span>
                    <span className="font-mono text-emerald-600 dark:text-emerald-400">{gateways.lgnVpn.ping}</span>
                  </div>
                </div>
              </div>

              {/* WhatsApp Broadcast */}
              <div className="p-4 rounded-xl border border-[#E2E8F0] dark:border-[#263449] bg-white dark:bg-[#111827]/40 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Radio className="w-4 h-4 text-emerald-600" />
                    <span className="font-bold text-xs text-[#172033] dark:text-[#F8FAFC]">Meta WhatsApp Gov API</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    {gateways.whatsappBroadcast.status}
                  </span>
                </div>
                <div className="space-y-1.5 text-xs text-[#64748B] dark:text-[#94A3B8]">
                  <div className="flex justify-between">
                    <span>Channel Tier:</span>
                    <span className="font-semibold text-[#172033] dark:text-[#F8FAFC]">{gateways.whatsappBroadcast.tier}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Rate Limit:</span>
                    <span className="font-mono">{gateways.whatsappBroadcast.broadcastLimit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Template Status:</span>
                    <span className="text-emerald-600 dark:text-emerald-400">12 Verified Templates</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 6: General Preferences */}
      {activeTab === 'general' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-[#172033] border border-[#E2E8F0] dark:border-[#263449] rounded-xl p-5 shadow-sm space-y-6">
            <div>
              <h3 className="text-base font-bold text-[#172033] dark:text-[#F8FAFC]">
                General Platform Settings & LankaTwin Integration
              </h3>
              <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-1">
                Configure national branding, hotlines, sync cadence, and system maintenance mode.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-[#172033] dark:text-[#F8FAFC]">Platform Title</label>
                <input
                  type="text"
                  value={generalConfig.platformName}
                  onChange={(e) => setGeneralConfig({ ...generalConfig, platformName: e.target.value })}
                  className="w-full px-3 py-2 bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#263449] rounded-lg text-[#172033] dark:text-[#F8FAFC]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-[#172033] dark:text-[#F8FAFC]">National Emergency Hotline</label>
                <input
                  type="text"
                  value={generalConfig.emergencyHotline}
                  onChange={(e) => setGeneralConfig({ ...generalConfig, emergencyHotline: e.target.value })}
                  className="w-full px-3 py-2 bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#263449] rounded-lg text-[#172033] dark:text-[#F8FAFC] font-mono font-bold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-[#172033] dark:text-[#F8FAFC]">LankaTwin Telemetry Sync Cadence</label>
                <select
                  value={generalConfig.lankaTwinSyncIntervalMin}
                  onChange={(e) => setGeneralConfig({ ...generalConfig, lankaTwinSyncIntervalMin: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#263449] rounded-lg text-[#172033] dark:text-[#F8FAFC] font-semibold"
                >
                  <option value={1}>Every 1 Minute (High Intensity Crisis Mode)</option>
                  <option value={3}>Every 3 Minutes</option>
                  <option value={5}>Every 5 Minutes (Standard Production)</option>
                  <option value={10}>Every 10 Minutes</option>
                  <option value={15}>Every 15 Minutes</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-[#172033] dark:text-[#F8FAFC]">Default System Language</label>
                <select
                  value={generalConfig.defaultLanguage}
                  onChange={(e) => setGeneralConfig({ ...generalConfig, defaultLanguage: e.target.value })}
                  className="w-full px-3 py-2 bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#263449] rounded-lg text-[#172033] dark:text-[#F8FAFC] font-semibold"
                >
                  <option value="en">English (Default Administration)</option>
                  <option value="si">සිංහල (Sinhala National)</option>
                  <option value="ta">தமிழ் (Tamil National)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-[#172033] dark:text-[#F8FAFC]">Primary Meteorological Ingestion Blend</label>
                <input
                  type="text"
                  value={generalConfig.primaryWeatherFeed}
                  onChange={(e) => setGeneralConfig({ ...generalConfig, primaryWeatherFeed: e.target.value })}
                  className="w-full px-3 py-2 bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#263449] rounded-lg text-[#172033] dark:text-[#F8FAFC]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-[#172033] dark:text-[#F8FAFC]">Security Audit Log Retention (Days)</label>
                <input
                  type="number"
                  value={generalConfig.auditLogRetentionDays}
                  onChange={(e) => setGeneralConfig({ ...generalConfig, auditLogRetentionDays: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#263449] rounded-lg text-[#172033] dark:text-[#F8FAFC] font-mono"
                />
              </div>
            </div>

            {/* Maintenance Mode Toggle */}
            <div className="pt-4 border-t border-[#E2E8F0] dark:border-[#263449]">
              <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    <span className="font-bold text-xs text-[#172033] dark:text-[#F8FAFC]">
                      Platform Scheduled Maintenance Mode
                    </span>
                  </div>
                  <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8] mt-1">
                    When enabled, citizen mobile app sync will show a maintenance notice and non-essential background tasks are queued.
                  </p>
                </div>
                <button
                  onClick={() => setGeneralConfig({ ...generalConfig, maintenanceMode: !generalConfig.maintenanceMode })}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                    generalConfig.maintenanceMode
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : 'bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#263449] text-[#172033] dark:text-[#F8FAFC] hover:bg-slate-50'
                  }`}
                >
                  {generalConfig.maintenanceMode ? 'DISABLE MAINTENANCE' : 'Enable Maintenance'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
