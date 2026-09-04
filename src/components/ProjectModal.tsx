import React, { useEffect } from 'react';
import { X, Calendar, User, Tag, ArrowRight } from 'lucide-react';
import { Project } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
  onOpenContact: (projectTitle: string) => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose, onOpenContact }) => {
  const { language, t, dir } = useLanguage();

  useEffect(() => {
    if (project) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [project]);

  if (!project) return null;

  const title = language === 'ar' && project.title_ar ? project.title_ar : project.title;
  const summary = language === 'ar' && project.summary_ar ? project.summary_ar : project.summary;
  const description = language === 'ar' && project.description_ar ? project.description_ar : project.description;
  const category = language === 'ar' && project.category_ar ? project.category_ar : project.category;
  const client = language === 'ar' && project.client_ar ? project.client_ar : project.client;
  const tags = language === 'ar' && project.tags_ar && project.tags_ar.length > 0 ? project.tags_ar : project.tags;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(36, 36, 36, 0.85)',
        backdropFilter: 'blur(10px)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        overflowY: 'auto',
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: 'var(--color-white)',
          borderRadius: 'var(--radius-xl)',
          maxWidth: '900px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 30px 70px rgba(0,0,0,0.4)',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close project modal"
          style={{
            position: 'absolute',
            top: '1.25rem',
            [dir === 'rtl' ? 'left' : 'right']: '1.25rem',
            zIndex: 10,
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            backgroundColor: 'rgba(36,36,36,0.7)',
            backdropFilter: 'blur(6px)',
            color: 'var(--color-white)',
            border: '1px solid rgba(255,255,255,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'background-color var(--transition-fast)',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-orange-primary)')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(36,36,36,0.7)')}
        >
          <X size={20} />
        </button>

        {/* Cover Hero Banner */}
        <div style={{ position: 'relative', height: '360px', backgroundColor: '#1a1a1a' }}>
          <img
            src={project.coverImage}
            alt={title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              padding: '2rem',
              background: 'linear-gradient(to top, rgba(36,36,36,0.95) 0%, transparent 100%)',
              color: 'var(--color-white)',
            }}
          >
            <span
              style={{
                backgroundColor: 'var(--color-orange-primary)',
                color: 'var(--color-white)',
                padding: '0.25rem 0.75rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: language === 'ar' ? 'normal' : '0.04em',
                marginBottom: '0.5rem',
                display: 'inline-block',
              }}
            >
              {category}
            </span>
            <h2 className="type-h2" style={{ color: 'var(--color-white)', lineHeight: 1.25 }}>
              {title}
            </h2>
          </div>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '2.5rem' }}>
          {/* Metadata Bar */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '1.5rem',
              paddingBottom: '1.75rem',
              borderBottom: '1px solid var(--color-gray-structure)',
              marginBottom: '2rem',
              fontSize: '0.875rem',
              color: 'var(--color-body-gray)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <User size={16} color="var(--color-orange-primary)" />
              <span><strong>{t('projClientLabel')}</strong> {client}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calendar size={16} color="var(--color-orange-primary)" />
              <span><strong>{t('projYearLabel')}</strong> {project.year}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Tag size={16} color="var(--color-orange-primary)" />
              <span><strong>{t('projTagsLabel')}</strong> {tags?.join(' • ')}</span>
            </div>
          </div>

          {/* Key Metrics Strip */}
          {project.metrics && project.metrics.length > 0 && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                gap: '1rem',
                marginBottom: '2rem',
                backgroundColor: 'var(--color-gray-structure)',
                padding: '1.5rem',
                borderRadius: 'var(--radius-md)',
              }}
            >
              {project.metrics.map((m, idx) => {
                const val = language === 'ar' && m.value_ar ? m.value_ar : m.value;
                const lbl = language === 'ar' && m.label_ar ? m.label_ar : m.label;
                return (
                  <div key={idx} style={{ textAlign: 'center' }}>
                    <div
                      style={{
                        fontSize: '1.5rem',
                        fontWeight: 800,
                        color: 'var(--color-orange-primary)',
                      }}
                    >
                      {val}
                    </div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-charcoal-dark)' }}>
                      {lbl}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Narrative Description */}
          <div style={{ marginBottom: '2.5rem' }}>
            <h3 className="type-h3" style={{ marginBottom: '0.75rem', color: 'var(--color-charcoal-dark)' }}>
              {t('projModalNarrative')}
            </h3>
            <p className="type-body-lg" style={{ marginBottom: '1rem', lineHeight: 1.7 }}>
              {summary}
            </p>
            <p className="type-body" style={{ color: 'var(--color-body-gray)', lineHeight: 1.7 }}>
              {description}
            </p>
          </div>

          {/* Gallery Showcase */}
          {project.galleryImages && project.galleryImages.length > 0 && (
            <div style={{ marginBottom: '2.5rem' }}>
              <h3 className="type-h3" style={{ marginBottom: '1rem', color: 'var(--color-charcoal-dark)' }}>
                {t('projModalGallery')}
              </h3>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '1rem',
                }}
              >
                {project.galleryImages.map((img, idx) => (
                  <div
                    key={idx}
                    className="image-zoom-container"
                    style={{
                      borderRadius: 'var(--radius-md)',
                      height: '180px',
                      backgroundColor: 'var(--color-gray-structure)',
                    }}
                  >
                    <img src={img} alt={`${title} detail ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Footer */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              paddingTop: '2rem',
              borderTop: '1px solid var(--color-gray-structure)',
            }}
          >
            <div style={{ fontSize: '0.875rem', color: 'var(--color-body-light)' }}>
              {t('projModalCtaQuestion')}
            </div>
            <button
              onClick={() => {
                onClose();
                onOpenContact(`${title}`);
              }}
              className="btn btn-primary-orange"
            >
              <span>{t('projModalCtaBtn')}</span>
              <ArrowRight
                size={16}
                style={{ transform: dir === 'rtl' ? 'rotate(180deg)' : 'none' }}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
