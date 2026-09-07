import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { BookingDetails, Room } from '../types';
import { getBookingsForUser, cancelBooking } from '../utils/bookingManager';
import { rooms, hotels } from '../data/mockData';
import LazyImage from '../components/LazyImage';
import { Link } from 'react-router-dom';

const BookingHistoryPage: React.FC = () => {
    const { user } = useAuth();
    const [bookings, setBookings] = useState<BookingDetails[]>([]);
    
    useEffect(() => {
        if (user) {
            setBookings(getBookingsForUser(user.id));
        }
    }, [user]);

    const handleCancelBooking = (bookingId: string) => {
        if (user && window.confirm('Are you sure you want to cancel this booking?')) {
            try {
                cancelBooking(bookingId, user.id);
                setBookings(bookings.filter(b => b.id !== bookingId));
            } catch (error) {
                if(error instanceof Error) {
                    alert(error.message);
                }
            }
        }
    };
    
    const getRoomDetails = (roomId: number): Room | undefined => {
        return rooms.find(r => r.id === roomId);
    }
    
    const getHotelName = (roomId: number): string => {
        const room = getRoomDetails(roomId);
        const hotel = hotels.find(h => h.id === room?.hotelId);
        return hotel ? hotel.name : 'Unknown Hotel';
    }

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl font-bold font-serif mb-8">My Bookings</h1>
            {bookings.length > 0 ? (
                <div className="space-y-6">
                    {bookings.map(booking => {
                        const room = getRoomDetails(booking.roomId);
                        if (!room) return null;
                        const isUpcoming = new Date(booking.checkIn) > new Date();

                        return (
                            <div key={booking.id} className="bg-white p-6 rounded-lg shadow-md flex flex-col md:flex-row gap-6">
                                <LazyImage src={room.image} alt={room.name} className="w-full md:w-1/3 h-48 object-cover rounded-md"/>
                                <div className="flex-grow">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h2 className="text-xl font-bold font-serif">{room.name}</h2>
                                            <p className="text-gray-600">{getHotelName(room.id)}</p>
                                        </div>
                                        {isUpcoming ? 
                                            <span className="text-sm bg-blue-100 text-blue-800 font-semibold px-2.5 py-0.5 rounded-full">Upcoming</span> :
                                            <span className="text-sm bg-gray-100 text-gray-800 font-semibold px-2.5 py-0.5 rounded-full">Past</span>
                                        }
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                                        <div>
                                            <p className="font-semibold">Check-in</p>
                                            <p>{new Date(booking.checkIn).toLocaleDateString()}</p>
                                        </div>
                                        <div>
                                            <p className="font-semibold">Check-out</p>
                                            <p>{new Date(booking.checkOut).toLocaleDateString()}</p>
                                        </div>
                                         <div>
                                            <p className="font-semibold">Guests</p>
                                            <p>{booking.guests}</p>
                                        </div>
                                        <div>
                                            <p className="font-semibold">Total Price</p>
                                            <p>₹{booking.totalPrice}</p>
                                        </div>
                                    </div>
                                    {isUpcoming && (
                                        <div className="mt-4">
                                             <button onClick={() => handleCancelBooking(booking.id!)} className="text-sm text-red-600 hover:text-red-800 font-semibold">Cancel Booking</button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            ) : (
                <div className="text-center py-16">
                    <h2 className="text-2xl font-semibold text-gray-700">You have no bookings yet.</h2>
                    <p className="text-gray-500 mt-2">Ready for your next getaway?</p>
                    <Link to="/rooms" className="mt-4 inline-block bg-amber-500 text-white px-6 py-2 rounded-full hover:bg-amber-600 transition-colors font-semibold">
                        Explore Rooms
                    </Link>
                </div>
            )}
        </div>
    );
};

export default BookingHistoryPage;