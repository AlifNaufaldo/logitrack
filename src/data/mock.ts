// ═══ LogiTrack Mock Data ═══

export interface Driver {
  id: string; name: string; phone: string; simNumber: string; simExpiry: string;
  status: 'active' | 'inactive' | 'on_trip'; currentLocation: { lat: number; lng: number };
  assignedTruck: string | null; avatar: string;
}

export interface Truck {
  id: string; plateNumber: string; type: string;
  capacityTon: number; dimensions: { length: number; width: number; height: number };
  status: 'available' | 'in_use' | 'maintenance';
}

export interface Warehouse {
  id: string; code: string; name: string; city: string; address: string;
  coordinates: { lat: number; lng: number }; capacity: number;
}

export interface Item {
  id: string; code: string; name: string; category: string;
  weightKg: number; dimensions: { length: number; width: number; height: number }; unit: string;
}

export interface RouteStop {
  warehouseId: string; order: number; estimatedArrival: string;
  actualArrival: string | null; status: 'pending' | 'en_route' | 'arrived';
}

export interface AssignmentItem { itemId: string; quantity: number; }

export interface Assignment {
  id: string; driverId: string; truckId: string; route: RouteStop[];
  items: AssignmentItem[]; status: 'pending' | 'in_progress' | 'completed'; createdAt: string;
}

export interface Attendance {
  id: string; driverId: string; type: 'in' | 'out'; timestamp: string;
  location: { lat: number; lng: number }; address: string; selfieUrl: string;
}

export interface VehiclePhoto {
  id: string; assignmentId: string; angle: string; url: string;
  note: string; timestamp: string;
}

export interface Document {
  id: string; driverId: string; type: string; name: string;
  url: string; uploadedAt: string; status: 'pending' | 'verified';
}

// --- NEW Warehouse Specific Interfaces ---

export interface ColdRoom {
  id: string;
  warehouseId: string;
  name: string;
  minTemp: number;
  maxTemp: number;
  currentTemp: number;
  humidity: number;      // % RH
  dewPoint: number;      // °C
  capacity: number;
  usedCapacity: number;
  status: 'normal' | 'warning' | 'danger' | 'offline';
}

export interface TempLog {
  id: string;
  coldRoomId: string;
  temp: number;
  timestamp: string;
}

export interface StockMovement {
  id: string;
  warehouseId: string;
  type: 'in' | 'out';
  itemId: string;
  quantity: number;
  assignmentId: string | null;
  fromRoom: string | null;
  toRoom: string | null;
  handledBy: string;
  timestamp: string;
  note: string;
}

export interface RoomTransfer {
  id: string;
  warehouseId: string;
  itemId: string;
  quantity: number;
  fromRoomId: string;
  toRoomId: string;
  reason: string;
  initiatedBy: string;
  timestamp: string;
  status: 'pending' | 'completed';
}

export interface CCTVCamera {
  id: string;
  warehouseId: string;
  name: string;
  embedUrl: string;
  isOnline: boolean;
  location: string;
}

// --- Data ---

