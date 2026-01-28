import type { Bubble, Problem, Proposal, BlackBoxEntry, MetaAlert, ValidationResult, Prediction } from './types'

export function generateSeedBubbles(): Bubble[] {
  return [
    {
      id: 'bubble-global',
      name: 'Global',
      type: 'geographic',
      level: 'global',
      problemCount: 12,
      proposalCount: 8,
      activeAlerts: 1
    },
    {
      id: 'bubble-na',
      name: 'North America',
      type: 'geographic',
      level: 'continent',
      parentId: 'bubble-global',
      problemCount: 8,
      proposalCount: 5,
      activeAlerts: 0
    },
    {
      id: 'bubble-usa',
      name: 'United States',
      type: 'geographic',
      level: 'nation',
      parentId: 'bubble-na',
      problemCount: 15,
      proposalCount: 12,
      activeAlerts: 2
    },
    {
      id: 'bubble-ca',
      name: 'California',
      type: 'geographic',
      level: 'state',
      parentId: 'bubble-usa',
      problemCount: 24,
      proposalCount: 18,
      activeAlerts: 1
    },
    {
      id: 'bubble-sf',
      name: 'San Francisco',
      type: 'geographic',
      level: 'city',
      parentId: 'bubble-ca',
      problemCount: 42,
      proposalCount: 31,
      activeAlerts: 3
    },
    {
      id: 'bubble-mission',
      name: 'Mission District',
      type: 'geographic',
      level: 'district',
      parentId: 'bubble-sf',
      problemCount: 18,
      proposalCount: 14,
      activeAlerts: 0
    },
    {
      id: 'bubble-education',
      name: 'Education',
      type: 'thematic',
      domain: 'education',
      problemCount: 34,
      proposalCount: 22,
      activeAlerts: 1
    },
    {
      id: 'bubble-healthcare',
      name: 'Healthcare',
      type: 'thematic',
      domain: 'healthcare',
      problemCount: 47,
      proposalCount: 28,
      activeAlerts: 2
    },
    {
      id: 'bubble-infrastructure',
      name: 'Infrastructure',
      type: 'thematic',
      domain: 'infrastructure',
      problemCount: 29,
      proposalCount: 19,
      activeAlerts: 1
    },
    {
      id: 'bubble-climate',
      name: 'Climate & Environment',
      type: 'thematic',
      domain: 'climate',
      problemCount: 38,
      proposalCount: 25,
      activeAlerts: 4
    },
    {
      id: 'bubble-safety',
      name: 'Public Safety',
      type: 'thematic',
      domain: 'safety',
      problemCount: 31,
      proposalCount: 17,
      activeAlerts: 2
    },
    {
      id: 'bubble-energy',
      name: 'Energy',
      type: 'thematic',
      domain: 'energy',
      problemCount: 22,
      proposalCount: 15,
      activeAlerts: 1
    }
  ]
}

export function generateSeedProblems(bubbleId: string): Problem[] {
  const problemTemplates = [
    {
      category: 'Infrastructure',
      descriptions: [
        'Road maintenance on Market Street is severely delayed, causing safety hazards',
        'Public transit system experiencing frequent delays and overcrowding',
        'Aging water infrastructure leading to frequent service interruptions',
        'Inadequate bike lane network creating dangerous conditions for cyclists'
      ]
    },
    {
      category: 'Education',
      descriptions: [
        'Teacher retention rates declining due to inadequate compensation',
        'Classroom technology outdated and insufficient for modern learning',
        'After-school programs facing budget cuts despite high demand',
        'Student-to-counselor ratio far exceeds recommended guidelines'
      ]
    },
    {
      category: 'Healthcare',
      descriptions: [
        'Emergency room wait times averaging over 4 hours',
        'Mental health services severely underfunded and inaccessible',
        'Prescription medication costs rising faster than inflation',
        'Primary care physician shortage in underserved neighborhoods'
      ]
    },
    {
      category: 'Safety',
      descriptions: [
        'Pedestrian crosswalk visibility poor in high-traffic areas',
        'Emergency response times increasing due to staffing shortages',
        'Street lighting insufficient in residential areas',
        'Community policing initiatives underfunded and understaffed'
      ]
    },
    {
      category: 'Environment',
      descriptions: [
        'Air quality deteriorating near industrial zones',
        'Public parks maintenance budget cut by 30%',
        'Recycling program contamination rate exceeding 40%',
        'Urban tree canopy declining due to insufficient replacement'
      ]
    }
  ]

  const problems: Problem[] = []
  const count = Math.floor(Math.random() * 8) + 3

  for (let i = 0; i < count; i++) {
    const template = problemTemplates[Math.floor(Math.random() * problemTemplates.length)]
    const description = template.descriptions[Math.floor(Math.random() * template.descriptions.length)]
    
    problems.push({
      id: `prob-${bubbleId}-${Date.now()}-${i}`,
      bubbleId,
      category: template.category,
      description,
      anonymousVotes: Math.floor(Math.random() * 150) + 20,
      timestamp: Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000),
      aggregatedPriority: Math.floor(Math.random() * 95) + 5
    })
  }

  return problems.sort((a, b) => b.aggregatedPriority - a.aggregatedPriority)
}

