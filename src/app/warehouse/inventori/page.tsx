'use client';
import { useAuth } from '@/context/AuthContext';
import { stockMovements, getItem, formatDateTime } from '@/data/mock';
import { Box, Search, Filter, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import s from '../warehouse.module.css';

export default function WarehouseInventori() {
  const { user } = useAuth();
  const warehouseId = user?.warehouseId || 'WH-001';

  const myMovements = stockMovements.filter(m => m.warehouseId === warehouseId)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <div className={s.section}>
      <div className={s.sectionHeader}>
        <div className={s.sectionTitle}><Box size={18} /> Riwayat Barang Masuk & Keluar</div>
        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
            <input type="text" className={s.input} placeholder="Cari barang..." style={{ paddingLeft: 36, width: 240 }} />
          </div>
          <button className={s.btnPrimary} style={{ background: 'white', color: '#64748B', border: '1px solid #E2E8F0' }}>
            <Filter size={16} /> Filter
          </button>
        </div>
      </div>

      <div className={s.tableWrapper}>
        <table className={s.table}>
          <thead>
            <tr>
              <th>WAKTU</th>
              <th>TIPE</th>
              <th>NAMA BARANG</th>
              <th>QTY</th>
              <th>LOKASI / ROOM</th>
              <th>ASSIGNMENT</th>
              <th>NOTE</th>
            </tr>
          </thead>
          <tbody>
            {myMovements.map(m => {
              const item = getItem(m.itemId);
              return (
                <tr key={m.id}>
                  <td>{formatDateTime(m.timestamp)}</td>
                  <td>
                    <span className={`${s.badge} ${m.type === 'in' ? s.in : s.out}`}>
                      {m.type === 'in' ? <ArrowDownLeft size={12} /> : <ArrowUpRight size={12} />}
                      {m.type === 'in' ? 'Masuk' : 'Keluar'}
                    </span>
                  </td>
                  <td style={{ fontWeight: 600 }}>{item?.name}</td>
                  <td>{m.quantity} {item?.unit}</td>
                  <td>{m.type === 'in' ? m.toRoom : m.fromRoom}</td>
                  <td>
                    {m.assignmentId ? (
                      <span style={{ color: '#0EA5E9', fontWeight: 500 }}>{m.assignmentId}</span>
                    ) : (
                      <span style={{ color: '#94A3B8' }}>—</span>
                    )}
                  </td>
                  <td style={{ fontSize: 12, color: '#64748B' }}>{m.note}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
