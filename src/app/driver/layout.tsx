'use client';
import { useAuth } from '@/context/AuthContext';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Truck, LayoutDashboard, MapPin, Camera, Package, FileText, Bell, LogOut } from 'lucide-react';
import s from './driver.module.css';

const NAV_ITEMS = [
  { href: '/driver/dashboard', icon: LayoutDashboard, label: 'Beranda' },
  { href: '/driver/rute', icon: MapPin, label: 'Rute' },
  { href: '/driver/foto-kendaraan', icon: Camera, label: 'Foto' },
  { href: '/driver/muatan', icon: Package, label: 'Muatan' },
  { href: '/driver/surat-jalan', icon: FileText, label: 'Surat' },
];

export default function DriverLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  return (
    <div className={s.driverLayout}>
      <header className={s.topbar}>
        <div className={s.topbarLeft}>
          <div className={s.topbarLogo}><Truck size={18} /></div>
          <span className={s.topbarBrand}>LogiTrack</span>
        </div>
        <div className={s.topbarRight}>
          <button className={s.topNotif} aria-label="Notifikasi">
            <Bell size={16} />
            <span className={s.topNotifDot} />
          </button>
          <button className={s.topNotif} onClick={logout} aria-label="Keluar" title="Keluar">
            <LogOut size={16} />
          </button>
        </div>
      </header>

      <main className={s.content}>{children}</main>

      <nav className={s.bottomNav}>
        {NAV_ITEMS.map(item => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} className={`${s.navItem} ${active ? s.active : ''}`}>
              <Icon size={20} />
              <span>{item.label}</span>
              <span className={s.navDot} />
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
