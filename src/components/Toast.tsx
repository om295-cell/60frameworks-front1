import React, { useEffect } from 'react';
import { CheckCircle2, X } from 'lucide-react';

interface ToastProps {
  message: string | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        zIndex: 200,
        backgroundColor: 'var(--color-charcoal-dark)',
        color: 'var(--color-white)',
        padding: '1rem 1.5rem',
        borderRadius: 'var(--radius-md)',
        boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
        borderLeft: '4px solid var(--color-orange-primary)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.875rem',
        maxWidth: '420px',
        animation: 'slideUp 0.3s ease',
      }}
    >
      <CheckCircle2 size={20} color="var(--color-orange-primary)" style={{ flexShrink: 0 }} />
      <span style={{ fontSize: '0.875rem', fontWeight: 600, lineHeight: 1.4 }}>{message}</span>
      <button
        onClick={onClose}
        style={{
          background: 'none',
          border: 'none',
          color: 'rgba(255,255,255,0.7)',
          cursor: 'pointer',
          padding: '2px',
          marginLeft: 'auto',
        }}
      >
        <X size={16} />
      </button>
    </div>
  );
};
