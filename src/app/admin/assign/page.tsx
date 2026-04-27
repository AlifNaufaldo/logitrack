'use client';
import { useState } from 'react';
import { drivers, trucks, warehouses, assignments, getWarehouse, getTruck, getDriver } from '@/data/mock';
import { UserCheck, Plus, Search, ChevronRight, X, Route, Truck } from 'lucide-react';
import s from '@/styles/shared.module.css';

export default function AssignDriver() {
  const [showDialog, setShowDialog] = useState(false);
  const [selDriver, setSelDriver] = useState('');
  const [selTruck, setSelTruck] = useState('');
  const [selStops, setSelStops] = useState<string[]>(['', '']);

  const availDrivers = drivers.filter(d => d.status === 'active');
  const availTrucks = trucks.filter(t => t.status === 'available');

  const addStop = () => setSelStops([...selStops, '']);
  const updateStop = (i: number, v: string) => { const c = [...selStops]; c[i] = v; setSelStops(c); };

  return (
    <div className={s.page}>
      <div className={s.pageHeader}>
        <div className={s.pageHeaderLeft}>
          <h2 className={s.pageTitle}>Assign Sopir</h2>
          <p className={s.pageDesc}>Tugaskan sopir ke truk dan rute pengiriman. Data akan otomatis tersinkron.</p>
        </div>
        <div className={s.pageActions}>
          <button className={`${s.btn} ${s.btnAccent}`} onClick={() => setShowDialog(true)}><Plus size={15} />Buat Penugasan</button>
        </div>
      </div>

      <div className={s.card}>
        <div className={s.cardHeader}>
          <span className={s.cardTitle}>Penugasan Aktif</span>
          <span className={`${s.badge} ${s.badgeGreen}`}>{assignments.length} aktif</span>
        </div>
        <div className={s.tableWrap}>
          <table className={s.table}>
            <thead><tr><th>ID</th><th>Sopir</th><th>Truk</th><th>Rute</th><th>Jumlah Barang</th><th>Status</th></tr></thead>
            <tbody>
              {assignments.map(a => {
                const dr = getDriver(a.driverId);
                const tr = getTruck(a.truckId);
                const routeStr = a.route.map(r => getWarehouse(r.warehouseId)?.code).join(' → ');
                return (
                  <tr key={a.id}>
                    <td><code style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>{a.id}</code></td>
                    <td style={{ fontWeight: 600 }}>{dr?.name}</td>
                    <td><div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Truck size={14} style={{ color: 'var(--color-primary)' }} />{tr?.plateNumber} <span style={{ color: 'var(--color-text-muted)', fontSize: 12 }}>({tr?.type})</span></div></td>
                    <td><div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontFamily: 'var(--font-mono)' }}>
                      {a.route.map((r, i) => (
                        <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <span style={{ padding: '1px 6px', background: r.status === 'arrived' ? 'var(--color-accent-50)' : r.status === 'en_route' ? 'var(--color-warning-50)' : 'var(--color-border-light)', borderRadius: 4, fontWeight: 600, color: r.status === 'arrived' ? 'var(--color-accent-dark)' : r.status === 'en_route' ? '#92400e' : 'var(--color-text-muted)' }}>
                            {getWarehouse(r.warehouseId)?.code}
                          </span>
                          {i < a.route.length - 1 && <ChevronRight size={12} style={{ color: 'var(--color-text-muted)' }} />}
                        </span>
                      ))}
                    </div></td>
                    <td>{a.items.reduce((s, i) => s + i.quantity, 0)} item</td>
                    <td><span className={`${s.badge} ${a.status === 'in_progress' ? s.badgeBlue : a.status === 'completed' ? s.badgeGreen : s.badgeAmber}`}>
                      {a.status === 'in_progress' ? 'Berjalan' : a.status === 'completed' ? 'Selesai' : 'Pending'}
                    </span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showDialog && (
        <div className={s.overlay} onClick={() => setShowDialog(false)}>
          <div className={s.dialog} onClick={e => e.stopPropagation()} style={{ maxWidth: 560 }}>
            <div className={s.dialogHeader}>
              <h3 className={s.dialogTitle}>Buat Penugasan Baru</h3>
              <button className={s.dialogClose} onClick={() => setShowDialog(false)}><X size={16} /></button>
            </div>
            <div className={s.dialogBody}>
              <div className={s.formGrid}>
                <div className={s.formGroup}>
                  <label className={s.formLabel}>Sopir</label>
                  <select className={s.formInput} value={selDriver} onChange={e => setSelDriver(e.target.value)}>
                    <option value="">Pilih sopir...</option>
                    {availDrivers.map(d => <option key={d.id} value={d.id}>{d.name} ({d.id})</option>)}
                  </select>
                </div>
                <div className={s.formGroup}>
                  <label className={s.formLabel}>Truk</label>
                  <select className={s.formInput} value={selTruck} onChange={e => setSelTruck(e.target.value)}>
                    <option value="">Pilih truk...</option>
                    {availTrucks.map(t => <option key={t.id} value={t.id}>{t.plateNumber} — {t.type} ({t.capacityTon}T)</option>)}
                  </select>
                </div>
                <div className={`${s.formGroup} ${s.formFull}`}>
                  <label className={s.formLabel} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Route size={14} /> Rute Pengiriman
                  </label>
                  {selStops.map((stop, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-text-muted)', width: 20 }}>{i + 1}.</span>
                      <select className={s.formInput} style={{ flex: 1 }} value={stop} onChange={e => updateStop(i, e.target.value)}>
                        <option value="">Pilih gudang...</option>
                        {warehouses.map(w => <option key={w.id} value={w.id}>{w.name} ({w.city})</option>)}
                      </select>
                    </div>
                  ))}
                  <button type="button" className={`${s.btn} ${s.btnOutline} ${s.btnSm}`} onClick={addStop} style={{ marginTop: 4 }}>
                    <Plus size={14} /> Tambah Titik
                  </button>
                </div>
              </div>
            </div>
            <div className={s.dialogFooter}>
              <button className={`${s.btn} ${s.btnOutline}`} onClick={() => setShowDialog(false)}>Batal</button>
              <button className={`${s.btn} ${s.btnAccent}`} onClick={() => setShowDialog(false)}>Assign & Sinkron</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
