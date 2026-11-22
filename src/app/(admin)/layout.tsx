import React from 'react';
import AdminLayout from '@/components/layout/AdminLayout';

export default function DashboardAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayout>{children}</AdminLayout>;
}
