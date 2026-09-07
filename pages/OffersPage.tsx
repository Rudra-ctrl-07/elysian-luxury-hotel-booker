import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { offers } from '../data/mockData';
import LazyImage from '../components/LazyImage';

const OffersPage: React.FC = () => {
    const { t } = useLanguage();

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold font-serif">{t('offers_title')}</h1>
                <p className="text-lg text-gray-600 mt-2">{t('offers_subtitle')}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {offers.map(offer => (
                    <div key={offer.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                        <LazyImage src={offer.image} alt={offer.title} className="w-full h-64 object-cover" />
                        <div className="p-6">
                            <h2 className="text-2xl font-bold font-serif mb-2">{offer.title}</h2>
                            <p className="text-gray-600 mb-4">{offer.description}</p>
                            <div className="flex justify-between items-center text-sm text-gray-500">
                                <span>{t('valid_until')}: {new Date(offer.validUntil).toLocaleDateString()}</span>
                                <span className="text-green-600 font-bold text-lg">{offer.discount}% OFF</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OffersPage;
