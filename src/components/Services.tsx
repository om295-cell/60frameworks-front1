import React from 'react';
import {
  Compass,
  Layers,
  Sparkles,
  Box,
  Briefcase,
  Film,
  ArrowRight,
  Check,
} from 'lucide-react';
import { Service } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface ServicesProps {
  services: Service[];
  onSelectService: (serviceName: string) => void;
}

interface ServicesHeaderProps {
  eyebrow_en?: string; eyebrow_ar?: string;
  heading_en?: string; heading_ar?: string;
  subtitle_en?: string; subtitle_ar?: string;
}

interface ServicesPropsExtended extends ServicesProps {
  content?: ServicesHeaderProps;
}

export const Services: React.FC<ServicesPropsExtended> = ({ services, onSelectService, content }) => {
  const { language, t, dir } = useLanguage();

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Compass':
        return <Compass size={28} />;
      case 'Layers':
        return <Layers size={28} />;
      case 'Sparkles':
        return <Sparkles size={28} />;
      case 'Box':
        return <Box size={28} />;
      case 'Briefcase':
        return <Briefcase size={28} />;
      case 'Film':
        return <Film size={28} />;
      default:
        return <Sparkles size={28} />;
    }
  };

  return (
    <section id="services" className="section" style={{ backgroundColor: 'var(--color-sec-services-bg, #E6E7E8)' }}>
      <div className="container">
        {/* Section Header */}
        <div style={{ maxWidth: '720px', marginBottom: '3.5rem' }}>
          <span className="type-eyebrow" style={{ color: 'var(--color-sec-services-accent, var(--color-orange-primary))' }}>
            {(language === 'ar' ? content?.eyebrow_ar : content?.eyebrow_en) || t('servicesEyebrow')}
          </span>
          <h2 className="type-h1" style={{ color: 'var(--color-sec-services-text, var(--color-charcoal-dark))', marginBottom: '1rem' }}>
            {(language === 'ar' ? content?.heading_ar : content?.heading_en) || t('servicesHeading')}
          </h2>
          <p className="type-body-lg" style={{ color: 'var(--color-sec-services-subtitle, var(--color-body-gray))', lineHeight: 1.7 }}>
            {(language === 'ar' ? content?.subtitle_ar : content?.subtitle_en) || t('servicesSubtitle')}
          </p>
        </div>

        {/* 6 Grid Service Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '1.75rem',
          }}
        >
          {services.map((service, index) => {
            const title = language === 'ar' && service.title_ar ? service.title_ar : service.title;
            const description = language === 'ar' && service.description_ar ? service.description_ar : service.description;
            const deliverables = language === 'ar' && service.deliverables_ar && service.deliverables_ar.length > 0
              ? service.deliverables_ar
              : service.deliverables;

            return (
              <div
                key={service.slug || index}
                className="card-hover-lift"
                style={{
                  backgroundColor: 'var(--color-sec-services-card-bg, var(--color-white))',
                  borderRadius: 'var(--radius-lg)',
                  padding: '2.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  border: '1px solid rgba(0, 0, 0, 0.06)',
                  boxShadow: 'var(--shadow-sm)',
                  position: 'relative',
                }}
              >
                <div>
                  {/* Orange Icon Container */}
                  <div
                    style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--color-orange-subtle)',
                      color: 'var(--color-sec-services-accent, var(--color-orange-primary))',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '1.5rem',
                      border: '1px solid rgba(246, 134, 33, 0.15)',
                    }}
                  >
                    {getIcon(service.icon)}
                  </div>

                  <h3
                    className="type-h3"
                    style={{
                      color: 'var(--color-sec-services-card-text, var(--color-charcoal-dark))',
                      marginBottom: '0.75rem',
                      fontWeight: 700,
                    }}
                  >
                    {title}
                  </h3>

                  <p
                    style={{
                      fontSize: '0.9375rem',
                      lineHeight: 1.65,
                      color: 'var(--color-sec-services-card-text, var(--color-body-gray))',
                      opacity: 0.85,
                      marginBottom: '1.5rem',
                    }}
                  >
                    {description}
                  </p>

                  {/* Deliverables Pills */}
                  <div
                    style={{
                      borderTop: '1px solid rgba(128, 128, 128, 0.18)',
                      paddingTop: '1.25rem',
                      marginBottom: '1.5rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.625rem',
                    }}
                  >
                    {deliverables.map((item, dIdx) => (
                      <div key={dIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                        <Check
                          size={15}
                          color="var(--color-sec-services-accent, var(--color-orange-primary))"
                          style={{ marginTop: '3px', flexShrink: 0 }}
                        />
                        <span style={{ fontSize: '0.84375rem', color: 'var(--color-sec-services-card-text, var(--color-charcoal-dark))', fontWeight: 500 }}>
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Inquiry Action */}
                <button
                  onClick={() => onSelectService(title)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: 'none',
                    border: 'none',
                    color: 'var(--color-sec-services-accent, var(--color-orange-primary))',
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    padding: 0,
                    transition: 'gap var(--transition-fast)',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.gap = '0.75rem')}
                  onMouseLeave={(e) => (e.currentTarget.style.gap = '0.5rem')}
                >
                  <span>{t('serviceCta')}</span>
                  <ArrowRight
                    size={16}
                    style={{ transform: dir === 'rtl' ? 'rotate(180deg)' : 'none' }}
                  />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
