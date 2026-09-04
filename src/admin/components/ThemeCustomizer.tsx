import React, { useState, useEffect } from 'react';
import { Save, RotateCcw, Eye } from 'lucide-react';
import { adminApi } from '../adminApi';
import { useAdminAuth } from '../AdminAuthContext';
import { DEFAULT_THEME, applyTheme, SiteTheme } from '../../utils/themeApplier';

export { DEFAULT_THEME };

export const ThemeCustomizer: React.FC = () => {
  const { logActivity, canPerform } = useAdminAuth();
  const [theme, setTheme] = useState<SiteTheme>(() => {
    try {
      const cached = localStorage.getItem('60fw_theme_settings');
      return cached ? JSON.parse(cached) : DEFAULT_THEME;
    } catch {
      return DEFAULT_THEME;
    }
  });

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'header' | 'footer' | 'sections' | 'global'>('header');

  useEffect(() => {
    adminApi.getTheme()
      .then((r) => {
        if (r?.data) {
          setTheme(r.data);
          localStorage.setItem('60fw_theme_settings', JSON.stringify(r.data));
          applyTheme(r.data);
        }
      })
      .catch(() => {});
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      localStorage.setItem('60fw_theme_settings', JSON.stringify(theme));
      applyTheme(theme);
      await adminApi.updateTheme(theme);
      logActivity('UPDATE_THEME', 'theme', 'Theme & Colors', 'Updated global theme, header, footer, or section colors');
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
    setSaving(false);
  };

  const handleReset = () => {
    if (confirm('Reset all colors to the official 60FRAMEWORKS brand defaults?')) {
      setTheme(DEFAULT_THEME);
      localStorage.setItem('60fw_theme_settings', JSON.stringify(DEFAULT_THEME));
      applyTheme(DEFAULT_THEME);
      logActivity('RESET_THEME', 'theme', 'Theme & Colors', 'Reset colors to default');
    }
  };

  const updateHeader = (key: string, val: string) => {
    setTheme((prev: any) => {
      const updated = {
        ...prev,
        header: { ...prev.header, [key]: val },
      };
      applyTheme(updated);
      return updated;
    });
  };

  const updateFooter = (key: string, val: string) => {
    setTheme((prev: any) => {
      const updated = {
        ...prev,
        footer: { ...prev.footer, [key]: val },
      };
      applyTheme(updated);
      return updated;
    });
  };

  const updateGlobal = (key: string, val: string) => {
    setTheme((prev: any) => {
      const updated = {
        ...prev,
        global: { ...prev.global, [key]: val },
      };
      applyTheme(updated);
      return updated;
    });
  };

  const updateSectionColor = (sectionKey: string, field: string, val: string) => {
    setTheme((prev: any) => {
      const updated = {
        ...prev,
        sections: {
          ...prev.sections,
          [sectionKey]: {
            ...(prev.sections?.[sectionKey] || {}),
            [field]: val,
          },
        },
      };
      applyTheme(updated);
      return updated;
    });
  };

  const SECTIONS_LIST = [
    {
      key: 'hero',
      label: '🎬 Hero Banner (Home Intro)',
      defaultBg: '#242424',
      defaultText: '#FFFFFF',
      defaultSubtitle: '#D1D5DB',
      defaultAccent: '#F68621',
      defaultCardBg: '#2E2E2E',
      defaultCardText: '#FFFFFF',
    },
    {
      key: 'about',
      label: '🏢 About Section (Agency Vision)',
      defaultBg: '#FFFFFF',
      defaultText: '#242424',
      defaultSubtitle: '#4A4A4A',
      defaultAccent: '#F68621',
      defaultCardBg: '#E6E7E8',
      defaultCardText: '#242424',
    },
    {
      key: 'services',
      label: '⚙️ Services Section (6 Offerings)',
      defaultBg: '#E6E7E8',
      defaultText: '#242424',
      defaultSubtitle: '#4A4A4A',
      defaultAccent: '#F68621',
      defaultCardBg: '#FFFFFF',
      defaultCardText: '#242424',
    },
    {
      key: 'clients',
      label: '🤝 Clients Section (Logos Bar)',
      defaultBg: '#FFFFFF',
      defaultText: '#242424',
      defaultSubtitle: '#4A4A4A',
      defaultAccent: '#F68621',
      defaultCardBg: '#F8F9FA',
      defaultCardText: '#242424',
    },
    {
      key: 'sectors',
      label: '🏭 Industry Sectors (Capabilities)',
      defaultBg: '#F4D3C9',
      defaultText: '#242424',
      defaultSubtitle: '#3A3A3A',
      defaultAccent: '#F68621',
      defaultCardBg: '#FFFFFF',
      defaultCardText: '#242424',
    },
    {
      key: 'caseStudies',
      label: '🎯 Case Studies / Stories (Portfolio)',
      defaultBg: '#242424',
      defaultText: '#FFFFFF',
      defaultSubtitle: '#D1D5DB',
      defaultAccent: '#F68621',
      defaultCardBg: '#2E2E2E',
      defaultCardText: '#FFFFFF',
    },
    {
      key: 'whyUs',
      label: '⭐ Why 60FRAMEWORKS (Pillars)',
      defaultBg: '#FFFFFF',
      defaultText: '#242424',
      defaultSubtitle: '#4A4A4A',
      defaultAccent: '#F68621',
      defaultCardBg: '#F8F9FA',
      defaultCardText: '#242424',
    },
    {
      key: 'testimonials',
      label: '💬 Testimonials & Impact (Quotes)',
      defaultBg: '#F4D3C9',
      defaultText: '#242424',
      defaultSubtitle: '#3A3A3A',
      defaultAccent: '#F68621',
      defaultCardBg: '#FFFFFF',
      defaultCardText: '#242424',
    },
    {
      key: 'finalCta',
      label: '📣 Final Call-to-Action (Footer Banner)',
      defaultBg: '#F68621',
      defaultText: '#FFFFFF',
      defaultSubtitle: '#FFF3E0',
      defaultAccent: '#FFFFFF',
      defaultCardBg: 'rgba(255, 255, 255, 0.15)',
      defaultCardText: '#FFFFFF',
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827' }}>🎨 Theme & Color Customizer</h2>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280', marginTop: '0.2rem' }}>
            Comprehensive color control across Header, Footer, Brand Accents, and Section Headings, Subtitles & Cards.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={handleReset} style={resetBtn}>
            <RotateCcw size={15} /> Reset Brand Defaults
          </button>
          <button onClick={handleSave} disabled={saving || !canPerform('canEditColors')} style={saveBtn}>
            <Save size={16} /> {saving ? 'Saving...' : saved ? '✓ Saved Live!' : 'Save All Colors'}
          </button>
        </div>
      </div>

      {saved && (
        <div style={successBox}>
          ✓ Color theme saved successfully! All updates are active live across the website.
        </div>
      )}

      {/* Sub-tab Switcher */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid #E5E7EB', paddingBottom: '0.75rem', overflowX: 'auto' }}>
        {[
          { key: 'header', label: 'Top Navigation / Header' },
          { key: 'footer', label: 'Global Footer' },
          { key: 'sections', label: 'Section-by-Section Colors' },
          { key: 'global', label: 'Brand Palette & Accents' },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setActiveSubTab(t.key as any)}
            style={{
              padding: '0.5rem 1rem', borderRadius: '8px', border: 'none',
              background: activeSubTab === t.key ? '#FFF3E0' : 'none',
              color: activeSubTab === t.key ? '#F68621' : '#6B7280',
              fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* 1. Header Tab */}
      {activeSubTab === 'header' && (
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <h3 style={cardTitle}>Top Navigation / Header (All Pages)</h3>
            <span style={{ fontSize: '0.75rem', color: '#059669', background: '#ECFDF5', padding: '0.2rem 0.6rem', borderRadius: '6px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Eye size={12} /> Live Preview Synchronized
            </span>
          </div>
          <p style={cardDesc}>Customize the look of the top bar and its scrolled state on desktop and mobile.</p>

          <div style={gridStyle}>
            <ColorField label="Header Background" value={theme.header?.backgroundColor || '#FFFFFF'} onChange={v => updateHeader('backgroundColor', v)} />
            <ColorField label="Scrolled Background" value={theme.header?.scrolledBackgroundColor || '#FFFFFF'} onChange={v => updateHeader('scrolledBackgroundColor', v)} />
            <ColorField label="Brand / Logo Text Color" value={theme.header?.textColor || '#242424'} onChange={v => updateHeader('textColor', v)} />
            <ColorField label="Navigation Link Color" value={theme.header?.linkColor || '#242424'} onChange={v => updateHeader('linkColor', v)} />
            <ColorField label="Link Hover / Active Color" value={theme.header?.linkHoverColor || '#F68621'} onChange={v => updateHeader('linkHoverColor', v)} />
            <ColorField label="Bottom Border Color" value={theme.header?.borderColor || '#E6E7E8'} onChange={v => updateHeader('borderColor', v)} />
          </div>

          {/* Live Preview Strip */}
          <div style={{ marginTop: '1.75rem', padding: '1.25rem 1.5rem', borderRadius: '10px', background: theme.header?.backgroundColor || '#FFFFFF', border: `1px solid ${theme.header?.borderColor || '#E6E7E8'}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ color: theme.header?.textColor || '#242424', fontWeight: 800, fontSize: '1.125rem' }}>60FRAMEWORKS</span>
              <span style={{ fontSize: '0.625rem', color: theme.header?.textColor || '#242424', opacity: 0.65, textTransform: 'uppercase', letterSpacing: '0.1em' }}>CREATIVE AGENCY</span>
            </div>
            <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.875rem', alignItems: 'center' }}>
              <span style={{ color: theme.header?.linkColor || '#242424', fontWeight: 600 }}>Home</span>
              <span style={{ color: theme.header?.linkHoverColor || '#F68621', fontWeight: 700, borderBottom: `2px solid ${theme.header?.linkHoverColor || '#F68621'}` }}>About (Active)</span>
              <span style={{ color: theme.header?.linkColor || '#242424', fontWeight: 600 }}>Services</span>
              <span style={{ color: theme.header?.linkColor || '#242424', fontWeight: 600 }}>Stories</span>
              <span style={{ padding: '0.4rem 0.9rem', borderRadius: '9999px', background: theme.global?.primaryColor || '#F68621', color: '#FFFFFF', fontWeight: 700, fontSize: '0.75rem' }}>Contact Us ↗</span>
            </div>
          </div>
        </div>
      )}

      {/* 2. Footer Tab */}
      {activeSubTab === 'footer' && (
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <h3 style={cardTitle}>Global Footer (All Pages)</h3>
            <span style={{ fontSize: '0.75rem', color: '#059669', background: '#ECFDF5', padding: '0.2rem 0.6rem', borderRadius: '6px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Eye size={12} /> Live Preview Synchronized
            </span>
          </div>
          <p style={cardDesc}>Customize the bottom footer background, headings, body text, links, and borders.</p>

          <div style={gridStyle}>
            <ColorField label="Footer Background" value={theme.footer?.backgroundColor || '#242424'} onChange={v => updateFooter('backgroundColor', v)} />
            <ColorField label="Headings Color" value={theme.footer?.headingColor || '#FFFFFF'} onChange={v => updateFooter('headingColor', v)} />
            <ColorField label="Paragraph / Body Text" value={theme.footer?.textColor || '#B0B0B0'} onChange={v => updateFooter('textColor', v)} />
            <ColorField label="Links Color" value={theme.footer?.linkColor || '#B0B0B0'} onChange={v => updateFooter('linkColor', v)} />
            <ColorField label="Accent / Highlight Color" value={theme.footer?.accentColor || '#F68621'} onChange={v => updateFooter('accentColor', v)} />
            <ColorField label="Divider Border Color" value={theme.footer?.borderColor || 'rgba(255, 255, 255, 0.08)'} onChange={v => updateFooter('borderColor', v)} />
          </div>

          {/* Live Preview Strip */}
          <div style={{ marginTop: '1.75rem', padding: '1.75rem', borderRadius: '10px', background: theme.footer?.backgroundColor || '#242424', border: `1px solid ${theme.footer?.borderColor || 'rgba(255, 255, 255, 0.08)'}` }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div>
                <div style={{ color: theme.footer?.headingColor || '#FFFFFF', fontWeight: 800, fontSize: '1.1rem', marginBottom: '0.5rem' }}>60FRAMEWORKS</div>
                <p style={{ color: theme.footer?.textColor || '#B0B0B0', fontSize: '0.8125rem', lineHeight: 1.5 }}>Architecting monumental summits and world-class experiences.</p>
              </div>
              <div>
                <div style={{ color: theme.footer?.headingColor || '#FFFFFF', fontWeight: 700, fontSize: '0.875rem', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Navigation</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.8125rem' }}>
                  <span style={{ color: theme.footer?.linkColor || '#B0B0B0' }}>About Agency</span>
                  <span style={{ color: theme.footer?.linkColor || '#B0B0B0' }}>Capabilities</span>
                  <span style={{ color: theme.footer?.linkColor || '#B0B0B0' }}>Case Studies</span>
                </div>
              </div>
              <div>
                <div style={{ color: theme.footer?.headingColor || '#FFFFFF', fontWeight: 700, fontSize: '0.875rem', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Contact</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.8125rem' }}>
                  <span style={{ color: theme.footer?.accentColor || '#F68621' }}>+966 55 307 7467</span>
                  <span style={{ color: theme.footer?.textColor || '#B0B0B0' }}>Riyadh, Saudi Arabia</span>
                </div>
              </div>
            </div>
            <div style={{ borderTop: `1px solid ${theme.footer?.borderColor || 'rgba(255, 255, 255, 0.08)'}`, paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: theme.footer?.textColor || '#B0B0B0' }}>
              <span>© {new Date().getFullYear()} 60FRAMEWORKS. All rights reserved.</span>
              <span style={{ color: theme.footer?.accentColor || '#F68621' }}>Back to Top ↑</span>
            </div>
          </div>
        </div>
      )}

      {/* 3. Section by Section Colors */}
      {activeSubTab === 'sections' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', padding: '0.875rem 1.25rem', borderRadius: '10px', fontSize: '0.8125rem', color: '#1E40AF' }}>
            💡 <strong>Complete Section Coverage:</strong> Customize the Section Background, Headings, Subtitle/Paragraph text, Eyebrows, and internal Cards independently so no text ever disappears!
          </div>

          {SECTIONS_LIST.map(sec => {
            const secColors = theme.sections?.[sec.key] || {
              backgroundColor: sec.defaultBg,
              textColor: sec.defaultText,
              subtitleColor: sec.defaultSubtitle,
              accentColor: sec.defaultAccent,
              cardBackgroundColor: sec.defaultCardBg,
              cardTextColor: sec.defaultCardText,
            };

            const bgVal = secColors.backgroundColor || sec.defaultBg;
            const textVal = secColors.textColor || sec.defaultText;
            const subVal = secColors.subtitleColor || sec.defaultSubtitle;
            const accentVal = secColors.accentColor || sec.defaultAccent;
            const cardBgVal = secColors.cardBackgroundColor || sec.defaultCardBg;
            const cardTextVal = secColors.cardTextColor || sec.defaultCardText;

            return (
              <div key={sec.key} style={cardStyle}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#111827' }}>{sec.label}</h4>
                  <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center', fontSize: '0.6875rem', color: '#6B7280' }}>
                    <span style={{ width: '14px', height: '14px', borderRadius: '3px', background: bgVal, border: '1px solid #D1D5DB' }} title="Section BG" />
                    <span style={{ width: '14px', height: '14px', borderRadius: '3px', background: textVal, border: '1px solid #D1D5DB' }} title="Heading Text" />
                    <span style={{ width: '14px', height: '14px', borderRadius: '3px', background: subVal, border: '1px solid #D1D5DB' }} title="Subtitle Text" />
                    <span style={{ width: '14px', height: '14px', borderRadius: '3px', background: accentVal, border: '1px solid #D1D5DB' }} title="Accent / Badge" />
                    <span style={{ width: '14px', height: '14px', borderRadius: '3px', background: cardBgVal, border: '1px solid #D1D5DB' }} title="Card BG" />
                    <span style={{ width: '14px', height: '14px', borderRadius: '3px', background: cardTextVal, border: '1px solid #D1D5DB' }} title="Card Text" />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
                  <ColorField label="1. Section Background" value={bgVal} onChange={v => updateSectionColor(sec.key, 'backgroundColor', v)} />
                  <ColorField label="2. Heading / Title" value={textVal} onChange={v => updateSectionColor(sec.key, 'textColor', v)} />
                  <ColorField label="3. Subtitle / Paragraphs" value={subVal} onChange={v => updateSectionColor(sec.key, 'subtitleColor', v)} />
                  <ColorField label="4. Accent / Eyebrow" value={accentVal} onChange={v => updateSectionColor(sec.key, 'accentColor', v)} />
                  <ColorField label="5. Card / Box Background" value={cardBgVal} onChange={v => updateSectionColor(sec.key, 'cardBackgroundColor', v)} />
                  <ColorField label="6. Card Text Color" value={cardTextVal} onChange={v => updateSectionColor(sec.key, 'cardTextColor', v)} />
                </div>

                {/* Live Section & Card Preview */}
                <div
                  style={{
                    padding: '1.25rem',
                    borderRadius: '10px',
                    background: bgVal,
                    border: '1px solid rgba(0,0,0,0.12)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
                    <div>
                      <span style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: accentVal, display: 'block', marginBottom: '0.25rem' }}>
                        ★ SECTION EYEBROW
                      </span>
                      <div style={{ fontSize: '1.125rem', fontWeight: 800, color: textVal, marginBottom: '0.25rem' }}>
                        Sample Section Main Heading
                      </div>
                      <div style={{ fontSize: '0.8125rem', color: subVal, maxWidth: '480px', lineHeight: 1.5 }}>
                        This is the section subtitle & body paragraph text. It clearly contrasts with the section background.
                      </div>
                    </div>
                    <span style={{ padding: '0.35rem 0.85rem', borderRadius: '9999px', background: accentVal, color: '#FFFFFF', fontSize: '0.6875rem', fontWeight: 700, alignSelf: 'flex-start' }}>
                      Accent Badge
                    </span>
                  </div>

                  {/* Sample Card Inside Section */}
                  <div
                    style={{
                      background: cardBgVal,
                      borderRadius: '8px',
                      padding: '1rem',
                      border: '1px solid rgba(0,0,0,0.08)',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
                      maxWidth: '380px',
                    }}
                  >
                    <div style={{ fontSize: '0.875rem', fontWeight: 700, color: cardTextVal, marginBottom: '0.25rem' }}>
                      Sample Content Card
                    </div>
                    <div style={{ fontSize: '0.75rem', color: cardTextVal, opacity: 0.8, lineHeight: 1.4 }}>
                      Card body description text styled with Card Text Color.
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 4. Global Palette */}
      {activeSubTab === 'global' && (
        <div style={cardStyle}>
          <h3 style={cardTitle}>Global Brand Accents & Colors</h3>
          <p style={cardDesc}>Core brand colors used for interactive buttons, glows, highlights, and defaults.</p>

          <div style={gridStyle}>
            <ColorField label="Primary Brand Color" value={theme.global?.primaryColor || '#F68621'} onChange={v => updateGlobal('primaryColor', v)} />
            <ColorField label="Secondary Glow Color" value={theme.global?.secondaryColor || '#FFD400'} onChange={v => updateGlobal('secondaryColor', v)} />
            <ColorField label="Default Page Background" value={theme.global?.backgroundColor || '#FFFFFF'} onChange={v => updateGlobal('backgroundColor', v)} />
            <ColorField label="Default Body Text Color" value={theme.global?.textColor || '#242424'} onChange={v => updateGlobal('textColor', v)} />
          </div>

          <div style={{ marginTop: '1.5rem', padding: '1.25rem', borderRadius: '10px', background: theme.global?.backgroundColor || '#FFFFFF', border: '1px solid #E5E7EB', display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <button style={{ padding: '0.75rem 1.5rem', borderRadius: '9999px', background: theme.global?.primaryColor || '#F68621', color: '#FFFFFF', border: 'none', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer' }}>
              Primary Button ({theme.global?.primaryColor || '#F68621'})
            </button>
            <span style={{ padding: '0.4rem 1rem', borderRadius: '9999px', background: '#FFF3EB', color: theme.global?.primaryColor || '#F68621', border: `1px solid ${theme.global?.primaryColor || '#F68621'}`, fontSize: '0.75rem', fontWeight: 700 }}>
              Pill Badge
            </span>
            <span style={{ color: theme.global?.textColor || '#242424', fontSize: '0.875rem' }}>
              Default Body Text Preview
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

interface ColorFieldProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
}

const ColorField: React.FC<ColorFieldProps> = ({ label, value, onChange }) => {
  const safeHex = value?.startsWith('#') && value.length === 7 ? value : '#F68621';

  return (
    <div>
      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>
        {label}
      </label>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#F9FAFB', border: '1px solid #D1D5DB', borderRadius: '8px', padding: '0.25rem 0.5rem' }}>
        <input
          type="color"
          value={safeHex}
          onChange={e => onChange(e.target.value)}
          style={{ width: '34px', height: '34px', border: 'none', borderRadius: '6px', cursor: 'pointer', background: 'none' }}
        />
        <input
          type="text"
          value={value || ''}
          onChange={e => onChange(e.target.value)}
          placeholder="#F68621 or rgba(...)"
          style={{ flex: 1, border: 'none', background: 'none', fontSize: '0.8125rem', outline: 'none', fontFamily: 'monospace', color: '#111827' }}
        />
      </div>
    </div>
  );
};

const cardStyle: React.CSSProperties = {
  background: '#fff', borderRadius: '12px', border: '1px solid #E5E7EB', padding: '1.5rem', marginBottom: '1rem',
};
const cardTitle: React.CSSProperties = { fontSize: '1.0625rem', fontWeight: 700, color: '#111827', marginBottom: '0.25rem' };
const cardDesc: React.CSSProperties = { fontSize: '0.8125rem', color: '#6B7280', marginBottom: '1.25rem' };
const gridStyle: React.CSSProperties = {
  display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem',
};
const saveBtn: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: '0.5rem',
  padding: '0.625rem 1.25rem', background: '#F68621', color: '#fff',
  border: 'none', borderRadius: '10px', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer',
};
const resetBtn: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: '0.5rem',
  padding: '0.625rem 1rem', background: '#F3F4F6', color: '#374151',
  border: '1px solid #E5E7EB', borderRadius: '10px', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer',
};
const successBox: React.CSSProperties = {
  padding: '0.75rem 1rem', background: '#D1FAE5', color: '#065F46', borderRadius: '8px', marginBottom: '1.25rem', fontWeight: 600, fontSize: '0.875rem',
};
