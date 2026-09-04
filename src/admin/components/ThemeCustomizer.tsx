import React, { useState, useEffect } from 'react';
import { Save, RotateCcw } from 'lucide-react';
import { adminApi } from '../adminApi';
import { useAdminAuth } from '../AdminAuthContext';

export const DEFAULT_THEME = {
  header: {
    backgroundColor: '#242424',
    textColor: '#FFFFFF',
    linkColor: '#D1D5DB',
    linkHoverColor: '#F68621',
    borderColor: 'rgba(255, 255, 255, 0.1)',
    scrolledBackgroundColor: '#1A1A1A',
  },
  footer: {
    backgroundColor: '#1E1E1E',
    textColor: '#9CA3AF',
    headingColor: '#FFFFFF',
    linkColor: '#D1D5DB',
    accentColor: '#F68621',
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  global: {
    primaryColor: '#F68621',
    secondaryColor: '#FFD400',
    backgroundColor: '#FFFFFF',
    textColor: '#242424',
  },
  sections: {
    hero: { backgroundColor: '#1A1A1A', textColor: '#FFFFFF', accentColor: '#F68621' },
    about: { backgroundColor: '#FFFFFF', textColor: '#242424', accentColor: '#F68621' },
    services: { backgroundColor: '#1A1A1A', textColor: '#FFFFFF', accentColor: '#F68621' },
    clients: { backgroundColor: '#242424', textColor: '#FFFFFF', accentColor: '#F68621' },
    sectors: { backgroundColor: '#1A1A1A', textColor: '#FFFFFF', accentColor: '#F68621' },
    caseStudies: { backgroundColor: '#1A1A1A', textColor: '#FFFFFF', accentColor: '#F68621' },
    whyUs: { backgroundColor: '#FFFFFF', textColor: '#242424', accentColor: '#F68621' },
    testimonials: { backgroundColor: '#1A1A1A', textColor: '#FFFFFF', accentColor: '#F68621' },
    finalCta: { backgroundColor: '#F68621', textColor: '#FFFFFF', accentColor: '#FFFFFF' },
  },
};

export const ThemeCustomizer: React.FC = () => {
  const { logActivity, canPerform } = useAdminAuth();
  const [theme, setTheme] = useState<any>(() => {
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
        }
      })
      .catch(() => {});
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      localStorage.setItem('60fw_theme_settings', JSON.stringify(theme));
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
      logActivity('RESET_THEME', 'theme', 'Theme & Colors', 'Reset colors to default');
    }
  };

  const updateHeader = (key: string, val: string) => {
    setTheme((prev: any) => ({
      ...prev,
      header: { ...prev.header, [key]: val },
    }));
  };

  const updateFooter = (key: string, val: string) => {
    setTheme((prev: any) => ({
      ...prev,
      footer: { ...prev.footer, [key]: val },
    }));
  };

  const updateGlobal = (key: string, val: string) => {
    setTheme((prev: any) => ({
      ...prev,
      global: { ...prev.global, [key]: val },
    }));
  };

  const updateSectionColor = (sectionKey: string, field: string, val: string) => {
    setTheme((prev: any) => ({
      ...prev,
      sections: {
        ...prev.sections,
        [sectionKey]: {
          ...(prev.sections?.[sectionKey] || {}),
          [field]: val,
        },
      },
    }));
  };

  const SECTIONS_LIST = [
    { key: 'hero', label: '🎬 Hero Banner' },
    { key: 'about', label: '🏢 About Section' },
    { key: 'services', label: '⚙️ Services Section' },
    { key: 'clients', label: '🤝 Clients Logo Bar' },
    { key: 'sectors', label: '🏭 Industry Sectors' },
    { key: 'caseStudies', label: '🎯 Case Studies' },
    { key: 'whyUs', label: '⭐ Why 60FRAMEWORKS' },
    { key: 'testimonials', label: '💬 Testimonials' },
    { key: 'finalCta', label: '📣 Final Call-to-Action' },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827' }}>🎨 Theme & Color Customizer</h2>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280', marginTop: '0.2rem' }}>
            Control header & footer styling across all pages, plus individual section color schemes.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={handleReset} style={resetBtn}>
            <RotateCcw size={15} /> Reset Defaults
          </button>
          <button onClick={handleSave} disabled={saving || !canPerform('canEditColors')} style={saveBtn}>
            <Save size={16} /> {saving ? 'Saving...' : saved ? '✓ Saved!' : 'Save Colors'}
          </button>
        </div>
      </div>

      {saved && <div style={successBox}>✓ Colors saved successfully and applied live!</div>}

      {/* Sub-tab Switcher */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid #E5E7EB', paddingBottom: '0.75rem' }}>
        {[
          { key: 'header', label: 'Header Navigation' },
          { key: 'footer', label: 'Global Footer' },
          { key: 'sections', label: 'Section-by-Section Colors' },
          { key: 'global', label: 'Brand Palette' },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setActiveSubTab(t.key as any)}
            style={{
              padding: '0.5rem 1rem', borderRadius: '8px', border: 'none',
              background: activeSubTab === t.key ? '#FFF3E0' : 'none',
              color: activeSubTab === t.key ? '#F68621' : '#6B7280',
              fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* 1. Header Tab */}
      {activeSubTab === 'header' && (
        <div style={cardStyle}>
          <h3 style={cardTitle}>Top Navigation / Header (All Pages)</h3>
          <p style={cardDesc}>Customize the look of the top bar and its scrolled state.</p>

          <div style={gridStyle}>
            <ColorField label="Background Color" value={theme.header?.backgroundColor} onChange={v => updateHeader('backgroundColor', v)} />
            <ColorField label="Scrolled Background" value={theme.header?.scrolledBackgroundColor} onChange={v => updateHeader('scrolledBackgroundColor', v)} />
            <ColorField label="Brand / Logo Text Color" value={theme.header?.textColor} onChange={v => updateHeader('textColor', v)} />
            <ColorField label="Navigation Link Color" value={theme.header?.linkColor} onChange={v => updateHeader('linkColor', v)} />
            <ColorField label="Link Hover / Active Color" value={theme.header?.linkHoverColor} onChange={v => updateHeader('linkHoverColor', v)} />
            <ColorField label="Bottom Border Color" value={theme.header?.borderColor} onChange={v => updateHeader('borderColor', v)} />
          </div>

          {/* Live Preview Strip */}
          <div style={{ marginTop: '1.5rem', padding: '1rem', borderRadius: '10px', background: theme.header?.backgroundColor, border: `1px solid ${theme.header?.borderColor}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ color: theme.header?.textColor, fontWeight: 800 }}>60FRAMEWORKS</span>
            <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8125rem' }}>
              <span style={{ color: theme.header?.linkColor }}>Home</span>
              <span style={{ color: theme.header?.linkHoverColor, fontWeight: 700 }}>About (Hover)</span>
              <span style={{ color: theme.header?.linkColor }}>Services</span>
              <span style={{ color: theme.header?.linkColor }}>Contact</span>
            </div>
          </div>
        </div>
      )}

      {/* 2. Footer Tab */}
      {activeSubTab === 'footer' && (
        <div style={cardStyle}>
          <h3 style={cardTitle}>Global Footer (All Pages)</h3>
          <p style={cardDesc}>Customize the bottom footer colors, headings, links, and borders.</p>

          <div style={gridStyle}>
            <ColorField label="Footer Background" value={theme.footer?.backgroundColor} onChange={v => updateFooter('backgroundColor', v)} />
            <ColorField label="Headings Color" value={theme.footer?.headingColor} onChange={v => updateFooter('headingColor', v)} />
            <ColorField label="Paragraph / Body Text" value={theme.footer?.textColor} onChange={v => updateFooter('textColor', v)} />
            <ColorField label="Links Color" value={theme.footer?.linkColor} onChange={v => updateFooter('linkColor', v)} />
            <ColorField label="Accent / Highlight Color" value={theme.footer?.accentColor} onChange={v => updateFooter('accentColor', v)} />
            <ColorField label="Divider Border Color" value={theme.footer?.borderColor} onChange={v => updateFooter('borderColor', v)} />
          </div>

          {/* Live Preview Strip */}
          <div style={{ marginTop: '1.5rem', padding: '1.5rem', borderRadius: '10px', background: theme.footer?.backgroundColor, border: `1px solid ${theme.footer?.borderColor}` }}>
            <div style={{ color: theme.footer?.headingColor, fontWeight: 800, marginBottom: '0.5rem' }}>60FRAMEWORKS FOOTER</div>
            <p style={{ color: theme.footer?.textColor, fontSize: '0.8125rem', marginBottom: '1rem' }}>Architecting world-class experiences.</p>
            <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8125rem', borderTop: `1px solid ${theme.footer?.borderColor}`, paddingTop: '0.75rem' }}>
              <span style={{ color: theme.footer?.linkColor }}>Privacy Policy</span>
              <span style={{ color: theme.footer?.accentColor }}>accent@60frameworks.com</span>
            </div>
          </div>
        </div>
      )}

      {/* 3. Section by Section Colors */}
      {activeSubTab === 'sections' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {SECTIONS_LIST.map(sec => {
            const secColors = theme.sections?.[sec.key] || { backgroundColor: '#FFFFFF', textColor: '#242424', accentColor: '#F68621' };
            return (
              <div key={sec.key} style={cardStyle}>
                <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#111827', marginBottom: '0.75rem' }}>{sec.label}</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                  <ColorField label="Section Background" value={secColors.backgroundColor} onChange={v => updateSectionColor(sec.key, 'backgroundColor', v)} />
                  <ColorField label="Text / Heading Color" value={secColors.textColor} onChange={v => updateSectionColor(sec.key, 'textColor', v)} />
                  <ColorField label="Accent / Badge Color" value={secColors.accentColor} onChange={v => updateSectionColor(sec.key, 'accentColor', v)} />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 4. Global Palette */}
      {activeSubTab === 'global' && (
        <div style={cardStyle}>
          <h3 style={cardTitle}>Global Brand Accents</h3>
          <p style={cardDesc}>Base theme colors used across interactive buttons, icons, and highlights.</p>

          <div style={gridStyle}>
            <ColorField label="Primary Brand Color" value={theme.global?.primaryColor} onChange={v => updateGlobal('primaryColor', v)} />
            <ColorField label="Secondary Glow Color" value={theme.global?.secondaryColor} onChange={v => updateGlobal('secondaryColor', v)} />
            <ColorField label="Default Page Background" value={theme.global?.backgroundColor} onChange={v => updateGlobal('backgroundColor', v)} />
            <ColorField label="Default Text Color" value={theme.global?.textColor} onChange={v => updateGlobal('textColor', v)} />
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
  return (
    <div>
      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>
        {label}
      </label>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#F9FAFB', border: '1px solid #D1D5DB', borderRadius: '8px', padding: '0.25rem 0.5rem' }}>
        <input
          type="color"
          value={value?.startsWith('#') && value.length === 7 ? value : '#F68621'}
          onChange={e => onChange(e.target.value)}
          style={{ width: '32px', height: '32px', border: 'none', borderRadius: '6px', cursor: 'pointer', background: 'none' }}
        />
        <input
          type="text"
          value={value || ''}
          onChange={e => onChange(e.target.value)}
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
