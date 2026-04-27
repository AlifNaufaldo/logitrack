'use client';
import { useState } from 'react';
import { trucks as mockTrucks } from '@/data/mock';
import { BoxIcon, Plus, Search, Edit2, Trash2, X } from 'lucide-react';
import s from '@/styles/shared.module.css';

export default function MasterTruk() {
  const [data] = useState(mockTrucks);
  const [search, setSearch] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const filtered = data.filter(t => t.plateNumber.toLowerCase().includes(search.toLowerCase()) || t.type.toLowerCase().includes(search.toLowerCase()));

  const statusMap: Record<string, { label: string; cls: string }> = {
    available: { label: 'Tersedia', cls: s.badgeGreen },
    in_use: { label: 'Digunakan', cls: s.badgeBlue },
    maintenance: { label: 'Maintenance', cls: s.badgeAmber },
  };

  return (
    <div className={s.page}>
      <div className={s.pageHeader}>
        <div className={s.pageHeaderLeft}>
          <h2 className={s.pageTitle}>Master Data Truk</h2>
          <p className={s.pageDesc}>Kelola data armada truk beserta kapasitas dan dimensi bak.</p>
        </div>
        <div className={s.pageActions}>
          <button className={`${s.btn} ${s.btnPrimary}`} onClick={() => setShowDialog(true)}><Plus size={15} />Tambah Truk</button>
        </div>
      </div>

      <div className={s.card}>
        <div className={s.cardHeader}>
          <div className={s.searchBar}><Search size={16} /><input placeholder="Cari nopol / jenis..." value={search} onChange={e => setSearch(e.target.value)} /></div>
          <span className={`${s.badge} ${s.badgeBlue}`}>{filtered.length} truk</span>
        </div>
        <div className={s.tableWrap}>
          <table className={s.table}>
            <thead><tr><th>Nopol</th><th>Jenis</th><th>Kapasitas (ton)</th><th>Dimensi Bak (cm)</th><th>Status</th><th>Aksi</th></tr></thead>
            <tbody>
              {filtered.map(t => (
                <tr key={t.id}>
                  <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{t.plateNumber}</td>
                  <td>{t.type}</td>
                  <td>{t.capacityTon}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>{t.dimensions.length}×{t.dimensions.width}×{t.dimensions.height}</td>
                  <td><span className={`${s.badge} ${statusMap[t.status].cls}`}>{statusMap[t.status].label}</span></td>
                  <td><div className={s.tableActions}>
                    <button className={`${s.btn} ${s.btnOutline} ${s.btnSm} ${s.btnIcon}`}><Edit2 size={14} /></button>
                    <button className={`${s.btn} ${s.btnOutline} ${s.btnSm} ${s.btnIcon}`}><Trash2 size={14} /></button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className={s.pagination}>
          <span>Menampilkan {filtered.length} dari {data.length} data</span>
        </div>
      </div>

      {showDialog && (
        <div className={s.overlay} onClick={() => setShowDialog(false)}>
          <div className={s.dialog} onClick={e => e.stopPropagation()}>
            <div className={s.dialogHeader}>
              <h3 className={s.dialogTitle}>Tambah Truk Baru</h3>
              <button className={s.dialogClose} onClick={() => setShowDialog(false)}><X size={16} /></button>
            </div>
            <div className={s.dialogBody}>
              <div className={s.formGrid}>
                <div className={s.formGroup}><label className={s.formLabel}>Nomor Polisi</label><input className={s.formInput} placeholder="B 1234 AB" /></div>
                <div className={s.formGroup}><label className={s.formLabel}>Jenis Truk</label><select className={s.formInput}><option>Engkel</option><option>CDD</option><option>Fuso</option><option>Tronton</option><option>Wingbox</option></select></div>
                <div className={s.formGroup}><label className={s.formLabel}>Kapasitas (ton)</label><input className={s.formInput} type="number" /></div>
                <div className={s.formGroup}><label className={s.formLabel}>Status</label><select className={s.formInput}><option value="available">Tersedia</option><option value="maintenance">Maintenance</option></select></div>
                <div className={s.formGroup}><label className={s.formLabel}>Panjang Bak (cm)</label><input className={s.formInput} type="number" /></div>
                <div className={s.formGroup}><label className={s.formLabel}>Lebar Bak (cm)</label><input className={s.formInput} type="number" /></div>
                <div className={s.formGroup}><label className={s.formLabel}>Tinggi Bak (cm)</label><input className={s.formInput} type="number" /></div>
              </div>
            </div>
            <div className={s.dialogFooter}>
              <button className={`${s.btn} ${s.btnOutline}`} onClick={() => setShowDialog(false)}>Batal</button>
              <button className={`${s.btn} ${s.btnPrimary}`} onClick={() => setShowDialog(false)}>Simpan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
