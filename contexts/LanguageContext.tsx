import React, { createContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'ar' | 'en';

interface LanguageContextType {
    language: Language;
    setLanguage: (language: Language) => void;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
    children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
    const [language, setLanguageState] = useState<Language>(() => {
        const savedLang = localStorage.getItem('language');
        // Check user's browser language for initial default
        const browserLang = navigator.language.split('-')[0];
        if (savedLang === 'en' || savedLang === 'ar') {
            return savedLang;
        }
        if (browserLang === 'en') {
            return 'en';
        }
        return 'ar';
    });

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem('language', lang);
    };
    
    useEffect(() => {
        document.documentElement.lang = language;
        document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
        if (language === 'ar') {
          document.body.classList.add('font-sans');
          document.body.classList.remove('font-sans'); // Example if you had different font for english
        } else {
          document.body.classList.add('font-sans');
          document.body.classList.remove('font-sans');
        }

    }, [language]);

    return (
        <LanguageContext.Provider value={{ language, setLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};