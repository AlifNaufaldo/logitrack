'use client';
import { useState, useMemo } from 'react';
import { drivers, assignments, warehouses, trucks, getWarehouse, formatTime } from '@/data/mock';
import { Truck, Users, MapPin, AlertTriangle, Clock, Navigation, Maximize2, Minimize2, PackageCheck, Building2 } from 'lucide-react';
import dynamic from 'next/dynamic';
import type { ComponentType } from 'react';
import type { Driver, Warehouse as WarehouseType } from '@/data/mock';
import s from './dashboard.module.css';

interface MapViewProps {
  drivers: Driver[];
  warehouses: WarehouseType[];
  selectedDriver: string | null;
  onSelectDriver: (id: string) => void;
  routeWarehouses: WarehouseType[];
}

const MapView = dynamic(
  () => import('@/app/admin/dashboard/MapView').then((mod) => mod as { default: ComponentType<MapViewProps> }),
  {
    ssr: false,
    loading: () => <div className={s.mapPlaceholder}><MapPin size={48} /><span>Memuat peta...</span></div>,
  }
);

export default function AdminDashboard() {
  const [selectedDriver, setSelectedDriver] = useState<string | null>('DRV-001');
  const [search, setSearch] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const filteredDrivers = useMemo(() =>
    drivers.filter(d => d.name.toLowerCase().includes(search.toLowerCase())),
    [search]
  );

  const onTrip = drivers.filter(d => d.status === 'on_trip').length;
  const available = drivers.filter(d => d.status === 'active').length;
  const truckActive = trucks.filter(t => t.status === 'in_use').length;

  // Calculate new stats
  const totalBarangTerkirim = assignments.reduce((sum, asg) => {
    return sum + asg.items.reduce((itemSum, item) => itemSum + item.quantity, 0);
  }, 0);
  const totalGudang = warehouses.length;

  const selectedAssignment = selectedDriver ? assignments.find(a => a.driverId === selectedDriver) : null;

  const routeWarehouses = useMemo(() => {
    if (!selectedAssignment) return [];
    return selectedAssignment.route
      .map(r => getWarehouse(r.warehouseId))
      .filter((w): w is WarehouseType => w !== undefined);
  }, [selectedAssignment]);

  return (
    <div className={s.dashboard}>
      {/* ─── Stats Row ─── */}
      <div className={s.statsRow}>
        <div className={s.statCard}>
          <div className={`${s.statIcon} blue`}><Users size={20} /></div>
          <div><div className={s.statValue}>{drivers.length}</div><div className={s.statLabel}>Total Sopir</div></div>
        </div>
        <div className={s.statCard}>
          <div className={`${s.statIcon} green`}><Navigation size={20} /></div>
          <div><div className={s.statValue}>{onTrip}</div><div className={s.statLabel}>Dalam Perjalanan</div></div>
        </div>
        <div className={s.statCard}>
          <div className={`${s.statIcon} amber`}><Truck size={20} /></div>
          <div><div className={s.statValue}>{truckActive}</div><div className={s.statLabel}>Truk Aktif</div></div>
        </div>
        <div className={s.statCard}>
          <div className={`${s.statIcon} red`}><AlertTriangle size={20} /></div>
          <div><div className={s.statValue}>{available}</div><div className={s.statLabel}>Sopir Standby</div></div>
        </div>
        <div className={s.statCard}>
          <div className={`${s.statIcon} purple`} style={{ background: '#F3E8FF', color: '#9333EA' }}><PackageCheck size={20} /></div>
          <div><div className={s.statValue}>{totalBarangTerkirim}</div><div className={s.statLabel}>Barang Terkirim</div></div>
        </div>
        <div className={s.statCard}>
          <div className={`${s.statIcon} cyan`} style={{ background: '#CFFAFE', color: '#0891B2' }}><Building2 size={20} /></div>
          <div><div className={s.statValue}>{totalGudang}</div><div className={s.statLabel}>Gudang Terdaftar</div></div>
        </div>
      </div>

      {/* ─── Main Grid: Map (Left 2/3) | Right Column (Right 1/3) ─── */}
      <div className={s.mainGrid}>
        
        {/* ─── Map ─── */}
        <div className={`${s.mapContainer} ${isFullscreen ? s.fullscreen : ''}`}>
          <div className={s.mapControls}>
            <button className={s.mapBtn} title={isFullscreen ? 'Keluar Fullscreen' : 'Fullscreen'} onClick={() => setIsFullscreen(!isFullscreen)}>
              {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>
          </div>
          <MapView
            drivers={drivers}
            warehouses={warehouses}
            selectedDriver={selectedDriver}
            onSelectDriver={setSelectedDriver}
            routeWarehouses={routeWarehouses}
          />
          {selectedAssignment && routeWarehouses.length > 0 && (
            <div className={s.routeInfo}>
              <div className={s.routeInfoDot} />
              <span>
                <strong>{drivers.find(d => d.id === selectedDriver)?.name}</strong>
                {' — '}
                {routeWarehouses.map(w => w.code).join(' → ')}
              </span>
            </div>
          )}
        </div>

        {/* ─── Right Column (Dropdown + Timeline) ─── */}
        <div className={s.rightColumn}>
          
          {/* Driver Select Dropdown */}
          <div className={s.driverSelectPanel}>
            <div className={s.driverSelectLabel}>
              Pilih Sopir
              <span className={s.driverSelectCount}>{drivers.length} Total</span>
            </div>
            <select
              className={s.driverSelectBox}
              value={selectedDriver || ''}
              onChange={e => setSelectedDriver(e.target.value)}
            >
              <option value="" disabled>Pilih Sopir...</option>
              {drivers.map(d => (
                <option key={d.id} value={d.id}>
                  {d.name} {d.status === 'on_trip' ? '(Perjalanan)' : d.status === 'active' ? '(Standby)' : '(Offline)'}
                </option>
              ))}
            </select>
          </div>

          {/* Timeline Panel */}
          <div className={s.timelinePanel}>
            <div className={s.timelineHeader}>
              <span className={s.timelineTitle}>
                <Clock size={15} /> Timeline
              </span>
              {selectedAssignment && (
                <span className={s.timelineBadge} style={{ background: 'var(--color-accent-50)', color: 'var(--color-accent-dark)' }}>
                  {selectedAssignment.id}
                </span>
              )}
            </div>
            <div className={s.timelineBody}>
              {selectedAssignment ? (
                <div className={s.timeline}>
                  {selectedAssignment.route.map((stop, i) => {
                    const wh = getWarehouse(stop.warehouseId);
                    return (
                      <div key={i} className={s.timelineItem}>
                        <div className={s.timelineLine}>
                          <div className={`${s.timelineDot} ${stop.status === 'arrived' ? s.arrived : stop.status === 'en_route' ? s.enRoute : s.pending}`} />
                          {i < selectedAssignment.route.length - 1 && <div className={s.timelineConnector} />}
                        </div>
                        <div className={s.timelineContent}>
                          <div className={s.timelinePlace}>{wh?.name || stop.warehouseId}</div>
                          <div className={s.timelineCity}>{wh?.city} — {wh?.address}</div>
                          <div className={s.timelineTimes}>
                            <span className={`${s.timeTag} ${s.est}`}>Est: {formatTime(stop.estimatedArrival)}</span>
                            {stop.actualArrival && (
                              <span className={`${s.timeTag} ${s.actual}`}>Aktual: {formatTime(stop.actualArrival)}</span>
                            )}
                            {stop.status === 'en_route' && <span className={`${s.timeTag} ${s.moving}`}><Navigation size={11} /> Menuju</span>}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className={s.emptyTimeline}>
                  <MapPin size={32} style={{ opacity: 0.3 }} />
                  <span style={{ fontSize: 13 }}>Pilih sopir untuk melihat timeline</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
