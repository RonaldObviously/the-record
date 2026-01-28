export interface ResearchPaper {
  id: string
  title: string
  authors: string[]
  abstract: string
  ipfsHash: string
  submittedAt: Date
  category: string[]
  linkedProblems: string[]
  linkedProposals: string[]
  validations: ResearchValidation[]
  credibilityScore: number
  predictionsMade: number
  predictionsAccurate: number
  citationCount: number
}

export interface ResearchValidation {
  id: string
  validatorId: string
  validatorType: 'peer' | 'professional' | 'independent'
  passed: boolean
  notes: string
  timestamp: Date
  criteria: {
    methodology: boolean
    dataQuality: boolean
    reproducibility: boolean
    conflictOfInterest: boolean
  }
}

export interface Idea {
  id: string
  title: string
  description: string
  category: string
  submittedAt: Date
  submittedBy: string
  status: 'proposed' | 'discussed' | 'testing' | 'graduated' | 'rejected'
  interestSignals: number
  linkedProblems: string[]
  refinements: IdeaRefinement[]
  experimentalResults?: ExperimentalResult
  graduatedProposalId?: string
}

export interface IdeaRefinement {
  id: string
  userId: string
  suggestion: string
  timestamp: Date
  adopted: boolean
}

export interface ExperimentalResult {
  id: string
  testDescription: string
  startDate: Date
  endDate?: Date
  results: string
  success: boolean
  dataIPFSHash?: string
}

export interface KnowledgeEntry {
  id: string
  type: 'problem-pattern' | 'solution-effectiveness' | 'validator-performance' | 'prediction-accuracy'
  category: string
  summary: string
  tags: string[]
  h3Cells: string[]
  linkedProblems: string[]
  linkedProposals: string[]
  linkedResearch: string[]
  createdAt: Date
  ipfsHash: string
  relevanceScore: number
}
