import React from 'react';
import { ShieldCheck, Zap, Award, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface WhyUsProps {
  onOpenContact: () => void;
  content?: {
    eyebrow_en?: string;
    eyebrow_ar?: string;
    heading_en?: string;
    heading_ar?: string;
    subtitle_en?: string;
    subtitle_ar?: string;
    image?: string;
    videoUrl?: string;
    badgeTitle_en?: string;
    badgeTitle_ar?: string;
    badgeDesc_en?: string;
    badgeDesc_ar?: string;
    badgeValue?: string;
    pillars?: {
      title_en?: string;
      title_ar?: string;
      desc_en?: string;
      desc_ar?: string;
    }[];
  };
}

export const WhyUs: React.FC<WhyUsProps> = ({ onOpenContact, content }) => {
  const { t, dir, language } = useLanguage();

  const eyebrow = (language === 'ar' ? content?.eyebrow_ar : content?.eyebrow_en) || t('whyUsEyebrow');
  const heading = (language === 'ar' ? content?.heading_ar : content?.heading_en) || t('whyUsHeading');
  const subtitle = (language === 'ar' ? content?.subtitle_ar : content?.subtitle_en) || t('whyUsSubtitle');
  const image = content?.image || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1200&auto=format&fit=crop';
  const badgeTitle = (language === 'ar' ? content?.badgeTitle_ar : content?.badgeTitle_en) || t('whyUsBadgeTitle');
  const badgeDesc = (language === 'ar' ? content?.badgeDesc_ar : content?.badgeDesc_en) || t('whyUsBadgeDesc');
  const badgeValue = content?.badgeValue || '360°';

  const iconList = [
    <Sparkles key="1" size={22} color="var(--color-orange-primary)" />,
    <Zap key="2" size={22} color="var(--color-orange-primary)" />,
    <Award key="3" size={22} color="var(--color-orange-primary)" />,
    <ShieldCheck key="4" size={22} color="var(--color-orange-primary)" />,
  ];

  const defaultPillars = [
    {
      title: t('whyPillar1Title'),
      description: t('whyPillar1Desc'),
      icon: iconList[0],
    },
    {
      title: t('whyPillar2Title'),
      description: t('whyPillar2Desc'),
      icon: iconList[1],
    },
    {
      title: t('whyPillar3Title'),
      description: t('whyPillar3Desc'),
      icon: iconList[2],
    },
    {
      title: t('whyPillar4Title'),
      description: t('whyPillar4Desc'),
      icon: iconList[3],
    },
  ];

  const pillars = content?.pillars && content.pillars.length > 0
    ? content.pillars.map((p, idx) => ({
        title: (language === 'ar' ? p.title_ar : p.title_en) || '',
        description: (language === 'ar' ? p.desc_ar : p.desc_en) || '',
        icon: iconList[idx % iconList.length],
      }))
    : defaultPillars;

  return (
    <section
      id="why-us"
      className="section"
      style={{
        backgroundColor: 'var(--color-sec-whyUs-bg, #FAFAFA)',
        backgroundImage: 'radial-gradient(circle at 10% 20%, rgba(246, 134, 33, 0.03) 0%, transparent 45%), radial-gradient(circle at 90% 80%, rgba(246, 134, 33, 0.03) 0%, transparent 45%)',
      }}
    >
      <div className="container">
        {/* Split Image / Content Layout */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 'clamp(2.5rem, 5vw, 5rem)',
            alignItems: 'center',
          }}
        >
          {/* Left Column: Strategic Content & Pillars */}
          <div>
            <span className="type-eyebrow" style={{ color: 'var(--color-sec-whyUs-accent, var(--color-orange-primary))' }}>
              {eyebrow}
            </span>
            <h2 className="type-h1" style={{ color: 'var(--color-sec-whyUs-text, #1A1A1A)', marginBottom: '1.25rem' }}>
              {heading}
            </h2>
            <p className="type-body-lg" style={{ color: 'var(--color-sec-whyUs-subtitle, #4B5563)', marginBottom: '2.5rem', lineHeight: 1.75 }}>
              {subtitle}
            </p>

            {/* Feature Cards with Luxury Styling */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2.5rem' }}>
              {pillars.map((pillar, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '1.25rem',
                    padding: '1.35rem 1.5rem',
                    borderRadius: '16px',
                    backgroundColor: 'var(--color-sec-whyUs-card-bg, #FFFFFF)',
                    border: '1px solid rgba(0, 0, 0, 0.07)',
                    boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.04), 0 2px 6px -1px rgba(0, 0, 0, 0.02)',
                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(246, 134, 33, 0.45)';
                    e.currentTarget.style.boxShadow = '0 12px 28px -4px rgba(246, 134, 33, 0.14), 0 4px 10px -2px rgba(0, 0, 0, 0.03)';
                    e.currentTarget.style.transform = 'translateY(-3px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.07)';
                    e.currentTarget.style.boxShadow = '0 4px 20px -2px rgba(0, 0, 0, 0.04), 0 2px 6px -1px rgba(0, 0, 0, 0.02)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '13px',
                      background: 'linear-gradient(135deg, rgba(246, 134, 33, 0.15) 0%, rgba(246, 134, 33, 0.04) 100%)',
                      border: '1px solid rgba(246, 134, 33, 0.25)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      boxShadow: '0 2px 8px rgba(246, 134, 33, 0.12)',
                    }}
                  >
                    {pillar.icon}
                  </div>

                  <div style={{ flex: 1 }}>
                    <h3
                      style={{
                        fontSize: '1.125rem',
                        fontWeight: 700,
                        color: 'var(--color-sec-whyUs-card-text, #1A1A1A)',
                        marginBottom: '0.4rem',
                        lineHeight: 1.45,
                      }}
                    >
                      {pillar.title}
                    </h3>
                    <p style={{ fontSize: '0.9375rem', lineHeight: 1.75, color: 'var(--color-sec-whyUs-subtitle, #4B5563)', margin: 0 }}>
                      {pillar.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <button onClick={onOpenContact} className="btn btn-primary-orange">
              <span>{t('whyUsCta')}</span>
            </button>
          </div>

          {/* Right Column: Visual Composite & End-to-End Badge */}
          <div style={{ position: 'relative' }}>
            <div
              className="image-zoom-container"
              style={{
                borderRadius: 'var(--radius-xl)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-lg)',
                aspectRatio: '4/5',
                backgroundColor: 'var(--color-gray-structure)',
              }}
            >
              <img
                src={image}
                alt="High-profile creative keynote staging"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
            </div>

            {/* End-to-End Execution Badge */}
            <div
              style={{
                position: 'absolute',
                top: '-20px',
                [dir === 'rtl' ? 'right' : 'left']: '-20px',
                backgroundColor: 'var(--color-orange-primary)',
                color: 'var(--color-white)',
                padding: '1.5rem',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-orange)',
                maxWidth: '240px',
              }}
            >
              <div style={{ fontSize: '1.75rem', fontWeight: 800, lineHeight: 1, marginBottom: '0.25rem' }}>
                {badgeValue}
              </div>
              <div style={{ fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.04em' }}>
                {badgeTitle}
              </div>
              <div style={{ fontSize: '0.75rem', marginTop: '0.5rem', opacity: 0.9, lineHeight: 1.5 }}>
                {badgeDesc}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
