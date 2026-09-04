import React from 'react';
import { Testimonial } from '../types';
import { Quote, Star } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface TestimonialsProps {
  testimonials: Testimonial[];
}

export const Testimonials: React.FC<TestimonialsProps> = ({ testimonials }) => {
  const { language, t } = useLanguage();

  return (
    <section id="testimonials" className="section bg-blush-softness">
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 3.5rem auto' }}>
          <span className="type-eyebrow" style={{ color: 'var(--color-charcoal-dark)' }}>
            {t('testEyebrow')}
          </span>
          <h2 className="type-h1" style={{ color: 'var(--color-charcoal-dark)', marginBottom: '1rem' }}>
            {t('testHeading')}
          </h2>
          <p className="type-body-lg" style={{ color: 'rgba(36,36,36,0.85)', lineHeight: 1.7 }}>
            {t('testSubtitle')}
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
            const quote = language === 'ar' && item.quote_ar ? item.quote_ar : item.quote;
            const author = language === 'ar' && item.authorName_ar ? item.authorName_ar : item.authorName;
            const role = language === 'ar' && item.authorRole_ar ? item.authorRole_ar : item.authorRole;
            const org = language === 'ar' && item.organization_ar ? item.organization_ar : item.organization;
            const metric = language === 'ar' && item.metricHighlight_ar ? item.metricHighlight_ar : item.metricHighlight;

            return (
              <div
                key={item._id || idx}
                className="card-hover-lift"
                style={{
                  backgroundColor: 'var(--color-white)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '2.5rem 2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: 'var(--shadow-md)',
                  position: 'relative',
                  border: '1px solid rgba(255, 255, 255, 0.9)',
                }}
              >
                {/* Orange Quotation Accent Icon */}
                <div>
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--color-orange-subtle)',
                      color: 'var(--color-orange-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '1.5rem',
                    }}
                  >
                    <Quote size={24} />
                  </div>

                  {/* Rating Stars */}
                  <div style={{ display: 'flex', gap: '4px', marginBottom: '1rem' }}>
                    {[...Array(item.rating || 5)].map((_, sIdx) => (
                      <Star key={sIdx} size={16} fill="var(--color-yellow-energy)" color="var(--color-yellow-energy)" />
                    ))}
                  </div>

                  {/* Quote Text */}
                  <p
                    style={{
                      fontSize: '1rem',
                      lineHeight: 1.7,
                      color: 'var(--color-charcoal-dark)',
                      fontStyle: 'italic',
                      marginBottom: '1.75rem',
                    }}
                  >
                    "{quote}"
                  </p>
                </div>

                <div>
                  {/* Metric Highlight Badge */}
                  {metric && (
                    <div
                      style={{
                        display: 'inline-block',
                        backgroundColor: 'var(--color-blush-subtle)',
                        color: 'var(--color-orange-primary)',
                        padding: '0.35rem 0.85rem',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        marginBottom: '1.25rem',
                        border: '1px solid rgba(246, 134, 33, 0.2)',
                      }}
                    >
                      ★ {metric}
                    </div>
                  )}

                  {/* Author Info */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      paddingTop: '1.25rem',
                      borderTop: '1px solid var(--color-gray-structure)',
                    }}
                  >
                    <img
                      src={item.avatarUrl}
                      alt={author}
                      style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '2px solid var(--color-orange-primary)',
                      }}
                    />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--color-charcoal-dark)' }}>
                        {author}
                      </div>
                      <div style={{ fontSize: '0.8125rem', color: 'var(--color-body-light)' }}>
                        {role}، <strong style={{ color: 'var(--color-body-gray)' }}>{org}</strong>
                      </div>
                    </div>
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
