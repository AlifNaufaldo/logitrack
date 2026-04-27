'use client';
import { useState } from 'react';
import { Camera, CheckCircle, AlertCircle } from 'lucide-react';
import s from '../driver.module.css';

const ANGLES = [
  { id: 'front', label: 'Tampak Depan', required: true },
  { id: 'back', label: 'Tampak Belakang', required: true },
  { id: 'left', label: 'Sisi Kiri', required: true },
  { id: 'right', label: 'Sisi Kanan', required: true },
  { id: 'interior', label: 'Interior Kabin', required: false },
  { id: 'dashboard', label: 'Dashboard / KM', required: false },
  { id: 'tire', label: 'Kondisi Ban', required: false },
  { id: 'other', label: 'Lainnya', required: false },
];

export default function FotoKendaraanPage() {
  const [photos, setPhotos] = useState<Record<string, boolean>>({});

  const togglePhoto = (id: string) => {
    setPhotos(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const requiredDone = ANGLES.filter(a => a.required).every(a => photos[a.id]);
  const totalDone = Object.values(photos).filter(Boolean).length;

  return (
    <div>
      <h1 className={s.pageTitle}>Foto Kondisi Kendaraan</h1>
      <p className={s.pageDesc}>Upload foto kendaraan dari berbagai sisi sebelum berangkat.</p>

      <div className={s.card} style={{ marginBottom: 16 }}>
        <div className={s.cardHeader}>
          <span className={s.cardTitle}>Status Upload</span>
          <span className={`${s.badge} ${requiredDone ? s.badgeGreen : s.badgeAmber}`}>
            {requiredDone ? <><CheckCircle size={10} /> Lengkap</> : <><AlertCircle size={10} /> {totalDone}/4 wajib</>}
          </span>
        </div>
        <div className={s.cardBody}>
          <div className={s.capacityBar}>
            <div className={s.capacityHeader}>
              <span>Progress</span>
              <span style={{ fontWeight: 600 }}>{totalDone}/{ANGLES.length}</span>
            </div>
            <div className={s.capacityTrack}>
              <div className={`${s.capacityFill} ${requiredDone ? 'safe' : 'warn'}`} style={{ width: `${(totalDone / ANGLES.length) * 100}%`, background: requiredDone ? 'var(--color-accent)' : 'var(--color-warning)' }} />
            </div>
          </div>

          <div className={s.photoGrid}>
            {ANGLES.map(angle => (
              <div key={angle.id} className={`${s.photoSlot} ${photos[angle.id] ? s.filled : ''}`} onClick={() => togglePhoto(angle.id)}>
                {photos[angle.id] ? (
                  <>
                    <div className={s.photoPreview} style={{ background: `linear-gradient(135deg, var(--color-accent-50), var(--color-primary-50))`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <CheckCircle size={32} style={{ color: 'var(--color-accent)' }} />
                    </div>
                  </>
                ) : (
                  <>
                    <Camera size={24} />
                    <span>{angle.label}</span>
                    {angle.required && <span style={{ fontSize: 9, color: 'var(--color-danger)', fontWeight: 700 }}>WAJIB</span>}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <button className={`${s.btn} ${requiredDone ? s.btnAccent : s.btnOutline}`} disabled={!requiredDone}>
        <CheckCircle size={18} /> {requiredDone ? 'Kirim Foto' : 'Lengkapi Foto Wajib'}
      </button>
    </div>
  );
}
