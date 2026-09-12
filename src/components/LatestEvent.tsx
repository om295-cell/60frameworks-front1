import React, { useState, useRef, useCallback } from 'react';
import { Sparkles, ArrowUpRight, Volume2, VolumeX } from 'lucide-react';
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
    videos?: string[];
    videosMuted?: boolean;
    driveUrl?: string;
    tag_en?: string;
    tag_ar?: string;
  };
}

export const LatestEvent: React.FC<LatestEventProps> = ({ content }) => {
  const { t, language } = useLanguage();
  const [activeIdx, setActiveIdx] = useState(0);
  const [muted, setMuted] = useState(content?.videosMuted !== false);
  const [btnHovered, setBtnHovered] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const videoElRef = useRef<HTMLVideoElement | null>(null);

  const eyebrow  = (language === 'ar' ? content?.eyebrow_ar  : content?.eyebrow_en)  || t('latestEventEyebrow');
  const title    = (language === 'ar' ? content?.title_ar    : content?.title_en)    || t('latestEventTitle');
  const subtitle = (language === 'ar' ? content?.subtitle_ar : content?.subtitle_en) || t('latestEventSubtitle');
  const imageUrl = content?.imageUrl || 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1600&auto=format&fit=crop';
  const videos   = (content?.videos?.filter(Boolean) || []) as string[];
  const driveUrl = content?.driveUrl || 'https://drive.google.com';
  const showVideo    = videos.length > 0 && !videoError;
  const currentVideo = videos[activeIdx] || '';

  const videoRef = useCallback((node: HTMLVideoElement | null) => {
    videoElRef.current = node;
  }, []);

  const handleMuteToggle = () => {
    const next = !muted;
    setMuted(next);
    if (videoElRef.current) videoElRef.current.muted = next;
  };

  const handleVideoEnded = () => {
    if (videos.length > 1) setActiveIdx((i) => (i + 1) % videos.length);
  };

  const handleVideoError = () => {
    // Try next video; if we've cycled through all, fall back to image
    const nextIdx = (activeIdx + 1) % videos.length;
    if (nextIdx === 0 || videos.length <= 1) {
      setVideoError(true); // all videos failed, show image
    } else {
      setActiveIdx(nextIdx);
    }
  };

  return (
    <section id="latest-event" className="section" style={{ padding: '4.5rem 0', position: 'relative', overflow: 'hidden', backgroundColor: 'var(--color-sec-latestEvent-bg, #FFFFFF)' }}>
      <div style={{
        position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)',
        width: '600px', height: '350px',
        background: 'radial-gradient(ellipse at center, rgba(246,134,33,0.08) 0%, rgba(246,134,33,0) 70%)',
        filter: 'blur(60px)', pointerEvents: 'none', zIndex: 0,
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        {/* Section Header */}
        <div style={{ maxWidth: '780px', margin: '0 auto 2.5rem', textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.4rem 1rem', borderRadius: '9999px',
            backgroundColor: 'rgba(246,134,33,0.1)', border: '1px solid rgba(246,134,33,0.25)',
            color: 'var(--color-sec-latestEvent-accent, #F68621)', fontSize: '0.8125rem', fontWeight: 700,
            letterSpacing: '0.08em', marginBottom: '1rem', transition: 'color 0.3s',
          }}>
            <Sparkles size={15} />
            <span>{eyebrow}</span>
          </div>
          <h2 className="type-h2" style={{ marginBottom: '0.875rem', color: 'var(--color-sec-latestEvent-text, #0B0F19)', fontFamily: 'var(--font-heading)', letterSpacing: '-0.02em', transition: 'color 0.3s' }}>
            {title}
          </h2>
          <p className="type-body-lg" style={{ color: 'var(--color-sec-latestEvent-subtitle, #5A6275)', margin: '0 auto', lineHeight: 1.7, fontSize: '1.0625rem', transition: 'color 0.3s' }}>
            {subtitle}
          </p>
        </div>

        {/* Showcase Card */}
        <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
          <div style={{
            position: 'relative', borderRadius: '24px', overflow: 'hidden',
            border: '1.5px solid rgba(246,134,33,0.2)',
            boxShadow: '0 20px 45px -10px rgba(0,0,0,0.12)',
            backgroundColor: 'var(--color-sec-latestEvent-card-bg, #0A0F1D)',
          }}>
            <div style={{ position: 'relative', width: '100%', paddingTop: 'clamp(50%, 42vw, 56.25%)' }}>

              {showVideo ? (
                <video
                  key={currentVideo}
                  ref={videoRef}
                  src={currentVideo}
                  autoPlay
                  muted
                  playsInline
                  loop={videos.length === 1}
                  onEnded={handleVideoEnded}
                  onError={handleVideoError}
                  onPlay={() => {
                    // Once playing, apply the actual muted state
                    if (videoElRef.current) videoElRef.current.muted = muted;
                  }}
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <img
                  src={imageUrl} alt={title} loading="lazy"
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                />
              )}

              {/* Mute/Unmute — top right */}
              {showVideo && (
                <button
                  onClick={handleMuteToggle}
                  style={{
                    position: 'absolute', top: '1.5rem', right: '1.5rem', zIndex: 3,
                    background: 'rgba(0,0,0,0.25)', backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.2)', borderRadius: '50%',
                    width: '42px', height: '42px', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', color: '#FFFFFF', cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                  }}
                  aria-label={muted ? 'Unmute video' : 'Mute video'}
                >
                  {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </button>
              )}

              {/* استعراض الفعالية — bottom left */}
              <a
                href={driveUrl} target="_blank" rel="noopener noreferrer"
                onMouseEnter={() => setBtnHovered(true)}
                onMouseLeave={() => setBtnHovered(false)}
                style={{
                  position: 'absolute', bottom: '1.5rem', left: '1.5rem', zIndex: 2,
                  display: 'inline-flex', alignItems: 'center', gap: '0.625rem',
                  padding: '0.75rem 1.4rem', borderRadius: '100px',
                  backgroundColor: btnHovered ? 'var(--color-orange-primary, #F68621)' : 'rgba(0,0,0,0.25)',
                  backdropFilter: 'blur(14px)',
                  border: '1px solid rgba(255,255,255,0.25)',
                  color: '#FFFFFF', fontSize: '0.9375rem', fontWeight: 700,
                  textDecoration: 'none',
                  boxShadow: btnHovered ? '0 10px 25px rgba(246,134,33,0.4)' : '0 2px 8px rgba(0,0,0,0.2)',
                  transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
                }}
              >
                <span>{t('latestEventCta')}</span>
                <ArrowUpRight size={18} style={{ transition: 'transform 0.3s ease', transform: btnHovered ? 'translate(3px,-3px)' : 'none' }} />
              </a>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
