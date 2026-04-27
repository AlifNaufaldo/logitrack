'use client';
import { useState, useRef } from 'react';
import { Upload, FileSpreadsheet, Download, CheckCircle, AlertCircle, X, Table2 } from 'lucide-react';
import s from '@/styles/shared.module.css';

const SAMPLE_DATA = [
  { nama: 'TV LED 55 inch', jumlah: 20, berat: 18, dimensi: '140×85×15', asalGudang: 'Gudang Karawang', tujuanGudang: 'Gudang Jakarta Utara' },
  { nama: 'Kulkas 2 Pintu', jumlah: 15, berat: 65, dimensi: '70×65×170', asalGudang: 'Gudang Tanjung Priok', tujuanGudang: 'Gudang Jakarta Selatan' },
  { nama: 'Air Mineral 600ml (Karton)', jumlah: 200, berat: 12, dimensi: '40×30×25', asalGudang: 'Gudang Cikarang', tujuanGudang: 'Gudang Bekasi' },
  { nama: 'Semen Portland 50kg', jumlah: 80, berat: 50, dimensi: '60×40×15', asalGudang: 'Gudang Karawang', tujuanGudang: 'Gudang Depok' },
  { nama: 'Cat Tembok 25L', jumlah: 40, berat: 35, dimensi: '30×30×45', asalGudang: 'Gudang Tangerang', tujuanGudang: 'Gudang Jakarta Barat' },
];

export default function UploadExcel() {
  const [uploaded, setUploaded] = useState(false);
  const [previewData, setPreviewData] = useState<typeof SAMPLE_DATA>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = () => {
    // Mock: simulate parsing Excel
    setPreviewData(SAMPLE_DATA);
    setUploaded(true);
  };

  const handleImport = () => {
    alert('Data berhasil diimport dan disinkronkan ke sopir terkait!');
  };

  return (
    <div className={s.page}>
      <div className={s.pageHeader}>
        <div className={s.pageHeaderLeft}>
          <h2 className={s.pageTitle}>Upload Data via Excel</h2>
          <p className={s.pageDesc}>Upload file Excel (.xlsx, .csv) berisi data barang untuk sinkronisasi ke sopir yang ditugaskan.</p>
        </div>
        <div className={s.pageActions}>
          <button className={`${s.btn} ${s.btnOutline}`}><Download size={15} />Download Template</button>
        </div>
      </div>

      <div className={s.card}>
        <div className={s.cardBody}>
          <div className={s.uploadArea} onClick={() => uploaded ? null : handleFile()}>
            <input type="file" ref={fileRef} accept=".xlsx,.csv" style={{ display: 'none' }} onChange={handleFile} />
            {!uploaded ? (
              <>
                <Upload size={40} className={s.uploadIcon} />
                <div className={s.uploadText}>Klik atau drag file Excel di sini</div>
                <div className={s.uploadHint}>Format: .xlsx atau .csv — Maks 10MB</div>
              </>
            ) : (
              <>
                <CheckCircle size={40} style={{ color: 'var(--color-accent)' }} />
                <div className={s.uploadText} style={{ color: 'var(--color-accent-dark)' }}>File berhasil diupload!</div>
                <div className={s.uploadHint}>data_muatan_28apr2026.xlsx — 5 baris data terdeteksi</div>
              </>
            )}
          </div>
        </div>
      </div>

      {uploaded && previewData.length > 0 && (
        <div className={s.card} style={{ animation: 'slideInUp 0.3s ease' }}>
          <div className={s.cardHeader}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Table2 size={16} style={{ color: 'var(--color-primary)' }} />
              <span className={s.cardTitle}>Preview Data</span>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className={`${s.btn} ${s.btnOutline} ${s.btnSm}`} onClick={() => { setUploaded(false); setPreviewData([]); }}>
                <X size={14} /> Batal
              </button>
              <button className={`${s.btn} ${s.btnAccent} ${s.btnSm}`} onClick={handleImport}>
                <CheckCircle size={14} /> Import & Sinkron
              </button>
            </div>
          </div>
          <div className={s.tableWrap}>
            <table className={s.table}>
              <thead>
                <tr><th>#</th><th>Nama Barang</th><th>Jumlah</th><th>Berat (kg)</th><th>Dimensi (cm)</th><th>Asal Gudang</th><th>Tujuan Gudang</th><th>Status</th></tr>
              </thead>
              <tbody>
                {previewData.map((row, i) => (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td style={{ fontWeight: 500 }}>{row.nama}</td>
                    <td>{row.jumlah}</td>
                    <td>{row.berat}</td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>{row.dimensi}</td>
                    <td>{row.asalGudang}</td>
                    <td>{row.tujuanGudang}</td>
                    <td><span className={`${s.badge} ${s.badgeGreen}`}><CheckCircle size={10} /> Valid</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className={s.pagination}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <CheckCircle size={14} style={{ color: 'var(--color-accent)' }} />
              {previewData.length} baris valid, siap diimport
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
