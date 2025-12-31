const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Event = require('../models/Event');
const connectDB = require('../config/db');

dotenv.config();

const events = [
  {
    title: 'Summer Music Festival 2026',
    description: 'Join us for the biggest music festival of the year! Featuring top artists from around the world, amazing food vendors, and unforgettable experiences. This three-day event promises non-stop entertainment with multiple stages, VIP areas, and camping options.',
    category: 'festival',
    venue: {
      name: 'Indira Gandhi Stadium',
      address: 'Mathura Road',
      city: 'New Delhi',
      state: 'Delhi',
      zipCode: '110001',
    },
    date: new Date('2026-07-15'),
    time: '12:00',
    image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800',
    totalTickets: 5000,
    availableTickets: 3500,
    price: 2499,
    organizer: 'Music Festivals India',
    featured: true,
    tags: ['music', 'outdoor', 'festival', 'summer'],
    status: 'active',
  },
  {
    title: 'Tech Innovation Conference',
    description: 'A premier gathering of tech leaders, innovators, and entrepreneurs. Explore the latest trends in AI, blockchain, cloud computing, and more. Network with industry experts, attend hands-on workshops, and discover the future of technology.',
    category: 'conference',
    venue: {
      name: 'Bangalore International Exhibition Centre',
      address: '10th Mile, Tumkur Road',
      city: 'Bangalore',
      state: 'Karnataka',
      zipCode: '560073',
    },
    date: new Date('2026-06-20'),
    time: '09:00',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
    totalTickets: 2000,
    availableTickets: 1200,
    price: 4999,
    organizer: 'TechWorld India',
    featured: true,
    tags: ['technology', 'innovation', 'networking', 'workshop'],
    status: 'active',
  },
  {
    title: 'Bollywood Musical: The Grand Show',
    description: 'Experience the magic of Indian theater with this spectacular production. A timeless tale of love, music, and dance that has captivated audiences for decades. Featuring stunning sets, beautiful costumes, and an unforgettable score.',
    category: 'theater',
    venue: {
      name: 'NCPA - Tata Theatre',
      address: 'Nariman Point',
      city: 'Mumbai',
      state: 'Maharashtra',
      zipCode: '400021',
    },
    date: new Date('2026-08-10'),
    time: '19:30',
    image: 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=800',
    totalTickets: 1500,
    availableTickets: 450,
    price: 1999,
    organizer: 'Bollywood Productions',
    featured: true,
    tags: ['theater', 'musical', 'bollywood', 'entertainment'],
    status: 'active',
  },
  {
    title: 'IPL Championship Finals',
    description: 'Watch the ultimate showdown as the top teams battle for the championship title. Experience the excitement, energy, and passion of cricket at its finest. Don\'t miss this historic match!',
    category: 'sports',
    venue: {
      name: 'Wankhede Stadium',
      address: 'D Road, Churchgate',
      city: 'Mumbai',
      state: 'Maharashtra',
      zipCode: '400020',
    },
    date: new Date('2026-09-05'),
    time: '20:00',
    image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800',
    totalTickets: 18000,
    availableTickets: 3200,
    price: 3999,
    organizer: 'BCCI',
    featured: true,
    tags: ['cricket', 'sports', 'championship', 'live'],
    status: 'active',
  },
  {
    title: 'Jazz Night with Anoushka Shankar',
    description: 'An intimate evening of smooth jazz featuring the talented Anoushka Shankar and her band. Enjoy classic jazz standards and original compositions in an elegant setting. Perfect for a romantic night out or a sophisticated evening with friends.',
    category: 'concert',
    venue: {
      name: 'Blue Frog',
      address: 'Mathuradas Mills Compound',
      city: 'Mumbai',
      state: 'Maharashtra',
      zipCode: '400013',
    },
    date: new Date('2026-07-25'),
    time: '20:00',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',
    totalTickets: 300,
    availableTickets: 180,
    price: 1499,
    organizer: 'Jazz Society India',
    featured: false,
    tags: ['jazz', 'music', 'live', 'intimate'],
    status: 'active',
  },
  {
    title: 'Web Development Bootcamp',
    description: 'Intensive 2-day workshop covering modern web development technologies including React, Node.js, and MongoDB. Perfect for beginners and intermediate developers looking to level up their skills. Includes hands-on projects and expert guidance.',
    category: 'workshop',
    venue: {
      name: 'Tech Hub Co-working',
      address: 'Koramangala',
      city: 'Bangalore',
      state: 'Karnataka',
      zipCode: '560095',
    },
    date: new Date('2026-08-15'),
    time: '10:00',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800',
    totalTickets: 50,
    availableTickets: 25,
    price: 2999,
    organizer: 'Code Academy India',
    featured: false,
    tags: ['workshop', 'coding', 'education', 'web development'],
    status: 'active',
  },
  {
    title: 'Rock Concert: The Legends Tour',
    description: 'Witness rock legends perform their greatest hits live! A night of pure rock and roll energy featuring multiple iconic bands. This is a once-in-a-lifetime opportunity to see your favorite artists share the stage.',
    category: 'concert',
    venue: {
      name: 'Jawaharlal Nehru Stadium',
      address: 'Lodhi Road',
      city: 'New Delhi',
      state: 'Delhi',
      zipCode: '110003',
    },
    date: new Date('2026-09-20'),
    time: '19:00',
    image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800',
    totalTickets: 20000,
    availableTickets: 8500,
    price: 2999,
    organizer: 'Rock Nation India',
    featured: true,
    tags: ['rock', 'concert', 'live music', 'legends'],
    status: 'active',
  },
  {
    title: 'Food & Wine Festival',
    description: 'Indulge in a culinary adventure featuring top chefs, wine tastings, cooking demonstrations, and gourmet food vendors. Sample dishes from around India and discover new flavors. A must-attend event for food enthusiasts!',
    category: 'festival',
    venue: {
      name: 'Hyderabad International Convention Centre',
      address: 'Novotel & HICC Complex',
      city: 'Hyderabad',
      state: 'Telangana',
      zipCode: '500032',
    },
    date: new Date('2026-10-05'),
    time: '11:00',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800',
    totalTickets: 3000,
    availableTickets: 2100,
    price: 1999,
    organizer: 'Culinary Events India',
    featured: false,
    tags: ['food', 'wine', 'culinary', 'festival'],
    status: 'active',
  },
  {
    title: 'Comedy Night Special',
    description: 'Laugh the night away with top comedians from around India. A hilarious evening of stand-up comedy featuring both established stars and rising talents. Guaranteed to leave you in stitches!',
    category: 'other',
    venue: {
      name: 'Canvas Laugh Club',
      address: '3rd Floor, Palladium Mall',
      city: 'Mumbai',
      state: 'Maharashtra',
      zipCode: '400052',
    },
    date: new Date('2026-08-30'),
    time: '21:00',
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800',
    totalTickets: 400,
    availableTickets: 150,
    price: 799,
    organizer: 'Comedy Central India',
    featured: false,
    tags: ['comedy', 'entertainment', 'stand-up', 'fun'],
    status: 'active',
  },
  {
    title: 'Marathon & Running Expo',
    description: 'Join thousands of runners for the annual city marathon. Whether you\'re a seasoned runner or a beginner, this event offers multiple race categories. Includes health expo, pre-race pasta dinner, and post-race celebration.',
    category: 'sports',
    venue: {
      name: 'Marina Beach',
      address: 'Beach Road',
      city: 'Chennai',
      state: 'Tamil Nadu',
      zipCode: '600001',
    },
    date: new Date('2026-10-15'),
    time: '07:00',
    image: 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=800',
    totalTickets: 10000,
    availableTickets: 6500,
    price: 1499,
    organizer: 'Running Events India',
    featured: false,
    tags: ['marathon', 'running', 'sports', 'fitness'],
    status: 'active',
  },
  {
    title: 'Shakespeare in the Park',
    description: 'Experience the magic of Shakespeare under the stars. A free outdoor theater production of "A Midsummer Night\'s Dream" featuring professional actors. Bring a blanket and enjoy this classic tale in a beautiful park setting.',
    category: 'theater',
    venue: {
      name: 'Cubbon Park',
      address: 'Kasturba Road',
      city: 'Bangalore',
      state: 'Karnataka',
      zipCode: '560001',
    },
    date: new Date('2026-08-05'),
    time: '19:00',
    image: 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=800',
    totalTickets: 800,
    availableTickets: 320,
    price: 0,
    organizer: 'Theater Company India',
    featured: false,
    tags: ['theater', 'shakespeare', 'outdoor', 'free'],
    status: 'active',
  },
  {
    title: 'Startup Pitch Competition',
    description: 'Watch innovative startups pitch their ideas to a panel of investors. Network with entrepreneurs, investors, and industry leaders. Includes keynote speeches, networking sessions, and the chance to see the next big thing.',
    category: 'conference',
    venue: {
      name: 'India Habitat Centre',
      address: 'Lodhi Road',
      city: 'New Delhi',
      state: 'Delhi',
      zipCode: '110003',
    },
    date: new Date('2026-09-10'),
    time: '13:00',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800',
    totalTickets: 500,
    availableTickets: 280,
    price: 2499,
    organizer: 'Startup Hub India',
    featured: false,
    tags: ['startup', 'pitch', 'entrepreneurship', 'networking'],
    status: 'active',
  },
];

const seedEvents = async () => {
  try {
    await connectDB();
    console.log('Connected to MongoDB');

    // Clear existing events (optional - comment out if you want to keep existing events)
    // await Event.deleteMany({});
    // console.log('Cleared existing events');

    // Insert events
    const createdEvents = await Event.insertMany(events);
    console.log(`✅ Successfully seeded ${createdEvents.length} events!`);
    
    // Show summary
    const featuredCount = createdEvents.filter(e => e.featured).length;
    console.log(`\n📊 Summary:`);
    console.log(`   - Total events: ${createdEvents.length}`);
    console.log(`   - Featured events: ${featuredCount}`);
    console.log(`   - Regular events: ${createdEvents.length - featuredCount}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding events:', error);
    process.exit(1);
  }
};

// Run if called directly
if (require.main === module) {
  seedEvents();
}

module.exports = seedEvents;
