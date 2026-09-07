import React, { useState, useMemo } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { rooms, hotels } from '../data/mockData';
import RoomCard from '../components/RoomCard';

const RoomsPage: React.FC = () => {
    const { t } = useLanguage();
    const [selectedHotel, setSelectedHotel] = useState<string>('all');
    const [selectedType, setSelectedType] = useState<string>('all');
    const [sortOrder, setSortOrder] = useState<string>('low-to-high');

    const roomTypes = useMemo(() => [...new Set(rooms.map(r => r.type))], []);

    const filteredAndSortedRooms = useMemo(() => {
        let filteredRooms = rooms;

        if (selectedHotel !== 'all') {
            filteredRooms = filteredRooms.filter(room => room.hotelId === parseInt(selectedHotel));
        }

        if (selectedType !== 'all') {
            filteredRooms = filteredRooms.filter(room => room.type === selectedType);
        }

        return filteredRooms.sort((a, b) => {
            if (sortOrder === 'low-to-high') {
                return a.price - b.price;
            } else {
                return b.price - a.price;
            }
        });
    }, [selectedHotel, selectedType, sortOrder]);

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold font-serif">{t('rooms_title')}</h1>
                <p className="text-lg text-gray-600 mt-2">{t('rooms_subtitle')}</p>
            </div>
            
            {/* Filters */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-8 flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                    <div>
                        <label className="font-semibold mr-2">{t('filter_by_hotel')}:</label>
                        <select value={selectedHotel} onChange={e => setSelectedHotel(e.target.value)} className="p-2 border rounded-md">
                            <option value="all">{t('all_hotels')}</option>
                            {hotels.map(hotel => <option key={hotel.id} value={hotel.id}>{hotel.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="font-semibold mr-2">{t('filter_by_type')}:</label>
                        <select value={selectedType} onChange={e => setSelectedType(e.target.value)} className="p-2 border rounded-md">
                            <option value="all">{t('all_types')}</option>
                            {roomTypes.map(type => <option key={type} value={type}>{type}</option>)}
                        </select>
                    </div>
                </div>
                 <div>
                    <label className="font-semibold mr-2">{t('sort_by_price')}:</label>
                    <select value={sortOrder} onChange={e => setSortOrder(e.target.value)} className="p-2 border rounded-md">
                        <option value="low-to-high">{t('price_low_to_high')}</option>
                        <option value="high-to-low">{t('price_high_to_low')}</option>
                    </select>
                </div>
            </div>

            {/* Rooms Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredAndSortedRooms.map(room => (
                    <RoomCard key={room.id} room={room} />
                ))}
            </div>
        </div>
    );
};

export default RoomsPage;
