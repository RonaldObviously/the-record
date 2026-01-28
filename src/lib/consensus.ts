import type { Proposal, ValidationResult } from './types'

export interface ConsensusNode {
  id: string
  name: string
  region: string
  stake: number
  uptime: number
}

export interface ConsensusRound {
  proposalId: string
  phase: 'pre-prepare' | 'prepare' | 'commit' | 'finalized'
  votes: {
    nodeId: string
    vote: 'approve' | 'reject' | 'abstain'
    timestamp: number
  }[]
  threshold: number
  result?: 'approved' | 'rejected'
}

export function generateValidatorNodes(): ConsensusNode[] {
  const regions = ['us-west', 'us-east', 'eu-central', 'asia-pacific', 'south-america']
  const nodes: ConsensusNode[] = []
  
  for (let i = 0; i < 10; i++) {
    nodes.push({
      id: `node-${i + 1}`,
      name: `Validator ${i + 1}`,
      region: regions[i % regions.length],
      stake: Math.floor(Math.random() * 5000) + 1000,
      uptime: 0.95 + Math.random() * 0.05
    })
  }
  
  return nodes
}

export function runByzantineConsensus(
  proposal: Proposal,
  nodes: ConsensusNode[]
): ConsensusRound {
  const round: ConsensusRound = {
    proposalId: proposal.id,
    phase: 'finalized',
    votes: [],
    threshold: Math.ceil((nodes.length * 2) / 3)
  }
  
  const passCount = proposal.validations.filter(v => v.status === 'pass').length
  const failCount = proposal.validations.filter(v => v.status === 'fail').length
  const passRate = passCount / (passCount + failCount || 1)
  
  nodes.forEach(node => {
    let vote: 'approve' | 'reject' | 'abstain'
    
    const randomFactor = Math.random()
    if (passRate > 0.7) {
      vote = randomFactor > 0.1 ? 'approve' : (randomFactor > 0.05 ? 'abstain' : 'reject')
    } else if (passRate > 0.4) {
      vote = randomFactor > 0.4 ? 'approve' : (randomFactor > 0.2 ? 'abstain' : 'reject')
    } else {
      vote = randomFactor > 0.7 ? 'approve' : (randomFactor > 0.3 ? 'abstain' : 'reject')
    }
    
    round.votes.push({
      nodeId: node.id,
      vote,
      timestamp: Date.now() + Math.random() * 1000
    })
  })
  
  const approvals = round.votes.filter(v => v.vote === 'approve').length
  round.result = approvals >= round.threshold ? 'approved' : 'rejected'
  
  return round
}

export function detectCartelBehavior(
  rounds: ConsensusRound[]
): {
  detected: boolean
  suspiciousNodes: string[]
  alignmentScore: number
} {
  if (rounds.length < 5) {
    return { detected: false, suspiciousNodes: [], alignmentScore: 0 }
  }
  
  const nodeVotePatterns: Map<string, string[]> = new Map()
  
  rounds.forEach(round => {
    round.votes.forEach(vote => {
      if (!nodeVotePatterns.has(vote.nodeId)) {
        nodeVotePatterns.set(vote.nodeId, [])
      }
      nodeVotePatterns.get(vote.nodeId)!.push(vote.vote)
    })
  })
  
  const nodePairs: Array<{ nodes: [string, string]; alignment: number }> = []
  const nodeIds = Array.from(nodeVotePatterns.keys())
  
  for (let i = 0; i < nodeIds.length; i++) {
    for (let j = i + 1; j < nodeIds.length; j++) {
      const pattern1 = nodeVotePatterns.get(nodeIds[i])!
      const pattern2 = nodeVotePatterns.get(nodeIds[j])!
      
      let matches = 0
      const minLength = Math.min(pattern1.length, pattern2.length)
      
      for (let k = 0; k < minLength; k++) {
        if (pattern1[k] === pattern2[k]) matches++
      }
      
      const alignment = matches / minLength
      
      if (alignment > 0.9) {
        nodePairs.push({
          nodes: [nodeIds[i], nodeIds[j]],
          alignment
        })
      }
    }
  }
  
  const suspiciousNodes = new Set<string>()
  nodePairs.forEach(pair => {
    suspiciousNodes.add(pair.nodes[0])
    suspiciousNodes.add(pair.nodes[1])
  })
  
  const maxAlignment = nodePairs.length > 0
    ? Math.max(...nodePairs.map(p => p.alignment))
    : 0
  
  return {
    detected: nodePairs.length >= 3,
    suspiciousNodes: Array.from(suspiciousNodes),
    alignmentScore: maxAlignment
  }
}

export function calculateZeroSumSettlement(
  proposalId: string,
  accuracyScore: number,
  participants: Array<{ id: string; prediction: number; actual: number }>
): {
  settlements: Array<{ userId: string; influenceDelta: number }>
  treasuryDelta: number
  isZeroSum: boolean
} {
  const settlements: Array<{ userId: string; influenceDelta: number }> = []
  
  participants.forEach(participant => {
    const error = Math.abs(participant.prediction - participant.actual)
    const maxError = Math.abs(participant.actual) || 1
    const normalizedError = error / maxError
    
    const influenceDelta = (1 - normalizedError) * 10 - 5
    
    settlements.push({
      userId: participant.id,
      influenceDelta
    })
  })
  
  const totalDelta = settlements.reduce((sum, s) => sum + s.influenceDelta, 0)
  const treasuryDelta = -totalDelta
  
  const isZeroSum = Math.abs(totalDelta + treasuryDelta) < 0.001
  
  return {
    settlements,
    treasuryDelta,
    isZeroSum
  }
}

export function runGiniTaxCalculation(
  influenceDistribution: Array<{ userId: string; influence: number }>
): {
  giniCoefficient: number
  taxRate: number
  redistributions: Array<{ userId: string; tax: number }>
} {
  const sorted = [...influenceDistribution].sort((a, b) => a.influence - b.influence)
  const n = sorted.length
  
  if (n === 0) {
    return { giniCoefficient: 0, taxRate: 0, redistributions: [] }
  }
  
  const totalInfluence = sorted.reduce((sum, u) => sum + u.influence, 0)
  
  let numerator = 0
  for (let i = 0; i < n; i++) {
    numerator += (2 * (i + 1) - n - 1) * sorted[i].influence
  }
  
  const giniCoefficient = numerator / (n * totalInfluence)
  
  const taxRate = Math.max(0, Math.min(0.5, (giniCoefficient - 0.3) * 2))
  
  const redistributions = influenceDistribution.map(user => {
    const userShare = user.influence / totalInfluence
    const avgShare = 1 / n
    const excessShare = Math.max(0, userShare - avgShare)
    
    const tax = excessShare * totalInfluence * taxRate
    
    return {
      userId: user.userId,
      tax
    }
  })
  
  return {
    giniCoefficient,
    taxRate,
    redistributions
  }
}

export function simulateProofOfPersistence(
  fileHash: string,
  storageNodes: string[]
): {
  challenges: Array<{
    nodeId: string
    challenged: boolean
    responded: boolean
    responseTime: number
  }>
  availabilityScore: number
} {
  const challenges = storageNodes.map(nodeId => {
    const challenged = true
    const responded = Math.random() > 0.05
    const responseTime = responded ? Math.random() * 500 + 100 : 5000
    
    return {
      nodeId,
      challenged,
      responded,
      responseTime
    }
  })
  
  const respondedCount = challenges.filter(c => c.responded).length
  const availabilityScore = respondedCount / challenges.length
  
  return {
    challenges,
    availabilityScore
  }
}
