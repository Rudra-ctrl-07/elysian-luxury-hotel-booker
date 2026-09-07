import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clear existing data
  await prisma.booking.deleteMany();
  await prisma.room.deleteMany();
  await prisma.hotel.deleteMany();
  await prisma.offer.deleteMany();
  await prisma.testimonial.deleteMany();

  // Create hotels
  const hotels = await Promise.all([
    prisma.hotel.create({
      data: {
        name: 'Elysian Grand Resort',
        location: 'Maldives',
        description: 'Luxury overwater bungalows with crystal clear waters and pristine beaches. Experience ultimate relaxation in our world-class resort.',
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop',
      }
    }),
    prisma.hotel.create({
      data: {
        name: 'Elysian Mountain Lodge',
        location: 'Swiss Alps',
        description: 'Cozy alpine retreat with breathtaking mountain views. Perfect for skiing, hiking, and winter sports enthusiasts.',
        rating: 4.6,
        image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600&fit=crop',
      }
    }),
    prisma.hotel.create({
      data: {
        name: 'Elysian City Suites',
        location: 'New York',
        description: 'Modern urban luxury in the heart of Manhattan. Experience the city that never sleeps with style and comfort.',
        rating: 4.7,
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop',
      }
    }),
    prisma.hotel.create({
      data: {
        name: 'Elysian Desert Oasis',
        location: 'Dubai',
        description: 'Luxury desert resort with world-class amenities. Experience the perfect blend of traditional hospitality and modern luxury.',
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
      }
    }),
  ]);

  console.log(`✅ Created ${hotels.length} hotels`);

  // Create rooms for each hotel
  const roomTypes = [
    { name: 'Standard Room', type: 'Standard', price: 15000, capacity: 2, size: 300, amenities: ['WiFi', 'Air Conditioning', 'Mini Bar', 'TV'] },
    { name: 'Deluxe Room', type: 'Deluxe', price: 25000, capacity: 2, size: 450, amenities: ['WiFi', 'Air Conditioning', 'Mini Bar', 'TV', 'Balcony', 'Ocean View'] },
    { name: 'Suite', type: 'Suite', price: 45000, capacity: 4, size: 800, amenities: ['WiFi', 'Air Conditioning', 'Mini Bar', 'TV', 'Balcony', 'Ocean View', 'Living Room', 'Kitchenette'] },
    { name: 'Penthouse', type: 'Penthouse', price: 85000, capacity: 6, size: 1200, amenities: ['WiFi', 'Air Conditioning', 'Mini Bar', 'TV', 'Balcony', 'Ocean View', 'Living Room', 'Kitchen', 'Private Pool', 'Butler Service'] },
  ];

  for (const hotel of hotels) {
    for (let i = 0; i < 3; i++) { // 3 rooms of each type per hotel
      for (const roomType of roomTypes) {
        await prisma.room.create({
          data: {
            hotelId: hotel.id,
            name: `${roomType.name} ${i + 1}`,
            type: roomType.type,
            price: roomType.price,
            capacity: roomType.capacity,
            size: roomType.size,
            amenities: JSON.stringify(roomType.amenities),
            isAvailable: Math.random() > 0.2, // 80% availability
            image: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 1000000000)}?w=800&h=600&fit=crop`,
          }
        });
      }
    }
  }

  console.log('✅ Created rooms for all hotels');

  // Create offers
  const offers = await Promise.all([
    prisma.offer.create({
      data: {
        title: 'Early Bird Special',
        description: 'Book 30 days in advance and save 20% on your stay',
        discount: 20,
        validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
        image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=400&fit=crop',
      }
    }),
    prisma.offer.create({
      data: {
        title: 'Weekend Getaway',
        description: 'Special weekend rates with complimentary breakfast',
        discount: 15,
        validUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
        image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=400&fit=crop',
      }
    }),
    prisma.offer.create({
      data: {
        title: 'Honeymoon Package',
        description: 'Romantic getaway with champagne and couples massage',
        discount: 25,
        validUntil: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000), // 120 days from now
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=400&fit=crop',
      }
    }),
    prisma.offer.create({
      data: {
        title: 'Business Traveler',
        description: 'Extended stay discounts for business travelers',
        discount: 10,
        validUntil: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days from now
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=400&fit=crop',
      }
    }),
  ]);

  console.log(`✅ Created ${offers.length} offers`);

  // Create testimonials
  const testimonials = [
    {
      name: 'Sarah Johnson',
      location: 'London, UK',
      comment: 'Absolutely stunning resort! The overwater bungalow was beyond our expectations. The staff was incredibly attentive and the views were breathtaking. Will definitely return!',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    },
    {
      name: 'Michael Chen',
      location: 'Tokyo, Japan',
      comment: 'Perfect location in the heart of the city. The room was spacious and modern with all the amenities we needed. The concierge service was exceptional.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    },
    {
      name: 'Emma Rodriguez',
      location: 'Barcelona, Spain',
      comment: 'Amazing mountain views and cozy atmosphere. Perfect for a romantic getaway. The spa services were top-notch and the restaurant had excellent cuisine.',
      rating: 4,
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    },
    {
      name: 'David Thompson',
      location: 'Sydney, Australia',
      comment: 'Luxury at its finest! The penthouse suite was incredible with panoramic city views. The butler service made our stay truly special. Worth every penny!',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    },
    {
      name: 'Lisa Wang',
      location: 'Singapore',
      comment: 'Beautiful desert resort with excellent facilities. The private pool was amazing and the staff went above and beyond to make our stay memorable.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
    },
    {
      name: 'James Wilson',
      location: 'Toronto, Canada',
      comment: 'Great value for money. The room was clean and comfortable, and the location was convenient for business meetings. Would recommend for business travelers.',
      rating: 4,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    },
    {
      name: 'Maria Garcia',
      location: 'Mexico City, Mexico',
      comment: 'Perfect family vacation spot! The kids loved the pool and the family suite was spacious. The staff was very accommodating with our special requests.',
      rating: 4,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
    },
    {
      name: 'Robert Kim',
      location: 'Seoul, South Korea',
      comment: 'Exceptional service and attention to detail. The honeymoon package was perfect and the romantic dinner setup was absolutely beautiful. Highly recommended!',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face',
    },
  ];

  for (const testimonial of testimonials) {
    await prisma.testimonial.create({
      data: testimonial
    });
  }

  console.log(`✅ Created ${testimonials.length} testimonials`);

  console.log('🎉 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
