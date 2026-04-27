'use client';
import { useState } from 'react';
import { assignments, getWarehouse, formatTime } from '@/data/mock';
import { MapPin, Clock, Navigation, CheckCircle, ChevronRight } from 'lucide-react';
import s from '../driver.module.css';

export default function RutePage() {
  const assignment = assignments.find(a => a.driverId === 'DRV-001')!;
  const [stops, setStops] = useState(assignment.route);

  const handleArrive = (idx: number) => {
    setStops(prev => prev.map((st, i) => i === idx ? { ...st, status: 'arrived' as const, actualArrival: new Date().toISOString() } : st));
  };

  const estimateDuration = (i: number) => {
    const durations = ['—', '~1 jam 30 mnt', '~1 jam 45 mnt', '~2 jam 15 mnt'];
    return durations[i] || '~1 jam';
  };

  return (
    <div>
      <h1 className={s.pageTitle}>Rute Pengiriman</h1>
      <p className={s.pageDesc}>Rute yang sudah di-assign dan estimasi waktu per titik.</p>

      <div className={s.card} style={{ marginBottom: 16 }}>
        <div className={s.cardHeader}>
          <span className={s.cardTitle}>Penugasan {assignment.id}</span>
          <span className={`${s.badge} ${s.badgeGreen}`}>
            {stops.filter(st => st.status === 'arrived').length}/{stops.length} selesai
          </span>
        </div>
        <div className={s.cardBody}>
          <div className={s.routeTimeline}>
            {stops.map((stop, i) => {
              const wh = getWarehouse(stop.warehouseId);
              return (
                <div key={i} className={s.routeStop}>
                  <div className={s.routeLine}>
                    <div className={`${s.routeDot} ${stop.status === 'arrived' ? s.arrived : stop.status === 'en_route' ? s.enRoute : ''}`} />
                    {i < stops.length - 1 && <div className={s.routeConnector} />}
                  </div>
                  <div className={s.routeContent}>
                    <div className={s.routePlace}>{wh?.name}</div>
                    <div className={s.routeCity}>{wh?.city} — {wh?.address}</div>
                    <div className={s.routeEta}>
                      <Clock size={12} /> Est: {formatTime(stop.estimatedArrival)}
                      {i > 0 && <span style={{ marginLeft: 8, color: 'var(--color-text-muted)' }}>({estimateDuration(i)})</span>}
                    </div>
                    {stop.actualArrival && (
                      <div style={{ fontSize: 12, color: 'var(--color-accent)', display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                        <CheckCircle size={12} /> Tiba: {formatTime(stop.actualArrival)}
                      </div>
                    )}
                    {stop.status === 'en_route' && (
                      <div className={s.routeAction}>
                        <button className={s.arriveBtn} onClick={() => handleArrive(i)}>
                          <CheckCircle size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                          Saya Sudah Sampai
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
