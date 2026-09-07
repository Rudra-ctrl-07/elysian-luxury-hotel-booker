import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import LazyImage from '../components/LazyImage';

const AboutPage: React.FC = () => {
    const { t } = useLanguage();

    return (
        <div>
            {/* Hero Section */}
            <section className="relative h-[50vh] bg-cover bg-center text-white" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1542314831-068cd1dbb563?q=80&w=2070&auto=format&fit=crop')" }}>
                <div className="absolute inset-0 bg-black/50"></div>
                <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
                    <h1 className="text-5xl font-bold font-serif mb-4">{t('about_title')}</h1>
                    <p className="text-xl">{t('about_subtitle')}</p>
                </div>
            </section>
            
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-3xl font-bold font-serif mb-4">{t('our_story')}</h2>
                        <p className="text-gray-600 leading-relaxed">{t('our_story_text')}</p>
                    </div>
                    <div>
                        <LazyImage src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=2070&auto=format&fit=crop" alt="Hotel Interior" className="rounded-lg shadow-lg" />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mt-20">
                     <div className="order-2 lg:order-1">
                        <LazyImage src="https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=1925&auto=format&fit=crop" alt="Hotel Pool" className="rounded-lg shadow-lg" />
                    </div>
                    <div className="order-1 lg:order-2">
                        <h2 className="text-3xl font-bold font-serif mb-4">{t('our_mission')}</h2>
                        <p className="text-gray-600 leading-relaxed">{t('our_mission_text')}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;
