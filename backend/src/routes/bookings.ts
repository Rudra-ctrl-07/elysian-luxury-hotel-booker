import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth';
import { validateRequest, bookingSchemas } from '../middleware/validation';

const router = express.Router();
const prisma = new PrismaClient();

// Create a new booking
router.post('/', authenticateToken, validateRequest(bookingSchemas.create), async (req: any, res) => {
  try {
    const { roomId, checkIn, checkOut, guests, personalDetails, paymentDetails } = req.body;
    const userId = req.user.id;

    // Check if room exists and is available
    const room = await prisma.room.findUnique({
      where: { id: roomId },
      include: { hotel: true }
    });

    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    if (!room.isAvailable) {
      return res.status(400).json({ error: 'Room is not available' });
    }

    // Check for conflicting bookings
    const conflictingBookings = await prisma.booking.findMany({
      where: {
        roomId,
        status: 'confirmed',
        OR: [
          {
            AND: [
              { checkIn: { lte: new Date(checkIn) } },
              { checkOut: { gt: new Date(checkIn) } }
            ]
          },
          {
            AND: [
              { checkIn: { lt: new Date(checkOut) } },
              { checkOut: { gte: new Date(checkOut) } }
            ]
          },
          {
            AND: [
              { checkIn: { gte: new Date(checkIn) } },
              { checkOut: { lte: new Date(checkOut) } }
            ]
          }
        ]
      }
    });

    if (conflictingBookings.length > 0) {
      return res.status(400).json({ error: 'Room is not available for the selected dates' });
    }

    // Calculate total price
    const nights = Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24));
    const totalPrice = room.price * nights;

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        userId,
        roomId,
        checkIn: new Date(checkIn),
        checkOut: new Date(checkOut),
        guests,
        totalPrice,
        personalDetails: JSON.stringify(personalDetails),
        paymentDetails: JSON.stringify(paymentDetails),
      },
      include: {
        room: {
          include: {
            hotel: {
              select: {
                id: true,
                name: true,
                location: true,
              }
            }
          }
        },
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          }
        }
      }
    });

    res.status(201).json({
      message: 'Booking created successfully',
      booking: {
        ...booking,
        personalDetails: JSON.parse(booking.personalDetails),
        paymentDetails: JSON.parse(booking.paymentDetails),
      }
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user's bookings
router.get('/my-bookings', authenticateToken, async (req: any, res) => {
  try {
    const userId = req.user.id;
    const { status, page = 1, limit = 10 } = req.query;

    const where: any = { userId };
    if (status) {
      where.status = status;
    }

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        room: {
          include: {
            hotel: {
              select: {
                id: true,
                name: true,
                location: true,
                image: true,
              }
            }
          }
        }
      },
      orderBy: { bookingDate: 'desc' },
      skip: (parseInt(page as string) - 1) * parseInt(limit as string),
      take: parseInt(limit as string),
    });

    const total = await prisma.booking.count({ where });

    res.json({
      bookings: bookings.map(booking => ({
        ...booking,
        personalDetails: JSON.parse(booking.personalDetails),
        paymentDetails: JSON.parse(booking.paymentDetails),
      })),
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total,
        pages: Math.ceil(total / parseInt(limit as string)),
      }
    });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get booking by ID
router.get('/:id', authenticateToken, async (req: any, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const booking = await prisma.booking.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        room: {
          include: {
            hotel: {
              select: {
                id: true,
                name: true,
                location: true,
                description: true,
                rating: true,
                image: true,
              }
            }
          }
        },
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          }
        }
      }
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json({
      ...booking,
      personalDetails: JSON.parse(booking.personalDetails),
      paymentDetails: JSON.parse(booking.paymentDetails),
    });
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Cancel booking
router.patch('/:id/cancel', authenticateToken, async (req: any, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const booking = await prisma.booking.findFirst({
      where: {
        id,
        userId,
        status: 'confirmed',
      }
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found or cannot be cancelled' });
    }

    // Check if booking can be cancelled (e.g., not within 24 hours of check-in)
    const now = new Date();
    const checkInDate = new Date(booking.checkIn);
    const hoursUntilCheckIn = (checkInDate.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (hoursUntilCheckIn < 24) {
      return res.status(400).json({ error: 'Cannot cancel booking within 24 hours of check-in' });
    }

    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: { status: 'cancelled' },
      include: {
        room: {
          include: {
            hotel: {
              select: {
                id: true,
                name: true,
                location: true,
              }
            }
          }
        }
      }
    });

    res.json({
      message: 'Booking cancelled successfully',
      booking: {
        ...updatedBooking,
        personalDetails: JSON.parse(updatedBooking.personalDetails),
        paymentDetails: JSON.parse(updatedBooking.paymentDetails),
      }
    });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update booking
router.patch('/:id', authenticateToken, async (req: any, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { checkIn, checkOut, guests, personalDetails } = req.body;

    const booking = await prisma.booking.findFirst({
      where: {
        id,
        userId,
        status: 'confirmed',
      }
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found or cannot be updated' });
    }

    // Check if booking can be updated (e.g., not within 48 hours of check-in)
    const now = new Date();
    const checkInDate = new Date(booking.checkIn);
    const hoursUntilCheckIn = (checkInDate.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (hoursUntilCheckIn < 48) {
      return res.status(400).json({ error: 'Cannot update booking within 48 hours of check-in' });
    }

    const updateData: any = {};
    if (checkIn) updateData.checkIn = new Date(checkIn);
    if (checkOut) updateData.checkOut = new Date(checkOut);
    if (guests) updateData.guests = guests;
    if (personalDetails) updateData.personalDetails = JSON.stringify(personalDetails);

    // Recalculate total price if dates changed
    if (checkIn || checkOut) {
      const newCheckIn = checkIn ? new Date(checkIn) : booking.checkIn;
      const newCheckOut = checkOut ? new Date(checkOut) : booking.checkOut;
      const nights = Math.ceil((newCheckOut.getTime() - newCheckIn.getTime()) / (1000 * 60 * 60 * 24));
      updateData.totalPrice = booking.room.price * nights;
    }

    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: updateData,
      include: {
        room: {
          include: {
            hotel: {
              select: {
                id: true,
                name: true,
                location: true,
              }
            }
          }
        }
      }
    });

    res.json({
      message: 'Booking updated successfully',
      booking: {
        ...updatedBooking,
        personalDetails: JSON.parse(updatedBooking.personalDetails),
        paymentDetails: JSON.parse(updatedBooking.paymentDetails),
      }
    });
  } catch (error) {
    console.error('Update booking error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
