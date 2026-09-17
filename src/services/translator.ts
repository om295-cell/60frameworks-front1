import { adminApi } from '../admin/adminApi';

// In-memory cache to prevent redundant translations
const clientTranslationCache = new Map<string, string>();

const STORAGE_KEY_AUTO_TRANSLATE = '60fw_auto_translate_enabled';

/**
 * Check if Auto-Translate (AR -> EN) is globally enabled.
 * Defaults to true.
 */
export function isAutoTranslateEnabled(): boolean {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_AUTO_TRANSLATE);
    if (saved === null) return true; // Default ON
    return saved === 'true';
  } catch {
    return true;
  }
}

/**
 * Toggle or set Auto-Translate state
 */
export function setAutoTranslateEnabled(enabled: boolean): void {
  try {
    localStorage.setItem(STORAGE_KEY_AUTO_TRANSLATE, String(enabled));
    window.dispatchEvent(new CustomEvent('60fw_auto_translate_changed', { detail: { enabled } }));
  } catch (e) {
    console.warn('Failed to save auto-translate preference', e);
  }
}

/**
 * Translate a single text string from Arabic to English
 */
export async function translateText(text: string, from = 'ar', to = 'en'): Promise<string> {
  const trimmed = text?.trim();
  if (!trimmed) return '';

  const cacheKey = `${from}:${to}:${trimmed}`;
  if (clientTranslationCache.has(cacheKey)) {
    return clientTranslationCache.get(cacheKey)!;
  }

  // 1. Try Backend API endpoint
  try {
    const res = await adminApi.translateText(trimmed, from, to);
    if (res && res.result && typeof res.result === 'string') {
      clientTranslationCache.set(cacheKey, res.result);
      return res.result;
    }
  } catch {
    // Graceful fallback to direct browser fetch below
  }

  // 2. Direct browser fetch to Google Translate GTX endpoint (fallback)
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${from}&tl=${to}&dt=t&q=${encodeURIComponent(trimmed)}`;
    const response = await fetch(url);
    if (response.ok) {
      const data: any = await response.json();
      if (Array.isArray(data) && Array.isArray(data[0])) {
        const translated = data[0].map((item: any) => item[0]).filter(Boolean).join('');
        if (translated) {
          clientTranslationCache.set(cacheKey, translated);
          return translated;
        }
      }
    }
  } catch (err) {
    console.warn('[Translator] Direct translation fallback error:', err);
  }

  return trimmed;
}

/**
 * Translate an array of string items (e.g. bullet points, deliverables)
 */
export async function translateList(items: string[], from = 'ar', to = 'en'): Promise<string[]> {
  if (!Array.isArray(items) || items.length === 0) return [];
  return Promise.all(items.map(item => (item && typeof item === 'string' ? translateText(item, from, to) : Promise.resolve(''))));
}

/**
 * Map of Arabic field names to their corresponding English field names
 */
export const ARABIC_TO_ENGLISH_FIELD_MAP: Record<string, string> = {
  // Crud items
  name_ar: 'name',
  title_ar: 'title',
  description_ar: 'description',
  summary_ar: 'summary',
  tagline_ar: 'tagline',
  category_ar: 'category',
  client_ar: 'client',
  industry_ar: 'industry',
  buttonText_ar: 'buttonText',
  capabilitiesTitle_ar: 'capabilitiesTitle',
  capabilities_ar: 'capabilities',
  deliverables_ar: 'deliverables',
  tags_ar: 'tags',
  authorName_ar: 'authorName',
  authorRole_ar: 'authorRole',
  organization_ar: 'organization',
  quote_ar: 'quote',
  metricHighlight_ar: 'metricHighlight',
  badgeTitle_ar: 'badgeTitle',
  badgeDesc_ar: 'badgeDesc',

  // HomepageContent keys
  headlinePrefix_ar: 'headlinePrefix_en',
  headlineHighlight_ar: 'headlineHighlight_en',
  subtitle_ar: 'subtitle_en',
  eyebrow_ar: 'eyebrow_en',
  heading_ar: 'heading_en',
  para1_ar: 'para1_en',
  para2_ar: 'para2_en',
  badgeText_ar: 'badgeText_en',
  impactTitle_ar: 'impactTitle_en',
  impactSubtitle_ar: 'impactSubtitle_en',
  tag_ar: 'tag_en',
  capabilitiesHeading_ar: 'capabilitiesHeading_en',
  ctaText_ar: 'ctaText_en',
};

/**
 * Automatically translates all Arabic fields in an object and returns the updated object with English fields filled.
 */
export async function autoTranslateRecord(record: Record<string, any>): Promise<Record<string, any>> {
  const result = { ...record };

  for (const [arKey, enKey] of Object.entries(ARABIC_TO_ENGLISH_FIELD_MAP)) {
    const arVal = record[arKey];
    if (arVal !== undefined && arVal !== null && arVal !== '') {
      if (Array.isArray(arVal)) {
        result[enKey] = await translateList(arVal);
      } else if (typeof arVal === 'string' && arVal.trim().length > 0) {
        result[enKey] = await translateText(arVal);
      }
    }
  }

  // Also handle any key ending with _ar that maps to _en
  for (const key of Object.keys(record)) {
    if (key.endsWith('_ar')) {
      const enKey = key.replace(/_ar$/, '_en');
      if (result[enKey] === undefined || !result[enKey]) {
        const val = record[key];
        if (typeof val === 'string' && val.trim().length > 0) {
          result[enKey] = await translateText(val);
        }
      }
    }
  }

  return result;
}
