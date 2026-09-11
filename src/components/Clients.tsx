import React from 'react';
import { ClientItem } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface ClientsProps {
  clients: ClientItem[];
}

export const Clients: React.FC<ClientsProps> = ({ clients }) => {
  const { language, t } = useLanguage();

  return (
    <section id="clients" className="section" style={{ backgroundColor: 'var(--color-sec-clients-bg, #FFFFFF)', borderBottom: '1px solid var(--color-border)' }}>
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 3rem auto' }}>
          <span className="type-eyebrow" style={{ color: 'var(--color-sec-clients-accent, var(--color-orange-primary))' }}>
            {t('clientsEyebrow')}
          </span>
          <h2 className="type-h2" style={{ color: 'var(--color-sec-clients-text, var(--color-charcoal-dark))', marginBottom: '0.75rem' }}>
            {t('clientsHeading')}
          </h2>
          <p className="type-body" style={{ color: 'var(--color-sec-clients-subtitle, var(--color-body-gray))', lineHeight: 1.7 }}>
            {t('clientsSubtitle')}
          </p>
        </div>

        {/* Client Logos Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.25rem',
            alignItems: 'center',
          }}
        >
          {clients.map((client, idx) => {
            const name = language === 'ar' && client.name_ar ? client.name_ar : client.name;
            const industry = language === 'ar' && client.industry_ar ? client.industry_ar : client.industry;

            return (
              <div
                key={client._id || idx}
                style={{
                  backgroundColor: 'var(--color-sec-clients-card-bg, var(--color-gray-light))',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.75rem 1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid rgba(0, 0, 0, 0.05)',
                  transition: 'all var(--transition-normal)',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-sec-clients-accent, var(--color-orange-primary))';
                  e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                  e.currentTarget.style.transform = 'translateY(-3px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.05)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {/* Wordmark */}
                <div
                  style={{
                    fontSize: '1.2rem',
                    fontWeight: 800,
                    letterSpacing: language === 'ar' ? 'normal' : '-0.02em',
                    color: 'var(--color-sec-clients-card-text, var(--color-charcoal-dark))',
                    textTransform: language === 'ar' ? 'none' : 'uppercase',
                    marginBottom: '0.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    textAlign: 'center',
                  }}
                >
                  <span>{name}</span>
                  <span
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--color-sec-clients-accent, var(--color-orange-primary))',
                      display: 'inline-block',
                      flexShrink: 0,
                    }}
                  />
                </div>

                <span
                  style={{
                    fontSize: '0.75rem',
                    color: 'var(--color-sec-clients-card-text, var(--color-body-light))',
                    opacity: 0.75,
                    fontWeight: 500,
                    textAlign: 'center',
                  }}
                >
                  {industry}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
