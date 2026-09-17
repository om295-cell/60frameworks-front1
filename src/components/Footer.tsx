import React from 'react';
import { Mail, Phone, MapPin, Linkedin, Twitter, Instagram, Youtube, ArrowUp } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export interface FooterContent {
  desc_en?: string;
  desc_ar?: string;
  email?: string;
  phone?: string;
  whatsappUrl?: string;
  hubs_en?: string;
  hubs_ar?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  instagramUrl?: string;
  youtubeUrl?: string;
  navTitle_en?: string;
  navTitle_ar?: string;
  expertiseTitle_en?: string;
  expertiseTitle_ar?: string;
  contactTitle_en?: string;
  contactTitle_ar?: string;
  directBtnText_en?: string;
  directBtnText_ar?: string;
  copyright_en?: string;
  copyright_ar?: string;
  privacyText_en?: string;
  privacyText_ar?: string;
  privacyUrl?: string;
  termsText_en?: string;
  termsText_ar?: string;
  termsUrl?: string;
  servicesList_en?: string;
  servicesList_ar?: string;
}

interface FooterProps {
  onOpenContact: () => void;
  content?: FooterContent;
}

export const Footer: React.FC<FooterProps> = ({ onOpenContact, content }) => {
  const { language, t } = useLanguage();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const desc = (language === 'ar' ? content?.desc_ar : content?.desc_en) || t('footerDesc');
  const navTitle = (language === 'ar' ? content?.navTitle_ar : content?.navTitle_en) || t('footerNavTitle');
  const expertiseTitle = (language === 'ar' ? content?.expertiseTitle_ar : content?.expertiseTitle_en) || t('footerExpertiseTitle');
  const contactTitle = (language === 'ar' ? content?.contactTitle_ar : content?.contactTitle_en) || t('footerContactTitle');
  const hubs = (language === 'ar' ? content?.hubs_ar : content?.hubs_en) || t('footerHubs');
  const directBtnText = (language === 'ar' ? content?.directBtnText_ar : content?.directBtnText_en) || t('footerDirectBtn');
  const copyright = (language === 'ar' ? content?.copyright_ar : content?.copyright_en) || t('footerCopyright');
  const privacyText = (language === 'ar' ? content?.privacyText_ar : content?.privacyText_en) || t('footerPrivacy');
  const termsText = (language === 'ar' ? content?.termsText_ar : content?.termsText_en) || t('footerTerms');

  const email = content?.email || 'inquiries@impactagency.com';
  const phone = content?.phone || '+966 55 307 7467';
  const whatsappUrl = content?.whatsappUrl || 'https://api.whatsapp.com/send/?phone=966553077467';
  const privacyUrl = content?.privacyUrl || '#';
  const termsUrl = content?.termsUrl || '#';

  const navLinks = [
    { label: t('navAbout'), href: '#about' },
    { label: t('navServices'), href: '#services' },
    { label: t('navClients'), href: '#clients' },
    { label: t('navSectors'), href: '#sectors' },
    { label: t('navStories'), href: '#stories' },
    { label: t('navWhyUs'), href: '#why-us' },
  ];

  const defaultServicesAr = [
    'استراتيجية ورؤية الفعاليات',
    'إدارة وإنتاج الفعاليات الكبرى',
    'تجارب العلامات التجارية والتدشين',
    'المعارض والأجنحة المعمارية',
    'القمم المؤسسية والمؤتمرات السيادية',
    'الإبداع والسرد القصصي السينمائي',
  ];
  const defaultServicesEn = [
    'Event Strategy & Architecture',
    'Event Management & Staging',
    'Brand Experiences & Reveals',
    'Exhibitions & Custom Booths',
    'Corporate Summits & Galas',
    'Creative & 3D Spatial Visuals',
  ];

  const serviceLinks = language === 'ar'
    ? (content?.servicesList_ar ? content.servicesList_ar.split('\n').map(s => s.trim()).filter(Boolean) : defaultServicesAr)
    : (content?.servicesList_en ? content.servicesList_en.split('\n').map(s => s.trim()).filter(Boolean) : defaultServicesEn);

  const socialLinks = [
    { icon: <Linkedin size={18} />, label: 'LinkedIn', url: content?.linkedinUrl || 'https://linkedin.com' },
    { icon: <Twitter size={18} />, label: 'Twitter', url: content?.twitterUrl || 'https://twitter.com' },
    { icon: <Instagram size={18} />, label: 'Instagram', url: content?.instagramUrl || 'https://instagram.com' },
    { icon: <Youtube size={18} />, label: 'YouTube', url: content?.youtubeUrl || 'https://youtube.com' },
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
              {desc}
            </p>

            {/* Social Icons */}
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {socialLinks.map((s, idx) => (
                <a
                  key={idx}
                  href={s.url}
                  target={s.url.startsWith('http') ? '_blank' : undefined}
                  rel={s.url.startsWith('http') ? 'noopener noreferrer' : undefined}
                  aria-label={s.label}
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(128, 128, 128, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--color-footer-heading, var(--color-white))',
                    textDecoration: 'none',
                    transition: 'all var(--transition-fast)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--color-footer-accent, var(--color-orange-primary))';
                    e.currentTarget.style.color = '#FFFFFF';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(128, 128, 128, 0.15)';
                    e.currentTarget.style.color = 'var(--color-footer-heading, var(--color-white))';
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
              {navTitle}
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {navLinks.map((link, idx) => (
                <li key={idx}>
                  <a
                    href={link.href}
                    style={{
                      fontSize: '0.875rem',
                      color: 'var(--color-footer-link, var(--color-footer-text, #B0B0B0))',
                      textDecoration: 'none',
                      transition: 'color var(--transition-fast)',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-footer-accent, var(--color-orange-primary))')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-footer-link, var(--color-footer-text, #B0B0B0))')}
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
              {expertiseTitle}
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {serviceLinks.map((serv, idx) => (
                <li key={idx}>
                  <a
                    href="#services"
                    style={{
                      fontSize: '0.875rem',
                      color: 'var(--color-footer-link, var(--color-footer-text, #B0B0B0))',
                      textDecoration: 'none',
                      transition: 'color var(--transition-fast)',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-footer-accent, var(--color-orange-primary))')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-footer-link, var(--color-footer-text, #B0B0B0))')}
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
              {contactTitle}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.875rem', color: 'var(--color-footer-text, rgba(255, 255, 255, 0.7))' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Mail size={16} color="var(--color-footer-accent, var(--color-orange-primary))" />
                <a
                  href={`mailto:${email}`}
                  style={{ color: 'inherit', textDecoration: 'none' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-orange-primary)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'inherit')}
                >
                  {email}
                </a>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Phone size={16} color="var(--color-footer-accent, var(--color-orange-primary))" />
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'inherit', textDecoration: 'none' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-orange-primary)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'inherit')}
                  dir="ltr"
                >
                  {phone}
                </a>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <MapPin size={16} color="var(--color-footer-accent, var(--color-orange-primary))" style={{ marginTop: '2px', flexShrink: 0 }} />
                <span>{hubs}</span>
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
              {directBtnText}
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
            © {new Date().getFullYear()} {copyright}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <a href={privacyUrl} style={{ color: 'inherit', textDecoration: 'none' }}>{privacyText}</a>
            <a href={termsUrl} style={{ color: 'inherit', textDecoration: 'none' }}>{termsText}</a>
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