export const drivers: Driver[] = [
  { id: 'DRV-001', name: 'Lionel Messi', phone: '081234567801', simNumber: 'SIM-A-12345', simExpiry: '2027-06-15', status: 'on_trip', currentLocation: { lat: -6.3065, lng: 107.2862 }, assignedTruck: 'TRK-001', avatar: '/avatars/1.jpg' },
  { id: 'DRV-002', name: 'Cristiano Ronaldo', phone: '081234567802', simNumber: 'SIM-B2-23456', simExpiry: '2026-11-20', status: 'on_trip', currentLocation: { lat: -6.1751, lng: 106.8650 }, assignedTruck: 'TRK-003', avatar: '/avatars/2.jpg' },
  { id: 'DRV-003', name: 'Kevin De Bruyne', phone: '081234567803', simNumber: 'SIM-B2-34567', simExpiry: '2027-03-10', status: 'active', currentLocation: { lat: -6.2297, lng: 106.6894 }, assignedTruck: null, avatar: '/avatars/3.jpg' },
  { id: 'DRV-004', name: 'Erling Haaland', phone: '081234567804', simNumber: 'SIM-A-45678', simExpiry: '2026-08-25', status: 'on_trip', currentLocation: { lat: -6.1114, lng: 106.8446 }, assignedTruck: 'TRK-005', avatar: '/avatars/4.jpg' },
  { id: 'DRV-005', name: 'Kylian Mbappe', phone: '081234567805', simNumber: 'SIM-B2-56789', simExpiry: '2027-01-30', status: 'active', currentLocation: { lat: -6.2615, lng: 106.8106 }, assignedTruck: null, avatar: '/avatars/5.jpg' },
  { id: 'DRV-006', name: 'Jude Bellingham', phone: '081234567806', simNumber: 'SIM-A-67890', simExpiry: '2026-12-05', status: 'inactive', currentLocation: { lat: -6.2088, lng: 106.8456 }, assignedTruck: null, avatar: '/avatars/6.jpg' },
  { id: 'DRV-007', name: 'Virgil van Dijk', phone: '081234567807', simNumber: 'SIM-B2-78901', simExpiry: '2027-04-18', status: 'on_trip', currentLocation: { lat: -6.3297, lng: 107.3115 }, assignedTruck: 'TRK-008', avatar: '/avatars/7.jpg' },
  { id: 'DRV-008', name: 'Luka Modric', phone: '081234567808', simNumber: 'SIM-A-89012', simExpiry: '2026-09-22', status: 'active', currentLocation: { lat: -6.1862, lng: 106.8283 }, assignedTruck: null, avatar: '/avatars/8.jpg' },
  { id: 'DRV-009', name: 'Harry Kane', phone: '081234567809', simNumber: 'SIM-B2-90123', simExpiry: '2027-07-14', status: 'on_trip', currentLocation: { lat: -6.2383, lng: 106.9756 }, assignedTruck: 'TRK-010', avatar: '/avatars/9.jpg' },
  { id: 'DRV-010', name: 'Toni Kroos', phone: '081234567810', simNumber: 'SIM-A-01234', simExpiry: '2026-10-08', status: 'active', currentLocation: { lat: -6.2546, lng: 106.8402 }, assignedTruck: null, avatar: '/avatars/10.jpg' },
];

export const trucks: Truck[] = [
  { id: 'TRK-001', plateNumber: 'B 1234 CD', type: 'Fuso', capacityTon: 8, dimensions: { length: 680, width: 230, height: 200 }, status: 'in_use' },
  { id: 'TRK-002', plateNumber: 'B 2345 EF', type: 'CDD', capacityTon: 5, dimensions: { length: 560, width: 210, height: 190 }, status: 'available' },
  { id: 'TRK-003', plateNumber: 'B 3456 GH', type: 'Tronton', capacityTon: 15, dimensions: { length: 900, width: 240, height: 220 }, status: 'in_use' },
  { id: 'TRK-004', plateNumber: 'B 4567 IJ', type: 'Engkel', capacityTon: 3, dimensions: { length: 420, width: 180, height: 170 }, status: 'available' },
  { id: 'TRK-005', plateNumber: 'B 5678 KL', type: 'Wingbox', capacityTon: 10, dimensions: { length: 750, width: 240, height: 240 }, status: 'in_use' },
  { id: 'TRK-006', plateNumber: 'B 6789 MN', type: 'Fuso', capacityTon: 8, dimensions: { length: 680, width: 230, height: 200 }, status: 'maintenance' },
  { id: 'TRK-007', plateNumber: 'B 7890 OP', type: 'CDD', capacityTon: 5, dimensions: { length: 560, width: 210, height: 190 }, status: 'available' },
  { id: 'TRK-008', plateNumber: 'B 8901 QR', type: 'Tronton', capacityTon: 15, dimensions: { length: 900, width: 240, height: 220 }, status: 'in_use' },
  { id: 'TRK-009', plateNumber: 'B 9012 ST', type: 'Engkel', capacityTon: 3, dimensions: { length: 420, width: 180, height: 170 }, status: 'available' },
  { id: 'TRK-010', plateNumber: 'B 0123 UV', type: 'Wingbox', capacityTon: 10, dimensions: { length: 750, width: 240, height: 240 }, status: 'in_use' },
];

