// Mock sessions dataset for standalone frontend operation
// Fields expected by UI: id, title, speaker, location, description, start_time, end_time, tags

export const mockSessions = [
  {
    id: 101,
    title: 'Opening Keynote: The Future of Intelligent Enterprises',
    speaker: 'Dr. Hannah Weiss',
    location: 'Main Hall A',
    description: 'Kick off VIBE 2025 with a look at the latest innovations in AI, cloud, and business transformation across the SAP ecosystem.',
    start_time: '2025-11-21T09:00:00.000Z',
    end_time: '2025-11-21T10:00:00.000Z',
    tags: ['Innovation', 'AI/ML', 'Cloud'],
    capacity: 300
  },
  {
    id: 102,
    title: 'Designing Delightful UX with Fiori & Tailwind',
    speaker: 'Emily Chen',
    location: 'Room 204',
    description: 'Practical patterns to craft modern, responsive enterprise UX using SAP Fiori guidelines and Tailwind utility classes.',
    start_time: '2025-11-21T10:30:00.000Z',
    end_time: '2025-11-21T11:15:00.000Z',
    tags: ['UX', 'Design', 'Beginner'],
    capacity: 120
  },
  {
    id: 103,
    title: 'From Monolith to Microservices on SAP BTP',
    speaker: 'Michael Rodriguez',
    location: 'Room 305',
    description: 'A field guide to decomposing legacy systems and migrating to microservices with Kubernetes, CAP, and event-driven patterns.',
    start_time: '2025-11-21T11:30:00.000Z',
    end_time: '2025-11-21T12:15:00.000Z',
    tags: ['Cloud', 'Architecture', 'Advanced'],
    capacity: 150
  },
  {
    id: 104,
    title: 'Applied Generative AI for SAP Developers',
    speaker: 'Priya Patel',
    location: 'Room 207',
    description: 'Hands-on techniques to integrate LLMs into enterprise apps safely, including retrieval, prompt engineering, and governance.',
    start_time: '2025-11-21T13:00:00.000Z',
    end_time: '2025-11-21T13:45:00.000Z',
    tags: ['AI/ML', 'Development', 'Innovation'],
    capacity: 100
  },
  {
    id: 105,
    title: 'Customer Journeys with SAP CX: A Practical Deep Dive',
    speaker: 'Jessica Adams',
    location: 'Room 112',
    description: 'Mapping end-to-end customer experiences and implementing feedback loops with SAP Customer Experience suite.',
    start_time: '2025-11-21T14:00:00.000Z',
    end_time: '2025-11-21T14:45:00.000Z',
    tags: ['CX', 'SaaS', 'Beginner'],
    capacity: 80
  },
  {
    id: 106,
    title: 'Supply Chain Optimization with IBP and Analytics',
    speaker: 'Raj Kumar',
    location: 'Room 220',
    description: 'Forecasting and inventory optimization patterns, backed by real-world case studies using SAP IBP and Analytics Cloud.',
    start_time: '2025-11-21T15:00:00.000Z',
    end_time: '2025-11-21T15:45:00.000Z',
    tags: ['Analytics', 'Supply Chain', 'Advanced'],
    capacity: 120
  },
  {
    id: 107,
    title: 'CAP + React: End-to-End Productivity',
    speaker: 'Thomas Schmidt',
    location: 'Room 302',
    description: 'Build, test, and deploy full-stack apps with SAP CAP on the backend and React on the frontend—tips, pitfalls, and patterns.',
    start_time: '2025-11-21T16:00:00.000Z',
    end_time: '2025-11-21T16:45:00.000Z',
    tags: ['Development', 'SAP', 'Cloud'],
    capacity: 90
  },
  {
    id: 108,
    title: 'Human-Centered Design in Enterprise Software',
    speaker: 'Sarah Johnson',
    location: 'Room 108',
    description: 'How to bring design thinking into enterprise workflows; balancing user needs, business goals, and technical constraints.',
    start_time: '2025-11-21T17:00:00.000Z',
    end_time: '2025-11-21T17:45:00.000Z',
    tags: ['Design', 'UX', 'Beginner'],
    capacity: 110
  }
];
