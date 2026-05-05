'use client';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { coldRooms, roomTransfers, items, warehouseStaff, formatDateTime } from '@/data/mock';
import { ArrowLeftRight, Plus, History, CheckCircle, Clock, Package, User } from 'lucide-react';
import { useToast } from '../components/ToastProvider';
import s from '../warehouse.module.css';

export default function WarehouseTransfer() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const warehouseId = user?.warehouseId || 'WH-001';

  const myRooms = coldRooms.filter(r => r.warehouseId === warehouseId);
  const myTransfers = roomTransfers.filter(t => t.warehouseId === warehouseId)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const [form, setForm] = useState({
    itemId: '',
    quantity: '',
    fromRoom: '',
    toRoom: '',
    reason: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.itemId || !form.quantity || !form.fromRoom || !form.toRoom) {
      addToast('danger', 'Form Belum Lengkap', 'Harap isi semua kolom yang diperlukan.');
      return;
    }
    if (form.fromRoom === form.toRoom) {
      addToast('warning', 'Room Sama', 'Room asal dan tujuan tidak boleh sama.');
      return;
    }
    addToast('success', 'Transfer Berhasil', `Item berhasil dipindahkan.`);
    setForm({ itemId: '', quantity: '', fromRoom: '', toRoom: '', reason: '' });
  };

  const getStaff = (id: string) => warehouseStaff[id] || { name: id, role: 'Staff' };
  const getRoomName = (id: string) => myRooms.find(r => r.id === id)?.name || id;

  return (
    <div className={s.dashboardGrid}>
      {/* ─── Form ─── */}
      <div className={s.section}>
        <div className={s.sectionHeader}>
          <div className={s.sectionTitle}><Plus size={18} /> Buat Pemindahan Baru</div>
        </div>
        <form onSubmit={handleSubmit} style={{ padding: 20 }}>
          <div className={s.formGroup}>
            <label className={s.label}>Pilih Barang</label>
            <select 
              className={s.select} 
              value={form.itemId}
              onChange={e => setForm({...form, itemId: e.target.value})}
            >
              <option value="">Pilih barang...</option>
              {items.map(item => <option key={item.id} value={item.id}>{item.name} ({item.unit})</option>)}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className={s.formGroup}>
              <label className={s.label}>Dari Room</label>
              <select 
                className={s.select}
                value={form.fromRoom}
                onChange={e => setForm({...form, fromRoom: e.target.value})}
              >
                <option value="">Pilih asal...</option>
                {myRooms.map(r => <option key={r.id} value={r.id}>{r.name} ({r.currentTemp.toFixed(1)}°C)</option>)}
              </select>
            </div>
            <div className={s.formGroup}>
              <label className={s.label}>Ke Room</label>
              <select 
                className={s.select}
                value={form.toRoom}
                onChange={e => setForm({...form, toRoom: e.target.value})}
              >
                <option value="">Pilih tujuan...</option>
                {myRooms.filter(r => r.id !== form.fromRoom).map(r => <option key={r.id} value={r.id}>{r.name} ({r.currentTemp.toFixed(1)}°C)</option>)}
              </select>
            </div>
          </div>

          <div className={s.formGroup}>
            <label className={s.label}>Jumlah (Unit)</label>
            <input 
              type="number" 
              className={s.input} 
              placeholder="0"
              value={form.quantity}
              onChange={e => setForm({...form, quantity: e.target.value})}
            />
          </div>

          <div className={s.formGroup}>
            <label className={s.label}>Alasan Pemindahan</label>
            <textarea 
              className={s.textarea} 
              rows={3} 
              placeholder="Contoh: Penyesuaian stok, room maintenance, rotasi FIFO..."
              value={form.reason}
              onChange={e => setForm({...form, reason: e.target.value})}
            ></textarea>
          </div>

          <button type="submit" className={s.btnPrimary} style={{ width: '100%' }}>
            <ArrowLeftRight size={18} /> Konfirmasi Pemindahan
          </button>
        </form>
      </div>

      {/* ─── History ─── */}
      <div className={s.section}>
        <div className={s.sectionHeader}>
          <div className={s.sectionTitle}><History size={18} /> Riwayat Pemindahan</div>
        </div>
        <div style={{ maxHeight: 'calc(100vh - 250px)', overflowY: 'auto' }}>
          {myTransfers.length > 0 ? (
            <ul className={s.activityList}>
              {myTransfers.map(t => {
                const item = items.find(i => i.id === t.itemId);
                const staff = getStaff(t.initiatedBy);
                return (
                  <li key={t.id} className={s.activityItem}>
                    <div className={s.activityIcon} style={{ background: '#F0F9FF', color: '#0EA5E9' }}>
                      <ArrowLeftRight size={16} />
                    </div>
                    <div className={s.activityContent}>
                      <div className={s.activityText}>
                        <strong>{item?.name}</strong> — {t.quantity} {item?.unit}
                      </div>
                      <div style={{ fontSize: 12, color: '#475569', marginTop: 2 }}>
                        {getRoomName(t.fromRoomId)} → {getRoomName(t.toRoomId)}
                      </div>
                      <div style={{ fontSize: 12, color: '#475569', marginTop: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <User size={10} /> {staff.name} • {staff.role}
                      </div>
                      <div className={s.activityTime} style={{ marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                        {t.status === 'completed' ? <CheckCircle size={10} color="#10B981" /> : <Clock size={10} color="#D97706" />}
                        {formatDateTime(t.timestamp)}
                        <span style={{ marginLeft: 6, fontSize: 10, padding: '1px 6px', borderRadius: 6, background: t.status === 'completed' ? '#ECFDF5' : '#FFFBEB', color: t.status === 'completed' ? '#059669' : '#D97706', fontWeight: 600 }}>
                          {t.status === 'completed' ? 'Selesai' : 'Pending'}
                        </span>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div style={{ padding: 40, textAlign: 'center', color: '#94A3B8' }}>
              <Package size={48} opacity={0.2} style={{ margin: '0 auto 12px' }} />
              <div style={{ fontSize: 14 }}>Belum ada riwayat pemindahan</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
