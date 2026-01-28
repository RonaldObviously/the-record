export interface ResearchSubmission {
  id: string
  bubbleId: string
  submittedBy: string
  submittedAt: Date
  title: string
  abstract: string
  methodology: string
  dataSource: string
  findings: string
  conclusions: string
  linkedProblems: string[]
  status: 'peer-review' | 'validated' | 'rejected' | 'published'
  peerReviews: PeerReview[]
  citations: string[]
  ipfsCid?: string
  credibilityScore: number
}

export interface PeerReview {
  id: string
  reviewerId: string
  submittedAt: Date
  methodologyScore: number
  dataQualityScore: number
  reproducibilityScore: number
  comments: string
  recommendation: 'accept' | 'revise' | 'reject'
}

export interface KnowledgeGraphNode {
  id: string
  type: 'research' | 'problem' | 'proposal' | 'signal'
  title: string
  connections: string[]
  weight: number
}

export interface ClusterMetadata {
  id: string
  level: number
  h3Cell: string
  signalIds: string[]
  childClusterIds?: string[]
  parentClusterId?: string | null
  category: string
  severity: number
  firstDetected: Date
  lastUpdated: Date
}

export interface QualityInspection {
  id: string
  proposalId: string
  inspectorId: string
  inspectedAt: Date
  photoEvidence: string[]
  sensorData?: Record<string, number>
  qualityScore: number
  passed: boolean
  issues: string[]
  requiresRework: boolean
}

export interface TreasuryTransaction {
  id: string
  type: 'deposit' | 'withdrawal' | 'reward' | 'slash' | 'fee'
  amount: number
  fromAddress: string
  toAddress: string
  reason: string
  timestamp: Date
  blockNumber: number
  hash: string
}

export interface TreasuryState {
  totalBalance: number
  inflowToday: number
  outflowToday: number
  rewardsPoolBalance: number
  operatingBalance: number
  reserveBalance: number
  transactions: TreasuryTransaction[]
}