export function generateSeedProposals(bubbleId: string, problems: Problem[]): Proposal[] {
  const proposalTemplates = [
    {
      title: 'Accelerated Road Repair Program',
      description: 'Implement a dedicated fast-track team for critical road repairs using data-driven prioritization',
      predictions: [
        { metric: 'Average repair completion time', predicted: '50% reduction within 6 months', timeframe: '6 months' },
        { metric: 'Safety incident reduction', predicted: '25% decrease in road-related incidents', timeframe: '1 year' }
      ]
    },
    {
      title: 'Teacher Compensation Enhancement Package',
      description: 'Restructure teacher pay scale with performance incentives and retention bonuses',
      predictions: [
        { metric: 'Teacher retention rate', predicted: 'Increase from 82% to 91%', timeframe: '2 years' },
        { metric: 'New teacher applications', predicted: '35% increase in qualified applicants', timeframe: '1 year' }
      ]
    },
    {
      title: 'Integrated Mental Health Hub Network',
      description: 'Establish community-based mental health centers with sliding-scale pricing',
      predictions: [
        { metric: 'Access to mental health services', predicted: '60% increase in service capacity', timeframe: '18 months' },
        { metric: 'Emergency psychiatric visits', predicted: '30% reduction in crisis interventions', timeframe: '2 years' }
      ]
    },
    {
      title: 'Smart Traffic Signal Optimization',
      description: 'Deploy AI-powered traffic management system to reduce congestion and improve flow',
      predictions: [
        { metric: 'Average commute time', predicted: '18% reduction during peak hours', timeframe: '9 months' },
        { metric: 'Carbon emissions', predicted: '12% reduction from reduced idling', timeframe: '1 year' }
      ]
    },
    {
      title: 'Community Solar Initiative',
      description: 'Launch neighborhood-scale solar installations with community ownership model',
      predictions: [
        { metric: 'Renewable energy adoption', predicted: '2,500 households participating', timeframe: '2 years' },
        { metric: 'Energy cost savings', predicted: 'Average 22% reduction per household', timeframe: '3 years' }
      ]
    }
  ]

  const proposals: Proposal[] = []
  const count = Math.floor(Math.random() * 5) + 2

  for (let i = 0; i < count; i++) {
    const template = proposalTemplates[Math.floor(Math.random() * proposalTemplates.length)]
    
    const validators = ['Budget Validator', 'Legal Compliance', 'Technical Feasibility', 'Impact Assessment']
    const validations: ValidationResult[] = validators.map(validator => {
      const rand = Math.random()
      let status: 'pass' | 'fail' | 'warning' | 'pending'
      let message: string
      
      if (rand > 0.7) {
        status = 'pass'
        message = `${validator} requirements satisfied`
      } else if (rand > 0.4) {
        status = 'warning'
        message = `${validator} flagged minor concerns requiring attention`
      } else if (rand > 0.2) {
        status = 'pending'
        message = `${validator} review in progress`
      } else {
        status = 'fail'
        message = `${validator} identified critical issues`
      }
      
      return {
        validator,
        status,
        message,
        timestamp: Date.now() - Math.floor(Math.random() * 48 * 60 * 60 * 1000)
      }
    })

    const statuses: Proposal['status'][] = ['validating', 'active', 'completed', 'evaluated']
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    
    const predictions: Prediction[] = template.predictions.map(p => ({
      ...p,
      actual: status === 'evaluated' ? (Math.random() > 0.3 ? p.predicted.replace(/\d+/g, (m) => String(Number(m) * (0.8 + Math.random() * 0.4))) : 'Target not met') : undefined
    }))

    proposals.push({
      id: `prop-${bubbleId}-${Date.now()}-${i}`,
      bubbleId,
      problemId: problems.length > 0 ? problems[Math.floor(Math.random() * problems.length)].id : '',
      title: template.title,
      description: template.description,
      submittedBy: 'anonymous',
      timestamp: Date.now() - Math.floor(Math.random() * 14 * 24 * 60 * 60 * 1000),
      predictions,
      validations,
      status,
      influenceWeight: 0.6 + Math.random() * 0.8,
      accuracyScore: status === 'evaluated' ? 0.5 + Math.random() * 0.45 : undefined
    })
  }

  return proposals.sort((a, b) => b.timestamp - a.timestamp)
}

