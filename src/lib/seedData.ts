import type { Bubble, Problem, Proposal, MetaAlert, BlackBoxEvent, Prediction, Validation } from './types'
import { createHash } from './crypto'

export function initializeSystem() {
  const bubbles: Bubble[] = [
    {
      id: 'global',
      name: 'Global',
      type: 'global',
      parentId: null,
      description: 'Global governance context',
      activeProblems: 0,
      activeProposals: 0,
      vitality: 1000000,
      coordinates: { lat: 0, lng: 0 }
    },
    {
      id: 'north-america',
      name: 'North America',
      type: 'continent',
      parentId: 'global',
      description: 'North American region',
      population: 580000000,
      activeProblems: 0,
      activeProposals: 0,
      vitality: 250000,
      coordinates: { lat: 54.5, lng: -105 }
    },
    {
      id: 'usa',
      name: 'United States',
      type: 'nation',
      parentId: 'north-america',
      description: 'Federal governance context',
      population: 331000000,
      activeProblems: 0,
      activeProposals: 0,
      vitality: 150000,
      coordinates: { lat: 37.1, lng: -95.7 }
    },
    {
      id: 'california',
      name: 'California',
      type: 'nation',
      parentId: 'usa',
      description: 'State governance context',
      population: 39000000,
      activeProblems: 0,
      activeProposals: 0,
      vitality: 50000,
      coordinates: { lat: 36.7, lng: -119.4 }
    },
    {
      id: 'san-francisco',
      name: 'San Francisco',
      type: 'city',
      parentId: 'california',
      description: 'City governance context',
      population: 875000,
      activeProblems: 0,
      activeProposals: 0,
      vitality: 10000,
      coordinates: { lat: 37.7749, lng: -122.4194 }
    },
    {
      id: 'theme-education',
      name: 'Education',
      type: 'thematic',
      parentId: 'global',
      description: 'Global education challenges and solutions',
      activeProblems: 0,
      activeProposals: 0,
      vitality: 75000
    },
    {
      id: 'theme-healthcare',
      name: 'Healthcare',
      type: 'thematic',
      parentId: 'global',
      description: 'Global healthcare systems and access',
      activeProblems: 0,
      activeProposals: 0,
      vitality: 80000
    },
    {
      id: 'theme-climate',
      name: 'Climate',
      type: 'thematic',
      parentId: 'global',
      description: 'Climate action and environmental protection',
      activeProblems: 0,
      activeProposals: 0,
      vitality: 90000
    }
  ]

  const problems: Problem[] = [
    {
      id: 'problem-1',
      bubbleId: 'san-francisco',
      category: 'housing',
      description: 'Severe housing shortage driving unaffordable rents',
      priority: 8,
      submittedAt: new Date(Date.now() - 86400000 * 7),
      anonymous: true,
      attestations: 12
    },
    {
      id: 'problem-2',
      bubbleId: 'san-francisco',
      category: 'infrastructure',
      description: 'Public transit delays impacting work productivity',
      priority: 6,
      submittedAt: new Date(Date.now() - 86400000 * 3),
      anonymous: true,
      attestations: 8
    },
    {
      id: 'problem-3',
      bubbleId: 'theme-climate',
      category: 'climate',
      description: 'Rising temperatures affecting agricultural output',
      priority: 9,
      submittedAt: new Date(Date.now() - 86400000 * 14),
      anonymous: true,
      attestations: 25
    }
  ]

  const predictions: Prediction[] = [
    {
      id: 'pred-1',
      metric: 'Housing units built',
      predictedValue: 5000,
      predictedOutcome: '5000 new units within 18 months',
      timeframe: '18 months',
      actualOutcome: undefined,
      actualValue: undefined,
      accuracy: undefined,
      settled: false
    },
    {
      id: 'pred-2',
      metric: 'Average rent reduction',
      predictedValue: 12,
      predictedOutcome: '12% decrease in median rent',
      timeframe: '24 months',
      settled: false
    }
  ]

  const validations: Validation[] = [
    {
      id: 'val-1',
      validatorId: 'validator-sf-1',
      type: 'budget',
      passed: true,
      notes: 'Funding allocated from municipal budget surplus',
      timestamp: new Date(Date.now() - 86400000 * 2),
      confidence: 0.92
    },
    {
      id: 'val-2',
      validatorId: 'validator-sf-2',
      type: 'legal',
      passed: true,
      notes: 'Complies with state housing regulations',
      timestamp: new Date(Date.now() - 86400000 * 2),
      confidence: 0.88
    },
    {
      id: 'val-3',
      validatorId: 'validator-sf-3',
      type: 'environmental',
      passed: false,
      notes: 'Requires additional environmental impact assessment',
      timestamp: new Date(Date.now() - 86400000 * 1),
      confidence: 0.95
    }
  ]

  const proposals: Proposal[] = [
    {
      id: 'proposal-1',
      bubbleId: 'san-francisco',
      problemId: 'problem-1',
      title: 'Accelerated Mixed-Use Development Program',
      description: 'Fast-track approval for mixed-use buildings with 30% affordable housing requirement',
      predictions: predictions,
      validations: validations,
      submittedAt: new Date(Date.now() - 86400000 * 5),
      submittedBy: 'anon-user-1',
      status: 'validated',
      influenceBonded: 500,
      realitySettled: false
    }
  ]

  const metaAlerts: MetaAlert[] = [
    {
      id: 'alert-1',
      severity: 'medium',
      type: 'cartel',
      message: 'Validators in SF region showing >85% agreement rate - monitoring for potential cartel formation',
      affectedBubbles: ['san-francisco'],
      timestamp: new Date(Date.now() - 3600000 * 6)
    },
    {
      id: 'alert-2',
      severity: 'low',
      type: 'drift',
      message: 'Housing proposals consistently underestimating completion time by 23%',
      affectedBubbles: ['california', 'san-francisco'],
      timestamp: new Date(Date.now() - 3600000 * 12)
    }
  ]

  const blackBox: BlackBoxEvent[] = []
  let previousHash = '0000000000000000'

  const addEvent = (type: BlackBoxEvent['type'], data: any) => {
    const event: BlackBoxEvent = {
      id: `event-${blackBox.length + 1}`,
      timestamp: new Date(),
      type,
      data,
      hash: '',
      previousHash
    }
    event.hash = createHash(JSON.stringify(event))
    previousHash = event.hash
    blackBox.push(event)
  }

  problems.forEach(p => addEvent('problem', p))
  proposals.forEach(p => addEvent('proposal', p))
  metaAlerts.forEach(a => addEvent('alert', a))

  return {
    bubbles,
    problems,
    proposals,
    metaAlerts,
    blackBox
  }
}
