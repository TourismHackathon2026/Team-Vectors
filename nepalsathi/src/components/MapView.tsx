import { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Link } from 'react-router-dom';
import { ExternalLink, Navigation } from 'lucide-react';
import { Button } from './ui/Button';
import { AuthenticityBadge } from './ui/AuthenticityBadge';
import type { Place, PlaceCategory } from '../types';

const categoryColors: Record<string, string> = {
  Food: '#C68A2B',
  Heritage: '#14532D',
  Crafts: '#B45309',
  Nature: '#16a34a',
  Culture: '#ca8a04',
  Coffee: '#6B7280',
  Shopping: '#ea580c',
  'Hidden Gems': '#6366f1',
};

function createMarkerIcon(category: PlaceCategory, isSelected: boolean) {
  const color = categoryColors[category] || '#14532D';
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        width: ${isSelected ? '18px' : '14px'};
        height: ${isSelected ? '18px' : '14px'};
        background: ${color};
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        transition: all 0.2s;
        ${isSelected ? 'transform: scale(1.2);' : ''}
      "></div>
    `,
    iconSize: [isSelected ? 24 : 20, isSelected ? 24 : 20],
    iconAnchor: [isSelected ? 12 : 10, isSelected ? 12 : 10],
  });
}

function FlyToPlace({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo([lat, lng], 14, { duration: 0.6 });
  }, [lat, lng, map]);
  return null;
}

interface MapViewProps {
  places: Place[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  heatmapEnabled: boolean;
  routeCoordinates?: [number, number][];
}

export function MapView({ places, selectedId, onSelect, heatmapEnabled, routeCoordinates }: MapViewProps) {
  const center: [number, number] = [27.7172, 85.3240];

  const markers = useMemo(() => {
    if (heatmapEnabled) {
      return places.map((place) => (
        <Circle
          key={place.id}
          center={[place.location.lat, place.location.lng]}
          radius={80}
          pathOptions={{
            color: place.authenticityScore >= 90 ? '#16a34a' : place.authenticityScore >= 75 ? '#ca8a04' : '#dc2626',
            fillOpacity: 0.4,
            weight: 1,
          }}
        />
      ));
    }

    return places.map((place) => (
      <Marker
        key={place.id}
        position={[place.location.lat, place.location.lng]}
        icon={createMarkerIcon(place.category, place.id === selectedId)}
        eventHandlers={{ click: () => onSelect(place.id) }}
      >
        <Popup>
          <div className="p-0 min-w-[220px]">
            <div className="h-28 bg-gradient-to-br from-primary-900 to-primary-700 flex items-center justify-center">
              <span className="text-white/40 text-xs">{place.name}</span>
            </div>
            <div className="p-3 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-900">{place.name}</h3>
                <AuthenticityBadge score={place.authenticityScore} size="sm" />
              </div>
              <p className="text-xs text-gray-500 line-clamp-2">{place.shortDescription}</p>
              <div className="flex items-center gap-2 pt-1">
                <Link to={`/heritage/${place.id}`}>
                  <Button size="sm" variant="outline" className="gap-1 text-xs h-7 px-2">
                    <ExternalLink className="w-3 h-3" />
                    Details
                  </Button>
                </Link>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${place.location.lat},${place.location.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button size="sm" variant="ghost" className="gap-1 text-xs h-7 px-2">
                    <Navigation className="w-3 h-3" />
                    Navigate
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </Popup>
      </Marker>
    ));
  }, [places, selectedId, onSelect, heatmapEnabled]);

  const selectedPlace = selectedId ? places.find((p) => p.id === selectedId) : null;

  return (
    <MapContainer center={center} zoom={12} className="h-full w-full rounded-xl" zoomControl={false}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {selectedPlace && <FlyToPlace lat={selectedPlace.location.lat} lng={selectedPlace.location.lng} />}
      {markers}
      {routeCoordinates && routeCoordinates.length > 1 && (
        <Polyline
          positions={routeCoordinates}
          pathOptions={{ color: '#14532D', weight: 3, opacity: 0.7, dashArray: '10 6' }}
        />
      )}
    </MapContainer>
  );
}