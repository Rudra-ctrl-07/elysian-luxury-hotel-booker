import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { FacebookIcon, TwitterIcon, InstagramIcon } from './common/Icon';

const Footer: React.FC = () => {
    const { t } = useLanguage();
    return (
        <footer className="bg-gray-800 text-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="text-xl font-bold font-serif mb-4">Elysian Hotels</h3>
                        <p className="text-gray-400">Experience Unrivaled Luxury.</p>
                        <div className="flex space-x-4 mt-4">
                            <a href="#" className="text-gray-400 hover:text-white"><FacebookIcon /></a>
                            <a href="#" className="text-gray-400 hover:text-white"><TwitterIcon /></a>
                            <a href="#" className="text-gray-400 hover:text-white"><InstagramIcon /></a>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li><Link to="/about" className="text-gray-400 hover:text-white">{t('footer_about_us')}</Link></li>
                            <li><Link to="/contact" className="text-gray-400 hover:text-white">{t('footer_contact_us')}</Link></li>
                            <li><Link to="/rooms" className="text-gray-400 hover:text-white">{t('nav_rooms')}</Link></li>
                            <li><Link to="/offers" className="text-gray-400 hover:text-white">{t('nav_offers')}</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Legal</h3>
                        <ul className="space-y-2">
                            <li><a href="#" className="text-gray-400 hover:text-white">{t('footer_terms_of_service')}</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white">{t('footer_privacy_policy')}</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
                        <p className="text-gray-400 mb-4">Subscribe for special offers.</p>
                        <form>
                            <div className="flex">
                                <input type="email" placeholder="Your Email" className="w-full bg-gray-700 text-white px-4 py-2 rounded-l-md focus:outline-none placeholder:text-gray-400" />
                                <button type="submit" className="bg-amber-500 text-white px-4 py-2 rounded-r-md hover:bg-amber-600">Go</button>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="mt-8 border-t border-gray-700 pt-8 text-center text-gray-400">
                    <p>{t('footer_copyright')}</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;