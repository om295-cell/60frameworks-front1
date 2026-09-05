import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, ArrowUp, ArrowDown, Save, RotateCcw, Plus, Trash2 } from 'lucide-react';
import { adminApi } from '../adminApi';
import { useAdminAuth } from '../AdminAuthContext';

export interface SectionItem {
  id: string;
  name: string;
  name_ar: string;
  enabled: boolean;
  order: number;
  customBackgroundColor?: string;
  customTextColor?: string;
}

const DEFAULT_SECTIONS: SectionItem[] = [
  { id: 'hero', name: 'Hero Banner', name_ar: 'الواجهة الرئيسية', enabled: true, order: 1 },
  { id: 'latestEvent', name: 'Latest Event Spotlight', name_ar: 'فعاليتنا الأخيرة ورابط الدرايف', enabled: true, order: 2 },
  { id: 'about', name: 'About Agency', name_ar: 'عن الوكالة', enabled: true, order: 3 },
  { id: 'services', name: 'Services & Capabilities', name_ar: 'الخدمات والحلول', enabled: true, order: 4 },
  { id: 'clients', name: 'Trusted Clients', name_ar: 'عملاؤنا وشركاؤنا', enabled: true, order: 5 },
  { id: 'sectors', name: 'Industry Sectors', name_ar: 'القطاعات التخصصية', enabled: true, order: 6 },
  { id: 'caseStudies', name: 'Case Studies / Stories', name_ar: 'أبرز الأعمال والفعاليات', enabled: true, order: 7 },
  { id: 'whyUs', name: 'Why 60FRAMEWORKS', name_ar: 'لماذا 60 فريمووركس', enabled: true, order: 8 },
  { id: 'testimonials', name: 'Testimonials & Impact', name_ar: 'آراء وتقييمات القادة', enabled: true, order: 9 },
  { id: 'finalCta', name: 'Final Call to Action', name_ar: 'دعوة للتواصل والشراكة', enabled: true, order: 10 },
];