export const warehouses: Warehouse[] = [
  { id: 'WH-001', code: 'KRW', name: 'Gudang Karawang', city: 'Karawang', address: 'Jl. Industri Raya No. 15, Karawang Barat', coordinates: { lat: -6.3065, lng: 107.2862 }, capacity: 5000 },
  { id: 'WH-002', code: 'JKU', name: 'Gudang Jakarta Utara', city: 'Jakarta Utara', address: 'Jl. Pluit Raya No. 88, Penjaringan', coordinates: { lat: -6.1114, lng: 106.8446 }, capacity: 8000 },
  { id: 'WH-003', code: 'TPK', name: 'Gudang Tanjung Priok', city: 'Jakarta Utara', address: 'Jl. Pelabuhan No. 45, Tanjung Priok', coordinates: { lat: -6.1037, lng: 106.8712 }, capacity: 10000 },
  { id: 'WH-004', code: 'CKR', name: 'Gudang Cikarang', city: 'Cikarang', address: 'Jl. Jababeka Raya Blok F No. 22', coordinates: { lat: -6.2927, lng: 107.1492 }, capacity: 6000 },
  { id: 'WH-005', code: 'BKS', name: 'Gudang Bekasi', city: 'Bekasi', address: 'Jl. Ahmad Yani No. 120, Bekasi Selatan', coordinates: { lat: -6.2383, lng: 106.9756 }, capacity: 4500 },
  { id: 'WH-006', code: 'TGR', name: 'Gudang Tangerang', city: 'Tangerang', address: 'Jl. MH Thamrin No. 55, Cikokol', coordinates: { lat: -6.2297, lng: 106.6894 }, capacity: 5500 },
  { id: 'WH-007', code: 'DPK', name: 'Gudang Depok', city: 'Depok', address: 'Jl. Margonda Raya No. 200', coordinates: { lat: -6.3882, lng: 106.8313 }, capacity: 3500 },
  { id: 'WH-008', code: 'BGR', name: 'Gudang Bogor', city: 'Bogor', address: 'Jl. Pajajaran No. 18, Bogor Tengah', coordinates: { lat: -6.5971, lng: 106.8060 }, capacity: 4000 },
  { id: 'WH-009', code: 'JKS', name: 'Gudang Jakarta Selatan', city: 'Jakarta Selatan', address: 'Jl. TB Simatupang No. 99', coordinates: { lat: -6.2615, lng: 106.8106 }, capacity: 7000 },
  { id: 'WH-010', code: 'JKB', name: 'Gudang Jakarta Barat', city: 'Jakarta Barat', address: 'Jl. Daan Mogot KM 12', coordinates: { lat: -6.1751, lng: 106.7340 }, capacity: 6500 },
];

