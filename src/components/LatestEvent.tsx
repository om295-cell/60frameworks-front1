import React, { useState } from 'react';
import { Sparkles, ArrowUpRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface LatestEventProps {
  content?: {
    eyebrow_en?: string;
    eyebrow_ar?: string;
    title_en?: string;
    title_ar?: string;
    subtitle_en?: string;
    subtitle_ar?: string;
    imageUrl?: string;
    videoUrl?: string;
    driveUrl?: string;
    tag_en?: string;
    tag_ar?: string;
  };
}

export const LatestEvent: React.FC<LatestEventProps> = ({ content }) => {
  const { t, dir, language } = useLanguage();
  const [isHovered, setIsHovered] = useState(false);

  // Configuration with fallback values
  const eyebrow = (language === 'ar' ? content?.eyebrow_ar : content?.eyebrow_en) || t('latestEventEyebrow');
  const title = (language === 'ar' ? content?.title_ar : content?.title_en) || t('latestEventTitle');
  const subtitle = (language === 'ar' ? content?.subtitle_ar : content?.subtitle_en) || t('latestEventSubtitle');
  const tag = (language === 'ar' ? content?.tag_ar : content?.tag_en) || t('latestEventTag');
  
  // Default high-impact event photo (cinematic luxury summit/activation)
  const imageUrl = content?.imageUrl || 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1600&auto=format&fit=crop';
  const videoUrl = content?.videoUrl || '';

  // Google Drive destination link
  const driveUrl = content?.driveUrl || 'https://drive.google.com';

  return (
    <section id="latest-event" className="section" style={{ padding: '4.5rem 0', position: 'relative', overflow: 'hidden' }}>
      {/* Subtle ambient light glow in the background */}
      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '600px',
          height: '350px',
          background: 'radial-gradient(ellipse at center, rgba(246, 134, 33, 0.08) 0%, rgba(246, 134, 33, 0) 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        {/* Section Header */}
        <div style={{ maxWidth: '780px', margin: '0 auto 2.5rem', textAlign: 'center' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.4rem 1rem',
              borderRadius: '9999px',
              backgroundColor: 'rgba(246, 134, 33, 0.1)',
              border: '1px solid rgba(246, 134, 33, 0.25)',
              color: 'var(--color-orange-primary, #F68621)',
              fontSize: '0.8125rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
              marginBottom: '1rem',
            }}
          >
            <Sparkles size={15} />
            <span>{eyebrow}</span>
          </div>

          <h2
            className="type-h2"
            style={{
              marginBottom: '0.875rem',
              color: 'var(--color-charcoal-dark, #0B0F19)',
              fontFamily: 'var(--font-heading)',
              letterSpacing: '-0.02em',
            }}
          >
            {title}
          </h2>

          <p
            className="type-body-lg"
            style={{
              color: 'var(--color-body-gray, #5A6275)',
              margin: '0 auto',
              lineHeight: 1.7,
              fontSize: '1.0625rem',
            }}
          >
            {subtitle}
          </p>
        </div>

        {/* Featured Interactive Showcase Picture Card */}
        <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
          <a
            href={driveUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${title} - ${t('latestEventCta')}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
              display: 'block',
              position: 'relative',
              borderRadius: '24px',
              overflow: 'hidden',
              textDecoration: 'none',
              cursor: 'pointer',
              border: isHovered
                ? '1.5px solid var(--color-orange-primary, #F68621)'
                : '1.5px solid rgba(246, 134, 33, 0.2)',
              boxShadow: isHovered
                ? '0 25px 60px -15px rgba(246, 134, 33, 0.25), 0 10px 30px rgba(0, 0, 0, 0.15)'
                : '0 20px 45px -10px rgba(0, 0, 0, 0.12)',
              transition: 'all 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
              transform: isHovered ? 'translateY(-5px)' : 'translateY(0)',
              backgroundColor: '#0A0F1D',
            }}
          >
            {/* Aspect Ratio Container for Responsive Image */}
            <div
              style={{
                position: 'relative',
                width: '100%',
                paddingTop: 'clamp(50%, 42vw, 56.25%)', // 16:9 responsive aspect ratio
                overflow: 'hidden',
              }}
            >
              {/* Event Video or Image */}
              {videoUrl ? (
                <video
                  src={videoUrl}
                  autoPlay
                  loop
                  muted
                  playsInline
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              ) : (
                <img
                  src={imageUrl}
                  alt={title}
                  loading="lazy"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                    transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                />
              )}

              {/* Dynamic Gradient Overlay */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: isHovered
                    ? 'linear-gradient(180deg, rgba(10, 15, 29, 0.35) 0%, rgba(10, 15, 29, 0.15) 40%, rgba(10, 15, 29, 0.92) 100%)'
                    : 'linear-gradient(180deg, rgba(10, 15, 29, 0.45) 0%, rgba(10, 15, 29, 0.2) 45%, rgba(10, 15, 29, 0.88) 100%)',
                  transition: 'background 0.4s ease',
                }}
              />

              {/* Top Event Badge */}
              <div
                style={{
                  position: 'absolute',
                  top: '1.5rem',
                  ...(dir === 'rtl' ? { right: '1.5rem' } : { left: '1.5rem' }),
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.625rem',
                  padding: '0.6rem 1.125rem',
                  borderRadius: '100px',
                  backgroundColor: 'rgba(11, 15, 25, 0.82)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#FFFFFF',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
                  zIndex: 2,
                }}
              >
                <div
                  style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(246, 134, 33, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--color-orange-primary, #F68621)',
                  }}
                >
                  <ArrowUpRight size={14} />
                </div>
                <span>{t('latestEventCta')}</span>
              </div>



              {/* Bottom Card Bar: Title & External Action */}
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: 'clamp(1.25rem, 3vw, 2rem)',
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  zIndex: 2,
                }}
              >
                <div>
                  <div
                    style={{
                      display: 'inline-block',
                      color: 'var(--color-orange-primary, #F68621)',
                      fontSize: '0.8125rem',
                      fontWeight: 700,
                      marginBottom: '0.25rem',
                      letterSpacing: '0.04em',
                    }}
                  >
                    {tag}
                  </div>
                  <div
                    style={{
                      fontSize: 'clamp(1.125rem, 2vw, 1.5rem)',
                      fontWeight: 700,
                      color: '#FFFFFF',
                      fontFamily: 'var(--font-heading)',
                    }}
                  >
                    {title}
                  </div>
                </div>

                {/* Pill CTA button */}
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.625rem',
                    padding: '0.75rem 1.4rem',
                    borderRadius: '100px',
                    backgroundColor: isHovered
                      ? 'var(--color-orange-primary, #F68621)'
                      : 'rgba(255, 255, 255, 0.12)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: '#FFFFFF',
                    fontSize: '0.9375rem',
                    fontWeight: 700,
                    transition: 'all 0.3s ease',
                    boxShadow: isHovered ? '0 10px 25px rgba(246, 134, 33, 0.4)' : 'none',
                  }}
                >
                  <span>{t('latestEventCta')}</span>
                  <ArrowUpRight
                    size={18}
                    style={{
                      transform: isHovered
                        ? dir === 'rtl'
                          ? 'translate(-3px, -3px)'
                          : 'translate(3px, -3px)'
                        : 'none',
                      transition: 'transform 0.3s ease',
                    }}
                  />
                </div>
              </div>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
};
