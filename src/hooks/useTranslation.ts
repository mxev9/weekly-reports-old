import { useState, useEffect } from 'react';

type Language = 'en' | 'ar';

interface Translations {
  weeklySchedule: string;
  weekView: string;
  dayView: string;
  print: string;
  addTag: string;
  resetSchedule: string;
  confirmReset: string;
  confirmResetMessage: string;
  cancel: string;
  confirm: string;
  tagName: string;
  createTag: string;
  selectTags: string;
  noTags: string;
  hour: string;
  hours: string;
  am: string;
  pm: string;
}

const translations: Record<Language, Translations> = {
  en: {
    weeklySchedule: 'Weekly Schedule',
    weekView: 'Week View',
    dayView: 'Day View',
    print: 'Print',
    addTag: 'Add Tag',
    resetSchedule: 'Reset Schedule',
    confirmReset: 'Confirm Reset',
    confirmResetMessage: 'Are you sure you want to clear the entire schedule? This action cannot be undone.',
    cancel: 'Cancel',
    confirm: 'Confirm',
    tagName: 'Tag Name',
    createTag: 'Create Tag',
    selectTags: 'Select Tags',
    noTags: 'No tags available. Create some tags first!',
    hour: 'hour',
    hours: 'hours',
    am: 'AM',
    pm: 'PM',
  },
  ar: {
    weeklySchedule: 'الجدول الأسبوعي',
    weekView: 'عرض الأسبوع',
    dayView: 'عرض اليوم',
    print: 'طباعة',
    addTag: 'إضافة علامة',
    resetSchedule: 'إعادة تعيين الجدول',
    confirmReset: 'تأكيد الإعادة',
    confirmResetMessage: 'هل أنت متأكد من أنك تريد مسح الجدول بالكامل؟ لا يمكن التراجع عن هذا الإجراء.',
    cancel: 'إلغاء',
    confirm: 'تأكيد',
    tagName: 'اسم العلامة',
    createTag: 'إنشاء علامة',
    selectTags: 'اختيار العلامات',
    noTags: 'لا توجد علامات متاحة. قم بإنشاء بعض العلامات أولاً!',
    hour: 'ساعة',
    hours: 'ساعات',
    am: 'صباحاً',
    pm: 'مساءً',
  },
};

const days = {
  en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  ar: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
};

export function useTranslation() {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('schedule-language') as Language;
    if (savedLanguage && ['en', 'ar'].includes(savedLanguage)) {
      setLanguage(savedLanguage);
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    localStorage.setItem('schedule-language', language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'ar' : 'en');
  };

  const t = (key: keyof Translations): string => {
    return translations[language][key];
  };

  return {
    language,
    toggleLanguage,
    t,
    days: days[language],
    isRTL: language === 'ar',
  };
}