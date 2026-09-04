import React, { useState } from 'react';
import { Sector } from '../types';
import {
  Landmark,
  Building2,
  HeartPulse,
  GraduationCap,
  Building,
  Cpu,
  Utensils,
  Factory,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface SectorsProps {
  sectors: Sector[];
  onOpenContact: (sectorName: string) => void;
}

export const Sectors: React.FC<SectorsProps> = ({ sectors, onOpenContact }) => {
  const { language, t, dir } = useLanguage();
  const [activeSectorIndex, setActiveSectorIndex] = useState(0);

  const getSectorIcon = (iconName: string) => {
    switch (iconName) {
      case 'Landmark':
        return <Landmark size={20} />;
      case 'Building2':
        return <Building2 size={20} />;
      case 'HeartPulse':
        return <HeartPulse size={20} />;
      case 'GraduationCap':
        return <GraduationCap size={20} />;
      case 'Building':
        return <Building size={20} />;
      case 'Cpu':
        return <Cpu size={20} />;
      case 'Utensils':
        return <Utensils size={20} />;
      case 'Factory':
        return <Factory size={20} />;
      default:
        return <Building2 size={20} />;
    }
  };

  const activeSector = sectors[activeSectorIndex] || sectors[0];

  const activeSectorName = language === 'ar' && activeSector?.name_ar ? activeSector.name_ar : activeSector?.name;
  const activeSectorDesc = language === 'ar' && activeSector?.description_ar ? activeSector.description_ar : activeSector?.description;
  const activeSectorCapabilities = language === 'ar' && activeSector?.capabilities_ar && activeSector.capabilities_ar.length > 0
    ? activeSector.capabilities_ar
    : activeSector?.capabilities;

  return (
    <section id="sectors" className="section bg-blush-softness">
      <div className="container">
        {/* Section Header */}
        <div style={{ maxWidth: '750px', marginBottom: '3.5rem' }}>
          <span className="type-eyebrow" style={{ color: 'var(--color-sec-sectors-accent, var(--color-orange-primary))' }}>
            {t('sectorsEyebrow')}
          </span>
          <h2 className="type-h1" style={{ color: 'var(--color-sec-sectors-text, var(--color-charcoal-dark))', marginBottom: '1rem' }}>
            {t('sectorsHeading')}
          </h2>
          <p className="type-body-lg" style={{ color: 'var(--color-sec-sectors-subtitle, var(--color-charcoal-dark))', lineHeight: 1.7 }}>
            {t('sectorsSubtitle')}
          </p>
        </div>

        {/* Interactive Editorial Split Layout */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2.5rem',
            alignItems: 'stretch',
          }}
        >
          {/* Left Column: Interactive Sector List */}
          <div
            style={{
              backgroundColor: 'var(--color-sec-sectors-card-bg, rgba(255, 255, 255, 0.75))',
              backdropFilter: 'blur(10px)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.25rem',
              border: '1px solid rgba(255, 255, 255, 0.9)',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
            }}
          >
            {sectors.map((sector, index) => {
              const isActive = activeSectorIndex === index;
              const sectorName = language === 'ar' && sector.name_ar ? sector.name_ar : sector.name;

              return (
                <button
                  key={sector.slug || index}
                  onClick={() => setActiveSectorIndex(index)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    padding: '1rem 1.25rem',
                    borderRadius: 'var(--radius-md)',
                    border: 'none',
                    backgroundColor: isActive ? 'var(--color-sec-sectors-accent, var(--color-orange-primary))' : 'transparent',
                    color: isActive ? '#FFFFFF' : 'var(--color-sec-sectors-card-text, var(--color-charcoal-dark))',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)',
                    textAlign: dir === 'rtl' ? 'right' : 'left',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.4)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                    <span
                      style={{
                        color: isActive ? '#FFFFFF' : 'var(--color-sec-sectors-accent, var(--color-orange-primary))',
                        display: 'flex',
                      }}
                    >
                      {getSectorIcon(sector.icon)}
                    </span>
                    <span
                      style={{
                        fontSize: '0.9375rem',
                        fontWeight: isActive ? 700 : 600,
                      }}
                    >
                      {sectorName}
                    </span>
                  </div>

                  <ArrowRight
                    size={16}
                    color={isActive ? '#FFFFFF' : 'currentColor'}
                    style={{
                      transform: isActive
                        ? dir === 'rtl'
                          ? 'translateX(-4px) rotate(180deg)'
                          : 'translateX(4px)'
                        : dir === 'rtl'
                        ? 'rotate(180deg)'
                        : 'none',
                      transition: 'transform var(--transition-fast)',
                    }}
                  />
                </button>
              );
            })}
          </div>

          {/* Right Column: Active Sector Spotlight Showcase */}
          {activeSector && (
            <div
              style={{
                backgroundColor: 'var(--color-sec-sectors-card-bg, var(--color-white))',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-md)',
                display: 'flex',
                flexDirection: 'column',
                border: '1px solid rgba(255, 255, 255, 0.8)',
              }}
            >
              {/* Sector Photography */}
              <div
                className="image-zoom-container"
                style={{
                  height: '240px',
                  backgroundColor: 'var(--color-gray-structure)',
                }}
              >
                <img
                  src={activeSector.imageUrl}
                  alt={activeSectorName}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </div>

              {/* Sector Content Breakdown */}
              <div
                style={{
                  padding: '2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  flex: 1,
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <span className="pill-badge pill-orange">{t('sectorBadge')}</span>
                  </div>

                  <h3
                    className="type-h3"
                    style={{
                      color: 'var(--color-sec-sectors-card-text, var(--color-charcoal-dark))',
                      marginBottom: '1rem',
                    }}
                  >
                    {activeSectorName}
                  </h3>

                  <p
                    style={{
                      fontSize: '0.9375rem',
                      lineHeight: 1.65,
                      color: 'var(--color-sec-sectors-card-text, var(--color-body-gray))',
                      opacity: 0.85,
                      marginBottom: '1.5rem',
                    }}
                  >
                    {activeSectorDesc}
                  </p>

                  {/* Specific Capabilities */}
                  <div style={{ marginBottom: '2rem' }}>
                    <h4
                      style={{
                        fontSize: '0.8125rem',
                        fontWeight: 700,
                        textTransform: language === 'ar' ? 'none' : 'uppercase',
                        letterSpacing: language === 'ar' ? 'normal' : '0.06em',
                        color: 'var(--color-sec-sectors-card-text, var(--color-charcoal-dark))',
                        marginBottom: '0.75rem',
                      }}
                    >
                      {t('sectorKeyCapabilities')}
                    </h4>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                        gap: '0.625rem',
                      }}
                    >
                      {activeSectorCapabilities?.map((cap, cIdx) => (
                        <div
                          key={cIdx}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            fontSize: '0.84375rem',
                            color: 'var(--color-sec-sectors-card-text, var(--color-charcoal-dark))',
                            fontWeight: 500,
                          }}
                        >
                          <CheckCircle2 size={16} color="var(--color-sec-sectors-accent, var(--color-orange-primary))" />
                          <span>{cap}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onOpenContact(`${t('sectorCtaPrefix')}${activeSectorName}`)}
                  className="btn btn-primary-orange"
                  style={{
                    alignSelf: 'flex-start',
                    padding: '0.75rem 1.75rem',
                  }}
                >
                  <span>{t('sectorCtaPrefix')}{activeSectorName}</span>
                  <ArrowRight
                    size={16}
                    style={{ transform: dir === 'rtl' ? 'rotate(180deg)' : 'none' }}
                  />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
