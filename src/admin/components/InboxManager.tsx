import React, { useState, useEffect } from 'react';
import { Mail, Eye, CheckCircle, Clock, XCircle, Download, Trash2 } from 'lucide-react';
import { adminApi } from '../adminApi';
import { useAdminAuth } from '../AdminAuthContext';

export const InboxManager: React.FC = () => {
  const { hasPermission, isSuperAdmin } = useAdminAuth();
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  const canUpdate = isSuperAdmin || hasPermission('inbox', 'updateStatus');
  const canDelete = isSuperAdmin || hasPermission('inbox', 'delete');
  const canExport = isSuperAdmin || hasPermission('inbox', 'exportCsv');

  useEffect(() => {
    adminApi.getSubmissions().then((r) => {
      setSubmissions(r.data || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const setStatus = async (id: string, status: string) => {
    if (!canUpdate) return;
    try {
      await adminApi.updateSubmissionStatus(id, status);
      setSubmissions(prev => prev.map(s => s._id === id ? { ...s, status } : s));
    } catch {}
  };

  const handleDelete = async (id: string) => {
    if (!canDelete) return;
    if (!confirm('Are you sure you want to delete this submission?')) return;
    setSubmissions(prev => prev.filter(s => s._id !== id));
  };

  const handleExportCsv = () => {
    if (!canExport || submissions.length === 0) return;
    const headers = ['Full Name', 'Email', 'Phone', 'Company', 'Service Interest', 'Budget', 'Timeline', 'Status', 'Date', 'Message'];
    const rows = submissions.map(s => [
      `"${s.fullName || ''}"`,
      `"${s.email || ''}"`,
      `"${s.phone || ''}"`,
      `"${s.company || ''}"`,
      `"${s.serviceInterest || ''}"`,
      `"${s.estimatedBudget || ''}"`,
      `"${s.timeline || ''}"`,
      `"${s.status || 'new'}"`,
      `"${new Date(s.createdAt).toISOString()}"`,
      `"${(s.message || '').replace(/"/g, '""')}"`,
    ]);
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `60frameworks_leads_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const statusBadge = (status: string) => {
    const styles: Record<string, React.CSSProperties> = {
      new: { background: '#DBEAFE', color: '#1D4ED8' },
      read: { background: '#FEF3C7', color: '#D97706' },
      replied: { background: '#D1FAE5', color: '#065F46' },
      archived: { background: '#F3F4F6', color: '#6B7280' },
    };
    const icons: Record<string, React.ReactNode> = {
      new: <Mail size={12} />, read: <Eye size={12} />,
      replied: <CheckCircle size={12} />, archived: <XCircle size={12} />,
    };
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.25rem 0.65rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, ...styles[status] || styles.new }}>
        {icons[status]} {status?.toUpperCase()}
      </span>
    );
  };

  if (loading) return <div style={{ padding: '2rem', color: '#9CA3AF', textAlign: 'center' }}>Loading submissions...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827' }}>
          📬 Contact Submissions ({submissions.length})
        </h2>
        {canExport && submissions.length > 0 && (
          <button
            onClick={handleExportCsv}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
              padding: '0.5rem 1rem', background: '#fff', border: '1px solid #D1D5DB',
              borderRadius: '8px', fontSize: '0.8125rem', fontWeight: 700, color: '#374151', cursor: 'pointer',
            }}
          >
            <Download size={14} /> Export CSV
          </button>
        )}
      </div>

      {submissions.length === 0 ? (
        <div style={{ padding: '3rem', textAlign: 'center', background: '#F9FAFB', borderRadius: '12px', border: '1px dashed #D1D5DB', color: '#9CA3AF' }}>
          No contact inquiries yet.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {submissions.map((sub) => (
            <div key={sub._id} style={{ background: '#fff', borderRadius: '12px', border: `1px solid ${sub.status === 'new' ? '#BFDBFE' : '#E5E7EB'}`, overflow: 'hidden' }}>
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.25rem', cursor: 'pointer' }}
                onClick={() => {
                  setExpanded(expanded === sub._id ? null : sub._id);
                  if (sub.status === 'new' && canUpdate) setStatus(sub._id, 'read');
                }}
              >
                <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: '#FFF3E0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F68621', flexShrink: 0, fontSize: '1.1rem', fontWeight: 800 }}>
                  {sub.fullName?.[0]?.toUpperCase() || '?'}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, color: '#111827', fontSize: '0.9375rem' }}>{sub.fullName}</div>
                  <div style={{ fontSize: '0.8125rem', color: '#6B7280' }}>{sub.company} · {sub.email}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
                  {statusBadge(sub.status || 'new')}
                  <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>
                    <Clock size={12} style={{ display: 'inline', marginRight: '3px' }} />
                    {new Date(sub.createdAt).toLocaleDateString()}
                  </span>
                  {canDelete && (
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(sub._id); }}
                      style={{ border: 'none', background: 'none', color: '#DC2626', cursor: 'pointer', padding: '0.25rem' }}
                      title="Delete Submission"
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
              </div>

              {expanded === sub._id && (
                <div style={{ padding: '1.25rem', borderTop: '1px solid #F3F4F6', background: '#FAFAFA' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                    {[
                      { label: 'Service Interest', val: sub.serviceInterest },
                      { label: 'Budget', val: sub.estimatedBudget },
                      { label: 'Timeline', val: sub.timeline },
                      { label: 'Phone', val: sub.phone },
                    ].map(({ label, val }) => val ? (
                      <div key={label}>
                        <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase' }}>{label}</span>
                        <p style={{ fontSize: '0.875rem', color: '#374151', marginTop: '0.15rem' }}>{val}</p>
                      </div>
                    ) : null)}
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase' }}>Message</span>
                    <p style={{ fontSize: '0.875rem', color: '#374151', marginTop: '0.35rem', lineHeight: 1.6, background: '#fff', padding: '0.75rem', borderRadius: '8px', border: '1px solid #E5E7EB' }}>
                      {sub.message}
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    {canUpdate && ['new', 'read', 'replied', 'archived'].map(s => (
                      <button
                        key={s}
                        onClick={() => setStatus(sub._id, s)}
                        style={{
                          padding: '0.4rem 0.85rem', borderRadius: '8px', border: '1px solid #E5E7EB',
                          background: sub.status === s ? '#F68621' : '#fff',
                          color: sub.status === s ? '#fff' : '#374151',
                          fontWeight: 600, fontSize: '0.75rem', cursor: 'pointer',
                        }}
                      >
                        Mark as {s}
                      </button>
                    ))}
                    <a href={`mailto:${sub.email}?subject=Re: ${sub.serviceInterest}`} style={{ padding: '0.4rem 0.85rem', borderRadius: '8px', border: '1px solid #2563EB', color: '#2563EB', fontWeight: 600, fontSize: '0.75rem', textDecoration: 'none' }}>
                      Reply via Email
                    </a>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
