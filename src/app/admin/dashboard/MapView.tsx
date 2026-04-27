'use client';
import { useEffect, useRef } from 'react';
import L from 'leaflet';
import type { Driver, Warehouse } from '@/data/mock';

interface Props {
  drivers: Driver[];
  warehouses: Warehouse[];
  selectedDriver: string | null;
  onSelectDriver: (id: string) => void;
  routeWarehouses: Warehouse[];
}

export default function MapView({ drivers, warehouses, selectedDriver, onSelectDriver, routeWarehouses }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const routeLayerRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    const map = L.map(mapRef.current, {
      center: [-6.2, 106.9],
      zoom: 10,
      zoomControl: false,
    });

    L.control.zoom({ position: 'topright' }).addTo(map);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap',
      maxZoom: 18,
    }).addTo(map);

    routeLayerRef.current = L.layerGroup().addTo(map);
    mapInstance.current = map;

    return () => { map.remove(); mapInstance.current = null; };
  }, []);

  // Handle markers (warehouses + selected driver) and route polylines
  useEffect(() => {
    if (!mapInstance.current || !routeLayerRef.current) return;

    const layer = routeLayerRef.current;
    layer.clearLayers(); // Clear everything from previous renders

    // 1. Draw Warehouses
    warehouses.forEach(wh => {
      const icon = L.divIcon({
        className: '',
        html: `<div style="width:28px;height:28px;background:#1E3A5F;border-radius:6px;display:flex;align-items:center;justify-content:center;color:white;font-size:10px;font-weight:700;border:2px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.2);">${wh.code.slice(0,3)}</div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });
      L.marker([wh.coordinates.lat, wh.coordinates.lng], { icon })
        .addTo(layer)
        .bindPopup(`<div style="font-family:Inter,sans-serif"><strong>${wh.name}</strong><br/><small>${wh.city} — ${wh.address}</small></div>`);
    });

    // 2. Draw Selected Driver
    const d = drivers.find(dr => dr.id === selectedDriver);
    if (d) {
      const isTrip = d.status === 'on_trip';
      const color = isTrip ? '#059669' : d.status === 'active' ? '#3B82F6' : '#94A3B8';
      const icon = L.divIcon({
        className: '',
        html: `<div style="width:36px;height:36px;background:${color};border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-size:12px;font-weight:700;border:3px solid white;box-shadow:0 2px 12px rgba(0,0,0,0.25);cursor:pointer;z-index:1000;">${d.name.charAt(0)}</div>`,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      });
      L.marker([d.currentLocation.lat, d.currentLocation.lng], { icon })
        .addTo(layer)
        .bindPopup(`<div style="font-family:Inter,sans-serif"><strong>${d.name}</strong><br/><small>Status: ${isTrip ? 'Dalam Perjalanan' : d.status === 'active' ? 'Standby' : 'Offline'}</small>${d.assignedTruck ? `<br/><small>Truk: ${d.assignedTruck}</small>` : ''}</div>`);
    }

    // 3. Draw Route Polylines & Stops
    if (routeWarehouses.length >= 2) {
      const coords: L.LatLngExpression[] = routeWarehouses.map(wh => [wh.coordinates.lat, wh.coordinates.lng]);

      const polyline = L.polyline(coords, {
        color: '#059669',
        weight: 4,
        opacity: 0.8,
        dashArray: '8, 12',
        lineCap: 'round',
      });
      layer.addLayer(polyline);

      routeWarehouses.forEach((wh, i) => {
        const circleIcon = L.divIcon({
          className: '',
          html: `<div style="width:22px;height:22px;background:#059669;border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-size:11px;font-weight:700;border:2px solid white;box-shadow:0 1px 6px rgba(0,0,0,0.3);margin-top:-6px;">${i + 1}</div>`,
          iconSize: [22, 22],
          iconAnchor: [11, 11],
        });
        L.marker([wh.coordinates.lat, wh.coordinates.lng], { icon: circleIcon }).addTo(layer);
      });

      // Fit bounds to route
      const bounds = L.latLngBounds(coords);
      if (d) bounds.extend([d.currentLocation.lat, d.currentLocation.lng]);
      mapInstance.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 12, animate: true });
    } else if (d) {
      // Just fly to driver if no route
      mapInstance.current.flyTo([d.currentLocation.lat, d.currentLocation.lng], 12, { duration: 0.8 });
    }

  }, [drivers, warehouses, selectedDriver, routeWarehouses]);

  return <div ref={mapRef} style={{ width: '100%', height: '100%', minHeight: 400 }} />;
}
