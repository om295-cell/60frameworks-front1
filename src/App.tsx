import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Services } from './components/Services';
import { Clients } from './components/Clients';
import { Sectors } from './components/Sectors';
import { CaseStudies } from './components/CaseStudies';
import { WhyUs } from './components/WhyUs';
import { Testimonials } from './components/Testimonials';
import { FinalCTA } from './components/FinalCTA';
import { Footer } from './components/Footer';
import { ContactModal } from './components/ContactModal';
import { ProjectModal } from './components/ProjectModal';
import { Toast } from './components/Toast';
import { api, FALLBACK_SERVICES, FALLBACK_SECTORS, FALLBACK_PROJECTS, FALLBACK_CLIENTS, FALLBACK_TESTIMONIALS } from './services/api';
import { Project, Service, Sector, ClientItem, Testimonial } from './types';
import { AdminAuthProvider } from './admin/AdminAuthContext';
import { AdminPanel } from './admin/AdminPanel';

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
      return c ? JSON.parse(c) : FALLBACK_CLIENTS;
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
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [contactServiceSelection, setContactServiceSelection] = useState<string | undefined>(undefined);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load data from REST API with fallback fallback
  useEffect(() => {
    const loadContent = async () => {
      try {
        const [pData, sData, secData, cData, tData, hData] = await Promise.all([
          api.getProjects(),
          api.getServices(),
          api.getSectors(),
          api.getClients(),
          api.getTestimonials(),
          api.getContent(),
        ]);

        if (pData && pData.length > 0) setProjects(pData);
        if (sData && sData.length > 0) setServices(sData);
        if (secData && secData.length > 0) setSectors(secData);
        if (cData && cData.length > 0) setClients(cData);
        if (tData && tData.length > 0) setTestimonials(tData);
        if (hData) setHomeContent(hData);
      } catch (err) {
        console.warn('API data fetch failed, using fallback in-memory state:', err);
      }
    };

    loadContent();
  }, []);

  const handleOpenContact = (initialTopic?: string) => {
    setContactServiceSelection(initialTopic);
    setContactModalOpen(true);
  };

  const handleViewWork = () => {
    const el = document.getElementById('stories');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

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

        {/* 3. About Us */}
        <About
          onOpenContact={() => handleOpenContact('Agency Partnership')}
          content={homeContent?.about}
        />

        {/* 4. Services */}
        <Services
          services={services}
          onSelectService={(serviceTitle) => handleOpenContact(`Service: ${serviceTitle}`)}
        />

        {/* 5. Trusted Clients */}
        <Clients clients={clients} />

        {/* 6. Sectors */}
        <Sectors
          sectors={sectors}
          onOpenContact={(sectorTopic) => handleOpenContact(sectorTopic)}
        />

        {/* 7. Case Studies / Stories */}
        <CaseStudies
          projects={projects}
          onSelectProject={(project) => setSelectedProject(project)}
        />

        {/* 8. Why Us */}
        <WhyUs
          onOpenContact={() => handleOpenContact('Executive Inquiry')}
          content={homeContent?.whyUs}
        />

        {/* 9. Testimonials / Impact */}
        <Testimonials testimonials={testimonials} />

        {/* 10. Final CTA */}
        <FinalCTA
          onOpenContact={() => handleOpenContact('Project Brief')}
          content={homeContent?.finalCta}
        />
      </main>

      {/* 11. Footer */}
      <Footer onOpenContact={() => handleOpenContact()} />

      {/* Interactive Modals */}
      <ContactModal
        isOpen={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
        initialService={contactServiceSelection}
        onSuccessToast={(msg) => setToastMessage(msg)}
      />

      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onOpenContact={(topic) => handleOpenContact(topic)}
      />

      {/* Notification Toast */}
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
    </div>
  );
};
