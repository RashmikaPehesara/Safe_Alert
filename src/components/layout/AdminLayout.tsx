'use client';

import React, { useState } from 'react';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-surface-bg dark:bg-surface-darkBg text-surface-text dark:text-surface-darkText flex flex-col font-sans transition-colors duration-150">
      {/* Sidebar Navigation */}
      <AdminSidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* Main Content Area */}
      <div 
        className={`flex-1 flex flex-col transition-all duration-200 ease-in-out
          ${isCollapsed ? 'lg:pl-20' : 'lg:pl-72'}
        `}
      >
        {/* Top Header */}
        <AdminHeader
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
          setIsMobileOpen={setIsMobileOpen}
        />

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
