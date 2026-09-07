import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { LocationMarkerIcon } from '../components/common/Icon';

const ContactPage: React.FC = () => {
    const { t } = useLanguage();

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold font-serif">{t('contact_title')}</h1>
                <p className="text-lg text-gray-600 mt-2">{t('contact_subtitle')}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="bg-white p-8 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold mb-4">{t('get_in_touch')}</h2>
                    <form>
                        <div className="mb-4">
                            <label htmlFor="name" className="block text-gray-700 font-semibold mb-2">Name</label>
                            <input type="text" id="name" className="w-full p-3 border rounded-md" />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">Email</label>
                            <input type="email" id="email" className="w-full p-3 border rounded-md" />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="message" className="block text-gray-700 font-semibold mb-2">Message</label>
                            <textarea id="message" rows={5} className="w-full p-3 border rounded-md"></textarea>
                        </div>
                        <button type="submit" className="w-full bg-amber-500 text-white p-3 rounded-md font-semibold hover:bg-amber-600 transition-colors">
                            {t('send_message')}
                        </button>
                    </form>
                </div>

                <div>
                    <h3 className="text-xl font-bold mb-4">Our Locations</h3>
                    <div className="space-y-4">
                        <div className="flex items-start">
                            <LocationMarkerIcon />
                            <div className="ml-4">
                                <h4 className="font-semibold">Elysian Grand, New York</h4>
                                <p>123 Luxury Ave, New York, NY, USA</p>
                            </div>
                        </div>
                         <div className="flex items-start">
                            <LocationMarkerIcon />
                            <div className="ml-4">
                                <h4 className="font-semibold">Elysian Palace, Paris</h4>
                                <p>456 Champs-Élysées, Paris, France</p>
                            </div>
                        </div>
                         <div className="flex items-start">
                            <LocationMarkerIcon />
                            <div className="ml-4">
                                <h4 className="font-semibold">Elysian Sands, Maldives</h4>
                                <p>789 Paradise Island, Maldives</p>
                            </div>
                        </div>
                    </div>
                    <div className="mt-8">
                         {/* A map component would go here */}
                         <div className="w-full h-80 bg-gray-300 rounded-lg flex items-center justify-center text-gray-500">
                             Map Placeholder
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
