

export interface Hotel {
  id: number;
  name: string;
  location: string;
  description: string;
  rating: number;
  image: string;
  rooms: number[];
}

export interface Room {
  id: number;
  hotelId: number;
  name: string;
  type: 'Single' | 'Double' | 'Suite' | 'Penthouse';
  price: number;
  amenities: string[];
  capacity: number;
  isAvailable: boolean;
  image: string;
  size: number; // in sqft
}

export interface Offer {
  id: number;
  title: string;
  description: string;
  discount: number; // percentage
  validUntil: string;
  image: string;
}

export interface Testimonial {
  id: number;
  name: string;
  location: string;
  comment: string;
  rating: number;
  avatar: string;
}

export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    passwordHash: string;
}

export interface BookingDetails {
  id?: string;
  userId: string;
  roomId: number;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  bookingDate: string;
  personalDetails: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  paymentDetails: {
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    nameOnCard: string;
  };
}
