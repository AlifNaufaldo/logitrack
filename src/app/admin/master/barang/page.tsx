'use client';
import { useState } from 'react';
import { items as mockItems } from '@/data/mock';
import { Package, Plus, Search, Edit2, Trash2, X, Download } from 'lucide-react';
import s from '@/styles/shared.module.css';

export default function MasterBarang() {
  const [data] = useState(mockItems);
  const [search, setSearch] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const filtered = data.filter(i => i.name.toLowerCase().includes(search.toLowerCase()) || i.code.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className={s.page}>
      <div className={s.pageHeader}>
        <div className={s.pageHeaderLeft}>
          <h2 className={s.pageTitle}>Master Data Barang</h2>
          <p className={s.pageDesc}>Kelola data barang, ukuran, dan berat untuk pencocokan kapasitas truk.</p>
        </div>
        <div className={s.pageActions}>
          <button className={`${s.btn} ${s.btnOutline}`}><Download size={15} />Template Excel</button>
          <button className={`${s.btn} ${s.btnPrimary}`} onClick={() => setShowDialog(true)}><Plus size={15} />Tambah Barang</button>
        </div>
      </div>

      <div className={s.card}>
        <div className={s.cardHeader}>
          <div className={s.searchBar}><Search size={16} /><input placeholder="Cari barang..." value={search} onChange={e => setSearch(e.target.value)} /></div>
          <span className={`${s.badge} ${s.badgeBlue}`}>{filtered.length} barang</span>
        </div>
        <div className={s.tableWrap}>
          <table className={s.table}>
            <thead><tr><th>Kode</th><th>Nama Barang</th><th>Kategori</th><th>Berat (kg)</th><th>Dimensi (cm)</th><th>Satuan</th><th>Aksi</th></tr></thead>
            <tbody>
              {filtered.map(item => (
                <tr key={item.id}>
                  <td><code style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--color-primary)' }}>{item.code}</code></td>
                  <td style={{ fontWeight: 500 }}>{item.name}</td>
                  <td><span className={`${s.badge} ${s.badgeGray}`}>{item.category}</span></td>
                  <td>{item.weightKg}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>{item.dimensions.length}×{item.dimensions.width}×{item.dimensions.height}</td>
                  <td>{item.unit}</td>
                  <td><div className={s.tableActions}>
                    <button className={`${s.btn} ${s.btnOutline} ${s.btnSm} ${s.btnIcon}`} title="Edit"><Edit2 size={14} /></button>
                    <button className={`${s.btn} ${s.btnOutline} ${s.btnSm} ${s.btnIcon}`} title="Hapus"><Trash2 size={14} /></button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className={s.pagination}>
          <span>Menampilkan {filtered.length} dari {data.length} data</span>
          <div className={s.paginationBtns}>
            <button className={`${s.pageBtn} ${s.active}`}>1</button>
          </div>
        </div>
      </div>

      {showDialog && (
        <div className={s.overlay} onClick={() => setShowDialog(false)}>
          <div className={s.dialog} onClick={e => e.stopPropagation()}>
            <div className={s.dialogHeader}>
              <h3 className={s.dialogTitle}>Tambah Barang Baru</h3>
              <button className={s.dialogClose} onClick={() => setShowDialog(false)}><X size={16} /></button>
            </div>
            <div className={s.dialogBody}>
              <div className={s.formGrid}>
                <div className={s.formGroup}><label className={s.formLabel}>Kode Barang</label><input className={s.formInput} placeholder="ELC-011" /></div>
                <div className={s.formGroup}><label className={s.formLabel}>Satuan</label><input className={s.formInput} placeholder="unit / karton / sak" /></div>
                <div className={`${s.formGroup} ${s.formFull}`}><label className={s.formLabel}>Nama Barang</label><input className={s.formInput} placeholder="Nama barang" /></div>
                <div className={s.formGroup}><label className={s.formLabel}>Kategori</label><input className={s.formInput} placeholder="Elektronik" /></div>
                <div className={s.formGroup}><label className={s.formLabel}>Berat (kg)</label><input className={s.formInput} type="number" placeholder="0" /></div>
                <div className={s.formGroup}><label className={s.formLabel}>Panjang (cm)</label><input className={s.formInput} type="number" placeholder="0" /></div>
                <div className={s.formGroup}><label className={s.formLabel}>Lebar (cm)</label><input className={s.formInput} type="number" placeholder="0" /></div>
                <div className={s.formGroup}><label className={s.formLabel}>Tinggi (cm)</label><input className={s.formInput} type="number" placeholder="0" /></div>
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
