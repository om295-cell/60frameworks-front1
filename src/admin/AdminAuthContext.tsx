import React, { createContext, useContext, useState, ReactNode } from 'react';
import { adminApi } from './adminApi';

export interface UserPermissions {
  pages: {
    homepage: boolean;
    projects: boolean;
    services: boolean;
    sectors: boolean;
    clients: boolean;
    testimonials: boolean;
    theme: boolean;
    sections: boolean;
    inbox: boolean;
    auditLogs: boolean;
    users: boolean;
  };
  actions: {
    canEditText: boolean;
    canEditMedia: boolean;
    canEditColors: boolean;
    canDeleteItems: boolean;
    canManageUsers: boolean;
  };
}

export interface AdminUser {
  _id?: string;
  name: string;
  email: string;
  role: 'superadmin' | 'admin' | 'editor' | 'viewer';
  isSuperAdmin: boolean;
  permissions: UserPermissions;
  loggedInAt: number;
}

export const SUPER_ADMIN_DEFAULT_USER: AdminUser = {
  _id: 'super_admin_root',
  name: 'Master Super Admin',
  email: 'admin@60frameworks.com',
  role: 'superadmin',
  isSuperAdmin: true,
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
  loggedInAt: 0,
};

interface AdminAuthContextType {
  user: AdminUser | null;
  login: (password: string, email?: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isSuperAdmin: boolean;
  canAccess: (page: keyof UserPermissions['pages']) => boolean;
  canPerform: (action: keyof UserPermissions['actions']) => boolean;
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
          return parsed;
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

  const login = async (password: string, email?: string): Promise<boolean> => {
    const cleanEmail = (email || 'admin@60frameworks.com').toLowerCase().trim();

    // 1. Direct Super Admin Password Match
    if (password === 'admin60fw2024!' && (cleanEmail === 'admin@60frameworks.com' || !email)) {
      const superUser: AdminUser = {
        ...SUPER_ADMIN_DEFAULT_USER,
        loggedInAt: Date.now(),
      };
      setUser(superUser);
      localStorage.setItem('60fw_admin_session', JSON.stringify(superUser));
      logActivity('SUPER_ADMIN_LOGIN', 'auth', 'Authentication', 'Master Super Admin logged in');
      return true;
    }

    // 2. Check local users store
    try {
      const localUsers: any[] = JSON.parse(localStorage.getItem('60fw_users') || '[]');
      const localMatch = localUsers.find(
        u => u.email.toLowerCase() === cleanEmail && u.password === password
      );
      if (localMatch) {
        const loggedUser: AdminUser = {
          _id: localMatch._id,
          name: localMatch.name,
          email: localMatch.email,
          role: localMatch.role || 'editor',
          isSuperAdmin: false,
          permissions: localMatch.permissions || SUPER_ADMIN_DEFAULT_USER.permissions,
          loggedInAt: Date.now(),
        };
        setUser(loggedUser);
        localStorage.setItem('60fw_admin_session', JSON.stringify(loggedUser));
        logActivity('USER_LOGIN', 'auth', 'Authentication', `User ${loggedUser.name} (${loggedUser.email}) logged in`);
        return true;
      }
    } catch {}

    // 3. Check Remote API
    try {
      const res = await adminApi.login(cleanEmail, password);
      if (res && res.success && res.data) {
        const loggedUser: AdminUser = {
          ...res.data,
          loggedInAt: Date.now(),
        };
        setUser(loggedUser);
        localStorage.setItem('60fw_admin_session', JSON.stringify(loggedUser));
        logActivity('USER_LOGIN', 'auth', 'Authentication', `User ${loggedUser.name} (${loggedUser.email}) logged in via API`);
        return true;
      }
    } catch {}

    return false;
  };

  const logout = () => {
    if (user) {
      logActivity('USER_LOGOUT', 'auth', 'Authentication', `User ${user.name} logged out`);
    }
    setUser(null);
    localStorage.removeItem('60fw_admin_session');
  };

  const isSuperAdmin = !!user?.isSuperAdmin || user?.role === 'superadmin';

  const canAccess = (page: keyof UserPermissions['pages']): boolean => {
    if (!user) return false;
    if (isSuperAdmin) return true;
    return !!user.permissions?.pages?.[page];
  };

  const canPerform = (action: keyof UserPermissions['actions']): boolean => {
    if (!user) return false;
    if (isSuperAdmin) return true;
    return !!user.permissions?.actions?.[action];
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
