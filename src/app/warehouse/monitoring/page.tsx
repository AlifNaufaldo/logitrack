'use client';
import { useState, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { coldRooms, roomTransfers, items, warehouseStaff, formatDateTime } from '@/data/mock';
import { CheckCircle, Clock, Box, Thermometer, User, Map, ArrowLeftRight, ArrowRight, X, Eye, Calendar, Filter } from 'lucide-react';
import s from '../warehouse.module.css';

export default function WarehouseMonitoring() {
  const { user } = useAuth();
  const warehouseId = user?.warehouseId || 'WH-001';

  const myRooms = coldRooms.filter(r => r.warehouseId === warehouseId);
  const allTransfers = roomTransfers.filter(t => t.warehouseId === warehouseId)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const [selectedTransfer, setSelectedTransfer] = useState<string | null>(null);
  const [dateFilter, setDateFilter] = useState('');

  const getRoomName = (id: string) => myRooms.find(r => r.id === id)?.name || id;
  const getStaff = (id: string) => warehouseStaff[id] || { name: id, role: 'Staff' };

  const filteredTransfers = useMemo(() => {
    if (!dateFilter) return allTransfers;
    return allTransfers.filter(t => t.timestamp.startsWith(dateFilter));
  }, [allTransfers, dateFilter]);

  const selectedData = selectedTransfer ? allTransfers.find(t => t.id === selectedTransfer) : null;
  const selectedItem = selectedData ? items.find(i => i.id === selectedData.itemId) : null;
  const selectedStaff = selectedData ? getStaff(selectedData.initiatedBy) : null;

  return (
    <div>
      {/* ─── Room Summary Cards ─── */}
      <div style={{ display: 'flex', gap: 20, marginBottom: 24 }}>
        {myRooms.map(room => {
          const outgoing = allTransfers.filter(t => t.fromRoomId === room.id).length;
          const incoming = allTransfers.filter(t => t.toRoomId === room.id).length;
          return (
            <div key={room.id} style={{
              flex: 1, padding: 20, borderRadius: 16,
              background: 'linear-gradient(135deg, #F0F9FF, #E0F2FE)',
              border: '2px solid #BAE6FD', textAlign: 'center',
            }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: '#0EA5E9', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
                <Thermometer size={18} />
              </div>
              <div style={{ fontWeight: 700, fontSize: 14, color: '#0C4A6E', marginBottom: 2 }}>{room.name}</div>
              <div style={{ fontSize: 12, color: '#64748B', marginBottom: 8 }}>{room.currentTemp.toFixed(1)}°C • {room.usedCapacity}/{room.capacity}</div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
                <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 6, background: '#ECFDF5', color: '#059669', fontWeight: 600 }}>↓{incoming}</span>
                <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 6, background: '#FEF2F2', color: '#DC2626', fontWeight: 600 }}>↑{outgoing}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ─── Stats ─── */}
      <div className={s.statsRow}>
        <div className={s.statCard}>
          <div className={`${s.statIcon} blue`}><ArrowLeftRight size={22} /></div>
          <div><div className={s.statValue}>{filteredTransfers.length}</div><div className={s.statLabel}>Total Perpindahan</div></div>
        </div>
        <div className={s.statCard}>
          <div className={`${s.statIcon} green`}><CheckCircle size={22} /></div>
          <div><div className={s.statValue}>{filteredTransfers.filter(t => t.status === 'completed').length}</div><div className={s.statLabel}>Selesai</div></div>
        </div>
        <div className={s.statCard}>
          <div className={`${s.statIcon} amber`}><Clock size={22} /></div>
          <div><div className={s.statValue}>{filteredTransfers.filter(t => t.status === 'pending').length}</div><div className={s.statLabel}>Menunggu</div></div>
        </div>
        <div className={s.statCard}>
          <div className={`${s.statIcon} red`}><Box size={22} /></div>
          <div><div className={s.statValue}>{filteredTransfers.reduce((sum, t) => sum + t.quantity, 0)}</div><div className={s.statLabel}>Total Unit</div></div>
        </div>
      </div>

      {/* ─── Table ─── */}
      <div className={s.section}>
        <div className={s.sectionHeader}>
          <div className={s.sectionTitle}><Map size={18} /> Riwayat Perpindahan Barang</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Calendar size={14} style={{ position: 'absolute', left: 10, color: '#94A3B8', pointerEvents: 'none' }} />
              <input
                type="date"
                className={s.input}
                value={dateFilter}
                onChange={e => setDateFilter(e.target.value)}
                style={{ paddingLeft: 32, width: 180, height: 36, fontSize: 13 }}
              />
            </div>
            {dateFilter && (
              <button
                onClick={() => setDateFilter('')}
                style={{ background: 'none', border: '1px solid #E2E8F0', borderRadius: 8, padding: '6px 12px', fontSize: 12, cursor: 'pointer', color: '#64748B', display: 'flex', alignItems: 'center', gap: 4 }}
              >
                <X size={12} /> Reset
              </button>
            )}
          </div>
        </div>

        <div className={s.tableWrapper}>
          <table className={s.table}>
            <thead>
              <tr>
                <th style={{ width: 50 }}>NO</th>
                <th>TANGGAL</th>
                <th>ASAL</th>
                <th>TUJUAN</th>
                <th>ITEM & QTY</th>
                <th>STATUS</th>
                <th style={{ width: 80 }}>DETAIL</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransfers.length > 0 ? filteredTransfers.map((t, idx) => {
                const item = items.find(i => i.id === t.itemId);
                return (
                  <tr key={t.id}>
                    <td style={{ fontWeight: 600, color: '#94A3B8' }}>{idx + 1}</td>
                    <td>{formatDateTime(t.timestamp)}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#EF4444', flexShrink: 0 }} />
                        {getRoomName(t.fromRoomId)}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981', flexShrink: 0 }} />
                        {getRoomName(t.toRoomId)}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{item?.name}</div>
                      <div style={{ fontSize: 11, color: '#94A3B8' }}>{t.quantity} {item?.unit}</div>
                    </td>
                    <td>
                      {t.status === 'completed' ? (
                        <span className={`${s.badge} ${s.in}`}><CheckCircle size={11} /> Selesai</span>
                      ) : (
                        <span className={`${s.badge} ${s.out}`} style={{ background: '#FFFBEB', color: '#D97706' }}><Clock size={11} /> Pending</span>
                      )}
                    </td>
                    <td>
                      <button
                        onClick={() => setSelectedTransfer(t.id)}
                        style={{
                          background: '#F0F9FF', border: '1px solid #BAE6FD', borderRadius: 8,
                          padding: '6px 12px', cursor: 'pointer', color: '#0EA5E9',
                          fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4,
                        }}
                      >
                        <Eye size={13} /> Lihat
                      </button>
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: 40, color: '#94A3B8' }}>
                    Tidak ada data perpindahan{dateFilter ? ' untuk tanggal ini' : ''}.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── Detail Modal ─── */}
      {selectedData && selectedItem && selectedStaff && (
        <div
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
            backdropFilter: 'blur(4px)', zIndex: 9999,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            animation: 'fadeIn 0.2s ease',
          }}
          onClick={() => setSelectedTransfer(null)}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: 'white', borderRadius: 20, width: '100%', maxWidth: 520,
              boxShadow: '0 25px 50px rgba(0,0,0,0.15)', overflow: 'hidden',
              animation: 'fadeIn 0.25s ease',
            }}
          >
            {/* Modal Header */}
            <div style={{
              padding: '20px 24px', background: '#F0F9FF', borderBottom: '1px solid #E0F2FE',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#0C4A6E' }}>Detail Perpindahan</div>
                <div style={{ fontSize: 12, color: '#64748B' }}>ID: {selectedData.id}</div>
              </div>
              <button onClick={() => setSelectedTransfer(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B', padding: 4 }}>
                <X size={20} />
              </button>
            </div>

            {/* Transfer Flow Visual */}
            <div style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 12, background: '#FAFBFC' }}>
              <div style={{ flex: 1, padding: 12, borderRadius: 10, background: '#FEF2F2', textAlign: 'center', border: '1px solid #FECACA' }}>
                <div style={{ fontSize: 11, color: '#DC2626', fontWeight: 600, marginBottom: 2 }}>ASAL</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>{getRoomName(selectedData.fromRoomId)}</div>
              </div>
              <ArrowRight size={20} color="#0EA5E9" />
              <div style={{ flex: 1, padding: 12, borderRadius: 10, background: '#ECFDF5', textAlign: 'center', border: '1px solid #A7F3D0' }}>
                <div style={{ fontSize: 11, color: '#059669', fontWeight: 600, marginBottom: 2 }}>TUJUAN</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>{getRoomName(selectedData.toRoomId)}</div>
              </div>
            </div>

            {/* Details Grid */}
            <div style={{ padding: '20px 24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                {/* Item */}
                <div>
                  <div style={{ fontSize: 10, color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>Barang</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#0F172A' }}>{selectedItem.name}</div>
                  <div style={{ fontSize: 12, color: '#64748B' }}>{selectedItem.code} • {selectedItem.category}</div>
                </div>

                {/* Quantity */}
                <div>
                  <div style={{ fontSize: 10, color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>Jumlah</div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: '#0EA5E9' }}>{selectedData.quantity}</div>
                  <div style={{ fontSize: 12, color: '#64748B' }}>{selectedItem.unit}</div>
                </div>

                {/* Staff */}
                <div>
                  <div style={{ fontSize: 10, color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>Staff Pemindah</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: '#E0F2FE', color: '#0EA5E9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <User size={16} />
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#0F172A' }}>{selectedStaff.name}</div>
                      <div style={{ fontSize: 11, color: '#64748B' }}>{selectedStaff.role}</div>
                    </div>
                  </div>
                </div>

                {/* Waktu */}
                <div>
                  <div style={{ fontSize: 10, color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>Waktu</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#0F172A' }}>{formatDateTime(selectedData.timestamp)}</div>
                </div>
              </div>

              {/* Status */}
              <div style={{ marginTop: 20, padding: 12, borderRadius: 10, background: '#F8FAFC', border: '1px solid #F1F5F9' }}>
                <div style={{ fontSize: 10, color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>Status</div>
                {selectedData.status === 'completed' ? (
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#059669', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <CheckCircle size={16} /> Transfer Selesai
                  </span>
                ) : (
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#D97706', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Clock size={16} /> Menunggu Konfirmasi
                  </span>
                )}
              </div>

              {/* Alasan */}
              <div style={{ marginTop: 16 }}>
                <div style={{ fontSize: 10, color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>Alasan Perpindahan</div>
                <div style={{ fontSize: 13, color: '#334155', lineHeight: 1.6, padding: 12, background: '#F8FAFC', borderRadius: 8, border: '1px solid #F1F5F9' }}>
                  {selectedData.reason}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{ padding: '16px 24px', borderTop: '1px solid #F1F5F9', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setSelectedTransfer(null)}
                className={s.btnPrimary}
                style={{ padding: '8px 20px', fontSize: 13 }}
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
