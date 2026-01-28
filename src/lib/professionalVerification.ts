import { createHash } from './crypto'
import type { UserAccount, VerificationSignal } from './auth'

export type ProfessionalRole = 
  | 'civil-engineer'
  | 'infrastructure-inspector'
  | 'public-health-official'
  | 'utility-worker'
  | 'emergency-responder'
  | 'environmental-scientist'
  | 'licensed-contractor'
  | 'government-employee'
  | 'medical-professional'
  | 'teacher-educator'
  | 'community-organizer'
  | 'verified-journalist'

export type CredentialType =
  | 'professional-license'
  | 'government-id'
  | 'employer-verification'
  | 'certification'
  | 'academic-degree'
  | 'work-email-domain'

export interface ProfessionalCredential {
  id: string
  type: CredentialType
  role: ProfessionalRole
  issuingOrganization: string
  credentialNumber?: string
  verifiedAt: Date
  expiresAt?: Date
  documentHash: string
  verificationMethod: 'document-upload' | 'email-domain' | 'third-party-api' | 'manual-review'
  status: 'pending' | 'verified' | 'rejected' | 'expired'
  reviewedBy?: string
  publiclyVisible: boolean
}

export interface ProfessionalProfile {
  userId: string
  role: ProfessionalRole
  credentials: ProfessionalCredential[]
  specializations: string[]
  jurisdictions: string[]
  organizationName?: string
  verificationLevel: 'basic' | 'standard' | 'enhanced' | 'government'
  publicContact: boolean
  professionalInfluenceBonus: number
  signalWeightMultiplier: number
  canIssueOfficialReports: boolean
}

export const PROFESSIONAL_ROLES: Record<ProfessionalRole, {
  label: string
  description: string
  requiredCredentials: CredentialType[]
  baseInfluenceBonus: number
  signalWeight: number
  publicTrust: boolean
}> = {
  'civil-engineer': {
    label: 'Civil Engineer',
    description: 'Licensed professional engineer specializing in infrastructure',
    requiredCredentials: ['professional-license', 'work-email-domain'],
    baseInfluenceBonus: 500,
    signalWeight: 3.0,
    publicTrust: true,
  },
  'infrastructure-inspector': {
    label: 'Infrastructure Inspector',
    description: 'Certified inspector for public infrastructure and utilities',
    requiredCredentials: ['certification', 'employer-verification'],
    baseInfluenceBonus: 400,
    signalWeight: 2.5,
    publicTrust: true,
  },
  'public-health-official': {
    label: 'Public Health Official',
    description: 'Government-employed public health professional',
    requiredCredentials: ['government-id', 'work-email-domain'],
    baseInfluenceBonus: 450,
    signalWeight: 2.8,
    publicTrust: true,
  },
  'utility-worker': {
    label: 'Utility Worker',
    description: 'Municipal utility operator or maintenance professional',
    requiredCredentials: ['employer-verification'],
    baseInfluenceBonus: 300,
    signalWeight: 2.2,
    publicTrust: true,
  },
  'emergency-responder': {
    label: 'Emergency Responder',
    description: 'Fire, police, or emergency medical services professional',
    requiredCredentials: ['government-id', 'employer-verification'],
    baseInfluenceBonus: 400,
    signalWeight: 2.5,
    publicTrust: true,
  },
  'environmental-scientist': {
    label: 'Environmental Scientist',
    description: 'Professional with environmental science credentials',
    requiredCredentials: ['academic-degree', 'work-email-domain'],
    baseInfluenceBonus: 350,
    signalWeight: 2.3,
    publicTrust: true,
  },
  'licensed-contractor': {
    label: 'Licensed Contractor',
    description: 'State-licensed building or specialty contractor',
    requiredCredentials: ['professional-license'],
    baseInfluenceBonus: 250,
    signalWeight: 2.0,
    publicTrust: false,
  },
  'government-employee': {
    label: 'Government Employee',
    description: 'Public sector employee in relevant department',
    requiredCredentials: ['government-id', 'work-email-domain'],
    baseInfluenceBonus: 350,
    signalWeight: 2.2,
    publicTrust: true,
  },
  'medical-professional': {
    label: 'Medical Professional',
    description: 'Licensed healthcare provider',
    requiredCredentials: ['professional-license', 'work-email-domain'],
    baseInfluenceBonus: 400,
    signalWeight: 2.5,
    publicTrust: true,
  },
  'teacher-educator': {
    label: 'Teacher/Educator',
    description: 'Licensed educator in public or accredited institution',
    requiredCredentials: ['professional-license', 'employer-verification'],
    baseInfluenceBonus: 200,
    signalWeight: 1.8,
    publicTrust: true,
  },
  'community-organizer': {
    label: 'Community Organizer',
    description: 'Verified community leader or nonprofit coordinator',
    requiredCredentials: ['employer-verification'],
    baseInfluenceBonus: 150,
    signalWeight: 1.5,
    publicTrust: false,
  },
  'verified-journalist': {
    label: 'Verified Journalist',
    description: 'Credentialed journalist from recognized outlet',
    requiredCredentials: ['employer-verification', 'work-email-domain'],
    baseInfluenceBonus: 200,
    signalWeight: 1.8,
    publicTrust: false,
  },
}

