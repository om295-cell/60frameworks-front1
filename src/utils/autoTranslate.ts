/**
 * Auto-Translation Utility
 * Uses MyMemory free translation API (no API key needed, 1000 words/day free tier)
 * Arabic (ar) → English (en)
 */

const MYMEMORY_URL = 'https://api.mymemory.translated.net/get';

/**
 * Translates Arabic text to English using MyMemory free API.
 * Returns the translated string, or null if translation fails.
 */
export async function translateArToEn(text: string): Promise<string | null> {
  if (!text || text.trim() === '') return null;

  try {
    const url = `${MYMEMORY_URL}?q=${encodeURIComponent(text.trim())}&langpair=ar|en`;
    const response = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!response.ok) return null;

    const data = await response.json();
    if (
      data?.responseStatus === 200 &&
      data?.responseData?.translatedText &&
      data.responseData.translatedText.trim() !== ''
    ) {
      return data.responseData.translatedText.trim();
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Translates an array of Arabic strings to English.
 * Returns array of translated strings (keeps originals on failure).
 */
export async function translateArArrayToEn(items: string[]): Promise<string[]> {
  if (!items || items.length === 0) return [];
  // Join with delimiter to reduce API calls, then split
  const combined = items.join(' ||| ');
  const translated = await translateArToEn(combined);
  if (!translated) return items;
  const parts = translated.split('|||').map((s) => s.trim()).filter(Boolean);
  // If count matches, return translated; otherwise return what we can
  if (parts.length === items.length) return parts;
  // Fallback: translate individually
  const results: string[] = [];
  for (const item of items) {
    const t = await translateArToEn(item);
    results.push(t || item);
  }
  return results;
}

/**
 * Returns the corresponding English field key for an Arabic field key.
 * Returns null if no mapping exists.
 */
export function getEnglishKey(arabicKey: string): string | null {
  // Remove _ar suffix to get English key
  if (arabicKey.endsWith('_ar')) {
    return arabicKey.slice(0, -3);
  }
  // Handle _en suffix patterns for homepage content
  if (arabicKey.endsWith('_ar')) {
    return arabicKey.replace(/_ar$/, '_en');
  }
  return null;
}

/**
 * Returns the corresponding English field key for homepage-style fields (e.g. heading_ar → heading_en)
 */
export function getEnglishKeyHomepage(arabicKey: string): string | null {
  if (arabicKey.endsWith('_ar')) {
    return arabicKey.slice(0, -3) + '_en';
  }
  return null;
}

/** localStorage key for auto-translate preference */
export const AUTO_TRANSLATE_KEY = '60fw_auto_translate_enabled';

export function getAutoTranslateEnabled(): boolean {
  try {
    const v = localStorage.getItem(AUTO_TRANSLATE_KEY);
    if (v === null) return true; // Default: ON
    return v === 'true';
  } catch {
    return true;
  }
}

export function setAutoTranslateEnabled(val: boolean): void {
  try {
    localStorage.setItem(AUTO_TRANSLATE_KEY, val ? 'true' : 'false');
  } catch {}
}
