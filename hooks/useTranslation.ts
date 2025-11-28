import { useContext } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';
import en from '../i18n/locales/en.json';
import ar from '../i18n/locales/ar.json';

const translations = { en, ar };

export const useTranslation = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useTranslation must be used within a LanguageProvider');
    }
    const { language, setLanguage } = context;

    const t = (key: string, replacements?: Record<string, string | number>): string => {
        let translation = (translations[language] as any)[key] || (translations['en'] as any)[key] || key;
        
        if (replacements) {
            Object.keys(replacements).forEach(placeholder => {
                translation = translation.replace(`{{${placeholder}}}`, String(replacements[placeholder]));
            });
        }
        
        return translation;
    };

    return { t, language, setLanguage };
};