import React, { useState } from 'react';
import { Project } from '../types';
import { ArrowUpRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface CaseStudiesProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
}

export const CaseStudies: React.FC<CaseStudiesProps> = ({ projects, onSelectProject }) => {
  const { language, t, dir } = useLanguage();
  const [selectedCategoryKey, setSelectedCategoryKey] = useState<string>('All');

  const categories = [
    { key: 'All', labelEn: 'All', labelAr: 'الكل' },
    { key: 'Summits & Conferences', labelEn: 'Summits & Conferences', labelAr: 'القمم والمؤتمرات' },
    { key: 'Brand Experiences', labelEn: 'Brand Experiences', labelAr: 'تجارب العلامات' },
    { key: 'Exhibitions & Booths', labelEn: 'Exhibitions & Booths', labelAr: 'المعارض والأجنحة' },
    { key: 'Corporate Events', labelEn: 'Corporate Events', labelAr: 'الفعاليات المؤسسية' },
    { key: 'Creative & Storytelling', labelEn: 'Creative & Storytelling', labelAr: 'الإبداع والسرد' },
  ];

  const filteredProjects =
    selectedCategoryKey === 'All'
      ? projects
      : projects.filter((p) => p.category.toLowerCase().includes(selectedCategoryKey.toLowerCase()));

  return (
    <section id="stories" className="section bg-charcoal-dark">
      <div className="container">
        {/* Section Header */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: '2rem',
            marginBottom: '3rem',
          }}
        >
          <div style={{ maxWidth: '650px' }}>
            <span className="type-eyebrow" style={{ color: 'var(--color-orange-primary)' }}>
              {t('storiesEyebrow')}
            </span>
            <h2 className="type-h1" style={{ color: 'var(--color-white)', marginBottom: '0.75rem' }}>
              {t('storiesHeading')}
            </h2>
            <p className="type-body-lg" style={{ color: 'rgba(255,255,255,0.75)', lineHeight: 1.7 }}>
              {t('storiesSubtitle')}
            </p>
          </div>

          {/* Category Filter Pills */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.5rem',
              alignItems: 'center',
            }}
          >
            {categories.map((cat) => {
              const isActive = selectedCategoryKey === cat.key;
              const label = language === 'ar' ? cat.labelAr : cat.labelEn;

              return (
                <button
                  key={cat.key}
                  onClick={() => setSelectedCategoryKey(cat.key)}
                  style={{
                    padding: '0.5rem 1.125rem',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    border: isActive ? '1px solid var(--color-orange-primary)' : '1px solid rgba(255,255,255,0.15)',
                    backgroundColor: isActive ? 'var(--color-orange-primary)' : 'rgba(255,255,255,0.05)',
                    color: isActive ? 'var(--color-white)' : 'rgba(255,255,255,0.85)',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.12)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)';
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Large Image-Driven Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
            gap: '2.25rem',
          }}
        >
          {filteredProjects.map((project) => {
            const title = language === 'ar' && project.title_ar ? project.title_ar : project.title;
            const summary = language === 'ar' && project.summary_ar ? project.summary_ar : project.summary;
            const category = language === 'ar' && project.category_ar ? project.category_ar : project.category;
            const client = language === 'ar' && project.client_ar ? project.client_ar : project.client;
            const firstMetric = project.metrics && project.metrics.length > 0 ? project.metrics[0] : null;
            const metricVal = language === 'ar' && firstMetric?.value_ar ? firstMetric.value_ar : firstMetric?.value;
            const metricLbl = language === 'ar' && firstMetric?.label_ar ? firstMetric.label_ar : firstMetric?.label;

            return (
              <div
                key={project.slug || project._id}
                className="card-hover-lift"
                onClick={() => onSelectProject(project)}
                style={{
                  backgroundColor: 'var(--color-charcoal-card)',
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden',
                  border: '1px solid var(--color-border-dark)',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: 'var(--shadow-dark-card)',
                }}
              >
                {/* Card Image Container with Zoom */}
                <div
                  className="image-zoom-container"
                  style={{
                    height: '270px',
                    position: 'relative',
                    backgroundColor: '#1a1a1a',
                  }}
                >
                  <img
                    src={project.coverImage}
                    alt={title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />

                  {/* Category Pill Tag Overlay */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '1rem',
                      [dir === 'rtl' ? 'right' : 'left']: '1rem',
                      zIndex: 2,
                    }}
                  >
                    <span
                      style={{
                        backgroundColor: 'rgba(36,36,36,0.85)',
                        backdropFilter: 'blur(6px)',
                        color: 'var(--color-orange-primary)',
                        padding: '0.35rem 0.85rem',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        letterSpacing: language === 'ar' ? 'normal' : '0.04em',
                        border: '1px solid rgba(246, 134, 33, 0.4)',
                      }}
                    >
                      {category}
                    </span>
                  </div>

                  {/* Client Tag */}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '1rem',
                      [dir === 'rtl' ? 'left' : 'right']: '1rem',
                      zIndex: 2,
                    }}
                  >
                    <span
                      style={{
                        backgroundColor: 'rgba(0,0,0,0.6)',
                        color: 'var(--color-white)',
                        padding: '0.25rem 0.75rem',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                      }}
                    >
                      {client}
                    </span>
                  </div>
                </div>

                {/* Card Content */}
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
                    <h3
                      style={{
                        fontSize: '1.375rem',
                        fontWeight: 700,
                        color: 'var(--color-white)',
                        marginBottom: '0.75rem',
                        lineHeight: 1.3,
                      }}
                    >
                      {title}
                    </h3>

                    <p
                      style={{
                        fontSize: '0.9375rem',
                        lineHeight: 1.65,
                        color: 'rgba(255, 255, 255, 0.7)',
                        marginBottom: '1.5rem',
                      }}
                    >
                      {summary}
                    </p>

                    {/* Highlight Metric Pill */}
                    {firstMetric && (
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '1rem',
                          padding: '0.75rem 1rem',
                          backgroundColor: 'rgba(255,255,255,0.04)',
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid rgba(255,255,255,0.08)',
                          marginBottom: '1.5rem',
                        }}
                      >
                        <div style={{ fontWeight: 800, fontSize: '1.125rem', color: 'var(--color-yellow-energy)' }}>
                          {metricVal}
                        </div>
                        <div style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.7)' }}>
                          {metricLbl}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* View Project Action */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingTop: '1rem',
                      borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                    }}
                  >
                    <span
                      style={{
                        color: 'var(--color-orange-primary)',
                        fontWeight: 700,
                        fontSize: '0.9375rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                      }}
                    >
                      {t('viewCaseStudy')}
                    </span>
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(246, 134, 33, 0.15)',
                        color: 'var(--color-orange-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <ArrowUpRight
                        size={18}
                        style={{ transform: dir === 'rtl' ? 'rotate(-90deg)' : 'none' }}
                      />
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