export function generateSeedBlackBoxEntries(bubbleId: string, proposals: Proposal[]): BlackBoxEntry[] {
  const entries: BlackBoxEntry[] = []
  
  proposals.forEach(proposal => {
    entries.push({
      id: `bb-${proposal.id}-prediction`,
      timestamp: proposal.timestamp,
      type: 'prediction',
      bubbleId,
      proposalId: proposal.id,
      data: {
        proposal: proposal.title,
        predictions: proposal.predictions.map(p => ({
          metric: p.metric,
          predicted: p.predicted,
          timeframe: p.timeframe
        }))
      },
      immutable: true
    })

    proposal.validations.forEach((validation, idx) => {
      entries.push({
        id: `bb-${proposal.id}-validation-${idx}`,
        timestamp: validation.timestamp,
        type: 'validation',
        bubbleId,
        proposalId: proposal.id,
        data: {
          validator: validation.validator,
          status: validation.status,
          message: validation.message
        },
        immutable: true
      })
    })

    if (proposal.status === 'evaluated' && proposal.accuracyScore !== undefined) {
      entries.push({
        id: `bb-${proposal.id}-outcome`,
        timestamp: Date.now() - Math.floor(Math.random() * 2 * 24 * 60 * 60 * 1000),
        type: 'outcome',
        bubbleId,
        proposalId: proposal.id,
        data: {
          proposal: proposal.title,
          accuracyScore: proposal.accuracyScore,
          outcomes: proposal.predictions.map(p => ({
            metric: p.metric,
            predicted: p.predicted,
            actual: p.actual
          }))
        },
        immutable: true
      })
    }
  })

  return entries.sort((a, b) => b.timestamp - a.timestamp)
}

export function generateSeedMetaAlerts(): MetaAlert[] {
  const alertTemplates = [
    {
      severity: 'high' as const,
      type: 'bias' as const,
      message: 'Systematic bias detected: 78% of approved proposals originated from same geographic cluster. Review selection criteria for equity.'
    },
    {
      severity: 'critical' as const,
      type: 'capture-attempt' as const,
      message: 'Voting pattern anomaly: 5 validator nodes showing 94% alignment across 47 proposals. Potential cartel behavior detected.'
    },
    {
      severity: 'medium' as const,
      type: 'drift' as const,
      message: 'Prediction accuracy declining: Average accuracy dropped from 72% to 58% over past 3 months. System calibration recommended.'
    },
    {
      severity: 'high' as const,
      type: 'anomaly' as const,
      message: 'Sudden spike in proposal submissions: 340% increase in past 48 hours from previously dormant accounts. Investigating coordination.'
    },
    {
      severity: 'critical' as const,
      type: 'contradiction' as const,
      message: 'Validator contradiction: Budget validator approved proposal exceeding stated budget constraints by 42%. Cross-check required.'
    }
  ]

  const alerts: MetaAlert[] = []
  const count = Math.floor(Math.random() * 3) + 1

  for (let i = 0; i < count; i++) {
    const template = alertTemplates[Math.floor(Math.random() * alertTemplates.length)]
    alerts.push({
      id: `alert-${Date.now()}-${i}`,
      timestamp: Date.now() - Math.floor(Math.random() * 24 * 60 * 60 * 1000),
      severity: template.severity,
      type: template.type,
      message: template.message,
      data: {}
    })
  }

  return alerts.sort((a, b) => b.timestamp - a.timestamp)
}