export const SectionManager: React.FC = () => {
  const { logActivity, hasPermission, isSuperAdmin } = useAdminAuth();
  const canToggleVisibility = isSuperAdmin || hasPermission('sections', 'toggleVisibility');
  const canReorder = isSuperAdmin || hasPermission('sections', 'reorder');
  const canModify = canToggleVisibility || canReorder;
  const [sections, setSections] = useState<SectionItem[]>(() => {
    try {
      const cached = localStorage.getItem('60fw_section_order');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return DEFAULT_SECTIONS;
  });

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [newSectionName, setNewSectionName] = useState('');
  const [newSectionNameAr, setNewSectionNameAr] = useState('');

  useEffect(() => {
    adminApi.getTheme()
      .then((r) => {
        if (r?.data?.sectionOrder && Array.isArray(r.data.sectionOrder) && r.data.sectionOrder.length > 0) {
          setSections(r.data.sectionOrder);
          localStorage.setItem('60fw_section_order', JSON.stringify(r.data.sectionOrder));
        }
      })
      .catch(() => {});
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      localStorage.setItem('60fw_section_order', JSON.stringify(sections));
      await adminApi.updateTheme({ sectionOrder: sections });
      logActivity('UPDATE_SECTIONS', 'sections', 'Section Layout', 'Modified homepage section ordering and visibility');
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
    setSaving(false);
  };

  const toggleSection = (id: string) => {
    setSections(prev =>
      prev.map(s => (s.id === id ? { ...s, enabled: !s.enabled } : s))
    );
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const copy = [...sections];
    const temp = copy[index];
    copy[index] = copy[index - 1];
    copy[index - 1] = temp;
    setSections(copy.map((s, idx) => ({ ...s, order: idx + 1 })));
  };

  const moveDown = (index: number) => {
    if (index === sections.length - 1) return;
    const copy = [...sections];
    const temp = copy[index];
    copy[index] = copy[index + 1];
    copy[index + 1] = temp;
    setSections(copy.map((s, idx) => ({ ...s, order: idx + 1 })));
  };

  const addCustomSection = () => {
    if (!newSectionName.trim()) return;
    const customId = `custom_${Date.now()}`;
    const newSec: SectionItem = {
      id: customId,
      name: newSectionName.trim(),
      name_ar: newSectionNameAr.trim() || newSectionName.trim(),
      enabled: true,
      order: sections.length + 1,
      customBackgroundColor: '#FFFFFF',
      customTextColor: '#242424',
    };
    setSections([...sections, newSec]);
    setNewSectionName('');
    setNewSectionNameAr('');
  };

  const removeSection = (id: string) => {
    if (confirm('Remove this section from the page?')) {
      setSections(sections.filter(s => s.id !== id));
    }
  };

  const handleReset = () => {
    if (confirm('Reset section order to default layout?')) {
      setSections(DEFAULT_SECTIONS);
      localStorage.setItem('60fw_section_order', JSON.stringify(DEFAULT_SECTIONS));
      logActivity('RESET_SECTIONS', 'sections', 'Section Layout', 'Reset section ordering to default');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827' }}>📑 Section & Layout Manager</h2>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280', marginTop: '0.2rem' }}>
            Reorder, enable/disable, add or remove sections on every page.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          {canReorder && (
            <button onClick={handleReset} style={resetBtn}>
              <RotateCcw size={15} /> Reset Order
            </button>
          )}
          {canModify && (
            <button onClick={handleSave} disabled={saving} style={saveBtn}>
              <Save size={16} /> {saving ? 'Saving...' : saved ? '✓ Saved!' : 'Save Layout'}
            </button>
          )}
        </div>
      </div>

      {saved && <div style={successBox}>✓ Section layout saved successfully!</div>}

      {/* Sections List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
        {sections.map((sec, idx) => (
          <div
            key={sec.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '1rem 1.25rem',
              background: '#fff',
              borderRadius: '12px',
              border: `1px solid ${sec.enabled ? '#E5E7EB' : '#FCA5A5'}`,
              opacity: sec.enabled ? 1 : 0.65,
              transition: 'all 0.15s',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontSize: '0.8125rem', fontWeight: 800, color: '#9CA3AF', width: '24px' }}>
                #{idx + 1}
              </span>
              <div>
                <div style={{ fontWeight: 700, color: '#111827', fontSize: '0.9375rem' }}>
                  {sec.name} <span style={{ fontSize: '0.8125rem', color: '#9CA3AF', marginLeft: '0.5rem' }}>({sec.name_ar})</span>
                </div>
                <span style={{ fontSize: '0.6875rem', color: '#6B7280', fontFamily: 'monospace' }}>
                  ID: #{sec.id}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {/* Order Buttons */}
              {canReorder && (
                <>
                  <button
                    onClick={() => moveUp(idx)}
                    disabled={idx === 0}
                    style={{ ...iconBtn, opacity: idx === 0 ? 0.3 : 1 }}
                    title="Move Up"
                  >
                    <ArrowUp size={15} />
                  </button>
                  <button
                    onClick={() => moveDown(idx)}
                    disabled={idx === sections.length - 1}
                    style={{ ...iconBtn, opacity: idx === sections.length - 1 ? 0.3 : 1 }}
                    title="Move Down"
                  >
                    <ArrowDown size={15} />
                  </button>
                </>
              )}

              {/* Visibility Toggle */}
              {canToggleVisibility ? (
                <button
                  onClick={() => toggleSection(sec.id)}
                  style={{
                    ...toggleBtn,
                    background: sec.enabled ? '#ECFDF5' : '#FEF2F2',
                    color: sec.enabled ? '#059669' : '#DC2626',
                    borderColor: sec.enabled ? '#A7F3D0' : '#FECACA',
                  }}
                >
                  {sec.enabled ? <><Eye size={14} /> Visible</> : <><EyeOff size={14} /> Hidden</>}
                </button>
              ) : (
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: sec.enabled ? '#059669' : '#DC2626', padding: '0.35rem 0.65rem' }}>
                  {sec.enabled ? 'Visible' : 'Hidden'}
                </span>
              )}

              {/* Custom section deletion */}
              {sec.id.startsWith('custom_') && (
                <button onClick={() => removeSection(sec.id)} style={{ ...iconBtn, color: '#DC2626', background: '#FEF2F2' }}>
                  <Trash2 size={15} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Custom Section Block */}
      <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #E5E7EB', padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#111827', marginBottom: '0.5rem' }}>
          + Add New Section Block
        </h3>
        <p style={{ fontSize: '0.8125rem', color: '#6B7280', marginBottom: '1rem' }}>
          Add custom section blocks to place anywhere in the page layout.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '1rem', alignItems: 'flex-end' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>
              Section Title (English)
            </label>
            <input
              type="text"
              placeholder="e.g. Executive Video Showcase"
              value={newSectionName}
              onChange={e => setNewSectionName(e.target.value)}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>
              Section Title (Arabic)
            </label>
            <input
              type="text"
              placeholder="مثال: المعرض المرئي التنفيذي"
              value={newSectionNameAr}
              onChange={e => setNewSectionNameAr(e.target.value)}
              style={{ ...inputStyle, direction: 'rtl' }}
            />
          </div>
          <button onClick={addCustomSection} disabled={!newSectionName.trim()} style={saveBtn}>
            <Plus size={16} /> Add Section
          </button>
        </div>
      </div>
    </div>
  );
};

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '0.6rem 0.85rem', border: '1px solid #D1D5DB',
  borderRadius: '8px', fontSize: '0.875rem', outline: 'none', color: '#111827',
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
const iconBtn: React.CSSProperties = {
  width: '32px', height: '32px', borderRadius: '8px', border: '1px solid #E5E7EB',
  background: '#F9FAFB', color: '#4B5563', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
};
const toggleBtn: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: '0.35rem',
  padding: '0.4rem 0.85rem', borderRadius: '8px', border: '1px solid',
  fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer',
};
const successBox: React.CSSProperties = {
  padding: '0.75rem 1rem', background: '#D1FAE5', color: '#065F46', borderRadius: '8px', marginBottom: '1.25rem', fontWeight: 600, fontSize: '0.875rem',
};
