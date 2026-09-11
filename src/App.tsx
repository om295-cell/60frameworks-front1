import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { LatestEvent } from './components/LatestEvent';
import { About } from './components/About';
import { Services } from './components/Services';
import { Clients } from './components/Clients';
import { Sectors } from './components/Sectors';
import { CaseStudies } from './components/CaseStudies';
import { WhyUs } from './components/WhyUs';
import { Testimonials } from './components/Testimonials';
import { FinalCTA } from './components/FinalCTA';
import { Footer } from './components/Footer';
import { ProjectModal } from './components/ProjectModal';
import { Toast } from './components/Toast';
import { api, FALLBACK_SERVICES, FALLBACK_SECTORS, FALLBACK_PROJECTS, FALLBACK_CLIENTS, FALLBACK_TESTIMONIALS } from './services/api';
import { Project, Service, Sector, ClientItem, Testimonial } from './types';
import { AdminAuthProvider } from './admin/AdminAuthContext';
import { AdminPanel } from './admin/AdminPanel';
import { applyTheme } from './utils/themeApplier';

const ADMIN_PATH = '/cp-admin-60fw';

export const App: React.FC = () => {
  // Check if we're on the secret admin path
  const isAdminRoute = window.location.pathname === ADMIN_PATH;

  if (isAdminRoute) {
    return (
      <AdminAuthProvider>
        <AdminPanel />
      </AdminAuthProvider>
    );
  }

  const isClientsOnly = new URLSearchParams(window.location.search).get('view') === 'clients';

  // Application Data States (synced with localStorage & REST API)
  const [services, setServices] = useState<Service[]>(() => {
    try {
      const c = localStorage.getItem('60fw_services');
      return c ? JSON.parse(c) : FALLBACK_SERVICES;
    } catch { return FALLBACK_SERVICES; }
  });
  const [sectors, setSectors] = useState<Sector[]>(() => {
    try {
      const c = localStorage.getItem('60fw_sectors');
      return c ? JSON.parse(c) : FALLBACK_SECTORS;
    } catch { return FALLBACK_SECTORS; }
  });
  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const c = localStorage.getItem('60fw_projects');
      return c ? JSON.parse(c) : FALLBACK_PROJECTS;
    } catch { return FALLBACK_PROJECTS; }
  });
  const [clients, setClients] = useState<ClientItem[]>(() => {
    try {
      const c = localStorage.getItem('60fw_clients');
      if (c) {
        const parsed = JSON.parse(c);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed.some((x: any) => x.logoUrl)) {
          return parsed;
        }
      }
      return FALLBACK_CLIENTS;
    } catch { return FALLBACK_CLIENTS; }
  });
  const [testimonials, setTestimonials] = useState<Testimonial[]>(() => {
    try {
      const c = localStorage.getItem('60fw_testimonials');
      return c ? JSON.parse(c) : FALLBACK_TESTIMONIALS;
    } catch { return FALLBACK_TESTIMONIALS; }
  });
  const [homeContent, setHomeContent] = useState<any>(() => {
    try {
      const c = localStorage.getItem('60fw_homepage_content');
      return c ? JSON.parse(c) : null;
    } catch { return null; }
  });

  // Modal & Notification States
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load data from REST API with fallback
  useEffect(() => {
    // Apply cached theme immediately (no flash)
    try {
      const cachedTheme = localStorage.getItem('60fw_theme_settings');
      if (cachedTheme) {
        applyTheme(JSON.parse(cachedTheme));
      }
    } catch { /* ignore */ }

    const loadContent = async () => {
      try {
        const [pData, sData, secData, cData, tData, hData, themeData] = await Promise.all([
          api.getProjects(),
          api.getServices(),
          api.getSectors(),
          api.getClients(),
          api.getTestimonials(),
          api.getContent(),
          api.getTheme(),
        ]);

        if (pData && pData.length > 0) {
          setProjects(pData);
          localStorage.setItem('60fw_projects', JSON.stringify(pData));
        }
        if (sData && sData.length > 0) {
          setServices(sData);
          localStorage.setItem('60fw_services', JSON.stringify(sData));
        }
        if (secData && secData.length > 0) {
          setSectors(secData);
          localStorage.setItem('60fw_sectors', JSON.stringify(secData));
        }
        if (cData && cData.length > 0) {
          setClients(cData);
          localStorage.setItem('60fw_clients', JSON.stringify(cData));
        }
        if (tData && tData.length > 0) {
          setTestimonials(tData);
          localStorage.setItem('60fw_testimonials', JSON.stringify(tData));
        }
        if (hData) {
          setHomeContent(hData);
          localStorage.setItem('60fw_homepage_content', JSON.stringify(hData));
        }
        // Apply and cache fresh theme from server
        if (themeData) {
          applyTheme(themeData);
          localStorage.setItem('60fw_theme_settings', JSON.stringify(themeData));
        }
      } catch (err) {
        console.warn('API data fetch failed, using fallback in-memory state:', err);
      }
    };

    loadContent();
  }, []);

  const WHATSAPP_BASE_URL = 'https://api.whatsapp.com/send/?phone=966553077467';

  const handleOpenContact = (initialTopic?: string) => {
    let url = WHATSAPP_BASE_URL;
    if (initialTopic) {
      const text = encodeURIComponent(`Hello 60FRAMEWORKS, I would like to inquire about: ${initialTopic}`);
      url = `https://api.whatsapp.com/send/?phone=966553077467&text=${text}`;
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleViewWork = () => {
    const el = document.getElementById('stories');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const isSectionEnabled = (id: string) => {
    try {
      const cached = localStorage.getItem('60fw_section_order');
      if (cached) {
        const parsed = JSON.parse(cached);
        const sec = parsed.find((s: any) => s.id === id);
        if (sec && sec.enabled === false) return false;
      }
    } catch {}
    return true;
  };

  if (isClientsOnly) {
    return (
      <div className="app-layout" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Header onOpenContact={() => handleOpenContact()} />
        <main style={{ flex: 1 }}>
          <Clients clients={clients} content={homeContent?.clients} />
        </main>
        <Footer onOpenContact={() => handleOpenContact()} />
      </div>
    );
  }

  return (
    <div className="app-layout" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* 1. Sticky Premium Header/Navigation */}
      <Header onOpenContact={() => handleOpenContact()} />

      {/* Main Content Sections */}
      <main style={{ flex: 1 }}>
        {/* 2. Hero */}
        <Hero
          onOpenContact={() => handleOpenContact()}
          onViewWork={handleViewWork}
          content={homeContent?.hero}
        />

        {/* 2.5 Latest Event Showcase */}
        {isSectionEnabled('latestEvent') && <LatestEvent content={homeContent?.latestEvent} />}

        {/* 3. About Us */}
        <About
          onOpenContact={() => handleOpenContact('Agency Partnership')}
          content={homeContent?.about}
        />

        {/* 4. Services */}
        <Services
          services={services}
          onSelectService={(serviceTitle) => handleOpenContact(`Service: ${serviceTitle}`)}
          content={homeContent?.services}
        />

        {/* 5. Trusted Clients */}
        <Clients clients={clients} content={homeContent?.clients} />

        {/* 6. Sectors */}
        <Sectors
          sectors={sectors}
          onOpenContact={(sectorTopic) => handleOpenContact(sectorTopic)}
          content={homeContent?.sectors}
        />

        {/* 7. Case Studies / Stories */}
        <CaseStudies
          projects={projects}
          onSelectProject={(project) => setSelectedProject(project)}
          content={homeContent?.caseStudies}
        />

        {/* 8. Why Us */}
        <WhyUs
          onOpenContact={() => handleOpenContact('Executive Inquiry')}
          content={homeContent?.whyUs}
        />

        {/* 9. Testimonials / Impact */}
        <Testimonials testimonials={testimonials} content={homeContent?.testimonials} />

        {/* 10. Final CTA */}
        <FinalCTA
          onOpenContact={() => handleOpenContact('Project Brief')}
          content={homeContent?.finalCta}
        />
      </main>

      {/* 11. Footer */}
      <Footer onOpenContact={() => handleOpenContact()} />

      {/* Interactive Modals */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onOpenContact={(topic) => handleOpenContact(topic)}
      />

      {/* Notification Toast */}
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />

      {/* Floating WhatsApp Action Button */}
      <a
        href={WHATSAPP_BASE_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          zIndex: 999,
          backgroundColor: '#25D366',
          color: '#FFFFFF',
          borderRadius: '50%',
          width: '60px',
          height: '60px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 24px rgba(37, 211, 102, 0.45)',
          transition: 'transform 0.25s ease, box-shadow 0.25s ease',
          cursor: 'pointer',
          textDecoration: 'none',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)';
          e.currentTarget.style.boxShadow = '0 12px 28px rgba(37, 211, 102, 0.6)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 8px 24px rgba(37, 211, 102, 0.45)';
        }}
      >
        <svg width="34" height="34" viewBox="0 0 24 24" fill="currentColor">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
        </svg>
      </a>
    </div>
  );
};
