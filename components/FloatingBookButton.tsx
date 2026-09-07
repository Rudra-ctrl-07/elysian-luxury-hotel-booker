import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { CalendarIcon } from './common/Icon';

const FloatingBookButton: React.FC = () => {
    const { t } = useLanguage();

    return (
        <Link 
            to="/booking"
            className="fixed bottom-8 right-8 bg-amber-500 text-white px-6 py-4 rounded-full shadow-lg hover:bg-amber-600 transition-all duration-300 transform hover:scale-110 z-40 flex items-center space-x-3"
        >
            <CalendarIcon />
            <span className="font-semibold text-lg hidden sm:inline">{t('book_now')}</span>
        </Link>
    );
};

export default FloatingBookButton;
