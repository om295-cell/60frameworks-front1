import React from 'react';
import { Mail, Phone, MapPin, Linkedin, Twitter, Instagram, Youtube, ArrowUp } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface FooterProps {
  onOpenContact: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenContact }) => {
  const { language, t } = useLanguage();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinks = [
    { label: t('navAbout'), href: '#about' },
    { label: t('navServices'), href: '#services' },
    { label: t('navClients'), href: '#clients' },
    { label: t('navSectors'), href: '#sectors' },
    { label: t('navStories'), href: '#stories' },
    { label: t('navWhyUs'), href: '#why-us' },
  ];

  const serviceLinks = language === 'ar'
    ? [
        'استراتيجية ورؤية الفعاليات',
        'إدارة وإنتاج الفعاليات الكبرى',
        'تجارب العلامات التجارية والتدشين',
        'المعارض والأجنحة المعمارية',
        'القمم المؤسسية والمؤتمرات السيادية',
        'الإبداع والسرد القصصي السينمائي',
      ]
    : [
        'Event Strategy & Architecture',
        'Event Management & Staging',
        'Brand Experiences & Reveals',
        'Exhibitions & Custom Booths',
        'Corporate Summits & Galas',
        'Creative & 3D Spatial Visuals',
      ];

  return (
    <footer
      style={{
        backgroundColor: 'var(--color-footer-bg, var(--color-charcoal-dark))',
        color: 'var(--color-footer-text, rgba(255, 255, 255, 0.7))',
        paddingTop: '5rem',
        paddingBottom: '2.5rem',
        borderTop: '1px solid var(--color-footer-border, rgba(255, 255, 255, 0.08))',
      }}
    >
      <div className="container">
        {/* Main Footer Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '3rem',
            marginBottom: '4rem',
          }}
        >
          {/* Col 1: Brand & Philosophy */}
          <div style={{ maxWidth: '320px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                marginBottom: '1.25rem',
              }}
            >
              <img
                src="/logo.png"
                alt="60FRAMEWORKS"
                style={{
                  height: '42px',
                  width: 'auto',
                  maxHeight: '42px',
                  objectFit: 'contain',
                  display: 'block',
                }}
              />
              <span style={{ fontSize: '1.35rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--color-footer-heading, var(--color-white))' }}>
                60FRAMEWORKS
              </span>
            </div>

            <p style={{ fontSize: '0.875rem', lineHeight: 1.65, color: 'var(--color-footer-text, rgba(255, 255, 255, 0.7))', marginBottom: '1.5rem' }}>
              {t('footerDesc')}
            </p>

            {/* Social Icons */}
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {[
                { icon: <Linkedin size={18} />, label: 'LinkedIn' },
                { icon: <Twitter size={18} />, label: 'Twitter' },
                { icon: <Instagram size={18} />, label: 'Instagram' },
                { icon: <Youtube size={18} />, label: 'YouTube' },
              ].map((s, idx) => (
                <a
                  key={idx}
                  href="#"
                  aria-label={s.label}
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--color-white)',
                    textDecoration: 'none',
                    transition: 'all var(--transition-fast)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--color-orange-primary)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div>
            <h4
              style={{
                fontSize: '0.875rem',
                fontWeight: 700,
                textTransform: language === 'ar' ? 'none' : 'uppercase',
                letterSpacing: language === 'ar' ? 'normal' : '0.08em',
                color: 'var(--color-footer-heading, var(--color-white))',
                marginBottom: '1.25rem',
              }}
            >
              {t('footerNavTitle')}
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {navLinks.map((link, idx) => (
                <li key={idx}>
                  <a
                    href={link.href}
                    style={{
                      fontSize: '0.875rem',
                      color: 'rgba(255, 255, 255, 0.7)',
                      textDecoration: 'none',
                      transition: 'color var(--transition-fast)',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-orange-primary)')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)')}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Services */}
          <div>
            <h4
              style={{
                fontSize: '0.875rem',
                fontWeight: 700,
                textTransform: language === 'ar' ? 'none' : 'uppercase',
                letterSpacing: language === 'ar' ? 'normal' : '0.08em',
                color: 'var(--color-footer-heading, var(--color-white))',
                marginBottom: '1.25rem',
              }}
            >
              {t('footerExpertiseTitle')}
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {serviceLinks.map((serv, idx) => (
                <li key={idx}>
                  <a
                    href="#services"
                    style={{
                      fontSize: '0.875rem',
                      color: 'rgba(255, 255, 255, 0.7)',
                      textDecoration: 'none',
                      transition: 'color var(--transition-fast)',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-orange-primary)')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)')}
                  >
                    {serv}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Direct Contacts */}
          <div>
            <h4
              style={{
                fontSize: '0.875rem',
                fontWeight: 700,
                textTransform: language === 'ar' ? 'none' : 'uppercase',
                letterSpacing: language === 'ar' ? 'normal' : '0.08em',
                color: 'var(--color-footer-heading, var(--color-white))',
                marginBottom: '1.25rem',
              }}
            >
              {t('footerContactTitle')}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.875rem', color: 'var(--color-footer-text, rgba(255, 255, 255, 0.7))' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Mail size={16} color="var(--color-footer-accent, var(--color-orange-primary))" />
                <a
                  href="mailto:inquiries@impactagency.com"
                  style={{ color: 'inherit', textDecoration: 'none' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-orange-primary)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'inherit')}
                >
                  inquiries@impactagency.com
                </a>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Phone size={16} color="var(--color-footer-accent, var(--color-orange-primary))" />
                <a
                  href="https://api.whatsapp.com/send/?phone=966553077467"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'inherit', textDecoration: 'none' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-orange-primary)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'inherit')}
                  dir="ltr"
                >
                  +966 55 307 7467 (WhatsApp)
                </a>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <MapPin size={16} color="var(--color-footer-accent, var(--color-orange-primary))" style={{ marginTop: '2px', flexShrink: 0 }} />
                <span>{t('footerHubs')}</span>
              </div>
            </div>

            <button
              onClick={onOpenContact}
              className="btn btn-primary-orange"
              style={{
                marginTop: '1.5rem',
                width: '100%',
                padding: '0.75rem',
                fontSize: '0.875rem',
              }}
            >
              {t('footerDirectBtn')}
            </button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            paddingTop: '2rem',
            borderTop: '1px solid var(--color-footer-border, rgba(255, 255, 255, 0.08))',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            fontSize: '0.8125rem',
            color: 'var(--color-footer-text, rgba(255, 255, 255, 0.5))',
          }}
        >
          <div>
            © {new Date().getFullYear()} {t('footerCopyright')}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>{t('footerPrivacy')}</a>
            <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>{t('footerTerms')}</a>
            <button
              onClick={scrollToTop}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                background: 'none',
                border: 'none',
                color: 'var(--color-footer-accent, var(--color-orange-primary))',
                cursor: 'pointer',
                fontSize: '0.8125rem',
                fontWeight: 600,
              }}
            >
              <span>{t('footerBackToTop')}</span>
              <ArrowUp size={14} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
