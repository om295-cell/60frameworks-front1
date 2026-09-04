import React, { useState, useEffect } from 'react';
import { UserPlus, Shield, ShieldCheck, Lock, Trash2, Pencil, X, Save, Check } from 'lucide-react';
import { adminApi } from '../adminApi';
import { useAdminAuth, UserPermissions } from '../AdminAuthContext';

interface UserData {
  _id: string;
  name: string;
  email: string;
  role: 'superadmin' | 'admin' | 'editor' | 'viewer';
  isSuperAdmin?: boolean;
  isLocked?: boolean;
  permissions?: UserPermissions;
  lastLoginAt?: string;
  createdAt?: string;
}

const DEFAULT_USER_PERMISSIONS: UserPermissions = {
  pages: {
    homepage: true,
    projects: true,
    services: true,
    sectors: true,
    clients: true,
    testimonials: true,
    theme: false,
    sections: false,
    inbox: true,
    auditLogs: false,
    users: false,
  },
  actions: {
    canEditText: true,
    canEditMedia: true,
    canEditColors: false,
    canDeleteItems: false,
    canManageUsers: false,
  },
};

const DEFAULT_USERS_LIST: UserData[] = [
  {
    _id: 'super_admin_root',
    name: 'Master Super Admin',
    email: 'admin@60frameworks.com',
    role: 'superadmin',
    isSuperAdmin: true,
    isLocked: true,
    permissions: {
      pages: {
        homepage: true,
        projects: true,
        services: true,
        sectors: true,
        clients: true,
        testimonials: true,
        theme: true,
        sections: true,
        inbox: true,
        auditLogs: true,
        users: true,
      },
      actions: {
        canEditText: true,
        canEditMedia: true,
        canEditColors: true,
        canDeleteItems: true,
        canManageUsers: true,
      },
    },
  },
];

