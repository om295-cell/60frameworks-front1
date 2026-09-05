import React, { createContext, useContext, useState, ReactNode } from 'react';
import { adminApi } from './adminApi';
import { getDeviceFingerprint } from '../utils/deviceFingerprint';

export interface ModulePermissions {
  projects: {
    view: boolean;
    create: boolean;
    edit: boolean;
    media: boolean;
    delete: boolean;
    publish: boolean;
  };
  services: {
    view: boolean;
    create: boolean;
    edit: boolean;
    delete: boolean;
    publish: boolean;
  };
  sectors: {
    view: boolean;
    create: boolean;
    edit: boolean;
    media: boolean;
    delete: boolean;
  };
  clients: {
    view: boolean;
    create: boolean;
    edit: boolean;
    media: boolean;
    delete: boolean;
  };
  testimonials: {
    view: boolean;
    create: boolean;
    edit: boolean;
    media: boolean;
    delete: boolean;
  };
  homepage: {
    view: boolean;
    editHero: boolean;
    editAbout: boolean;
    editFinalCTA: boolean;
    media: boolean;
  };
  theme: {
    view: boolean;
    editPalette: boolean;
    editSections: boolean;
    editHeaderFooter: boolean;
  };
  sections: {
    view: boolean;
    toggleVisibility: boolean;
    reorder: boolean;
  };
  inbox: {
    view: boolean;
    updateStatus: boolean;
    delete: boolean;
    exportCsv: boolean;
  };
  auditLogs: {
    view: boolean;
    clear: boolean;
  };
  users: {
    view: boolean;
    manage: boolean;
  };
}

export interface UserPermissions {
  modules: ModulePermissions;
  pages?: Record<string, boolean>;
  actions?: Record<string, boolean>;
}

export interface AdminUser {
  _id?: string;
  name: string;
  email: string;
  role: 'superadmin' | 'admin' | 'editor' | 'media_manager' | 'lead_specialist' | 'viewer' | 'custom';
  isSuperAdmin: boolean;
  permissions: UserPermissions;
  loggedInAt: number;
  /** Fingerprint of the device registered on first login */
  registeredDeviceId?: string;
  /** Whether device lock is enabled for this user */
  deviceLockEnabled?: boolean;
}

export const FULL_MODULE_PERMISSIONS: ModulePermissions = {
  projects: { view: true, create: true, edit: true, media: true, delete: true, publish: true },
  services: { view: true, create: true, edit: true, delete: true, publish: true },
  sectors: { view: true, create: true, edit: true, media: true, delete: true },
  clients: { view: true, create: true, edit: true, media: true, delete: true },
  testimonials: { view: true, create: true, edit: true, media: true, delete: true },
  homepage: { view: true, editHero: true, editAbout: true, editFinalCTA: true, media: true },
  theme: { view: true, editPalette: true, editSections: true, editHeaderFooter: true },
  sections: { view: true, toggleVisibility: true, reorder: true },
  inbox: { view: true, updateStatus: true, delete: true, exportCsv: true },
  auditLogs: { view: true, clear: true },
  users: { view: true, manage: true },
};

export const READONLY_MODULE_PERMISSIONS: ModulePermissions = {
  projects: { view: true, create: false, edit: false, media: false, delete: false, publish: false },
  services: { view: true, create: false, edit: false, delete: false, publish: false },
  sectors: { view: true, create: false, edit: false, media: false, delete: false },
  clients: { view: true, create: false, edit: false, media: false, delete: false },
  testimonials: { view: true, create: false, edit: false, media: false, delete: false },
  homepage: { view: true, editHero: false, editAbout: false, editFinalCTA: false, media: false },
  theme: { view: true, editPalette: false, editSections: false, editHeaderFooter: false },
  sections: { view: true, toggleVisibility: false, reorder: false },
  inbox: { view: true, updateStatus: false, delete: false, exportCsv: false },
  auditLogs: { view: true, clear: false },
  users: { view: false, manage: false },
};

