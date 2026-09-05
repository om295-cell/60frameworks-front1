import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language } from '../types';

interface Translations {
  [key: string]: {
    en: string;
    ar: string;
  };
}

export const translations: Translations = {
  // Navigation
  navHome: { en: 'Home', ar: 'الرئيسية' },
  navAbout: { en: 'About', ar: 'من نحن' },
  navServices: { en: 'Services', ar: 'خدماتنا' },
  navClients: { en: 'Clients', ar: 'عملاؤنا' },
  navSectors: { en: 'Sectors', ar: 'القطاعات' },
  navStories: { en: 'Stories', ar: 'أعمالنا' },
  navWhyUs: { en: 'Why Us?', ar: 'لماذا نحن؟' },
  navContactUs: { en: 'Contact Us', ar: 'تواصل معنا' },
  agencySubtitle: { en: 'EXPERIENTIAL AGENCY', ar: 'وكالة التجارب والفعاليات' },

  // Hero
  heroHeadlinePrefix: { en: 'We Create Experiences That Make an ', ar: 'نصنع تجارب استثنائية تترك ' },
  heroHeadlineHighlight: { en: 'Impact.', ar: 'أثراً راسخاً.' },
  heroSubtitle: {
    en: 'An international creative and experiential agency engineering monumental summits, multi-sensory brand activations, and immersive spatial environments that redefine audience engagement.',
    ar: 'وكالة إبداعية عالمية تهندس أضخم القمم السيادية، وتفعيلات العلامات التجارية المتعددة الحواس، والبيئات المكانية الغامرة التي تعيد صياغة مفهوم التفاعل والتأثير.',
  },
  heroCtaPrimary: { en: 'CONTACT US', ar: 'تواصل معنا' },
  heroCtaSecondary: { en: 'VIEW OUR WORK', ar: 'استعرض أعمالنا' },
  // Hero Impact Stats
  impactTitle: { en: 'Our Impact in Numbers', ar: 'أثرنا بالأرقام' },
  impactSubtitle: { en: 'Because real impact… is measured.', ar: 'لأن الأثر الحقيقي… يُقاس.' },
  impactStat1Value: { en: '+XX', ar: '+XX' },
  impactStat1Label: { en: 'Projects & Campaigns', ar: 'مشروع وحملة' },
  impactStat2Value: { en: '+XXM', ar: '+XXM' },
  impactStat2Label: { en: 'Views & Reach', ar: 'مشاهدة ووصول' },
  impactStat3Value: { en: '+XX', ar: '+XX' },
  impactStat3Label: { en: 'Brands & Destinations Trusted Us', ar: 'علامة وجهة وثقت بنا' },
  trustGlobalReach: { en: '+XX', ar: '+XX' },
  trustGlobalDesc: { en: 'Projects & Campaigns', ar: 'مشروع وحملة' },
  trustAward: { en: '+XXM', ar: '+XXM' },
  trustAwardDesc: { en: 'Views & Reach', ar: 'مشاهدة ووصول' },
  trustProtocol: { en: '+XX', ar: '+XX' },
  trustProtocolDesc: { en: 'Brands & Destinations Trusted Us', ar: 'علامة وجهة وثقت بنا' },

  // Latest Event
  latestEventEyebrow: { en: 'LATEST EVENT', ar: 'أحدث فعالياتنا' },
  latestEventTitle: { en: 'Our Latest Event Experience', ar: 'فعاليتنا الأخيرة: تجربة استثنائية' },
  latestEventSubtitle: {
    en: 'Click the image below to view comprehensive coverage, high-definition captures, and documentation directly on Google Drive.',
    ar: 'انقر على الصورة للاطلاع على التغطية الشاملة، الصور التوثيقية، وملفات الفعالية مباشرة عبر Google Drive.',
  },
  latestEventBadge: { en: 'Google Drive File', ar: 'ملف التوثيق عبر Google Drive' },
  latestEventCta: { en: 'View on Google Drive', ar: 'فتح الملف في Google Drive' },
  latestEventTag: { en: 'Exclusive Event Documentation', ar: 'ملف التوثيق والتغطية الحصرية' },

  // About
  aboutEyebrow: { en: 'ABOUT OUR AGENCY', ar: 'عن وكالتنا' },
  aboutHeading: { en: 'We Turn Ideas Into Experiences People Remember.', ar: 'نحول الأفكار الملهمة إلى تجارب حية تخلد في الذاكرة.' },
  aboutPara1: {
    en: 'We operate at the convergence of architectural spatial design, cinematic storytelling, and precision technical engineering. For over a decade, we have partnered with sovereign entities, global enterprises, and industry disruptors to create landmark physical moments.',
    ar: 'نعمل عند نقطة التقاء التصميم المعماري المكاني، والسرد القصصي السينمائي، والهندسة التقنية الدقيقة. لأكثر من عقد، تشرفنا بالشراكة مع الهيئات السيادية، وكبرى الشركات العالمية، ورواد الصناعة لتنظيم فعاليات تاريخية فارقة.',
  },
  aboutPara2: {
    en: 'From multi-acre international trade pavilions to hyper-curated private leadership summits, our holistic philosophy ensures every touchpoint reinforces brand prestige, sparks emotional connection, and achieves tangible business outcomes.',
    ar: 'من الأجنحة المعمارية الضخمة في المعارض الدولية إلى القمم القيادية السيادية الحصرية، تضمن فلسفتنا الشاملة تعزيز هيبة العلامة التجارية، وبناء الروابط العاطفية، وتحقيق نتائج استثمارية ملموسة.',
  },
  aboutBadge: { en: 'Engineering memories that endure long after lights dim.', ar: 'نهندس ذكريات تدوم طويلاً بعد انطفاء أضواء المسرح.' },
  aboutCta: { en: 'Discover How We Create Impact', ar: 'اكتشف كيف نصنع الأثر' },
  aboutPillar1: { en: 'Purpose-Driven Strategy', ar: 'استراتيجية مبنية على الهدف' },
  aboutPillar2: { en: 'Creative Ideas That Make a Difference', ar: 'أفكار إبداعية تصنع الفرق' },
  aboutPillar3: { en: 'Integrated Production & Execution', ar: 'إنتاج وتنفيذ متكامل' },
  aboutPillar4: { en: 'Digital & Interactive Experiences', ar: 'تجارب رقمية وتفاعلية' },
  stat1: { en: 'Experiences Executed', ar: 'فعالية كبرى منجزة' },
  stat2: { en: 'Global Attendees', ar: 'مشارك وزائر دولي' },
  stat3: { en: 'Client Retention Rate', ar: 'نسبة ولاء واستمرار العملاء' },
  stat4: { en: 'International Design Awards', ar: 'جائزة تصميم عالمية' },

  // Services
  servicesEyebrow: { en: 'OUR CAPABILITIES', ar: 'قدراتنا وإمكاناتنا' },
  servicesHeading: { en: 'Comprehensive Experiential Solutions Engineered to Scale.', ar: 'حلول وتجارب متكاملة مصممة لأعلى مستويات التأثير.' },
  servicesSubtitle: {
    en: 'From strategic concept genesis to synchronized live showrunning and post-event intelligence, our multidisciplinary teams deliver turnkey excellence.',
    ar: 'من ولادة المفهوم الاستراتيجي إلى الإخراج المباشر المتزامن وتحليلات ما بعد الحدث، تقدم فرقنا المتخصصة تميزاً شاملاً وموثوقاً.',
  },
  serviceCta: { en: 'Request Service Brief', ar: 'طلب ملف الخدمة والقدرات' },

  // Clients
  clientsEyebrow: { en: 'TRUSTED BY INDUSTRY TITANS', ar: 'ثقة كبرى الكيانات والرواد' },
  clientsHeading: { en: 'Trusted by Sovereign Entities & Global Enterprises.', ar: 'شركاء النجاح للهيئات السيادية والمؤسسات العالمية.' },
  clientsSubtitle: {
    en: 'We architect experiences for organizations where precision, security, and world-class prestige are non-negotiable.',
    ar: 'نصنع الفعاليات للجهات التي تضع الدقة الفائقة والأمان المطلق والهيبة العالمية في صدارة أولوياتها.',
  },

  // Sectors
  sectorsEyebrow: { en: 'INDUSTRY VERTICALS', ar: 'القطاعات المتخصصة' },
  sectorsHeading: { en: 'Tailored Sector Mastery Across High-Stakes Domains.', ar: 'خبرة قطاعية عميقة تواكب متطلبات المجالات الحساسة.' },
  sectorsSubtitle: {
    en: 'Each industry commands specific protocol, visual language, and attendee dynamics. Our vertical-specific teams bring decades of specialized execution.',
    ar: 'كل قطاع يتميز ببروتوكوله الخاص، ولغته البصرية، وديناميكية جمهوره. توفر فرقنا المتخصصة عقوداً من الخبرة التنفيذية في المملكة والمنطقة.',
  },
  sectorKeyCapabilities: { en: 'Key Domain Capabilities', ar: 'أبرز القدرات التنفيذية في القطاع' },
  sectorBadge: { en: 'Sector Expertise', ar: 'تخصص قطاعي' },
  sectorCtaPrefix: { en: 'Request Credentials for ', ar: 'طلب سابقة أعمال قطاع ' },

  // Case Studies
  storiesEyebrow: { en: 'FEATURED CASE STUDIES & STORIES', ar: 'قصص نجاح ودراسات حالة بارزة' },
  storiesHeading: { en: 'Landmark Experiences Crafted on the World Stage.', ar: 'فعاليات تاريخية صيغت بإتقان على المسرح العالمي.' },
  storiesSubtitle: {
    en: 'Explore how we translate high-stakes visions into viral product launches, immersive pavilions, and sovereign summits.',
    ar: 'اكتشف كيف نحول الرؤى الطموحة إلى تدشينات منتجات تصنع الزخم، وأجنحة معمارية غامرة، وقمم سيادية ملهمة.',
  },
  storiesAll: { en: 'All', ar: 'الكل' },
  storiesSummits: { en: 'Summits & Conferences', ar: 'القمم والمؤتمرات' },
  storiesBrand: { en: 'Brand Experiences', ar: 'تجارب العلامات' },
  storiesExhibitions: { en: 'Exhibitions & Booths', ar: 'المعارض والأجنحة' },
  storiesCorporate: { en: 'Corporate Events', ar: 'الفعاليات المؤسسية' },
  storiesCreative: { en: 'Creative & Storytelling', ar: 'الإبداع والسرد' },
  viewCaseStudy: { en: 'View Project Case Study', ar: 'استعراض تفاصيل المشروع' },

  // Why Us
  whyUsEyebrow: { en: 'WHY WORK WITH 60FRAMEWORKS', ar: 'لماذا تختار 60 فريمووركس' },
  whyUsHeading: { en: 'Where Uncompromising Strategy Meets Creative Audacity.', ar: 'حيث تلتقي الاستراتيجية الدقيقة بالجرأة الإبداعية.' },
  whyUsSubtitle: {
    en: 'We eliminate the traditional friction between abstract creative agencies and heavy technical production houses by unifying both into a single seamless powerhouse.',
    ar: 'نقضي على الفجوة التقليدية بين الوكالات الإبداعية وشركات الإنتاج الفني والتقني من خلال توحيد المنظومتين في بيت خبرة واحد متكامل.',
  },
  whyUsCta: { en: 'Initiate Executive Consultation', ar: 'بدء استشارة تنفيذية' },
  whyUsBadgeTitle: { en: '100% End-to-End Accountability', ar: 'مسؤولية تنفيذية شاملة 100%' },
  whyUsBadgeDesc: { en: 'Concept, spatial build, AV, showrunning & post-event audit under one roof.', ar: 'الفكرة، البناء المعماري، الصوت والضوء، الإخراج، والتدقيق تحت سقف واحد.' },

  whyPillar1Title: { en: 'Experience-First Architecture', ar: 'هندسة ترتكز على التجربة الإنسانية' },
  whyPillar1Desc: { en: 'We do not view events as logistical schedules; we engineer holistic emotional journeys where every spatial, acoustic, and visual cue commands attention.', ar: 'لا نرى الفعاليات مجرد جداول لوجستية؛ بل نهندس رحلات عاطفية متكاملة تأسر الحواس عبر كل تفصيلة مكانية وصوتية وبصرية.' },

  whyPillar2Title: { en: 'Story-Driven Narrative Craft', ar: 'سرد قصصي سينمائي ملهم' },
  whyPillar2Desc: { en: 'Grand visuals without narrative depth fade quickly. We build cinematic story arcs that connect product capabilities directly with human aspirations.', ar: 'المشاهد البصرية الكبرى تتلاشى بدون عمق قصصي. نبني حبكات ملهمة تربط قدرات علامتك التجارية بطموحات الجمهور وتطلعاته.' },

  whyPillar3Title: { en: 'Lasting Moments & Tangible ROI', ar: 'أثر مستدام وعائد استثماري ملموس' },
  whyPillar3Desc: { en: 'Our work generates monumental earned media, high-intent investor deals, and institutional memorability that resonates long after stage lights fade.', ar: 'تحقق فعالياتنا زخماً إعلامياً واسعاً، وصفقات استثمارية كبرى، ومكانة مؤسسية راسخة تدوم لأعوام.' },

  whyPillar4Title: { en: 'Sovereign Protocol & B2B/B2G Mastery', ar: 'إتقان البروتوكول السيادي ومراسم الوفود' },
  whyPillar4Desc: { en: 'Deep diplomatic competence, high-security orchestration, and VIP delegation protocol compliance trusted by sovereign leaders and multinational chairpersons.', ar: 'كفاءة دبلوماسية عميقة، وإدارة أمنية عالية المستوى، والتزام صارم ببروتوكول الوفود الرسمية المعتمد لدى القيادات وصناع القرار.' },

  // Testimonials
  testEyebrow: { en: 'CLIENT VOICES & IMPACT', ar: 'آراء شركاء النجاح وأثرنا' },
  testHeading: { en: 'Validated by Global Leaders and Visionaries.', ar: 'شهادات نعتز بها من قادة ومسؤولين عالميين.' },
  testSubtitle: {
    en: 'Real outcomes, tangible metric leaps, and transformative experiences reported by the leaders who trust us with their critical milestones.',
    ar: 'نتائج واقعية وقفزات قياسية وتجارب استثنائية يرويها القادة الذين ائتمنونا على أهم محطاتهم الاستراتيجية.',
  },

  // Final CTA
  finalCtaEyebrow: { en: 'START YOUR NEXT DEFINING MOMENT', ar: 'ابدأ محطتك الاستثنائية القادمة' },
  finalCtaHeading: { en: "Let's Create Something Meaningful.", ar: 'معاً نصنع تجربة تخلد في التاريخ.' },
  finalCtaSubtitle: {
    en: 'Whether planning a sovereign summit, launching a category-defining brand, or constructing an architectural pavilion, our strategy team is ready.',
    ar: 'سواء كنت تخطط لقمة سيادية كبرى، أو إطلاق علامة تجارية رائدة، أو تشييد جناح معماري أيقوني، فريقنا الاستشاري في أتم الجاهزية لدعمك.',
  },
  finalCtaButton: { en: 'CONNECT WITH OUR TEAM', ar: 'تواصل مع فريقنا الاستشاري' },

  // Footer
  footerDesc: {
    en: 'A global creative & experiential agency transforming corporate summits, pavilions, and brand revelations into unforgettable human experiences.',
    ar: 'وكالة إبداعية عالمية تحول القمم والمؤتمرات الكبرى والأجنحة المعمارية والتدشينات إلى تجارب إنسانية استثنائية لا تُنسى.',
  },
  footerNavTitle: { en: 'Navigation', ar: 'أقسام الموقع' },
  footerExpertiseTitle: { en: 'Expertise', ar: 'مجالات الخبرة' },
  footerContactTitle: { en: 'Headquarters & Inquiries', ar: 'المكاتب والتواصل' },
  footerHubs: { en: 'Regional & Global Hubs: Riyadh • Dubai • London • New York', ar: 'المقرات الإقليمية والدولية: الرياض 🇸🇦 • دبي • لندن • نيويورك' },
  footerDirectBtn: { en: 'Direct Inquiry', ar: 'طلب استشارة فورية' },
  footerCopyright: { en: '60FRAMEWORKS Experiential Marketing Group. All rights reserved.', ar: 'مجموعة 60 فريمووركس للتسويق التجريبي والفعاليات. جميع الحقوق محفوظة.' },
  footerPrivacy: { en: 'Privacy Policy', ar: 'سياسة الخصوصية' },
  footerTerms: { en: 'Terms of Engagement', ar: 'الشروط والأحكام' },
  footerBackToTop: { en: 'Back to Top', ar: 'العودة للأعلى' },

  // Contact Modal
  contactModalEyebrow: { en: 'EXECUTIVE CONSULTATION', ar: 'طلب استشارة تنفيذية' },
  contactModalHeading: { en: "Let's Shape Your Next Milestone.", ar: 'لنصنع معاً محطتكم الاستثنائية القادمة.' },
  contactModalSubtitle: {
    en: 'Provide details regarding your upcoming summit, brand activation, or exhibition. Our strategy leads respond within 24 hours.',
    ar: 'يرجى تزويدنا بتفاصيل فعاليتكم أو قمتكم أو معرضكم المرتقب؛ وسيقوم مستشارونا بالتواصل معكم خلال 24 ساعة.',
  },
  formFullName: { en: 'Full Name *', ar: 'الاسم الكريم *' },
  formFullNamePlaceholder: { en: 'e.g. Tariq Al-Mansoor', ar: 'مثال: طارق المنصور' },
  formEmail: { en: 'Work Email *', ar: 'البريد الإلكتروني للعمل *' },
  formEmailPlaceholder: { en: 'e.g. t.almansoor@entity.gov.sa', ar: 'مثال: t.mansoor@entity.gov.sa' },
  formCompany: { en: 'Company / Organization *', ar: 'الجهة / الهيئة / الشركة *' },
  formCompanyPlaceholder: { en: 'e.g. Sovereign Authority', ar: 'مثال: الهيئة الوطنية للاستثمار' },
  formPhone: { en: 'Phone / WhatsApp', ar: 'رقم الهاتف / واتساب' },
  formServiceInterest: { en: 'Primary Service Interest', ar: 'الخدمة المطلوبة' },
  formBudget: { en: 'Estimated Budget Bracket', ar: 'الميزانية التقديرية المتوقعة' },
  formMessage: { en: 'Project Brief & Objectives *', ar: 'نبذة عن الفعالية والأهداف المرجوة *' },
  formMessagePlaceholder: { en: 'Tell us about target dates, anticipated guest count, location, and key goals...', ar: 'أخبرنا عن الموعد المستهدف، عدد الحضور المتوقع، موقع الفعالية، والأهداف...' },
  formSubmitting: { en: 'Transmitting Inquiry...', ar: 'جاري إرسال الطلب...' },
  formSubmitBtn: { en: 'Submit Strategic Brief', ar: 'إرسال الملف الاستراتيجي' },

  // Project Modal
  projModalNarrative: { en: 'Project Narrative & Strategic Execution', ar: 'السرد القصصي والتنفيذ الاستراتيجي' },
  projModalGallery: { en: 'Visual Documentation', ar: 'التوثيق البصري والتجهيزات' },
  projModalCtaQuestion: { en: 'Interested in similar outcomes for your next brand summit?', ar: 'هل تود تحقيق نتائج مماثلة في فعاليتكم القادمة؟' },
  projModalCtaBtn: { en: 'Discuss Similar Project', ar: 'مناقشة مشروع مماثل' },
  projClientLabel: { en: 'Client:', ar: 'الجهة:' },
  projYearLabel: { en: 'Year:', ar: 'السنة:' },
  projTagsLabel: { en: 'Tags:', ar: 'التصنيفات:' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  dir: 'ltr' | 'rtl';
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('agency_lang', lang);
  };

  useEffect(() => {
    const saved = localStorage.getItem('agency_lang') as Language;
    if (saved && (saved === 'en' || saved === 'ar')) {
      setLanguageState(saved);
    }
  }, []);

  useEffect(() => {
    const dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.dir = dir;
    document.documentElement.lang = language === 'ar' ? 'ar-SA' : 'en';
  }, [language]);

  const t = (key: string): string => {
    if (translations[key]) {
      return translations[key][language] || translations[key].en;
    }
    return key;
  };

  const dir = language === 'ar' ? 'rtl' : 'ltr';

  return (
    <LanguageContext.Provider value={{ language, setLanguage, dir, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
