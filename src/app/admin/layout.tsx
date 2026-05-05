'use client';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Truck, LayoutDashboard, UserCheck, Upload, Package, BoxIcon, Warehouse, Users, Bell, LogOut, User, Menu } from 'lucide-react';
import s from './admin.module.css';

const NAV = [
  { section: 'Utama' },
  { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/assign', icon: UserCheck, label: 'Assign Sopir' },
  { href: '/admin/upload-excel', icon: Upload, label: 'Upload Excel' },
  { section: 'Master Data' },
  { href: '/admin/master/barang', icon: Package, label: 'Data Barang' },
  { href: '/admin/master/truk', icon: BoxIcon, label: 'Data Truk' },
  { href: '/admin/master/gudang', icon: Warehouse, label: 'Data Gudang' },
  { href: '/admin/master/sopir', icon: Users, label: 'Data Sopir' },
] as const;

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);



  return (
    <div className={s.adminLayout}>
      {/* Mobile Overlay */}
      <div 
        className={`${s.sidebarOverlay} ${isSidebarOpen ? s.show : ''}`} 
        onClick={() => setIsSidebarOpen(false)} 
      />

      <aside className={`${s.sidebar} ${isSidebarOpen ? s.open : ''}`}>
        <div className={s.sidebarHeader}>
          <div className={s.sidebarLogo}><Truck size={20} /></div>
          <span className={s.sidebarBrand}>LogiTrack</span>
        </div>
        <nav className={s.sidebarNav}>
          {NAV.map((item, i) => {
            if ('section' in item) return <div key={i} className={s.navSection}>{item.section}</div>;
            const Icon = item.icon;
            const active = pathname === item.href || (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));
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
              {(NAV.find(n => 'href' in n && pathname.startsWith(n.href)) as { label?: string } | undefined)?.label || 'Dashboard'}
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
                <div className={s.userName}>{user?.name || 'Admin'}</div>
                <div className={s.userRole}>Administrator</div>
              </div>
            </div>
          </div>
        </header>
        <main className={s.content}>{children}</main>
      </div>
    </div>
  );
}
