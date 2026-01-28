export class ProtocolKernel {
  private readonly GLOBAL_INFLUENCE_SUPPLY = 1000000
  private readonly MIN_QUORUM = 0.67
  private readonly GINI_TAX_THRESHOLD = 0.6
  
  calculateInfluenceDelta(
    predictionAccuracy: number,
    stakeAmount: number,
    currentInfluence: number,
    globalVitality: number
  ): number {
    const baseReward = stakeAmount * predictionAccuracy
    const vitalityMultiplier = globalVitality / this.GLOBAL_INFLUENCE_SUPPLY
    const diminishingReturn = 1 / Math.log(currentInfluence + 10)
    
    return baseReward * vitalityMultiplier * diminishingReturn
  }
  
  calculateAccuracyScore(
    predictedValue: number,
    actualValue: number,
    tolerancePercent: number = 0.1
  ): number {
    const difference = Math.abs(predictedValue - actualValue)
    const tolerance = actualValue * tolerancePercent
    
    if (difference <= tolerance) return 1.0
    
    const maxPenalty = actualValue * 0.5
    const penalty = Math.min(difference, maxPenalty)
    
    return Math.max(0, 1 - (penalty / maxPenalty))
  }
  
  enforceZeroSum(deltas: Map<string, number>, treasuryDelta: number): boolean {
    const totalDelta = Array.from(deltas.values()).reduce((sum, d) => sum + d, 0)
    return Math.abs(totalDelta + treasuryDelta) < 0.0001
  }
  
  calculateQuorumCost(entropyLevel: number): number {
    return Math.exp(entropyLevel * 0.1) * 100
  }
  
  applyGiniTax(influenceDistribution: number[]): number[] {
    const gini = this.calculateGini(influenceDistribution)
    
    if (gini < this.GINI_TAX_THRESHOLD) return influenceDistribution
    
    const taxRate = (gini - this.GINI_TAX_THRESHOLD) * 2
    
    return influenceDistribution.map((influence, idx) => {
      const rank = influenceDistribution.filter(i => i > influence).length
      const topHeavy = rank < influenceDistribution.length * 0.2
      
      return topHeavy ? influence * (1 - taxRate) : influence
    })
  }
  
  calculateGini(values: number[]): number {
    if (values.length === 0) return 0
    
    const sorted = [...values].sort((a, b) => a - b)
    const n = sorted.length
    const sum = sorted.reduce((a, b) => a + b, 0)
    
    if (sum === 0) return 0
    
    let numerator = 0
    for (let i = 0; i < n; i++) {
      numerator += (i + 1) * sorted[i]
    }
    
    return (2 * numerator) / (n * sum) - (n + 1) / n
  }
  
  detectCartel(
    votingPatterns: number[][],
    threshold: number = 0.85
  ): { isCartel: boolean; members: number[] } {
    const n = votingPatterns.length
    const similarity: number[][] = Array(n).fill(0).map(() => Array(n).fill(0))
    
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        similarity[i][j] = this.cosineSimilarity(votingPatterns[i], votingPatterns[j])
      }
    }
    
    const cartelMembers: number[] = []
    for (let i = 0; i < n; i++) {
      let highSimilarityCount = 0
      for (let j = 0; j < n; j++) {
        if (i !== j && similarity[Math.min(i, j)][Math.max(i, j)] > threshold) {
          highSimilarityCount++
        }
      }
      if (highSimilarityCount >= n * 0.3) {
        cartelMembers.push(i)
      }
    }
    
    return {
      isCartel: cartelMembers.length >= n * 0.3,
      members: cartelMembers
    }
  }
  
  private cosineSimilarity(a: number[], b: number[]): number {
    let dotProduct = 0
    let normA = 0
    let normB = 0
    
    for (let i = 0; i < Math.min(a.length, b.length); i++) {
      dotProduct += a[i] * b[i]
      normA += a[i] * a[i]
      normB += b[i] * b[i]
    }
    
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB))
  }
  
  slash(validatorInfluence: number, slashPercent: number): number {
    return validatorInfluence * (1 - slashPercent)
  }
}

export const kernel = new ProtocolKernel()
