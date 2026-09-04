import React, { useState, useEffect } from 'react';
import {
  UserPlus, Shield, ShieldCheck, Lock, Trash2, Pencil, X, Save, Check,
  CheckCircle2, XCircle, Sliders
} from 'lucide-react';
import { adminApi } from '../adminApi';
import {
  useAdminAuth,
  UserPermissions,
  ModulePermissions,
  ROLE_PRESET_PERMISSIONS,
  FULL_MODULE_PERMISSIONS,
  READONLY_MODULE_PERMISSIONS,
  normalizePermissions,
} from '../AdminAuthContext';

interface UserData {
  _id: string;
  name: string;
  email: string;
  role: 'superadmin' | 'admin' | 'editor' | 'media_manager' | 'lead_specialist' | 'viewer' | 'custom';
  isSuperAdmin?: boolean;
  isLocked?: boolean;
  permissions?: UserPermissions;
  lastLoginAt?: string;
  createdAt?: string;
}

const DEFAULT_USERS_LIST: UserData[] = [
  {
    _id: 'super_admin_root',
    name: 'Master Super Admin',
    email: 'admin@60frameworks.com',
    role: 'superadmin',
    isSuperAdmin: true,
    isLocked: true,
    permissions: ROLE_PRESET_PERMISSIONS.superadmin,
  },
];

// Definition of each module and its granular actions for the UI matrix
interface ModuleDefinition {
  key: keyof ModulePermissions;
  title: string;
  icon: string;
  description: string;
  actions: { key: string; label: string; desc: string; danger?: boolean }[];
}