export const items: Item[] = [
  { id: 'ITM-001', code: 'ELC-001', name: 'TV LED 55 inch', category: 'Elektronik', weightKg: 18, dimensions: { length: 140, width: 85, height: 15 }, unit: 'unit' },
  { id: 'ITM-002', code: 'ELC-002', name: 'Kulkas 2 Pintu', category: 'Elektronik', weightKg: 65, dimensions: { length: 70, width: 65, height: 170 }, unit: 'unit' },
  { id: 'ITM-003', code: 'ELC-003', name: 'Mesin Cuci Front Load', category: 'Elektronik', weightKg: 72, dimensions: { length: 60, width: 65, height: 85 }, unit: 'unit' },
  { id: 'ITM-004', code: 'FNB-001', name: 'Air Mineral 600ml (Karton)', category: 'Makanan & Minuman', weightKg: 12, dimensions: { length: 40, width: 30, height: 25 }, unit: 'karton' },
  { id: 'ITM-005', code: 'FNB-002', name: 'Mie Instan (Karton)', category: 'Makanan & Minuman', weightKg: 8, dimensions: { length: 50, width: 35, height: 30 }, unit: 'karton' },
  { id: 'ITM-006', code: 'BLD-001', name: 'Semen Portland 50kg', category: 'Bahan Bangunan', weightKg: 50, dimensions: { length: 60, width: 40, height: 15 }, unit: 'sak' },
  { id: 'ITM-007', code: 'BLD-002', name: 'Cat Tembok 25L', category: 'Bahan Bangunan', weightKg: 35, dimensions: { length: 30, width: 30, height: 45 }, unit: 'pail' },
  { id: 'ITM-008', code: 'TXT-001', name: 'Kain Tekstil (Roll)', category: 'Tekstil', weightKg: 25, dimensions: { length: 120, width: 30, height: 30 }, unit: 'roll' },
  { id: 'ITM-009', code: 'OFC-001', name: 'Kertas HVS A4 (Rim)', category: 'ATK', weightKg: 2.5, dimensions: { length: 30, width: 21, height: 5 }, unit: 'rim' },
  { id: 'ITM-010', code: 'CHM-001', name: 'Deterjen Bubuk 5kg', category: 'Kimia', weightKg: 5, dimensions: { length: 35, width: 25, height: 10 }, unit: 'karton' },
];

export const assignments: Assignment[] = [
  {
    id: 'ASG-001', driverId: 'DRV-001', truckId: 'TRK-001',
    route: [
      { warehouseId: 'WH-001', order: 1, estimatedArrival: '2026-04-28T07:00:00', actualArrival: '2026-04-28T07:05:00', status: 'arrived' },
      { warehouseId: 'WH-004', order: 2, estimatedArrival: '2026-04-28T08:30:00', actualArrival: '2026-04-28T08:45:00', status: 'arrived' },
      { warehouseId: 'WH-005', order: 3, estimatedArrival: '2026-04-28T10:15:00', actualArrival: null, status: 'en_route' },
      { warehouseId: 'WH-002', order: 4, estimatedArrival: '2026-04-28T12:30:00', actualArrival: null, status: 'pending' },
    ],
    items: [{ itemId: 'ITM-001', quantity: 20 }, { itemId: 'ITM-004', quantity: 50 }, { itemId: 'ITM-009', quantity: 100 }],
    status: 'in_progress', createdAt: '2026-04-28T06:00:00',
  },
  {
    id: 'ASG-002', driverId: 'DRV-002', truckId: 'TRK-003',
    route: [
      { warehouseId: 'WH-003', order: 1, estimatedArrival: '2026-04-28T07:30:00', actualArrival: '2026-04-28T07:28:00', status: 'arrived' },
      { warehouseId: 'WH-009', order: 2, estimatedArrival: '2026-04-28T09:00:00', actualArrival: null, status: 'en_route' },
      { warehouseId: 'WH-007', order: 3, estimatedArrival: '2026-04-28T11:00:00', actualArrival: null, status: 'pending' },
    ],
    items: [{ itemId: 'ITM-002', quantity: 15 }, { itemId: 'ITM-003', quantity: 10 }, { itemId: 'ITM-006', quantity: 80 }],
    status: 'in_progress', createdAt: '2026-04-28T06:30:00',
  },
];

// --- NEW Warehouse Mock Data ---

