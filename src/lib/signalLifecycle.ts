import type { Signal, SignalCluster, Problem, ProblemCategory } from './types'
import { coordinatesToH3, getNeighborCells } from './h3Service'

const CLUSTER_THRESHOLD = 3
const CLUSTER_RADIUS_METERS = 500
const SEMANTIC_SIMILARITY_THRESHOLD = 0.7

export interface ClusteringResult {
  clusters: SignalCluster[]
  unclustered: Signal[]
}

export function clusterSignals(signals: Signal[]): ClusteringResult {
  const clusters: SignalCluster[] = []
  const unclustered: Signal[] = []
  const processed = new Set<string>()

  for (const signal of signals) {
    if (processed.has(signal.id)) continue

    const nearbySignals = signals.filter(s => 
      !processed.has(s.id) &&
      s.h3Cell === signal.h3Cell &&
      s.category === signal.category &&
      s.status === 'raw'
    )

    if (nearbySignals.length >= CLUSTER_THRESHOLD) {
      const cluster: SignalCluster = {
        id: `cluster-${signal.h3Cell}-${Date.now()}`,
        h3Cell: signal.h3Cell,
        signals: nearbySignals,
        semanticSummary: generateSummary(nearbySignals),
        category: signal.category,
        weight: nearbySignals.reduce((sum, s) => sum + s.attestations + 1, 0),
        status: nearbySignals.length >= CLUSTER_THRESHOLD * 2 ? 'mature' : 'forming',
        createdAt: new Date(),
        level: 1,
      }
      
      clusters.push(cluster)
      nearbySignals.forEach(s => processed.add(s.id))
    } else {
      unclustered.push(signal)
    }
  }

  return { clusters, unclustered }
}

export function promoteClusterToProblem(cluster: SignalCluster): Problem {
  const avgAttestations = cluster.signals.reduce((sum, s) => sum + s.attestations, 0) / cluster.signals.length
  
  return {
    id: `problem-${cluster.id}`,
    bubbleId: cluster.signals[0]?.bubbleId || '',
    h3Cell: cluster.h3Cell,
    category: cluster.category,
    description: cluster.semanticSummary,
    priority: Math.min(10, Math.floor(cluster.weight / 10)),
    submittedAt: cluster.createdAt,
    anonymous: true,
    attestations: Math.floor(avgAttestations),
    clusterId: cluster.id,
  }
}

export function attestSignal(signal: Signal): Signal {
  return {
    ...signal,
    attestations: signal.attestations + 1,
    influence: signal.influence + 5,
  }
}

export function transitionSignalStatus(
  signal: Signal,
  newStatus: Signal['status']
): Signal {
  return {
    ...signal,
    status: newStatus,
  }
}

function generateSummary(signals: Signal[]): string {
  const descriptions = signals.map(s => s.description)
  const commonWords = findCommonTerms(descriptions)
  
  if (commonWords.length > 0) {
    return `Multiple reports of ${commonWords.join(', ')} in area`
  }
  
  return signals[0]?.description || 'Clustered issue'
}

function findCommonTerms(descriptions: string[]): string[] {
  const wordCounts = new Map<string, number>()
  const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'is', 'are', 'was', 'were'])
  
  descriptions.forEach(desc => {
    const words = desc.toLowerCase().split(/\s+/)
    words.forEach(word => {
      const cleaned = word.replace(/[^a-z]/g, '')
      if (cleaned.length > 3 && !stopWords.has(cleaned)) {
        wordCounts.set(cleaned, (wordCounts.get(cleaned) || 0) + 1)
      }
    })
  })

  return Array.from(wordCounts.entries())
    .filter(([_, count]) => count >= Math.ceil(descriptions.length * 0.5))
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([word]) => word)
}

export function calculateClusterGravity(cluster: SignalCluster): number {
  const signalCount = cluster.signals.length
  const totalAttestations = cluster.signals.reduce((sum, s) => sum + s.attestations, 0)
  const avgInfluence = cluster.signals.reduce((sum, s) => sum + s.influence, 0) / signalCount
  
  return signalCount * 10 + totalAttestations * 5 + avgInfluence * 0.1
}

export function shouldPromoteCluster(cluster: SignalCluster): boolean {
  const gravity = calculateClusterGravity(cluster)
  const hasEnoughSignals = cluster.signals.length >= CLUSTER_THRESHOLD * 2
  const hasHighWeight = cluster.weight >= 50
  
  return gravity >= 100 || (hasEnoughSignals && hasHighWeight)
}

export function clusterClusters(clusters: SignalCluster[], level: 2 | 3 | 4): SignalCluster[] {
  const parentClusters: SignalCluster[] = []
  const processed = new Set<string>()

  const thresholds = {
    2: { minChildren: 3, minWeight: 50 },
    3: { minChildren: 5, minWeight: 200 },
    4: { minChildren: 3, minWeight: 1000 },
  }

  const threshold = thresholds[level]

  for (const cluster of clusters) {
    if (processed.has(cluster.id)) continue
    if (cluster.level !== level - 1) continue

    const relatedClusters = clusters.filter(c => 
      !processed.has(c.id) &&
      c.level === level - 1 &&
      c.category === cluster.category &&
      areNeighboringClusters(cluster, c)
    )

    if (relatedClusters.length >= threshold.minChildren) {
      const totalWeight = relatedClusters.reduce((sum, c) => sum + c.weight, 0)
      
      if (totalWeight >= threshold.minWeight) {
        const parentCluster: SignalCluster = {
          id: `L${level}-cluster-${Date.now()}`,
          h3Cell: cluster.h3Cell,
          signals: relatedClusters.flatMap(c => c.signals),
          semanticSummary: generateClusterSummary(relatedClusters),
          category: cluster.category,
          weight: totalWeight,
          status: 'priority',
          createdAt: new Date(),
          level,
          childClusterIds: relatedClusters.map(c => c.id),
        }
        
        parentClusters.push(parentCluster)
        relatedClusters.forEach(c => processed.add(c.id))
      }
    }
  }

  return parentClusters
}

function areNeighboringClusters(cluster1: SignalCluster, cluster2: SignalCluster): boolean {
  const neighbors = getNeighborCells(cluster1.h3Cell)
  return neighbors.includes(cluster2.h3Cell) || cluster1.h3Cell === cluster2.h3Cell
}

function generateClusterSummary(clusters: SignalCluster[]): string {
  const summaries = clusters.map(c => c.semanticSummary)
  const commonTerms = findCommonTerms(summaries)
  
  if (commonTerms.length > 0) {
    return `Regional pattern: ${commonTerms.join(', ')} affecting ${clusters.length} areas`
  }
  
  return `${clusters[0]?.category || 'Issue'} affecting ${clusters.length} neighboring areas`
}
