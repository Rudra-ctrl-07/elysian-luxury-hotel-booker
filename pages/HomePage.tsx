import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { rooms, offers, testimonials } from '../data/mockData';
import RoomCard from '../components/RoomCard';
import LazyImage from '../components/LazyImage';
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon, StarIcon } from '../components/common/Icon';

const HomePage: React.FC = () => {
  const { t } = useLanguage();
  const [currentTestimonial, setCurrentTestimonial] = React.useState(0);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };
  
  return (
    <div className="-mt-20">
      {/* Hero Section */}
      <section className="relative h-screen bg-cover bg-center text-white" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop')" }}>
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
          <h1 className="text-5xl md:text-7xl font-bold font-serif mb-4">{t('hero_title')}</h1>
          <p className="text-lg md:text-xl max-w-3xl mb-8">{t('hero_subtitle')}</p>
          <Link to="/rooms" className="bg-amber-500 text-white px-8 py-3 rounded-full hover:bg-amber-600 transition-colors font-semibold text-lg">
            {t('explore_rooms')}
          </Link>
        </div>
      </section>

      {/* Booking Widget - Simplified */}
      <section className="bg-gray-100 py-12">
        <div className="container mx-auto px-4">
          <div className="bg-white p-8 rounded-lg shadow-lg flex flex-col lg:flex-row items-center justify-between gap-4">
            <div className="flex-1 w-full">
                <label className="font-semibold">{t('destination')}</label>
                <input type="text" placeholder="e.g. New York, Paris" className="w-full p-3 border rounded-md mt-1 placeholder:text-gray-500"/>
            </div>
            <div className="flex-1 w-full">
                <label className="font-semibold">{t('check_in')}</label>
                <input type="date" className="w-full p-3 border rounded-md mt-1"/>
            </div>
            <div className="flex-1 w-full">
                <label className="font-semibold">{t('check_out')}</label>
                <input type="date" className="w-full p-3 border rounded-md mt-1"/>
            </div>
            <Link to="/booking" className="w-full lg:w-auto bg-amber-500 text-white px-8 py-3 rounded-md hover:bg-amber-600 transition-colors font-semibold flex items-center justify-center space-x-2 h-[50px] mt-2 lg:mt-7">
                <CalendarIcon className="h-5 w-5 text-white" />
                <span>{t('check_availability')}</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Rooms */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold font-serif">{t('featured_rooms_title')}</h2>
            <p className="text-lg text-gray-600 mt-2">{t('featured_rooms_subtitle')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {rooms.slice(0, 3).map(room => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
        </div>
      </section>

      {/* Special Offers */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold font-serif">{t('special_offers_title')}</h2>
            <p className="text-lg text-gray-600 mt-2">{t('special_offers_subtitle')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {offers.slice(0, 3).map(offer => (
              <div key={offer.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <LazyImage src={offer.image} alt={offer.title} className="w-full h-56 object-cover" />
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{offer.title}</h3>
                  <p className="text-gray-600 mb-4">{offer.description}</p>
                  <Link to="/offers" className="font-semibold text-amber-500 hover:text-amber-600">{t('learn_more')}</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=2070&auto=format&fit=crop')" }}>
          <div className="container mx-auto px-4 relative">
            <div className="bg-white/90 backdrop-blur-sm p-12 rounded-lg shadow-xl max-w-4xl mx-auto text-center relative">
              <h2 className="text-4xl font-bold font-serif mb-4 text-gray-800">{t('testimonials_title')}</h2>
              <p className="text-lg text-gray-600 mb-8">{t('testimonials_subtitle')}</p>
              
              <div className="relative">
                <p className="text-xl italic text-gray-700 mb-6">"{testimonials[currentTestimonial].comment}"</p>
                <div className="flex justify-center items-center mb-4">
                    {Array.from({length: testimonials[currentTestimonial].rating}).map((_, i) => <StarIcon key={i}/>)}
                </div>
                <div className="font-semibold text-gray-900">{testimonials[currentTestimonial].name}</div>
                <div className="text-gray-500">{testimonials[currentTestimonial].location}</div>

                <button onClick={prevTestimonial} className="absolute top-1/2 -translate-y-1/2 -left-16 bg-white/50 p-2 rounded-full hover:bg-white/80 transition-colors">
                    <ChevronLeftIcon />
                </button>
                <button onClick={nextTestimonial} className="absolute top-1/2 -translate-y-1/2 -right-16 bg-white/50 p-2 rounded-full hover:bg-white/80 transition-colors">
                    <ChevronRightIcon />
                </button>
              </div>
            </div>
          </div>
      </section>
    </div>
  );
};

export default HomePage;
