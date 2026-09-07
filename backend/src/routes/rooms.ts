import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Get all rooms
router.get('/', async (req, res) => {
  try {
    const { hotelId, type, minPrice, maxPrice, available } = req.query;

    const where: any = {};

    if (hotelId) {
      where.hotelId = parseInt(hotelId as string);
    }

    if (type) {
      where.type = type;
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseInt(minPrice as string);
      if (maxPrice) where.price.lte = parseInt(maxPrice as string);
    }

    if (available !== undefined) {
      where.isAvailable = available === 'true';
    }

    const rooms = await prisma.room.findMany({
      where,
      include: {
        hotel: {
          select: {
            id: true,
            name: true,
            location: true,
          }
        }
      },
      orderBy: { price: 'asc' }
    });

    res.json(rooms);
  } catch (error) {
    console.error('Get rooms error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get room by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const roomId = parseInt(id);

    if (isNaN(roomId)) {
      return res.status(400).json({ error: 'Invalid room ID' });
    }

    const room = await prisma.room.findUnique({
      where: { id: roomId },
      include: {
        hotel: {
          select: {
            id: true,
            name: true,
            location: true,
            description: true,
            rating: true,
          }
        }
      }
    });

    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    res.json(room);
  } catch (error) {
    console.error('Get room error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Check room availability
router.get('/:id/availability', async (req, res) => {
  try {
    const { id } = req.params;
    const { checkIn, checkOut } = req.query;
    const roomId = parseInt(id);

    if (isNaN(roomId)) {
      return res.status(400).json({ error: 'Invalid room ID' });
    }

    if (!checkIn || !checkOut) {
      return res.status(400).json({ error: 'Check-in and check-out dates are required' });
    }

    const checkInDate = new Date(checkIn as string);
    const checkOutDate = new Date(checkOut as string);

    // Check for conflicting bookings
    const conflictingBookings = await prisma.booking.findMany({
      where: {
        roomId,
        status: 'confirmed',
        OR: [
          {
            AND: [
              { checkIn: { lte: checkInDate } },
              { checkOut: { gt: checkInDate } }
            ]
          },
          {
            AND: [
              { checkIn: { lt: checkOutDate } },
              { checkOut: { gte: checkOutDate } }
            ]
          },
          {
            AND: [
              { checkIn: { gte: checkInDate } },
              { checkOut: { lte: checkOutDate } }
            ]
          }
        ]
      }
    });

    const isAvailable = conflictingBookings.length === 0;

    res.json({
      roomId,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      isAvailable,
      conflictingBookings: conflictingBookings.length
    });
  } catch (error) {
    console.error('Check availability error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
