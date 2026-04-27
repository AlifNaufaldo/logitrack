'use client';
import { assignments, getItem, getWarehouse, getTruck } from '@/data/mock';
import { Package, Truck, MapPin } from 'lucide-react';
import s from '../driver.module.css';

export default function MuatanPage() {
  const assignment = assignments.find(a => a.driverId === 'DRV-001')!;
  const truck = getTruck(assignment.truckId);

  const itemDetails = assignment.items.map(ai => {
    const item = getItem(ai.itemId);
    return { ...ai, item };
  });

  const totalWeight = itemDetails.reduce((sum, d) => sum + (d.item?.weightKg || 0) * d.quantity, 0);
  const capacityKg = (truck?.capacityTon || 8) * 1000;
  const pct = Math.min((totalWeight / capacityKg) * 100, 100);

  // Group by destination
  const grouped: Record<string, typeof itemDetails> = {};
  assignment.route.forEach(stop => {
    const wh = getWarehouse(stop.warehouseId);
    if (wh) grouped[wh.name] = [];
  });
  // Distribute items across destinations for demo
  itemDetails.forEach((item, i) => {
    const keys = Object.keys(grouped);
    const dest = keys[i % keys.length];
    if (dest) grouped[dest].push(item);
  });

  return (
    <div>
      <h1 className={s.pageTitle}>Data Muatan</h1>
      <p className={s.pageDesc}>Daftar barang yang harus dibawa dalam perjalanan ini.</p>

      <div className={s.card} style={{ marginBottom: 16 }}>
        <div className={s.cardHeader}>
          <span className={s.cardTitle}>Ringkasan Muatan</span>
          <span className={`${s.badge} ${s.badgeBlue}`}>{assignment.items.length} jenis</span>
        </div>
        <div className={s.cardBody}>
          <div className={s.statsGrid}>
            <div className={s.miniStat}>
              <div className={`${s.miniStatIcon} blue`}><Package size={18} /></div>
              <div className={s.miniStatValue}>{assignment.items.reduce((s, i) => s + i.quantity, 0)}</div>
              <div className={s.miniStatLabel}>Total Item</div>
            </div>
            <div className={s.miniStat}>
              <div className={`${s.miniStatIcon} amber`}><Truck size={18} /></div>
              <div className={s.miniStatValue}>{(totalWeight / 1000).toFixed(1)}T</div>
              <div className={s.miniStatLabel}>Total Berat</div>
            </div>
          </div>

          <div className={s.capacityBar}>
            <div className={s.capacityHeader}>
              <span style={{ fontSize: 12 }}>Kapasitas Truk ({truck?.plateNumber})</span>
              <span style={{ fontWeight: 600, fontSize: 12 }}>{pct.toFixed(0)}%</span>
            </div>
            <div className={s.capacityTrack}>
              <div className={`${s.capacityFill}`} style={{ width: `${pct}%`, background: pct > 90 ? 'var(--color-danger)' : pct > 70 ? 'var(--color-warning)' : 'var(--color-accent)' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--color-text-muted)', marginTop: 4 }}>
              <span>{(totalWeight / 1000).toFixed(1)} ton</span>
              <span>{truck?.capacityTon} ton maks</span>
            </div>
          </div>
        </div>
      </div>

      {Object.entries(grouped).map(([dest, destItems]) => (
        <div key={dest} className={s.card}>
          <div className={s.cardHeader}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <MapPin size={14} style={{ color: 'var(--color-accent)' }} />
              <span className={s.cardTitle}>{dest}</span>
            </div>
          </div>
          <div className={s.cardBody}>
            <div className={s.itemList}>
              {destItems.map((d, i) => (
                <div key={i} className={s.itemRow}>
                  <div className={s.itemIcon}><Package size={16} /></div>
                  <div className={s.itemInfo}>
                    <div className={s.itemName}>{d.item?.name}</div>
                    <div className={s.itemMeta}>{d.item?.weightKg} kg/item • {d.item?.category}</div>
                  </div>
                  <div className={s.itemQty}>×{d.quantity}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