export function createProfessionalCredential(
  type: CredentialType,
  role: ProfessionalRole,
  issuingOrg: string,
  documentData?: string
): ProfessionalCredential {
  const credentialId = createHash(`${type}-${role}-${Date.now()}`)
  
  return {
    id: credentialId.slice(0, 16),
    type,
    role,
    issuingOrganization: issuingOrg,
    verifiedAt: new Date(),
    documentHash: documentData ? createHash(documentData) : '',
    verificationMethod: 'document-upload',
    status: 'pending',
    publiclyVisible: true,
  }
}

export function verifyWorkEmailDomain(email: string): {
  valid: boolean
  organization?: string
  trustLevel: 'high' | 'medium' | 'low'
} {
  const domain = email.split('@')[1]?.toLowerCase()
  
  const trustedDomains: Record<string, { org: string; trustLevel: 'high' | 'medium' }> = {
    'gov': { org: 'Government', trustLevel: 'high' },
    'mil': { org: 'Military', trustLevel: 'high' },
    'edu': { org: 'Educational Institution', trustLevel: 'high' },
    'state.*.us': { org: 'State Government', trustLevel: 'high' },
    'city.*.us': { org: 'City Government', trustLevel: 'high' },
  }
  
  for (const [pattern, info] of Object.entries(trustedDomains)) {
    if (domain?.endsWith(pattern) || domain?.includes(pattern.replace('*', ''))) {
      return {
        valid: true,
        organization: info.org,
        trustLevel: info.trustLevel,
      }
    }
  }
  
  return {
    valid: false,
    trustLevel: 'low',
  }
}

export function calculateProfessionalInfluenceBonus(
  profile: ProfessionalProfile
): number {
  const roleConfig = PROFESSIONAL_ROLES[profile.role]
  let bonus = roleConfig.baseInfluenceBonus
  
  const verifiedCredentials = profile.credentials.filter(c => c.status === 'verified')
  const credentialBonus = verifiedCredentials.length * 50
  
  const jurisdictionBonus = profile.jurisdictions.length * 25
  
  if (profile.verificationLevel === 'government') {
    bonus *= 1.5
  } else if (profile.verificationLevel === 'enhanced') {
    bonus *= 1.25
  }
  
  return Math.floor(bonus + credentialBonus + jurisdictionBonus)
}

export function getProfessionalSignalWeight(
  profile: ProfessionalProfile,
  signalCategory: string
): number {
  const roleConfig = PROFESSIONAL_ROLES[profile.role]
  let weight = roleConfig.signalWeight
  
  if (profile.specializations.some(s => 
    signalCategory.toLowerCase().includes(s.toLowerCase())
  )) {
    weight *= 1.5
  }
  
  if (profile.canIssueOfficialReports) {
    weight *= 1.2
  }
  
  return weight
}

export function addProfessionalVerification(
  account: UserAccount,
  profile: ProfessionalProfile
): UserAccount {
  const influenceBonus = calculateProfessionalInfluenceBonus(profile)
  
  const professionalSignal: VerificationSignal = {
    type: 'social',
    verified: true,
    verifiedAt: new Date(),
    value: `${PROFESSIONAL_ROLES[profile.role].label}`,
    score: 40,
  }
  
  return {
    ...account,
    influence: account.influence + influenceBonus,
    verificationSignals: [...account.verificationSignals, professionalSignal],
    humanityScore: Math.min(100, account.humanityScore + 40),
    verificationStatus: 'trusted',
    professionalProfile: { ...profile, userId: account.id },
  }
}

