'use client';

import React, { useState } from 'react';
import { 
  Users, 
  Home, 
  Phone, 
  MapPin, 
  CheckCircle2, 
  AlertCircle, 
  Search, 
  Filter, 
  Activity, 
  Plus,
  ShieldCheck
} from 'lucide-react';
import { ResponseTeam, Shelter } from '@/types/help-request.types';

// Mock response teams matching backend schema
const MOCK_RESPONSE_TEAMS = [
  {
    teamId: 'team-01',
    teamName: 'Sri Lanka Army 58 Division Swift Water Rescue',
    teamType: 'MILITARY_RESCUE',
    teamDescription: 'Equipped with motorized zodiac boats and high-angle slope rescue gear.',
    contactNumber: '+94 45 222 2222',
    locationId: 'loc-ratnapura',
    locationName: 'Ratnapura Central Camp',
    teamStatus: 'DISPATCHED',
    teamLeaderName: 'Major K. Wickramasinghe',
    membersCount: 24,
    activeMissions: 2
  },
  {
    teamId: 'team-02',
    teamName: 'Special Task Force (STF) Disaster Response Wing',
    teamType: 'PARAMILITARY_TACTICAL',
    teamDescription: 'Specialized in mudslide stabilization and trapped victim extraction.',
    contactNumber: '+94 36 222 3444',
    locationId: 'loc-kegalle',
    locationName: 'Deraniyagala Forward Base',
    teamStatus: 'AVAILABLE',
    teamLeaderName: 'Chief Inspector S. Perera',
    membersCount: 18,
    activeMissions: 0
  },
  {
    teamId: 'team-03',
    teamName: 'Sri Lanka Navy 4SBS Rapid Boat Squadron',
    teamType: 'NAVAL_BOAT_SQUAD',
    teamDescription: 'High-capacity fiberglass boats for deep flood plain evacuation.',
    contactNumber: '+94 91 223 4455',
    locationId: 'loc-galle',
    locationName: 'Galle Naval Command Base',
    teamStatus: 'AVAILABLE',
    teamLeaderName: 'Lt. Commander N. Fernando',
    membersCount: 30,
    activeMissions: 1
  },
  {
    teamId: 'team-04',
    teamName: 'Colombo Municipal Emergency Medical Corps',
    teamType: 'PARAMEDIC_TRIAGE',
    teamDescription: 'Mobile field ambulances, triage tents, and emergency oxygen supply.',
    contactNumber: '+94 11 269 1111',
    locationId: 'loc-colombo',
    locationName: 'Town Hall Central Station',
    teamStatus: 'AVAILABLE',
    teamLeaderName: 'Dr. M. Jayasinghe',
    membersCount: 16,
    activeMissions: 0
  }
];

// Mock emergency shelters matching backend schema
const MOCK_SHELTERS = [
  {
    shelterId: 'shl-01',
    shelterName: 'Ratnapura St. Aloysius Community Relief Center',
    address: 'High Level Road, Ratnapura',
    district: 'Ratnapura',
    contactNumber: '+94 45 222 8890',
    capacity: 650,
    currentOccupancy: 420,
    facilities: ['Clean Water Purification', 'Emergency Generator', 'Medical First Aid Post', 'Baby Nutrition Center'],
    shelterStatus: 'OPEN'
  },
  {
    shelterId: 'shl-02',
    shelterName: 'Kalutara Vidyaloka Emergency Evacuation Camp',
    address: 'Main Street, Kalutara South',
    district: 'Kalutara',
    contactNumber: '+94 34 222 4567',
    capacity: 500,
    currentOccupancy: 380,
    facilities: ['Hot Meals Kitchen', 'Backup Solar Power', 'Sanitary Pack Distribution'],
    shelterStatus: 'OPEN'
  },
  {
    shelterId: 'shl-03',
    shelterName: 'Deraniyagala Maha Vidyalaya Safe Ground',
    address: 'Maliboda Road, Deraniyagala',
    district: 'Kegalle',
    contactNumber: '+94 36 225 6789',
    capacity: 350,
    currentOccupancy: 340,
    facilities: ['Medical Tent', 'Satellite Phone Link', 'Clean Water Storage'],
    shelterStatus: 'AT_CAPACITY'
  },
  {
    shelterId: 'shl-04',
    shelterName: 'Baddegama Central College Gymnasium',
    address: 'Galle Road, Baddegama',
    district: 'Galle',
    contactNumber: '+94 91 229 1234',
    capacity: 450,
    currentOccupancy: 120,
    facilities: ['Ample Sleeping Cots', 'Power Generator', 'Volunteer Medical Ward'],
    shelterStatus: 'OPEN'
  }
];

