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
    title: 'Property Sales',
    description: 'Seamless brokerage for buyers and sellers of ultra-luxury estates and upscale modern residences.',
    iconName: 'BadgeDollarSign'
  },
  {
    id: 'srv-2',
    title: 'Property Management',
    description: 'Complete hands-off peace of mind including maintenance oversight, leasing operations, and luxury upkeep.',
    iconName: 'KeyRound'
  },
  {
    id: 'srv-3',
    title: 'Investment Advisory',
    description: 'Data-driven market intelligence identifying high-yield developer phases and long-term land appreciations.',
    iconName: 'LineChart'
  },
  {
    id: 'srv-4',
    title: 'Commercial Real Estate',
    description: 'Premium strategic offices, tech landmarks, and retail real estates configured for high business throughput.',
    iconName: 'Building2'
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-1',
    name: 'Alessandra Moretti',
    position: 'Architectural Director & Advisor',
    review: 'Crovation Limited redefined our scaling strategy. The level of confidentiality, attention to bespoke spatial structural alignment, and speed are unmatched in modern real estate.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'test-2',
    name: 'Marcus Vance',
    position: 'Founder, Vance Equity Group',
    review: 'Buying with Crovation felt like a high-end private banking flight. No noise, just authenticated high-yield assets and direct transactions backed by incredible local legal care.',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'test-3',
    name: 'Sophie Dubois',
    position: 'High-Yield Investor',
    review: 'Their investment advisory division is sensational. I secured two pre-launch beach duplexes that appreciated by 32% before structural foundation laying was even complete.',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80'
  }
];
