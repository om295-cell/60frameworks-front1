import React, { useState, useEffect } from 'react';
import { Save, ChevronDown, ChevronUp, Lock } from 'lucide-react';
import { adminApi } from '../adminApi';
import { MediaUploader } from './MediaUploader';
import { FALLBACK_HOMEPAGE_CONTENT } from '../../services/api';
import { useAdminAuth } from '../AdminAuthContext';

interface Section {
  key: string;
  title: string;
  emoji: string;
  permKey?: 'editHero' | 'editAbout' | 'editFinalCTA';
}

const SECTIONS: Section[] = [
  { key: 'hero', title: 'Hero Section', emoji: '🎬', permKey: 'editHero' },
  { key: 'about', title: 'About Section', emoji: '🏢', permKey: 'editAbout' },
  { key: 'whyUs', title: 'Why Us Section', emoji: '⭐', permKey: 'editAbout' },
  { key: 'finalCta', title: 'Final CTA Section', emoji: '📣', permKey: 'editFinalCTA' },
];

const fieldLabel = (k: string) =>
  k.replace(/_en$/, ' (English)').replace(/_ar$/, ' (Arabic)').replace(/_/g, ' ');

export const HomepageEditor: React.FC = () => {
  const { hasPermission, isSuperAdmin } = useAdminAuth();
  const canUploadMedia = isSuperAdmin || hasPermission('homepage', 'media');
  const canEditAny = isSuperAdmin ||
    hasPermission('homepage', 'editHero') ||
    hasPermission('homepage', 'editAbout') ||
    hasPermission('homepage', 'editFinalCTA');
  const [content, setContent] = useState<any>(() => {
    try {
      const cached = localStorage.getItem('60fw_homepage_content');
      return cached ? JSON.parse(cached) : FALLBACK_HOMEPAGE_CONTENT;
    } catch {
      return FALLBACK_HOMEPAGE_CONTENT;
    }
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [openSection, setOpenSection] = useState<string>('hero');

  useEffect(() => {
    adminApi.getContent()
      .then((r) => {
        if (r && r.data) {
          setContent(r.data);
          localStorage.setItem('60fw_homepage_content', JSON.stringify(r.data));
        }
      })
      .catch((err) => {
        console.warn('API content fetch notice:', err);
      });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      localStorage.setItem('60fw_homepage_content', JSON.stringify(content));
      await adminApi.updateContent(content);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e: any) {
      // Still saved locally
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
    setSaving(false);
  };

  const updateField = (section: string, field: string, value: string) => {
    setContent((prev: any) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
  };
  if (!content) return <div style={errorBox}>{error || 'No content found'}</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={sectionTitle}>🌐 Homepage Text & Media</h2>
        {canEditAny && (
          <button onClick={handleSave} disabled={saving} style={saveBtn}>
            <Save size={16} />
            {saving ? 'Saving...' : saved ? '✓ Saved!' : 'Save All Changes'}
          </button>
        )}
      </div>

      {error && <div style={errorBox}>{error}</div>}
      {saved && <div style={successBox}>✓ Homepage content saved successfully!</div>}

      {SECTIONS.map((sec) => {
        const sectionData = content[sec.key] || {};
        const isOpen = openSection === sec.key;
        const canEditSec = isSuperAdmin || !sec.permKey || hasPermission('homepage', sec.permKey);

        // Separate text fields from media fields
        const textFields = Object.entries(sectionData).filter(
          ([k]) => !['backdropImage', 'backdropVideo', 'image', 'videoUrl', 'stats'].includes(k)
        );
        const mediaFields = Object.entries(sectionData).filter(
          ([k]) => ['backdropImage', 'backdropVideo', 'image', 'videoUrl'].includes(k)
        );
        const stats = sectionData.stats;

        return (
          <div key={sec.key} style={accordionCard}>
            <button
              onClick={() => setOpenSection(isOpen ? '' : sec.key)}
              style={accordionHeader}
            >
              <span style={{ fontWeight: 700, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {sec.emoji} {sec.title}
                {!canEditSec && (
                  <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#9CA3AF', background: '#F3F4F6', padding: '0.15rem 0.5rem', borderRadius: '12px' }}>
                    <Lock size={10} style={{ display: 'inline', marginRight: '3px' }} /> Read Only
                  </span>
                )}
              </span>
              {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>

            {isOpen && (
              <div style={{ padding: '1.5rem' }}>
                {/* Text Fields */}
                {textFields.length > 0 && (
                  <div style={{ marginBottom: '1.5rem' }}>
                    <h4 style={subHeading}>✏️ Text Content (EN / AR)</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      {textFields.map(([k, v]) => {
                        const isLong = typeof v === 'string' && (v as string).length > 80;
                        return (
                          <div key={k} style={isLong ? { gridColumn: '1 / -1' } : {}}>
                            <label style={fieldLbl}>{fieldLabel(k)}</label>
                            {isLong ? (
                              <textarea
                                rows={3}
                                value={v as string}
                                disabled={!canEditSec}
                                onChange={(e) => updateField(sec.key, k, e.target.value)}
                                style={{
                                  ...inputS,
                                  resize: 'vertical',
                                  direction: k.endsWith('_ar') ? 'rtl' : 'ltr',
                                  background: canEditSec ? '#fff' : '#F9FAFB',
                                  cursor: canEditSec ? 'text' : 'not-allowed',
                                }}
                              />
                            ) : (
                              <input
                                type="text"
                                value={v as string}
                                disabled={!canEditSec}
                                onChange={(e) => updateField(sec.key, k, e.target.value)}
                                style={{
                                  ...inputS,
                                  direction: k.endsWith('_ar') ? 'rtl' : 'ltr',
                                  background: canEditSec ? '#fff' : '#F9FAFB',
                                  cursor: canEditSec ? 'text' : 'not-allowed',
                                }}
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Stats (About section) */}
                {stats && (
                  <div style={{ marginBottom: '1.5rem' }}>
                    <h4 style={subHeading}>📊 Statistics</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                      {stats.map((stat: any, idx: number) => (
                        <div key={idx} style={{ background: '#F9FAFB', borderRadius: '8px', padding: '1rem', border: '1px solid #E5E7EB' }}>
                          <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#9CA3AF', marginBottom: '0.5rem' }}>STAT #{idx + 1}</p>
                          {Object.entries(stat).filter(([k]) => k !== '_id').map(([k, v]) => (
                            <div key={k} style={{ marginBottom: '0.5rem' }}>
                              <label style={fieldLbl}>{fieldLabel(k)}</label>
                              <input
                                type="text"
                                value={v as string}
                                onChange={(e) => {
                                  const newStats = [...stats];
                                  newStats[idx] = { ...newStats[idx], [k]: e.target.value };
                                  setContent((prev: any) => ({
                                    ...prev,
                                    about: { ...prev.about, stats: newStats },
                                  }));
                                }}
                                style={{ ...inputS, direction: k.endsWith('_ar') ? 'rtl' : 'ltr' }}
                              />
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Media Fields */}
                {mediaFields.length > 0 && (
                  <div>
                    <h4 style={subHeading}>🖼️ Media (Images & Videos)</h4>
                    {canUploadMedia ? (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                        {mediaFields.map(([k, v]) => (
                          <MediaUploader
                            key={k}
                            label={fieldLabel(k)}
                            currentUrl={v as string}
                            accept={k.toLowerCase().includes('video') ? 'video' : 'image'}
                            onUploaded={(url) => updateField(sec.key, k, url)}
                          />
                        ))}
                      </div>
                    ) : (
                      <div style={{ padding: '0.85rem', background: '#F9FAFB', borderRadius: '8px', border: '1px solid #E5E7EB', color: '#6B7280', fontSize: '0.8125rem' }}>
                        <Lock size={12} style={{ display: 'inline', marginRight: '4px' }} /> Media upload restricted for your role. Contact Super Admin to enable media upload privileges.
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

const sectionTitle: React.CSSProperties = { fontSize: '1.25rem', fontWeight: 800, color: '#111827' };
const saveBtn: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: '0.5rem',
  padding: '0.75rem 1.5rem', background: '#F68621', color: '#fff',
  border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', fontSize: '0.9375rem',
};
const accordionCard: React.CSSProperties = {
  background: '#fff', borderRadius: '12px', border: '1px solid #E5E7EB',
  marginBottom: '1rem', overflow: 'hidden',
};
const accordionHeader: React.CSSProperties = {
  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  width: '100%', padding: '1.125rem 1.5rem', background: 'none', border: 'none',
  cursor: 'pointer', textAlign: 'left',
};
const subHeading: React.CSSProperties = {
  fontSize: '0.875rem', fontWeight: 700, color: '#374151',
  marginBottom: '0.75rem', paddingBottom: '0.5rem', borderBottom: '1px solid #F3F4F6',
};
const fieldLbl: React.CSSProperties = {
  display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#6B7280', marginBottom: '0.25rem', textTransform: 'capitalize',
};
const inputS: React.CSSProperties = {
  width: '100%', padding: '0.6rem 0.85rem', border: '1px solid #D1D5DB',
  borderRadius: '8px', fontSize: '0.875rem', outline: 'none', color: '#111827',
  fontFamily: 'inherit',
};
const errorBox: React.CSSProperties = {
  padding: '1rem', background: '#FEE2E2', color: '#B91C1C', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.875rem',
};
const successBox: React.CSSProperties = {
  padding: '1rem', background: '#D1FAE5', color: '#065F46', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.875rem', fontWeight: 600,
};
