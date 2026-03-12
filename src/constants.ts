import { Job, Category } from './types';

export const CATEGORIES: Category[] = [
  { id: 'flight-ops', name: 'Flight Operations', icon: 'Plane' },
  { id: 'cabin-crew', name: 'Cabin Crew', icon: 'User' },
  { id: 'engineering', name: 'Engineering', icon: 'Settings' },
  { id: 'ground-ops', name: 'Ground Operations', icon: 'Map' },
  { id: 'management', name: 'Management', icon: 'Briefcase' },
];

export const MOCK_JOBS: any[] = [
  {
    id: '1',
    title: 'First Officer - A320 Family',
    companyId: 'airline1',
    companyName: 'SkyLink Airways',
    location: 'London, UK (LHR)',
    type: 'Full-time',
    category: 'Flight Operations',
    salary: '£65,000 - £85,000',
    description: 'We are seeking experienced First Officers to join our growing A320 fleet. You will be responsible for safe flight operations and providing excellent service to our passengers.',
    requirements: [
      'Valid EASA/CAA ATPL or CPL with ATPL theory',
      'Current A320 Type Rating',
      'Minimum 500 hours on type',
      'Class 1 Medical',
      'ICAO English Level 5 or higher'
    ],
    logo: 'https://picsum.photos/seed/airline1/100/100'
  },
  {
    id: '2',
    title: 'Senior Aircraft Maintenance Engineer',
    companyId: 'airline2',
    companyName: 'Global Tech Aviation',
    location: 'Dubai, UAE (DXB)',
    type: 'Full-time',
    category: 'Engineering',
    salary: '$8,000 - $11,000 / month',
    description: 'Join our world-class maintenance facility in Dubai. We need B1/B2 licensed engineers for our wide-body fleet maintenance program.',
    requirements: [
      'EASA Part 66 B1 or B2 License',
      'Type rated on B777 or B787',
      'Minimum 5 years line maintenance experience',
      'Excellent troubleshooting skills'
    ],
    logo: 'https://picsum.photos/seed/airline2/100/100'
  },
  {
    id: '3',
    title: 'Cabin Crew - International Routes',
    companyId: 'airline3',
    companyName: 'Pacific Wings',
    location: 'Singapore (SIN)',
    type: 'Full-time',
    category: 'Cabin Crew',
    salary: 'S$3,500 - S$5,000',
    description: 'Pacific Wings is looking for charismatic and safety-conscious individuals to join our award-winning cabin crew team.',
    requirements: [
      'Minimum height 158cm (female) / 170cm (male)',
      'Fluent in English and at least one other language',
      'Excellent customer service skills',
      'Ability to swim 50m unaided'
    ],
    logo: 'https://picsum.photos/seed/airline3/100/100'
  }
];
