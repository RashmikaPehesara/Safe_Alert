'use client';

import React, { useState } from 'react';
import { 
  Users, 
  ShieldCheck, 
  UserCheck, 
  UserX, 
  Search, 
  Filter, 
  Plus, 
  CheckCircle2, 
  X,
  Mail,
  Phone,
  Calendar
} from 'lucide-react';

const MOCK_USERS = [
  {
    userId: 'usr-01',
    firstName: 'Anura',
    lastName: 'Perera',
    userName: 'anura.perera',
    email: 'coordinator@safealert.gov.lk',
    phoneNumber: '+94 77 123 4567',
    roleId: 'role-admin',
    roleName: 'National Disaster Coordinator',
    isActive: true,
    isVerified: true,
    preferredLanguage: 'EN',
    lastLoginAt: 'Today 16:25 SLST',
    createdAt: '2025-01-10'
  },
  {
    userId: 'usr-02',
    firstName: 'Sunil',
    lastName: 'Dissanayake',
    userName: 'sunil.diss',
    email: 'sunil.d@dmc.gov.lk',
    phoneNumber: '+94 71 234 5678',
    roleId: 'role-officer',
    roleName: 'District Emergency Officer (Ratnapura)',
    isActive: true,
    isVerified: true,
    preferredLanguage: 'SI',
    lastLoginAt: 'Today 15:40 SLST',
    createdAt: '2025-02-14'
  },
  {
    userId: 'usr-03',
    firstName: 'Praveen',
    lastName: 'Kandasamy',
    userName: 'praveen.k',
    email: 'praveen.k@meteo.gov.lk',
    phoneNumber: '+94 77 987 6543',
    roleId: 'role-analyst',
    roleName: 'Senior Hydrological Meteorologist',
    isActive: true,
    isVerified: true,
    preferredLanguage: 'TA',
    lastLoginAt: 'Today 14:15 SLST',
    createdAt: '2025-03-01'
  },
  {
    userId: 'usr-04',
    firstName: 'Malini',
    lastName: 'Jayawardena',
    userName: 'malini.j',
    email: 'malini.j@nbro.gov.lk',
    phoneNumber: '+94 70 345 6789',
    roleId: 'role-geotech',
    roleName: 'NBRO Geotechnical Officer',
    isActive: true,
    isVerified: true,
    preferredLanguage: 'SI',
    lastLoginAt: 'Yesterday 18:20 SLST',
    createdAt: '2025-03-15'
  },
  {
    userId: 'usr-05',
    firstName: 'Chaminda',
    lastName: 'Silva',
    userName: 'chaminda.silva',
    email: 'silva.c@police.gov.lk',
    phoneNumber: '+94 72 456 7890',
    roleId: 'role-responder',
    roleName: 'Field Rescue Team Leader',
    isActive: false,
    isVerified: true,
    preferredLanguage: 'EN',
    lastLoginAt: '3 days ago',
    createdAt: '2025-04-10'
  }
];

