import React, { createContext, useContext, useEffect } from 'react';
import { LanguageCode, getTranslation } from '../lib/i18n';

interface LanguageContextType {
  currentLang: LanguageCode;
  setLang: (lang: LanguageCode) => void;
  t: (key: string, fallback?: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  currentLang: 'en',
  setLang: () => {},
  t: (key, fallback) => fallback || key,
});

export const LanguageProvider: React.FC<{
  currentLang: LanguageCode;
  onChangeLang: (lang: LanguageCode) => void;
  children: React.ReactNode;
}> = ({ currentLang, onChangeLang, children }) => {
  const t = (key: string, fallback?: string) => getTranslation(currentLang, key, fallback);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = currentLang;
      const isRtl = currentLang === 'ur' || currentLang === 'ar';
      document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    }
  }, [currentLang]);

  return (
    <LanguageContext.Provider value={{ currentLang, setLang: onChangeLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
