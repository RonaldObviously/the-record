import { createHashAsync } from './crypto'
import type { Proposal, Validator } from './types'

export interface ConsensusMessage {
  id: string
  type: 'PRE-PREPARE' | 'PREPARE' | 'COMMIT'
  proposalId: string
  validatorId: string
  timestamp: Date
  signature: string
}

export interface ConsensusState {
  phase: 'IDLE' | 'PRE-PREPARE' | 'PREPARE' | 'COMMIT' | 'FINALIZED'
  proposalId: string
  prePrepares: ConsensusMessage[]
  prepares: ConsensusMessage[]
  commits: ConsensusMessage[]
  finalizedAt?: Date
}

export class BFTConsensus {
  private validators: Validator[]
  private states: Map<string, ConsensusState>
  
  constructor(validators: Validator[]) {
    this.validators = validators
    this.states = new Map()
  }
  
  get bftThreshold(): number {
    return Math.ceil((this.validators.length * 2) / 3)
  }
  
  get activeValidators(): Validator[] {
    return this.validators.filter(v => v.uptime > 95)
  }
  
  async initiateConsensus(proposalId: string, leaderId: string): Promise<void> {
    const state: ConsensusState = {
      phase: 'PRE-PREPARE',
      proposalId,
      prePrepares: [],
      prepares: [],
      commits: []
    }
    
    const message: ConsensusMessage = {
      id: await createHashAsync(`${proposalId}-${leaderId}-${Date.now()}`),
      type: 'PRE-PREPARE',
      proposalId,
      validatorId: leaderId,
      timestamp: new Date(),
      signature: await createHashAsync(`${proposalId}-${leaderId}`)
    }
    
    state.prePrepares.push(message)
    this.states.set(proposalId, state)
  }
  
  async addPrepare(proposalId: string, validatorId: string): Promise<void> {
    const state = this.states.get(proposalId)
    if (!state || state.phase !== 'PRE-PREPARE') return
    
    const message: ConsensusMessage = {
      id: await createHashAsync(`${proposalId}-${validatorId}-${Date.now()}`),
      type: 'PREPARE',
      proposalId,
      validatorId,
      timestamp: new Date(),
      signature: await createHashAsync(`${proposalId}-${validatorId}`)
    }
    
    state.prepares.push(message)
    
    if (state.prepares.length >= this.bftThreshold) {
      state.phase = 'PREPARE'
    }
    
    this.states.set(proposalId, state)
  }
  
  async addCommit(proposalId: string, validatorId: string): Promise<void> {
    const state = this.states.get(proposalId)
    if (!state || state.phase !== 'PREPARE') return
    
    const message: ConsensusMessage = {
      id: await createHashAsync(`${proposalId}-${validatorId}-${Date.now()}`),
      type: 'COMMIT',
      proposalId,
      validatorId,
      timestamp: new Date(),
      signature: await createHashAsync(`${proposalId}-${validatorId}`)
    }
    
    state.commits.push(message)
    
    if (state.commits.length >= this.bftThreshold) {
      state.phase = 'FINALIZED'
      state.finalizedAt = new Date()
    }
    
    this.states.set(proposalId, state)
  }
  
  isFinalized(proposalId: string): boolean {
    const state = this.states.get(proposalId)
    return state?.phase === 'FINALIZED' || false
  }
  
  getConsensusState(proposalId: string): ConsensusState | undefined {
    return this.states.get(proposalId)
  }
  
  async simulateConsensus(proposalId: string): Promise<boolean> {
    const activeVals = this.activeValidators
    if (activeVals.length < this.bftThreshold) {
      return false
    }
    
    const leader = activeVals[0]
    await this.initiateConsensus(proposalId, leader.id)
    
    for (let i = 0; i < this.bftThreshold; i++) {
      await this.addPrepare(proposalId, activeVals[i].id)
    }
    
    for (let i = 0; i < this.bftThreshold; i++) {
      await this.addCommit(proposalId, activeVals[i].id)
    }
    
    return this.isFinalized(proposalId)
  }
  
  detectCartel(): { detected: boolean; alignment: number; suspiciousValidators: string[] } {
    const votingMatrix: number[][] = []
    
    for (const validator of this.validators) {
      votingMatrix.push(validator.votingPatterns || [])
    }
    
    let maxAlignment = 0
    const suspiciousValidators: string[] = []
    
    for (let i = 0; i < votingMatrix.length; i++) {
      for (let j = i + 1; j < votingMatrix.length; j++) {
        const alignment = this.calculateAlignment(votingMatrix[i], votingMatrix[j])
        if (alignment > maxAlignment) {
          maxAlignment = alignment
        }
        if (alignment > 0.9) {
          suspiciousValidators.push(this.validators[i].id, this.validators[j].id)
        }
      }
    }
    
    return {
      detected: maxAlignment > 0.9,
      alignment: maxAlignment,
      suspiciousValidators: [...new Set(suspiciousValidators)]
    }
  }
  
  private calculateAlignment(pattern1: number[], pattern2: number[]): number {
    if (pattern1.length === 0 || pattern2.length === 0) return 0
    
    const minLength = Math.min(pattern1.length, pattern2.length)
    let matches = 0
    
    for (let i = 0; i < minLength; i++) {
      if (pattern1[i] === pattern2[i]) matches++
    }
    
    return matches / minLength
  }
  
  calculateGiniCoefficient(): number {
    const stakes = this.validators.map(v => v.stake).sort((a, b) => a - b)
    const n = stakes.length
    
    if (n === 0) return 0
    
    const totalStake = stakes.reduce((sum, stake) => sum + stake, 0)
    let numerator = 0
    
    for (let i = 0; i < n; i++) {
      numerator += (2 * (i + 1) - n - 1) * stakes[i]
    }
    
    return numerator / (n * totalStake)
  }
}
