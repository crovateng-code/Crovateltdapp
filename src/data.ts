import { Property, FeatureCard, Testimonial, ServiceItem, StatItem } from './types';

export const PROPERTIES: Property[] = [
  {
    id: 'prop-1',
    title: 'The Obsidian Pavilion',
    type: 'Villa',
    location: 'Malibu Coastline, California',
    price: 8450000,
    bedrooms: 5,
    bathrooms: 6,
    size: 7800,
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'An architectural masterwork balancing raw concrete cantilever pavilions with endless Pacific panorama.'
  },
  {
    id: 'prop-2',
    title: 'Summit Ritz Penthouse',
    type: 'Apartment',
    location: 'Park Avenue, Manhattan, NY',
    price: 12500000,
    bedrooms: 3,
    bathrooms: 3.5,
    size: 4200,
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1502005229762-fc1b2b812ca5?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Bespoke triple-aspect penthouse framing unobstructed lines of Central Park and the Manhattan skyline.'
  },
  {
    id: 'prop-3',
    title: 'Aura Glass Duplex',
    type: 'Duplex',
    location: 'Trousdale Estates, Beverly Hills',
    price: 6900000,
    bedrooms: 4,
    bathrooms: 5,
    size: 5600,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Floor-to-ceiling glass retractable boundaries that merge lush California greenery with minimalist luxury interior.'
  },
  {
    id: 'prop-4',
    title: 'The Helix Commercial Center',
    type: 'Commercial',
    location: 'Metropolitan Financial District, Boston',
    price: 18200000,
    bedrooms: 0,
    bathrooms: 12,
    size: 15400,
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'State-of-the-art office spaces featuring LEED Platinum efficiency systems and high-density fiber hubs.'
  },
  {
    id: 'prop-5',
    title: 'Amalfi Coast Villa',
    type: 'Villa',
    location: 'Palm Jumeirah Crescent, Dubai',
    price: 14200000,
    bedrooms: 6,
    bathrooms: 8,
    size: 9200,
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Over-water coastal oasis complete with custom yacht slipway, infinity-edge ocean water system and wellness court.'
  },
  {
    id: 'prop-6',
    title: 'The Alpine Crest Retreat',
    type: 'Apartment',
    location: 'Millers Ridge, Aspen, Colorado',
    price: 4850000,
    bedrooms: 3,
    bathrooms: 4,
    size: 3800,
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1449034446853-66c86144b0ad?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'High-altitude luxury ski chalet designed with cedar-beams, dual grand hearths, and sub-zero outdoor hot spa.'
  }
];

export const WHY_CHOOSE_ITEMS: FeatureCard[] = [
  {
    id: 1,
    title: 'Verified Listings',
    description: 'Every property is authenticated for trust and transparency.',
    iconName: 'ShieldCheck'
  },
  {
    id: 2,
    title: 'Prime Locations',
    description: 'Access properties in strategic and fast-growing areas.',
    iconName: 'MapPin'
  },
  {
    id: 3,
    title: 'Professional Support',
    description: 'Receive expert guidance throughout your property journey.',
    iconName: 'UserCheck'
  },
  {
    id: 4,
    title: 'Smart Investments',
    description: 'Make informed decisions with valuable market opportunities.',
    iconName: 'TrendingUp'
  }
];

export const STATS: StatItem[] = [
  { id: 'stat-1', value: '50+', label: 'Properties Listed' },
  { id: 'stat-2', value: '500+', label: 'Happy Clients' },
  { id: 'stat-3', value: '15+', label: 'Locations Covered' },
  { id: 'stat-4', value: '10+', label: 'Years Experience' }
];

export const SERVICES: ServiceItem[] = [
  {
    id: 'srv-1',
    title: 'Property Development',
    description: 'We acquire land, plan, and develop high-quality residential and commercial properties, delivering lasting value and investment potential.',
    iconName: 'Construction'
  },
  {
    id: 'srv-2',
    title: 'Land Sales',
    description: 'We offer prime land in carefully selected locations with verified titles, providing secure opportunities for ownership and growth.',
    iconName: 'Map'
  },
  {
    id: 'srv-3',
    title: 'Property Sales',
    description: 'We specialize in selling both residential and commercial properties, ensuring clients secure well-designed, valuable spaces.',
    iconName: 'BadgeDollarSign'
  },
  {
    id: 'srv-4',
    title: 'Land Banking',
    description: 'We help investors acquire strategically located land with strong appreciation potential, fostering long-term wealth.',
    iconName: 'TrendingUp'
  },
  {
    id: 'srv-5',
    title: 'Real Estate Investment Advisory',
    description: 'We provide expert guidance on real estate investments, tailored to your goals, so you can make informed, profitable decisions.',
    iconName: 'LineChart'
  },
  {
    id: 'srv-6',
    title: 'Joint Venture Development',
    description: 'We partner with landowners, investors, and developers to unlock land value through mutually beneficial joint ventures.',
    iconName: 'Handshake'
  },
  {
    id: 'srv-7',
    title: 'Land Title Processing & Sponsorship',
    description: 'We guide you through securing official land titles, offering financing and sponsorship arrangements so you can gain title security with flexible terms.',
    iconName: 'FileCheck'
  },
  {
    id: 'srv-8',
    title: 'Real Estate Project Financing & Partnerships',
    description: 'We provide tailored financing and strategic partnerships to bring real estate projects to life with the right support and collaboration.',
    iconName: 'Coins'
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-1',
    name: 'Engr. Babajide Olatunji',
    position: 'Managing Director, Olatunji Developments',
    review: 'We have partnered with Crovation on multiple luxury residential developments. Their construction precision, structural finishing, and unwavering transparency are completely exemplary in the marketplace.',
    image: ''
  },
  {
    id: 'test-2',
    name: 'Dr. Amara Nwosu',
    position: 'Infrastructural Investment Trustee',
    review: 'Acquiring prime estate through Crovation Limited has been an exceptionally seamless experience. Their documentation review and asset verification give diaspora investors maximum security.',
    image: ''
  },
  {
    id: 'test-3',
    name: 'Chief Olumide Adebayo',
    position: 'Principal Partner, Adebayo Holdings',
    review: 'Crovation has consistently delivered top-tier commercial office spaces and premium family duplexes. Their bespoke post-sale support and management division set them apart.',
    image: ''
  }
];
