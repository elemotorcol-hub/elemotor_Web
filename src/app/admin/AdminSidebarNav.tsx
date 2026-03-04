'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Car, Users, Settings, LucideIcon } from 'lucide-react';

export default function AdminSidebarNav() {
  const pathname = usePathname();

  const navItems = [
    {
      name: 'Dashboard',
      href: '/admin',
      icon: LayoutDashboard,
      // Match exacto para root o derivado de dashboard
      isActive: pathname === '/admin' || pathname === '/admin/dashboard',
    },
    {
      name: 'Inventario',
      href: '/admin/inventory',
      icon: Car,
      isActive: pathname.startsWith('/admin/inventory'),
    },
    {
      name: 'CRM',
      href: '/admin/crm',
      icon: Users,
      isActive: pathname.startsWith('/admin/crm'),
    },
    {
      name: 'Ajustes',
      href: '/admin/settings',
      icon: Settings,
      isActive: pathname.startsWith('/admin/settings'),
    },
  ];

  return (
    <nav className="flex flex-1 flex-col gap-1.5 overflow-y-auto px-3 py-2">
      {navItems.map((item) => {
        const Icon = item.icon;

        return (
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${item.isActive
              ? 'border border-[#10B981]/20 bg-[#10B981]/10 text-[#10B981] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] shadow-[#10B981]/10'
              : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
              }`}
          >
            <Icon size={18} />
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
}