export const ROLE_PRESET_PERMISSIONS: Record<string, UserPermissions> = {
  superadmin: {
    modules: JSON.parse(JSON.stringify(FULL_MODULE_PERMISSIONS)),
    pages: {
      homepage: true, projects: true, services: true, sectors: true, clients: true,
      testimonials: true, theme: true, sections: true, inbox: true, auditLogs: true, users: true,
    },
    actions: { canEditText: true, canEditMedia: true, canEditColors: true, canDeleteItems: true, canManageUsers: true },
  },
  admin: {
    modules: {
      ...JSON.parse(JSON.stringify(FULL_MODULE_PERMISSIONS)),
      users: { view: true, manage: false },
    },
    pages: {
      homepage: true, projects: true, services: true, sectors: true, clients: true,
      testimonials: true, theme: true, sections: true, inbox: true, auditLogs: true, users: false,
    },
    actions: { canEditText: true, canEditMedia: true, canEditColors: true, canDeleteItems: true, canManageUsers: false },
  },
  editor: {
    modules: {
      ...JSON.parse(JSON.stringify(READONLY_MODULE_PERMISSIONS)),
      projects: { view: true, create: true, edit: true, media: true, delete: false, publish: false },
      services: { view: true, create: true, edit: true, delete: false, publish: false },
      sectors: { view: true, create: true, edit: true, media: true, delete: false },
      clients: { view: true, create: true, edit: true, media: true, delete: false },
      testimonials: { view: true, create: true, edit: true, media: false, delete: false },
      homepage: { view: true, editHero: true, editAbout: true, editFinalCTA: true, media: false },
      inbox: { view: true, updateStatus: true, delete: false, exportCsv: false },
      theme: { view: false, editPalette: false, editSections: false, editHeaderFooter: false },
      sections: { view: false, toggleVisibility: false, reorder: false },
      auditLogs: { view: false, clear: false },
      users: { view: false, manage: false },
    },
    pages: {
      homepage: true, projects: true, services: true, sectors: true, clients: true,
      testimonials: true, theme: false, sections: false, inbox: true, auditLogs: false, users: false,
    },
    actions: { canEditText: true, canEditMedia: true, canEditColors: false, canDeleteItems: false, canManageUsers: false },
  },
  media_manager: {
    modules: {
      ...JSON.parse(JSON.stringify(READONLY_MODULE_PERMISSIONS)),
      projects: { view: true, create: false, edit: false, media: true, delete: false, publish: false },
      sectors: { view: true, create: false, edit: false, media: true, delete: false },
      clients: { view: true, create: false, edit: false, media: true, delete: false },
      testimonials: { view: true, create: false, edit: false, media: true, delete: false },
      homepage: { view: true, editHero: false, editAbout: false, editFinalCTA: false, media: true },
      theme: { view: false, editPalette: false, editSections: false, editHeaderFooter: false },
      sections: { view: false, toggleVisibility: false, reorder: false },
      inbox: { view: false, updateStatus: false, delete: false, exportCsv: false },
      auditLogs: { view: false, clear: false },
      users: { view: false, manage: false },
    },
    pages: {
      homepage: true, projects: true, services: false, sectors: true, clients: true,
      testimonials: true, theme: false, sections: false, inbox: false, auditLogs: false, users: false,
    },
    actions: { canEditText: false, canEditMedia: true, canEditColors: false, canDeleteItems: false, canManageUsers: false },
  },
  lead_specialist: {
    modules: {
      ...JSON.parse(JSON.stringify(READONLY_MODULE_PERMISSIONS)),
      projects: { view: false, create: false, edit: false, media: false, delete: false, publish: false },
      services: { view: false, create: false, edit: false, delete: false, publish: false },
      sectors: { view: false, create: false, edit: false, media: false, delete: false },
      clients: { view: false, create: false, edit: false, media: false, delete: false },
      homepage: { view: false, editHero: false, editAbout: false, editFinalCTA: false, media: false },
      theme: { view: false, editPalette: false, editSections: false, editHeaderFooter: false },
      sections: { view: false, toggleVisibility: false, reorder: false },
      auditLogs: { view: false, clear: false },
      inbox: { view: true, updateStatus: true, delete: false, exportCsv: true },
      users: { view: false, manage: false },
    },
    pages: {
      homepage: false, projects: false, services: false, sectors: false, clients: false,
      testimonials: true, theme: false, sections: false, inbox: true, auditLogs: false, users: false,
    },
    actions: { canEditText: false, canEditMedia: false, canEditColors: false, canDeleteItems: false, canManageUsers: false },
  },
  viewer: {
    modules: JSON.parse(JSON.stringify(READONLY_MODULE_PERMISSIONS)),
    pages: {
      homepage: true, projects: true, services: true, sectors: true, clients: true,
      testimonials: true, theme: true, sections: true, inbox: true, auditLogs: true, users: false,
    },
    actions: { canEditText: false, canEditMedia: false, canEditColors: false, canDeleteItems: false, canManageUsers: false },
  },
  custom: {
    modules: JSON.parse(JSON.stringify(READONLY_MODULE_PERMISSIONS)),
  },
};

