import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  const { t, dir, language } = useLanguage();
  const [activeIdx, setActiveIdx] = useState(0);
  const [muted, setMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const eyebrow = (language === 'ar' ? content?.eyebrow_ar : content?.eyebrow_en) || t('latestEventEyebrow');
  const title = (language === 'ar' ? content?.title_ar : content?.title_en) || t('latestEventTitle');
  const subtitle = (language === 'ar' ? content?.subtitle_ar : content?.subtitle_en) || t('latestEventSubtitle');
  const imageUrl = content?.imageUrl || 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1600&auto=format&fit=crop';
  const videos = content?.videos?.filter(Boolean) || [];
  const driveUrl = content?.driveUrl || 'https://drive.google.com';

  // Sync muted state to live video element
  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = muted;
  }, [muted]);

  const handleMuteToggle = () => setMuted((m) => !m);

  // Callback ref — fires on every video mount (key change forces remount)
  const videoCallbackRef = useCallback((node: HTMLVideoElement | null) => {
    videoRef.current = node;
    if (!node) return;
    // Always start muted so browser allows autoplay
    node.muted = true;
    const playPromise = node.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        // Playback started — now honour the user's mute preference
        node.muted = muted;
      }).catch(() => {
        // Autoplay blocked entirely — stay muted and retry
        node.muted = true;
        node.play().catch(() => {});
      });
    }
  }, [activeIdx]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleVideoEnded = () => {
    if (videos.length > 1) setActiveIdx((i) => (i + 1) % videos.length);
  };

  const showVideo = videos.length > 0;
  const currentVideo = videos[activeIdx] || '';

  return (
    <section id="latest-event" className="section" style={{ padding: '4.5rem 0', position: 'relative', overflow: 'hidden', backgroundColor: 'var(--color-sec-latestEvent-bg, #FFFFFF)' }}>
      <div style={{
        position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)',
        width: '600px', height: '350px',
        background: 'radial-gradient(ellipse at center, rgba(246, 134, 33, 0.08) 0%, rgba(246, 134, 33, 0) 70%)',
        filter: 'blur(60px)', pointerEvents: 'none', zIndex: 0,
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        {/* Section Header */}
        <div style={{ maxWidth: '780px', margin: '0 auto 2.5rem', textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.4rem 1rem', borderRadius: '9999px',
            backgroundColor: 'rgba(246, 134, 33, 0.1)', border: '1px solid rgba(246, 134, 33, 0.25)',
            color: 'var(--color-sec-latestEvent-accent, #F68621)', fontSize: '0.8125rem', fontWeight: 700,
            letterSpacing: '0.08em', marginBottom: '1rem',
          }}>
            <Sparkles size={15} />
            <span>{eyebrow}</span>
          </div>
          <h2 className="type-h2" style={{ marginBottom: '0.875rem', color: 'var(--color-sec-latestEvent-text, #0B0F19)', fontFamily: 'var(--font-heading)', letterSpacing: '-0.02em' }}>
            {title}
          </h2>
          <p className="type-body-lg" style={{ color: 'var(--color-sec-latestEvent-subtitle, #5A6275)', margin: '0 auto', lineHeight: 1.7, fontSize: '1.0625rem' }}>
            {subtitle}
          </p>
        </div>

        {/* Showcase Card */}
        <div style={{ maxWidth: '1080px', margin: '0 auto', position: 'relative' }}>
          <div style={{
            position: 'relative', borderRadius: '24px', overflow: 'hidden',
            border: '1.5px solid rgba(246, 134, 33, 0.2)',
            boxShadow: '0 20px 45px -10px rgba(0,0,0,0.12)',
            backgroundColor: 'var(--color-sec-latestEvent-card-bg, #0A0F1D)',
          }}>
            <div style={{ position: 'relative', width: '100%', paddingTop: 'clamp(50%, 42vw, 56.25%)', overflow: 'hidden' }}>

              {showVideo ? (
                <video
                  key={currentVideo}
                  ref={videoCallbackRef}
                  src={currentVideo}
                  muted={muted}
                  playsInline
                  loop={videos.length === 1}
                  onEnded={handleVideoEnded}
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <img
                  src={imageUrl} alt={title} loading="lazy"
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                />
              )}

              {/* استعراض الفعالية — left side button */}
              <a
                href={driveUrl} target="_blank" rel="noopener noreferrer"
                style={{
                  position: 'absolute', top: '1.5rem',
                  ...(dir === 'rtl' ? { right: '1.5rem' } : { left: '1.5rem' }),
                  display: 'flex', alignItems: 'center', gap: '0.625rem',
                  padding: '0.6rem 1.125rem', borderRadius: '100px',
                  backgroundColor: 'rgba(11,15,25,0.82)', backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255,255,255,0.15)', color: '#FFFFFF',
                  fontSize: '0.875rem', fontWeight: 600, textDecoration: 'none',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.3)', zIndex: 2,
                }}
              >
                <div style={{
                  width: '26px', height: '26px', borderRadius: '50%',
                  backgroundColor: 'rgba(246,134,33,0.2)', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', color: 'var(--color-orange-primary, #F68621)',
                }}>
                  <ArrowUpRight size={14} />
                </div>
                <span>{t('latestEventCta')}</span>
              </a>

              {/* Mute/Unmute button — opposite side */}
              {showVideo && (
                <button
                  onClick={handleMuteToggle}
                  style={{
                    position: 'absolute', top: '1.5rem',
                    ...(dir === 'rtl' ? { left: '1.5rem' } : { right: '1.5rem' }),
                    zIndex: 3, background: 'rgba(11,15,25,0.82)', backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255,255,255,0.15)', borderRadius: '50%',
                    width: '42px', height: '42px', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', color: '#FFFFFF', cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                  }}
                  aria-label={muted ? 'Unmute video' : 'Mute video'}
                >
                  {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
