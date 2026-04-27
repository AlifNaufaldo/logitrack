'use client';
import { assignments, getWarehouse, getTruck, getItem, drivers, trucks } from '@/data/mock';
import { Navigation, Package, Clock, CheckCircle, Truck, MapPin, Camera } from 'lucide-react';
import Link from 'next/link';
import s from '../driver.module.css';

export default function DriverDashboard() {
  const driverId = 'DRV-001';
  const driver = drivers.find(d => d.id === driverId)!;
  const assignment = assignments.find(a => a.driverId === driverId);
  const truck = assignment ? getTruck(assignment.truckId) : null;

  const arrivedCount = assignment?.route.filter(r => r.status === 'arrived').length || 0;
  const totalStops = assignment?.route.length || 0;
  const totalItems = assignment?.items.reduce((sum, i) => sum + i.quantity, 0) || 0;

  return (
    <div>
      <h1 className={s.pageTitle}>Halo, {driver.name}!</h1>
      <p className={s.pageDesc}>Berikut ringkasan penugasan hari ini.</p>

      <div className={s.statsGrid}>
        <div className={s.miniStat}>
          <div className={`${s.miniStatIcon} green`}><Navigation size={18} /></div>
          <div className={s.miniStatValue}>{arrivedCount}/{totalStops}</div>
          <div className={s.miniStatLabel}>Checkpoint Tercapai</div>
        </div>
        <div className={s.miniStat}>
          <div className={`${s.miniStatIcon} blue`}><Package size={18} /></div>
          <div className={s.miniStatValue}>{totalItems}</div>
          <div className={s.miniStatLabel}>Total Barang</div>
        </div>
        <div className={s.miniStat}>
          <div className={`${s.miniStatIcon} amber`}><Truck size={18} /></div>
          <div className={s.miniStatValue}>{truck?.plateNumber || '-'}</div>
          <div className={s.miniStatLabel}>{truck?.type || 'Belum Assign'}</div>
        </div>
        <div className={s.miniStat}>
          <div className={`${s.miniStatIcon} red`}><Clock size={18} /></div>
          <div className={s.miniStatValue}>{assignment ? 'Aktif' : '-'}</div>
          <div className={s.miniStatLabel}>Status Tugas</div>
        </div>
      </div>

      {assignment && (
        <div className={s.card}>
          <div className={s.cardHeader}>
            <span className={s.cardTitle}>Rute Hari Ini</span>
            <span className={`${s.badge} ${s.badgeGreen}`}>{assignment.id}</span>
          </div>
          <div className={s.cardBody}>
            <div className={s.routeTimeline}>
              {assignment.route.map((stop, i) => {
                const wh = getWarehouse(stop.warehouseId);
                return (
                  <div key={i} className={s.routeStop}>
                    <div className={s.routeLine}>
                      <div className={`${s.routeDot} ${stop.status === 'arrived' ? s.arrived : stop.status === 'en_route' ? s.enRoute : ''}`} />
                      {i < assignment.route.length - 1 && <div className={s.routeConnector} />}
                    </div>
                    <div className={s.routeContent}>
                      <div className={s.routePlace}>{wh?.name}</div>
                      <div className={s.routeCity}>{wh?.city}</div>
                      {stop.status === 'arrived' && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4, fontSize: 12, color: 'var(--color-accent)' }}>
                          <CheckCircle size={12} /> Sudah Sampai
                        </div>
                      )}
                      {stop.status === 'en_route' && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4, fontSize: 12, color: 'var(--color-warning)' }}>
                          <Navigation size={12} /> Sedang Menuju
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
        <Link href="/driver/absensi" style={{ textDecoration: 'none' }}>
          <button className={`${s.btn} ${s.btnAccent}`}><Camera size={18} /> Absensi Sekarang</button>
        </Link>
        <Link href="/driver/rute" style={{ textDecoration: 'none' }}>
          <button className={`${s.btn} ${s.btnOutline}`}><MapPin size={18} /> Lihat Detail Rute</button>
        </Link>
      </div>
    </div>
  );
}
