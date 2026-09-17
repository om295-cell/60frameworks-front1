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

export const DEPARTMENTS = [
  {
    slug: 'marketing-media',
    name_ar: 'الحملات التسويقية والإعلامية',
    name_en: 'Marketing & Media Campaigns',
    path: '/departments/marketing-media',
  },
  {
    slug: 'content-creation',
    name_ar: 'صناعة وإدارة المحتوى',
    name_en: 'Content Creation & Management',
    path: '/departments/content-creation',
  },
  {
    slug: 'visual-production',
    name_ar: 'الإنتاج المرئي والتغطيات',
    name_en: 'Visual Production & Coverage',
    path: '/departments/visual-production',
  },
  {
    slug: 'brand-experiences',
    name_ar: 'تجارب العلامات التجارية',
    name_en: 'Brand Experiences',
    path: '/departments/brand-experiences',
  },
  {
    slug: 'influencer-management',
    name_ar: 'إدارة المؤثرين',
    name_en: 'Influencer Management',
    path: '/departments/influencer-management',
  },
  {
    slug: 'events-conferences',
    name_ar: 'الفعاليات والملتقيات',
    name_en: 'Events & Conferences',
    path: '/departments/events-conferences',
  },
  {
    slug: 'brand-identity',
    name_ar: 'بناء الهوية والتصميم الإبداعي',
    name_en: 'Brand Identity & Creative Design',
    path: '/departments/brand-identity',
  },
  {
    slug: 'vr-ar',
    name_ar: 'تقنيات وتجارب الواقع الافتراضي والمعزز',
    name_en: 'VR & AR Technologies & Experiences',
    path: '/departments/vr-ar',
  },
];

export const Footer: React.FC<FooterProps> = ({ onOpenContact, content }) => {
  const { language, t, dir } = useLanguage();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const desc = (language === 'ar' ? content?.desc_ar : content?.desc_en) || t('footerDesc');
  const navTitle = (language === 'ar' ? content?.navTitle_ar : content?.navTitle_en) || (language === 'ar' ? 'أقسام الموقع' : 'Navigation');
  const expertiseTitle = (language === 'ar' ? content?.expertiseTitle_ar : content?.expertiseTitle_en) || (language === 'ar' ? 'مجالات الخبرة' : 'Areas of Expertise');
  const contactTitle = (language === 'ar' ? content?.contactTitle_ar : content?.contactTitle_en) || (language === 'ar' ? 'تواصل معنا' : 'Contact Us');
  const hubs = (language === 'ar' ? content?.hubs_ar : content?.hubs_en) || t('footerHubs');
  const directBtnText = (language === 'ar' ? content?.directBtnText_ar : content?.directBtnText_en) || t('footerDirectBtn');
  const copyright = (language === 'ar' ? content?.copyright_ar : content?.copyright_en) || t('footerCopyright');
  const privacyText = (language === 'ar' ? content?.privacyText_ar : content?.privacyText_en) || t('footerPrivacy');
  const termsText = (language === 'ar' ? content?.termsText_ar : content?.termsText_en) || t('footerTerms');

  const email = (content?.email && content.email !== 'inquiries@impactagency.com') ? content.email : 'hello@60frameworks.com';
  const phone = content?.phone || '+966 55 307 7467';
  const whatsappUrl = content?.whatsappUrl || 'https://api.whatsapp.com/send/?phone=966553077467';
  const privacyUrl = content?.privacyUrl || '#';
  const termsUrl = content?.termsUrl || '#';

  const navLinks = [
    { label: language === 'ar' ? 'من نحن' : 'About Us', href: '#about' },
    { label: language === 'ar' ? 'خدماتنا' : 'Services', href: '#services' },
    { label: language === 'ar' ? 'عملاؤنا' : 'Clients', href: '#clients' },
    { label: language === 'ar' ? 'القطاعات' : 'Sectors', href: '#sectors' },
    { label: language === 'ar' ? 'أعمالنا' : 'Our Work', href: '#stories' },
    { label: language === 'ar' ? 'لماذا نحن؟' : 'Why Us?', href: '#why-us' },
  ];

  const defaultServicesAr = DEPARTMENTS.map((d) => d.name_ar);
  const defaultServicesEn = DEPARTMENTS.map((d) => d.name_en);

  const isOldServiceList = (list?: string) => {
    if (!list) return true;
    return !list.includes('الحملات التسويقية والإعلامية') && !list.includes('Marketing & Media');
  };

  const serviceLinks = language === 'ar'
    ? (content?.servicesList_ar && !isOldServiceList(content.servicesList_ar)
        ? content.servicesList_ar.split('\n').map((s) => s.trim()).filter(Boolean)
        : defaultServicesAr)
    : (content?.servicesList_en && !isOldServiceList(content.servicesList_en)
        ? content.servicesList_en.split('\n').map((s) => s.trim()).filter(Boolean)
        : defaultServicesEn);

  const getDepartmentLink = (name: string) => {
    const trimmed = name.trim().toLowerCase();
    const matched = DEPARTMENTS.find(
      (d) =>
        d.name_ar.trim().toLowerCase() === trimmed ||
        d.name_en.trim().toLowerCase() === trimmed ||
        trimmed.includes(d.slug)
    );
    return matched ? matched.path : `/departments/${encodeURIComponent(name.trim())}`;
  };

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
                    href={getDepartmentLink(serv)}
                    data-department={serv}
                    title={language === 'ar' ? `الانتقال إلى صفحة: ${serv}` : `Navigate to: ${serv}`}
                    style={{
                      fontSize: '0.875rem',
                      color: 'var(--color-footer-link, var(--color-footer-text, #B0B0B0))',
                      textDecoration: 'none',
                      transition: 'all var(--transition-fast)',
                      display: 'inline-block',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = 'var(--color-footer-accent, var(--color-orange-primary))';
                      e.currentTarget.style.transform = (dir === 'rtl' || language === 'ar') ? 'translateX(-4px)' : 'translateX(4px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = 'var(--color-footer-link, var(--color-footer-text, #B0B0B0))';
                      e.currentTarget.style.transform = 'translateX(0)';
                    }}
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
                  style={{ color: 'inherit', textDecoration: 'none', transition: 'color var(--transition-fast)' }}
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
                  title={phone}
                  style={{ color: 'inherit', textDecoration: 'none', transition: 'color var(--transition-fast)' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-orange-primary)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'inherit')}
                >
                  {language === 'ar' ? 'واتساب' : 'WhatsApp'}
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
