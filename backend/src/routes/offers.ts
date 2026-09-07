import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Get all active offers
router.get('/', async (req, res) => {
  try {
    const { active } = req.query;
    const now = new Date();

    const where: any = {};
    if (active === 'true') {
      where.validUntil = { gt: now };
    }

    const offers = await prisma.offer.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    res.json(offers);
  } catch (error) {
    console.error('Get offers error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get offer by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const offerId = parseInt(id);

    if (isNaN(offerId)) {
      return res.status(400).json({ error: 'Invalid offer ID' });
    }

    const offer = await prisma.offer.findUnique({
      where: { id: offerId }
    });

    if (!offer) {
      return res.status(404).json({ error: 'Offer not found' });
    }

    res.json(offer);
  } catch (error) {
    console.error('Get offer error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get active offers (convenience endpoint)
router.get('/active/list', async (req, res) => {
  try {
    const now = new Date();
    
    const offers = await prisma.offer.findMany({
      where: {
        validUntil: { gt: now }
      },
      orderBy: { discount: 'desc' }
    });

    res.json(offers);
  } catch (error) {
    console.error('Get active offers error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
