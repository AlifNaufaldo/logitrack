'use client';
import { useAuth } from '@/context/AuthContext';
import { coldRooms, getWarehouse } from '@/data/mock';
import { Thermometer, Droplets, Wind, TrendingUp, History, Info } from 'lucide-react';
import s from '../warehouse.module.css';

export default function WarehouseColdStorage() {
  const { user } = useAuth();
  const warehouseId = user?.warehouseId || 'WH-001';
  const warehouse = getWarehouse(warehouseId);
  const rooms = coldRooms.filter(r => r.warehouseId === warehouseId);

  const getColor = (status: string) => status === 'danger' ? '#EF4444' : status === 'warning' ? '#F59E0B' : '#10B981';
  const pct = (r: typeof rooms[0]) => Math.round((r.usedCapacity / r.capacity) * 100);

  const roomA = rooms[0];
  const roomB = rooms[1];
  const roomC = rooms[2];

  // Helper to render a room badge inside SVG — minimal: just name + temp + status dot
  const RoomBadge = ({ room, x, y, w }: { room: typeof rooms[0] | undefined; x: number; y: number; w: number }) => {
    if (!room) return null;
    const color = getColor(room.status);
    return (
      <g>
        <rect x={x} y={y} width={w} height={44} rx={8} fill="white" stroke={color} strokeWidth="2" />
        <circle cx={x + 14} cy={y + 22} r={5} fill={color} />
        <text x={x + 26} y={y + 19} fontSize="11" fontWeight="700" fill="#0F172A">{room.name}</text>
        <text x={x + 26} y={y + 34} fontSize="12" fontWeight="800" fill={color}>{room.currentTemp.toFixed(1)}°C</text>
        <text x={x + w - 10} y={y + 27} textAnchor="end" fontSize="9" fontWeight="600" fill={color}>{room.status.toUpperCase()}</text>
      </g>
    );
  };

  return (
    <div>
      {/* ─── Floor Plan (simplified) ─── */}
      <div className={s.section} style={{ marginBottom: 24 }}>
        <div className={s.sectionHeader}>
          <div className={s.sectionTitle}><Thermometer size={18} /> Denah {warehouse?.name || 'Warehouse'}</div>
          <div style={{ fontSize: 12, color: '#64748B' }}>{warehouse?.address}</div>
        </div>

        <div style={{ padding: 20, overflowX: 'auto' }}>
          <svg viewBox="0 0 1000 520" style={{ width: '100%', height: 'auto', minHeight: 360, fontFamily: 'Inter, sans-serif' }}>

            {/* Grid background */}
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#E2E8F0" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect x="10" y="10" width="980" height="500" rx="4" fill="url(#grid)" stroke="#334155" strokeWidth="3" />

            {/* Center wall */}
            <line x1="500" y1="10" x2="500" y2="380" stroke="#334155" strokeWidth="3" />
            {/* Bottom divider */}
            <line x1="10" y1="380" x2="990" y2="380" stroke="#334155" strokeWidth="2" />

            {/* ── LEFT: Room B ── */}
            <text x="250" y="42" textAnchor="middle" fontSize="14" fontWeight="700" fill="#475569">Room B (Frozen)</text>

            {/* Entrance */}
            <rect x="10" y="30" width="12" height="40" fill="#0EA5E9" rx="2" />
            <text x="4" y="55" fontSize="8" fill="#0EA5E9" fontWeight="600" transform="rotate(-90,14,55)">IN</text>

            {/* Top rack */}
            <rect x="80" y="28" width="300" height="20" fill="#E2E8F0" stroke="#CBD5E1" rx="3" />
            <text x="230" y="42" textAnchor="middle" fontSize="9" fontWeight="600" fill="#94A3B8">RACK</text>

            {/* Rack grid */}
            {[0,1,2].map(row => [0,1,2].map(col => (
              <rect key={`lb-${row}-${col}`} x={60 + col * 100} y={70 + row * 80} width="65" height="45" fill="#F1F5F9" stroke="#CBD5E1" rx="3" />
            )))}
            <text x="250" y="180" textAnchor="middle" fontSize="11" fontWeight="600" fill="#CBD5E1">AISLE</text>

            {/* Vertical racks */}
            <rect x="410" y="60" width="25" height="110" fill="#E2E8F0" stroke="#CBD5E1" rx="3" />
            <rect x="410" y="210" width="25" height="110" fill="#E2E8F0" stroke="#CBD5E1" rx="3" />

            {/* Room B badge */}
            <RoomBadge room={roomB} x={80} y={320} w={180} />

            {/* ── RIGHT: Room A ── */}
            {/* Entrance top */}
            <rect x="482" y="10" width="36" height="12" fill="#0EA5E9" rx="2" />
            <text x="500" y="8" textAnchor="middle" fontSize="8" fontWeight="600" fill="#0EA5E9">IN</text>

            {/* Door */}
            <rect x="490" y="130" width="20" height="36" fill="#38BDF8" rx="3" />
            <text x="500" y="153" textAnchor="middle" fontSize="7" fontWeight="700" fill="white">DOOR</text>

            <text x="740" y="42" textAnchor="middle" fontSize="14" fontWeight="700" fill="#475569">Room A (Chilled)</text>

            {/* Office */}
            <rect x="840" y="25" width="140" height="40" rx="6" fill="#FFF7ED" stroke="#FDBA74" />
            <text x="910" y="50" textAnchor="middle" fontSize="10" fontWeight="600" fill="#C2410C">Office</text>

            {/* Rack grid */}
            {[0,1,2].map(row => [0,1,2].map(col => (
              <rect key={`ra-${row}-${col}`} x={550 + col * 110} y={70 + row * 80} width="70" height="45" fill="#F1F5F9" stroke="#CBD5E1" rx="3" />
            )))}
            <text x="720" y="180" textAnchor="middle" fontSize="11" fontWeight="600" fill="#CBD5E1">AISLE</text>

            {/* Room A badge */}
            <RoomBadge room={roomA} x={560} y={320} w={180} />

            {/* ── BOTTOM ZONES ── */}
            <rect x="470" y="368" width="60" height="24" fill="#38BDF8" rx="4" />
            <text x="500" y="385" textAnchor="middle" fontSize="9" fontWeight="700" fill="white">GATE</text>

            <rect x="20" y="395" width="190" height="50" rx="6" fill="#DBEAFE" stroke="#93C5FD" />
            <text x="115" y="425" textAnchor="middle" fontSize="10" fontWeight="600" fill="#1D4ED8">Input / Reception</text>

            {/* Room C badge in bottom zone */}
            {roomC && (
              <g>
                <rect x="225" y="395" width="210" height="50" rx="6" fill="white" stroke={getColor(roomC.status)} strokeWidth="2" />
                <circle cx={240} cy={420} r={5} fill={getColor(roomC.status)} />
                <text x="255" y="416" fontSize="10" fontWeight="700" fill="#0F172A">{roomC.name}</text>
                <text x="255" y="432" fontSize="10" fontWeight="800" fill={getColor(roomC.status)}>{roomC.currentTemp.toFixed(1)}°C</text>
                <text x="425" y="424" textAnchor="end" fontSize="9" fontWeight="600" fill={getColor(roomC.status)}>{roomC.status.toUpperCase()}</text>
              </g>
            )}

            <rect x="455" y="395" width="320" height="50" rx="6" fill="#FFEDD5" stroke="#FDBA74" />
            <text x="615" y="425" textAnchor="middle" fontSize="10" fontWeight="600" fill="#C2410C">Packing Area</text>

            <rect x="790" y="395" width="190" height="50" rx="6" fill="#FEF9C3" stroke="#FDE047" />
            <text x="885" y="425" textAnchor="middle" fontSize="10" fontWeight="600" fill="#854D0E">Output / Docker</text>

            {/* Legend */}
            <g transform="translate(20, 470)">
              <circle cx="6" cy="6" r="5" fill="#10B981" /><text x="16" y="10" fontSize="9" fill="#64748B">Normal</text>
              <circle cx="76" cy="6" r="5" fill="#F59E0B" /><text x="86" y="10" fontSize="9" fill="#64748B">Warning</text>
              <circle cx="146" cy="6" r="5" fill="#EF4444" /><text x="156" y="10" fontSize="9" fill="#64748B">Danger</text>
              <rect x="216" y="0" width="12" height="12" rx="2" fill="#F1F5F9" stroke="#CBD5E1" /><text x="234" y="10" fontSize="9" fill="#64748B">Rack</text>
              <rect x="276" y="0" width="12" height="12" rx="2" fill="#38BDF8" /><text x="294" y="10" fontSize="9" fill="#64748B">Pintu</text>
            </g>
          </svg>
        </div>
      </div>

      {/* ─── Sensor Detail Cards ─── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
        {rooms.map(room => {
          const color = getColor(room.status);
          const humidityOk = room.humidity >= 40 && room.humidity <= 90;
          return (
            <div key={room.id} className={s.section} style={{ padding: 0, overflow: 'hidden' }}>
              {/* Card header with status accent */}
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: color }} />
                  <span style={{ fontWeight: 700, fontSize: 15, color: '#0F172A' }}>{room.name}</span>
                </div>
                <div className={`${s.tempStatus} ${s[room.status]}`}>{room.status.toUpperCase()}</div>
              </div>

              {/* Sensor readings grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
                {/* Temperature */}
                <div style={{ padding: 20, borderRight: '1px solid #F1F5F9', borderBottom: '1px solid #F1F5F9' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                    <Thermometer size={14} color={color} />
                    <span style={{ fontSize: 11, fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: 0.5 }}>Suhu</span>
                  </div>
                  <div style={{ fontSize: 28, fontWeight: 800, color, lineHeight: 1 }}>{room.currentTemp.toFixed(1)}°C</div>
                  <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 4 }}>Batas: {room.minTemp}°C — {room.maxTemp}°C</div>
                </div>

                {/* Humidity */}
                <div style={{ padding: 20, borderBottom: '1px solid #F1F5F9' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                    <Droplets size={14} color="#0EA5E9" />
                    <span style={{ fontSize: 11, fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: 0.5 }}>Kelembaban</span>
                  </div>
                  <div style={{ fontSize: 28, fontWeight: 800, color: humidityOk ? '#0EA5E9' : '#F59E0B', lineHeight: 1 }}>{room.humidity}%</div>
                  <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 4 }}>RH (Relative Humidity)</div>
                </div>

                {/* Dew Point */}
                <div style={{ padding: 20, borderRight: '1px solid #F1F5F9' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                    <Wind size={14} color="#6366F1" />
                    <span style={{ fontSize: 11, fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: 0.5 }}>Dew Point</span>
                  </div>
                  <div style={{ fontSize: 28, fontWeight: 800, color: '#6366F1', lineHeight: 1 }}>{room.dewPoint.toFixed(1)}°C</div>
                  <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 4 }}>Titik embun</div>
                </div>

                {/* Capacity */}
                <div style={{ padding: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                    <Info size={14} color="#64748B" />
                    <span style={{ fontSize: 11, fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: 0.5 }}>Kapasitas</span>
                  </div>
                  <div style={{ fontSize: 28, fontWeight: 800, color: pct(room) > 90 ? '#EF4444' : '#0F172A', lineHeight: 1 }}>{pct(room)}%</div>
                  <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 4 }}>{room.usedCapacity} / {room.capacity} unit</div>
                </div>
              </div>

              {/* Chart */}
              <div className={s.chartContainer} style={{ height: 120 }}>
                <div style={{ position: 'absolute', top: 8, left: 20, fontSize: 10, color: '#94A3B8', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <TrendingUp size={10} /> Tren suhu 24h
                </div>
                <svg viewBox="0 0 400 60" style={{ width: '100%', height: '100%', padding: '16px 0' }}>
                  <line x1="0" y1="15" x2="400" y2="15" stroke="#EF4444" strokeWidth="0.5" strokeDasharray="4" opacity="0.3" />
                  <line x1="0" y1="45" x2="400" y2="45" stroke="#38BDF8" strokeWidth="0.5" strokeDasharray="4" opacity="0.3" />
                  <path d="M 0 30 Q 50 18, 100 35 T 200 25 T 300 40 T 400 30" fill="none" stroke={color} strokeWidth="2" />
                </svg>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
