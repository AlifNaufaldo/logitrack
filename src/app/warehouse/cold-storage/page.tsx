'use client';
import { useAuth } from '@/context/AuthContext';
import { coldRooms, getWarehouse } from '@/data/mock';
import { Thermometer, TrendingUp, History, Info } from 'lucide-react';
import s from '../warehouse.module.css';

export default function WarehouseColdStorage() {
  const { user } = useAuth();
  const warehouseId = user?.warehouseId || 'WH-001';
  const warehouse = getWarehouse(warehouseId);
  const rooms = coldRooms.filter(r => r.warehouseId === warehouseId);

  const getColor = (status: string) => status === 'danger' ? '#EF4444' : status === 'warning' ? '#F59E0B' : '#0EA5E9';
  const pct = (r: typeof rooms[0]) => Math.round((r.usedCapacity / r.capacity) * 100);

  // Map rooms to layout positions (Room A=right, Room B=left, Room C=bottom-left area)
  const roomA = rooms[0]; // Cold Room A
  const roomB = rooms[1]; // Cold Room B
  const roomC = rooms[2]; // Cold Room C

  return (
    <div>
      {/* ─── Floor Plan ─── */}
      <div className={s.section} style={{ marginBottom: 24 }}>
        <div className={s.sectionHeader}>
          <div className={s.sectionTitle}><Thermometer size={18} /> Denah {warehouse?.name || 'Warehouse'}</div>
          <div style={{ fontSize: 12, color: '#64748B' }}>{warehouse?.address}</div>
        </div>

        <div style={{ padding: 20, overflowX: 'auto' }}>
          <svg viewBox="0 0 1000 600" style={{ width: '100%', height: 'auto', minHeight: 400, fontFamily: 'Inter, sans-serif' }}>

            {/* ── Outer Wall ── */}
            <rect x="10" y="10" width="980" height="580" rx="4" fill="none" stroke="#334155" strokeWidth="3" />

            {/* ── Divider Wall (center vertical) ── */}
            <line x1="500" y1="10" x2="500" y2="440" stroke="#334155" strokeWidth="3" />

            {/* ── Bottom Divider ── */}
            <line x1="10" y1="440" x2="990" y2="440" stroke="#334155" strokeWidth="2" />

            {/* ════════════ LEFT SIDE — Room B ════════════ */}
            {/* Room B label */}
            <text x="250" y="50" textAnchor="middle" fontSize="16" fontWeight="700" fill="#0F172A">
              {roomB ? roomB.name : 'Room B'}
            </text>

            {/* Entrance top-left */}
            <rect x="10" y="25" width="14" height="50" fill="#0EA5E9" rx="2" />
            <text x="5" y="55" fontSize="9" fill="#0EA5E9" fontWeight="600" transform="rotate(-90,18,55)">Entrance</text>

            {/* Top Rack */}
            <rect x="100" y="30" width="280" height="24" fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="1" rx="3" />
            <text x="240" y="46" textAnchor="middle" fontSize="10" fontWeight="600" fill="#64748B">Rack</text>

            {/* Racks grid (left room) */}
            {[0,1,2].map(row => [0,1,2].map(col => (
              <rect key={`lb-${row}-${col}`} x={60 + col * 100} y={80 + row * 90} width="70" height="55" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="1" rx="3" />
            )))}

            {/* Aisle label */}
            <text x="250" y="200" textAnchor="middle" fontSize="13" fontWeight="700" fill="#94A3B8">Aisle</text>

            {/* Vertical racks center-left */}
            <rect x="410" y="70" width="30" height="120" fill="#E2E8F0" stroke="#CBD5E1" rx="3" />
            <text x="425" y="140" textAnchor="middle" fontSize="10" fontWeight="600" fill="#64748B" transform="rotate(-90,425,135)">Rack</text>
            <rect x="410" y="240" width="30" height="120" fill="#E2E8F0" stroke="#CBD5E1" rx="3" />
            <text x="425" y="310" textAnchor="middle" fontSize="10" fontWeight="600" fill="#64748B" transform="rotate(-90,425,305)">Rack</text>

            {/* Room B temp overlay */}
            {roomB && (
              <g>
                <rect x="60" y="340" width="180" height="70" rx="10" fill={`${getColor(roomB.status)}11`} stroke={getColor(roomB.status)} strokeWidth="1.5" />
                <text x="150" y="362" textAnchor="middle" fontSize="11" fontWeight="600" fill="#334155">🌡️ {roomB.currentTemp.toFixed(1)}°C</text>
                <text x="150" y="378" textAnchor="middle" fontSize="9" fill="#64748B">Batas: {roomB.minTemp}°C — {roomB.maxTemp}°C</text>
                <text x="150" y="400" textAnchor="middle" fontSize="10" fontWeight="700" fill={getColor(roomB.status)}>
                  {roomB.status.toUpperCase()} • {pct(roomB)}% kapasitas
                </text>
              </g>
            )}

            {/* ════════════ RIGHT SIDE — Room A ════════════ */}
            {/* Entrance top-center */}
            <rect x="480" y="10" width="40" height="14" fill="#0EA5E9" rx="2" />
            <text x="500" y="8" textAnchor="middle" fontSize="9" fontWeight="600" fill="#0EA5E9">Entrance</text>

            {/* Door between rooms */}
            <rect x="488" y="140" width="24" height="40" fill="#38BDF8" rx="3" />
            <text x="500" y="164" textAnchor="middle" fontSize="8" fontWeight="700" fill="white">Door</text>

            {/* Room A label */}
            <text x="740" y="50" textAnchor="middle" fontSize="16" fontWeight="700" fill="#0F172A">
              {roomA ? roomA.name : 'Room A'}
            </text>

            {/* Office zone */}
            <rect x="830" y="25" width="150" height="50" rx="6" fill="#FFF7ED" stroke="#FDBA74" strokeWidth="1" />
            <text x="905" y="55" textAnchor="middle" fontSize="11" fontWeight="600" fill="#C2410C">Office Zone</text>

            {/* Racks grid (right room) */}
            {[0,1,2].map(row => [0,1,2].map(col => (
              <rect key={`ra-${row}-${col}`} x={560 + col * 110} y={80 + row * 90} width="75" height="55" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="1" rx="3" />
            )))}

            {/* Rack + Aisle labels */}
            <text x="640" y="200" textAnchor="middle" fontSize="12" fontWeight="700" fill="#94A3B8" transform="rotate(-90,640,200)">Rack</text>
            <text x="720" y="200" textAnchor="middle" fontSize="13" fontWeight="700" fill="#94A3B8">Aisle</text>

            {/* Room A temp overlay */}
            {roomA && (
              <g>
                <rect x="560" y="340" width="180" height="70" rx="10" fill={`${getColor(roomA.status)}11`} stroke={getColor(roomA.status)} strokeWidth="1.5" />
                <text x="650" y="362" textAnchor="middle" fontSize="11" fontWeight="600" fill="#334155">🌡️ {roomA.currentTemp.toFixed(1)}°C</text>
                <text x="650" y="378" textAnchor="middle" fontSize="9" fill="#64748B">Batas: {roomA.minTemp}°C — {roomA.maxTemp}°C</text>
                <text x="650" y="400" textAnchor="middle" fontSize="10" fontWeight="700" fill={getColor(roomA.status)}>
                  {roomA.status.toUpperCase()} • {pct(roomA)}% kapasitas
                </text>
              </g>
            )}

            {/* ════════════ BOTTOM ZONES ════════════ */}
            {/* Gates */}
            <rect x="470" y="425" width="60" height="30" fill="#38BDF8" rx="4" />
            <text x="500" y="445" textAnchor="middle" fontSize="10" fontWeight="700" fill="white">Gates</text>

            {/* Input Area (Reception) */}
            <rect x="20" y="455" width="200" height="60" rx="6" fill="#DBEAFE" stroke="#93C5FD" strokeWidth="1" />
            <text x="120" y="490" textAnchor="middle" fontSize="11" fontWeight="600" fill="#1D4ED8">Input Area (Reception)</text>

            {/* Quality Control / Room C */}
            {roomC ? (
              <g>
                <rect x="235" y="455" width="200" height="60" rx="6" fill={`${getColor(roomC.status)}15`} stroke={getColor(roomC.status)} strokeWidth="1.5" />
                <text x="335" y="476" textAnchor="middle" fontSize="11" fontWeight="600" fill="#334155">{roomC.name}</text>
                <text x="335" y="492" textAnchor="middle" fontSize="10" fill={getColor(roomC.status)} fontWeight="700">
                  🌡️ {roomC.currentTemp.toFixed(1)}°C • {roomC.status.toUpperCase()}
                </text>
                <text x="335" y="506" textAnchor="middle" fontSize="9" fill="#64748B">{pct(roomC)}% kapasitas ({roomC.usedCapacity}/{roomC.capacity})</text>
              </g>
            ) : (
              <g>
                <rect x="235" y="455" width="200" height="60" rx="6" fill="#DCFCE7" stroke="#86EFAC" strokeWidth="1" />
                <text x="335" y="490" textAnchor="middle" fontSize="11" fontWeight="600" fill="#166534">Quality Control</text>
              </g>
            )}

            {/* Packing Area */}
            <rect x="455" y="455" width="330" height="60" rx="6" fill="#FFEDD5" stroke="#FDBA74" strokeWidth="1" />
            <text x="620" y="490" textAnchor="middle" fontSize="11" fontWeight="600" fill="#C2410C">Packing Area</text>

            {/* Output Area (Docker) */}
            <rect x="800" y="455" width="180" height="60" rx="6" fill="#FEF9C3" stroke="#FDE047" strokeWidth="1" />
            <text x="890" y="490" textAnchor="middle" fontSize="11" fontWeight="600" fill="#854D0E">Output Area (Docker)</text>

            {/* ── Legend ── */}
            <g transform="translate(20, 540)">
              <rect width="12" height="12" rx="2" fill="#0EA5E9" />
              <text x="18" y="10" fontSize="9" fill="#64748B">Normal</text>
              <rect x="70" width="12" height="12" rx="2" fill="#F59E0B" />
              <text x="88" y="10" fontSize="9" fill="#64748B">Warning</text>
              <rect x="150" width="12" height="12" rx="2" fill="#EF4444" />
              <text x="168" y="10" fontSize="9" fill="#64748B">Danger</text>
              <rect x="230" width="12" height="12" rx="2" fill="#F1F5F9" stroke="#CBD5E1" />
              <text x="248" y="10" fontSize="9" fill="#64748B">Rack / Storage</text>
              <rect x="340" width="12" height="12" rx="2" fill="#38BDF8" />
              <text x="358" y="10" fontSize="9" fill="#64748B">Pintu / Gate</text>
            </g>

          </svg>
        </div>
      </div>

      {/* ─── Detail Charts ─── */}
      <div className={s.coldRoomGrid}>
        {rooms.map(room => (
          <div key={room.id} className={s.section} style={{ padding: 0 }}>
            <div style={{ padding: '14px 20px', borderBottom: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 600, fontSize: 14 }}>{room.name}</span>
              <div className={`${s.tempStatus} ${s[room.status]}`}>{room.status.toUpperCase()}</div>
            </div>
            <div style={{ padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 28, fontWeight: 800, color: getColor(room.status) }}>{room.currentTemp.toFixed(1)}°C</div>
                <div style={{ fontSize: 11, color: '#94A3B8' }}>{room.minTemp}°C — {room.maxTemp}°C</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 11, color: '#64748B' }}>Kapasitas</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: pct(room) > 90 ? '#EF4444' : '#0F172A' }}>{pct(room)}%</div>
                <div style={{ fontSize: 11, color: '#94A3B8' }}>{room.usedCapacity}/{room.capacity}</div>
              </div>
            </div>
            <div className={s.chartContainer} style={{ height: 140 }}>
              <div style={{ position: 'absolute', top: 8, left: 20, fontSize: 10, color: '#94A3B8', display: 'flex', alignItems: 'center', gap: 4 }}>
                <TrendingUp size={10} /> 24h
              </div>
              <svg viewBox="0 0 400 80" style={{ width: '100%', height: '100%', padding: '16px 0' }}>
                <line x1="0" y1="25" x2="400" y2="25" stroke="#EF4444" strokeWidth="0.5" strokeDasharray="4" opacity="0.4" />
                <line x1="0" y1="55" x2="400" y2="55" stroke="#38BDF8" strokeWidth="0.5" strokeDasharray="4" opacity="0.4" />
                <path d="M 0 40 Q 50 25, 100 45 T 200 35 T 300 50 T 400 40" fill="none" stroke={getColor(room.status)} strokeWidth="2" />
              </svg>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
