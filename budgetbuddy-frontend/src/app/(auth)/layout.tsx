import { ReactNode } from 'react';
import Sidebar from '../../components/Sidebar';
import UserMenu from '@/components/UserMenu';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 ml-64 p-6 bg-gray-100 min-h-screen wavy-bg">{children}</main>
      <UserMenu />
    </div>
  );
}