import React, { useState, useMemo } from 'react';
import { ClientItem } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { FALLBACK_CLIENTS } from '../services/api';
import { Sparkles, Search, ShieldCheck, Building2, Landmark, UtensilsCrossed } from 'lucide-react';

interface ClientsProps {
  clients: ClientItem[];
  content?: {
    eyebrow_en?: string;
    eyebrow_ar?: string;
    heading_en?: string;
    heading_ar?: string;
    subtitle_en?: string;
    subtitle_ar?: string;
  };
}

export const Clients: React.FC<ClientsProps> = ({ clients, content }) => {
  const { language, t } = useLanguage();
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'gov' | 'enterprise' | 'lifestyle'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Merge provided clients with FALLBACK_CLIENTS to ensure logoUrl and real partners from شركا النجاح.ai are always populated
  const effectiveClients: ClientItem[] = useMemo(() => {
    if (clients && clients.length > 0 && clients.some(c => c.logoUrl)) {
      return clients;
    }
    return FALLBACK_CLIENTS;
  }, [clients]);

  // Categorize clients
  const categorizedClients = useMemo(() => {
    return effectiveClients.map(client => {
      const name = (client.name || '').toLowerCase();
      const nameAr = client.name_ar || '';
      const ind = (client.industry || '').toLowerCase();
      const indAr = client.industry_ar || '';

      let category: 'gov' | 'enterprise' | 'lifestyle' = 'enterprise';

      if (
        name.includes('ministry') ||
        name.includes('government') ||
        name.includes('saudi electricity') ||
        name.includes('king faisal') ||
        name.includes('umm al-qura') ||
        name.includes('falcon') ||
        nameAr.includes('وزارة') ||
        nameAr.includes('جامعة') ||
        nameAr.includes('مستشفى') ||
        nameAr.includes('الكهرباء') ||
        nameAr.includes('حكومي') ||
        nameAr.includes('سيادي') ||
        nameAr.includes('شعار') ||
        ind.includes('energy') ||
        ind.includes('government') ||
        indAr.includes('حكومي')
      ) {
        category = 'gov';
      } else if (
        name.includes('diriyah') ||
        name.includes('vox') ||
        name.includes('baytoti') ||
        name.includes('anoosh') ||
        name.includes('maki') ||
        name.includes('awja') ||
        name.includes('pance') ||
        name.includes('sign') ||
        name.includes('qma') ||
        name.includes('vigour') ||
        name.includes('hashem') ||
        name.includes('lishlazz') ||
        name.includes('hike') ||
        name.includes('criticism') ||
        name.includes('translation') ||
        name.includes('almajlis') ||
        name.includes('mrsool') ||
        nameAr.includes('موسم') ||
        nameAr.includes('سينما') ||
        nameAr.includes('مطعم') ||
        nameAr.includes('ضيافة') ||
        nameAr.includes('زهور') ||
        nameAr.includes('حلويات') ||
        nameAr.includes('أزياء') ||
        nameAr.includes('هايك') ||
        nameAr.includes('نقد') ||
        nameAr.includes('ترجمة') ||
        nameAr.includes('مرسول') ||
        nameAr.includes('ترفيه') ||
        ind.includes('dining') ||
        ind.includes('culture') ||
        indAr.includes('ضيافة')
      ) {
        category = 'lifestyle';
      }

      return {
        ...client,
        filterCategory: category,
      };
    });
  }, [effectiveClients]);

  const filteredClients = useMemo(() => {
    return categorizedClients.filter(c => {
      const matchesFilter = selectedFilter === 'all' || c.filterCategory === selectedFilter;
      const query = searchQuery.trim().toLowerCase();
      if (!query) return matchesFilter;

      const nameMatch = (c.name || '').toLowerCase().includes(query);
      const nameArMatch = (c.name_ar || '').includes(query);
      const indMatch = (c.industry || '').toLowerCase().includes(query);
      const indArMatch = (c.industry_ar || '').includes(query);

      return matchesFilter && (nameMatch || nameArMatch || indMatch || indArMatch);
    });
  }, [categorizedClients, selectedFilter, searchQuery]);

  // Curated Main Brands for the moving bar
  const marqueeRow1 = useMemo(() => {
    // Row 1: Sovereign Authorities, Ministries & National Mega-Events
    const keys = [
      'saudi-electricity', 'ministry-transport', 'ministry-industry', 'ministry-sport',
      'hrsd-ministry', 'king-faisal-hospital', 'diriyah-season', 'umm-al-qura',
      'translation-forum', 'film-criticism', 'mrsool-park'
    ];
    const matches = effectiveClients.filter(c => 
      keys.some(k => (c.logoUrl || '').includes(k) || (c.name || '').toLowerCase().includes(k))
    );
    return matches.length >= 6 ? matches : effectiveClients.slice(0, Math.ceil(effectiveClients.length / 2));
  }, [effectiveClients]);

  const marqueeRow2 = useMemo(() => {
    // Row 2: Global Mobility, Tech, Enterprise & Investment Titans
    const keys = [
      'toyota', 'lexus', 'mg-cars', 'huawei', 'bing', 'vox-cinemas',
      'abyan-capital', 'hexagon', 'logiscool', 'saed', 'almajlis-alkhaleeji'
    ];
    const matches = effectiveClients.filter(c => 
      keys.some(k => (c.logoUrl || '').includes(k) || (c.name || '').toLowerCase().includes(k))
    );
    return matches.length >= 6 ? matches : effectiveClients.slice(Math.ceil(effectiveClients.length / 2));
  }, [effectiveClients]);

  const eyebrowText = (language === 'ar' 
    ? (content?.eyebrow_ar && content.eyebrow_ar !== 'ثقة كبرى الكيانات والرواد' ? content.eyebrow_ar : 'شركاؤنا') 
    : (content?.eyebrow_en && content.eyebrow_en !== 'TRUSTED BY INDUSTRY TITANS' ? content.eyebrow_en : 'OUR PARTNERS')) 
    || t('clientsEyebrow') || (language === 'ar' ? 'شركاؤنا' : 'OUR PARTNERS');

  const headingText = language === 'ar'
    ? (content?.heading_ar && content.heading_ar !== 'شركاء النجاح للهيئات السيادية والمؤسسات العالمية.' ? content.heading_ar : 'شركاء النجاح')
    : (content?.heading_en && !content.heading_en.includes('Sovereign') ? content.heading_en : 'Partners in Success');

  const subtitleText = language === 'ar'
    ? (content?.subtitle_ar && !content.subtitle_ar.startsWith('نصنع الفعاليات للجهات') ? content.subtitle_ar : 'ثقة صنعت أثرًا:')
    : (content?.subtitle_en && !content.subtitle_en.includes('architect') ? content.subtitle_en : 'Trust That Created Impact:');

  return (
    <section
      id="clients"
      className="section"
      style={{
        backgroundColor: 'var(--color-sec-clients-bg, #FFFFFF)',
        borderBottom: '1px solid var(--color-border)',
        paddingTop: '6rem',
        paddingBottom: '6rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background Subtle Gradient Glow */}
      <div
        style={{
          position: 'absolute',
          top: '-10%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '800px',
          height: '400px',
          background: 'radial-gradient(ellipse at center, rgba(246, 134, 33, 0.06), transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 3.5rem auto' }}>
          {/* Eyebrow Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.4rem 1.1rem',
              borderRadius: '9999px',
              backgroundColor: 'rgba(246, 134, 33, 0.1)',
              border: '1px solid rgba(246, 134, 33, 0.25)',
              marginBottom: '1rem',
            }}
          >
            <Sparkles size={14} color="var(--color-sec-clients-accent, #F68621)" />
            <span
              className="type-eyebrow"
              style={{
                color: 'var(--color-sec-clients-accent, #F68621)',
                fontWeight: 700,
                fontSize: '0.78rem',
                letterSpacing: language === 'ar' ? '0' : '0.12em',
                textTransform: 'uppercase',
              }}
            >
              {eyebrowText}
            </span>
          </div>

          {/* Heading: شركاء النجاح */}
          <h2
            className="type-h2"
            style={{
              color: 'var(--color-sec-clients-text, var(--color-charcoal-dark, #1A1A1A))',
              marginBottom: '0.75rem',
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 800,
              lineHeight: 1.25,
            }}
          >
            {headingText}
          </h2>

          {/* Subtitle Under It: ثقة صنعت أثرًا */}
          <div style={{ marginTop: '0.5rem', marginBottom: '1.25rem' }}>
            <span
              style={{
                display: 'inline-block',
                fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)',
                fontWeight: 800,
                color: 'var(--color-sec-clients-accent, #F68621)',
                background: 'linear-gradient(135deg, #F68621 0%, #D96500 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                position: 'relative',
                paddingBottom: '0.35rem',
              }}
            >
              {subtitleText}
              <span
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: '20%',
                  right: '20%',
                  height: '2px',
                  background: 'linear-gradient(90deg, transparent, #F68621, transparent)',
                }}
              />
            </span>
          </div>

          <p
            className="type-body"
            style={{
              color: 'var(--color-sec-clients-subtitle, var(--color-body-gray, #64748B))',
              lineHeight: 1.8,
              fontSize: '1.05rem',
              maxWidth: '640px',
              margin: '0 auto',
            }}
          >
            {language === 'ar'
              ? 'نفخر بمسيرتنا المشتركة مع كبرى الهيئات السيادية، الوزارات الوطنية، والمؤسسات العالمية لنصنع تجارب استثنائية وبصمة فارقة تخلد في الذاكرة.'
              : 'Proud to collaborate with sovereign ministries, global titans, and market visionaries to engineer landmark physical and digital moments.'}
          </p>
        </div>

        {/* Dynamic Continuous Marquee Ticker - Premium Brand Ribbon */}
        <div className="brand-ribbon-wrapper">
          <div className="brand-ribbon-header">
            <span className="brand-ribbon-line" />
            <span className="brand-ribbon-badge">
              <Sparkles size={13} color="var(--color-sec-clients-accent, #F68621)" />
              {language === 'ar' ? 'شراكات استراتيجية وعلامات عالمية رائدة' : 'STRATEGIC ALLIANCES & GLOBAL BRANDS'}
            </span>
            <span className="brand-ribbon-line" />
          </div>

          {/* Row 1 - Left */}
          <div className="marquee-container" style={{ marginBottom: '1.25rem' }}>
            <div className="marquee-track-left">
              {[...marqueeRow1, ...marqueeRow1].map((client, idx) => (
                <div
                  key={`m1-${client.name}-${idx}`}
                  className="marquee-brand-item"
                  title={language === 'ar' && client.name_ar ? client.name_ar : client.name}
                >
                  {client.logoUrl ? (
                    <img
                      src={client.logoUrl}
                      alt={language === 'ar' && client.name_ar ? client.name_ar : client.name}
                      className="marquee-brand-logo"
                      loading="eager"
                      draggable={false}
                    />
                  ) : (
                    <span className="marquee-brand-text">
                      {language === 'ar' && client.name_ar ? client.name_ar : client.name}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Row 2 - Right */}
          <div className="marquee-container">
            <div className="marquee-track-right">
              {[...marqueeRow2, ...marqueeRow2].map((client, idx) => (
                <div
                  key={`m2-${client.name}-${idx}`}
                  className="marquee-brand-item"
                  title={language === 'ar' && client.name_ar ? client.name_ar : client.name}
                >
                  {client.logoUrl ? (
                    <img
                      src={client.logoUrl}
                      alt={language === 'ar' && client.name_ar ? client.name_ar : client.name}
                      className="marquee-brand-logo"
                      loading="eager"
                      draggable={false}
                    />
                  ) : (
                    <span className="marquee-brand-text">
                      {language === 'ar' && client.name_ar ? client.name_ar : client.name}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Filter Controls & Search */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            marginBottom: '2.5rem',
            padding: '1rem 1.5rem',
            backgroundColor: 'var(--color-sec-clients-card-bg, #F8FAFC)',
            borderRadius: '18px',
            border: '1px solid rgba(0, 0, 0, 0.06)',
          }}
        >
          {/* Category Tabs */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {[
              { id: 'all', label: language === 'ar' ? 'جميع الشركاء' : 'All Partners', count: categorizedClients.length, icon: Sparkles },
              { id: 'gov', label: language === 'ar' ? 'جهات حكومية وسيادية' : 'Government & Sovereign', count: categorizedClients.filter(c => c.filterCategory === 'gov').length, icon: Landmark },
              { id: 'enterprise', label: language === 'ar' ? 'شركات كبرى ونقل' : 'Enterprise & Mobility', count: categorizedClients.filter(c => c.filterCategory === 'enterprise').length, icon: Building2 },
              { id: 'lifestyle', label: language === 'ar' ? 'ثقافة وترفيه وضيافة' : 'Culture & Hospitality', count: categorizedClients.filter(c => c.filterCategory === 'lifestyle').length, icon: UtensilsCrossed },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = selectedFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedFilter(tab.id as any)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    padding: '0.55rem 1.1rem',
                    borderRadius: '9999px',
                    fontSize: '0.88rem',
                    fontWeight: isActive ? 700 : 500,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    border: isActive ? '1px solid #F68621' : '1px solid rgba(0, 0, 0, 0.08)',
                    backgroundColor: isActive ? '#F68621' : 'var(--color-white, #FFFFFF)',
                    color: isActive ? '#FFFFFF' : 'var(--color-charcoal-dark, #334155)',
                    boxShadow: isActive ? '0 4px 12px rgba(246, 134, 33, 0.25)' : 'none',
                  }}
                >
                  <Icon size={14} />
                  <span>{tab.label}</span>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      padding: '0.1rem 0.45rem',
                      borderRadius: '9999px',
                      backgroundColor: isActive ? 'rgba(255, 255, 255, 0.25)' : 'rgba(0, 0, 0, 0.06)',
                      color: isActive ? '#FFFFFF' : '#64748B',
                      fontWeight: 600,
                    }}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Quick Search */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: 'var(--color-white, #FFFFFF)',
              border: '1px solid rgba(0, 0, 0, 0.1)',
              borderRadius: '9999px',
              padding: '0.45rem 1rem',
              minWidth: '220px',
            }}
          >
            <Search size={15} color="#94A3B8" />
            <input
              type="text"
              placeholder={language === 'ar' ? 'بحث عن شريك...' : 'Search partner...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                border: 'none',
                outline: 'none',
                background: 'transparent',
                fontSize: '0.85rem',
                width: '100%',
                color: 'var(--color-charcoal-dark, #1E293B)',
                fontFamily: 'inherit',
              }}
            />
          </div>
        </div>

        {/* Client Logos Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: '1.25rem',
            alignItems: 'stretch',
          }}
        >
          {filteredClients.map((client, idx) => {
            const name = language === 'ar' && client.name_ar ? client.name_ar : client.name;
            const industry = language === 'ar' && client.industry_ar ? client.industry_ar : client.industry;

            return (
              <div
                key={client._id || client.name || idx}
                className="partner-card-hover"
                style={{
                  backgroundColor: 'var(--color-sec-clients-card-bg, #FFFFFF)',
                  borderRadius: '16px',
                  padding: '1.75rem 1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  border: '1px solid rgba(0, 0, 0, 0.07)',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
                  cursor: 'pointer',
                  position: 'relative',
                  minHeight: '180px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-sec-clients-accent, #F68621)';
                  e.currentTarget.style.boxShadow = '0 12px 28px rgba(246, 134, 33, 0.12)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.07)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.03)';
                }}
              >
                {/* Logo Image Area */}
                <div
                  style={{
                    height: '80px',
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '0.75rem',
                    padding: '0.25rem',
                  }}
                >
                  {client.logoUrl ? (
                    <img
                      src={client.logoUrl}
                      alt={name}
                      style={{
                        maxHeight: '65px',
                        maxWidth: '170px',
                        width: 'auto',
                        height: 'auto',
                        objectFit: 'contain',
                        transition: 'transform 0.3s ease',
                      }}
                      loading="lazy"
                    />
                  ) : (
                    <div
                      style={{
                        fontSize: '1.15rem',
                        fontWeight: 800,
                        color: 'var(--color-charcoal-dark, #1E293B)',
                        textAlign: 'center',
                      }}
                    >
                      {name}
                    </div>
                  )}
                </div>

                {/* Partner Details */}
                <div
                  style={{
                    width: '100%',
                    borderTop: '1px solid rgba(0, 0, 0, 0.05)',
                    paddingTop: '0.75rem',
                    textAlign: 'center',
                  }}
                >
                  <div
                    style={{
                      fontSize: '0.9rem',
                      fontWeight: 700,
                      color: 'var(--color-sec-clients-card-text, #1E293B)',
                      marginBottom: '0.2rem',
                      lineHeight: 1.35,
                    }}
                  >
                    {name}
                  </div>
                  <span
                    style={{
                      display: 'inline-block',
                      fontSize: '0.75rem',
                      color: 'var(--color-body-gray, #64748B)',
                      fontWeight: 500,
                    }}
                  >
                    {industry}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty Search State */}
        {filteredClients.length === 0 && (
          <div
            style={{
              textAlign: 'center',
              padding: '4rem 2rem',
              backgroundColor: 'var(--color-sec-clients-card-bg, #F8FAFC)',
              borderRadius: '20px',
              border: '1px dashed rgba(0,0,0,0.15)',
              marginTop: '2rem',
            }}
          >
            <p style={{ fontSize: '1.1rem', color: '#64748B', marginBottom: '1rem' }}>
              {language === 'ar' ? 'لا توجد نتائج مطابقة لبحثك' : 'No partners matched your search query.'}
            </p>
            <button
              onClick={() => { setSelectedFilter('all'); setSearchQuery(''); }}
              style={{
                padding: '0.5rem 1.25rem',
                backgroundColor: '#F68621',
                color: '#FFFFFF',
                borderRadius: '9999px',
                border: 'none',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {language === 'ar' ? 'عرض جميع الشركاء' : 'Show All Partners'}
            </button>
          </div>
        )}

        {/* Signature Callout Badge Under Partners */}
        <div
          style={{
            marginTop: '4.5rem',
            textAlign: 'center',
            padding: '2.25rem 2rem',
            background: 'linear-gradient(135deg, rgba(246, 134, 33, 0.06) 0%, rgba(246, 134, 33, 0.02) 100%)',
            borderRadius: '24px',
            border: '1px solid rgba(246, 134, 33, 0.2)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.75rem',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: 'var(--color-sec-clients-accent, #F68621)',
              fontWeight: 800,
              fontSize: '1.35rem',
              letterSpacing: language === 'ar' ? '0' : '-0.01em',
            }}
          >
            <ShieldCheck size={22} color="#F68621" />
            <span>{subtitleText}</span>
          </div>

          <p
            style={{
              color: 'var(--color-sec-clients-subtitle, var(--color-body-gray, #64748B))',
              maxWidth: '620px',
              fontSize: '0.95rem',
              lineHeight: 1.7,
              margin: 0,
            }}
          >
            {language === 'ar'
              ? 'أكثر من 35 جهة سيادية ومؤسسة وطنية وعالمية ائتمنت 60FRAMEWORKS على صياغة أهم محطاتها وإخراج أضخم فعالياتها.'
              : 'Over 35+ sovereign ministries and international enterprises trust 60FRAMEWORKS to engineer high-authority, milestone experiences.'}
          </p>
        </div>
      </div>
    </section>
  );
};
