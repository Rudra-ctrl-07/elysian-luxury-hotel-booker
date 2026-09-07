import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Get all hotels
router.get('/', async (req, res) => {
  try {
    const hotels = await prisma.hotel.findMany({
      include: {
        rooms: {
          select: {
            id: true,
            name: true,
            type: true,
            price: true,
            isAvailable: true,
          }
        }
      },
      orderBy: { name: 'asc' }
    });

    res.json(hotels);
  } catch (error) {
    console.error('Get hotels error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get hotel by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const hotelId = parseInt(id);

    if (isNaN(hotelId)) {
      return res.status(400).json({ error: 'Invalid hotel ID' });
    }

    const hotel = await prisma.hotel.findUnique({
      where: { id: hotelId },
      include: {
        rooms: {
          orderBy: { price: 'asc' }
        }
      }
    });

    if (!hotel) {
      return res.status(404).json({ error: 'Hotel not found' });
    }

    res.json(hotel);
  } catch (error) {
    console.error('Get hotel error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