export const coldRooms: ColdRoom[] = [
  { id: 'CR-001', warehouseId: 'WH-001', name: 'Cold Room A', minTemp: 2, maxTemp: 8, currentTemp: 4.5, humidity: 85, dewPoint: 2.1, capacity: 500, usedCapacity: 320, status: 'normal' },
  { id: 'CR-002', warehouseId: 'WH-001', name: 'Cold Room B', minTemp: -18, maxTemp: -12, currentTemp: -15.2, humidity: 45, dewPoint: -22.8, capacity: 300, usedCapacity: 150, status: 'normal' },
  { id: 'CR-003', warehouseId: 'WH-001', name: 'Cold Room C', minTemp: 0, maxTemp: 5, currentTemp: 7.8, humidity: 92, dewPoint: 6.5, capacity: 400, usedCapacity: 380, status: 'warning' },
  { id: 'CR-004', warehouseId: 'WH-002', name: 'Cold Room Alpha', minTemp: 2, maxTemp: 8, currentTemp: 4.2, humidity: 80, dewPoint: 1.3, capacity: 600, usedCapacity: 400, status: 'normal' },
  { id: 'CR-005', warehouseId: 'WH-002', name: 'Cold Room Beta', minTemp: -20, maxTemp: -15, currentTemp: -10.5, humidity: 38, dewPoint: -25.1, capacity: 400, usedCapacity: 200, status: 'danger' },
];

export const tempLogs: TempLog[] = [
  { id: 'TL-001', coldRoomId: 'CR-001', temp: 4.2, timestamp: '2026-05-05T08:00:00' },
  { id: 'TL-002', coldRoomId: 'CR-001', temp: 4.5, timestamp: '2026-05-05T09:00:00' },
  { id: 'TL-003', coldRoomId: 'CR-001', temp: 4.8, timestamp: '2026-05-05T10:00:00' },
  { id: 'TL-004', coldRoomId: 'CR-001', temp: 4.5, timestamp: '2026-05-05T11:00:00' },
  { id: 'TL-005', coldRoomId: 'CR-001', temp: 4.3, timestamp: '2026-05-05T12:00:00' },
  { id: 'TL-006', coldRoomId: 'CR-001', temp: 4.5, timestamp: '2026-05-05T13:00:00' },
];

export const stockMovements: StockMovement[] = [
  { id: 'SM-001', warehouseId: 'WH-001', type: 'in', itemId: 'ITM-001', quantity: 50, assignmentId: 'ASG-001', fromRoom: null, toRoom: 'CR-001', handledBy: 'WH-USER-1', timestamp: '2026-05-05T08:30:00', note: 'Barang masuk dari Truk ASG-001' },
  { id: 'SM-002', warehouseId: 'WH-001', type: 'out', itemId: 'ITM-004', quantity: 20, assignmentId: null, fromRoom: 'CR-003', toRoom: null, handledBy: 'WH-USER-1', timestamp: '2026-05-05T10:15:00', note: 'Pengiriman retail' },
  { id: 'SM-003', warehouseId: 'WH-001', type: 'in', itemId: 'ITM-005', quantity: 100, assignmentId: 'ASG-003', fromRoom: null, toRoom: 'CR-002', handledBy: 'WH-USER-1', timestamp: '2026-05-05T11:45:00', note: 'Stok baru' },
];

export const roomTransfers: RoomTransfer[] = [
  { id: 'RT-001', warehouseId: 'WH-001', itemId: 'ITM-001', quantity: 10, fromRoomId: 'CR-001', toRoomId: 'CR-003', reason: 'Penyesuaian kapasitas Cold Room A penuh', initiatedBy: 'WH-USER-1', timestamp: '2026-05-05T09:20:00', status: 'completed' },
  { id: 'RT-002', warehouseId: 'WH-001', itemId: 'ITM-004', quantity: 30, fromRoomId: 'CR-003', toRoomId: 'CR-001', reason: 'Rotasi stok FIFO', initiatedBy: 'WH-USER-1', timestamp: '2026-05-05T10:05:00', status: 'completed' },
  { id: 'RT-003', warehouseId: 'WH-001', itemId: 'ITM-005', quantity: 50, fromRoomId: 'CR-002', toRoomId: 'CR-003', reason: 'Maintenance Cold Room B', initiatedBy: 'WH-USER-1', timestamp: '2026-05-05T11:30:00', status: 'completed' },
  { id: 'RT-004', warehouseId: 'WH-001', itemId: 'ITM-002', quantity: 5, fromRoomId: 'CR-001', toRoomId: 'CR-002', reason: 'Produk butuh suhu lebih rendah', initiatedBy: 'WH-USER-1', timestamp: '2026-05-05T13:15:00', status: 'pending' },
  { id: 'RT-005', warehouseId: 'WH-001', itemId: 'ITM-003', quantity: 8, fromRoomId: 'CR-003', toRoomId: 'CR-002', reason: 'Konsolidasi barang frozen', initiatedBy: 'WH-USER-1', timestamp: '2026-05-05T14:00:00', status: 'pending' },
];

