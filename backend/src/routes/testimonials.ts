import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Get all testimonials
router.get('/', async (req, res) => {
  try {
    const { rating, limit = 10, page = 1 } = req.query;

    const where: any = {};
    if (rating) {
      where.rating = parseInt(rating as string);
    }

    const testimonials = await prisma.testimonial.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (parseInt(page as string) - 1) * parseInt(limit as string),
      take: parseInt(limit as string),
    });

    const total = await prisma.testimonial.count({ where });

    res.json({
      testimonials,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total,
        pages: Math.ceil(total / parseInt(limit as string)),
      }
    });
  } catch (error) {
    console.error('Get testimonials error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get testimonial by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const testimonialId = parseInt(id);

    if (isNaN(testimonialId)) {
      return res.status(400).json({ error: 'Invalid testimonial ID' });
    }

    const testimonial = await prisma.testimonial.findUnique({
      where: { id: testimonialId }
    });

    if (!testimonial) {
      return res.status(404).json({ error: 'Testimonial not found' });
    }

    res.json(testimonial);
  } catch (error) {
    console.error('Get testimonial error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get featured testimonials (high ratings)
router.get('/featured/list', async (req, res) => {
  try {
    const { limit = 5 } = req.query;

    const testimonials = await prisma.testimonial.findMany({
      where: {
        rating: { gte: 4 }
      },
      orderBy: [
        { rating: 'desc' },
        { createdAt: 'desc' }
      ],
      take: parseInt(limit as string),
    });

    res.json(testimonials);
  } catch (error) {
    console.error('Get featured testimonials error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get testimonials by rating
router.get('/rating/:rating', async (req, res) => {
  try {
    const { rating } = req.params;
    const { limit = 10, page = 1 } = req.query;
    const ratingValue = parseInt(rating);

    if (isNaN(ratingValue) || ratingValue < 1 || ratingValue > 5) {
      return res.status(400).json({ error: 'Invalid rating value. Must be between 1 and 5' });
    }

    const testimonials = await prisma.testimonial.findMany({
      where: { rating: ratingValue },
      orderBy: { createdAt: 'desc' },
      skip: (parseInt(page as string) - 1) * parseInt(limit as string),
      take: parseInt(limit as string),
    });

    const total = await prisma.testimonial.count({ where: { rating: ratingValue } });

    res.json({
      testimonials,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total,
        pages: Math.ceil(total / parseInt(limit as string)),
      }
    });
  } catch (error) {
    console.error('Get testimonials by rating error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
