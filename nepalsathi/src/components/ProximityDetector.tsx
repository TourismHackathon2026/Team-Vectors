import { useEffect, useRef, useState, useCallback } from 'react';
import { MapPin, Navigation } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../utils/helpers';
import { heritageSites } from '../data/heritage';
import { places } from '../data/places';
import { useData } from '../context/DataContext';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

const PROXIMITY_THRESHOLD = 150;
const ALL_SITES = [...heritageSites, ...places];

function haversineDistance(
  lat1: number, lng1: number,
  lat2: number, lng2: number,
): number {
  const R = 6371000;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function ProximityDetector() {
  const { passportStamps, addStamp, addActivity, unlockAchievement } = useData();
  const { addToast } = useToast();
  const { user, updateProfile } = useAuth();
  const [active, setActive] = useState(false);
  const [nearby, setNearby] = useState<string[]>([]);
  const watchIdRef = useRef<number | null>(null);
  const notifiedRef = useRef<Set<string>>(new Set());

  const checkProximity = useCallback((lat: number, lng: number) => {
    const found: string[] = [];
    ALL_SITES.forEach((site) => {
      const siteLat = 'coordinates' in site ? site.coordinates.lat : site.location.lat;
      const siteLng = 'coordinates' in site ? site.coordinates.lng : site.location.lng;
      const dist = haversineDistance(lat, lng, siteLat, siteLng);
      if (dist <= PROXIMITY_THRESHOLD) {
        found.push(site.id);
        if (!notifiedRef.current.has(site.id) && !passportStamps.some((s) => s.siteId === site.id)) {
          notifiedRef.current.add(site.id);
          addStamp(site.id, site.name);
          if (user) {
            updateProfile({ xp: (user.xp || 0) + 50 });
          }
          addActivity('stamp', `Auto-collected stamp at ${site.name} via GPS`);
          addToast('success', `📍 Arrived at ${site.name}! Stamp auto-collected! +50 XP`);
          if (passportStamps.length + 1 >= 10) {
            unlockAchievement('ach-stamps');
          }
        }
      }
    });
    setNearby(found);
  }, [passportStamps, addStamp, addActivity, unlockAchievement, addToast, user, updateProfile]);

  const startTracking = useCallback(() => {
    if (!navigator.geolocation) {
      addToast('error', 'Geolocation is not supported by your browser');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => checkProximity(pos.coords.latitude, pos.coords.longitude),
      () => addToast('error', 'Unable to get location. Check permissions.'),
      { enableHighAccuracy: true, timeout: 10000 },
    );
    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => checkProximity(pos.coords.latitude, pos.coords.longitude),
      () => { },
      { enableHighAccuracy: true, maximumAge: 30000 },
    );
    setActive(true);
  }, [checkProximity, addToast]);

  const stopTracking = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setActive(false);
  }, []);

  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  return (
    <div className="fixed bottom-20 right-4 z-40">
      <button
        onClick={active ? stopTracking : startTracking}
        className={cn(
          'flex items-center gap-2 px-3 py-2 rounded-full shadow-lg border transition-all text-sm',
          active
            ? 'bg-green-600 text-white border-green-700 animate-pulse'
            : 'bg-card text-text-secondary border-border hover:bg-gray-50',
        )}
        title={active ? 'GPS tracking active' : 'Enable GPS proximity detection'}
      >
        <Navigation className={`w-4 h-4 ${active ? 'animate-spin' : ''}`} />
        {active ? 'GPS Active' : 'GPS'}
        {nearby.length > 0 && (
          <span className="w-2 h-2 rounded-full bg-green-400 animate-ping" />
        )}
      </button>
      <AnimatePresence>
        {nearby.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="absolute bottom-full right-0 mb-2 w-64 p-3 rounded-lg bg-card border border-border shadow-lg"
          >
            <p className="text-xs font-medium text-text-primary mb-1">Nearby Sites</p>
            {nearby.map((id) => {
              const site = ALL_SITES.find((s) => s.id === id);
              return (
                <p key={id} className="text-xs text-text-secondary flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-primary" />
                  {site?.name || id}
                </p>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
