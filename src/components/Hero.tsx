import React from 'react';
import { ArrowRight, Briefcase, TrendingUp, Building2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface HeroProps {
  onOpenContact: () => void;
  onViewWork: () => void;
  content?: {
    headlinePrefix_en?: string;
    headlinePrefix_ar?: string;
    headlineHighlight_en?: string;
    headlineHighlight_ar?: string;
    subtitle_en?: string;
    subtitle_ar?: string;
    backdropImage?: string;
    backdropVideo?: string;
  };
}

export const Hero: React.FC<HeroProps> = ({ onOpenContact, onViewWork, content }) => {
  const { t, dir, language } = useLanguage();

  const headlinePrefix = (language === 'ar' ? content?.headlinePrefix_ar : content?.headlinePrefix_en) || t('heroHeadlinePrefix');
  const headlineHighlight = (language === 'ar' ? content?.headlineHighlight_ar : content?.headlineHighlight_en) || t('heroHeadlineHighlight');
  const subtitle = (language === 'ar' ? content?.subtitle_ar : content?.subtitle_en) || t('heroSubtitle');
  const backdropImage = content?.backdropImage || 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=2000&auto=format&fit=crop';
  const backdropVideo = content?.backdropVideo;

  return (
    <section
      id="hero"
      style={{
        position: 'relative',
        minHeight: 'calc(100vh - 80px)',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        backgroundColor: 'var(--color-sec-hero-bg, var(--color-charcoal-dark))',
        color: 'var(--color-sec-hero-text, var(--color-white))',
        paddingTop: '3.5rem',
        paddingBottom: '4.5rem',
      }}
    >
      {/* Background Cinematic Video or Image with Layered Overlay */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1,
        }}
      >
        {backdropVideo ? (
          <video
            src={backdropVideo}
            autoPlay
            loop
            muted
            playsInline
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
              filter: 'brightness(0.38) contrast(1.1)',
            }}
          />
        ) : (
          <img
            src={backdropImage}
            alt="Cinematic immersive live event experience"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
              filter: 'brightness(0.38) contrast(1.1)',
            }}
          />
        )}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              'radial-gradient(circle at top right, rgba(246, 134, 33, 0.25) 0%, transparent 60%), linear-gradient(180deg, rgba(36,36,36,0.3) 0%, rgba(36,36,36,0.95) 100%)',
          }}
        />
      </div>

      <div className="container" style={{ position: 'relative', zIndex: 2, width: '100%' }}>
        <div
          style={{
            maxWidth: '920px',
          }}
        >
          {/* Large Editorial Headline */}
          <h1
            className="type-hero"
            style={{
              color: 'var(--color-sec-hero-text, var(--color-white))',
              marginBottom: '1.75rem',
              lineHeight: dir === 'rtl' ? 1.36 : 1.15,
            }}
          >
            <span>{headlinePrefix}</span>{' '}
            <span
              style={{
                color: 'var(--color-sec-hero-accent, var(--color-orange-primary))',
                position: 'relative',
                display: 'inline-block',
                paddingBottom: dir === 'rtl' ? '0.35rem' : '0.15rem',
              }}
            >
              {headlineHighlight}
              <svg
                style={{
                  position: 'absolute',
                  bottom: dir === 'rtl' ? '-6px' : '-8px',
                  left: 0,
                  right: 0,
                  width: '100%',
                  height: '8px',
                  pointerEvents: 'none',
                }}
                viewBox="0 0 100 12"
                preserveAspectRatio="none"
              >
                <path
                  d="M0,8 Q50,0 100,8"
                  fill="none"
                  stroke="var(--color-sec-hero-accent, var(--color-orange-primary))"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h1>

          {/* Subheading / Value Proposition */}
          <p
            className="type-body-lg"
            style={{
              color: 'var(--color-sec-hero-subtitle, rgba(255, 255, 255, 0.85))',
              maxWidth: '720px',
              marginBottom: '2.5rem',
              fontSize: '1.1875rem',
              lineHeight: 1.7,
            }}
          >
            {subtitle}
          </p>

          {/* Dual Action CTAs */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: '1rem',
              marginBottom: '3.5rem',
            }}
          >
            <button
              onClick={onOpenContact}
              className="btn btn-primary-orange"
              style={{
                padding: '1rem 2.25rem',
                fontSize: '1rem',
                fontWeight: 700,
                letterSpacing: '0.04em',
              }}
            >
              <span>{t('heroCtaPrimary')}</span>
              <ArrowRight
                size={18}
                style={{ transform: dir === 'rtl' ? 'rotate(180deg)' : 'none' }}
              />
            </button>

            <button
              onClick={onViewWork}
              className="btn"
              style={{
                padding: '1rem 2rem',
                fontSize: '1rem',
                fontWeight: 600,
                border: '1.5px solid var(--color-sec-hero-text, rgba(255, 255, 255, 0.4))',
                color: 'var(--color-sec-hero-text, var(--color-white))',
                backgroundColor: 'transparent',
              }}
            >
              <span>{t('heroCtaSecondary')}</span>
            </button>
          </div>

          {/* Impact Numbers Section */}
          <div
            style={{
              paddingTop: '2rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.15)',
            }}
          >
            {/* Header: Title & Subtitle */}
            <div style={{ marginBottom: '1.25rem' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.625rem',
                  marginBottom: '0.35rem',
                }}
              >
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--color-sec-hero-accent, var(--color-orange-primary))',
                    display: 'inline-block',
                    boxShadow: '0 0 12px var(--color-orange-primary)',
                  }}
                />
                <h3
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: 800,
                    color: 'var(--color-sec-hero-text, var(--color-white))',
                    fontFamily: 'var(--font-heading)',
                    margin: 0,
                    letterSpacing: '-0.01em',
                  }}
                >
                  {t('impactTitle')}
                </h3>
              </div>
              <p
                style={{
                  fontSize: '0.9375rem',
                  color: 'var(--color-sec-hero-subtitle, rgba(255, 255, 255, 0.75))',
                  margin: 0,
                  fontWeight: 400,
                }}
              >
                {t('impactSubtitle')}
              </p>
            </div>

            {/* Body: Stat Cards */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1.25rem',
              }}
            >
              {/* Stat 1 */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '0.875rem 1.25rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.04)',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(8px)',
                }}
              >
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(246, 134, 33, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--color-sec-hero-accent, var(--color-orange-primary))',
                    flexShrink: 0,
                  }}
                >
                  <Briefcase size={22} />
                </div>
                <div>
                  <span
                    style={{
                      display: 'block',
                      fontWeight: 800,
                      fontSize: '1.5rem',
                      lineHeight: 1.1,
                      fontFamily: 'var(--font-heading)',
                      color: 'var(--color-sec-hero-text, var(--color-white))',
                      letterSpacing: '-0.02em',
                    }}
                  >
                    {t('impactStat1Value')}
                  </span>
                  <span
                    style={{
                      display: 'block',
                      fontSize: '0.8125rem',
                      fontWeight: 500,
                      color: 'var(--color-sec-hero-subtitle, rgba(255, 255, 255, 0.7))',
                      marginTop: '0.25rem',
                    }}
                  >
                    {t('impactStat1Label')}
                  </span>
                </div>
              </div>

              {/* Stat 2 */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '0.875rem 1.25rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.04)',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(8px)',
                }}
              >
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(255, 212, 0, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--color-yellow-energy)',
                    flexShrink: 0,
                  }}
                >
                  <TrendingUp size={22} />
                </div>
                <div>
                  <span
                    style={{
                      display: 'block',
                      fontWeight: 800,
                      fontSize: '1.5rem',
                      lineHeight: 1.1,
                      fontFamily: 'var(--font-heading)',
                      color: 'var(--color-sec-hero-text, var(--color-white))',
                      letterSpacing: '-0.02em',
                    }}
                  >
                    {t('impactStat2Value')}
                  </span>
                  <span
                    style={{
                      display: 'block',
                      fontSize: '0.8125rem',
                      fontWeight: 500,
                      color: 'var(--color-sec-hero-subtitle, rgba(255, 255, 255, 0.7))',
                      marginTop: '0.25rem',
                    }}
                  >
                    {t('impactStat2Label')}
                  </span>
                </div>
              </div>

              {/* Stat 3 */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '0.875rem 1.25rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.04)',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(8px)',
                }}
              >
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(247, 158, 125, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--color-peach-warmth)',
                    flexShrink: 0,
                  }}
                >
                  <Building2 size={22} />
                </div>
                <div>
                  <span
                    style={{
                      display: 'block',
                      fontWeight: 800,
                      fontSize: '1.5rem',
                      lineHeight: 1.1,
                      fontFamily: 'var(--font-heading)',
                      color: 'var(--color-sec-hero-text, var(--color-white))',
                      letterSpacing: '-0.02em',
                    }}
                  >
                    {t('impactStat3Value')}
                  </span>
                  <span
                    style={{
                      display: 'block',
                      fontSize: '0.8125rem',
                      fontWeight: 500,
                      color: 'var(--color-sec-hero-subtitle, rgba(255, 255, 255, 0.7))',
                      marginTop: '0.25rem',
                    }}
                  >
                    {t('impactStat3Label')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