export default function ResponseTeamsSheltersPage() {
  const [activeTab, setActiveTab] = useState<'shelters' | 'teams'>('shelters');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTeams = MOCK_RESPONSE_TEAMS.filter(t => 
    t.teamName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.locationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.teamLeaderName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredShelters = MOCK_SHELTERS.filter(s => 
    s.shelterName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalCapacity = MOCK_SHELTERS.reduce((acc, s) => acc + s.capacity, 0);
  const totalOccupancy = MOCK_SHELTERS.reduce((acc, s) => acc + s.currentOccupancy, 0);
  const availableSlots = totalCapacity - totalOccupancy;

  return (
    <div className="space-y-6 pb-12 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-surface-border dark:border-surface-darkBorder">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold tracking-tight text-surface-text dark:text-surface-darkText flex items-center gap-2">
            <span>First Responder Teams & Emergency Shelters</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-brand border border-teal-200 dark:bg-teal-950 dark:text-brand-glow">
              EOC Logistics
            </span>
          </h1>
          <p className="text-xs text-surface-subtext mt-0.5">
            Real-time tracking of military & rescue squad deployments, shelter capacity intakes, and relief stockpile readiness.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center p-0.5 rounded-xl bg-slate-100 dark:bg-surface-darkSidebar border border-surface-border dark:border-surface-darkBorder text-xs font-bold self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('shelters')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${activeTab === 'shelters' ? 'bg-white dark:bg-surface-darkCard text-brand shadow-xs' : 'text-surface-subtext'}`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>Emergency Shelters ({MOCK_SHELTERS.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('teams')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${activeTab === 'teams' ? 'bg-white dark:bg-surface-darkCard text-brand shadow-xs' : 'text-surface-subtext'}`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Responder Squads ({MOCK_RESPONSE_TEAMS.length})</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="rounded-2xl bg-white dark:bg-surface-darkCard border border-surface-border dark:border-surface-darkBorder p-4 shadow-sm">
          <span className="text-xs font-bold text-surface-subtext uppercase">Available Shelter Slots</span>
          <div className="mt-1 text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">{availableSlots} Vacancies</div>
          <p className="text-xs text-surface-subtext mt-0.5">Across 4 central relief complexes</p>
        </div>

        <div className="rounded-2xl bg-white dark:bg-surface-darkCard border border-surface-border dark:border-surface-darkBorder p-4 shadow-sm">
          <span className="text-xs font-bold text-surface-subtext uppercase">Shelter Occupancy Rate</span>
          <div className="mt-1 text-2xl font-extrabold text-surface-text dark:text-surface-darkText">
            {Math.round((totalOccupancy / totalCapacity) * 100)}%
          </div>
          <p className="text-xs text-surface-subtext mt-0.5">{totalOccupancy} of {totalCapacity} beds occupied</p>
        </div>

        <div className="rounded-2xl bg-white dark:bg-surface-darkCard border border-surface-border dark:border-surface-darkBorder p-4 shadow-sm">
          <span className="text-xs font-bold text-surface-subtext uppercase">Ready Responder Squads</span>
          <div className="mt-1 text-2xl font-extrabold text-brand dark:text-brand-glow">3 On Standby</div>
          <p className="text-xs text-surface-subtext mt-0.5">1 squad currently on active mission</p>
        </div>

        <div className="rounded-2xl bg-white dark:bg-surface-darkCard border border-surface-border dark:border-surface-darkBorder p-4 shadow-sm">
          <span className="text-xs font-bold text-surface-subtext uppercase">Total Field Personnel</span>
          <div className="mt-1 text-2xl font-extrabold text-purple-600 dark:text-purple-400">88 Rescuers</div>
          <p className="text-xs text-surface-subtext mt-0.5">Army, Navy, STF & Paramedics</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-3.5 rounded-2xl bg-white dark:bg-surface-darkCard border border-surface-border dark:border-surface-darkBorder shadow-sm flex items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            placeholder={activeTab === 'shelters' ? 'Search shelters by name, district, or address...' : 'Search squads by name, commander, or location...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-surface-darkSidebar border border-surface-border dark:border-surface-darkBorder text-surface-text dark:text-surface-darkText focus:outline-none focus:border-brand"
          />
        </div>

        <span className="text-xs font-bold text-surface-subtext">
          Showing {activeTab === 'shelters' ? filteredShelters.length : filteredTeams.length} records
        </span>
      </div>

      {/* Tab 1: Emergency Shelters Cards Grid */}
      {activeTab === 'shelters' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredShelters.map((shelter) => {
            const pct = Math.round((shelter.currentOccupancy / shelter.capacity) * 100);
            const isFull = pct >= 95;

            return (
              <div 
                key={shelter.shelterId}
                className="p-4 rounded-2xl bg-white dark:bg-surface-darkCard border border-surface-border dark:border-surface-darkBorder shadow-sm space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase
                        ${shelter.shelterStatus === 'OPEN' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'}
                      `}>
                        {shelter.shelterStatus === 'OPEN' ? 'Intake Open' : 'At Full Capacity'}
                      </span>
                      <h2 className="text-sm font-bold text-surface-text dark:text-surface-darkText mt-1.5">
                        {shelter.shelterName}
                      </h2>
                    </div>

                    <div className="text-right">
                      <div className="text-base font-extrabold text-surface-text dark:text-surface-darkText">
                        {shelter.currentOccupancy} / {shelter.capacity}
                      </div>
                      <span className="text-[10px] text-surface-subtext">{shelter.capacity - shelter.currentOccupancy} Free Slots</span>
                    </div>
                  </div>

                  <p className="text-xs text-surface-subtext mt-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-brand" />
                    <span>{shelter.address} · {shelter.district} District</span>
                  </p>

                  {/* Progress bar */}
                  <div className="mt-3">
                    <div className="flex justify-between text-[11px] font-bold text-surface-subtext mb-1">
                      <span>Occupancy: {pct}%</span>
                      <span>Max: {shelter.capacity} Beds</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all ${isFull ? 'bg-red-600' : pct > 75 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>

                  {/* Facilities Chips */}
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {shelter.facilities.map((fac, i) => (
                      <span key={i} className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-50 dark:bg-surface-darkSidebar border border-surface-border dark:border-surface-darkBorder text-surface-subtext">
                        ✓ {fac}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-surface-border dark:border-surface-darkBorder flex items-center justify-between text-xs">
                  <span className="text-surface-subtext font-mono flex items-center gap-1">
                    <Phone className="w-3 h-3 text-brand" />
                    <span>{shelter.contactNumber}</span>
                  </span>

                  <button 
                    onClick={() => alert(`Direct dispatch hotline opened for ${shelter.shelterName}`)}
                    className="text-xs font-bold text-brand hover:underline"
                  >
                    Direct Intake Hotline
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 2: Response Teams Cards Grid */}
      {activeTab === 'teams' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTeams.map((team) => (
            <div 
              key={team.teamId}
              className="p-4 rounded-2xl bg-white dark:bg-surface-darkCard border border-surface-border dark:border-surface-darkBorder shadow-sm space-y-3 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase
                      ${team.teamStatus === 'AVAILABLE' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300'}
                    `}>
                      {team.teamStatus}
                    </span>
                    <h2 className="text-sm font-bold text-surface-text dark:text-surface-darkText mt-1.5">
                      {team.teamName}
                    </h2>
                  </div>

                  <span className="text-xs font-bold px-2 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-surface-text dark:text-surface-darkText">
                    {team.membersCount} Rescuers
                  </span>
                </div>

                <p className="text-xs text-surface-subtext mt-1 leading-relaxed">
                  {team.teamDescription}
                </p>

                <div className="mt-3 p-2.5 rounded-xl bg-slate-50 dark:bg-surface-darkSidebar border border-surface-border dark:border-surface-darkBorder space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-surface-subtext">Command Leader:</span>
                    <strong className="text-surface-text dark:text-surface-darkText">{team.teamLeaderName}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-surface-subtext">Forward Staging Base:</span>
                    <strong className="text-surface-text dark:text-surface-darkText">{team.locationName}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-surface-subtext">Active Missions:</span>
                    <strong className="text-brand">{team.activeMissions} In Progress</strong>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-surface-border dark:border-surface-darkBorder flex items-center justify-between text-xs">
                <span className="text-surface-subtext font-mono flex items-center gap-1">
                  <Phone className="w-3 h-3 text-brand" />
                  <span>{team.contactNumber}</span>
                </span>

                <button
                  onClick={() => alert(`Radio frequency dispatch patch opened for ${team.teamName}`)}
                  className="text-xs font-bold text-brand hover:underline"
                >
                  Radio Comms Patch
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
