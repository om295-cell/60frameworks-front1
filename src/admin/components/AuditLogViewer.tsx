import React, { useState, useEffect } from 'react';
import { Clock, Filter, RefreshCw, Search } from 'lucide-react';
import { adminApi } from '../adminApi';

interface LogEntry {
  _id: string;
  userEmail: string;
  userName: string;
  userRole: string;
  action: string;
  category: string;
  target?: string;
  details: string;
  createdAt: string;
}

export const AuditLogViewer: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>(() => {
    try {
      const cached = localStorage.getItem('60fw_audit_logs');
      if (cached) return JSON.parse(cached);
    } catch {}
    return [];
  });
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getLogs(150);
      if (res?.data && Array.isArray(res.data) && res.data.length > 0) {
        setLogs(res.data);
        localStorage.setItem('60fw_audit_logs', JSON.stringify(res.data));
      }
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetchLogs(); }, []);

  const filteredLogs = logs.filter(log => {
    const matchCat = categoryFilter === 'all' || log.category === categoryFilter;
    const matchQuery =
      !search ||
      log.userEmail?.toLowerCase().includes(search.toLowerCase()) ||
      log.userName?.toLowerCase().includes(search.toLowerCase()) ||
      log.action?.toLowerCase().includes(search.toLowerCase()) ||
      log.details?.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchQuery;
  });

  const getCategoryBadge = (cat: string) => {
    const map: Record<string, { bg: string; color: string }> = {
      auth: { bg: '#EFF6FF', color: '#1D4ED8' },
      content: { bg: '#F3F4F6', color: '#374151' },
      theme: { bg: '#FDF2F8', color: '#BE185D' },
      sections: { bg: '#FEF3C7', color: '#B45309' },
      users: { bg: '#ECFDF5', color: '#047857' },
      media: { bg: '#EDE9FE', color: '#6D28D9' },
      inbox: { bg: '#FFF7ED', color: '#C2410C' },
    };
    const s = map[cat] || { bg: '#F3F4F6', color: '#4B5563' };
    return (
      <span style={{ padding: '0.2rem 0.55rem', borderRadius: '6px', fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', background: s.bg, color: s.color }}>
        {cat}
      </span>
    );
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827' }}>⏱️ Activity & Audit Logs</h2>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280', marginTop: '0.2rem' }}>
            Comprehensive time-stamped history of all user actions, edits, color updates, and logins.
          </p>
        </div>
        <button onClick={fetchLogs} disabled={loading} style={refreshBtn}>
          <RefreshCw size={15} className={loading ? 'animate-spin' : ''} /> Refresh Logs
        </button>
      </div>

      {/* Filters Bar */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
          <Search size={16} color="#9CA3AF" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search by user, email, action or details..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ ...inputStyle, paddingLeft: '2.4rem' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Filter size={15} color="#6B7280" />
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            style={{ ...inputStyle, width: 'auto', paddingRight: '2rem' }}
          >
            <option value="all">All Categories</option>
            <option value="auth">Authentication</option>
            <option value="content">Content Updates</option>
            <option value="theme">Theme & Colors</option>
            <option value="sections">Section Layout</option>
            <option value="users">User Access</option>
            <option value="media">Media & Uploads</option>
          </select>
        </div>
      </div>

      {/* Logs Table */}
      {filteredLogs.length === 0 ? (
        <div style={{ padding: '3rem', textAlign: 'center', background: '#fff', borderRadius: '12px', border: '1px dashed #D1D5DB', color: '#9CA3AF' }}>
          No audit log records match your filter criteria.
        </div>
      ) : (
        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #E5E7EB', overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '170px 180px 110px 1fr', padding: '0.75rem 1.25rem', background: '#F9FAFB', borderBottom: '1px solid #E5E7EB', fontSize: '0.6875rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            <span>Date & Time</span>
            <span>User / Operator</span>
            <span>Category</span>
            <span>Action & Description</span>
          </div>

          <div style={{ maxHeight: '650px', overflowY: 'auto' }}>
            {filteredLogs.map(log => {
              const dateObj = new Date(log.createdAt);
              const formattedDate = dateObj.toLocaleDateString();
              const formattedTime = dateObj.toLocaleTimeString();

              return (
                <div
                  key={log._id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '170px 180px 110px 1fr',
                    padding: '0.9rem 1.25rem',
                    alignItems: 'center',
                    borderBottom: '1px solid #F3F4F6',
                    fontSize: '0.8125rem',
                  }}
                >
                  <div style={{ color: '#4B5563', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Clock size={13} color="#9CA3AF" />
                    <span>{formattedDate} {formattedTime}</span>
                  </div>

                  <div>
                    <div style={{ fontWeight: 700, color: '#111827' }}>{log.userName}</div>
                    <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>{log.userEmail}</div>
                  </div>

                  <div>
                    {getCategoryBadge(log.category)}
                  </div>

                  <div>
                    <span style={{ fontWeight: 700, color: '#111827', marginRight: '0.5rem', fontFamily: 'monospace', fontSize: '0.75rem', background: '#F3F4F6', padding: '0.15rem 0.45rem', borderRadius: '4px' }}>
                      {log.action}
                    </span>
                    <span style={{ color: '#374151' }}>{log.details}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '0.6rem 0.85rem', border: '1px solid #D1D5DB',
  borderRadius: '8px', fontSize: '0.875rem', outline: 'none', color: '#111827',
};
const refreshBtn: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: '0.4rem',
  padding: '0.55rem 1rem', background: '#fff', color: '#374151',
  border: '1px solid #E5E7EB', borderRadius: '8px', fontWeight: 600, fontSize: '0.8125rem', cursor: 'pointer',
};