export const UserManager: React.FC = () => {
  const { isSuperAdmin, logActivity } = useAdminAuth();
  const [users, setUsers] = useState<UserData[]>(() => {
    try {
      const cached = localStorage.getItem('60fw_users');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return DEFAULT_USERS_LIST;
  });

  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');

  const loadUsers = async () => {
    try {
      const res = await adminApi.getUsers();
      if (res?.data && Array.isArray(res.data) && res.data.length > 0) {
        setUsers(res.data);
        localStorage.setItem('60fw_users', JSON.stringify(res.data));
      }
    } catch {}
  };

  useEffect(() => { loadUsers(); }, []);

  const handleCreateNew = () => {
    setEditingUser({
      name: '',
      email: '',
      role: 'editor',
      permissions: { ...DEFAULT_USER_PERMISSIONS },
    });
    setPasswordInput('');
    setIsNew(true);
  };

  const handleEdit = (u: UserData) => {
    setEditingUser({
      ...u,
      permissions: u.permissions || { ...DEFAULT_USER_PERMISSIONS },
    });
    setPasswordInput('');
    setIsNew(false);
  };

  const handleSaveUser = async () => {
    if (!editingUser.name || !editingUser.email) {
      setError('Name and Email are required.');
      return;
    }
    if (isNew && !passwordInput) {
      setError('Password is required for new users.');
      return;
    }

    setError('');
    const payload = {
      ...editingUser,
      password: passwordInput || undefined,
    };

    if (isNew) {
      const newUser: UserData = {
        _id: `user_${Date.now()}`,
        name: editingUser.name,
        email: editingUser.email.toLowerCase().trim(),
        role: editingUser.role,
        permissions: editingUser.permissions,
        isSuperAdmin: false,
        isLocked: false,
      };
      const updated = [...users, newUser];
      setUsers(updated);
      localStorage.setItem('60fw_users', JSON.stringify(updated));

      try {
        await adminApi.createUser({ ...newUser, password: passwordInput });
      } catch {}

      logActivity('USER_CREATED', 'users', 'Team & Users', `Added new user ${newUser.name} (${newUser.email}) with role ${newUser.role}`);
      setFeedback('User created successfully!');
    } else {
      const updated = users.map(u => (u._id === editingUser._id ? { ...u, ...payload } : u));
      setUsers(updated);
      localStorage.setItem('60fw_users', JSON.stringify(updated));

      try {
        await adminApi.updateUser(editingUser._id, payload);
      } catch {}

      logActivity('USER_UPDATED', 'users', 'Team & Users', `Updated permissions & role for ${editingUser.name} (${editingUser.email})`);
      setFeedback('User updated successfully!');
    }

    setTimeout(() => setFeedback(''), 3000);
    setEditingUser(null);
    setIsNew(false);
  };

  const handleDeleteUser = async (id: string, name: string) => {
    const target = users.find(u => u._id === id);
    if (target?.isSuperAdmin || target?.isLocked || target?.email === 'admin@60frameworks.com') {
      alert('Security Protection: The Super Admin account cannot be deleted!');
      return;
    }

    if (!confirm(`Are you sure you want to delete user ${name}?`)) return;

    const updated = users.filter(u => u._id !== id);
    setUsers(updated);
    localStorage.setItem('60fw_users', JSON.stringify(updated));

    try {
      await adminApi.deleteUser(id);
    } catch {}

    logActivity('USER_DELETED', 'users', 'Team & Users', `Deleted user ${name}`);
    setFeedback(`User ${name} deleted successfully!`);
    setTimeout(() => setFeedback(''), 3000);
  };

  const togglePagePermission = (pageKey: keyof UserPermissions['pages']) => {
    setEditingUser((prev: any) => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        pages: {
          ...prev.permissions.pages,
          [pageKey]: !prev.permissions.pages?.[pageKey],
        },
      },
    }));
  };

  const toggleActionPermission = (actionKey: keyof UserPermissions['actions']) => {
    setEditingUser((prev: any) => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        actions: {
          ...prev.permissions.actions,
          [actionKey]: !prev.permissions.actions?.[actionKey],
        },
      },
    }));
  };

  if (!isSuperAdmin) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center', background: '#fff', borderRadius: '12px', border: '1px solid #E5E7EB' }}>
        <Shield size={42} color="#9CA3AF" style={{ margin: '0 auto 1rem auto' }} />
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827', marginBottom: '0.5rem' }}>Access Restricted</h3>
        <p style={{ fontSize: '0.875rem', color: '#6B7280' }}>
          Only the Master Super Admin is authorized to manage team members and access control.
        </p>
      </div>
    );
  }

  const PAGES_MAP: { key: keyof UserPermissions['pages']; label: string }[] = [
    { key: 'homepage', label: 'Homepage Content Editor' },
    { key: 'projects', label: 'Case Studies & Projects' },
    { key: 'services', label: 'Services & Capabilities' },
    { key: 'sectors', label: 'Industry Sectors' },
    { key: 'clients', label: 'Trusted Clients' },
    { key: 'testimonials', label: 'Testimonials' },
    { key: 'theme', label: 'Theme & Color Customizer' },
    { key: 'sections', label: 'Section & Layout Manager' },
    { key: 'inbox', label: 'Contact Submissions Inbox' },
    { key: 'auditLogs', label: 'Audit Activity Logs' },
  ];

  const ACTIONS_MAP: { key: keyof UserPermissions['actions']; label: string }[] = [
    { key: 'canEditText', label: 'Edit & Modify Text' },
    { key: 'canEditMedia', label: 'Upload & Edit Media (Images / Videos)' },
    { key: 'canEditColors', label: 'Edit Header, Footer & Section Colors' },
    { key: 'canDeleteItems', label: 'Delete Records / Items' },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827' }}>👥 Team & Access Control (RBAC)</h2>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280', marginTop: '0.2rem' }}>
            Add sub-admins, editors, or auditors with granular page & sub-part permissions. Super admin is permanently protected.
          </p>
        </div>
        <button onClick={handleCreateNew} style={addBtn}>
          <UserPlus size={16} /> Add Team Member
        </button>
      </div>

      {feedback && <div style={successBox}>{feedback}</div>}
      {error && <div style={errorBox}>{error}</div>}

      {/* Users List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
        {users.map(u => {
          const isMaster = u.isSuperAdmin || u.email === 'admin@60frameworks.com';
          return (
            <div
              key={u._id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1.25rem 1.5rem',
                background: '#fff',
                borderRadius: '12px',
                border: isMaster ? '2px solid #FDBA74' : '1px solid #E5E7EB',
                boxShadow: isMaster ? '0 4px 12px rgba(246,134,33,0.08)' : 'none',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '50%',
                    background: isMaster ? '#FFF3E0' : '#F3F4F6',
                    color: isMaster ? '#F68621' : '#4B5563',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '1.125rem',
                  }}
                >
                  {isMaster ? <ShieldCheck size={22} color="#F68621" /> : u.name[0]?.toUpperCase() || 'U'}
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontWeight: 800, color: '#111827', fontSize: '1rem' }}>{u.name}</span>
                    {isMaster ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', padding: '0.2rem 0.6rem', background: '#FFF3E0', color: '#C2410C', borderRadius: '20px', fontSize: '0.6875rem', fontWeight: 800, letterSpacing: '0.04em' }}>
                        <Lock size={11} /> ROOT SUPER ADMIN
                      </span>
                    ) : (
                      <span style={{ padding: '0.2rem 0.6rem', background: '#F3F4F6', color: '#4B5563', borderRadius: '20px', fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase' }}>
                        {u.role}
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: '#6B7280', marginTop: '0.2rem' }}>
                    {u.email}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button onClick={() => handleEdit(u)} style={editBtn} title="Edit User & Permissions">
                  <Pencil size={15} /> Edit
                </button>
                {!isMaster && (
                  <button onClick={() => handleDeleteUser(u._id, u.name)} style={deleteBtn} title="Delete User">
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit / Create User Modal */}
      {editingUser && (
        <div style={modalOverlay} onClick={() => setEditingUser(null)}>
          <div style={modalBox} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#111827' }}>
                {isNew ? 'Add Team Member' : `Edit User: ${editingUser.name}`}
              </h3>
              <button onClick={() => setEditingUser(null)} style={closeBtn}><X size={18} /></button>
            </div>

            <div style={{ overflowY: 'auto', maxHeight: '68vh', paddingRight: '0.5rem' }}>
              {/* Basic info */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                <div>
                  <label style={fieldLabel}>Full Name</label>
                  <input
                    type="text"
                    value={editingUser.name || ''}
                    onChange={e => setEditingUser({ ...editingUser, name: e.target.value })}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={fieldLabel}>Email Address</label>
                  <input
                    type="email"
                    value={editingUser.email || ''}
                    disabled={editingUser.isSuperAdmin}
                    onChange={e => setEditingUser({ ...editingUser, email: e.target.value })}
                    style={{ ...inputStyle, background: editingUser.isSuperAdmin ? '#F3F4F6' : '#fff' }}
                  />
                </div>
                <div>
                  <label style={fieldLabel}>
                    {isNew ? 'Password' : 'Change Password (leave empty to keep)'}
                  </label>
                  <input
                    type="password"
                    placeholder={isNew ? 'Enter password' : 'New password'}
                    value={passwordInput}
                    onChange={e => setPasswordInput(e.target.value)}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={fieldLabel}>Assigned Role</label>
                  <select
                    value={editingUser.role}
                    disabled={editingUser.isSuperAdmin}
                    onChange={e => setEditingUser({ ...editingUser, role: e.target.value })}
                    style={inputStyle}
                  >
                    {editingUser.isSuperAdmin && <option value="superadmin">Super Admin</option>}
                    <option value="admin">Administrator</option>
                    <option value="editor">Content Editor</option>
                    <option value="viewer">Viewer (Read Only)</option>
                  </select>
                </div>
              </div>

              {/* Granular Page Access Matrix */}
              {!editingUser.isSuperAdmin && (
                <>
                  <div style={subHeading}>📄 Page-by-Page Access Controls</div>
                  <p style={{ fontSize: '0.75rem', color: '#6B7280', marginBottom: '0.75rem' }}>
                    Choose which specific pages or tabs this user is permitted to open:
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1.5rem' }}>
                    {PAGES_MAP.map(p => {
                      const enabled = !!editingUser.permissions?.pages?.[p.key];
                      return (
                        <div
                          key={p.key}
                          onClick={() => togglePagePermission(p.key)}
                          style={{
                            display: 'flex', alignItems: 'center', gap: '0.65rem',
                            padding: '0.6rem 0.85rem', borderRadius: '8px',
                            border: `1px solid ${enabled ? '#F68621' : '#E5E7EB'}`,
                            background: enabled ? '#FFF8F1' : '#FAFAFA',
                            cursor: 'pointer',
                          }}
                        >
                          <div style={{ width: '18px', height: '18px', borderRadius: '4px', background: enabled ? '#F68621' : '#fff', border: `1px solid ${enabled ? '#F68621' : '#D1D5DB'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                            {enabled && <Check size={13} />}
                          </div>
                          <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: enabled ? '#111827' : '#6B7280' }}>
                            {p.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Granular Sub-part Actions Matrix */}
                  <div style={subHeading}>🛠️ Sub-part & Action Permissions</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1rem' }}>
                    {ACTIONS_MAP.map(a => {
                      const enabled = !!editingUser.permissions?.actions?.[a.key];
                      return (
                        <div
                          key={a.key}
                          onClick={() => toggleActionPermission(a.key)}
                          style={{
                            display: 'flex', alignItems: 'center', gap: '0.65rem',
                            padding: '0.6rem 0.85rem', borderRadius: '8px',
                            border: `1px solid ${enabled ? '#2563EB' : '#E5E7EB'}`,
                            background: enabled ? '#EFF6FF' : '#FAFAFA',
                            cursor: 'pointer',
                          }}
                        >
                          <div style={{ width: '18px', height: '18px', borderRadius: '4px', background: enabled ? '#2563EB' : '#fff', border: `1px solid ${enabled ? '#2563EB' : '#D1D5DB'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                            {enabled && <Check size={13} />}
                          </div>
                          <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: enabled ? '#111827' : '#6B7280' }}>
                            {a.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #E5E7EB' }}>
              <button onClick={() => setEditingUser(null)} style={cancelBtn}>Cancel</button>
              <button onClick={handleSaveUser} style={saveBtn}>
                <Save size={16} /> Save User
              </button>
            </div>
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
const fieldLabel: React.CSSProperties = {
  display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem',
};
const subHeading: React.CSSProperties = {
  fontSize: '0.875rem', fontWeight: 700, color: '#111827',
  marginBottom: '0.35rem', paddingTop: '0.5rem', borderTop: '1px solid #F3F4F6',
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
const editBtn: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: '0.35rem',
  padding: '0.45rem 0.85rem', borderRadius: '8px', border: '1px solid #BFDBFE',
  background: '#EFF6FF', color: '#1D4ED8', cursor: 'pointer', fontWeight: 700, fontSize: '0.8125rem',
};
const deleteBtn: React.CSSProperties = {
  width: '32px', height: '32px', borderRadius: '8px', border: 'none',
  background: '#FEF2F2', color: '#DC2626', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
};
const closeBtn: React.CSSProperties = {
  width: '34px', height: '34px', borderRadius: '50%', border: 'none',
  background: '#F3F4F6', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#374151',
};
const modalOverlay: React.CSSProperties = {
  position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
  background: 'rgba(17,24,39,0.7)', backdropFilter: 'blur(6px)', zIndex: 200,
  display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem',
};
const modalBox: React.CSSProperties = {
  background: '#fff', borderRadius: '16px', width: '100%', maxWidth: '720px',
  maxHeight: '92vh', overflow: 'hidden', display: 'flex', flexDirection: 'column',
  padding: '2rem', boxShadow: '0 25px 60px rgba(0,0,0,0.35)',
};
const successBox: React.CSSProperties = {
  padding: '0.75rem 1rem', background: '#D1FAE5', color: '#065F46',
  borderRadius: '8px', marginBottom: '1rem', fontSize: '0.875rem', fontWeight: 600,
};
const errorBox: React.CSSProperties = {
  padding: '0.75rem 1rem', background: '#FEE2E2', color: '#B91C1C',
  borderRadius: '8px', marginBottom: '1rem', fontSize: '0.875rem',
};
