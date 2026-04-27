'use client';
import { useState } from 'react';
import { drivers as mockDrivers, getDriverDocuments, driverDocuments } from '@/data/mock';
import { Users, Plus, Search, Edit2, Eye, X, FileText, CheckCircle, Clock } from 'lucide-react';
import s from '@/styles/shared.module.css';

export default function MasterSopir() {
  const [data] = useState(mockDrivers);
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const filtered = data.filter(d => d.name.toLowerCase().includes(search.toLowerCase()) || d.id.toLowerCase().includes(search.toLowerCase()));

  const statusMap: Record<string, { label: string; cls: string }> = {
    active: { label: 'Aktif', cls: s.badgeGreen },
    on_trip: { label: 'Perjalanan', cls: s.badgeBlue },
    inactive: { label: 'Nonaktif', cls: s.badgeGray },
  };

  const selectedDocs = selectedId ? getDriverDocuments(selectedId) : [];
  const selectedDriver = data.find(d => d.id === selectedId);

  return (
    <div className={s.page}>
      <div className={s.pageHeader}>
        <div className={s.pageHeaderLeft}>
          <h2 className={s.pageTitle}>Master Data Sopir</h2>
          <p className={s.pageDesc}>Kelola data sopir, dokumen SIM, surat kesehatan, dan surat jalan.</p>
        </div>
        <div className={s.pageActions}>
          <button className={`${s.btn} ${s.btnPrimary}`} onClick={() => setIsAddModalOpen(true)}>
            <Plus size={15} />Tambah Sopir
          </button>
        </div>
      </div>

      <div className={s.card}>
        <div className={s.cardHeader}>
          <div className={s.searchBar}><Search size={16} /><input placeholder="Cari sopir..." value={search} onChange={e => setSearch(e.target.value)} /></div>
          <span className={`${s.badge} ${s.badgeBlue}`}>{filtered.length} sopir</span>
        </div>
        <div className={s.tableWrap}>
          <table className={s.table}>
            <thead><tr><th>ID</th><th>Nama</th><th>No. HP</th><th>No. SIM</th><th>Exp. SIM</th><th>Status</th><th>Dokumen</th><th>Aksi</th></tr></thead>
            <tbody>
              {filtered.map(d => {
                const docs = getDriverDocuments(d.id);
                return (
                  <tr key={d.id}>
                    <td><code style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>{d.id}</code></td>
                    <td style={{ fontWeight: 600 }}><div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--color-primary-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)', fontSize: 12, fontWeight: 700 }}>{d.name.charAt(0)}</div>
                      {d.name}
                    </div></td>
                    <td>{d.phone}</td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>{d.simNumber}</td>
                    <td>{d.simExpiry}</td>
                    <td><span className={`${s.badge} ${statusMap[d.status].cls}`}>{statusMap[d.status].label}</span></td>
                    <td><span className={`${s.badge} ${docs.length > 0 ? s.badgeGreen : s.badgeGray}`}>{docs.length} file</span></td>
                    <td><div className={s.tableActions}>
                      <button className={`${s.btn} ${s.btnOutline} ${s.btnSm} ${s.btnIcon}`} title="Lihat Dokumen" onClick={() => setSelectedId(d.id)}><Eye size={14} /></button>
                      <button className={`${s.btn} ${s.btnOutline} ${s.btnSm} ${s.btnIcon}`}><Edit2 size={14} /></button>
                    </div></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className={s.pagination}><span>Menampilkan {filtered.length} dari {data.length} data</span></div>
      </div>

      {selectedId && selectedDriver && (
        <div className={s.overlay} onClick={() => setSelectedId(null)}>
          <div className={s.dialog} onClick={e => e.stopPropagation()} style={{ maxWidth: 600 }}>
            <div className={s.dialogHeader}>
              <h3 className={s.dialogTitle}>Dokumen — {selectedDriver.name}</h3>
              <button className={s.dialogClose} onClick={() => setSelectedId(null)}><X size={16} /></button>
            </div>
            <div className={s.dialogBody}>
              {selectedDocs.length === 0 ? (
                <div className={s.emptyState}><FileText size={32} /><span>Belum ada dokumen untuk sopir ini.</span></div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {selectedDocs.map(doc => (
                    <div key={doc.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', border: '1px solid var(--color-border)', borderRadius: 10, background: 'var(--color-surface-hover)' }}>
                      <FileText size={20} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: 13 }}>{doc.name}</div>
                        <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{doc.type} • Upload: {doc.uploadedAt}</div>
                      </div>
                      <span className={`${s.badge} ${doc.status === 'verified' ? s.badgeGreen : s.badgeAmber}`}>
                        {doc.status === 'verified' ? <><CheckCircle size={12} /> Terverifikasi</> : <><Clock size={12} /> Pending</>}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className={s.dialogFooter}>
              <button className={`${s.btn} ${s.btnOutline}`} onClick={() => setSelectedId(null)}>Tutup</button>
            </div>
          </div>
        </div>
      )}

      {isAddModalOpen && (
        <div className={s.overlay} onClick={() => setIsAddModalOpen(false)}>
          <div className={s.dialog} onClick={e => e.stopPropagation()} style={{ maxWidth: 500 }}>
            <div className={s.dialogHeader}>
              <h3 className={s.dialogTitle}>Tambah Sopir Baru</h3>
              <button className={s.dialogClose} onClick={() => setIsAddModalOpen(false)}><X size={16} /></button>
            </div>
            <div className={s.dialogBody}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Nama Sopir</label>
                  <input type="text" placeholder="Masukkan nama lengkap" style={{ width: '100%', height: 38, borderRadius: 8, border: '1px solid var(--color-border)', padding: '0 12px' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Nomor HP</label>
                  <input type="tel" placeholder="Contoh: 081234567890" style={{ width: '100%', height: 38, borderRadius: 8, border: '1px solid var(--color-border)', padding: '0 12px' }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Nomor SIM</label>
                    <input type="text" placeholder="Contoh: SIM-B2-12345" style={{ width: '100%', height: 38, borderRadius: 8, border: '1px solid var(--color-border)', padding: '0 12px' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Masa Berlaku SIM</label>
                    <input type="date" style={{ width: '100%', height: 38, borderRadius: 8, border: '1px solid var(--color-border)', padding: '0 12px' }} />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Status</label>
                  <select style={{ width: '100%', height: 38, borderRadius: 8, border: '1px solid var(--color-border)', padding: '0 12px', background: 'white' }}>
                    <option value="active">Standby (Aktif)</option>
                    <option value="inactive">Nonaktif</option>
                  </select>
                </div>
              </div>
            </div>
            <div className={s.dialogFooter}>
              <button className={`${s.btn} ${s.btnOutline}`} onClick={() => setIsAddModalOpen(false)}>Batal</button>
              <button className={`${s.btn} ${s.btnPrimary}`} onClick={() => setIsAddModalOpen(false)}>Simpan Data</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
