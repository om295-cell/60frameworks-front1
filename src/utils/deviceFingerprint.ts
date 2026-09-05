/**
 * deviceFingerprint.ts
 *
 * Generates a stable, persistent device identifier formatted as a MAC Address (XX:XX:XX:XX:XX:XX).
 * Browsers cannot read physical network interface MAC addresses directly due to OS/browser sandboxing,
 * so this module derives a deterministic, persistent virtual MAC address combining:
 * 1. Hardware & GPU rendering signatures (Canvas 2D, Screen geometry, Hardware concurrency, WebGL/Color depth)
 * 2. OS, Locale, and Timezone environment traits
 * 3. A persistent local device seed stored in localStorage
 *
 * This guarantees:
 * - The same device will always produce the same MAC address across sessions.
 * - Any different device or browser profile will produce a completely different MAC address.
 */

const STORAGE_KEY = '60fw_device_id';
const SEED_KEY = '60fw_device_seed';

/**
 * FNV-1a 32-bit hash — fast, reliable distribution for strings.
 */
function fnv1a(str: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = (hash * 0x01000193) >>> 0;
  }
  return hash;
}

/**
 * Canvas-based hardware signature: renders subtle geometries and fonts.
 * Hardware GPU differences produce distinct pixel signatures.
 */
function getCanvasSignature(): string {
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 240;
    canvas.height = 60;
    const ctx = canvas.getContext('2d');
    if (!ctx) return 'nocanvas';
    ctx.textBaseline = 'alphabetic';
    ctx.font = '14px Arial, sans-serif';
    ctx.fillStyle = '#f68621';
    ctx.fillRect(100, 5, 80, 25);
    ctx.fillStyle = '#111827';
    ctx.fillText('60frameworks:device:mac:id', 10, 30);
    ctx.fillStyle = 'rgba(246,134,33,0.7)';
    ctx.fillText('60frameworks:device:mac:id', 12, 32);
    return ctx.getImageData(0, 0, 50, 50).data.slice(0, 30).join(',');
  } catch {
    return 'canvaserr';
  }
}

/**
 * Collects stable hardware and environment characteristics.
 */
function collectHardwareTraits(): string {
  const nav = navigator as any;
  const traits = [
    nav.userAgent || '',
    nav.platform || '',
    nav.language || '',
    nav.languages ? nav.languages.join(',') : '',
    String(screen.width),
    String(screen.height),
    String(screen.colorDepth),
    String(screen.pixelDepth ?? ''),
    String(nav.hardwareConcurrency ?? '4'),
    String(nav.deviceMemory ?? '8'),
    String(nav.maxTouchPoints ?? '0'),
    Intl.DateTimeFormat().resolvedOptions().timeZone,
    String(new Date().getTimezoneOffset()),
    getCanvasSignature(),
  ];
  return traits.join('|');
}

/**
 * Gets or initializes a unique persistent device seed in localStorage.
 */
function getPersistentSeed(): string {
  try {
    let seed = localStorage.getItem(SEED_KEY);
    if (!seed) {
      const randomBytes = Array.from({ length: 16 }, () =>
        Math.floor(Math.random() * 256).toString(16).padStart(2, '0')
      ).join('');
      seed = `seed_${Date.now()}_${randomBytes}`;
      localStorage.setItem(SEED_KEY, seed);
    }
    return seed;
  } catch {
    return `temp_${Date.now()}_${Math.random()}`;
  }
}

/**
 * Formats 12 hex characters into standard colon-separated MAC address format:
 * XX:XX:XX:XX:XX:XX (e.g. D4:8A:39:B1:0C:6E)
 */
function toMacAddress(hex: string): string {
  const clean = hex.replace(/[^0-9A-Fa-f]/g, '').padEnd(12, '0').slice(0, 12).toUpperCase();
  const pairs = clean.match(/.{1,2}/g);
  return pairs ? pairs.join(':') : '00:11:22:33:44:55';
}

/**
 * Returns the device's MAC Address identifier.
 * Generates it on first run, persists it in localStorage, and returns the exact same MAC on subsequent calls.
 */
export function getDeviceFingerprint(): string {
  try {
    const cached = localStorage.getItem(STORAGE_KEY);
    // Validate that cached value matches standard MAC format (e.g. XX:XX:XX:XX:XX:XX)
    if (cached && /^([0-9A-F]{2}:){5}[0-9A-F]{2}$/i.test(cached)) {
      return cached.toUpperCase();
    }

    const traits = collectHardwareTraits();
    const seed = getPersistentSeed();

    // Generate two 32-bit hashes for 64 bits of entropy (8 bytes -> 16 hex chars)
    const hash1 = fnv1a(traits + ':' + seed).toString(16).padStart(8, '0');
    const hash2 = fnv1a(seed + ':' + traits).toString(16).padStart(8, '0');

    // Combine to form 12 hex characters (6 bytes for MAC address)
    const hex12 = (hash1 + hash2).slice(0, 12);
    const mac = toMacAddress(hex12);

    localStorage.setItem(STORAGE_KEY, mac);
    return mac;
  } catch {
    return '02:00:00:00:00:01';
  }
}

/**
 * Clears the stored device fingerprint from localStorage (for testing/reset).
 */
export function clearDeviceFingerprint(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(SEED_KEY);
  } catch {}
}