export default function UserManagementPage() {
  const [users, setUsers] = useState(MOCK_USERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [selectedUser, setSelectedUser] = useState<typeof MOCK_USERS[0] | null>(null);

  const filteredUsers = users.filter((u) => {
    const fullName = `${u.firstName} ${u.lastName}`.toLowerCase();
    const matchesSearch = fullName.includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase()) || u.userName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || u.roleName.toLowerCase().includes(roleFilter.toLowerCase());
    return matchesSearch && matchesRole;
  });

  const handleToggleActive = (userId: string) => {
    setUsers(prev => prev.map(u => {
      if (u.userId === userId) {
        const nextState = !u.isActive;
        alert(`Account for ${u.firstName} ${u.lastName} is now ${nextState ? 'ACTIVATED' : 'SUSPENDED'}.`);
        return { ...u, isActive: nextState };
      }
      return u;
    }));
  };

  const activeCount = users.filter(u => u.isActive).length;

  return (
    <div className="space-y-6 pb-12 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-surface-border dark:border-surface-darkBorder">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold tracking-tight text-surface-text dark:text-surface-darkText flex items-center gap-2">
            <span>EOC User Management & Role Permissions</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-brand border border-teal-200 dark:bg-teal-950 dark:text-brand-glow">
              RBAC Security
            </span>
          </h1>
          <p className="text-xs text-surface-subtext mt-0.5">
            Administer government coordinator privileges, meteorologist credentials, and field commander authentication.
          </p>
        </div>

        <button
          onClick={() => alert('New User Provisioning Modal initialized with Gov.lk single sign-on.')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand hover:bg-brand-hover text-white text-xs font-bold shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Provision Coordinator Account</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="rounded-2xl bg-white dark:bg-surface-darkCard border border-surface-border dark:border-surface-darkBorder p-4 shadow-sm">
          <span className="text-xs font-bold text-surface-subtext uppercase">Active Staff Accounts</span>
          <div className="mt-1 text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">{activeCount} Users</div>
          <p className="text-xs text-surface-subtext mt-0.5">Authorized for emergency broadcast</p>
        </div>

        <div className="rounded-2xl bg-white dark:bg-surface-darkCard border border-surface-border dark:border-surface-darkBorder p-4 shadow-sm">
          <span className="text-xs font-bold text-surface-subtext uppercase">Disaster Commanders</span>
          <div className="mt-1 text-2xl font-extrabold text-surface-text dark:text-surface-darkText">2 Officers</div>
          <p className="text-xs text-surface-subtext mt-0.5">Ministry & EOC executive tier</p>
        </div>

        <div className="rounded-2xl bg-white dark:bg-surface-darkCard border border-surface-border dark:border-surface-darkBorder p-4 shadow-sm">
          <span className="text-xs font-bold text-surface-subtext uppercase">Specialist Analysts</span>
          <div className="mt-1 text-2xl font-extrabold text-brand dark:text-brand-glow">2 Specialists</div>
          <p className="text-xs text-surface-subtext mt-0.5">Meteorology & NBRO geotechnical</p>
        </div>

        <div className="rounded-2xl bg-white dark:bg-surface-darkCard border border-surface-border dark:border-surface-darkBorder p-4 shadow-sm">
          <span className="text-xs font-bold text-surface-subtext uppercase">Security Compliance</span>
          <div className="mt-1 text-2xl font-extrabold text-purple-600 dark:text-purple-400">100% MFA</div>
          <p className="text-xs text-surface-subtext mt-0.5">Hardware token & OTP enforced</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-3.5 rounded-2xl bg-white dark:bg-surface-darkCard border border-surface-border dark:border-surface-darkBorder shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, email, or username..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-surface-darkSidebar border border-surface-border dark:border-surface-darkBorder text-surface-text dark:text-surface-darkText focus:outline-none focus:border-brand"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs font-bold rounded-xl bg-slate-50 dark:bg-surface-darkSidebar border border-surface-border dark:border-surface-darkBorder text-surface-text dark:text-surface-darkText focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Roles</option>
            <option value="Coordinator">Coordinators</option>
            <option value="Officer">District Officers</option>
            <option value="Meteorologist">Meteorologists</option>
            <option value="Geotechnical">NBRO Officers</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-2xl bg-white dark:bg-surface-darkCard border border-surface-border dark:border-surface-darkBorder shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-surface-darkSidebar text-surface-subtext uppercase text-[10px] font-bold border-b border-surface-border dark:border-surface-darkBorder">
              <tr>
                <th className="py-3 px-4">User Identity</th>
                <th className="py-3 px-4">Assigned Role</th>
                <th className="py-3 px-4">Official Contact</th>
                <th className="py-3 px-4 text-center">Language</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4">Last Login</th>
                <th className="py-3 px-4 text-right">Admin Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border dark:divide-surface-darkBorder">
              {filteredUsers.map((u) => (
                <tr key={u.userId} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-bold text-surface-text dark:text-surface-darkText">{u.firstName} {u.lastName}</div>
                    <div className="text-[10px] text-surface-subtext font-mono">@{u.userName}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-surface-text dark:text-surface-darkText">{u.roleName}</span>
                  </td>
                  <td className="py-3 px-4 text-surface-subtext font-medium">
                    <div>{u.email}</div>
                    <div className="text-[10px]">{u.phoneNumber}</div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-surface-subtext font-bold text-[10px]">
                      {u.preferredLanguage}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center whitespace-nowrap">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full
                      ${u.isActive ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'}
                    `}>
                      {u.isActive ? 'ACTIVE' : 'SUSPENDED'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-surface-subtext whitespace-nowrap">
                    {u.lastLoginAt}
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap space-x-2">
                    <button
                      onClick={() => setSelectedUser(u)}
                      className="text-xs font-bold text-brand hover:underline"
                    >
                      Profile
                    </button>
                    <button
                      onClick={() => handleToggleActive(u.userId)}
                      className={`text-xs font-bold hover:underline ${u.isActive ? 'text-rose-600' : 'text-emerald-600'}`}
                    >
                      {u.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Inspection Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white dark:bg-surface-darkCard border border-surface-border dark:border-surface-darkBorder rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-surface-border dark:border-surface-darkBorder">
              <h3 className="text-base font-bold text-surface-text dark:text-surface-darkText">
                User Details & Security Credentials
              </h3>
              <button 
                onClick={() => setSelectedUser(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-surface-darkSidebar border border-surface-border dark:border-surface-darkBorder space-y-2">
                <div className="flex justify-between">
                  <span className="text-surface-subtext">Full Name:</span>
                  <strong className="text-surface-text dark:text-surface-darkText">{selectedUser.firstName} {selectedUser.lastName}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-surface-subtext">Username:</span>
                  <strong className="text-surface-text dark:text-surface-darkText">@{selectedUser.userName}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-surface-subtext">Official Role:</span>
                  <strong className="text-brand">{selectedUser.roleName}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-surface-subtext">Government Email:</span>
                  <strong className="text-surface-text dark:text-surface-darkText">{selectedUser.email}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-surface-subtext">Secure Phone:</span>
                  <strong className="text-surface-text dark:text-surface-darkText">{selectedUser.phoneNumber}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-surface-subtext">Preferred Language:</span>
                  <strong className="text-surface-text dark:text-surface-darkText">{selectedUser.preferredLanguage === 'SI' ? 'Sinhala' : selectedUser.preferredLanguage === 'TA' ? 'Tamil' : 'English'}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-surface-subtext">MFA Status:</span>
                  <strong className="text-emerald-600">Hardware FIDO2 Enforced</strong>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedUser(null)}
                className="px-4 py-1.5 rounded-xl bg-brand text-white text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
