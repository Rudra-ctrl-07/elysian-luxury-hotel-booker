import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { rooms } from '../data/mockData';
import { Room } from '../types';
import LazyImage from '../components/LazyImage';
import { CheckCircleIcon } from '../components/common/Icon';
import { createBooking, getBookingsForUser } from '../utils/bookingManager';

const BookingPage: React.FC = () => {
    const { roomId } = useParams<{ roomId?: string }>();
    const navigate = useNavigate();
    const { t } = useLanguage();
    const { user } = useAuth();

    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
    const [isConfirmed, setIsConfirmed] = useState(false);
    
    const [formState, setFormState] = useState({
        roomId: roomId ? parseInt(roomId, 10) : (rooms.length > 0 ? rooms[0].id : 0),
        checkIn: '',
        checkOut: '',
        guests: 1,
        personalDetails: {
            firstName: user?.firstName || '',
            lastName: user?.lastName || '',
            email: user?.email || '',
            phone: '',
        },
        paymentDetails: {
            cardNumber: '',
            expiryDate: '',
            cvv: '',
            nameOnCard: '',
        }
    });
    
    useEffect(() => {
        if (user) {
            setFormState(prev => ({
                ...prev,
                personalDetails: {
                    ...prev.personalDetails,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                }
            }));
        }
    }, [user]);

    useEffect(() => {
        const room = rooms.find(r => r.id === formState.roomId);
        if (room) {
            setSelectedRoom(room);
        } else {
            setSelectedRoom(null);
        }
    }, [formState.roomId]);

    useEffect(() => {
        if (roomId) {
            const room = rooms.find(r => r.id === parseInt(roomId, 10));
            if (!room) {
                navigate('/rooms');
            } else {
                setFormState(prev => ({...prev, roomId: parseInt(roomId, 10)}));
            }
        }
    }, [roomId, navigate]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const [section, field] = name.split('.');

        if (section && field && (section === 'personalDetails' || section === 'paymentDetails')) {
             setFormState(prev => ({
                ...prev,
                [section]: {
                    ...prev[section],
                    [field]: value
                }
            }));
        } else if (name === 'roomId') {
            setFormState(prev => ({ ...prev, [name]: value ? parseInt(value, 10) : 0 }));
        }
        else {
            setFormState(prev => ({ ...prev, [name]: value }));
        }
    };
    
    const numberOfNights = useMemo(() => {
        if (formState.checkIn && formState.checkOut) {
            const checkInDate = new Date(formState.checkIn);
            const checkOutDate = new Date(formState.checkOut);
            if (checkOutDate > checkInDate) {
                const diffTime = Math.abs(checkOutDate.getTime() - checkInDate.getTime());
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                return diffDays;
            }
        }
        return 0;
    }, [formState.checkIn, formState.checkOut]);
    
    const totalPrice = useMemo(() => {
        if (selectedRoom && numberOfNights > 0) {
            return selectedRoom.price * numberOfNights;
        }
        return 0;
    }, [selectedRoom, numberOfNights]);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !selectedRoom) {
            alert("You must be logged in to book a room.");
            return;
        }

        const allBookings = getBookingsForUser(user.id);
        const isDoubleBooked = allBookings.some(booking => {
            const existingCheckIn = new Date(booking.checkIn);
            const existingCheckOut = new Date(booking.checkOut);
            const newCheckIn = new Date(formState.checkIn);
            const newCheckOut = new Date(formState.checkOut);
            return (newCheckIn < existingCheckOut && newCheckOut > existingCheckIn);
        });

        if (isDoubleBooked) {
            alert("You already have a booking during this time period. Please select different dates.");
            return;
        }

        const newBooking = {
            userId: user.id,
            roomId: selectedRoom.id,
            checkIn: formState.checkIn,
            checkOut: formState.checkOut,
            guests: Number(formState.guests),
            totalPrice: totalPrice,
            bookingDate: new Date().toISOString(),
            personalDetails: formState.personalDetails,
            paymentDetails: formState.paymentDetails,
        };

        try {
            createBooking(newBooking);
            setIsConfirmed(true);
        } catch (error) {
            if (error instanceof Error) {
                alert(`Booking failed: ${error.message}`);
            } else {
                 alert(`An unknown error occurred during booking.`);
            }
        }
    };
    
    if (isConfirmed) {
        return (
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
                <CheckCircleIcon className="mx-auto" />
                <h1 className="text-4xl font-bold font-serif mt-4">Booking Confirmed!</h1>
                <p className="text-lg text-gray-600 mt-2">Thank you for choosing Elysian Hotels. A confirmation email has been sent to {formState.personalDetails.email}.</p>
                 <div className="flex justify-center space-x-4 mt-8">
                    <button onClick={() => navigate('/')} className="bg-amber-500 text-white px-8 py-3 rounded-full hover:bg-amber-600 transition-colors font-semibold">
                        Back to Home
                    </button>
                    <button onClick={() => navigate('/booking-history')} className="bg-gray-700 text-white px-8 py-3 rounded-full hover:bg-gray-800 transition-colors font-semibold">
                        View My Bookings
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold font-serif">{t('booking_title')}</h1>
                <p className="text-lg text-gray-600 mt-2">{t('booking_subtitle')}</p>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Left side: Form */}
                    <div className="lg:col-span-2 bg-white p-8 rounded-lg shadow-md">
                        {/* Room Selection if no roomId */}
                        {!roomId && (
                             <div className="mb-6">
                                <label htmlFor="roomId" className="block text-gray-700 font-semibold mb-2">Select a Room</label>
                                <select id="roomId" name="roomId" value={formState.roomId || ''} onChange={handleInputChange} required className="w-full p-3 border rounded-md">
                                    <option value="" disabled>Please select a room</option>
                                    {rooms.map(room => (
                                        <option key={room.id} value={room.id}>{room.name} - ₹{room.price}/night</option>
                                    ))}
                                </select>
                            </div>
                        )}
                        {/* Booking Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label htmlFor="checkIn" className="block text-gray-700 font-semibold mb-2">{t('check_in_date')}</label>
                                <input type="date" id="checkIn" name="checkIn" value={formState.checkIn} onChange={handleInputChange} required className="w-full p-3 border rounded-md" min={new Date().toISOString().split('T')[0]}/>
                            </div>
                             <div>
                                <label htmlFor="checkOut" className="block text-gray-700 font-semibold mb-2">{t('check_out_date')}</label>
                                <input type="date" id="checkOut" name="checkOut" value={formState.checkOut} onChange={handleInputChange} required className="w-full p-3 border rounded-md" min={formState.checkIn}/>
                            </div>
                        </div>
                        <div className="mb-6">
                            <label htmlFor="guests" className="block text-gray-700 font-semibold mb-2">{t('guests')}</label>
                            <input type="number" id="guests" name="guests" min="1" max={selectedRoom?.capacity || 10} value={formState.guests} onChange={handleInputChange} required className="w-full p-3 border rounded-md"/>
                        </div>
                        
                        {/* Personal Details */}
                        <h2 className="text-2xl font-bold mb-4 border-t pt-6">Personal Details</h2>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <input type="text" name="personalDetails.firstName" placeholder="First Name" value={formState.personalDetails.firstName} onChange={handleInputChange} required className="w-full p-3 border rounded-md placeholder:text-gray-500"/>
                            <input type="text" name="personalDetails.lastName" placeholder="Last Name" value={formState.personalDetails.lastName} onChange={handleInputChange} required className="w-full p-3 border rounded-md placeholder:text-gray-500"/>
                            <input type="email" name="personalDetails.email" placeholder="Email Address" value={formState.personalDetails.email} onChange={handleInputChange} required className="w-full p-3 border rounded-md placeholder:text-gray-500"/>
                            <input type="tel" name="personalDetails.phone" placeholder="Phone Number" value={formState.personalDetails.phone} onChange={handleInputChange} required className="w-full p-3 border rounded-md placeholder:text-gray-500"/>
                        </div>

                        {/* Payment Details */}
                        <h2 className="text-2xl font-bold mb-4 border-t pt-6">Payment Details</h2>
                         <div className="space-y-4">
                            <input type="text" name="paymentDetails.cardNumber" placeholder="Card Number" value={formState.paymentDetails.cardNumber} onChange={handleInputChange} required className="w-full p-3 border rounded-md placeholder:text-gray-500"/>
                             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <input type="text" name="paymentDetails.expiryDate" placeholder="MM/YY" value={formState.paymentDetails.expiryDate} onChange={handleInputChange} required className="w-full p-3 border rounded-md placeholder:text-gray-500"/>
                                <input type="text" name="paymentDetails.cvv" placeholder="CVV" value={formState.paymentDetails.cvv} onChange={handleInputChange} required className="w-full p-3 border rounded-md placeholder:text-gray-500"/>
                                <input type="text" name="paymentDetails.nameOnCard" placeholder="Name on Card" value={formState.paymentDetails.nameOnCard} onChange={handleInputChange} required className="w-full p-3 border rounded-md placeholder:text-gray-500"/>
                             </div>
                        </div>
                    </div>

                    {/* Right side: Summary */}
                    <div className="bg-gray-50 p-8 rounded-lg shadow-md h-fit sticky top-28">
                        <h2 className="text-2xl font-bold mb-4">Booking Summary</h2>
                        {selectedRoom ? (
                            <>
                                <LazyImage src={selectedRoom.image} alt={selectedRoom.name} className="w-full h-48 object-cover rounded-lg mb-4"/>
                                <h3 className="text-xl font-semibold">{selectedRoom.name}</h3>
                                <p className="text-gray-600">{selectedRoom.type}</p>
                                <div className="border-t my-4"></div>
                                <div className="space-y-2 text-gray-700">
                                    <div className="flex justify-between"><span>{t('price_per_night')}</span> <span>₹{selectedRoom.price}</span></div>
                                    <div className="flex justify-between"><span>{t('nights')}</span> <span>{numberOfNights}</span></div>
                                    <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2"><span>{t('total')}</span> <span>₹{totalPrice}</span></div>
                                </div>
                                <button type="submit" disabled={totalPrice <= 0} className="w-full mt-6 bg-amber-500 text-white p-3 rounded-md font-semibold hover:bg-amber-600 transition-colors disabled:bg-gray-400">
                                    Confirm Booking
                                </button>
                            </>
                        ) : (
                            <p>Please select a room to see the summary.</p>
                        )}
                    </div>
                </div>
            </form>
        </div>
    );
};

export default BookingPage;