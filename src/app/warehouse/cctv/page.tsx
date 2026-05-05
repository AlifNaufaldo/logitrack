'use client';
import { useAuth } from '@/context/AuthContext';
import { cctvCameras } from '@/data/mock';
import { Video, Maximize2, RefreshCw, AlertCircle } from 'lucide-react';
import s from '../warehouse.module.css';

export default function WarehouseCCTV() {
  const { user } = useAuth();
  const warehouseId = user?.warehouseId || 'WH-001';

  const myCameras = cctvCameras.filter(c => c.warehouseId === warehouseId);

  return (
    <div className={s.section}>
      <div className={s.sectionHeader}>
        <div className={s.sectionTitle}><Video size={18} /> Pemantauan CCTV Real-time</div>
        <div style={{ display: 'flex', gap: 12 }}>
          <div className={`${s.badge} ${s.in}`} style={{ background: '#ECFDF5', color: '#059669' }}>
            {myCameras.filter(c => c.isOnline).length} Kamera Online
          </div>
          <button className={s.btnPrimary} style={{ background: 'white', color: '#64748B', border: '1px solid #E2E8F0' }}>
            <RefreshCw size={16} /> Segarkan
          </button>
        </div>
      </div>

      <div className={s.cctvGrid}>
        {myCameras.map(cam => (
          <div key={cam.id} className={s.cameraFeed}>
            {cam.embedUrl ? (
              <iframe 
                src={cam.embedUrl} 
                style={{ width: '100%', height: '100%', border: 'none' }}
                title={cam.name}
              />
            ) : (
              <div className={s.cameraPlaceholder}>
                <div className={s.scanLine} />
                {cam.isOnline ? (
                  <>
                    <Video size={48} opacity={0.1} />
                    <span style={{ fontSize: 13, color: '#94A3B8' }}>Sinkronisasi Feed Video...</span>
                  </>
                ) : (
                  <>
                    <AlertCircle size={48} color="#EF4444" opacity={0.5} />
                    <span style={{ fontSize: 13, color: '#EF4444', fontWeight: 600 }}>Kamera Offline</span>
                    <span style={{ fontSize: 11, color: '#94A3B8' }}>Gagal menyambung ke perangkat</span>
                  </>
                )}
              </div>
            )}
            
            <div className={s.cameraLabel}>
              {cam.isOnline && <div className={s.liveIndicator} />}
              <strong>CAM-{cam.id.split('-')[1]}</strong> — {cam.name} ({cam.location})
            </div>

            <button style={{ position: 'absolute', bottom: 12, right: 12, background: 'rgba(0,0,0,0.5)', border: 'none', color: 'white', padding: 6, borderRadius: 6, cursor: 'pointer', backdropFilter: 'blur(4px)' }}>
              <Maximize2 size={14} />
            </button>
          </div>
        ))}
      </div>

      <div style={{ padding: '0 20px 20px', fontSize: 12, color: '#64748B', display: 'flex', gap: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 8, height: 8, background: '#EF4444', borderRadius: '50%' }} /> Live Feed
        </div>
        <div>Penyimpanan Cloud: <span style={{ fontWeight: 600, color: '#334155' }}>Aktif (Simpan 30 Hari)</span></div>
        <div>Bandwidth Saat Ini: <span style={{ fontWeight: 600, color: '#334155' }}>4.2 Mbps</span></div>
      </div>
    </div>
  );
}
