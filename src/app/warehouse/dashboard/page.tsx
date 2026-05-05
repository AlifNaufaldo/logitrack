'use client';
import { useAuth } from '@/context/AuthContext';
import { coldRooms, stockMovements, warehouseStaff, getItem, formatTime } from '@/data/mock';
import { Box, Thermometer, ArrowUpRight, ArrowDownLeft, Clock, Users, Activity, Coffee, Zap } from 'lucide-react';
import s from '../warehouse.module.css';

export default function WarehouseDashboard() {
  const { user } = useAuth();
  const warehouseId = user?.warehouseId || 'WH-001';

  const myRooms = coldRooms.filter(r => r.warehouseId === warehouseId);
  const myMovements = stockMovements.filter(m => m.warehouseId === warehouseId)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const totalItems = myMovements.reduce((acc, m) => acc + (m.type === 'in' ? m.quantity : -m.quantity), 0);
  const roomsWarning = myRooms.filter(r => r.status === 'warning').length;
  const roomsDanger = myRooms.filter(r => r.status === 'danger').length;

  const movementsToday = myMovements.filter(m => {
    const today = new Date().toISOString().split('T')[0];
    return m.timestamp.startsWith(today);
  });

  const incomingToday = movementsToday.filter(m => m.type === 'in').length;
  const outgoingToday = movementsToday.filter(m => m.type === 'out').length;

  const staffList = Object.entries(warehouseStaff);

  const statusConfig = {
    active: { label: 'Aktif', color: '#10B981', bg: '#ECFDF5', icon: <Zap size={10} /> },
    idle:   { label: 'Standby', color: '#0EA5E9', bg: '#F0F9FF', icon: <Activity size={10} /> },
    break:  { label: 'Istirahat', color: '#F59E0B', bg: '#FFFBEB', icon: <Coffee size={10} /> },
  };

  return (
    <div className={s.dashboard}>
      <div className={s.statsRow}>
        <div className={s.statCard}>
          <div className={`${s.statIcon} blue`}><Box size={24} /></div>
          <div>
            <div className={s.statValue}>{totalItems}</div>
            <div className={s.statLabel}>Total Stok Barang</div>
          </div>
        </div>
        <div className={s.statCard}>
          <div className={`${s.statIcon} amber`}><Thermometer size={24} /></div>
          <div>
            <div className={s.statValue}>{roomsWarning + roomsDanger}</div>
            <div className={s.statLabel}>Alert Cold Room</div>
          </div>
        </div>
        <div className={s.statCard}>
          <div className={`${s.statIcon} green`}><ArrowDownLeft size={24} /></div>
          <div>
            <div className={s.statValue}>{incomingToday}</div>
            <div className={s.statLabel}>Barang Masuk Hari Ini</div>
          </div>
        </div>
        <div className={s.statCard}>
          <div className={`${s.statIcon} red`}><ArrowUpRight size={24} /></div>
          <div>
            <div className={s.statValue}>{outgoingToday}</div>
            <div className={s.statLabel}>Barang Keluar Hari Ini</div>
          </div>
        </div>
      </div>

      <div className={s.dashboardGrid}>
        <div className={s.section}>
          <div className={s.sectionHeader}>
            <div className={s.sectionTitle}><Thermometer size={18} /> Cold Storage Status</div>
          </div>
          <div className={s.coldRoomGrid}>
            {myRooms.map(room => (
              <div key={room.id} className={s.coldRoomCard}>
                <div className={s.roomHeader}>
                  <div className={s.roomName}>{room.name}</div>
                  <div className={`${s.tempStatus} ${s[room.status]}`}>
                    {room.status.toUpperCase()}
                  </div>
                </div>
                <div className={s.roomTemp} style={{ color: room.status === 'danger' ? '#EF4444' : room.status === 'warning' ? '#F59E0B' : '#0EA5E9' }}>
                  {room.currentTemp.toFixed(1)}°C
                </div>
                <div className={s.capacityBar}>
                  <div
                    className={s.capacityFill}
                    style={{
                      width: `${(room.usedCapacity / room.capacity) * 100}%`,
                      backgroundColor: (room.usedCapacity / room.capacity) > 0.9 ? '#EF4444' : '#0EA5E9'
                    }}
                  />
                </div>
                <div className={s.capacityLabel}>
                  <span>Kapasitas</span>
                  <span>{room.usedCapacity} / {room.capacity} unit</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={s.section}>
          <div className={s.sectionHeader}>
            <div className={s.sectionTitle}><Clock size={18} /> Aktivitas Terkini</div>
          </div>
          <ul className={s.activityList}>
            {myMovements.slice(0, 6).map(m => (
              <li key={m.id} className={s.activityItem}>
                <div className={s.activityIcon} style={{ backgroundColor: m.type === 'in' ? '#ECFDF5' : '#FEF2F2', color: m.type === 'in' ? '#10B981' : '#EF4444' }}>
                  {m.type === 'in' ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                </div>
                <div className={s.activityContent}>
                  <div className={s.activityText}>
                    <strong>{getItem(m.itemId)?.name}</strong> {m.type === 'in' ? 'masuk ke' : 'keluar dari'} {m.toRoom || m.fromRoom}
                  </div>
                  <div className={s.activityTime}>{formatTime(m.timestamp)} — {m.quantity} {getItem(m.itemId)?.unit}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ─── Staff Activity Cards ─── */}
      <div className={s.section} style={{ marginTop: 24 }}>
        <div className={s.sectionHeader}>
          <div className={s.sectionTitle}><Users size={18} /> Staff Aktif Saat Ini</div>
          <div className={`${s.badge} ${s.in}`}>
            {staffList.filter(([, st]) => st.status === 'active').length} dari {staffList.length} staff
          </div>
        </div>

        <div style={{ padding: 20, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {staffList.filter(([, st]) => st.status === 'active').map(([id, staff]) => {
            const cfg = statusConfig[staff.status];
            return (
              <div key={id} style={{
                padding: 16, borderRadius: 14,
                border: '1px solid #E2E8F0',
                background: 'white',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
              }}>
                {/* Status accent line */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: cfg.color }} />

                {/* Header: Avatar + Name + Status */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 10,
                    background: `linear-gradient(135deg, ${cfg.color}22, ${cfg.color}44)`,
                    color: cfg.color, fontWeight: 800, fontSize: 13,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, border: `2px solid ${cfg.color}33`,
                  }}>
                    {staff.avatar}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>{staff.name}</div>
                    <div style={{ fontSize: 11, color: '#64748B' }}>{staff.role}</div>
                  </div>
                  <div style={{
                    fontSize: 10, fontWeight: 700, padding: '3px 8px',
                    borderRadius: 6, background: cfg.bg, color: cfg.color,
                    display: 'flex', alignItems: 'center', gap: 3, whiteSpace: 'nowrap',
                  }}>
                    {cfg.icon} {cfg.label}
                  </div>
                </div>

                {/* Current Task — flex:1 so it stretches to align across cards */}
                <div style={{
                  flex: 1,
                  padding: '10px 12px', borderRadius: 8,
                  background: '#F8FAFC', border: '1px solid #F1F5F9',
                  fontSize: 12, color: '#475569', lineHeight: 1.5,
                  display: 'flex', alignItems: 'flex-start', gap: 8,
                }}>
                  <Activity size={13} style={{ flexShrink: 0, marginTop: 2, color: cfg.color }} />
                  {staff.currentTask}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
