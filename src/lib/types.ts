export interface Bubble {
  id: string
  name: string
  type: 'global' | 'continent' | 'nation' | 'city' | 'district' | 'thematic'
  parentId: string | null
  description: string
  population?: number
  activeProblems: number
  activeProposals: number
}

export interface Problem {
  id: string
  bubbleId: string
  category: ProblemCategory
  description: string
  priority: number
  submittedAt: Date
  anonymous: boolean
}

export type ProblemCategory = 
  | 'education'
  | 'healthcare'
  | 'infrastructure'
  | 'climate'
  | 'safety'
  | 'energy'
  | 'housing'
  | 'economy'
  | 'other'

export interface Proposal {
  id: string
  bubbleId: string
  problemId?: string
  title: string
  description: string
  predictions: Prediction[]
  validations: Validation[]
  submittedAt: Date
  submittedBy: string
  status: 'pending' | 'validated' | 'rejected' | 'active' | 'completed'
}

export interface Prediction {
  id: string
  metric: string
  predictedOutcome: string
  timeframe: string
  actualOutcome?: string
  accuracy?: number
}

export interface Validation {
  id: string
  validatorId: string
  type: ValidationType
  passed: boolean
  notes: string
  timestamp: Date
}

export type ValidationType =
  | 'budget'
  | 'legal'
  | 'feasibility'
  | 'impact'
  | 'safety'
  | 'environmental'

export interface Validator {
  id: string
  name: string
  location: string
  uptime: number
  stake: number
  votingPatterns: number[]
}

export interface MetaAlert {
  id: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  type: string
  message: string
  affectedBubbles: string[]
  timestamp: Date
}

export interface BlackBoxEvent {
  id: string
  timestamp: Date
  type: 'problem' | 'proposal' | 'validation' | 'prediction' | 'alert'
  data: any
  hash: string
  previousHash: string
}

export interface SystemHealth {
  validatorCount: number
  activeValidators: number
  averageUptime: number
  bftThreshold: number
  cartelDetected: boolean
  giniCoefficient: number
  hashChainIntegrity: boolean
}
