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
  };
}

export const About: React.FC<AboutProps> = ({ onOpenContact, content }) => {
  const { language, t, dir } = useLanguage();
  const [inView, setInView] = useState(false);
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
  const image = content?.image || 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1200&auto=format&fit=crop';

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

  return (
    <section id="about" ref={sectionRef} className="section bg-white-space">
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
                boxShadow: 'var(--shadow-lg)',
                aspectRatio: '4/3',
                backgroundColor: 'var(--color-gray-structure)',
              }}
            >
              <img
                src={image}
                alt="Strategic Experiential Production Arena"
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
                backgroundColor: 'var(--color-charcoal-dark)',
                color: 'var(--color-white)',
                padding: '1.25rem 1.75rem',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-dark-card)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                maxWidth: '280px',
              }}
            >
              <div
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-orange-primary)',
                  boxShadow: '0 0 12px var(--color-orange-primary)',
                  flexShrink: 0,
                }}
              />
              <span style={{ fontSize: '0.875rem', fontWeight: 600, lineHeight: 1.5 }}>
                {badgeText}
              </span>
            </div>
          </div>

          {/* Right Column: Editorial Copy */}
          <div>
            <span className="type-eyebrow">{eyebrow}</span>
            <h2
              className="type-h1"
              style={{
                color: 'var(--color-charcoal-dark)',
                marginBottom: '1.75rem',
              }}
            >
              {heading}
            </h2>

            <p className="type-body-lg" style={{ marginBottom: '1.25rem', lineHeight: 1.7 }}>
              {para1}
            </p>

            <p className="type-body" style={{ marginBottom: '2rem', lineHeight: 1.7 }}>
              {para2}
            </p>

            {/* Strategic Pillars List */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem',
                marginBottom: '2.5rem',
              }}
            >
              {(language === 'ar'
                ? [
                    'نمذجة العائد الاستثماري الدقيق',
                    'الهندسة المعمارية المكانية 3D',
                    'الإدارة والتشغيل الشامل للفعالية',
                    'إتقان البروتوكول والمراسم السيادية',
                  ]
                : [
                    'Strategic ROI Modeling',
                    'Spatial Architecture & 3D',
                    'Turnkey Global Staging',
                    'Diplomatic Protocol Mastery',
                  ]
              ).map((item, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                  <CheckCircle2 size={18} color="var(--color-orange-primary)" />
                  <span style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--color-charcoal-dark)' }}>
                    {item}
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={onOpenContact}
              className="btn btn-outline-charcoal"
              style={{
                padding: '0.85rem 1.85rem',
              }}
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
            backgroundColor: 'var(--color-gray-structure)',
            borderRadius: 'var(--radius-lg)',
            padding: 'clamp(2rem, 4vw, 3.5rem)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '2rem',
            border: '1px solid rgba(0,0,0,0.06)',
          }}
        >
          {stats.map((st, idx) => (
            <div key={idx} style={{ textAlign: 'center' }}>
              <div
                style={{
                  fontSize: 'clamp(2.25rem, 4.5vw, 3.5rem)',
                  fontWeight: 800,
                  color: 'var(--color-orange-primary)',
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
                  color: 'var(--color-charcoal-dark)',
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
