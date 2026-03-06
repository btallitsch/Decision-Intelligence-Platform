import { AppState } from '@/types';

export const SEED_DATA: AppState = {
  decisions: [
    {
      id: 'seed-d1',
      title: 'Migrate backend to microservices architecture',
      context:
        'Our monolithic backend is becoming a bottleneck as the team grows. Deployment cycles are slow and a single bug can bring down the entire system.',
      chosenOption:
        'Adopt a phased microservices migration, starting with the authentication and billing modules.',
      alternatives: [
        {
          id: 'alt-1',
          description: 'Stay with monolith but introduce module boundaries',
          estimatedValue: 'Lower cost, faster short-term delivery',
          reason: 'Does not solve the long-term scalability problem',
        },
        {
          id: 'alt-2',
          description: 'Full rewrite in new tech stack',
          estimatedValue: 'Clean slate, modern patterns',
          reason: 'Too risky and expensive for current runway',
        },
      ],
      opportunityCosts: [
        {
          description: '3 months of feature development foregone',
          estimatedValue: '~4 planned features delayed',
          timeframe: 'Q1–Q2 2024',
          probability: 85,
        },
      ],
      status: 'active',
      confidence: 'high',
      impactScore: 9,
      category: 'Engineering',
      tags: ['architecture', 'scalability', 'infrastructure'],
      reversible: false,
      reviewDate: '2024-09-01',
      createdAt: '2024-01-15T09:00:00Z',
      updatedAt: '2024-01-15T09:00:00Z',
    },
    {
      id: 'seed-d2',
      title: 'Hire a Head of Product vs. promote internally',
      context:
        'Product direction has been fragmented. We need strong product leadership before the Series B.',
      chosenOption: 'Promote senior PM Maya Chen to Head of Product with a 6-month trial period.',
      alternatives: [
        {
          id: 'alt-3',
          description: 'External hire from enterprise SaaS background',
          estimatedValue: 'Broader experience, faster ramp-up on strategy',
          reason: '4–6 month hiring cycle; cultural integration risk',
        },
      ],
      opportunityCosts: [
        {
          description: 'External candidate with more enterprise experience',
          estimatedValue: 'Potentially stronger B2B product intuition',
          timeframe: '12 months',
          probability: 40,
        },
      ],
      status: 'resolved',
      confidence: 'medium',
      impactScore: 8,
      category: 'People',
      tags: ['hiring', 'leadership', 'product'],
      reversible: true,
      reviewDate: null,
      createdAt: '2024-02-20T14:30:00Z',
      updatedAt: '2024-02-20T14:30:00Z',
    },
    {
      id: 'seed-d3',
      title: 'Launch freemium tier before enterprise GTM',
      context:
        'Sales cycles for enterprise are long. A freemium tier could accelerate bottom-up adoption and provide data for product-led growth.',
      chosenOption:
        'Launch a freemium tier capped at 3 users and 30 days of history, prioritized over enterprise outbound.',
      alternatives: [
        {
          id: 'alt-4',
          description: 'Focus exclusively on enterprise sales',
          estimatedValue: 'Higher ACV, faster revenue',
          reason: 'Sales team is too small; long cycles drain runway',
        },
      ],
      opportunityCosts: [
        {
          description: 'Enterprise revenue in the short term',
          estimatedValue: '~$120K ARR in H1',
          timeframe: '6 months',
          probability: 60,
        },
      ],
      status: 'pending',
      confidence: 'medium',
      impactScore: 7,
      category: 'Strategy',
      tags: ['growth', 'pricing', 'GTM'],
      reversible: true,
      reviewDate: '2024-07-01',
      createdAt: '2024-03-05T11:00:00Z',
      updatedAt: '2024-03-05T11:00:00Z',
    },
  ],
  outcomes: [
    {
      id: 'seed-o1',
      decisionId: 'seed-d2',
      description:
        'Maya successfully shipped the new onboarding flow within 45 days, reducing churn by 18%. Her promotion has been well received by the team.',
      measuredAt: '2024-08-15T00:00:00Z',
      sentiment: 'positive',
      actualImpactScore: 9,
      expectedVsActual:
        'We expected a moderate improvement in product velocity. Actual impact exceeded expectations—Maya also surfaced two critical UX gaps the external candidate pool likely would not have caught as quickly.',
      lessonsLearned:
        'Internal promotions with structured trials reduce risk significantly. We should formalize this pattern for future leadership transitions.',
      createdAt: '2024-08-15T10:00:00Z',
    },
  ],
  decisionDebts: [
    {
      id: 'seed-db1',
      decisionId: 'seed-d1',
      reason:
        'We chose a phased migration without fully defining the service boundaries upfront. The auth service boundary is now contested between two teams.',
      severity: 'high',
      dueDate: '2024-10-01',
      resolved: false,
      resolvedAt: null,
      resolutionNotes: '',
      createdAt: '2024-04-10T08:00:00Z',
    },
    {
      id: 'seed-db2',
      decisionId: 'seed-d3',
      reason:
        'Freemium pricing limits were set arbitrarily in a 30-minute meeting. No user research or cohort analysis was done to validate the 3-user cap.',
      severity: 'medium',
      dueDate: '2024-08-01',
      resolved: false,
      resolvedAt: null,
      resolutionNotes: '',
      createdAt: '2024-03-06T09:00:00Z',
    },
  ],
};
