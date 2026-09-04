import React, { useState } from 'react';
import { LogOut, Home, ShieldCheck, Activity } from 'lucide-react';
import { useAdminAuth } from './AdminAuthContext';
import { AdminLogin } from './AdminLogin';
import { HomepageEditor } from './components/HomepageEditor';
import { CrudManager } from './components/CrudManager';
import { InboxManager } from './components/InboxManager';
import { ThemeCustomizer } from './components/ThemeCustomizer';
import { SectionManager } from './components/SectionManager';
import { UserManager } from './components/UserManager';
import { AuditLogViewer } from './components/AuditLogViewer';
import { adminApi } from './adminApi';
import {
  FALLBACK_PROJECTS,
  FALLBACK_SERVICES,
  FALLBACK_SECTORS,
  FALLBACK_CLIENTS,
  FALLBACK_TESTIMONIALS,
} from '../services/api';

type Tab =
  | 'homepage'
  | 'projects'
  | 'services'
  | 'sectors'
  | 'clients'
  | 'testimonials'
  | 'theme'
  | 'sections'
  | 'inbox'
  | 'users'
  | 'auditLogs';

// Column definitions for each content type
const PROJECT_COLUMNS = [
  { key: 'title', label: 'Title (EN)', type: 'text' as const },
  { key: 'category', label: 'Category', type: 'select' as const, options: ['Summits & Conferences', 'Brand Experiences', 'Exhibitions & Booths', 'Corporate Events', 'Creative & Storytelling'] },
  { key: 'client', label: 'Client', type: 'text' as const },
  { key: 'year', label: 'Year', type: 'number' as const },
  { key: 'featured', label: 'Featured', type: 'boolean' as const },
  { key: 'order', label: 'Order', type: 'number' as const },
  { key: 'summary', label: 'Summary (EN)', type: 'textarea' as const },
  { key: 'description', label: 'Description (EN)', type: 'textarea' as const },
  { key: 'title_ar', label: 'Title (AR)', type: 'text' as const, isArabic: true },
  { key: 'category_ar', label: 'Category (AR)', type: 'text' as const, isArabic: true },
  { key: 'client_ar', label: 'Client (AR)', type: 'text' as const, isArabic: true },
  { key: 'summary_ar', label: 'Summary (AR)', type: 'textarea' as const, isArabic: true },
  { key: 'description_ar', label: 'Description (AR)', type: 'textarea' as const, isArabic: true },
  { key: 'coverImage', label: 'Cover Image', type: 'media' as const, accept: 'image' as const },
  { key: 'videoUrl', label: 'Project Video', type: 'media' as const, accept: 'video' as const },
  { key: 'galleryImages', label: 'Gallery Images (URLs)', type: 'mediaArray' as const },
];

const SERVICE_COLUMNS = [
  { key: 'title', label: 'Title (EN)', type: 'text' as const },
  { key: 'icon', label: 'Icon Name', type: 'select' as const, options: ['Compass', 'Layers', 'Sparkles', 'Box', 'Briefcase', 'Film'] },
  { key: 'order', label: 'Order', type: 'number' as const },
  { key: 'highlighted', label: 'Highlighted', type: 'boolean' as const },
  { key: 'tagline', label: 'Tagline (EN)', type: 'text' as const },
  { key: 'description', label: 'Description (EN)', type: 'textarea' as const },
  { key: 'title_ar', label: 'Title (AR)', type: 'text' as const, isArabic: true },
  { key: 'tagline_ar', label: 'Tagline (AR)', type: 'text' as const, isArabic: true },
  { key: 'description_ar', label: 'Description (AR)', type: 'textarea' as const, isArabic: true },
];

const SECTOR_COLUMNS = [
  { key: 'name', label: 'Name (EN)', type: 'text' as const },
  { key: 'icon', label: 'Icon', type: 'select' as const, options: ['Landmark', 'Building2', 'HeartPulse', 'GraduationCap', 'Building', 'Cpu', 'Utensils', 'Factory'] },
  { key: 'order', label: 'Order', type: 'number' as const },
  { key: 'description', label: 'Description (EN)', type: 'textarea' as const },
  { key: 'name_ar', label: 'Name (AR)', type: 'text' as const, isArabic: true },
  { key: 'description_ar', label: 'Description (AR)', type: 'textarea' as const, isArabic: true },
  { key: 'imageUrl', label: 'Sector Image', type: 'media' as const, accept: 'image' as const },
  { key: 'videoUrl', label: 'Sector Video', type: 'media' as const, accept: 'video' as const },
];

