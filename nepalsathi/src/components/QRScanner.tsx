import { useEffect, useRef, useState, useCallback } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { motion, AnimatePresence } from 'framer-motion';
import { Scan, X, Camera, CameraOff } from 'lucide-react';
import { Button } from './ui/Button';
import { heritageSites } from '../data/heritage';
import { places } from '../data/places';

const QR_SCANNER_ID = 'qr-scanner-element';
const ALL_SITES = [...heritageSites, ...places];

interface QRScannerProps {
  open: boolean;
  onClose: () => void;
  onScan: (siteId: string, siteName: string) => void;
}

export function QRScanner({ open, onClose, onScan }: QRScannerProps) {
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState('');
  const [cameras, setCameras] = useState<{ id: string; label: string }[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<string>('');
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  const stopScanning = useCallback(async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
      } catch { }
      scannerRef.current = null;
    }
    setScanning(false);
  }, []);

  useEffect(() => {
    if (!open) {
      stopScanning();
      setError('');
      return;
    }
    Html5Qrcode.getCameras().then((devices) => {
      if (!mountedRef.current) return;
      if (devices.length === 0) {
        setError('No camera found');
        return;
      }
      const cams = devices.map((d) => ({ id: d.id, label: d.label || `Camera ${devices.indexOf(d) + 1}` }));
      setCameras(cams);
      const backCam = cams.find((c) => c.label.toLowerCase().includes('back') || c.label.toLowerCase().includes('environment'));
      setSelectedCamera(backCam?.id || cams[0].id);
    }).catch(() => {
      if (mountedRef.current) setError('Camera access denied');
    });
  }, [open, stopScanning]);

  const startScanning = useCallback(async () => {
    if (!selectedCamera) return;
    setError('');
    try {
      const scanner = new Html5Qrcode(QR_SCANNER_ID);
      scannerRef.current = scanner;
      await scanner.start(
        { deviceId: { exact: selectedCamera } },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          const match = ALL_SITES.find(
            (s) => s.id === decodedText || s.name.toLowerCase() === decodedText.toLowerCase()
          );
          if (match) {
            scanner.stop().catch(() => { });
            scannerRef.current = null;
            setScanning(false);
            onScan(match.id, match.name);
            onClose();
          } else {
            setError('QR code does not match any heritage site or place');
          }
        },
        () => { },
      );
      setScanning(true);
    } catch (e: any) {
      setError(e?.message || 'Failed to start camera');
    }
  }, [selectedCamera, onScan, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative bg-card rounded-xl border border-border shadow-xl w-full max-w-md overflow-hidden"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <div className="flex items-center gap-2">
                <Scan className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold text-text-primary">Scan QR Code</h2>
              </div>
              <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100 transition-colors">
                <X className="w-5 h-5 text-text-secondary" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {cameras.length > 0 && !scanning && (
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-text-primary">Camera</label>
                  <select
                    value={selectedCamera}
                    onChange={(e) => setSelectedCamera(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-card text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                  >
                    {cameras.map((c) => (
                      <option key={c.id} value={c.id}>{c.label}</option>
                    ))}
                  </select>
                </div>
              )}

              <div id={QR_SCANNER_ID} className="w-full aspect-square rounded-lg overflow-hidden bg-gray-900" />

              {error && (
                <p className="text-sm text-red-500 text-center">{error}</p>
              )}

              <div className="flex gap-3">
                {scanning ? (
                  <Button variant="ghost" className="flex-1 gap-2" onClick={stopScanning}>
                    <CameraOff className="w-4 h-4" />
                    Stop Scanning
                  </Button>
                ) : (
                  <Button className="flex-1 gap-2" onClick={startScanning} disabled={!selectedCamera}>
                    <Camera className="w-4 h-4" />
                    Start Scanning
                  </Button>
                )}
                <Button variant="ghost" className="flex-1" onClick={onClose}>Cancel</Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