// Staff lookup for warehouse users
export interface WarehouseStaffMember {
  name: string;
  role: string;
  status: 'active' | 'idle' | 'break';
  currentTask: string;
  avatar: string; // initials
}

export const warehouseStaff: Record<string, WarehouseStaffMember> = {
  'WH-USER-1': { name: 'Budi Santoso', role: 'Kepala Gudang', status: 'active', currentTask: 'Memindahkan Mesin Cuci ke Cold Room B', avatar: 'BS' },
  'WH-USER-2': { name: 'Rina Wati', role: 'Staff Inventori', status: 'active', currentTask: 'Mencatat barang masuk dari ASG-001', avatar: 'RW' },
  'WH-USER-3': { name: 'Dedi Kurniawan', role: 'Operator Cold Storage', status: 'idle', currentTask: 'Standby — monitoring suhu', avatar: 'DK' },
  'WH-USER-4': { name: 'Siti Aminah', role: 'QC Inspector', status: 'break', currentTask: 'Istirahat makan siang', avatar: 'SA' },
  'WH-USER-5': { name: 'Agung Prasetyo', role: 'Forklift Operator', status: 'active', currentTask: 'Memuat 50 karton ke Packing Area', avatar: 'AP' },
};

export const cctvCameras: CCTVCamera[] = [
  { id: 'CAM-001', warehouseId: 'WH-001', name: 'Pintu Utama', embedUrl: 'https://cctv.balitower.co.id/Bendungan-Hilir-003-700014_3/embed.html', isOnline: true, location: 'Eksterior Depan' },
  { id: 'CAM-002', warehouseId: 'WH-001', name: 'Area Loading Dock', embedUrl: '', isOnline: true, location: 'Sisi Barat' },
  { id: 'CAM-003', warehouseId: 'WH-001', name: 'Lorong Cold Storage', embedUrl: '', isOnline: true, location: 'Interior Blok A' },
  { id: 'CAM-004', warehouseId: 'WH-001', name: 'Gudang Kering', embedUrl: '', isOnline: false, location: 'Interior Blok C' },
];

export const attendances: Attendance[] = [
  { id: 'ATT-001', driverId: 'DRV-001', type: 'in', timestamp: '2026-04-28T06:30:00', location: { lat: -6.3065, lng: 107.2862 }, address: 'Gudang Karawang, Jl. Industri Raya', selfieUrl: '/selfies/drv001-in.jpg' },
];

export const driverDocuments: Document[] = [
  { id: 'DOC-001', driverId: 'DRV-001', type: 'SIM', name: 'SIM A - Agus Pratama', url: '/docs/sim-agus.pdf', uploadedAt: '2026-01-15', status: 'verified' },
];

// Helper to get related data
export function getWarehouse(id: string) { return warehouses.find(w => w.id === id); }
export function getDriver(id: string) { return drivers.find(d => d.id === id); }
export function getTruck(id: string) { return trucks.find(t => t.id === id); }
export function getItem(id: string) { return items.find(i => i.id === id); }
export function getDriverAssignment(driverId: string) { return assignments.find(a => a.driverId === driverId && a.status === 'in_progress'); }
export function getDriverDocuments(driverId: string) { return driverDocuments.filter(d => d.driverId === driverId); }

export function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}
export function formatTime(iso: string) {
  return new Date(iso).toLocaleString('id-ID', { hour: '2-digit', minute: '2-digit' });
}
