import React, { useState, useEffect } from 'react';
import { Mail, Eye, CheckCircle, Clock, XCircle } from 'lucide-react';
import { adminApi } from '../adminApi';

export const InboxManager: React.FC = () => {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    adminApi.getSubmissions().then((r) => {
      setSubmissions(r.data || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const setStatus = async (id: string, status: string) => {
    try {
      await adminApi.updateSubmissionStatus(id, status);
      setSubmissions(prev => prev.map(s => s._id === id ? { ...s, status } : s));
    } catch {}
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
      <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827', marginBottom: '1.25rem' }}>
        📬 Contact Submissions ({submissions.length})
      </h2>

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
                  if (sub.status === 'new') setStatus(sub._id, 'read');
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

                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {['new', 'read', 'replied', 'archived'].map(s => (
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
