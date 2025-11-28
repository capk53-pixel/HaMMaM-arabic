import React, { useContext } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';

const LanguageSwitcher: React.FC = () => {
    const context = useContext(LanguageContext);
    if (!context) return null;

    const { language, setLanguage } = context;

    const toggleLanguage = () => {
        const newLang = language === 'ar' ? 'en' : 'ar';
        setLanguage(newLang);
    };

    return (
        <button
            onClick={toggleLanguage}
            className="px-3 py-1.5 border border-slate-300 rounded-md text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label={`Switch to ${language === 'ar' ? 'English' : 'Arabic'}`}
        >
            {language === 'ar' ? 'EN' : 'عربي'}
        </button>
    );
};

export default LanguageSwitcher;
