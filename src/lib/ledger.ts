import { createHashAsync } from './crypto'
import type { BlackBoxEvent, Proposal } from './types'

export interface Block {
  blockNumber: number
  timestamp: Date
  events: BlackBoxEvent[]
  hash: string
  previousHash: string
  merkleRoot: string
}

export interface Settlement {
  proposalId: string
  influenceDeltas: Map<string, number>
  treasuryDelta: number
  timestamp: Date
  verified: boolean
}

export class Ledger {
  private blocks: Block[]
  private pendingEvents: BlackBoxEvent[]
  private genesisHash: string
  
  constructor() {
    this.blocks = []
    this.pendingEvents = []
    this.genesisHash = '0000000000000000000000000000000000000000000000000000000000000000'
  }
  
  async initialize(): Promise<void> {
    const genesisBlock = await this.createGenesisBlock()
    this.blocks.push(genesisBlock)
  }
  
  private async createGenesisBlock(): Promise<Block> {
    const genesisEvent: BlackBoxEvent = {
      id: 'genesis',
      timestamp: new Date(),
      type: 'alert',
      data: { message: 'The Record initialized' },
      hash: this.genesisHash,
      previousHash: this.genesisHash
    }
    
    return {
      blockNumber: 0,
      timestamp: new Date(),
      events: [genesisEvent],
      hash: this.genesisHash,
      previousHash: this.genesisHash,
      merkleRoot: this.genesisHash
    }
  }
  
  async addEvent(event: Omit<BlackBoxEvent, 'hash' | 'previousHash'>): Promise<BlackBoxEvent> {
    const previousHash = this.pendingEvents.length > 0
      ? this.pendingEvents[this.pendingEvents.length - 1].hash
      : this.getLatestBlock().hash
    
    const eventData = JSON.stringify({ ...event, previousHash })
    const hash = await createHashAsync(eventData)
    
    const fullEvent: BlackBoxEvent = {
      ...event,
      hash,
      previousHash
    }
    
    this.pendingEvents.push(fullEvent)
    
    if (this.pendingEvents.length >= 5) {
      await this.finalizeBlock()
    }
    
    return fullEvent
  }
  
  async finalizeBlock(): Promise<Block> {
    if (this.pendingEvents.length === 0) {
      throw new Error('No pending events to finalize')
    }
    
    const latestBlock = this.getLatestBlock()
    const merkleRoot = await this.calculateMerkleRoot(this.pendingEvents)
    
    const blockData = JSON.stringify({
      blockNumber: latestBlock.blockNumber + 1,
      timestamp: new Date(),
      events: this.pendingEvents,
      previousHash: latestBlock.hash,
      merkleRoot
    })
    
    const blockHash = await createHashAsync(blockData)
    
    const newBlock: Block = {
      blockNumber: latestBlock.blockNumber + 1,
      timestamp: new Date(),
      events: [...this.pendingEvents],
      hash: blockHash,
      previousHash: latestBlock.hash,
      merkleRoot
    }
    
    this.blocks.push(newBlock)
    this.pendingEvents = []
    
    return newBlock
  }
  
  getLatestBlock(): Block {
    return this.blocks[this.blocks.length - 1]
  }
  
  getAllBlocks(): Block[] {
    return [...this.blocks]
  }
  
  getBlockByNumber(blockNumber: number): Block | undefined {
    return this.blocks.find(b => b.blockNumber === blockNumber)
  }
  
  async verifyChainIntegrity(): Promise<boolean> {
    for (let i = 1; i < this.blocks.length; i++) {
      const currentBlock = this.blocks[i]
      const previousBlock = this.blocks[i - 1]
      
      if (currentBlock.previousHash !== previousBlock.hash) {
        return false
      }
      
      const blockData = JSON.stringify({
        blockNumber: currentBlock.blockNumber,
        timestamp: currentBlock.timestamp,
        events: currentBlock.events,
        previousHash: currentBlock.previousHash,
        merkleRoot: currentBlock.merkleRoot
      })
      
      const calculatedHash = await createHashAsync(blockData)
      
      if (calculatedHash !== currentBlock.hash) {
        return false
      }
    }
    
    return true
  }
  
  async calculateZeroSumSettlement(
    proposal: Proposal,
    accuracyScores: Map<string, number>
  ): Promise<Settlement> {
    const influenceDeltas = new Map<string, number>()
    let totalGained = 0
    let totalLost = 0
    
    for (const [userId, accuracy] of accuracyScores.entries()) {
      const delta = accuracy > 0.7 ? 100 * accuracy : -50 * (1 - accuracy)
      influenceDeltas.set(userId, delta)
      
      if (delta > 0) {
        totalGained += delta
      } else {
        totalLost += Math.abs(delta)
      }
    }
    
    const treasuryDelta = -(totalGained + totalLost)
    
    const sum = Array.from(influenceDeltas.values()).reduce((a, b) => a + b, 0) + treasuryDelta
    const verified = Math.abs(sum) < 0.01
    
    return {
      proposalId: proposal.id,
      influenceDeltas,
      treasuryDelta,
      timestamp: new Date(),
      verified
    }
  }
  
  private async calculateMerkleRoot(events: BlackBoxEvent[]): Promise<string> {
    if (events.length === 0) {
      return this.genesisHash
    }
    
    let hashes = await Promise.all(events.map(e => createHashAsync(JSON.stringify(e))))
    
    while (hashes.length > 1) {
      const newHashes: string[] = []
      
      for (let i = 0; i < hashes.length; i += 2) {
        if (i + 1 < hashes.length) {
          const combined = hashes[i] + hashes[i + 1]
          newHashes.push(await createHashAsync(combined))
        } else {
          newHashes.push(hashes[i])
        }
      }
      
      hashes = newHashes
    }
    
    return hashes[0]
  }
  
  async verifyMerkleProof(event: BlackBoxEvent, blockNumber: number): Promise<boolean> {
    const block = this.getBlockByNumber(blockNumber)
    if (!block) return false
    
    const eventIndex = block.events.findIndex(e => e.id === event.id)
    if (eventIndex === -1) return false
    
    const calculatedRoot = await this.calculateMerkleRoot(block.events)
    return calculatedRoot === block.merkleRoot
  }
}

export const globalLedger = new Ledger()
