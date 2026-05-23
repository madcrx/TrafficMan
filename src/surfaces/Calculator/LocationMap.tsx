import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// SVG divIcon avoids the Leaflet default-icon asset resolution issue in bundled apps
const PIN_ICON = L.divIcon({
  html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="24" height="36">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 7.5 12 24 12 24s12-16.5 12-24C24 5.37 18.63 0 12 0z"
      fill="#FF6A00" stroke="#D95400" stroke-width="0.5"/>
    <circle cx="12" cy="12" r="5" fill="white"/>
  </svg>`,
  className: '',
  iconSize: [24, 36],
  iconAnchor: [12, 36],
  popupAnchor: [0, -36],
});

// Inner component — updates map view when lat/lng prop changes (MapContainer center is init-only)
function MapUpdater({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], map.getZoom() >= 14 ? map.getZoom() : 15);
  }, [lat, lng, map]);
  return null;
}

export interface MapPosition { lat: number; lng: number }

interface Props {
  lat: number;
  lng: number;
  onDragEnd?: (pos: MapPosition) => void;
}

export function LocationMap({ lat, lng, onDragEnd }: Props) {
  return (
    <div style={{ border: '1.5px solid var(--border-default)', borderRadius: 10, overflow: 'hidden' }}>
      <MapContainer
        center={[lat, lng]}
        zoom={15}
        scrollWheelZoom
        style={{ height: 220, width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors'
          maxZoom={19}
        />
        <MapUpdater lat={lat} lng={lng} />
        <Marker
          position={[lat, lng]}
          icon={PIN_ICON}
          draggable={!!onDragEnd}
          eventHandlers={onDragEnd ? {
            dragend: (e) => {
              const pos = (e.target as L.Marker).getLatLng();
              onDragEnd({ lat: pos.lat, lng: pos.lng });
            },
          } : {}}
        />
      </MapContainer>
    </div>
  );
}
