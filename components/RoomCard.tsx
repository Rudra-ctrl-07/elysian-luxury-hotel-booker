import React from 'react';
import { Link } from 'react-router-dom';
import { Room } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { BedIcon, UsersIcon, SquareFootIcon } from './common/Icon';
import LazyImage from './LazyImage';

interface RoomCardProps {
  room: Room;
}

const RoomCard: React.FC<RoomCardProps> = ({ room }) => {
    const { t } = useLanguage();
    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform transform hover:-translate-y-2">
            <Link to={`/booking/${room.id}`}>
                <LazyImage src={room.image} alt={room.name} className="w-full h-64 object-cover" />
            </Link>
            <div className="p-6">
                <h3 className="text-2xl font-semibold font-serif mb-2">{room.name}</h3>
                <p className="text-gray-600 mb-4">{room.type}</p>
                <div className="flex justify-between items-center mb-4 text-gray-700">
                    <div className="flex items-center space-x-2">
                        <UsersIcon />
                        <span>{room.capacity} Guests</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <BedIcon />
                        <span>{room.type}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <SquareFootIcon />
                        <span>{room.size} sqft</span>
                    </div>
                </div>
                <div className="flex justify-between items-center border-t pt-4">
                    <p className="text-lg font-bold text-gray-800">
                        <span className="text-sm font-normal text-gray-600">{t('from')} </span>
                        ₹{room.price}
                        <span className="text-sm font-normal text-gray-600"> / {t('per_night')}</span>
                    </p>
                    <Link to={`/booking/${room.id}`} className="bg-amber-500 text-white px-4 py-2 rounded-full hover:bg-amber-600 transition-colors font-semibold">
                        {t('book_now')}
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default RoomCard;