import React from 'react';
import { Testimonial } from '../types';
import { Quote, Star } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface TestimonialsProps {
  testimonials: Testimonial[];
  content?: {
    eyebrow_en?: string;
    eyebrow_ar?: string;
    heading_en?: string;
    heading_ar?: string;
    subtitle_en?: string;
    subtitle_ar?: string;
  };
}

export const Testimonials: React.FC<TestimonialsProps> = ({ testimonials, content }) => {
  const { t } = useLanguage();

  // Testimonials are strictly kept in Arabic across both language modes
  const heading = content?.heading_ar || t('testHeading') || 'ثقة نعتز بها، وأثر يتحدث عنّا';
  const subtitle = content?.subtitle_ar || t('testSubtitle') || 'تجارب شركائنا تعكس التزامنا بصناعة أعمال إبداعية تتجاوز التوقعات وتترك أثرًا يستمر.';
  const eyebrow = content?.eyebrow_ar || t('testEyebrow');

  return (
    <section id="testimonials" className="section" style={{ backgroundColor: 'var(--color-sec-testimonials-bg, #F4D3C9)' }}>
      <div className="container" dir="rtl">
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 3.5rem auto' }}>
          {eyebrow && eyebrow.trim() !== '' && (
            <span
              className="type-eyebrow"
              style={{
                color: 'var(--color-sec-testimonials-accent, var(--color-orange-primary))',
                fontFamily: "'Cairo', 'Tajawal', sans-serif",
                display: 'inline-block',
                marginBottom: '0.75rem',
              }}
            >
              {eyebrow}
            </span>
          )}
          <h2
            className="type-h1"
            style={{
              color: 'var(--color-sec-testimonials-text, var(--color-charcoal-dark))',
              marginBottom: '1rem',
              fontFamily: "'Cairo', 'Tajawal', sans-serif",
              fontWeight: 800,
            }}
          >
            {heading}
          </h2>
          <p
            className="type-body-lg"
            style={{
              color: 'var(--color-sec-testimonials-subtitle, rgba(36,36,36,0.85))',
              lineHeight: 1.8,
              fontFamily: "'Cairo', 'Tajawal', sans-serif",
              fontSize: '1.125rem',
            }}
          >
            {subtitle}
          </p>
        </div>

        {/* Testimonial Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2rem',
          }}
        >
          {testimonials.map((item, idx) => {
            // Always display Arabic in both pages
            const quote = item.quote_ar || item.quote;
            const author = item.authorName_ar || item.authorName;
            const role = item.authorRole_ar || item.authorRole;

            // Strip existing quotes so we format cleanly with « ... »
            const cleanedQuote = quote.replace(/^[«"'\s]+|[»"'\s]+$/g, '');

            return (
              <div
                key={item._id || idx}
                className="card-hover-lift"
                style={{
                  backgroundColor: 'var(--color-sec-testimonials-card-bg, var(--color-white))',
                  borderRadius: 'var(--radius-lg)',
                  padding: '2.5rem 2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: 'var(--shadow-md)',
                  position: 'relative',
                  border: '1px solid rgba(0, 0, 0, 0.06)',
                  textAlign: 'right',
                }}
              >
                <div>
                  {/* Top Bar: Quotation Accent Icon & 5 Stars */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '1.5rem',
                    }}
                  >
                    <div
                      style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--color-orange-subtle)',
                        color: 'var(--color-sec-testimonials-accent, var(--color-orange-primary))',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Quote size={22} />
                    </div>

                    {/* 5 Stars Rating */}
                    <div style={{ display: 'flex', gap: '3px' }} aria-label="5 stars rating">
                      {[...Array(item.rating || 5)].map((_, sIdx) => (
                        <Star key={sIdx} size={18} fill="#FFB800" color="#FFB800" />
                      ))}
                    </div>
                  </div>

                  {/* Quote Text */}
                  <p
                    style={{
                      fontSize: '1.05rem',
                      lineHeight: 1.85,
                      color: 'var(--color-sec-testimonials-card-text, var(--color-charcoal-dark))',
                      fontFamily: "'Cairo', 'Tajawal', sans-serif",
                      marginBottom: '2rem',
                      fontWeight: 500,
                    }}
                  >
                    «{cleanedQuote}»
                  </p>
                </div>

                {/* Author Info: Name & Role only (No pictures, No company names) */}
                <div
                  style={{
                    paddingTop: '1.25rem',
                    borderTop: '1px solid rgba(128, 128, 128, 0.15)',
                  }}
                >
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: '0.975rem',
                      color: 'var(--color-sec-testimonials-card-text, var(--color-charcoal-dark))',
                      fontFamily: "'Cairo', 'Tajawal', sans-serif",
                      display: 'flex',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '0.4rem',
                    }}
                  >
                    <span>{author}</span>
                    {role && (
                      <>
                        <span style={{ opacity: 0.5 }}>—</span>
                        <span
                          style={{
                            fontWeight: 600,
                            color: 'var(--color-sec-testimonials-accent, var(--color-orange-primary))',
                            fontSize: '0.9rem',
                          }}
                        >
                          {role}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
