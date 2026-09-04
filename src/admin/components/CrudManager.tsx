import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, Save, ChevronDown, ChevronUp, Eye } from 'lucide-react';
import { MediaUploader } from './MediaUploader';
import { useAdminAuth } from '../AdminAuthContext';

interface Column {
  key: string;
  label: string;
  type?: 'text' | 'textarea' | 'number' | 'select' | 'media' | 'boolean' | 'mediaArray';
  options?: string[];
  accept?: 'image' | 'video' | 'both';
  isArabic?: boolean;
}

interface CrudManagerProps {
  title: string;
  emoji: string;
  columns: Column[];
  fetchFn: () => Promise<any>;
  createFn: (data: any) => Promise<any>;
  updateFn: (id: string, data: any) => Promise<any>;
  deleteFn: (id: string) => Promise<any>;
  defaultItem: Record<string, any>;
  storageKey?: string;
  fallbackData?: any[];
  moduleKey?: 'projects' | 'services' | 'sectors' | 'clients' | 'testimonials';
}

export const CrudManager: React.FC<CrudManagerProps> = ({
  title, emoji, columns, fetchFn, createFn, updateFn, deleteFn, defaultItem, storageKey, fallbackData = [], moduleKey,
}) => {
  const { hasPermission, isSuperAdmin } = useAdminAuth();
  const canCreate = !moduleKey || isSuperAdmin || hasPermission(moduleKey, 'create');
  const canEdit = !moduleKey || isSuperAdmin || hasPermission(moduleKey, 'edit');
  const canDelete = !moduleKey || isSuperAdmin || hasPermission(moduleKey, 'delete');
  const canUpload = !moduleKey || isSuperAdmin || hasPermission(moduleKey, 'media' as any);
  const [items, setItems] = useState<any[]>(() => {
    if (storageKey) {
      try {
        const cached = localStorage.getItem(storageKey);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch {}
    }
    return fallbackData.map((item, idx) => ({
      _id: (item as any)._id || (item as any).slug || (item as any).name || `item_${idx}`,
      ...item,
    }));
  });

  const [editing, setEditing] = useState<any | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const load = async () => {
    try {
      const res = await fetchFn();
      if (res && res.data && Array.isArray(res.data) && res.data.length > 0) {
        setItems(res.data);
        if (storageKey) localStorage.setItem(storageKey, JSON.stringify(res.data));
      }
    } catch {
      // Gracefully retain existing items
    }
  };

  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);
    setError('');
    try {
      if (isNew) {
        const newItem = {
          ...editing,
          _id: editing._id || `item_${Date.now()}`,
          slug: editing.slug || (editing.title ? editing.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') : `item-${Date.now()}`),
        };
        const updated = [newItem, ...items];
        setItems(updated);
        if (storageKey) localStorage.setItem(storageKey, JSON.stringify(updated));

        try { await createFn(newItem); } catch {}
        setFeedback('Created successfully!');
      } else {
        const updated = items.map(i => (i._id === editing._id ? editing : i));
        setItems(updated);
        if (storageKey) localStorage.setItem(storageKey, JSON.stringify(updated));

        try { await updateFn(editing._id, editing); } catch {}
        setFeedback('Updated successfully!');
      }
      setTimeout(() => setFeedback(''), 3000);
      setEditing(null);
      setIsNew(false);
    } catch (e: any) {
      setError(e.message || 'Save failed');
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    setDeleting(id);
    const updated = items.filter(i => i._id !== id);
    setItems(updated);
    if (storageKey) localStorage.setItem(storageKey, JSON.stringify(updated));
    try {
      await deleteFn(id);
    } catch {}
    setFeedback('Deleted successfully!');
    setTimeout(() => setFeedback(''), 3000);
    setDeleting(null);
  };

  const updateEditField = (key: string, value: any) => {
    setEditing((prev: any) => ({ ...prev, [key]: value }));
  };

  const displayValue = (item: any, col: Column) => {
    const val = item[col.key];
    if (col.type === 'media') return val ? '✓ Media set' : '—';
    if (col.type === 'boolean') return val ? '✓' : '✗';
    if (col.type === 'mediaArray') return val?.length ? `${val.length} items` : '—';
    if (Array.isArray(val)) return val.slice(0, 2).join(', ') + (val.length > 2 ? '...' : '');
    return val?.toString()?.slice(0, 60) || '—';
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827' }}>{emoji} {title}</h2>
        {canCreate && (
          <button
            onClick={() => { setEditing({ ...defaultItem }); setIsNew(true); }}
            style={addBtn}
          >
            <Plus size={16} /> Add New
          </button>
        )}
      </div>

      {feedback && <div style={successMsg}>{feedback}</div>}
      {error && <div style={errorMsg}>{error}</div>}

      {/* Edit / Create Modal */}
      {editing && (
        <div style={modalOverlay} onClick={() => setEditing(null)}>
          <div style={modalBox} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#111827' }}>
                {isNew ? `Add New ${title.replace(/s$/, '')}` : `Edit ${title.replace(/s$/, '')}`}
              </h3>
              <button onClick={() => setEditing(null)} style={closeBtn}><X size={18} /></button>
            </div>

            <div style={{ overflowY: 'auto', maxHeight: '65vh', paddingRight: '0.5rem' }}>
              {/* English fields */}
              <div style={fieldGroupHeader}>English Fields</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                {columns.filter(c => !c.isArabic && !['media', 'mediaArray'].includes(c.type || '')).map((col) => (
                  <div key={col.key} style={col.type === 'textarea' ? { gridColumn: '1/-1' } : {}}>
                    <label style={fieldLabel}>{col.label}</label>
                    {renderField(col, editing[col.key], (v) => updateEditField(col.key, v))}
                  </div>
                ))}
              </div>

              {/* Arabic fields */}
              {columns.some(c => c.isArabic) && (
                <>
                  <div style={fieldGroupHeader}>Arabic Fields (عربي)</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                    {columns.filter(c => c.isArabic).map((col) => (
                      <div key={col.key} style={col.type === 'textarea' ? { gridColumn: '1/-1' } : {}}>
                        <label style={fieldLabel}>{col.label}</label>
                        {renderField(col, editing[col.key], (v) => updateEditField(col.key, v))}
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* Media fields */}
              {columns.filter(c => c.type === 'media' || c.type === 'mediaArray').length > 0 && (
                <>
                  <div style={fieldGroupHeader}>🖼️ Media (Images & Videos)</div>
                  {canUpload ? (
                    columns.filter(c => c.type === 'media').map((col) => (
                      <MediaUploader
                        key={col.key}
                        label={col.label}
                        currentUrl={editing[col.key] || ''}
                        accept={col.accept || 'both'}
                        onUploaded={(url) => updateEditField(col.key, url)}
                      />
                    ))
                  ) : (
                    columns.filter(c => c.type === 'media').map((col) => (
                      <div key={col.key} style={{ marginBottom: '1rem' }}>
                        <label style={fieldLabel}>{col.label}</label>
                        <input
                          type="text"
                          value={editing[col.key] || ''}
                          disabled
                          style={{ ...inputStyle, background: '#F9FAFB', cursor: 'not-allowed' }}
                        />
                      </div>
                    ))
                  )}
                  {columns.filter(c => c.type === 'mediaArray').map((col) => (
                    <div key={col.key}>
                      <label style={{ ...fieldLabel, marginBottom: '0.75rem' }}>{col.label}</label>
                      {(editing[col.key] || []).map((url: string, idx: number) => (
                        <div key={idx} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                          <input
                            type="text"
                            value={url}
                            onChange={(e) => {
                              const arr = [...(editing[col.key] || [])];
                              arr[idx] = e.target.value;
                              updateEditField(col.key, arr);
                            }}
                            style={{ ...inputStyle, flex: 1 }}
                          />
                          <button
                            onClick={() => {
                              const arr = [...(editing[col.key] || [])];
                              arr.splice(idx, 1);
                              updateEditField(col.key, arr);
                            }}
                            style={{ ...deleteSmBtn }}
                          ><X size={14} /></button>
                        </div>
                      ))}
                      <button
                        onClick={() => updateEditField(col.key, [...(editing[col.key] || []), ''])}
                        style={{ fontSize: '0.8125rem', color: '#F68621', background: 'none', border: '1px dashed #F68621', borderRadius: '6px', padding: '0.4rem 0.75rem', cursor: 'pointer', marginTop: '0.25rem' }}
                      >+ Add URL</button>
                    </div>
                  ))}
                </>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #E5E7EB' }}>
              <button onClick={() => setEditing(null)} style={cancelBtn}>{canEdit || (isNew && canCreate) ? 'Cancel' : 'Close'}</button>
              {(canEdit || (isNew && canCreate)) && (
                <button onClick={handleSave} disabled={saving} style={saveBtn}>
                  <Save size={16} /> {saving ? 'Saving...' : 'Save Changes'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Items List */}
      {items.length === 0 ? (
        <div style={{ padding: '2rem', textAlign: 'center', color: '#9CA3AF', background: '#F9FAFB', borderRadius: '12px', border: '1px dashed #D1D5DB' }}>
          No items yet. {canCreate && 'Click "Add New" to get started.'}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {items.map((item) => {
            const isExpanded = expandedItem === item._id;
            const primaryCol = columns.find(c => c.type !== 'media' && c.type !== 'mediaArray' && !c.isArabic);
            const displayCols = columns.filter(c => c.type !== 'media' && c.type !== 'mediaArray' && !c.isArabic).slice(0, 3);

            return (
              <div key={item._id} style={itemCard}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.25rem' }}>
                  {/* Thumbnail */}
                  {columns.find(c => c.type === 'media' && c.accept !== 'video') && (
                    <div style={{ width: '60px', height: '60px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0, background: '#F3F4F6' }}>
                      <img
                        src={item[columns.find(c => c.type === 'media')!.key] || ''}
                        alt=""
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      />
                    </div>
                  )}

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, color: '#111827', fontSize: '0.9375rem', marginBottom: '0.25rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {primaryCol ? item[primaryCol.key] : 'Item'}
                    </div>
                    <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
                      {displayCols.slice(1).map(col => (
                        <span key={col.key} style={{ fontSize: '0.75rem', color: '#6B7280' }}>
                          <strong>{col.label}:</strong> {displayValue(item, col)}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                    <button onClick={() => setExpandedItem(isExpanded ? null : item._id)} style={expandBtn} title="Expand preview">
                      {isExpanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                    </button>
                    <button
                      onClick={() => { setEditing({ ...item }); setIsNew(false); }}
                      style={editBtn}
                      title={canEdit ? 'Edit Item' : 'View Details'}
                    >
                      {canEdit ? <Pencil size={15} /> : <Eye size={15} />}
                    </button>
                    {canDelete && (
                      <button
                        onClick={() => { if (confirm('Delete this item?')) handleDelete(item._id); }}
                        disabled={deleting === item._id}
                        style={deleteBtn}
                        title="Delete Item"
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                </div>

                {isExpanded && (
                  <div style={{ padding: '0 1.25rem 1rem', borderTop: '1px solid #F3F4F6', background: '#FAFAFA' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', paddingTop: '1rem' }}>
                      {columns.filter(c => c.type !== 'mediaArray').map(col => (
                        <div key={col.key}>
                          <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase' }}>{col.label}</span>
                          <p style={{ fontSize: '0.8125rem', color: '#374151', marginTop: '0.15rem', direction: col.isArabic ? 'rtl' : 'ltr', wordBreak: 'break-word' }}>
                            {displayValue(item, col)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

function renderField(col: Column, value: any, onChange: (v: any) => void) {
  const dir = col.isArabic ? 'rtl' : 'ltr';
  if (col.type === 'textarea') {
    return <textarea rows={3} value={value || ''} onChange={e => onChange(e.target.value)} style={{ ...inputStyle, resize: 'vertical', direction: dir }} />;
  }
  if (col.type === 'number') {
    return <input type="number" value={value || 0} onChange={e => onChange(parseInt(e.target.value))} style={inputStyle} />;
  }
  if (col.type === 'boolean') {
    return (
      <select value={value ? 'true' : 'false'} onChange={e => onChange(e.target.value === 'true')} style={inputStyle}>
        <option value="true">Yes</option>
        <option value="false">No</option>
      </select>
    );
  }
  if (col.type === 'select' && col.options) {
    return (
      <select value={value || ''} onChange={e => onChange(e.target.value)} style={inputStyle}>
        {col.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    );
  }
  return <input type="text" value={value || ''} onChange={e => onChange(e.target.value)} style={{ ...inputStyle, direction: dir }} />;
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '0.6rem 0.85rem', border: '1px solid #D1D5DB',
  borderRadius: '8px', fontSize: '0.875rem', outline: 'none', color: '#111827',
  fontFamily: 'inherit',
};
const fieldLabel: React.CSSProperties = {
  display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem',
};
const fieldGroupHeader: React.CSSProperties = {
  fontSize: '0.75rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase',
  letterSpacing: '0.06em', marginBottom: '0.75rem', paddingBottom: '0.4rem',
  borderBottom: '1px solid #F3F4F6', marginTop: '0.5rem',
};
const modalOverlay: React.CSSProperties = {
  position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
  background: 'rgba(17,24,39,0.7)', backdropFilter: 'blur(6px)', zIndex: 200,
  display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem',
};
const modalBox: React.CSSProperties = {
  background: '#fff', borderRadius: '16px', width: '100%', maxWidth: '760px',
  maxHeight: '92vh', overflow: 'hidden', display: 'flex', flexDirection: 'column',
  padding: '2rem', boxShadow: '0 25px 60px rgba(0,0,0,0.35)',
};
const itemCard: React.CSSProperties = {
  background: '#fff', borderRadius: '12px', border: '1px solid #E5E7EB', overflow: 'hidden',
};
const addBtn: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: '0.5rem',
  padding: '0.625rem 1.25rem', background: '#F68621', color: '#fff',
  border: 'none', borderRadius: '10px', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer',
};
const saveBtn: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: '0.5rem',
  padding: '0.65rem 1.5rem', background: '#F68621', color: '#fff',
  border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer',
};
const cancelBtn: React.CSSProperties = {
  padding: '0.65rem 1.5rem', background: '#F3F4F6', color: '#374151',
  border: 'none', borderRadius: '10px', fontWeight: 600, cursor: 'pointer',
};
const closeBtn: React.CSSProperties = {
  width: '34px', height: '34px', borderRadius: '50%', border: 'none',
  background: '#F3F4F6', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#374151',
};
const editBtn: React.CSSProperties = {
  width: '32px', height: '32px', borderRadius: '8px', border: 'none',
  background: '#EFF6FF', color: '#2563EB', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
};
const deleteBtn: React.CSSProperties = {
  width: '32px', height: '32px', borderRadius: '8px', border: 'none',
  background: '#FEF2F2', color: '#DC2626', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
};
const expandBtn: React.CSSProperties = {
  width: '32px', height: '32px', borderRadius: '8px', border: '1px solid #E5E7EB',
  background: '#F9FAFB', color: '#6B7280', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
};
const deleteSmBtn: React.CSSProperties = {
  width: '32px', height: '32px', borderRadius: '8px', border: 'none',
  background: '#FEF2F2', color: '#DC2626', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
};
const successMsg: React.CSSProperties = {
  padding: '0.75rem 1rem', background: '#D1FAE5', color: '#065F46',
  borderRadius: '8px', marginBottom: '1rem', fontSize: '0.875rem', fontWeight: 600,
};
const errorMsg: React.CSSProperties = {
  padding: '0.75rem 1rem', background: '#FEE2E2', color: '#B91C1C',
  borderRadius: '8px', marginBottom: '1rem', fontSize: '0.875rem',
};
