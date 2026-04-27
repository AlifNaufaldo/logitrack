'use client';
import { useState } from 'react';
import { attendances } from '@/data/mock';
import { Camera, MapPin, Clock, CheckCircle, User } from 'lucide-react';
import s from '../driver.module.css';

export default function AbsensiPage() {
  const [absenDone, setAbsenDone] = useState(false);
  const now = new Date();

  const handleAbsen = () => {
    setAbsenDone(true);
  };

  return (
    <div>
      <h1 className={s.pageTitle}>Absensi</h1>
      <p className={s.pageDesc}>Absen dengan selfie dan lokasi GPS Anda.</p>

      <div className={s.attendanceCard}>
        <div className={s.attendanceTime}>
          {now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
        </div>
        <div className={s.attendanceDate}>
          {now.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </div>
        <div className={s.selfiePreview}>
          {absenDone ? <CheckCircle size={48} /> : <User size={48} style={{ opacity: 0.5 }} />}
        </div>
        <div className={s.attendanceLocation}>
          <MapPin size={12} /> Gudang Karawang, Jl. Industri Raya
        </div>
      </div>

      {!absenDone ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button className={`${s.btn} ${s.btnAccent}`} onClick={handleAbsen}>
            <Camera size={18} /> Absen Masuk (Selfie + GPS)
          </button>
          <div style={{ textAlign: 'center', fontSize: 12, color: 'var(--color-text-muted)', marginTop: 4 }}>
            Kamera akan terbuka untuk mengambil selfie.
            <br />Lokasi GPS Anda akan dicatat otomatis.
          </div>
        </div>
      ) : (
        <div className={s.card} style={{ textAlign: 'center', padding: 24 }}>
          <CheckCircle size={48} style={{ color: 'var(--color-accent)', margin: '0 auto 12px' }} />
          <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Absensi Berhasil!</div>
          <div style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>
            Masuk pukul {now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
          </div>
          <button className={`${s.btn} ${s.btnDanger}`} style={{ marginTop: 16 }} onClick={() => setAbsenDone(false)}>
            Absen Keluar
          </button>
        </div>
      )}

      <div className={s.card} style={{ marginTop: 16 }}>
        <div className={s.cardHeader}>
          <span className={s.cardTitle}>Riwayat Absensi</span>
        </div>
        <div className={s.cardBody}>
          {attendances.filter(a => a.driverId === 'DRV-001').map(att => (
            <div key={att.id} className={s.historyItem}>
              <span className={`${s.historyType} ${att.type === 'in' ? s.historyIn : s.historyOut}`}>
                {att.type === 'in' ? 'Masuk' : 'Keluar'}
              </span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500 }}>
                  {new Date(att.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                </div>
                <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{att.address}</div>
              </div>
              <Clock size={14} style={{ color: 'var(--color-text-muted)' }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