export const normalizePermissions = (perms: any, role: string = 'editor'): UserPermissions => {
  const preset = ROLE_PRESET_PERMISSIONS[role] || ROLE_PRESET_PERMISSIONS.editor;
  if (!perms) return preset;

  let modules = perms.modules;
  if (!modules) {
    modules = JSON.parse(JSON.stringify(preset.modules));
    if (perms.pages) {
      Object.keys(perms.pages).forEach(key => {
        if (modules[key]) modules[key].view = !!perms.pages[key];
      });
    }
  } else {
    // Ensure all modules are defined
    const base = JSON.parse(JSON.stringify(READONLY_MODULE_PERMISSIONS));
    modules = { ...base, ...modules };
  }

  return {
    modules,
    pages: perms.pages || preset.pages,
    actions: perms.actions || preset.actions,
  };
};

export const SUPER_ADMIN_DEFAULT_USER: AdminUser = {
  _id: 'super_admin_root',
  name: 'Master Super Admin',
  email: 'admin@60frameworks.com',
  role: 'superadmin',
  isSuperAdmin: true,
  permissions: ROLE_PRESET_PERMISSIONS.superadmin,
  loggedInAt: 0,
};

interface AdminAuthContextType {
  user: AdminUser | null;
  login: (password: string, email?: string) => Promise<{ ok: boolean; deviceBlocked?: boolean }>;
  logout: () => void;
  isAuthenticated: boolean;
  isSuperAdmin: boolean;
  canAccess: (moduleKey: keyof ModulePermissions | string) => boolean;
  hasPermission: <M extends keyof ModulePermissions, A extends keyof ModulePermissions[M]>(
    module: M,
    action: A
  ) => boolean;
  canPerform: (action: string) => boolean;
  logActivity: (action: string, category: string, target: string, details: string) => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(() => {
    try {
      const stored = localStorage.getItem('60fw_admin_session');
      if (stored) {
        const parsed = JSON.parse(stored) as AdminUser;
        if (Date.now() - parsed.loggedInAt < 8 * 60 * 60 * 1000) {
          return {
            ...parsed,
            permissions: normalizePermissions(parsed.permissions, parsed.role),
          };
        }
      }
    } catch {}
    return null;
  });

  const logActivity = (action: string, category: string, target: string, details: string) => {
    const entry = {
      _id: `log_${Date.now()}`,
      userEmail: user?.email || 'admin@60frameworks.com',
      userName: user?.name || 'Admin',
      userRole: user?.role || 'admin',
      action,
      category,
      target,
      details,
      createdAt: new Date().toISOString(),
    };

    try {
      const localLogs = JSON.parse(localStorage.getItem('60fw_audit_logs') || '[]');
      localLogs.unshift(entry);
      if (localLogs.length > 300) localLogs.pop();
      localStorage.setItem('60fw_audit_logs', JSON.stringify(localLogs));
    } catch {}

    adminApi.createLog(entry).catch(() => {});
  };

