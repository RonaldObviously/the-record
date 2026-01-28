import { createHash } from './crypto'
import type { LocationProof } from './anti-vpn'
import type { ProfessionalProfile } from './professionalVerification'

export interface UserAccount {
  id: string
  publicKey: string
  privateKey: string
  createdAt: Date
  verificationStatus: 'unverified' | 'partial' | 'verified' | 'trusted'
  verificationSignals: VerificationSignal[]
  humanityScore: number
  influence: number
  h3HomeCell?: string
  username?: string
  email?: string
  phone?: string
  locationProofs: LocationProof[]
  deviceFingerprint?: string
  browserFingerprint?: string
  lastLocationVerification?: Date
  vpnDetected: boolean
  suspiciousActivityCount: number
  professionalProfile?: ProfessionalProfile
}

export interface VerificationSignal {
  type: 'email' | 'phone' | 'github' | 'device' | 'geolocation' | 'social' | 'biometric'
  verified: boolean
  verifiedAt?: Date
  value?: string
  score: number
}

export interface OnboardingStep {
  id: string
  title: string
  description: string
  required: boolean
  completed: boolean
  signalType: VerificationSignal['type']
}

export async function createAccount(): Promise<UserAccount> {
  const timestamp = Date.now().toString()
  const randomData = Math.random().toString()
  const publicKey = createHash(timestamp + randomData + 'public')
  const privateKey = createHash(timestamp + randomData + 'private')
  const accountId = createHash(publicKey + timestamp)

  return {
    id: accountId.slice(0, 16),
    publicKey,
    privateKey,
    createdAt: new Date(),
    verificationStatus: 'unverified',
    verificationSignals: [],
    humanityScore: 0,
    influence: 100,
    locationProofs: [],
    vpnDetected: false,
    suspiciousActivityCount: 0,
  }
}

export function calculateHumanityScore(signals: VerificationSignal[]): number {
  const weights = {
    email: 15,
    phone: 20,
    github: 25,
    device: 10,
    geolocation: 15,
    social: 15,
    biometric: 30,
  }

  let score = 0
  const verifiedSignals = signals.filter(s => s.verified)

  for (const signal of verifiedSignals) {
    score += weights[signal.type] || 0
  }

  const diversityBonus = verifiedSignals.length >= 3 ? 20 : 0
  const totalScore = Math.min(100, score + diversityBonus)

  return totalScore
}

export function getVerificationStatus(humanityScore: number): UserAccount['verificationStatus'] {
  if (humanityScore >= 80) return 'trusted'
  if (humanityScore >= 60) return 'verified'
  if (humanityScore >= 30) return 'partial'
  return 'unverified'
}

export function addVerificationSignal(
  account: UserAccount,
  signal: VerificationSignal
): UserAccount {
  const updatedSignals = [...account.verificationSignals, signal]
  const humanityScore = calculateHumanityScore(updatedSignals)
  const verificationStatus = getVerificationStatus(humanityScore)

  return {
    ...account,
    verificationSignals: updatedSignals,
    humanityScore,
    verificationStatus,
  }
}

export function canSubmitSignals(account: UserAccount): boolean {
  return account.humanityScore >= 30
}

export function canBondInfluence(account: UserAccount): boolean {
  return account.humanityScore >= 60
}

export function canValidate(account: UserAccount): boolean {
  return account.humanityScore >= 80 && account.influence >= 500
}

export const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 'create-keys',
    title: 'Generate Cryptographic Identity',
    description: 'Create your secure Ed25519 key pair for signing attestations',
    required: true,
    completed: false,
    signalType: 'device',
  },
  {
    id: 'verify-email',
    title: 'Verify Email',
    description: 'Link your email address to prevent Sybil attacks',
    required: true,
    completed: false,
    signalType: 'email',
  },
  {
    id: 'verify-location',
    title: 'Set Home Location',
    description: 'Choose your primary geographic context (H3 cell)',
    required: false,
    completed: false,
    signalType: 'geolocation',
  },
  {
    id: 'verify-phone',
    title: 'Verify Phone Number',
    description: 'Add phone verification for higher humanity score',
    required: false,
    completed: false,
    signalType: 'phone',
  },
  {
    id: 'verify-github',
    title: 'Connect GitHub Account',
    description: 'Link your GitHub identity for additional trust',
    required: false,
    completed: false,
    signalType: 'github',
  },
]
