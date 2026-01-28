export type BubbleType = 'geographic' | 'thematic'

export type GeographicLevel = 
  | 'global'
  | 'continent' 
  | 'nation'
  | 'state'
  | 'city'
  | 'district'
  | 'neighborhood'

export type ThematicDomain =
  | 'education'
  | 'healthcare'
  | 'infrastructure'
  | 'energy'
  | 'climate'
  | 'safety'
  | 'water'
  | 'it'
  | 'veterinary'
  | 'general'

export interface Bubble {
  id: string
  name: string
  type: BubbleType
  level?: GeographicLevel
  domain?: ThematicDomain
  parentId?: string
  problemCount: number
  proposalCount: number
  activeAlerts: number
}

export interface Problem {
  id: string
  bubbleId: string
  category: string
  description: string
  anonymousVotes: number
  timestamp: number
  aggregatedPriority: number
}

export interface ValidationResult {
  validator: string
  status: 'pass' | 'fail' | 'warning' | 'pending'
  message: string
  timestamp: number
}

export interface Prediction {
  metric: string
  predicted: string
  actual?: string
  timeframe: string
}

export interface Proposal {
  id: string
  bubbleId: string
  problemId: string
  title: string
  description: string
  submittedBy: string
  timestamp: number
  predictions: Prediction[]
  validations: ValidationResult[]
  status: 'draft' | 'validating' | 'active' | 'completed' | 'evaluated'
  influenceWeight?: number
  accuracyScore?: number
}

export interface BlackBoxEntry {
  id: string
  timestamp: number
  type: 'prediction' | 'validation' | 'outcome' | 'warning' | 'decision'
  bubbleId: string
  proposalId?: string
  data: Record<string, unknown>
  immutable: boolean
}

export interface MetaAlert {
  id: string
  timestamp: number
  severity: 'low' | 'medium' | 'high' | 'critical'
  type: 'drift' | 'bias' | 'capture-attempt' | 'anomaly' | 'contradiction'
  message: string
  bubbleId?: string
  data: Record<string, unknown>
}

export type Layer = 'L1' | 'L2' | 'L3' | 'L4'

export interface LayerInfo {
  id: Layer
  name: string
  description: string
  color: string
}
