import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { MenuIcon, XIcon, LanguageIcon, UserCircleIcon } from './common/Icon';

const Header: React.FC = () => {
    const { language, setLanguage, t } = useLanguage();
    const { user, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 10) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleLanguage = () => {
        setLanguage(language === 'en' ? 'hi' : 'en');
    };

    const navLinks = [
        { to: '/', label: t('nav_home') },
        { to: '/rooms', label: t('nav_rooms') },
        { to: '/offers', label: t('nav_offers') },
        { to: '/about', label: t('nav_about') },
        { to: '/contact', label: t('nav_contact') },
    ];

    const activeLinkStyle = {
        color: '#D4AF37', // brand-gold
    };
    
    const headerClass = `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled || isOpen ? 'bg-white shadow-md text-gray-800' : 'bg-transparent text-white'}`;


    return (
        <header className={headerClass}>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <Link to="/" className="text-2xl font-bold font-serif text-brand-gold">
                        Elysian
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-8">
                        {navLinks.map(link => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                style={({ isActive }) => (isActive ? activeLinkStyle : {})}
                                className={`font-semibold hover:text-brand-gold transition-colors pb-1 border-b-2 ${isScrolled || isOpen ? 'border-transparent' : 'border-transparent'}`}
                            >
                                {link.label}
                            </NavLink>
                        ))}
                    </nav>

                    <div className="hidden md:flex items-center space-x-4">
                        <button
                            onClick={toggleLanguage}
                            className={`flex items-center space-x-2 border rounded-full py-2 px-4 transition-colors duration-300 ${isScrolled || isOpen ? 'border-gray-300 hover:bg-gray-100' : 'border-white hover:bg-white/10'}`}
                        >
                            <LanguageIcon className="h-5 w-5" />
                            <span className="font-semibold">{language.toUpperCase()}</span>
                        </button>
                        {user ? (
                             <div className="relative" ref={profileRef}>
                                <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="rounded-full h-10 w-10 flex items-center justify-center">
                                    <UserCircleIcon className={`h-8 w-8 ${isScrolled || isOpen ? 'text-gray-600' : 'text-white'}`} />
                                </button>
                                {isProfileOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 text-gray-800">
                                        <Link to="/profile" className="block px-4 py-2 text-sm hover:bg-gray-100" onClick={() => setIsProfileOpen(false)}>Profile</Link>
                                        <Link to="/booking-history" className="block px-4 py-2 text-sm hover:bg-gray-100" onClick={() => setIsProfileOpen(false)}>My Bookings</Link>
                                        <button onClick={() => { logout(); setIsProfileOpen(false); }} className="w-full text-left block px-4 py-2 text-sm hover:bg-gray-100">Logout</button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <Link to="/login" className="font-semibold">Sign In</Link>
                                <Link to="/signup" className="bg-brand-gold text-white px-6 py-2 rounded-full hover:bg-yellow-600 transition-colors font-semibold">
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button onClick={() => setIsOpen(!isOpen)}>
                            {isOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation */}
            {isOpen && (
                <div className="md:hidden bg-white text-gray-800 shadow-lg">
                    <nav className="flex flex-col items-center space-y-4 py-4">
                        {navLinks.map(link => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                onClick={() => setIsOpen(false)}
                                style={({ isActive }) => (isActive ? activeLinkStyle : {})}
                                className="font-semibold hover:text-brand-gold transition-colors text-lg"
                            >
                                {link.label}
                            </NavLink>
                        ))}
                        <div className="flex flex-col items-center space-y-4 pt-4 border-t w-full px-4">
                             <button
                                onClick={() => {
                                    toggleLanguage();
                                }}
                                className="w-full flex justify-center items-center space-x-2 border border-gray-300 rounded-full py-2 px-4 hover:bg-gray-100"
                            >
                                <LanguageIcon className="h-5 w-5" />
                                <span className="font-semibold">{language.toUpperCase()}</span>
                            </button>
                            {user ? (
                                <>
                                    <Link to="/profile" onClick={() => setIsOpen(false)} className="w-full text-center font-semibold py-2">Profile</Link>
                                    <Link to="/booking-history" onClick={() => setIsOpen(false)} className="w-full text-center font-semibold py-2">My Bookings</Link>
                                    <button onClick={() => { logout(); setIsOpen(false); }} className="w-full font-semibold py-2">Logout</button>
                                </>
                            ) : (
                                <>
                                    <Link 
                                        to="/login" 
                                        onClick={() => setIsOpen(false)}
                                        className="w-full text-center font-semibold py-2"
                                    >
                                       Sign In
                                    </Link>
                                     <Link 
                                        to="/signup" 
                                        onClick={() => setIsOpen(false)}
                                        className="w-full bg-brand-gold text-white px-6 py-2 rounded-full hover:bg-yellow-600 transition-colors font-semibold text-center"
                                    >
                                       Sign Up
                                    </Link>
                                </>
                            )}
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
};

export default Header;
