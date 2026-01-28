import type { Validator, Proposal, MetaAlert } from './types'
import { BFTConsensus } from './bft-consensus'

export interface SybilScore {
  userId: string
  phoneVerified: boolean
  emailVerified: boolean
  socialProof: number
  hardwareId: string
  ipAddress: string
  humanityScore: number
}

export interface MempoolEntry {
  proposalId: string
  submittedAt: Date
  includedInBlock?: number
  includedAt?: Date
  censored: boolean
}

export interface ProofOfPersistenceChallenge {
  challengeId: string
  fileHash: string
  timestamp: Date
  expectedResponse: string
  actualResponse?: string
  verified: boolean
}

export class SecurityMonitor {
  private mempoolEntries: Map<string, MempoolEntry>
  private sybilScores: Map<string, SybilScore>
  private persistenceChallenges: Map<string, ProofOfPersistenceChallenge>
  
  constructor() {
    this.mempoolEntries = new Map()
    this.sybilScores = new Map()
    this.persistenceChallenges = new Map()
  }
  
  addToMempool(proposalId: string): void {
    this.mempoolEntries.set(proposalId, {
      proposalId,
      submittedAt: new Date(),
      censored: false
    })
  }
  
  markIncluded(proposalId: string, blockNumber: number): void {
    const entry = this.mempoolEntries.get(proposalId)
    if (entry) {
      entry.includedInBlock = blockNumber
      entry.includedAt = new Date()
      this.mempoolEntries.set(proposalId, entry)
    }
  }
  
  detectCensoredProposals(timeoutMinutes: number = 2): MempoolEntry[] {
    const now = new Date()
    const censored: MempoolEntry[] = []
    
    for (const [id, entry] of this.mempoolEntries.entries()) {
      if (!entry.includedInBlock) {
        const ageMinutes = (now.getTime() - entry.submittedAt.getTime()) / (1000 * 60)
        if (ageMinutes > timeoutMinutes) {
          entry.censored = true
          censored.push(entry)
          this.mempoolEntries.set(id, entry)
        }
      }
    }
    
    return censored
  }
  
  calculateHumanityScore(signals: Partial<SybilScore>): number {
    let score = 0
    
    if (signals.phoneVerified) score += 0.25
    if (signals.emailVerified) score += 0.15
    if (signals.hardwareId && signals.hardwareId.length > 0) score += 0.20
    if (signals.ipAddress && signals.ipAddress.length > 0) score += 0.10
    if (signals.socialProof) score += Math.min(signals.socialProof / 100, 0.30)
    
    return Math.min(score, 1.0)
  }
  
  registerUser(userId: string, signals: Partial<SybilScore>): SybilScore {
    const humanityScore = this.calculateHumanityScore(signals)
    
    const sybilScore: SybilScore = {
      userId,
      phoneVerified: signals.phoneVerified || false,
      emailVerified: signals.emailVerified || false,
      socialProof: signals.socialProof || 0,
      hardwareId: signals.hardwareId || '',
      ipAddress: signals.ipAddress || '',
      humanityScore
    }
    
    this.sybilScores.set(userId, sybilScore)
    return sybilScore
  }
  
  getUserHumanityScore(userId: string): number {
    return this.sybilScores.get(userId)?.humanityScore || 0
  }
  
  async createPersistenceChallenge(fileHash: string): Promise<ProofOfPersistenceChallenge> {
    const challengeId = `challenge-${Date.now()}-${Math.random().toString(36).substring(7)}`
    const nonce = Math.random().toString(36).substring(7)
    const expectedResponse = await this.hashChallenge(fileHash, nonce)
    
    const challenge: ProofOfPersistenceChallenge = {
      challengeId,
      fileHash,
      timestamp: new Date(),
      expectedResponse,
      verified: false
    }
    
    this.persistenceChallenges.set(challengeId, challenge)
    return challenge
  }
  
  async verifyPersistenceResponse(challengeId: string, response: string): Promise<boolean> {
    const challenge = this.persistenceChallenges.get(challengeId)
    if (!challenge) return false
    
    const verified = response === challenge.expectedResponse
    challenge.actualResponse = response
    challenge.verified = verified
    
    this.persistenceChallenges.set(challengeId, challenge)
    return verified
  }
  
  private async hashChallenge(fileHash: string, nonce: string): Promise<string> {
    const combined = fileHash + nonce
    const encoder = new TextEncoder()
    const data = encoder.encode(combined)
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  }
  
  generateMetaAlerts(
    validators: Validator[],
    proposals: Proposal[],
    consensus: BFTConsensus
  ): MetaAlert[] {
    const alerts: MetaAlert[] = []
    
    const cartelAnalysis = consensus.detectCartel()
    if (cartelAnalysis.detected) {
      alerts.push({
        id: `cartel-${Date.now()}`,
        severity: 'critical',
        type: 'cartel_detected',
        message: `Cartel detected: ${cartelAnalysis.alignment.toFixed(1)}% voting alignment among validators`,
        affectedBubbles: ['global'],
        timestamp: new Date()
      })
    }
    
    const gini = consensus.calculateGiniCoefficient()
    if (gini > 0.6) {
      alerts.push({
        id: `gini-${Date.now()}`,
        severity: 'high',
        type: 'whale_capture',
        message: `High wealth concentration detected: Gini = ${gini.toFixed(2)}`,
        affectedBubbles: ['global'],
        timestamp: new Date()
      })
    }
    
    const censoredProposals = this.detectCensoredProposals()
    if (censoredProposals.length > 0) {
      alerts.push({
        id: `censorship-${Date.now()}`,
        severity: 'high',
        type: 'censorship_detected',
        message: `${censoredProposals.length} proposals not included in blocks after 2 minutes`,
        affectedBubbles: ['global'],
        timestamp: new Date()
      })
    }
    
    const activeValidators = validators.filter(v => v.uptime > 95)
    const bftThreshold = Math.ceil((validators.length * 2) / 3)
    if (activeValidators.length < bftThreshold) {
      alerts.push({
        id: `bft-${Date.now()}`,
        severity: 'critical',
        type: 'bft_threshold',
        message: `Only ${activeValidators.length}/${validators.length} validators active (need ${bftThreshold} for BFT)`,
        affectedBubbles: ['global'],
        timestamp: new Date()
      })
    }
    
    return alerts
  }
}

export const globalSecurityMonitor = new SecurityMonitor()
