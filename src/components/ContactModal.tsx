import React, { useState, useEffect } from 'react';
import { X, Send, AlertCircle, Loader2 } from 'lucide-react';
import { api } from '../services/api';
import { ContactFormData } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialService?: string;
  onSuccessToast: (msg: string) => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({
  isOpen,
  onClose,
  initialService,
  onSuccessToast,
}) => {
  const { language, t, dir } = useLanguage();

  const [formData, setFormData] = useState<ContactFormData>({
    fullName: '',
    email: '',
    phone: '',
    company: '',
    serviceInterest: 'Event Strategy & Vision',
    estimatedBudget: '$100k - $250k',
    timeline: 'Within 3-6 Months',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (initialService) {
      setFormData((prev) => ({ ...prev, serviceInterest: initialService }));
    }
  }, [initialService]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!formData.fullName || !formData.email || !formData.company || !formData.message) {
      setErrorMessage(
        language === 'ar'
          ? 'يرجى تعبئة جميع الحقول المطلوبة (*)'
          : 'Please fill out all required fields (*)'
      );
      return;
    }

    if (!formData.email.includes('@')) {
      setErrorMessage(
        language === 'ar'
          ? 'يرجى إدخال بريد إلكتروني رسمي صحيح'
          : 'Please enter a valid work email address'
      );
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await api.submitContact(formData);
      setIsSubmitting(false);

      if (res.success) {
        onSuccessToast(
          language === 'ar'
            ? 'تم استلام طلبكم بنجاح! سيتواصل معكم فريقنا الاستشاري خلال 24 ساعة.'
            : res.message
        );
        onClose();
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          company: '',
          serviceInterest: 'Event Strategy & Vision',
          estimatedBudget: '$100k - $250k',
          timeline: 'Within 3-6 Months',
          message: '',
        });
      }
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMessage(
        err.message ||
          (language === 'ar' ? 'حدث خطأ أثناء الإرسال. يرجى المحاولة مرة أخرى.' : 'Failed to submit inquiry.')
      );
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(36, 36, 36, 0.75)',
        backdropFilter: 'blur(8px)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.25rem',
        overflowY: 'auto',
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: 'var(--color-white)',
          borderRadius: 'var(--radius-xl)',
          maxWidth: '680px',
          width: '100%',
          maxHeight: '92vh',
          overflowY: 'auto',
          boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
          position: 'relative',
          padding: 'clamp(1.75rem, 4vw, 2.75rem)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          style={{
            position: 'absolute',
            top: '1.5rem',
            [dir === 'rtl' ? 'left' : 'right']: '1.5rem',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-gray-structure)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'var(--color-charcoal-dark)',
            transition: 'background-color var(--transition-fast)',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-orange-subtle)')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-gray-structure)')}
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div style={{ marginBottom: '2rem' }}>
          <span className="type-eyebrow">{t('contactModalEyebrow')}</span>
          <h3 className="type-h2" style={{ color: 'var(--color-charcoal-dark)', marginBottom: '0.5rem' }}>
            {t('contactModalHeading')}
          </h3>
          <p className="type-body-sm" style={{ color: 'var(--color-body-gray)', lineHeight: 1.6 }}>
            {t('contactModalSubtitle')}
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              backgroundColor: '#FEE2E2',
              color: '#B91C1C',
              padding: '0.875rem 1.25rem',
              borderRadius: 'var(--radius-md)',
              marginBottom: '1.5rem',
              fontSize: '0.875rem',
              fontWeight: 600,
            }}
          >
            <AlertCircle size={18} />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form Fields */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
            {/* Full Name */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                {t('formFullName')}
              </label>
              <input
                type="text"
                required
                placeholder={t('formFullNamePlaceholder')}
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                style={inputStyle}
              />
            </div>

            {/* Work Email */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                {t('formEmail')}
              </label>
              <input
                type="email"
                required
                placeholder={t('formEmailPlaceholder')}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                style={inputStyle}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
            {/* Organization */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                {t('formCompany')}
              </label>
              <input
                type="text"
                required
                placeholder={t('formCompanyPlaceholder')}
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                style={inputStyle}
              />
            </div>

            {/* Phone */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                {t('formPhone')}
              </label>
              <input
                type="tel"
                placeholder="+966 50 123 4567"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                style={inputStyle}
                dir="ltr"
              />
            </div>
          </div>

          {/* Service & Budget Options */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                {t('formServiceInterest')}
              </label>
              <select
                value={formData.serviceInterest}
                onChange={(e) => setFormData({ ...formData, serviceInterest: e.target.value })}
                style={inputStyle}
              >
                <option value="Event Strategy & Vision">{language === 'ar' ? 'استراتيجية ورؤية الفعاليات' : 'Event Strategy & Vision'}</option>
                <option value="Event Management & Production">{language === 'ar' ? 'إدارة وإنتاج الفعاليات الكبرى' : 'Event Management & Production'}</option>
                <option value="Brand Experiences & Activations">{language === 'ar' ? 'تجارب العلامات التجارية والتدشين' : 'Brand Experiences & Activations'}</option>
                <option value="Exhibitions & Custom Booths">{language === 'ar' ? 'المعارض والأجنحة المعمارية المبتكرة' : 'Exhibitions & Custom Booths'}</option>
                <option value="Corporate Events & Summits">{language === 'ar' ? 'القمم المؤسسية والمؤتمرات السيادية' : 'Corporate Events & Summits'}</option>
                <option value="Creative & Storytelling">{language === 'ar' ? 'الإبداع والسرد القصصي السينمائي' : 'Creative & Storytelling'}</option>
                <option value="Turnkey General Inquiry">{language === 'ar' ? 'استشارة عامة وشاملة' : 'Turnkey General Inquiry'}</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                {t('formBudget')}
              </label>
              <select
                value={formData.estimatedBudget}
                onChange={(e) => setFormData({ ...formData, estimatedBudget: e.target.value })}
                style={inputStyle}
              >
                <option value="$50k - $100k">{language === 'ar' ? '180,000 - 375,000 ر.س ($50k - $100k)' : '$50k - $100k'}</option>
                <option value="$100k - $250k">{language === 'ar' ? '375,000 - 950,000 ر.س ($100k - $250k)' : '$100k - $250k'}</option>
                <option value="$250k - $500k">{language === 'ar' ? '950,000 - 1.8M ر.س ($250k - $500k)' : '$250k - $500k'}</option>
                <option value="$500k - $1M+">{language === 'ar' ? '1.8M - 3.75M+ ر.س ($500k - $1M+)' : '$500k - $1M+'}</option>
                <option value="Sovereign / Scale Custom">{language === 'ar' ? 'ميزانية مشاريع سيادية وعملاقة خاصة' : 'Sovereign / Scale Custom'}</option>
              </select>
            </div>
          </div>

          {/* Project Brief Message */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, marginBottom: '0.35rem' }}>
              {t('formMessage')}
            </label>
            <textarea
              required
              rows={4}
              placeholder={t('formMessagePlaceholder')}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              style={{ ...inputStyle, resize: 'vertical' }}
            />
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary-orange"
            style={{
              padding: '1rem',
              fontSize: '1rem',
              width: '100%',
              marginTop: '0.5rem',
              opacity: isSubmitting ? 0.75 : 1,
            }}
          >
            {isSubmitting ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>{t('formSubmitting')}</span>
              </>
            ) : (
              <>
                <span>{t('formSubmitBtn')}</span>
                <Send size={18} style={{ transform: dir === 'rtl' ? 'scaleX(-1)' : 'none' }} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.85rem 1rem',
  borderRadius: 'var(--radius-sm)',
  border: '1px solid var(--color-border)',
  backgroundColor: 'var(--color-white)',
  fontSize: '0.9375rem',
  color: 'var(--color-charcoal-dark)',
  fontFamily: 'inherit',
  outline: 'none',
  transition: 'border-color var(--transition-fast)',
};
