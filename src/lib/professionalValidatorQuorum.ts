import type { ProfessionalCredential, ProfessionalRole } from './professionalVerification'

export interface Validator {
  id: string
  publicKey: string
  role: ProfessionalRole
  specialization: string[]
  jurisdictions: string[]
  stakedInfluence: number
  reputation: number
  validationsCompleted: number
  validationAccuracy: number
  geographicRegion: string
  lastActive: Date
  isActive: boolean
}

export interface CredentialValidationRequest {
  id: string
  credentialId: string
  credentialType: string
  professionalRole: ProfessionalRole
  documentHash: string
  encryptedDocumentCID: string
  submittedAt: Date
  requiredValidators: number
  validatorsAssigned: string[]
  validations: CredentialValidation[]
  status: 'pending' | 'in-review' | 'approved' | 'rejected' | 'disputed'
  consensusReached: boolean
  finalDecision?: 'approved' | 'rejected'
  completedAt?: Date
}

export interface CredentialValidation {
  validatorId: string
  validatorPublicKey: string
  decision: 'approve' | 'reject' | 'abstain'
  confidence: number
  reasoning: string
  flaggedIssues: string[]
  timestamp: Date
  signatureProof: string
  stakedInfluence: number
}

export interface QuorumConfig {
  minimumValidators: number
  requiredApprovals: number
  reviewTimeoutHours: number
  minimumStake: number
  minimumReputation: number
  diversityRequirement: boolean
  geographicDistribution: boolean
}

export const CREDENTIAL_QUORUM_CONFIGS: Record<string, QuorumConfig> = {
  'professional-license': {
    minimumValidators: 5,
    requiredApprovals: 4,
    reviewTimeoutHours: 72,
    minimumStake: 200,
    minimumReputation: 0.75,
    diversityRequirement: true,
    geographicDistribution: false,
  },
  'government-id': {
    minimumValidators: 3,
    requiredApprovals: 3,
    reviewTimeoutHours: 48,
    minimumStake: 150,
    minimumReputation: 0.85,
    diversityRequirement: false,
    geographicDistribution: false,
  },
  'certification': {
    minimumValidators: 5,
    requiredApprovals: 4,
    reviewTimeoutHours: 72,
    minimumStake: 200,
    minimumReputation: 0.75,
    diversityRequirement: true,
    geographicDistribution: false,
  },
  'employer-verification': {
    minimumValidators: 3,
    requiredApprovals: 2,
    reviewTimeoutHours: 48,
    minimumStake: 100,
    minimumReputation: 0.70,
    diversityRequirement: false,
    geographicDistribution: false,
  },
  'academic-degree': {
    minimumValidators: 5,
    requiredApprovals: 4,
    reviewTimeoutHours: 96,
    minimumStake: 250,
    minimumReputation: 0.80,
    diversityRequirement: true,
    geographicDistribution: true,
  },
}

export function selectValidatorQuorum(
  request: CredentialValidationRequest,
  availableValidators: Validator[],
  config: QuorumConfig
): Validator[] {
  const role = request.professionalRole
  
  const eligibleValidators = availableValidators.filter(v => {
    if (!v.isActive) return false
    if (v.stakedInfluence < config.minimumStake) return false
    if (v.reputation < config.minimumReputation) return false
    if (v.role !== role) return false
    
    return true
  })
  
  if (eligibleValidators.length < config.minimumValidators) {
    throw new Error(`Insufficient eligible validators. Need ${config.minimumValidators}, found ${eligibleValidators.length}`)
  }
  
  const selected: Validator[] = []
  const remainingValidators = [...eligibleValidators]
  
  if (config.diversityRequirement) {
    const orgs = new Map<string, number>()
    const regions = new Map<string, number>()
    
    while (selected.length < config.minimumValidators && remainingValidators.length > 0) {
      const randomIndex = Math.floor(Math.random() * remainingValidators.length)
      const candidate = remainingValidators[randomIndex]
      
      const orgCount = orgs.get(candidate.specialization[0] || '') || 0
      const regionCount = regions.get(candidate.geographicRegion) || 0
      
      const maxRepresentation = Math.ceil(config.minimumValidators / 3)
      if (orgCount >= maxRepresentation || regionCount >= maxRepresentation) {
        remainingValidators.splice(randomIndex, 1)
        continue
      }
      
      selected.push(candidate)
      orgs.set(candidate.specialization[0] || '', orgCount + 1)
      regions.set(candidate.geographicRegion, regionCount + 1)
      remainingValidators.splice(randomIndex, 1)
    }
  } else {
    while (selected.length < config.minimumValidators && remainingValidators.length > 0) {
      const randomIndex = Math.floor(Math.random() * remainingValidators.length)
      selected.push(remainingValidators[randomIndex])
      remainingValidators.splice(randomIndex, 1)
    }
  }
  
  return selected.sort((a, b) => b.reputation - a.reputation)
}

export function evaluateQuorumConsensus(
  request: CredentialValidationRequest,
  config: QuorumConfig
): { consensusReached: boolean; decision: 'approved' | 'rejected' | 'pending'; confidence: number } {
  const validations = request.validations
  
  if (validations.length < config.minimumValidators) {
    return {
      consensusReached: false,
      decision: 'pending',
      confidence: 0,
    }
  }
  
  const approvals = validations.filter(v => v.decision === 'approve')
  const rejections = validations.filter(v => v.decision === 'reject')
  const abstentions = validations.filter(v => v.decision === 'abstain')
  
  if (approvals.length >= config.requiredApprovals) {
    const avgConfidence = approvals.reduce((sum, v) => sum + v.confidence, 0) / approvals.length
    return {
      consensusReached: true,
      decision: 'approved',
      confidence: avgConfidence,
    }
  }
  
  const totalPossibleApprovals = config.minimumValidators - rejections.length - abstentions.length
  if (totalPossibleApprovals < config.requiredApprovals) {
    const avgConfidence = rejections.reduce((sum, v) => sum + v.confidence, 0) / rejections.length
    return {
      consensusReached: true,
      decision: 'rejected',
      confidence: avgConfidence,
    }
  }
  
  return {
    consensusReached: false,
    decision: 'pending',
    confidence: 0,
  }
}

