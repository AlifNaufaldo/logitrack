'use client';
import { useState } from 'react';
import { warehouses as mockWarehouses } from '@/data/mock';
import { Warehouse, Plus, Search, Edit2, Trash2, X, MapPin } from 'lucide-react';
import s from '@/styles/shared.module.css';

export default function MasterGudang() {
  const [data] = useState(mockWarehouses);
  const [search, setSearch] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const filtered = data.filter(w => w.name.toLowerCase().includes(search.toLowerCase()) || w.city.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className={s.page}>
      <div className={s.pageHeader}>
        <div className={s.pageHeaderLeft}>
          <h2 className={s.pageTitle}>Master Data Gudang</h2>
          <p className={s.pageDesc}>Kelola data lokasi gudang sebagai titik rute pengiriman.</p>
        </div>
        <div className={s.pageActions}>
          <button className={`${s.btn} ${s.btnPrimary}`} onClick={() => setShowDialog(true)}><Plus size={15} />Tambah Gudang</button>
        </div>
      </div>

      <div className={s.card}>
        <div className={s.cardHeader}>
          <div className={s.searchBar}><Search size={16} /><input placeholder="Cari gudang / kota..." value={search} onChange={e => setSearch(e.target.value)} /></div>
          <span className={`${s.badge} ${s.badgeBlue}`}>{filtered.length} gudang</span>
        </div>
        <div className={s.tableWrap}>
          <table className={s.table}>
            <thead><tr><th>Kode</th><th>Nama Gudang</th><th>Kota</th><th>Alamat</th><th>Koordinat</th><th>Kapasitas</th><th>Aksi</th></tr></thead>
            <tbody>
              {filtered.map(w => (
                <tr key={w.id}>
                  <td><code style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--color-primary)', fontWeight: 600 }}>{w.code}</code></td>
                  <td style={{ fontWeight: 500 }}><div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><MapPin size={14} style={{ color: 'var(--color-accent)' }} />{w.name}</div></td>
                  <td>{w.city}</td>
                  <td style={{ fontSize: 12, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{w.address}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: 11 }}>{w.coordinates.lat.toFixed(4)}, {w.coordinates.lng.toFixed(4)}</td>
                  <td>{w.capacity.toLocaleString('id-ID')} m³</td>
                  <td><div className={s.tableActions}>
                    <button className={`${s.btn} ${s.btnOutline} ${s.btnSm} ${s.btnIcon}`}><Edit2 size={14} /></button>
                    <button className={`${s.btn} ${s.btnOutline} ${s.btnSm} ${s.btnIcon}`}><Trash2 size={14} /></button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className={s.pagination}><span>Menampilkan {filtered.length} dari {data.length} data</span></div>
      </div>

      {showDialog && (
        <div className={s.overlay} onClick={() => setShowDialog(false)}>
          <div className={s.dialog} onClick={e => e.stopPropagation()}>
            <div className={s.dialogHeader}>
              <h3 className={s.dialogTitle}>Tambah Gudang Baru</h3>
              <button className={s.dialogClose} onClick={() => setShowDialog(false)}><X size={16} /></button>
            </div>
            <div className={s.dialogBody}>
              <div className={s.formGrid}>
                <div className={s.formGroup}><label className={s.formLabel}>Kode Gudang</label><input className={s.formInput} placeholder="KRW" /></div>
                <div className={s.formGroup}><label className={s.formLabel}>Kota</label><input className={s.formInput} placeholder="Karawang" /></div>
                <div className={`${s.formGroup} ${s.formFull}`}><label className={s.formLabel}>Nama Gudang</label><input className={s.formInput} placeholder="Gudang Karawang" /></div>
                <div className={`${s.formGroup} ${s.formFull}`}><label className={s.formLabel}>Alamat</label><input className={s.formInput} placeholder="Jl. Industri Raya No. 15" /></div>
                <div className={s.formGroup}><label className={s.formLabel}>Latitude</label><input className={s.formInput} type="number" step="0.0001" /></div>
                <div className={s.formGroup}><label className={s.formLabel}>Longitude</label><input className={s.formInput} type="number" step="0.0001" /></div>
                <div className={s.formGroup}><label className={s.formLabel}>Kapasitas (m³)</label><input className={s.formInput} type="number" /></div>
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