const MODULE_DEFINITIONS: ModuleDefinition[] = [
  {
    key: 'projects',
    title: 'Case Studies & Projects',
    icon: '🎯',
    description: 'Portfolio work, summits, corporate events & project case studies',
    actions: [
      { key: 'view', label: 'View Case Studies', desc: 'Can access and browse projects tab' },
      { key: 'create', label: 'Create New Project', desc: 'Can add new case studies' },
      { key: 'edit', label: 'Edit Project Details', desc: 'Modify title, client, year, tags, metrics' },
      { key: 'media', label: 'Upload Images & Videos', desc: 'Upload cover, gallery & project videos' },
      { key: 'publish', label: 'Toggle Featured Status', desc: 'Mark as featured on homepage' },
      { key: 'delete', label: 'Delete Case Studies', desc: 'Permanently remove projects', danger: true },
    ],
  },
  {
    key: 'services',
    title: 'Services & Capabilities',
    icon: '⚙️',
    description: 'Agency offerings, service deliverables & capability cards',
    actions: [
      { key: 'view', label: 'View Services', desc: 'Can access services manager tab' },
      { key: 'create', label: 'Add New Service', desc: 'Can add new services to agency portfolio' },
      { key: 'edit', label: 'Edit Service Text', desc: 'Modify title, tagline, descriptions & deliverables' },
      { key: 'publish', label: 'Highlight & Reorder', desc: 'Toggle highlighted badge & ordering' },
      { key: 'delete', label: 'Delete Services', desc: 'Permanently remove services', danger: true },
    ],
  },
  {
    key: 'sectors',
    title: 'Industry Sectors',
    icon: '🏭',
    description: 'Sectors of expertise, government, energy, tourism & tech',
    actions: [
      { key: 'view', label: 'View Sectors', desc: 'Can access industry sectors tab' },
      { key: 'create', label: 'Add New Sector', desc: 'Can add new sector offerings' },
      { key: 'edit', label: 'Edit Sector Content', desc: 'Modify descriptions & capabilities' },
      { key: 'media', label: 'Upload Media', desc: 'Upload sector showcase images & background video' },
      { key: 'delete', label: 'Delete Sectors', desc: 'Permanently remove sectors', danger: true },
    ],
  },
  {
    key: 'clients',
    title: 'Clients & Partners',
    icon: '🤝',
    description: 'Client roster, brand wordmarks & partner logos',
    actions: [
      { key: 'view', label: 'View Clients', desc: 'Can access client roster tab' },
      { key: 'create', label: 'Add Client', desc: 'Add new client brand' },
      { key: 'edit', label: 'Edit Client Details', desc: 'Modify brand name, tier & industry' },
      { key: 'media', label: 'Upload Logos / SVGs', desc: 'Upload brand logo images or raw SVG' },
      { key: 'delete', label: 'Delete Clients', desc: 'Permanently remove clients', danger: true },
    ],
  },
  {
    key: 'testimonials',
    title: 'Client Testimonials',
    icon: '💬',
    description: 'Client quotes, partner feedback, ratings & author avatars',
    actions: [
      { key: 'view', label: 'View Testimonials', desc: 'Can access testimonials manager' },
      { key: 'create', label: 'Add Testimonial', desc: 'Add new customer quote' },
      { key: 'edit', label: 'Edit Quote & Author', desc: 'Modify quote text, role, metric & rating' },
      { key: 'media', label: 'Upload Avatar Image', desc: 'Upload author profile photo' },
      { key: 'delete', label: 'Delete Testimonial', desc: 'Permanently remove testimonial', danger: true },
    ],
  },
  {
    key: 'homepage',
    title: 'Homepage Specific Content',
    icon: '🏠',
    description: 'Hero banner, About Us story, pillars, stats & final CTA banner',
    actions: [
      { key: 'view', label: 'View Homepage Editor', desc: 'Can open homepage content editor' },
      { key: 'editHero', label: 'Edit Hero Section', desc: 'Headline, subtitle, CTAs & trust highlights' },
      { key: 'editAbout', label: 'Edit About Us Section', desc: 'Story narrative, strategic pillars & stat metrics' },
      { key: 'editFinalCTA', label: 'Edit Final CTA Banner', desc: 'Closing headline, button text & WhatsApp prompt' },
      { key: 'media', label: 'Upload Hero / About Media', desc: 'Upload hero video or about showcase media' },
    ],
  },
  {
    key: 'theme',
    title: 'Theme & Color Customizer',
    icon: '🎨',
    description: 'Section backgrounds, text colors, subtitles, cards & brand palette',
    actions: [
      { key: 'view', label: 'View Theme Studio', desc: 'Can open theme & color customizer' },
      { key: 'editPalette', label: 'Edit Global Brand Palette', desc: 'Modify primary orange & charcoal tokens' },
      { key: 'editSections', label: 'Edit Section Themes', desc: 'Customize per-section background, headings & cards' },
      { key: 'editHeaderFooter', label: 'Edit Header & Footer', desc: 'Modify navigation & footer bar appearance' },
    ],
  },
  {
    key: 'sections',
    title: 'Section Layout Manager',
    icon: '📑',
    description: 'Homepage section order and live section visibility',
    actions: [
      { key: 'view', label: 'View Section Layout', desc: 'Can open section layout manager' },
      { key: 'toggleVisibility', label: 'Toggle Section Visibility', desc: 'Show or hide sections on live website' },
      { key: 'reorder', label: 'Reorder Section Sequence', desc: 'Drag or move homepage sections sequence' },
    ],
  },
  {
    key: 'inbox',
    title: 'Contact Submissions & Leads',
    icon: '📬',
    description: 'Inquiries submitted through the website & WhatsApp leads',
    actions: [
      { key: 'view', label: 'View Inquiries', desc: 'Can open contact inbox & read messages' },
      { key: 'updateStatus', label: 'Update Status & Notes', desc: 'Mark messages as Read, Replied, or Archived' },
      { key: 'exportCsv', label: 'Export Leads to CSV', desc: 'Download CSV file of all client inquiries' },
      { key: 'delete', label: 'Delete Messages', desc: 'Permanently remove contact inquiries', danger: true },
    ],
  },
  {
    key: 'auditLogs',
    title: 'Audit Activity Logs',
    icon: '⏱️',
    description: 'Security records of all admin actions and user modifications',
    actions: [
      { key: 'view', label: 'View Audit Logs', desc: 'Can view administrative audit trail' },
      { key: 'clear', label: 'Clear Audit History', desc: 'Flush audit trail entries', danger: true },
    ],
  },
  {
    key: 'users',
    title: 'Team & Permissions Control',
    icon: '👥',
    description: 'Manage administrative team members and fine-grained permissions',
    actions: [
      { key: 'view', label: 'View Team List', desc: 'Can view team members list' },
      { key: 'manage', label: 'Manage Roles & Access', desc: 'Create, edit & delete team members', danger: true },
    ],
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
        const normalized = res.data.map((u: any) => ({
          ...u,
          permissions: normalizePermissions(u.permissions, u.role),
        }));
        setUsers(normalized);
        localStorage.setItem('60fw_users', JSON.stringify(normalized));
      }
    } catch {}
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleCreateNew = () => {
    const defaultPerms = JSON.parse(JSON.stringify(ROLE_PRESET_PERMISSIONS.editor));
    setEditingUser({
      name: '',
      email: '',
      role: 'editor',
      permissions: defaultPerms,
    });
    setIsNew(true);
    setPasswordInput('');
    setError('');
  };

  const handleEdit = (u: UserData) => {
    const normalized = normalizePermissions(u.permissions, u.role);
    setEditingUser({
      ...u,
      permissions: JSON.parse(JSON.stringify(normalized)),
    });
    setIsNew(false);
    setPasswordInput('');
    setError('');
  };

  const handleApplyRolePreset = (role: string) => {
    if (!editingUser) return;
    const preset = ROLE_PRESET_PERMISSIONS[role] || ROLE_PRESET_PERMISSIONS.editor;
    setEditingUser((prev: any) => ({
      ...prev,
      role,
      permissions: JSON.parse(JSON.stringify(preset)),
    }));
  };

  const togglePermission = (moduleKey: keyof ModulePermissions, actionKey: string) => {
    if (!editingUser) return;
    setEditingUser((prev: any) => {
      const currentMod = prev.permissions?.modules?.[moduleKey] || {};
      const currentVal = !!currentMod[actionKey];
      const updatedMod = {
        ...currentMod,
        [actionKey]: !currentVal,
      };

      // If user enables any action, auto-enable 'view' for that module
      if (!currentVal && actionKey !== 'view') {
        updatedMod.view = true;
      }

      return {
        ...prev,
        role: prev.isSuperAdmin ? 'superadmin' : 'custom',
        permissions: {
          ...prev.permissions,
          modules: {
            ...prev.permissions.modules,
            [moduleKey]: updatedMod,
          },
        },
      };
    });
  };

  const setModuleAll = (moduleKey: keyof ModulePermissions, enable: boolean) => {
    if (!editingUser) return;
    setEditingUser((prev: any) => {
      const def = MODULE_DEFINITIONS.find(m => m.key === moduleKey);
      if (!def) return prev;
      const updatedMod: any = {};
      def.actions.forEach(a => {
        updatedMod[a.key] = enable;
      });

      return {
        ...prev,
        role: prev.isSuperAdmin ? 'superadmin' : 'custom',
        permissions: {
          ...prev.permissions,
          modules: {
            ...prev.permissions.modules,
            [moduleKey]: updatedMod,
          },
        },
      };
    });
  };

  const setGlobalAll = (enable: boolean) => {
    if (!editingUser) return;
    setEditingUser((prev: any) => {
      const targetModules = enable
        ? JSON.parse(JSON.stringify(FULL_MODULE_PERMISSIONS))
        : JSON.parse(JSON.stringify(READONLY_MODULE_PERMISSIONS));

      // Never give non-superadmin full users.manage permission by accident
      if (enable && !prev.isSuperAdmin) {
        targetModules.users.manage = false;
      }

      return {
        ...prev,
        role: prev.isSuperAdmin ? 'superadmin' : enable ? 'admin' : 'viewer',
        permissions: {
          ...prev.permissions,
          modules: targetModules,
        },
      };
    });
  };

  const handleSaveUser = async () => {
    setError('');
    if (!editingUser.name?.trim()) {
      setError('Name is required');
      return;
    }
    if (!editingUser.email?.trim()) {
      setError('Email is required');
      return;
    }
    if (isNew && !passwordInput) {
      setError('Password is required for new team members');
      return;
    }

    try {
      if (isNew) {
        const payload = {
          name: editingUser.name.trim(),
          email: editingUser.email.toLowerCase().trim(),
          password: passwordInput,
          role: editingUser.role || 'editor',
          permissions: editingUser.permissions,
        };

        const res = await adminApi.createUser(payload);
        const newUser: UserData = res?.data || {
          _id: `user_${Date.now()}`,
          ...payload,
        };

        const updated = [...users, newUser];
        setUsers(updated);
        localStorage.setItem('60fw_users', JSON.stringify(updated));

        logActivity('USER_CREATED', 'users', 'Team & Access', `Created team member ${payload.name} (${payload.email}) with role ${payload.role}`);
        setFeedback(`Team member ${payload.name} created successfully!`);
      } else {
        const payload: any = {
          name: editingUser.name.trim(),
          email: editingUser.email.toLowerCase().trim(),
          role: editingUser.role,
          permissions: editingUser.permissions,
        };
        if (passwordInput) payload.password = passwordInput;

        await adminApi.updateUser(editingUser._id, payload);

        const updated = users.map(u => (u._id === editingUser._id ? { ...u, ...payload } : u));
        setUsers(updated);
        localStorage.setItem('60fw_users', JSON.stringify(updated));

        logActivity('USER_UPDATED', 'users', 'Team & Access', `Updated permissions & role for ${editingUser.name} (${editingUser.email})`);
        setFeedback(`Permissions for ${editingUser.name} saved successfully!`);
      }

      setEditingUser(null);
      setTimeout(() => setFeedback(''), 3500);
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || 'Failed to save team member');
    }
  };

  const handleDeleteUser = async (id: string, name: string) => {
    const target = users.find(u => u._id === id);
    if (target?.isSuperAdmin || target?.isLocked || target?.email === 'admin@60frameworks.com') {
      alert('Security Protection: The Master Super Admin account cannot be deleted!');
      return;
    }

    if (!confirm(`Are you sure you want to delete user ${name}? All access will be revoked immediately.`)) return;

    const updated = users.filter(u => u._id !== id);
    setUsers(updated);
    localStorage.setItem('60fw_users', JSON.stringify(updated));

    try {
      await adminApi.deleteUser(id);
    } catch {}

    logActivity('USER_DELETED', 'users', 'Team & Access', `Deleted team member ${name}`);
    setFeedback(`Team member ${name} deleted successfully!`);
    setTimeout(() => setFeedback(''), 3000);
  };

  if (!isSuperAdmin) {
    return (
      <div style={{ padding: '3.5rem', textAlign: 'center', background: '#fff', borderRadius: '16px', border: '1px solid #E5E7EB' }}>
        <Shield size={48} color="#F68621" style={{ margin: '0 auto 1rem auto' }} />
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827', marginBottom: '0.5rem' }}>Access Restricted</h3>
        <p style={{ fontSize: '0.875rem', color: '#6B7280', maxWidth: '420px', margin: '0 auto' }}>
          Only the Master Super Admin is authorized to inspect or modify team access controls and security permissions.
        </p>
      </div>
    );
  }

  // Helper to compute summary of permitted modules
  const getModuleSummary = (u: UserData) => {
    if (u.isSuperAdmin || u.role === 'superadmin') {
      return <span style={roleBadgeSuper}>FULL UNRESTRICTED ACCESS</span>;
    }
    const mods = u.permissions?.modules;
    if (!mods) return <span style={roleBadgeNormal}>{u.role}</span>;

    const accessibleCount = Object.keys(mods).filter(k => (mods as any)[k]?.view).length;
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
        <span style={roleBadgeNormal}>{u.role.toUpperCase()}</span>
        <span style={summaryPill}>{accessibleCount} / {MODULE_DEFINITIONS.length} Modules Active</span>
      </div>
    );
  };

  return (
    <div>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#111827' }}>👥 Team & Granular Access Control</h2>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, background: '#EFF6FF', color: '#2563EB', padding: '0.2rem 0.6rem', borderRadius: '20px' }}>
              RBAC Matrix v2
            </span>
          </div>
          <p style={{ fontSize: '0.8125rem', color: '#6B7280', marginTop: '0.25rem' }}>
            Fine-grained control over every single module: CRUD operations, media uploads, theme editing, and publish controls.
          </p>
        </div>
        <button onClick={handleCreateNew} style={addBtn}>
          <UserPlus size={16} /> Add Team Member
        </button>
      </div>

      {feedback && <div style={successBox}>{feedback}</div>}
      {error && <div style={errorBox}>{error}</div>}

      {/* Users Cards List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '2.5rem' }}>
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
                borderRadius: '14px',
                border: isMaster ? '2px solid #FDBA74' : '1px solid #E5E7EB',
                boxShadow: isMaster ? '0 4px 14px rgba(246,134,33,0.08)' : '0 1px 3px rgba(0,0,0,0.03)',
                flexWrap: 'wrap',
                gap: '1rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', minWidth: '280px' }}>
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
                  {isMaster ? <ShieldCheck size={24} color="#F68621" /> : u.name[0]?.toUpperCase() || 'U'}
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <span style={{ fontWeight: 800, color: '#111827', fontSize: '1.05rem' }}>{u.name}</span>
                    {isMaster && (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', padding: '0.2rem 0.6rem', background: '#FFF3E0', color: '#C2410C', borderRadius: '20px', fontSize: '0.6875rem', fontWeight: 800 }}>
                        <Lock size={11} /> ROOT SUPER ADMIN
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: '#6B7280', marginTop: '0.15rem' }}>
                    {u.email}
                  </div>
                </div>
              </div>

              {/* Summary of permissions */}
              <div style={{ flex: 1, minWidth: '200px' }}>
                {getModuleSummary(u)}
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button onClick={() => handleEdit(u)} style={editBtn} title="Customize Granular Permissions">
                  <Pencil size={14} /> Edit Permissions
                </button>
                {!isMaster && (
                  <button onClick={() => handleDeleteUser(u._id, u.name)} style={deleteBtn} title="Revoke & Delete">
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit / Create User Modal with Permissions Studio */}
      {editingUser && (
        <div style={modalOverlay} onClick={() => setEditingUser(null)}>
          <div style={modalBox} onClick={e => e.stopPropagation()}>
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 1.75rem', borderBottom: '1px solid #E5E7EB', background: '#FAFAFA' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#111827' }}>
                  {isNew ? '✨ Add Team Member' : `🛡️ Configure Access: ${editingUser.name}`}
                </h3>
                <p style={{ fontSize: '0.8125rem', color: '#6B7280', marginTop: '0.15rem' }}>
                  Assign a quick role template or toggle any granular permission down to the smallest detail.
                </p>
              </div>
              <button onClick={() => setEditingUser(null)} style={closeBtn}><X size={18} /></button>
            </div>

            {/* Modal Scrollable Body */}
            <div style={{ overflowY: 'auto', maxHeight: '72vh', padding: '1.5rem 1.75rem' }}>
              {/* Member Profile Inputs */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.75rem', background: '#fff', padding: '1.25rem', borderRadius: '12px', border: '1px solid #E5E7EB' }}>
                <div>
                  <label style={fieldLabel}>Full Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Sarah Al-Otaibi"
                    value={editingUser.name || ''}
                    onChange={e => setEditingUser({ ...editingUser, name: e.target.value })}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={fieldLabel}>Email Address *</label>
                  <input
                    type="email"
                    placeholder="user@60frameworks.com"
                    value={editingUser.email || ''}
                    disabled={editingUser.isSuperAdmin}
                    onChange={e => setEditingUser({ ...editingUser, email: e.target.value })}
                    style={{ ...inputStyle, background: editingUser.isSuperAdmin ? '#F3F4F6' : '#fff' }}
                  />
                </div>
                <div>
                  <label style={fieldLabel}>
                    {isNew ? 'Login Password *' : 'Update Password (leave blank to keep current)'}
                  </label>
                  <input
                    type="password"
                    placeholder={isNew ? 'Create strong password' : 'Enter new password'}
                    value={passwordInput}
                    onChange={e => setPasswordInput(e.target.value)}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={fieldLabel}>Quick Role Preset</label>
                  <select
                    value={editingUser.role}
                    disabled={editingUser.isSuperAdmin}
                    onChange={e => handleApplyRolePreset(e.target.value)}
                    style={inputStyle}
                  >
                    {editingUser.isSuperAdmin && <option value="superadmin">👑 Super Admin (Immutable)</option>}
                    <option value="admin">🛡️ Administrator (Full Control)</option>
                    <option value="editor">✍️ Content Editor (Copy & Projects)</option>
                    <option value="media_manager">🎬 Media & Creative Manager (Media Uploads)</option>
                    <option value="lead_specialist">📬 CRM / Lead Specialist (Inbox & Leads)</option>
                    <option value="viewer">👁️ Read-Only Viewer (Auditor)</option>
                    <option value="custom">⚙️ Custom Granular Profile</option>
                  </select>
                </div>
              </div>

              {/* Granular Permission Matrix Studio */}
              {!editingUser.isSuperAdmin && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                    <div>
                      <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#111827', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Sliders size={18} color="#F68621" /> Granular Permissions Matrix
                      </div>
                      <p style={{ fontSize: '0.8125rem', color: '#6B7280', marginTop: '0.15rem' }}>
                        Click any action pill to grant or revoke it independently.
                      </p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <button type="button" onClick={() => setGlobalAll(true)} style={quickBatchBtn}>
                        <CheckCircle2 size={14} color="#16A34A" /> Grant All
                      </button>
                      <button type="button" onClick={() => setGlobalAll(false)} style={quickBatchBtn}>
                        <XCircle size={14} color="#DC2626" /> Read Only
                      </button>
                    </div>
                  </div>

                  {/* Module Cards Grid */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {MODULE_DEFINITIONS.map(mod => {
                      const modPerms = editingUser.permissions?.modules?.[mod.key] || {};
                      const isModViewEnabled = !!modPerms.view;

                      return (
                        <div
                          key={mod.key}
                          style={{
                            background: isModViewEnabled ? '#fff' : '#FAFAFA',
                            borderRadius: '12px',
                            border: `1px solid ${isModViewEnabled ? '#E5E7EB' : '#F3F4F6'}`,
                            padding: '1.15rem 1.35rem',
                            opacity: isModViewEnabled ? 1 : 0.65,
                            transition: 'all 0.15s ease',
                          }}
                        >
                          {/* Module Card Top Bar */}
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                              <span style={{ fontSize: '1.3rem' }}>{mod.icon}</span>
                              <div>
                                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#111827' }}>
                                  {mod.title}
                                </div>
                                <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>
                                  {mod.description}
                                </div>
                              </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                              <button
                                type="button"
                                onClick={() => setModuleAll(mod.key, true)}
                                style={moduleMiniBtn}
                                title="Grant all permissions in this module"
                              >
                                All ON
                              </button>
                              <button
                                type="button"
                                onClick={() => setModuleAll(mod.key, false)}
                                style={moduleMiniBtn}
                                title="Revoke all permissions in this module"
                              >
                                OFF
                              </button>
                            </div>
                          </div>

                          {/* Action Toggle Pills */}
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                            {mod.actions.map(action => {
                              const isGranted = !!modPerms[action.key];
                              const isDanger = action.danger;

                              return (
                                <button
                                  type="button"
                                  key={action.key}
                                  onClick={() => togglePermission(mod.key, action.key)}
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.45rem',
                                    padding: '0.45rem 0.8rem',
                                    borderRadius: '8px',
                                    border: isGranted
                                      ? isDanger
                                        ? '1px solid #FCA5A5'
                                        : '1px solid #FDBA74'
                                      : '1px solid #E5E7EB',
                                    background: isGranted
                                      ? isDanger
                                        ? '#FEF2F2'
                                        : '#FFF8F1'
                                      : '#FFFFFF',
                                    color: isGranted
                                      ? isDanger
                                        ? '#991B1B'
                                        : '#C2410C'
                                      : '#6B7280',
                                    fontSize: '0.8125rem',
                                    fontWeight: isGranted ? 700 : 500,
                                    cursor: 'pointer',
                                    transition: 'all 0.15s ease',
                                  }}
                                  title={action.desc}
                                >
                                  <div
                                    style={{
                                      width: '15px',
                                      height: '15px',
                                      borderRadius: '3px',
                                      background: isGranted
                                        ? isDanger
                                          ? '#DC2626'
                                          : '#F68621'
                                        : '#fff',
                                      border: isGranted ? 'none' : '1px solid #D1D5DB',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      color: '#fff',
                                    }}
                                  >
                                    {isGranted && <Check size={11} strokeWidth={3} />}
                                  </div>
                                  <span>{action.label}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Action Footer */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', padding: '1.25rem 1.75rem', borderTop: '1px solid #E5E7EB', background: '#FAFAFA' }}>
              <button onClick={() => setEditingUser(null)} style={cancelBtn}>Cancel</button>
              <button onClick={handleSaveUser} style={saveBtn}>
                <Save size={16} /> Save Team Member & Permissions
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* Styles */
const inputStyle: React.CSSProperties = {
  width: '100%', padding: '0.625rem 0.85rem', border: '1px solid #D1D5DB',
  borderRadius: '8px', fontSize: '0.875rem', outline: 'none', color: '#111827',
};
const fieldLabel: React.CSSProperties = {
  display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#374151', marginBottom: '0.35rem',
};
const addBtn: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: '0.5rem',
  padding: '0.625rem 1.25rem', background: '#F68621', color: '#fff',
  border: 'none', borderRadius: '10px', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer',
};
const saveBtn: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: '0.5rem',
  padding: '0.65rem 1.6rem', background: '#F68621', color: '#fff',
  border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', fontSize: '0.875rem',
};
const cancelBtn: React.CSSProperties = {
  padding: '0.65rem 1.4rem', background: '#F3F4F6', color: '#374151',
  border: 'none', borderRadius: '10px', fontWeight: 600, cursor: 'pointer', fontSize: '0.875rem',
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
  width: '32px', height: '32px', borderRadius: '50%', border: 'none',
  background: '#F3F4F6', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#374151',
};
const quickBatchBtn: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: '0.35rem',
  padding: '0.4rem 0.75rem', background: '#fff', border: '1px solid #D1D5DB',
  borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', color: '#374151',
};
const moduleMiniBtn: React.CSSProperties = {
  padding: '0.2rem 0.5rem', background: '#F3F4F6', border: '1px solid #E5E7EB',
  borderRadius: '6px', fontSize: '0.6875rem', fontWeight: 700, cursor: 'pointer', color: '#4B5563',
};
const roleBadgeSuper: React.CSSProperties = {
  padding: '0.25rem 0.75rem', background: '#FFF3E0', color: '#C2410C',
  borderRadius: '20px', fontSize: '0.6875rem', fontWeight: 800, letterSpacing: '0.04em',
};
const roleBadgeNormal: React.CSSProperties = {
  padding: '0.25rem 0.65rem', background: '#F3F4F6', color: '#374151',
  borderRadius: '20px', fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.04em',
};
const summaryPill: React.CSSProperties = {
  padding: '0.25rem 0.65rem', background: '#EFF6FF', color: '#1E40AF',
  borderRadius: '20px', fontSize: '0.6875rem', fontWeight: 600,
};
const successBox: React.CSSProperties = {
  padding: '0.85rem 1.25rem', background: '#ECFDF5', border: '1px solid #A7F3D0',
  color: '#065F46', borderRadius: '10px', marginBottom: '1.25rem', fontSize: '0.875rem', fontWeight: 600,
};
const errorBox: React.CSSProperties = {
  padding: '0.85rem 1.25rem', background: '#FEF2F2', border: '1px solid #FECACA',
  color: '#991B1B', borderRadius: '10px', marginBottom: '1.25rem', fontSize: '0.875rem', fontWeight: 600,
};
const modalOverlay: React.CSSProperties = {
  position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
  background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center',
  justifyContent: 'center', zIndex: 9999, backdropFilter: 'blur(3px)', padding: '1rem',
};
const modalBox: React.CSSProperties = {
  background: '#fff', borderRadius: '16px', width: '100%', maxWidth: '820px',
  boxShadow: '0 20px 40px rgba(0,0,0,0.2)', overflow: 'hidden', display: 'flex', flexDirection: 'column',
};
