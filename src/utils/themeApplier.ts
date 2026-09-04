export interface ThemeHeader {
  backgroundColor: string;
  textColor: string;
  linkColor: string;
  linkHoverColor: string;
  borderColor: string;
  scrolledBackgroundColor: string;
  blurEffect?: boolean;
}

export interface ThemeFooter {
  backgroundColor: string;
  textColor: string;
  headingColor: string;
  linkColor: string;
  accentColor: string;
  borderColor: string;
}

export interface ThemeGlobal {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  fontFamily?: string;
}

export interface SectionTheme {
  backgroundColor: string;
  textColor: string;
  subtitleColor?: string;
  accentColor: string;
  cardBackgroundColor?: string;
  cardTextColor?: string;
}

export interface ThemeSections {
  hero: SectionTheme;
  about: SectionTheme;
  services: SectionTheme;
  clients: SectionTheme;
  sectors: SectionTheme;
  caseStudies: SectionTheme;
  whyUs: SectionTheme;
  testimonials: SectionTheme;
  finalCta: SectionTheme;
  [key: string]: SectionTheme;
}

export interface SiteTheme {
  header: ThemeHeader;
  footer: ThemeFooter;
  global: ThemeGlobal;
  sections: ThemeSections;
}

export const DEFAULT_THEME: SiteTheme = {
  header: {
    backgroundColor: '#FFFFFF',
    scrolledBackgroundColor: '#FFFFFF',
    textColor: '#242424',
    linkColor: '#242424',
    linkHoverColor: '#F68621',
    borderColor: '#E6E7E8',
  },
  footer: {
    backgroundColor: '#242424',
    textColor: '#B0B0B0',
    headingColor: '#FFFFFF',
    linkColor: '#B0B0B0',
    accentColor: '#F68621',
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  global: {
    primaryColor: '#F68621',
    secondaryColor: '#FFD400',
    backgroundColor: '#FFFFFF',
    textColor: '#242424',
  },
  sections: {
    hero: {
      backgroundColor: '#242424',
      textColor: '#FFFFFF',
      subtitleColor: '#D1D5DB',
      accentColor: '#F68621',
      cardBackgroundColor: '#2E2E2E',
      cardTextColor: '#FFFFFF',
    },
    about: {
      backgroundColor: '#FFFFFF',
      textColor: '#242424',
      subtitleColor: '#4A4A4A',
      accentColor: '#F68621',
      cardBackgroundColor: '#E6E7E8',
      cardTextColor: '#242424',
    },
    services: {
      backgroundColor: '#E6E7E8',
      textColor: '#242424',
      subtitleColor: '#4A4A4A',
      accentColor: '#F68621',
      cardBackgroundColor: '#FFFFFF',
      cardTextColor: '#242424',
    },
    clients: {
      backgroundColor: '#FFFFFF',
      textColor: '#242424',
      subtitleColor: '#4A4A4A',
      accentColor: '#F68621',
      cardBackgroundColor: '#F8F9FA',
      cardTextColor: '#242424',
    },
    sectors: {
      backgroundColor: '#F4D3C9',
      textColor: '#242424',
      subtitleColor: '#3A3A3A',
      accentColor: '#F68621',
      cardBackgroundColor: '#FFFFFF',
      cardTextColor: '#242424',
    },
    caseStudies: {
      backgroundColor: '#242424',
      textColor: '#FFFFFF',
      subtitleColor: '#D1D5DB',
      accentColor: '#F68621',
      cardBackgroundColor: '#2E2E2E',
      cardTextColor: '#FFFFFF',
    },
    whyUs: {
      backgroundColor: '#FFFFFF',
      textColor: '#242424',
      subtitleColor: '#4A4A4A',
      accentColor: '#F68621',
      cardBackgroundColor: '#F8F9FA',
      cardTextColor: '#242424',
    },
    testimonials: {
      backgroundColor: '#F4D3C9',
      textColor: '#242424',
      subtitleColor: '#3A3A3A',
      accentColor: '#F68621',
      cardBackgroundColor: '#FFFFFF',
      cardTextColor: '#242424',
    },
    finalCta: {
      backgroundColor: '#F68621',
      textColor: '#FFFFFF',
      subtitleColor: '#FFF3E0',
      accentColor: '#FFFFFF',
      cardBackgroundColor: 'rgba(255, 255, 255, 0.15)',
      cardTextColor: '#FFFFFF',
    },
  },
};

/**
 * Check if a color is perceptually dark (useful for automatic contrast calculation)
 */
export function isDarkColor(color: string): boolean {
  if (!color) return false;
  if (color.startsWith('#')) {
    const hex = color.substring(1);
    const fullHex = hex.length === 3 ? hex.split('').map(x => x + x).join('') : hex;
    const rgb = parseInt(fullHex, 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = (rgb >> 0) & 0xff;
    const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    return luma < 140;
  }
  if (color.includes('rgba') || color.includes('rgb')) {
    const match = color.match(/\d+/g);
    if (match && match.length >= 3) {
      const [r, g, b] = match.map(Number);
      const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      return luma < 140;
    }
  }
  return false;
}

/**
 * Apply the theme configuration directly to CSS custom properties on document.documentElement
 */
export function applyTheme(theme: Partial<SiteTheme> | null | undefined): void {
  if (typeof document === 'undefined') return;

  const t: SiteTheme = {
    header: { ...DEFAULT_THEME.header, ...(theme?.header || {}) },
    footer: { ...DEFAULT_THEME.footer, ...(theme?.footer || {}) },
    global: { ...DEFAULT_THEME.global, ...(theme?.global || {}) },
    sections: {
      hero: { ...DEFAULT_THEME.sections.hero, ...(theme?.sections?.hero || {}) },
      about: { ...DEFAULT_THEME.sections.about, ...(theme?.sections?.about || {}) },
      services: { ...DEFAULT_THEME.sections.services, ...(theme?.sections?.services || {}) },
      clients: { ...DEFAULT_THEME.sections.clients, ...(theme?.sections?.clients || {}) },
      sectors: { ...DEFAULT_THEME.sections.sectors, ...(theme?.sections?.sectors || {}) },
      caseStudies: { ...DEFAULT_THEME.sections.caseStudies, ...(theme?.sections?.caseStudies || {}) },
      whyUs: { ...DEFAULT_THEME.sections.whyUs, ...(theme?.sections?.whyUs || {}) },
      testimonials: { ...DEFAULT_THEME.sections.testimonials, ...(theme?.sections?.testimonials || {}) },
      finalCta: { ...DEFAULT_THEME.sections.finalCta, ...(theme?.sections?.finalCta || {}) },
    },
  };

  const root = document.documentElement;

  // 1. Global Brand Variables
  if (t.global.primaryColor) {
    root.style.setProperty('--color-orange-primary', t.global.primaryColor);
    root.style.setProperty('--color-orange-hover', adjustColorBrightness(t.global.primaryColor, -15));
  }
  if (t.global.secondaryColor) {
    root.style.setProperty('--color-yellow-energy', t.global.secondaryColor);
  }
  if (t.global.backgroundColor) {
    root.style.setProperty('--color-global-bg', t.global.backgroundColor);
  }
  if (t.global.textColor) {
    root.style.setProperty('--color-charcoal-dark', t.global.textColor);
  }

  // 2. Header Variables
  root.style.setProperty('--color-header-bg', t.header.backgroundColor || '#FFFFFF');
  root.style.setProperty('--color-header-scrolled-bg', t.header.scrolledBackgroundColor || '#FFFFFF');
  root.style.setProperty('--color-header-text', t.header.textColor || '#242424');
  root.style.setProperty('--color-header-link', t.header.linkColor || '#242424');
  root.style.setProperty('--color-header-link-hover', t.header.linkHoverColor || t.global.primaryColor || '#F68621');
  root.style.setProperty('--color-header-border', t.header.borderColor || '#E6E7E8');

  // 3. Footer Variables
  root.style.setProperty('--color-footer-bg', t.footer.backgroundColor || '#242424');
  root.style.setProperty('--color-footer-text', t.footer.textColor || '#B0B0B0');
  root.style.setProperty('--color-footer-heading', t.footer.headingColor || '#FFFFFF');
  root.style.setProperty('--color-footer-link', t.footer.linkColor || '#B0B0B0');
  root.style.setProperty('--color-footer-accent', t.footer.accentColor || t.global.primaryColor || '#F68621');
  root.style.setProperty('--color-footer-border', t.footer.borderColor || 'rgba(255, 255, 255, 0.08)');

  // 4. Section by Section Variables (with intelligent contrast guards)
  const sectionKeys = ['hero', 'about', 'services', 'clients', 'sectors', 'caseStudies', 'whyUs', 'testimonials', 'finalCta'] as const;

  for (const secKey of sectionKeys) {
    const sec = t.sections[secKey];
    if (sec) {
      const isSecDark = isDarkColor(sec.backgroundColor);

      // Section Background & Headings
      root.style.setProperty(`--color-sec-${secKey}-bg`, sec.backgroundColor);
      root.style.setProperty(`--color-sec-${secKey}-text`, sec.textColor);

      // Subtitle / Paragraph Text (fallback to readable contrasting shade if not specified)
      const fallbackSubtitle = isSecDark ? '#D1D5DB' : '#4B5563';
      root.style.setProperty(`--color-sec-${secKey}-subtitle`, sec.subtitleColor || fallbackSubtitle);

      // Accent / Eyebrow / Badges
      root.style.setProperty(`--color-sec-${secKey}-accent`, sec.accentColor || t.global.primaryColor || '#F68621');

      // Cards inside this section
      const fallbackCardBg = isSecDark ? '#2E2E2E' : '#FFFFFF';
      const fallbackCardText = isDarkColor(sec.cardBackgroundColor || fallbackCardBg) ? '#FFFFFF' : '#242424';
      root.style.setProperty(`--color-sec-${secKey}-card-bg`, sec.cardBackgroundColor || fallbackCardBg);
      root.style.setProperty(`--color-sec-${secKey}-card-text`, sec.cardTextColor || fallbackCardText);
    }
  }
}

/**
 * Utility to calculate darker/lighter shade for hover states
 */
function adjustColorBrightness(hex: string, percent: number): string {
  if (!hex || !hex.startsWith('#') || hex.length < 7) {
    return '#E07312';
  }
  try {
    const num = parseInt(hex.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = ((num >> 8) & 0x00ff) + amt;
    const B = (num & 0x0000ff) + amt;
    return `#${(
      0x1000000 +
      (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
      (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
      (B < 255 ? (B < 1 ? 0 : B) : 255)
    )
      .toString(16)
      .slice(1)}`;
  } catch {
    return '#E07312';
  }
}
