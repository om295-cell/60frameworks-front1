/**
 * cookieManager.ts
 *
 * Manages browser cookies and stale client state based on device MAC address.
 *
 * Requirement:
 * "somtimes cookies cause problems and so on I want website to reset cookies
 * if same device mac address loads my website after 3 days"
 *
 * Logic:
 * 1. Identifies the client device using its persistent MAC address fingerprint (getDeviceFingerprint()).
 * 2. Checks timestamp of when this specific device MAC last loaded the site / last reset cookies.
 * 3. If >= 3 days (259,200,000 ms) have elapsed since last visit or last reset:
 *    - Automatically purges all document cookies across root/subdomain variations.
 *    - Clears sessionStorage.
 *    - Clears stale homepage/service cache from localStorage while preserving device identity (MAC address)
 *      and language preference.
 *    - Updates the last-reset and last-seen timestamps to now.
 */

import { getDeviceFingerprint } from './deviceFingerprint';

export const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000; // 259,200,000 ms (72 hours)

/**
 * Robustly clears all cookies on document.cookie across current hostname,
 * subdomains, root domain, and standard paths.
 */
export function clearAllCookies(): void {
  try {
    const rawCookies = typeof document !== 'undefined' ? document.cookie : '';
    if (!rawCookies) return;

    const cookiePairs = rawCookies.split(';');
    const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
    const hostParts = hostname ? hostname.split('.') : [];

    // Generate possible domain variations
    const domainVariations: string[] = ['', hostname];
    if (hostParts.length > 1) {
      domainVariations.push(`.${hostname}`);
      if (hostParts.length > 2) {
        domainVariations.push(`.${hostParts.slice(-2).join('.')}`);
      }
    }

    // Possible paths
    const pathVariations = ['/', typeof window !== 'undefined' ? window.location.pathname : '', ''];

    for (const pair of cookiePairs) {
      const eqIdx = pair.indexOf('=');
      const name = (eqIdx > -1 ? pair.slice(0, eqIdx) : pair).trim();
      if (!name) continue;

      for (const domain of domainVariations) {
        for (const path of pathVariations) {
          let cookieStr = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; Max-Age=0;`;
          if (path) cookieStr += ` path=${path};`;
          if (domain) cookieStr += ` domain=${domain};`;
          try {
            document.cookie = cookieStr;
          } catch {}
        }
      }
    }
  } catch (e) {
    console.warn('[60Frameworks] Failed to clear all cookies:', e);
  }
}

/**
 * Clears stale client caches that often cause visual or functional glitches,
 * while strictly safeguarding the device identity and core user preferences.
 */
export function clearStaleCache(): void {
  try {
    if (typeof sessionStorage !== 'undefined') {
      try {
        sessionStorage.clear();
      } catch {}
    }

    if (typeof localStorage !== 'undefined') {
      // Keys that MUST NEVER be deleted (device identity & persistent settings)
      const PRESERVED_EXACT_KEYS = new Set([
        '60fw_device_id',     // Device MAC address
        '60fw_device_seed',   // Device hardware seed
        'agency_lang',        // Selected language (ar / en)
        '60fw_users',         // Local fallback offline users
      ]);

      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key) continue;

        // Keep device timestamp tracking keys
        if (key.startsWith('60fw_device_last_')) continue;
        if (PRESERVED_EXACT_KEYS.has(key)) continue;

        // Remove stale agency data cache
        if (
          key.startsWith('60fw_') ||
          key.startsWith('cached_') ||
          key.includes('content') ||
          key.includes('session')
        ) {
          keysToRemove.push(key);
        }
      }

      for (const k of keysToRemove) {
        try {
          localStorage.removeItem(k);
        } catch {}
      }
    }

    // Clear CacheStorage (Service Worker / browser HTTP response cache) if available
    if (typeof window !== 'undefined' && 'caches' in window) {
      caches.keys().then((names) => {
        for (const name of names) {
          caches.delete(name).catch(() => {});
        }
      }).catch(() => {});
    }
  } catch (e) {
    console.warn('[60Frameworks] Failed to clear stale cache:', e);
  }
}

export interface ResetCheckResult {
  resetPerformed: boolean;
  deviceMac: string;
  reason?: string;
  daysElapsed?: number;
}

/**
 * Checks if the current device (identified by MAC address) has loaded the website
 * after 3 days or more. If so, triggers a full cookie and stale-cache reset.
 */
export function checkAndResetCookiesForDevice(): ResetCheckResult {
  try {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return { resetPerformed: false, deviceMac: 'N/A' };
    }

    const mac = getDeviceFingerprint();
    const cleanMac = mac.replace(/[^A-Za-z0-9]/g, '');
    const LAST_SEEN_KEY = `60fw_device_last_seen_${cleanMac}`;
    const LAST_RESET_KEY = `60fw_device_last_reset_${cleanMac}`;

    const now = Date.now();
    const lastSeenStr = localStorage.getItem(LAST_SEEN_KEY);
    const lastResetStr = localStorage.getItem(LAST_RESET_KEY);

    const lastSeen = lastSeenStr ? parseInt(lastSeenStr, 10) : null;
    const lastReset = lastResetStr ? parseInt(lastResetStr, 10) : null;

    let shouldReset = false;
    let reason = '';
    let daysElapsed = 0;

    // Condition 1: Device loaded website after >= 3 days of absence
    if (lastSeen && !isNaN(lastSeen)) {
      const elapsedSinceLastSeen = now - lastSeen;
      if (elapsedSinceLastSeen >= THREE_DAYS_MS) {
        shouldReset = true;
        daysElapsed = elapsedSinceLastSeen / (1000 * 60 * 60 * 24);
        reason = `Device ${mac} loaded website after ${daysElapsed.toFixed(2)} days since last visit`;
      }
    }

    // Condition 2: Continuous usage reached >= 3 days since last cookie reset
    if (!shouldReset && lastReset && !isNaN(lastReset)) {
      const elapsedSinceLastReset = now - lastReset;
      if (elapsedSinceLastReset >= THREE_DAYS_MS) {
        shouldReset = true;
        daysElapsed = elapsedSinceLastReset / (1000 * 60 * 60 * 24);
        reason = `3 days (${daysElapsed.toFixed(2)} days) elapsed since last cookie reset for device ${mac}`;
      }
    }

    if (shouldReset) {
      console.info(
        `%c[60Frameworks] 🔄 Resetting cookies for device [${mac}]: ${reason}`,
        'background: #f68621; color: #fff; font-weight: bold; padding: 2px 6px; border-radius: 3px;'
      );

      clearAllCookies();
      clearStaleCache();

      localStorage.setItem(LAST_RESET_KEY, String(now));
      localStorage.setItem(LAST_SEEN_KEY, String(now));

      return {
        resetPerformed: true,
        deviceMac: mac,
        reason,
        daysElapsed,
      };
    }

    // Initial visit registration
    if (!lastResetStr) {
      localStorage.setItem(LAST_RESET_KEY, String(now));
    }
    localStorage.setItem(LAST_SEEN_KEY, String(now));

    return {
      resetPerformed: false,
      deviceMac: mac,
    };
  } catch (err) {
    console.warn('[60Frameworks] Error during device cookie check:', err);
    return {
      resetPerformed: false,
      deviceMac: '00:00:00:00:00:00',
    };
  }
}

// Attach debugging & manual testing helpers to window for easy verification in DevTools
if (typeof window !== 'undefined') {
  (window as any).__60fwDeviceCookieManager = {
    getDeviceMac: getDeviceFingerprint,
    clearAllCookies,
    clearStaleCache,
    checkAndReset: checkAndResetCookiesForDevice,
    simulate3DaysElapsed: () => {
      const mac = getDeviceFingerprint();
      const cleanMac = mac.replace(/[^A-Za-z0-9]/g, '');
      const pastTime = Date.now() - (THREE_DAYS_MS + 60000); // 3 days and 1 minute ago
      localStorage.setItem(`60fw_device_last_seen_${cleanMac}`, String(pastTime));
      localStorage.setItem(`60fw_device_last_reset_${cleanMac}`, String(pastTime));
      console.log(
        `%c[60Frameworks] Simulated 3 days elapsed for device [${mac}]. Call __60fwDeviceCookieManager.checkAndReset() or refresh page to test.`,
        'color: #f68621; font-weight: bold;'
      );
    },
  };
}
