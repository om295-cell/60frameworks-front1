import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface FinalCTAProps {
  onOpenContact: () => void;
  content?: {
    eyebrow_en?: string;
    eyebrow_ar?: string;
    heading_en?: string;
    heading_ar?: string;
    subtitle_en?: string;
    subtitle_ar?: string;
    buttonText_en?: string;
    buttonText_ar?: string;
  };
}

export const FinalCTA: React.FC<FinalCTAProps> = ({ onOpenContact, content }) => {
  const { t, dir, language } = useLanguage();

  const eyebrow = (language === 'ar' ? content?.eyebrow_ar : content?.eyebrow_en) || t('finalCtaEyebrow');
  const heading = (language === 'ar' ? content?.heading_ar : content?.heading_en) || t('finalCtaHeading');
  const subtitle = (language === 'ar' ? content?.subtitle_ar : content?.subtitle_en) || t('finalCtaSubtitle');
  const buttonText = (language === 'ar' ? content?.buttonText_ar : content?.buttonText_en) || t('finalCtaButton');

  return (
    <section className="section bg-orange-brand" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Decorative Radial Lighting Overlays */}
      <div
        style={{
          position: 'absolute',
          top: '-50%',
          right: '-20%',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          backgroundColor: 'rgba(255, 212, 0, 0.15)',
          filter: 'blur(80px)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-40%',
          left: '-10%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          backgroundColor: 'rgba(247, 158, 125, 0.25)',
          filter: 'blur(70px)',
          pointerEvents: 'none',
        }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <div
          style={{
            textAlign: 'center',
            maxWidth: '840px',
            margin: '0 auto',
          }}
        >
          {/* Eyebrow */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(6px)',
              padding: '0.4rem 1rem',
              borderRadius: 'var(--radius-full)',
              marginBottom: '1.75rem',
              border: '1px solid rgba(255, 255, 255, 0.3)',
            }}
          >
            <Sparkles size={16} color="var(--color-white)" />
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                color: 'var(--color-white)',
              }}
            >
              {eyebrow}
            </span>
          </div>

          {/* Headline */}
          <h2
            className="type-hero"
            style={{
              color: 'var(--color-white)',
              marginBottom: '1.5rem',
              lineHeight: 1.15,
            }}
          >
            {heading}
          </h2>

          {/* Description */}
          <p
            className="type-body-lg"
            style={{
              color: 'rgba(255, 255, 255, 0.95)',
              maxWidth: '680px',
              margin: '0 auto 2.5rem auto',
              fontSize: '1.1875rem',
              lineHeight: 1.7,
            }}
          >
            {subtitle}
          </p>

          {/* Contrasting White Primary Button */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button
              onClick={onOpenContact}
              className="btn btn-white-action"
              style={{
                padding: '1.125rem 2.75rem',
                fontSize: '1.0625rem',
                borderRadius: 'var(--radius-full)',
              }}
            >
              <span>{buttonText}</span>
              <ArrowRight
                size={20}
                style={{ transform: dir === 'rtl' ? 'rotate(180deg)' : 'none' }}
              />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
