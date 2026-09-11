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

  const pillars = [
    {
      title: t('whyPillar1Title'),
      description: t('whyPillar1Desc'),
      icon: <Sparkles size={22} color="var(--color-orange-primary)" />,
    },
    {
      title: t('whyPillar2Title'),
      description: t('whyPillar2Desc'),
      icon: <Zap size={22} color="var(--color-orange-primary)" />,
    },
    {
      title: t('whyPillar3Title'),
      description: t('whyPillar3Desc'),
      icon: <Award size={22} color="var(--color-orange-primary)" />,
    },
    {
      title: t('whyPillar4Title'),
      description: t('whyPillar4Desc'),
      icon: <ShieldCheck size={22} color="var(--color-orange-primary)" />,
    },
  ];

  return (
    <section id="why-us" className="section" style={{ backgroundColor: 'var(--color-sec-whyUs-bg, #FFFFFF)' }}>
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
            <h2 className="type-h1" style={{ color: 'var(--color-sec-whyUs-text, var(--color-charcoal-dark))', marginBottom: '1.25rem' }}>
              {heading}
            </h2>
            <p className="type-body-lg" style={{ color: 'var(--color-sec-whyUs-subtitle, var(--color-body-gray))', marginBottom: '2.5rem', lineHeight: 1.7 }}>
              {subtitle}
            </p>

            {/* Feature Cards with Orange Icons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2.5rem' }}>
              {pillars.map((pillar, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '1.125rem',
                    padding: '1.25rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--color-sec-whyUs-card-bg, var(--color-gray-light))',
                    border: '1px solid rgba(0, 0, 0, 0.05)',
                    transition: 'all var(--transition-normal)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--color-sec-whyUs-accent, var(--color-orange-primary))';
                    e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.05)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '10px',
                      backgroundColor: 'var(--color-orange-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {pillar.icon}
                  </div>

                  <div>
                    <h3
                      style={{
                        fontSize: '1.0625rem',
                        fontWeight: 700,
                        color: 'var(--color-sec-whyUs-card-text, var(--color-charcoal-dark))',
                        marginBottom: '0.35rem',
                      }}
                    >
                      {pillar.title}
                    </h3>
                    <p style={{ fontSize: '0.875rem', lineHeight: 1.65, color: 'var(--color-sec-whyUs-card-text, var(--color-body-gray))', opacity: 0.85 }}>
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
                100%
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
