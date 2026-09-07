import { BookingDetails } from '../types';

const BOOKINGS_KEY = 'elysian_bookings';

const getBookings = (): BookingDetails[] => {
    const bookings = localStorage.getItem(BOOKINGS_KEY);
    return bookings ? JSON.parse(bookings) : [];
};

const saveBookings = (bookings: BookingDetails[]) => {
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
};

export const createBooking = (bookingDetails: Omit<BookingDetails, 'id' | 'bookingDate'> & { bookingDate: string }): BookingDetails => {
    const bookings = getBookings();
    const newBooking: BookingDetails = {
        ...bookingDetails,
        id: `booking_${new Date().toISOString()}_${Math.random()}`,
    };
    bookings.push(newBooking);
    saveBookings(bookings);
    return newBooking;
};

export const getBookingsForUser = (userId: string): BookingDetails[] => {
    const bookings = getBookings();
    return bookings.filter(booking => booking.userId === userId).sort((a,b) => new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime());
};

export const cancelBooking = (bookingId: string, userId: string): void => {
    let bookings = getBookings();
    const booking = bookings.find(b => b.id === bookingId && b.userId === userId);
    
    if (!booking) {
        throw new Error("Booking not found or you don't have permission to cancel it.");
    }
    
    bookings = bookings.filter(b => b.id !== bookingId);
    saveBookings(bookings);
};
