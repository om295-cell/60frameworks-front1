import React, { useState } from 'react';
import { Eye, EyeOff, Lock, LogIn, User } from 'lucide-react';
import { useAdminAuth } from './AdminAuthContext';

export const AdminLogin: React.FC = () => {
  const { login } = useAdminAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const ok = await login(password, email || undefined);
      if (!ok) setError('Invalid credentials. Access denied.');
    } catch {
      setError('Login failed. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #1a1a1a 0%, #242424 50%, #1a0a00 100%)',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
    }}>
      <div style={{
        width: '100%', maxWidth: '420px', margin: '1rem',
        background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(20px)',
        borderRadius: '20px', border: '1px solid rgba(255,255,255,0.08)',
        padding: '2.75rem 2.5rem', boxShadow: '0 30px 70px rgba(0,0,0,0.5)',
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <img src="/logo.png" alt="60FRAMEWORKS" style={{ height: '52px', marginBottom: '1rem', objectFit: 'contain' }} />
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(246,134,33,0.15)', border: '1px solid rgba(246,134,33,0.3)', borderRadius: '20px', padding: '0.35rem 0.9rem', marginBottom: '1.25rem' }}>
            <Lock size={13} color="#F68621" />
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#F68621', letterSpacing: '0.08em' }}>ADMIN ACCESS</span>
          </div>
          <h1 style={{ fontSize: '1.625rem', fontWeight: 800, color: '#fff', marginBottom: '0.35rem' }}>Control Panel</h1>
          <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.5)' }}>Enter your admin credentials to continue</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Email Field */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: 'rgba(255,255,255,0.7)', marginBottom: '0.5rem' }}>
              Email Address <span style={{ color: 'rgba(255,255,255,0.3)', fontWeight: 400 }}>(leave blank for Super Admin)</span>
            </label>
            <div style={{ position: 'relative' }}>
              <User size={16} color="rgba(255,255,255,0.3)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@60frameworks.com"
                style={{
                  width: '100%', padding: '0.875rem 1rem 0.875rem 2.75rem',
                  background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: '12px', color: '#fff', fontSize: '0.9375rem', outline: 'none',
                  fontFamily: 'inherit',
                }}
              />
            </div>
          </div>

          {/* Password Field */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: 'rgba(255,255,255,0.7)', marginBottom: '0.5rem' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPwd ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                style={{
                  width: '100%', padding: '0.875rem 3rem 0.875rem 1rem',
                  background: 'rgba(255,255,255,0.07)', border: `1px solid ${error ? 'rgba(239,68,68,0.6)' : 'rgba(255,255,255,0.12)'}`,
                  borderRadius: '12px', color: '#fff', fontSize: '1rem', outline: 'none',
                  fontFamily: 'inherit',
                }}
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPwd(!showPwd)}
                style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer' }}
              >
                {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {error && (
              <p style={{ marginTop: '0.5rem', fontSize: '0.8125rem', color: '#F87171', fontWeight: 600 }}>
                {error}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !password}
            style={{
              width: '100%', padding: '0.95rem',
              background: loading || !password ? 'rgba(246,134,33,0.4)' : 'linear-gradient(135deg, #F68621, #e07018)',
              color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 800,
              fontSize: '1rem', cursor: loading || !password ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
              boxShadow: '0 8px 24px rgba(246,134,33,0.3)',
              transition: 'all 0.2s',
            }}
          >
            <LogIn size={18} />
            {loading ? 'Verifying...' : 'Access Admin Panel'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.75rem', color: 'rgba(255,255,255,0.25)' }}>
          60FRAMEWORKS © {new Date().getFullYear()} — Restricted Access
        </p>
      </div>
    </div>
  );
};
