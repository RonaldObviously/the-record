export interface Bubble {
  id: string
  name: string
  type: 'global' | 'continent' | 'nation' | 'city' | 'district' | 'thematic'
  parentId: string | null
  description: string
  population?: number
  activeProblems: number
  activeProposals: number
  h3Cell?: string
  coordinates?: { lat: number; lng: number }
  vitality: number
}

export interface Signal {
  id: string
  bubbleId: string
  h3Cell: string
  category: ProblemCategory
  description: string
  rawText: string
  submittedAt: Date
  anonymous: boolean
  status: 'raw' | 'clustered' | 'validated' | 'actionable' | 'verified'
  clusterId?: string
  attestations: number
  influence: number
}

export interface SignalCluster {
  id: string
  h3Cell: string
  signals: Signal[]
  semanticSummary: string
  category: ProblemCategory
  weight: number
  status: 'forming' | 'mature' | 'priority'
  createdAt: Date
  level: 1 | 2 | 3 | 4
  parentClusterId?: string
  childClusterIds?: string[]
}

export interface Problem {
  id: string
  bubbleId: string
  h3Cell?: string
  category: ProblemCategory
  description: string
  priority: number
  submittedAt: Date
  anonymous: boolean
  attestations: number
  clusterId?: string
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
  | 'water'
  | 'sanitation'
  | 'other'

export interface Proposal {
  id: string
  bubbleId: string
  problemId?: string
  clusterId?: string
  title: string
  description: string
  predictions: Prediction[]
  validations: Validation[]
  submittedAt: Date
  submittedBy: string
  status: 'pending' | 'validated' | 'rejected' | 'active' | 'in-progress' | 'completed' | 'failed' | 'unsafe'
  influenceBonded: number
  realitySettled: boolean
  workQualityInspections: WorkQualityInspection[]
  incidentReports: IncidentReport[]
}

export interface Prediction {
  id: string
  metric: string
  predictedValue: number
  predictedOutcome: string
  timeframe: string
  actualValue?: number
  actualOutcome?: string
  accuracy?: number
  settled: boolean
}

export interface RealitySettlement {
  id: string
  proposalId: string
  verifiedBy: string
  verificationMethod: 'verbal' | 'photo' | 'sensor' | 'witness'
  transcript?: string
  proof?: string
  timestamp: Date
  accuracyScores: Map<string, number>
  influenceDeltas: Map<string, number>
  passed: boolean
}

export interface Validation {
  id: string
  validatorId: string
  type: ValidationType
  passed: boolean
  notes: string
  timestamp: Date
  confidence: number
}

export type ValidationType =
  | 'budget'
  | 'legal'
  | 'feasibility'
  | 'impact'
  | 'safety'
  | 'environmental'
  | 'semantic'
  | 'technical'

export interface WorkQualityInspection {
  id: string
  proposalId: string
  inspectorId: string
  inspectorType: 'peer' | 'professional' | 'independent' | 'automated'
  timestamp: Date
  passed: boolean
  criticalFailures: QualityFailure[]
  minorIssues: QualityIssue[]
  photographicEvidence: string[]
  verbalTranscript?: string
  inspectionDepth: 'visual' | 'structural' | 'comprehensive'
  requiredFollowUp: boolean
  influenceImpact: number
}

export interface QualityFailure {
  id: string
  severity: 'critical' | 'severe' | 'moderate'
  category: 'safety' | 'structural' | 'code-violation' | 'incomplete' | 'substandard'
  description: string
  location?: string
  evidenceHash: string
  requiresImmediateAction: boolean
}

export interface QualityIssue {
  id: string
  category: 'aesthetic' | 'minor-deviation' | 'documentation' | 'efficiency'
  description: string
  recommendedAction: string
}

export interface IncidentReport {
  id: string
  proposalId: string
  reportedBy: string
  timestamp: Date
  incidentType: 'accident' | 'failure' | 'safety-hazard' | 'fraud' | 'negligence'
  severity: 'minor' | 'moderate' | 'serious' | 'catastrophic'
  description: string
  injuries?: InjuryReport[]
  propertyDamage?: PropertyDamageReport
  rootCause?: RootCauseAnalysis
  preventable: boolean
  investigationStatus: 'reported' | 'investigating' | 'concluded'
  investigationFindings?: string
  responsibleParties: ResponsibilityAssignment[]
  influencePenalties: Map<string, number>
  legalConsequences?: string
}

export interface InjuryReport {
  severity: 'minor' | 'moderate' | 'severe' | 'fatal'
  description: string
  medicalTreatment: boolean
  reportedToAuthorities: boolean
}

export interface PropertyDamageReport {
  estimatedCost: number
  description: string
  affectedParties: string[]
}

export interface RootCauseAnalysis {
  primaryCause: 'design-flaw' | 'material-failure' | 'human-error' | 'negligence' | 'deliberate-fraud' | 'insufficient-inspection'
  contributingFactors: string[]
  preventionRecommendations: string[]
  systemicIssue: boolean
}

export interface ResponsibilityAssignment {
  userId: string
  role: 'proposer' | 'executor' | 'inspector' | 'validator'
  responsibilityPercentage: number
  influencePenalty: number
  banDuration?: number
  requiresRetraining: boolean
}

export interface Validator {
  id: string
  name: string
  location: string
  coordinates: { lat: number; lng: number }
  uptime: number
  stake: number
  influence: number
  votingPatterns: number[]
  validationType: ValidationType
  organization?: string
}

export interface UserInfluence {
  userId: string
  totalInfluence: number
  earned: number
  lost: number
  accuracyScore: number
  predictions: number
  settlementsWon: number
  settlementsLost: number
}

export interface MetaAlert {
  id: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  type: 'cartel' | 'bias' | 'drift' | 'capture' | 'entropy' | 'gini'
  message: string
  affectedBubbles: string[]
  timestamp: Date
  metrics?: Record<string, number>
}

export interface BlackBoxEvent {
  id: string
  timestamp: Date
  type: 'signal' | 'signal-submitted' | 'cluster-promoted' | 'problem' | 'proposal' | 'validation' | 'prediction' | 'settlement' | 'alert' | 'attestation'
  data: any
  hash: string
  previousHash: string
  causalLineage?: string[]
}

export interface SystemHealth {
  validatorCount: number
  activeValidators: number
  averageUptime: number
  bftThreshold: number
  cartelDetected: boolean
  giniCoefficient: number
  hashChainIntegrity: boolean
  globalVitality: number
  totalInfluence: number
  entropyLevel: number
}

export interface H3GeospatialData {
  cell: string
  resolution: number
  center: { lat: number; lng: number }
  radius: number
  signals: Signal[]
  clusters: SignalCluster[]
}