const CLIENT_COLUMNS = [
  { key: 'name', label: 'Name (EN)', type: 'text' as const },
  { key: 'industry', label: 'Industry (EN)', type: 'text' as const },
  { key: 'tier', label: 'Tier', type: 'select' as const, options: ['global', 'enterprise', 'featured'] },
  { key: 'order', label: 'Order', type: 'number' as const },
  { key: 'name_ar', label: 'Name (AR)', type: 'text' as const, isArabic: true },
  { key: 'industry_ar', label: 'Industry (AR)', type: 'text' as const, isArabic: true },
  { key: 'logoUrl', label: 'Logo Image', type: 'media' as const, accept: 'image' as const },
];

const TESTIMONIAL_COLUMNS = [
  { key: 'authorName', label: 'Author Name (EN)', type: 'text' as const },
  { key: 'authorRole', label: 'Author Role (EN)', type: 'text' as const },
  { key: 'organization', label: 'Organization', type: 'text' as const },
  { key: 'rating', label: 'Rating (1-5)', type: 'number' as const },
  { key: 'order', label: 'Order', type: 'number' as const },
  { key: 'quote', label: 'Quote (EN)', type: 'textarea' as const },
  { key: 'metricHighlight', label: 'Metric Highlight (EN)', type: 'text' as const },
  { key: 'authorName_ar', label: 'Author Name (AR)', type: 'text' as const, isArabic: true },
  { key: 'authorRole_ar', label: 'Author Role (AR)', type: 'text' as const, isArabic: true },
  { key: 'quote_ar', label: 'Quote (AR)', type: 'textarea' as const, isArabic: true },
  { key: 'metricHighlight_ar', label: 'Metric Highlight (AR)', type: 'text' as const, isArabic: true },
  { key: 'avatarUrl', label: 'Avatar Photo', type: 'media' as const, accept: 'image' as const },
];

// Default values for new items
const DEFAULT_PROJECT = { title: '', title_ar: '', slug: '', category: 'Summits & Conferences', category_ar: '', client: '', client_ar: '', year: new Date().getFullYear(), featured: false, order: 99, summary: '', summary_ar: '', description: '', description_ar: '', coverImage: '', videoUrl: '', galleryImages: [], metrics: [], tags: [], tags_ar: [] };
const DEFAULT_SERVICE = { title: '', title_ar: '', slug: '', icon: 'Sparkles', tagline: '', tagline_ar: '', description: '', description_ar: '', deliverables: [], deliverables_ar: [], order: 99, highlighted: false };
const DEFAULT_SECTOR = { name: '', name_ar: '', slug: '', description: '', description_ar: '', capabilities: [], capabilities_ar: [], imageUrl: '', videoUrl: '', icon: 'Building2', order: 99 };
const DEFAULT_CLIENT = { name: '', name_ar: '', logoSvg: '', logoUrl: '', industry: '', industry_ar: '', tier: 'featured', order: 99 };
const DEFAULT_TESTIMONIAL = { quote: '', quote_ar: '', authorName: '', authorName_ar: '', authorRole: '', authorRole_ar: '', organization: '', organization_ar: '', avatarUrl: '', metricHighlight: '', metricHighlight_ar: '', rating: 5, order: 99 };

interface NavSection {
  groupLabel: string;
  items: { key: Tab; label: string; emoji: string; permissionKey?: string }[];
}

