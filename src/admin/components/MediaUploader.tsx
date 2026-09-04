import React, { useState, useRef } from 'react';
import { Upload, X, Film, Image as ImageIcon, Link, Loader2 } from 'lucide-react';
import { upload } from '@vercel/blob/client';
import { adminApi } from '../adminApi';

interface MediaUploaderProps {
  label: string;
  currentUrl: string;
  accept?: string; // 'image' | 'video' | 'both'
  onUploaded: (url: string) => void;
}

const API = import.meta.env.VITE_API_BASE_URL || 'https://api.60frameworks.com/api/v1';

export const MediaUploader: React.FC<MediaUploaderProps> = ({
  label,
  currentUrl,
  accept = 'both',
  onUploaded,
}) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [mode, setMode] = useState<'upload' | 'url'>('url');
  const fileRef = useRef<HTMLInputElement>(null);

  const acceptAttr =
    accept === 'image'
      ? 'image/*'
      : accept === 'video'
      ? 'video/mp4,video/webm,video/quicktime,video/*'
      : 'image/*,video/*';

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError('');

    try {
      const sanitizedName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

      // 1. Attempt direct client-side stream upload to Vercel Blob (supports large videos up to 500MB)
      try {
        const newBlob = await upload(sanitizedName, file, {
          access: 'public',
          handleUploadUrl: `${API}/upload/blob-auth`,
        });

        if (newBlob && newBlob.url) {
          onUploaded(newBlob.url);
          setUploading(false);
          if (fileRef.current) fileRef.current.value = '';
          return;
        }
      } catch (clientErr: any) {
        console.warn('Direct Vercel Blob client upload notice:', clientErr?.message || clientErr);
      }

      // 2. Fallback to standard base64 upload if file is under 4MB
      if (file.size < 4 * 1024 * 1024) {
        const reader = new FileReader();
        reader.onload = async (ev) => {
          try {
            const base64 = ev.target?.result as string;
            const res = await adminApi.uploadMedia(sanitizedName, base64, file.type);
            if (res.success && res.data?.url) {
              onUploaded(res.data.url);
            } else {
              setError('Upload failed. Please check network or paste a direct video URL.');
            }
          } catch (serverErr: any) {
            setError(serverErr.message || 'Server upload failed. Try pasting a video link in URL tab.');
          } finally {
            setUploading(false);
            if (fileRef.current) fileRef.current.value = '';
          }
        };
        reader.onerror = () => {
          setError('Failed to read file.');
          setUploading(false);
        };
        reader.readAsDataURL(file);
      } else {
        throw new Error('Video upload failed. For large videos (>4MB), please paste the direct video URL in the "URL Link" tab, or check Vercel Blob settings.');
      }
    } catch (err: any) {
      console.error('Upload Error:', err);
      setError(err.message || 'Upload failed. Please try pasting a direct video link in the URL tab.');
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      onUploaded(urlInput.trim());
      setUrlInput('');
    }
  };

  const isVideo =
    currentUrl &&
    (currentUrl.includes('.mp4') ||
      currentUrl.includes('.webm') ||
      currentUrl.includes('.mov') ||
      currentUrl.includes('video') ||
      currentUrl.startsWith('data:video/'));

  return (
    <div style={{ marginBottom: '0.75rem' }}>
      <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#374151', marginBottom: '0.5rem' }}>
        {label}
      </label>

      {/* Current preview */}
      {currentUrl && (
        <div style={{ position: 'relative', marginBottom: '0.75rem', borderRadius: '8px', overflow: 'hidden', border: '1px solid #E5E7EB' }}>
          {isVideo ? (
            <video src={currentUrl} style={{ width: '100%', height: '160px', objectFit: 'cover', background: '#000' }} controls muted />
          ) : (
            <img src={currentUrl} alt="preview" style={{ width: '100%', height: '160px', objectFit: 'cover', display: 'block' }} />
          )}
          <button
            onClick={() => onUploaded('')}
            style={{
              position: 'absolute', top: '8px', right: '8px', background: 'rgba(239,68,68,0.9)',
              color: '#fff', border: 'none', borderRadius: '50%', width: '28px', height: '28px',
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
            }}
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Mode switcher */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
        <button onClick={() => setMode('url')} style={{ ...tabBtn, ...(mode === 'url' ? tabActive : {}) }}>
          <Link size={13} /> URL Link
        </button>
        <button onClick={() => setMode('upload')} style={{ ...tabBtn, ...(mode === 'upload' ? tabActive : {}) }}>
          <Upload size={13} /> Upload File
        </button>
      </div>

      {mode === 'url' ? (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            type="url"
            placeholder="https://... paste image or video URL (e.g. MP4, S3, Cloudinary, YouTube)"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            style={{ ...inputStyle, flex: 1 }}
            onKeyDown={(e) => e.key === 'Enter' && handleUrlSubmit()}
          />
          <button onClick={handleUrlSubmit} style={applyBtn}>Apply</button>
        </div>
      ) : (
        <div>
          <input ref={fileRef} type="file" accept={acceptAttr} onChange={handleFile} style={{ display: 'none' }} />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            style={{ ...uploadAreaStyle, opacity: uploading ? 0.7 : 1 }}
          >
            {uploading ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                <Loader2 size={24} color="#F68621" style={{ animation: 'spin 1s linear infinite' }} />
                <span style={{ fontSize: '0.8125rem', color: '#F68621', fontWeight: 600 }}>Streaming directly to Vercel Blob CDN...</span>
              </div>
            ) : (
              <>
                {accept === 'video' ? <Film size={20} color="#9CA3AF" /> : <ImageIcon size={20} color="#9CA3AF" />}
                <span style={{ fontSize: '0.8125rem', color: '#6B7280' }}>Click to select {accept === 'video' ? 'video' : accept === 'image' ? 'image' : 'file'}</span>
              </>
            )}
          </button>
        </div>
      )}

      {error && <p style={{ fontSize: '0.75rem', color: '#EF4444', marginTop: '0.35rem' }}>{error}</p>}
    </div>
  );
};

const inputStyle: React.CSSProperties = {
  padding: '0.6rem 0.85rem', border: '1px solid #D1D5DB', borderRadius: '8px',
  fontSize: '0.875rem', outline: 'none', width: '100%', color: '#1F2937',
};

const applyBtn: React.CSSProperties = {
  padding: '0.6rem 1.1rem', backgroundColor: '#F68621', color: '#fff',
  border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '0.8125rem', cursor: 'pointer',
};

const uploadAreaStyle: React.CSSProperties = {
  width: '100%', padding: '1.25rem', border: '2px dashed #D1D5DB', borderRadius: '8px',
  background: '#F9FAFB', cursor: 'pointer', display: 'flex', flexDirection: 'column',
  alignItems: 'center', gap: '0.5rem',
};

const tabBtn: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: '0.35rem',
  padding: '0.35rem 0.8rem', borderRadius: '6px', border: '1px solid #E5E7EB',
  background: 'white', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', color: '#6B7280',
};

const tabActive: React.CSSProperties = {
  background: '#FFF3E0', borderColor: '#F68621', color: '#F68621',
};
