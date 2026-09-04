import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight, Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface HeaderProps {
  onOpenContact: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenContact }) => {
  const { language, setLanguage, t, dir } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  const navLinks = [
    { label: t('navHome'), href: '#hero', id: 'home' },
    { label: t('navAbout'), href: '#about', id: 'about' },
    { label: t('navServices'), href: '#services', id: 'services' },
    { label: t('navClients'), href: '#clients', id: 'clients' },
    { label: t('navSectors'), href: '#sectors', id: 'sectors' },
    { label: t('navStories'), href: '#stories', id: 'stories' },
    { label: t('navWhyUs'), href: '#why-us', id: 'why-us' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      const sections = ['home', 'about', 'services', 'clients', 'sectors', 'stories', 'why-us'];
      const scrollPosition = window.scrollY + 120;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId === 'home' ? 'hero' : sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backgroundColor: 'var(--color-white)',
        transition: 'box-shadow var(--transition-normal), border-color var(--transition-normal)',
        boxShadow: isScrolled ? '0 4px 20px rgba(36, 36, 36, 0.08)' : 'none',
        borderBottom: isScrolled ? '1px solid var(--color-border)' : '1px solid rgba(230, 231, 232, 0.6)',
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '80px',
          }}
        >
          {/* Brand Logo */}
          <a
            href="#hero"
            onClick={(e) => handleNavClick(e, '#hero')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              textDecoration: 'none',
              color: 'var(--color-charcoal-dark)',
            }}
          >
            <img
              src="/logo.png"
              alt="60FRAMEWORKS"
              style={{
                height: '48px',
                width: 'auto',
                maxHeight: '48px',
                objectFit: 'contain',
                display: 'block',
              }}
            />
            <div>
              <span
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 800,
                  letterSpacing: '-0.02em',
                  color: 'var(--color-charcoal-dark)',
                  display: 'block',
                  lineHeight: 1.1,
                }}
              >
                60FRAMEWORKS
              </span>
              <span
                style={{
                  fontSize: '0.625rem',
                  fontWeight: 700,
                  letterSpacing: language === 'ar' ? '0.04em' : '0.14em',
                  textTransform: 'uppercase',
                  color: 'var(--color-body-light)',
                  display: 'block',
                }}
              >
                {t('agencySubtitle')}
              </span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav
            style={{
              display: 'none',
              alignItems: 'center',
              gap: '1.75rem',
            }}
            className="desktop-nav"
          >
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  style={{
                    fontSize: '0.9375rem',
                    fontWeight: 600,
                    textDecoration: 'none',
                    color: isActive ? 'var(--color-orange-primary)' : 'var(--color-charcoal-dark)',
                    transition: 'color var(--transition-fast)',
                    position: 'relative',
                    padding: '0.25rem 0',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.color = 'var(--color-orange-primary)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.color = 'var(--color-charcoal-dark)';
                  }}
                >
                  {link.label}
                  {isActive && (
                    <span
                      style={{
                        position: 'absolute',
                        bottom: '-4px',
                        left: 0,
                        right: 0,
                        height: '2px',
                        backgroundColor: 'var(--color-orange-primary)',
                        borderRadius: '2px',
                      }}
                    />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Actions & Language Switcher */}
          <div style={{ display: 'none', alignItems: 'center', gap: '1rem' }} className="desktop-actions">
            {/* Language Toggle Button */}
            <button
              onClick={toggleLanguage}
              aria-label="Toggle language between English and Arabic SA"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.375rem',
                backgroundColor: 'var(--color-gray-structure)',
                color: 'var(--color-charcoal-dark)',
                border: '1px solid rgba(0,0,0,0.06)',
                borderRadius: 'var(--radius-full)',
                padding: '0.45rem 0.95rem',
                fontSize: '0.8125rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-orange-subtle)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-gray-structure)')}
            >
              <Globe size={15} color="var(--color-orange-primary)" />
              <span>{language === 'en' ? 'العربية 🇸🇦' : 'English 🇬🇧'}</span>
            </button>

            {/* Contact CTA */}
            <button
              onClick={onOpenContact}
              className="btn btn-primary-orange"
              style={{
                padding: '0.65rem 1.4rem',
                fontSize: '0.875rem',
              }}
            >
              <span>{t('navContactUs')}</span>
              <ArrowUpRight
                size={16}
                style={{ transform: dir === 'rtl' ? 'rotate(-90deg)' : 'none' }}
              />
            </button>
          </div>

          {/* Mobile Right Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }} className="mobile-controls">
            <button
              onClick={toggleLanguage}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                backgroundColor: 'var(--color-gray-structure)',
                border: 'none',
                borderRadius: 'var(--radius-full)',
                padding: '0.4rem 0.75rem',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <Globe size={13} color="var(--color-orange-primary)" />
              <span>{language === 'en' ? 'عربي' : 'EN'}</span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="mobile-toggle"
              aria-label="Toggle navigation menu"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                backgroundColor: 'var(--color-gray-structure)',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--color-charcoal-dark)',
              }}
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            top: '80px',
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(36, 36, 36, 0.4)',
            backdropFilter: 'blur(4px)',
            zIndex: 49,
          }}
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            style={{
              backgroundColor: 'var(--color-white)',
              padding: '2rem 1.5rem',
              borderBottom: '1px solid var(--color-border)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
              boxShadow: '0 12px 30px rgba(0,0,0,0.15)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                style={{
                  fontSize: '1.125rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                  color: activeSection === link.id ? 'var(--color-orange-primary)' : 'var(--color-charcoal-dark)',
                  padding: '0.5rem 0',
                  borderBottom: '1px solid rgba(230, 231, 232, 0.4)',
                }}
              >
                {link.label}
              </a>
            ))}

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenContact();
              }}
              className="btn btn-primary-orange"
              style={{
                marginTop: '1rem',
                width: '100%',
                padding: '0.875rem',
              }}
            >
              <span>{t('navContactUs')}</span>
              <ArrowUpRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Responsive Media Queries */}
      <style>{`
        @media (min-width: 992px) {
          .desktop-nav {
            display: flex !important;
          }
          .desktop-actions {
            display: flex !important;
          }
          .mobile-controls {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
};