const NAV_GROUPS: NavSection[] = [
  {
    groupLabel: 'Content Management',
    items: [
      { key: 'homepage', label: 'Homepage Editor', emoji: '🏠', permissionKey: 'homepage' },
      { key: 'projects', label: 'Case Studies', emoji: '🎯', permissionKey: 'projects' },
      { key: 'services', label: 'Services', emoji: '⚙️', permissionKey: 'services' },
      { key: 'sectors', label: 'Sectors', emoji: '🏭', permissionKey: 'sectors' },
      { key: 'clients', label: 'Clients', emoji: '🤝', permissionKey: 'clients' },
      { key: 'testimonials', label: 'Testimonials', emoji: '💬', permissionKey: 'testimonials' },
    ],
  },
  {
    groupLabel: 'Design & Layout',
    items: [
      { key: 'theme', label: 'Theme & Colors', emoji: '🎨', permissionKey: 'theme' },
      { key: 'sections', label: 'Section Layout', emoji: '📑', permissionKey: 'sections' },
    ],
  },
  {
    groupLabel: 'Operations',
    items: [
      { key: 'inbox', label: 'Contact Inbox', emoji: '📬', permissionKey: 'inbox' },
      { key: 'users', label: 'Team & Access', emoji: '👥', permissionKey: 'users' },
      { key: 'auditLogs', label: 'Audit Logs', emoji: '⏱️', permissionKey: 'auditLogs' },
    ],
  },
];

