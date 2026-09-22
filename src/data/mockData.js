export const MOCK_ORGS = [
  { id: 1, name: 'Vodacom Foundation', sector: 'Telecoms', status: 'active', health: 'red' },
  { id: 2, name: 'Naspers Labs', sector: 'Media & Tech', status: 'active', health: 'amber' },
  { id: 3, name: 'Sasol Youth Fund', sector: 'Energy', status: 'prospect', health: 'amber' },
  { id: 4, name: 'Old Mutual CSI', sector: 'Financial Services', status: 'active', health: 'green' },
]

export const MOCK_OPPS = [
  { id: 1, title: 'Robotics Sponsorship', org: 'Vodacom Foundation', stage: 'negotiation', value: 'R 400,000' },
  { id: 2, title: 'Girls-in-Tech Funding', org: 'Naspers Labs', stage: 'proposal', value: 'R 150,000' },
  { id: 3, title: 'Grad Employment Pipeline', org: 'Old Mutual CSI', stage: 'won', value: 'R 600,000' },
]

export const MOCK_ENGAGEMENTS = [
  {
    id: 1,
    organisationId: 1,
    organisation: 'Vodacom Foundation',
    title: 'Quarterly check-in',
    summary: 'Discussed 2027 renewal',
    occurredAt: '2026-06-14',
  },
]

export const MOCK_ORG_DETAILS = {
  1: {
    contacts: [{ id: 1, full_name: 'Thandiwe Nkosi', job_title: 'CSI Manager', is_primary: true }],
    engagements: MOCK_ENGAGEMENTS.filter((engagement) => engagement.organisationId === 1),
    opportunities: [
      { id: 1, title: 'Robotics Programme Sponsorship', stage: 'negotiation', estimated_value: 'R 400,000' },
    ],
  },
  2: {
    contacts: [{ id: 2, full_name: 'Lerato Mokoena', job_title: 'Programme Director', is_primary: true }],
    engagements: [],
    opportunities: [
      { id: 2, title: 'Girls-in-Tech Funding', stage: 'proposal', estimated_value: 'R 150,000' },
    ],
  },
  3: {
    contacts: [{ id: 3, full_name: 'Mandla Dlamini', job_title: 'Youth Programmes Lead', is_primary: true }],
    engagements: [],
    opportunities: [
      { id: 3, title: 'Youth Skills Partnership', stage: 'lead', estimated_value: 'R 225,000' },
    ],
  },
  4: {
    contacts: [{ id: 4, full_name: 'Naledi Khumalo', job_title: 'CSI Portfolio Manager', is_primary: true }],
    engagements: [],
    opportunities: [
      { id: 4, title: 'Grad Employment Pipeline', stage: 'won', estimated_value: 'R 600,000' },
    ],
  },
}
