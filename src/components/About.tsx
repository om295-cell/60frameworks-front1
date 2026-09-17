import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface AboutProps {
  onOpenContact: () => void;
  content?: {
    eyebrow_en?: string;
    eyebrow_ar?: string;
    heading_en?: string;
    heading_ar?: string;
    para1_en?: string;
    para1_ar?: string;
    para2_en?: string;
    para2_ar?: string;
    badgeText_en?: string;
    badgeText_ar?: string;
    image?: string;
    stats?: {
      label_en?: string;
      label_ar?: string;
      value?: string;
      suffix_en?: string;
      suffix_ar?: string;
    }[];
    pillars?: {
      title_en?: string;
      title_ar?: string;
      desc_en?: string;
      desc_ar?: string;
    }[];
  };
}

export const About: React.FC<AboutProps> = ({ onOpenContact, content }) => {
  const { language, t, dir } = useLanguage();
  const [inView, setInView] = useState(false);
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    return () => observer.disconnect();
  }, []);

  const eyebrow = (language === 'ar' ? content?.eyebrow_ar : content?.eyebrow_en) || t('aboutEyebrow');
  const heading = (language === 'ar' ? content?.heading_ar : content?.heading_en) || t('aboutHeading');
  const para1 = (language === 'ar' ? content?.para1_ar : content?.para1_en) || t('aboutPara1');
  const para2 = (language === 'ar' ? content?.para2_ar : content?.para2_en) || t('aboutPara2');
  const badgeText = (language === 'ar' ? content?.badgeText_ar : content?.badgeText_en) || t('aboutBadge');
  const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1200&auto=format&fit=crop';
  const imagePreferred = content?.image || FALLBACK_IMAGE;
  const image = imgSrc !== null ? imgSrc : imagePreferred;

  const stats = content?.stats && content.stats.length > 0
    ? content.stats.map(s => ({
        label: (language === 'ar' ? s.label_ar : s.label_en) || '',
        value: s.value || '',
        suffix: (language === 'ar' ? s.suffix_ar : s.suffix_en) || '',
      }))
    : [
        { label: t('stat1'), value: '520', suffix: '+' },
        { label: t('stat2'), value: '2.8', suffix: language === 'ar' ? ' مليون+' : 'M+' },
        { label: t('stat3'), value: '99', suffix: '%' },
        { label: t('stat4'), value: '24', suffix: '' },
      ];

  // Pillars — prefer CMS content, fall back to hardcoded translations
  const FALLBACK_PILLARS = [
    { title: t('aboutPillar1'), desc: '' },
    { title: t('aboutPillar2'), desc: '' },
    { title: t('aboutPillar3'), desc: '' },
    { title: t('aboutPillar4'), desc: '' },
  ];
  const pillars = content?.pillars && content.pillars.length > 0
    ? content.pillars.map(p => ({
        title: (language === 'ar' ? p.title_ar : p.title_en) || '',
        desc: (language === 'ar' ? p.desc_ar : p.desc_en) || '',
      }))
    : FALLBACK_PILLARS;

  return (
    <section
      id="about"
      ref={sectionRef}
      className="section"
      style={{
        backgroundColor: 'var(--color-sec-about-bg, #1A1A1A)',
        color: 'var(--color-sec-about-text, #FFFFFF)',
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
      }}
    >
      <div className="container">
        {/* Split Editorial Layout */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 'clamp(2.5rem, 5vw, 5rem)',
            alignItems: 'center',
            marginBottom: '4.5rem',
          }}
        >
          {/* Left Column: Visual Asset with Floating Badge */}
          <div style={{ position: 'relative' }}>
            <div
              className="image-zoom-container"
              style={{
                borderRadius: 'var(--radius-lg)',
                boxShadow: '0 16px 40px rgba(0, 0, 0, 0.5)',
                aspectRatio: '4/3',
                backgroundColor: '#1F1F1F',
                border: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <img
                src={image}
                alt="Strategic Experiential Production Arena"
                onError={() => {
                  if (image !== 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1200&auto=format&fit=crop') {
                    setImgSrc('https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1200&auto=format&fit=crop');
                  }
                }}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
            </div>

            {/* Floating Experience Badge */}
            <div
              style={{
                position: 'absolute',
                bottom: '-20px',
                [dir === 'rtl' ? 'left' : 'right']: '20px',
                backgroundColor: 'var(--color-sec-about-card-bg, #1F1F1F)',
                color: 'var(--color-sec-about-card-text, #FFFFFF)',
                padding: '1.15rem 1.6rem',
                borderRadius: 'var(--radius-md)',
                boxShadow: '0 12px 32px rgba(0, 0, 0, 0.5)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.85rem',
                maxWidth: '280px',
                backdropFilter: 'blur(10px)',
              }}
            >
              <div
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-sec-about-accent, var(--color-orange-primary))',
                  boxShadow: '0 0 12px var(--color-sec-about-accent, var(--color-orange-primary))',
                  flexShrink: 0,
                }}
              />
              <span style={{ fontSize: '0.875rem', fontWeight: 600, lineHeight: 1.5, color: '#FFFFFF' }}>
                {badgeText}
              </span>
            </div>
          </div>

          {/* Right Column: Editorial Copy */}
          <div>
            <span className="type-eyebrow" style={{ color: 'var(--color-sec-about-accent, var(--color-orange-primary))' }}>{eyebrow}</span>
            <h2
              className="type-h1"
              style={{
                color: 'var(--color-sec-about-text, #FFFFFF)',
                marginBottom: '1.75rem',
              }}
            >
              {heading}
            </h2>

            <p className="type-body-lg" style={{ color: 'var(--color-sec-about-subtitle, #D1D5DB)', marginBottom: '1.25rem', lineHeight: 1.75 }}>
              {para1}
            </p>

            <p className="type-body" style={{ color: 'var(--color-sec-about-subtitle, #9CA3AF)', marginBottom: '2rem', lineHeight: 1.75 }}>
              {para2}
            </p>

            {/* Strategic Pillars — CMS-editable cards */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '1rem',
                marginBottom: '2.5rem',
              }}
            >
              {pillars.map((pillar, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.45rem',
                    padding: '1.15rem 1.25rem',
                    borderRadius: '14px',
                    backgroundColor: 'var(--color-sec-about-card-bg, #1F1F1F)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.25)',
                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(246, 134, 33, 0.55)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.backgroundColor = '#262626';
                    e.currentTarget.style.boxShadow = '0 8px 24px -2px rgba(246, 134, 33, 0.18), 0 4px 12px rgba(0, 0, 0, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.backgroundColor = 'var(--color-sec-about-card-bg, #1F1F1F)';
                    e.currentTarget.style.boxShadow = '0 4px 20px -2px rgba(0, 0, 0, 0.25)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                    <div
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '8px',
                        background: 'rgba(246, 134, 33, 0.15)',
                        border: '1px solid rgba(246, 134, 33, 0.35)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        marginTop: '1px',
                      }}
                    >
                      <CheckCircle2
                        size={16}
                        color="var(--color-sec-about-accent, var(--color-orange-primary))"
                      />
                    </div>
                    <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-sec-about-card-text, #FFFFFF)', lineHeight: 1.4 }}>
                      {pillar.title}
                    </span>
                  </div>
                  {pillar.desc && (
                    <p style={{ fontSize: '0.875rem', color: 'var(--color-sec-about-subtitle, #D1D5DB)', lineHeight: 1.65, margin: 0, paddingLeft: dir === 'rtl' ? 0 : '2.5rem', paddingRight: dir === 'rtl' ? '2.5rem' : 0, opacity: 0.9 }}>
                      {pillar.desc}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={onOpenContact}
              className="btn btn-primary-orange"
            >
              <span>{t('aboutCta')}</span>
              <ArrowRight
                size={16}
                style={{ transform: dir === 'rtl' ? 'rotate(180deg)' : 'none' }}
              />
            </button>
          </div>
        </div>

        {/* Animated Statistics Bar */}
        <div
          style={{
            backgroundColor: 'var(--color-sec-about-card-bg, #1F1F1F)',
            borderRadius: 'var(--radius-lg)',
            padding: 'clamp(2rem, 4vw, 3.5rem)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '2rem',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.35)',
          }}
        >
          {stats.map((st, idx) => (
            <div key={idx} style={{ textAlign: 'center' }}>
              <div
                style={{
                  fontSize: 'clamp(2.25rem, 4.5vw, 3.5rem)',
                  fontWeight: 800,
                  color: 'var(--color-sec-about-accent, var(--color-orange-primary))',
                  letterSpacing: '-0.03em',
                  lineHeight: 1,
                  marginBottom: '0.5rem',
                  fontFamily: dir === 'rtl' ? 'var(--font-family-arabic)' : 'var(--font-family-primary)',
                }}
              >
                {inView ? st.value : '0'}
                <span>{st.suffix}</span>
              </div>
              <div
                style={{
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: 'var(--color-sec-about-card-text, #E5E7EB)',
                  textTransform: language === 'ar' ? 'none' : 'uppercase',
                  letterSpacing: '0.04em',
                }}
              >
                {st.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