  const login = async (password: string, email?: string): Promise<{ ok: boolean; deviceBlocked?: boolean }> => {
    const cleanEmail = (email || 'admin@60frameworks.com').toLowerCase().trim();
    const deviceId = getDeviceFingerprint().toUpperCase().trim();

    // 1. Direct Super Admin Password Match — permanently exempt from device locking
    if (password === 'admin60fw2024!' && (cleanEmail === 'admin@60frameworks.com' || !email)) {
      const superUser: AdminUser = {
        ...SUPER_ADMIN_DEFAULT_USER,
        loggedInAt: Date.now(),
        deviceLockEnabled: false,
      };
      setUser(superUser);
      localStorage.setItem('60fw_admin_session', JSON.stringify(superUser));
      logActivity('SUPER_ADMIN_LOGIN', 'auth', 'Authentication', 'Master Super Admin logged in');
      return { ok: true };
    }

    // 2. Primary: Authenticate via Remote Backend API (database-backed device check)
    let apiError: any = null;
    try {
      const res = await adminApi.login(cleanEmail, password, deviceId);
      if (res && res.success && res.data) {
        const userData = res.data;

        // Client-side verification: if account is locked to a different device, deny
        if (!userData.isSuperAdmin && userData.deviceLockEnabled !== false) {
          const registered = (userData.registeredDeviceId || '').trim().toUpperCase();
          if (registered && registered !== deviceId) {
            return { ok: false, deviceBlocked: true };
          }
        }

        const loggedUser: AdminUser = {
          ...userData,
          permissions: normalizePermissions(userData.permissions, userData.role),
          loggedInAt: Date.now(),
          registeredDeviceId: userData.registeredDeviceId || deviceId,
          deviceLockEnabled: userData.deviceLockEnabled !== false,
        };
        setUser(loggedUser);
        localStorage.setItem('60fw_admin_session', JSON.stringify(loggedUser));
        logActivity('USER_LOGIN', 'auth', 'Authentication', `User ${loggedUser.name} (${loggedUser.email}) logged in [Device: ${deviceId}]`);
        return { ok: true };
      }
    } catch (err: any) {
      apiError = err;
      // If server specifically blocked this device, reject immediately!
      if (
        err?.deviceBlocked ||
        err?.message?.includes('registered device') ||
        err?.message?.includes('Access denied: Please log in from your registered device')
      ) {
        return { ok: false, deviceBlocked: true };
      }
    }

    // 3. Fallback: Check local users store only if API failed or offline
    try {
      const localUsers: any[] = JSON.parse(localStorage.getItem('60fw_users') || '[]');
      const localMatch = localUsers.find(
        u => u.email.toLowerCase() === cleanEmail && u.password === password
      );
      if (localMatch) {
        // Device lock check for local user
        if (localMatch.deviceLockEnabled !== false && !localMatch.isSuperAdmin) {
          const reg = (localMatch.registeredDeviceId || '').trim().toUpperCase();
          if (!reg) {
            // First login — register device
            localMatch.registeredDeviceId = deviceId;
            localStorage.setItem('60fw_users', JSON.stringify(localUsers));
          } else if (reg !== deviceId) {
            // Unrecognized device
            return { ok: false, deviceBlocked: true };
          }
        }

        const loggedUser: AdminUser = {
          _id: localMatch._id,
          name: localMatch.name,
          email: localMatch.email,
          role: localMatch.role || 'editor',
          isSuperAdmin: !!localMatch.isSuperAdmin,
          permissions: normalizePermissions(localMatch.permissions, localMatch.role),
          loggedInAt: Date.now(),
          registeredDeviceId: localMatch.registeredDeviceId || deviceId,
          deviceLockEnabled: localMatch.deviceLockEnabled !== false,
        };
        setUser(loggedUser);
        localStorage.setItem('60fw_admin_session', JSON.stringify(loggedUser));
        logActivity('USER_LOGIN', 'auth', 'Authentication', `User ${loggedUser.name} (${loggedUser.email}) logged in locally [Device: ${deviceId}]`);
        return { ok: true };
      }
    } catch {}

    // Check if error was due to device blockage
    if (apiError?.deviceBlocked) {
      return { ok: false, deviceBlocked: true };
    }

    return { ok: false };
  };

  const logout = () => {
    if (user) {
      logActivity('USER_LOGOUT', 'auth', 'Authentication', `User ${user.name} logged out`);
    }
    setUser(null);
    localStorage.removeItem('60fw_admin_session');
  };

  const isSuperAdmin = !!user?.isSuperAdmin || user?.role === 'superadmin';

  const canAccess = (moduleKey: keyof ModulePermissions | string): boolean => {
    if (!user) return false;
    if (isSuperAdmin) return true;

    // Check module.view
    const mod = user.permissions?.modules?.[moduleKey as keyof ModulePermissions];
    if (mod && typeof mod.view === 'boolean') {
      return mod.view;
    }

    // Fallback to legacy pages object
    if (user.permissions?.pages?.[moduleKey]) {
      return !!user.permissions.pages[moduleKey];
    }

    return false;
  };

  const hasPermission = <M extends keyof ModulePermissions, A extends keyof ModulePermissions[M]>(
    module: M,
    action: A
  ): boolean => {
    if (!user) return false;
    if (isSuperAdmin) return true;

    const mod = user.permissions?.modules?.[module];
    if (mod && mod[action] !== undefined) {
      return !!mod[action];
    }

    // Fallback legacy checks
    if (action === 'view') {
      return canAccess(module);
    }
    if (action === 'delete') {
      return !!user.permissions?.actions?.canDeleteItems;
    }
    if (action === 'media') {
      return !!user.permissions?.actions?.canEditMedia;
    }
    if (action === 'create' || action === 'edit') {
      return !!user.permissions?.actions?.canEditText;
    }

    return false;
  };

  const canPerform = (action: string): boolean => {
    if (!user) return false;
    if (isSuperAdmin) return true;
    if (user.permissions?.actions?.[action]) return true;

    // Map common legacy actions
    if (action === 'canDeleteItems') return isSuperAdmin;
    if (action === 'canEditMedia') return true;
    if (action === 'canEditText') return true;
    if (action === 'canManageUsers') return isSuperAdmin;

    return false;
  };

  return (
    <AdminAuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        isSuperAdmin,
        canAccess,
        hasPermission,
        canPerform,
        logActivity,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider');
  return ctx;
};