export const AdminPanel: React.FC = () => {
  const { isAuthenticated, user, logout, isSuperAdmin, canAccess } = useAdminAuth();
  const [activeTab, setActiveTab] = useState<Tab>('homepage');

  if (!isAuthenticated) return <AdminLogin />;

  // Find the first accessible tab for a user
  const firstAccessibleTab = (): Tab => {
    for (const group of NAV_GROUPS) {
      for (const item of group.items) {
        const pKey = item.permissionKey as any;
        if (!pKey || canAccess(pKey)) return item.key;
      }
    }
    return 'homepage';
  };

  const currentTab = canAccess(activeTab as any) ? activeTab : firstAccessibleTab();

  return (
    <div style={{ minHeight: '100vh', background: '#F3F4F6', fontFamily: "'Plus Jakarta Sans', 'Cairo', sans-serif" }}>
      {/* Top Bar */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: '#fff', borderBottom: '1px solid #E5E7EB',
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 2rem', height: '64px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <img src="/logo.png" alt="60FRAMEWORKS" style={{ height: '38px', objectFit: 'contain' }} />
          <div>
            <span style={{ fontSize: '1rem', fontWeight: 800, color: '#111827' }}>60FRAMEWORKS</span>
            <span style={{ display: 'block', fontSize: '0.625rem', fontWeight: 700, color: '#F68621', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Admin Control Panel</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <a href="/" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8125rem', color: '#6B7280', textDecoration: 'none', fontWeight: 600 }}>
            <Home size={15} /> View Site
          </a>
          <div style={{ width: '1px', height: '24px', background: '#E5E7EB' }} />

          {/* User Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {isSuperAdmin ? (
              <ShieldCheck size={16} color="#F68621" />
            ) : null}
            <div>
              <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#111827', lineHeight: 1.2 }}>{user?.name}</div>
              <div style={{ fontSize: '0.6875rem', color: '#6B7280', lineHeight: 1.2 }}>{user?.email}</div>
            </div>
          </div>

          <button
            onClick={logout}
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1rem', background: '#FEF2F2', color: '#DC2626', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '0.8125rem', cursor: 'pointer' }}
          >
            <LogOut size={15} /> Logout
          </button>
        </div>
      </header>

      <div style={{ display: 'flex', minHeight: 'calc(100vh - 64px)' }}>
        {/* Sidebar Navigation */}
        <nav style={{
          width: '230px', flexShrink: 0,
          background: '#fff', borderRight: '1px solid #E5E7EB',
          padding: '1.25rem 0.75rem',
          position: 'sticky', top: '64px', height: 'calc(100vh - 64px)', overflowY: 'auto',
        }}>
          {NAV_GROUPS.map(group => {
            const visibleItems = group.items.filter(item => {
              const pKey = item.permissionKey as any;
              return !pKey || canAccess(pKey);
            });

            if (visibleItems.length === 0) return null;

            return (
              <div key={group.groupLabel} style={{ marginBottom: '1.25rem' }}>
                <p style={{ fontSize: '0.625rem', fontWeight: 800, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.1em', padding: '0 0.75rem', marginBottom: '0.5rem' }}>
                  {group.groupLabel}
                </p>
                {visibleItems.map(({ key, label, emoji }) => (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '0.7rem',
                      width: '100%', padding: '0.65rem 0.75rem',
                      borderRadius: '10px', border: 'none', textAlign: 'left',
                      background: currentTab === key ? '#FFF3E0' : 'none',
                      color: currentTab === key ? '#F68621' : '#374151',
                      fontWeight: currentTab === key ? 700 : 600,
                      fontSize: '0.875rem', cursor: 'pointer',
                      marginBottom: '0.2rem',
                      transition: 'all 0.15s',
                    }}
                  >
                    <span style={{ fontSize: '1rem' }}>{emoji}</span>
                    {label}
                  </button>
                ))}
              </div>
            );
          })}

          {/* Role Badge at bottom */}
          <div style={{ marginTop: 'auto', padding: '0.75rem', background: isSuperAdmin ? '#FFF3E0' : '#F3F4F6', borderRadius: '10px', border: isSuperAdmin ? '1px solid #FDBA74' : '1px solid #E5E7EB' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {isSuperAdmin ? <ShieldCheck size={15} color="#F68621" /> : <Activity size={15} color="#6B7280" />}
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: isSuperAdmin ? '#C2410C' : '#374151', textTransform: 'uppercase' }}>
                {user?.role || 'Editor'}
              </span>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main style={{ flex: 1, padding: '2rem', overflowX: 'hidden' }}>
          {currentTab === 'homepage' && <HomepageEditor />}

          {currentTab === 'projects' && (
            <CrudManager
              title="Case Studies & Projects"
              emoji="🎯"
              columns={PROJECT_COLUMNS}
              fetchFn={adminApi.getProjects}
              createFn={adminApi.createProject}
              updateFn={adminApi.updateProject}
              deleteFn={adminApi.deleteProject}
              defaultItem={DEFAULT_PROJECT}
              storageKey="60fw_projects"
              fallbackData={FALLBACK_PROJECTS}
            />
          )}

          {currentTab === 'services' && (
            <CrudManager
              title="Services & Capabilities"
              emoji="⚙️"
              columns={SERVICE_COLUMNS}
              fetchFn={adminApi.getServices}
              createFn={adminApi.createService}
              updateFn={adminApi.updateService}
              deleteFn={adminApi.deleteService}
              defaultItem={DEFAULT_SERVICE}
              storageKey="60fw_services"
              fallbackData={FALLBACK_SERVICES}
            />
          )}

          {currentTab === 'sectors' && (
            <CrudManager
              title="Industry Sectors"
              emoji="🏭"
              columns={SECTOR_COLUMNS}
              fetchFn={adminApi.getSectors}
              createFn={adminApi.createSector}
              updateFn={adminApi.updateSector}
              deleteFn={adminApi.deleteSector}
              defaultItem={DEFAULT_SECTOR}
              storageKey="60fw_sectors"
              fallbackData={FALLBACK_SECTORS}
            />
          )}

          {currentTab === 'clients' && (
            <CrudManager
              title="Trusted Clients"
              emoji="🤝"
              columns={CLIENT_COLUMNS}
              fetchFn={adminApi.getClients}
              createFn={adminApi.createClient}
              updateFn={adminApi.updateClient}
              deleteFn={adminApi.deleteClient}
              defaultItem={DEFAULT_CLIENT}
              storageKey="60fw_clients"
              fallbackData={FALLBACK_CLIENTS}
            />
          )}

          {currentTab === 'testimonials' && (
            <CrudManager
              title="Testimonials"
              emoji="💬"
              columns={TESTIMONIAL_COLUMNS}
              fetchFn={adminApi.getTestimonials}
              createFn={adminApi.createTestimonial}
              updateFn={adminApi.updateTestimonial}
              deleteFn={adminApi.deleteTestimonial}
              defaultItem={DEFAULT_TESTIMONIAL}
              storageKey="60fw_testimonials"
              fallbackData={FALLBACK_TESTIMONIALS}
            />
          )}

          {currentTab === 'theme' && <ThemeCustomizer />}

          {currentTab === 'sections' && <SectionManager />}

          {currentTab === 'inbox' && <InboxManager />}

          {currentTab === 'users' && <UserManager />}

          {currentTab === 'auditLogs' && <AuditLogViewer />}
        </main>
      </div>
    </div>
  );
};