export function calculateValidatorReward(
  validation: CredentialValidation,
  consensusDecision: 'approved' | 'rejected',
  totalStaked: number
): number {
  const validatorDecisionMatches = 
    (validation.decision === 'approve' && consensusDecision === 'approved') ||
    (validation.decision === 'reject' && consensusDecision === 'rejected')
  
  if (validatorDecisionMatches) {
    const baseReward = validation.stakedInfluence * 0.1
    const confidenceBonus = baseReward * (validation.confidence - 0.5)
    return Math.max(0, baseReward + confidenceBonus)
  }
  
  if (validation.decision === 'abstain') {
    return 0
  }
  
  const slashing = validation.stakedInfluence * 0.5
  return -slashing
}

export function detectValidatorCollusion(
  validators: Validator[],
  recentValidations: CredentialValidationRequest[]
): { collusionDetected: boolean; suspiciousValidators: string[]; reason: string } {
  const pairAgreementRates = new Map<string, { agreements: number; total: number }>()
  
  recentValidations.forEach(request => {
    const validations = request.validations
    
    for (let i = 0; i < validations.length; i++) {
      for (let j = i + 1; j < validations.length; j++) {
        const v1 = validations[i]
        const v2 = validations[j]
        
        const pairKey = [v1.validatorId, v2.validatorId].sort().join(':')
        
        if (!pairAgreementRates.has(pairKey)) {
          pairAgreementRates.set(pairKey, { agreements: 0, total: 0 })
        }
        
        const stats = pairAgreementRates.get(pairKey)!
        stats.total++
        
        if (v1.decision === v2.decision) {
          stats.agreements++
        }
      }
    }
  })
  
  const suspiciousPairs: string[] = []
  pairAgreementRates.forEach((stats, pairKey) => {
    if (stats.total >= 10) {
      const agreementRate = stats.agreements / stats.total
      
      if (agreementRate > 0.95) {
        suspiciousPairs.push(pairKey)
      }
    }
  })
  
  if (suspiciousPairs.length > 0) {
    const suspiciousValidators = new Set<string>()
    suspiciousPairs.forEach(pair => {
      const [v1, v2] = pair.split(':')
      suspiciousValidators.add(v1)
      suspiciousValidators.add(v2)
    })
    
    return {
      collusionDetected: true,
      suspiciousValidators: Array.from(suspiciousValidators),
      reason: `${suspiciousPairs.length} validator pairs show >95% agreement rate across 10+ validations`,
    }
  }
  
  return {
    collusionDetected: false,
    suspiciousValidators: [],
    reason: '',
  }
}

export function createValidationRequest(
  credential: ProfessionalCredential,
  role: ProfessionalRole,
  documentHash: string,
  encryptedCID: string
): CredentialValidationRequest {
  const config = CREDENTIAL_QUORUM_CONFIGS[credential.type] || CREDENTIAL_QUORUM_CONFIGS['professional-license']
  
  return {
    id: `validation-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    credentialId: credential.id,
    credentialType: credential.type,
    professionalRole: role,
    documentHash,
    encryptedDocumentCID: encryptedCID,
    submittedAt: new Date(),
    requiredValidators: config.minimumValidators,
    validatorsAssigned: [],
    validations: [],
    status: 'pending',
    consensusReached: false,
  }
}

export function createMockValidator(
  role: ProfessionalRole,
  region: string,
  specialization: string[]
): Validator {
  return {
    id: `validator-${Math.random().toString(36).substr(2, 9)}`,
    publicKey: `0x${Math.random().toString(16).substr(2, 40)}`,
    role,
    specialization,
    jurisdictions: [region],
    stakedInfluence: 300 + Math.floor(Math.random() * 500),
    reputation: 0.7 + Math.random() * 0.3,
    validationsCompleted: Math.floor(Math.random() * 100),
    validationAccuracy: 0.85 + Math.random() * 0.15,
    geographicRegion: region,
    lastActive: new Date(),
    isActive: true,
  }
}

export const VALIDATOR_ROLE_DESCRIPTIONS = {
  requirements: {
    title: 'Becoming a Credential Validator',
    items: [
      'Must be a verified professional in the same role',
      'Minimum 200 influence staked (forfeited if you approve fraud)',
      'Minimum 0.75 reputation score',
      'Must have completed at least 5 prior validations (or pass qualification)',
      'Geographic and organizational diversity enforced',
    ],
  },
  process: {
    title: 'How Validation Works',
    items: [
      'You receive encrypted credential document via IPFS',
      'Review document authenticity (license numbers, signatures, seals)',
      'Submit decision: Approve, Reject, or Abstain with reasoning',
      'Your decision is cryptographically signed',
      '4 out of 5 validators must agree for approval',
      'If consensus matches your vote: earn 10% reward on stake',
      'If consensus opposes your vote: lose 50% of stake',
    ],
  },
  safety: {
    title: 'Anti-Collusion Safeguards',
    items: [
      'Validators randomly selected from eligible pool',
      'Maximum 33% representation from any single organization',
      'Pair agreement rates monitored (>95% triggers investigation)',
      'Validators can\'t see other votes until submission',
      'All validations logged in immutable black box',
      'Community can challenge suspicious patterns',
    ],
  },
}
