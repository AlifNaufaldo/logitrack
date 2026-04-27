'use client';
import { useState } from 'react';
import { driverDocuments } from '@/data/mock';
import { FileText, Upload, CheckCircle, Clock, Eye, Plus, X } from 'lucide-react';
import s from '../driver.module.css';

export default function SuratJalanPage() {
  const docs = driverDocuments.filter(d => d.driverId === 'DRV-001' && d.type === 'Surat Jalan');
  const [showUpload, setShowUpload] = useState(false);
  const [showPreview, setShowPreview] = useState<string | null>(null);

  return (
    <div>
      <h1 className={s.pageTitle}>Surat Jalan</h1>
      <p className={s.pageDesc}>Upload dan lihat preview surat jalan perjalanan Anda.</p>

      <button className={`${s.btn} ${s.btnAccent}`} style={{ marginBottom: 16 }} onClick={() => setShowUpload(!showUpload)}>
        <Upload size={18} /> Upload Surat Jalan
      </button>

      {showUpload && (
        <div className={s.card} style={{ marginBottom: 16, animation: 'slideInUp 0.2s ease' }}>
          <div className={s.cardHeader}>
            <span className={s.cardTitle}>Upload Dokumen</span>
            <button onClick={() => setShowUpload(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}><X size={16} /></button>
          </div>
          <div className={s.cardBody}>
            <div className={s.photoSlot} style={{ width: '100%', aspectRatio: '16/9' }} onClick={() => setShowUpload(false)}>
              <Upload size={32} />
              <span>Klik untuk memilih foto / scan surat</span>
              <span style={{ fontSize: 10 }}>JPG, PNG, PDF — Maks 5MB</span>
            </div>
          </div>
        </div>
      )}

      <div className={s.card}>
        <div className={s.cardHeader}>
          <span className={s.cardTitle}>Daftar Surat Jalan</span>
          <span className={`${s.badge} ${s.badgeBlue}`}>{docs.length} file</span>
        </div>
        <div className={s.cardBody}>
          {docs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 32, color: 'var(--color-text-muted)' }}>
              <FileText size={40} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
              <div>Belum ada surat jalan diupload.</div>
            </div>
          ) : (
            <div className={s.docList}>
              {docs.map(doc => (
                <div key={doc.id} className={s.docItem} onClick={() => setShowPreview(doc.id)}>
                  <div className={s.docIcon}><FileText size={20} /></div>
                  <div className={s.docInfo}>
                    <div className={s.docName}>{doc.name}</div>
                    <div className={s.docMeta}>Upload: {doc.uploadedAt}</div>
                  </div>
                  <span className={`${s.badge} ${doc.status === 'verified' ? s.badgeGreen : s.badgeAmber}`}>
                    {doc.status === 'verified' ? <><CheckCircle size={10} /> Verified</> : <><Clock size={10} /> Pending</>}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* All driver documents */}
      <div className={s.card} style={{ marginTop: 12 }}>
        <div className={s.cardHeader}>
          <span className={s.cardTitle}>Semua Dokumen</span>
        </div>
        <div className={s.cardBody}>
          <div className={s.docList}>
            {driverDocuments.filter(d => d.driverId === 'DRV-001').map(doc => (
              <div key={doc.id} className={s.docItem}>
                <div className={s.docIcon}><FileText size={20} /></div>
                <div className={s.docInfo}>
                  <div className={s.docName}>{doc.name}</div>
                  <div className={s.docMeta}>{doc.type} • {doc.uploadedAt}</div>
                </div>
                <span className={`${s.badge} ${doc.status === 'verified' ? s.badgeGreen : s.badgeAmber}`}>
                  {doc.status === 'verified' ? 'OK' : 'Pending'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showPreview && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }} onClick={() => setShowPreview(null)}>
          <div style={{ background: 'white', borderRadius: 16, padding: 24, maxWidth: 400, width: '100%', animation: 'scaleIn 0.2s ease' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700 }}>Preview Surat Jalan</h3>
              <button onClick={() => setShowPreview(null)} style={{ border: 'none', background: 'var(--color-bg)', borderRadius: 8, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><X size={16} /></button>
            </div>
            <div style={{ background: 'var(--color-bg)', borderRadius: 12, padding: 40, textAlign: 'center', border: '1px solid var(--color-border)' }}>
              <FileText size={64} style={{ color: 'var(--color-primary)', margin: '0 auto 16px' }} />
              <div style={{ fontWeight: 600 }}>SJ-2026-04-28-001</div>
              <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 4 }}>Preview dokumen akan tampil di sini</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