export function validateCredentialRequirements(
  role: ProfessionalRole,
  credentials: ProfessionalCredential[]
): {
  valid: boolean
  missing: CredentialType[]
  message: string
} {
  const required = PROFESSIONAL_ROLES[role].requiredCredentials
  const provided = credentials
    .filter(c => c.status === 'verified')
    .map(c => c.type)
  
  const missing = required.filter(r => !provided.includes(r))
  
  if (missing.length === 0) {
    return {
      valid: true,
      missing: [],
      message: 'All required credentials verified',
    }
  }
  
  return {
    valid: false,
    missing,
    message: `Missing required credentials: ${missing.join(', ')}`,
  }
}

export const PROFESSIONAL_VERIFICATION_SAFEGUARDS = {
  transparency: {
    description: 'All professional credentials are logged in the black box',
    implementation: 'credential-hash-chain',
  },
  accountability: {
    description: 'Professionals face higher penalties for false signals',
    implementation: 'enhanced-slashing-rate',
  },
  publicTrust: {
    description: 'Professional status is visible but doesn\'t override consensus',
    implementation: 'weighted-signal-not-vote',
  },
  revocation: {
    description: 'Credentials can be revoked if misused',
    implementation: 'credential-expiry-and-review',
  },
  diversityProtection: {
    description: 'No single professional type can dominate a bubble',
    implementation: 'gini-coefficient-enforcement',
  },
  decentralizedValidation: {
    description: 'No central authority approves credentials',
    implementation: 'random-validator-selection-with-stake',
  },
  challengePeriod: {
    description: '7-day public challenge period for all new credentials',
    implementation: 'community-fraud-reporting',
  },
}

export interface ValidatorReview {
  validatorId: string
  credentialId: string
  approved: boolean
  reviewedAt: Date
  comments?: string
  stakeAmount: number
}

export interface DecentralizedReviewProcess {
  credentialId: string
  status: 'pending' | 'under-review' | 'approved' | 'rejected' | 'challenged'
  selectedValidators: string[]
  reviews: ValidatorReview[]
  consensusReached: boolean
  challengePeriodEnds?: Date
  finalDecision?: 'approved' | 'rejected'
}

export function selectRandomValidators(
  role: ProfessionalRole,
  availableValidators: UserAccount[],
  count: number = 5
): string[] {
  const eligibleValidators = availableValidators.filter(v => 
    v.humanityScore >= 80 && 
    v.influence >= 500 &&
    v.professionalProfile?.role === role
  )
  
  const shuffled = [...eligibleValidators].sort(() => Math.random() - 0.5)
  
  return shuffled.slice(0, count).map(v => v.id)
}

export function checkValidationConsensus(reviews: ValidatorReview[]): {
  consensusReached: boolean
  decision: 'approved' | 'rejected' | 'pending'
} {
  const totalReviews = reviews.length
  const approvals = reviews.filter(r => r.approved).length
  
  if (totalReviews < 5) {
    return { consensusReached: false, decision: 'pending' }
  }
  
  if (approvals >= 4) {
    return { consensusReached: true, decision: 'approved' }
  }
  
  if (totalReviews - approvals >= 2) {
    return { consensusReached: true, decision: 'rejected' }
  }
  
  return { consensusReached: false, decision: 'pending' }
}

export function calculateValidatorReward(
  reviews: ValidatorReview[],
  finalDecision: 'approved' | 'rejected',
  baseReward: number = 50
): Map<string, number> {
  const rewards = new Map<string, number>()
  
  for (const review of reviews) {
    const correctDecision = (review.approved && finalDecision === 'approved') ||
                           (!review.approved && finalDecision === 'rejected')
    
    if (correctDecision) {
      rewards.set(review.validatorId, baseReward)
    } else {
      rewards.set(review.validatorId, -review.stakeAmount)
    }
  }
  
  return rewards
}
