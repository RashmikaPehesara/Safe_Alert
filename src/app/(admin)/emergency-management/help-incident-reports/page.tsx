'use client';

import React, { useState } from 'react';
import { 
  LifeBuoy, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Users, 
  Phone, 
  Search, 
  Filter, 
  X, 
  UserCheck, 
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { MOCK_HELP_REQUESTS, MOCK_INCIDENT_REPORTS } from '@/services/mock-data/sri-lanka-data';
import { HelpRequest, IncidentReport } from '@/types/help-request.types';
import { formatDateTime } from '@/utils/formatters';

export default function HelpIncidentReportsPage() {
  const [activeTab, setActiveTab] = useState<'requests' | 'incidents'>('requests');
  const [requestsList, setRequestsList] = useState<HelpRequest[]>(MOCK_HELP_REQUESTS);
  const [incidentsList, setIncidentsList] = useState<IncidentReport[]>(MOCK_INCIDENT_REPORTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<HelpRequest | null>(null);
  const [assignTeamModalOpen, setAssignTeamModalOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState('team-sabaragamuwa-01');

  // Filter requests
  const filteredRequests = requestsList.filter(r => 
    r.requestNumber.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (r.locationName && r.locationName.toLowerCase().includes(searchQuery.toLowerCase())) ||
    r.requestType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter incidents
  const filteredIncidents = incidentsList.filter(inc => 
    inc.locationName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    inc.incidentType.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inc.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Status transitions for requests
  const handleVerifyRequest = (id: string) => {
    setRequestsList(prev => prev.map(r => r.helpRequestId === id ? { ...r, requestStatus: 'VERIFIED' } : r));
    if (selectedRequest?.helpRequestId === id) {
      setSelectedRequest(prev => prev ? { ...prev, requestStatus: 'VERIFIED' } : null);
    }
    alert('Request marked as VERIFIED by EOC Command.');
  };

  const handleAssignTeamSubmit = () => {
    if (!selectedRequest) return;
    setRequestsList(prev => prev.map(r => r.helpRequestId === selectedRequest.helpRequestId ? { ...r, requestStatus: 'ASSIGNED', assignedTeamId: selectedTeam } : r));
    setSelectedRequest(prev => prev ? { ...prev, requestStatus: 'ASSIGNED', assignedTeamId: selectedTeam } : null);
    setAssignTeamModalOpen(false);
    alert(`Team ${selectedTeam} dispatched to ${selectedRequest.locationName}.`);
  };

  const handleResolveRequest = (id: string) => {
    setRequestsList(prev => prev.map(r => r.helpRequestId === id ? { ...r, requestStatus: 'RESOLVED' } : r));
    if (selectedRequest?.helpRequestId === id) {
      setSelectedRequest(prev => prev ? { ...prev, requestStatus: 'RESOLVED' } : null);
    }
    alert('Emergency help request marked as RESOLVED.');
  };

  // Status transition for community incident verification
  const handleVerifyIncident = (id: string, status: 'VERIFIED' | 'RESOLVED') => {
    setIncidentsList(prev => prev.map(inc => inc.incidentId === id ? { ...inc, status } : inc));
    alert(`Citizen incident report marked as ${status}.`);
  };

  return (
    <div className="space-y-6 pb-12 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-surface-border dark:border-surface-darkBorder">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold tracking-tight text-surface-text dark:text-surface-darkText flex items-center gap-2">
            <span>Emergency Help & Incident Dispatch Triage</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-brand border border-teal-200 dark:bg-teal-950 dark:text-brand-glow">
              EOC Dispatch
            </span>
          </h1>
          <p className="text-xs text-surface-subtext mt-0.5">
            Triage civilian distress calls, coordinate military & police first responders, and verify community hazard reports.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center p-0.5 rounded-xl bg-slate-100 dark:bg-surface-darkSidebar border border-surface-border dark:border-surface-darkBorder text-xs font-bold self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('requests')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${activeTab === 'requests' ? 'bg-white dark:bg-surface-darkCard text-brand shadow-xs' : 'text-surface-subtext'}`}
          >
            <LifeBuoy className="w-3.5 h-3.5" />
            <span>Distress Help Requests ({requestsList.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('incidents')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${activeTab === 'incidents' ? 'bg-white dark:bg-surface-darkCard text-brand shadow-xs' : 'text-surface-subtext'}`}
          >
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Community Reports ({incidentsList.length})</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-3.5 rounded-2xl bg-white dark:bg-surface-darkCard border border-surface-border dark:border-surface-darkBorder shadow-sm flex items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            placeholder={activeTab === 'requests' ? 'Search by REQ number, location, or type...' : 'Search community reports...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-surface-darkSidebar border border-surface-border dark:border-surface-darkBorder text-surface-text dark:text-surface-darkText focus:outline-none focus:border-brand"
          />
        </div>

        <span className="text-xs font-bold text-surface-subtext">
          Showing {activeTab === 'requests' ? filteredRequests.length : filteredIncidents.length} entries
        </span>
      </div>

      {/* Tab 1: Help Requests Table */}
      {activeTab === 'requests' && (
        <div className="rounded-2xl bg-white dark:bg-surface-darkCard border border-surface-border dark:border-surface-darkBorder shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-surface-darkSidebar text-surface-subtext uppercase text-[10px] font-bold border-b border-surface-border dark:border-surface-darkBorder">
                <tr>
                  <th className="py-3 px-4">Request # & Type</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4 text-center">People Affected</th>
                  <th className="py-3 px-4 text-center">Priority</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4">Assigned Unit</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border dark:divide-surface-darkBorder">
                {filteredRequests.map((req) => (
                  <tr key={req.helpRequestId} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="font-bold text-surface-text dark:text-surface-darkText">{req.requestNumber}</div>
                      <span className="text-[10px] font-semibold text-brand">{req.requestType}</span>
                    </td>
                    <td className="py-3 px-4 max-w-xs truncate">
                      <div className="font-medium text-surface-text dark:text-surface-darkText">{req.locationName}</div>
                      <div className="text-[11px] text-surface-subtext line-clamp-1">{req.requestDescription}</div>
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-surface-text dark:text-surface-darkText whitespace-nowrap">
                      {req.numberOfPeopleAffected} People
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase
                        ${req.priorityLevel === 'CRITICAL' ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300' :
                          req.priorityLevel === 'HIGH' ? 'bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300' :
                          'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'}
                      `}>
                        {req.priorityLevel}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full
                        ${req.requestStatus === 'RESOLVED' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                          req.requestStatus === 'ASSIGNED' ? 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300' :
                          req.requestStatus === 'VERIFIED' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
                          'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'}
                      `}>
                        {req.requestStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-surface-subtext font-medium whitespace-nowrap">
                      {req.assignedTeamId ? req.assignedTeamId.replace('team-', '').toUpperCase() : 'Unassigned'}
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap space-x-2">
                      <button
                        onClick={() => setSelectedRequest(req)}
                        className="text-xs font-bold text-brand hover:underline"
                      >
                        Inspect
                      </button>
                      {req.requestStatus === 'PENDING' && (
                        <button
                          onClick={() => handleVerifyRequest(req.helpRequestId)}
                          className="text-xs font-bold text-amber-600 hover:underline"
                        >
                          Verify
                        </button>
                      )}
                      {req.requestStatus === 'VERIFIED' && (
                        <button
                          onClick={() => { setSelectedRequest(req); setAssignTeamModalOpen(true); }}
                          className="text-xs font-bold text-sky-600 hover:underline"
                        >
                          Assign Unit
                        </button>
                      )}
                      {req.requestStatus === 'ASSIGNED' && (
                        <button
                          onClick={() => handleResolveRequest(req.helpRequestId)}
                          className="text-xs font-bold text-emerald-600 hover:underline"
                        >
                          Resolve
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Community Disaster Reports Table */}
      {activeTab === 'incidents' && (
        <div className="rounded-2xl bg-white dark:bg-surface-darkCard border border-surface-border dark:border-surface-darkBorder shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-surface-darkSidebar text-surface-subtext uppercase text-[10px] font-bold border-b border-surface-border dark:border-surface-darkBorder">
                <tr>
                  <th className="py-3 px-4">Incident ID & Type</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4">Reported Time</th>
                  <th className="py-3 px-4 text-right">Verification Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border dark:divide-surface-darkBorder">
                {filteredIncidents.map((inc) => (
                  <tr key={inc.incidentId} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="font-bold text-surface-text dark:text-surface-darkText">{inc.incidentId.toUpperCase()}</div>
                      <span className="text-[10px] font-bold text-purple-700 dark:text-purple-400">{inc.incidentType}</span>
                    </td>
                    <td className="py-3 px-4 max-w-sm font-medium text-surface-text dark:text-surface-darkText">
                      {inc.description}
                    </td>
                    <td className="py-3 px-4 text-surface-subtext">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-brand" />
                        <span>{inc.locationName}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full
                        ${inc.status === 'VERIFIED' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                          inc.status === 'INVESTIGATING' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
                          'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'}
                      `}>
                        {inc.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-surface-subtext whitespace-nowrap">
                      {inc.reportedAt.split('T')[1].slice(0, 5)} SLST
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap space-x-2">
                      {inc.status !== 'VERIFIED' && (
                        <button
                          onClick={() => handleVerifyIncident(inc.incidentId, 'VERIFIED')}
                          className="text-xs font-bold text-emerald-600 hover:underline"
                        >
                          Verify Ground Truth
                        </button>
                      )}
                      <button
                        onClick={() => alert(`Location Coordinates: Lat ${inc.latitude}, Lng ${inc.longitude}. Dispatched to local police station.`)}
                        className="text-xs font-bold text-brand hover:underline"
                      >
                        Track GPS
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Request Inspection Modal */}
      {selectedRequest && !assignTeamModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white dark:bg-surface-darkCard border border-surface-border dark:border-surface-darkBorder rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-surface-border dark:border-surface-darkBorder">
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase bg-rose-100 text-rose-800">
                  {selectedRequest.priorityLevel} PRIORITY · {selectedRequest.requestType}
                </span>
                <h3 className="text-base font-bold text-surface-text dark:text-surface-darkText mt-1">
                  {selectedRequest.requestNumber}
                </h3>
              </div>
              <button 
                onClick={() => setSelectedRequest(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-surface-subtext leading-relaxed">
                {selectedRequest.requestDescription}
              </p>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-surface-darkSidebar border border-surface-border dark:border-surface-darkBorder space-y-2">
                <div className="flex justify-between">
                  <span className="text-surface-subtext">Address / Landmark:</span>
                  <strong className="text-surface-text dark:text-surface-darkText">{selectedRequest.locationName}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-surface-subtext">People Trapped / Affected:</span>
                  <strong className="text-surface-text dark:text-surface-darkText">{selectedRequest.numberOfPeopleAffected} Persons</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-surface-subtext">GPS Position:</span>
                  <strong className="text-surface-text dark:text-surface-darkText">{selectedRequest.latitude}, {selectedRequest.longitude}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-surface-subtext">Current Lifecycle Stage:</span>
                  <strong className="text-brand">{selectedRequest.requestStatus}</strong>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-between">
              {selectedRequest.requestStatus === 'PENDING' && (
                <button
                  onClick={() => handleVerifyRequest(selectedRequest.helpRequestId)}
                  className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold"
                >
                  Verify Request
                </button>
              )}
              {selectedRequest.requestStatus === 'VERIFIED' && (
                <button
                  onClick={() => setAssignTeamModalOpen(true)}
                  className="px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold"
                >
                  Dispatch Response Unit
                </button>
              )}
              {selectedRequest.requestStatus === 'ASSIGNED' && (
                <button
                  onClick={() => handleResolveRequest(selectedRequest.helpRequestId)}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold"
                >
                  Mark Resolved
                </button>
              )}
              <button
                onClick={() => setSelectedRequest(null)}
                className="px-4 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-surface-subtext text-xs font-bold ml-auto"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Response Team Modal */}
      {assignTeamModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white dark:bg-surface-darkCard border border-surface-border dark:border-surface-darkBorder rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-surface-border dark:border-surface-darkBorder">
              <h3 className="text-sm font-bold text-surface-text dark:text-surface-darkText flex items-center gap-2">
                <Users className="w-4 h-4 text-brand" />
                <span>Assign Response Team</span>
              </h3>
              <button 
                onClick={() => setAssignTeamModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-surface-subtext">
                Assign an on-duty emergency rescue squad to incident <strong>{selectedRequest?.requestNumber}</strong> in {selectedRequest?.locationName}.
              </p>

              <div>
                <label className="block font-bold text-surface-subtext mb-1">Available Ready Units</label>
                <select
                  value={selectedTeam}
                  onChange={(e) => setSelectedTeam(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-bold rounded-xl bg-slate-50 dark:bg-surface-darkSidebar border border-surface-border dark:border-surface-darkBorder text-surface-text dark:text-surface-darkText focus:outline-none cursor-pointer"
                >
                  <option value="team-sabaragamuwa-01">Sri Lanka Army 58th Division Rescue (Ratnapura Base)</option>
                  <option value="team-sabaragamuwa-02">Special Task Force (STF) Swift Water Rescue</option>
                  <option value="team-southern-01">Sri Lanka Navy Rapid Action Boat Squad (Galle Base)</option>
                  <option value="team-western-01">Colombo Municipal Fire & Rescue Brigade</option>
                </select>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setAssignTeamModalOpen(false)}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-surface-subtext text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleAssignTeamSubmit}
                className="px-4 py-1.5 rounded-xl bg-brand hover:bg-brand-hover text-white text-xs font-bold"
              >
                Confirm Dispatch
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
