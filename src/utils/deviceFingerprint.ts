/**
 * deviceFingerprint.ts
 *
 * Generates a stable, persistent browser-based device fingerprint.
 * Browsers cannot expose hardware MAC addresses due to OS security restrictions,
 * so we derive a unique ID from a combination of hardware & browser traits.
 *
 * The fingerprint is cached in localStorage so it survives page refreshes
 * and remains consistent across sessions on the same browser/device.
 */

const STORAGE_KEY = '60fw_device_id';

/**
 * FNV-1a 32-bit hash — fast, simple, good distribution for short strings.
 */
function fnv1a(str: string): string {
  let hash = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = (hash * 0x01000193) >>> 0; // keep as unsigned 32-bit
  }
  return hash.toString(16).padStart(8, '0');
}

/**
 * Collects stable, non-privacy-sensitive browser characteristics.
 * These traits are consistent within the same browser + OS + hardware combo.
 */
function collectTraits(): string {
  const nav = navigator as any;
  const traits = [
    nav.userAgent || '',
    nav.language || '',
    nav.languages ? nav.languages.join(',') : '',
    String(screen.width),
    String(screen.height),
    String(screen.colorDepth),
    String(screen.pixelDepth ?? ''),
    String(nav.hardwareConcurrency ?? ''),
    String(nav.deviceMemory ?? ''),
    String(nav.maxTouchPoints ?? ''),
    Intl.DateTimeFormat().resolvedOptions().timeZone,
    Intl.DateTimeFormat().resolvedOptions().locale,
    String(new Date().getTimezoneOffset()),
    nav.platform || '',
    // Canvas fingerprint — subtle differences in GPU text rendering
    getCanvasFingerprint(),
  ];
  return traits.join('|');
}

/**
 * Canvas-based fingerprint: renders text and extracts pixel data.
 * Tiny differences in GPU/font rendering produce a unique signature.
 */
function getCanvasFingerprint(): string {
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height = 50;
    const ctx = canvas.getContext('2d');
    if (!ctx) return 'no-canvas';
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillStyle = '#f60';
    ctx.fillRect(125, 1, 62, 20);
    ctx.fillStyle = '#069';
    ctx.fillText('60fw-device-check', 2, 15);
    ctx.fillStyle = 'rgba(102,204,0,0.7)';
    ctx.fillText('60fw-device-check', 4, 17);
    return fnv1a(canvas.toDataURL());
  } catch {
    return 'canvas-err';
  }
}

/**
 * Returns the device fingerprint. On first call, generates and persists it.
 * On subsequent calls within the same browser, returns the cached ID.
 */
export function getDeviceFingerprint(): string {
  try {
    // Return cached fingerprint if already generated
    const cached = localStorage.getItem(STORAGE_KEY);
    if (cached && cached.length >= 8) return cached;

    // Generate new fingerprint
    const raw = collectTraits();
    // Use multiple hash segments for a longer, more unique ID
    const seg1 = fnv1a(raw);
    const seg2 = fnv1a(raw.split('').reverse().join(''));
    const seg3 = fnv1a(raw.slice(0, Math.floor(raw.length / 2)));
    const seg4 = fnv1a(raw.slice(Math.floor(raw.length / 2)));
    const fingerprint = `${seg1}-${seg2}-${seg3}-${seg4}`;

    localStorage.setItem(STORAGE_KEY, fingerprint);
    return fingerprint;
  } catch {
    // Fallback: generate a random ID if localStorage is unavailable
    return `fallback-${Math.random().toString(36).slice(2)}`;
  }
}

/**
 * Clears the stored device fingerprint from localStorage.
 * Used only for testing purposes.
 */
export function clearDeviceFingerprint(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {}
}
