'use client';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Warehouse, LayoutDashboard, Box, Thermometer,
  ArrowLeftRight, Video, Bell, LogOut, User, Menu,
  Map
} from 'lucide-react';
import { ToastProvider } from './components/ToastProvider';
import { getWarehouse } from '@/data/mock';
import s from './warehouse.module.css';

const NAV = [
  { section: 'Utama' },
  { href: '/warehouse/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { section: 'Operasional' },
  { href: '/warehouse/inventori', icon: Box, label: 'Inventori' },
  { href: '/warehouse/cold-storage', icon: Thermometer, label: 'Cold Storage' },
  { href: '/warehouse/transfer', icon: ArrowLeftRight, label: 'Transfer Barang' },
  { section: 'Monitoring' },
  { href: '/warehouse/monitoring', icon: Map, label: 'Peta Perpindahan' },
  { href: '/warehouse/cctv', icon: Video, label: 'CCTV' },
] as const;

export default function WarehouseLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const warehouse = user?.warehouseId ? getWarehouse(user.warehouseId) : null;

  return (
    <ToastProvider>
      <div className={s.warehouseLayout}>
        {/* Mobile Overlay */}
        <div
          className={`${s.sidebarOverlay} ${isSidebarOpen ? s.show : ''}`}
          onClick={() => setIsSidebarOpen(false)}
        />

        <aside className={`${s.sidebar} ${isSidebarOpen ? s.open : ''}`}>
          <div className={s.sidebarHeader}>
            <div className={s.sidebarLogo}><Warehouse size={20} /></div>
            <span className={s.sidebarBrand}>Warehouse</span>
          </div>
          <nav className={s.sidebarNav}>
            {NAV.map((item, i) => {
              if ('section' in item) return <div key={i} className={s.navSection}>{item.section}</div>;
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link key={item.href + i} href={item.href} className={`${s.navLink} ${active ? s.active : ''}`} onClick={() => setIsSidebarOpen(false)}>
                  <Icon size={18} className={s.navIcon} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
          <div className={s.sidebarFooter}>
            <button className={s.logoutBtn} onClick={logout}>
              <LogOut size={18} /> Keluar
            </button>
          </div>
        </aside>

        <div className={s.mainArea}>
          <header className={s.topbar}>
            <div className={s.topbarLeft}>
              <button className={s.menuBtn} onClick={() => setIsSidebarOpen(true)}>
                <Menu size={20} />
              </button>
              <h1 className={s.pageTitle}>
                {warehouse?.name || 'Warehouse Portal'}
                <span style={{ fontSize: 12, fontWeight: 400, color: '#64748B', marginLeft: 8 }}>
                  — {warehouse?.city || ''}
                </span>
              </h1>
            </div>
            <div className={s.topbarRight}>
              <button className={s.notifBtn} aria-label="Notifikasi">
                <Bell size={18} />
                <span className={s.notifDot} />
              </button>
              <div className={s.userInfo}>
                <div className={s.userAvatar}><User size={16} /></div>
                <div>
                  <div className={s.userName}>{user?.name || 'Staff'}</div>
                  <div className={s.userRole}>Petugas Gudang</div>
                </div>
              </div>
            </div>
          </header>
          <main className={s.content}>{children}</main>
        </div>
      </div>
    </ToastProvider>
  );
}
