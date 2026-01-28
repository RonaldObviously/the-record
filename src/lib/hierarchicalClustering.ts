import type { SignalCluster, Signal } from './types'
import { clusterClusters } from './signalLifecycle'

export interface HierarchicalClusteringResult {
  l1Clusters: SignalCluster[]
  l2Clusters: SignalCluster[]
  l3Clusters: SignalCluster[]
  l4Clusters: SignalCluster[]
  promotionEvents: ClusterPromotionEvent[]
}

export interface ClusterPromotionEvent {
  id: string
  fromLevel: 1 | 2 | 3
  toLevel: 2 | 3 | 4
  clusterId: string
  childClusterIds: string[]
  timestamp: Date
  reason: string
  weight: number
}

export const HIERARCHICAL_THRESHOLDS = {
  L1_TO_L2: {
    minChildClusters: 3,
    minTotalWeight: 50,
    minSignals: 9,
    description: 'Local to District',
  },
  L2_TO_L3: {
    minChildClusters: 5,
    minTotalWeight: 200,
    minSignals: 45,
    description: 'District to Regional',
  },
  L3_TO_L4: {
    minChildClusters: 3,
    minTotalWeight: 1000,
    minSignals: 135,
    description: 'Regional to Global',
  },
} as const

export function processHierarchicalClustering(
  allClusters: SignalCluster[]
): HierarchicalClusteringResult {
  const promotionEvents: ClusterPromotionEvent[] = []
  
  const l1Clusters = allClusters.filter(c => c.level === 1)
  
  const l2Clusters = clusterClusters(l1Clusters, 2)
  if (l2Clusters.length > 0) {
    l2Clusters.forEach(cluster => {
      promotionEvents.push({
        id: `promotion-${cluster.id}`,
        fromLevel: 1,
        toLevel: 2,
        clusterId: cluster.id,
        childClusterIds: cluster.childClusterIds || [],
        timestamp: new Date(),
        reason: `${cluster.childClusterIds?.length || 0} L1 clusters merged with weight ${cluster.weight}`,
        weight: cluster.weight,
      })
    })
  }

  const allL2Clusters = [...allClusters.filter(c => c.level === 2), ...l2Clusters]
  const l3Clusters = clusterClusters(allL2Clusters, 3)
  if (l3Clusters.length > 0) {
    l3Clusters.forEach(cluster => {
      promotionEvents.push({
        id: `promotion-${cluster.id}`,
        fromLevel: 2,
        toLevel: 3,
        clusterId: cluster.id,
        childClusterIds: cluster.childClusterIds || [],
        timestamp: new Date(),
        reason: `${cluster.childClusterIds?.length || 0} L2 clusters merged with weight ${cluster.weight}`,
        weight: cluster.weight,
      })
    })
  }

  const allL3Clusters = [...allClusters.filter(c => c.level === 3), ...l3Clusters]
  const l4Clusters = clusterClusters(allL3Clusters, 4)
  if (l4Clusters.length > 0) {
    l4Clusters.forEach(cluster => {
      promotionEvents.push({
        id: `promotion-${cluster.id}`,
        fromLevel: 3,
        toLevel: 4,
        clusterId: cluster.id,
        childClusterIds: cluster.childClusterIds || [],
        timestamp: new Date(),
        reason: `${cluster.childClusterIds?.length || 0} L3 clusters merged with weight ${cluster.weight}`,
        weight: cluster.weight,
      })
    })
  }

  return {
    l1Clusters,
    l2Clusters,
    l3Clusters,
    l4Clusters,
    promotionEvents,
  }
}

export function checkClusteringThresholds(clusters: SignalCluster[]): {
  level: 2 | 3 | 4
  ready: boolean
  reason: string
}[] {
  const results: { level: 2 | 3 | 4; ready: boolean; reason: string }[] = []

  const l1Count = clusters.filter(c => c.level === 1).length
  const l1TotalWeight = clusters.filter(c => c.level === 1).reduce((sum, c) => sum + c.weight, 0)
  const l1TotalSignals = clusters.filter(c => c.level === 1).reduce((sum, c) => sum + c.signals.length, 0)

  if (
    l1Count >= HIERARCHICAL_THRESHOLDS.L1_TO_L2.minChildClusters &&
    l1TotalWeight >= HIERARCHICAL_THRESHOLDS.L1_TO_L2.minTotalWeight &&
    l1TotalSignals >= HIERARCHICAL_THRESHOLDS.L1_TO_L2.minSignals
  ) {
    results.push({
      level: 2,
      ready: true,
      reason: `${l1Count} L1 clusters with ${l1TotalWeight} total weight ready for L2 promotion`,
    })
  } else {
    results.push({
      level: 2,
      ready: false,
      reason: `Need ${HIERARCHICAL_THRESHOLDS.L1_TO_L2.minChildClusters - l1Count} more L1 clusters (have ${l1Count})`,
    })
  }

  const l2Count = clusters.filter(c => c.level === 2).length
  const l2TotalWeight = clusters.filter(c => c.level === 2).reduce((sum, c) => sum + c.weight, 0)
  const l2TotalSignals = clusters.filter(c => c.level === 2).reduce((sum, c) => sum + c.signals.length, 0)

  if (
    l2Count >= HIERARCHICAL_THRESHOLDS.L2_TO_L3.minChildClusters &&
    l2TotalWeight >= HIERARCHICAL_THRESHOLDS.L2_TO_L3.minTotalWeight &&
    l2TotalSignals >= HIERARCHICAL_THRESHOLDS.L2_TO_L3.minSignals
  ) {
    results.push({
      level: 3,
      ready: true,
      reason: `${l2Count} L2 clusters with ${l2TotalWeight} total weight ready for L3 promotion`,
    })
  } else {
    results.push({
      level: 3,
      ready: false,
      reason: `Need ${HIERARCHICAL_THRESHOLDS.L2_TO_L3.minChildClusters - l2Count} more L2 clusters (have ${l2Count})`,
    })
  }

  const l3Count = clusters.filter(c => c.level === 3).length
  const l3TotalWeight = clusters.filter(c => c.level === 3).reduce((sum, c) => sum + c.weight, 0)
  const l3TotalSignals = clusters.filter(c => c.level === 3).reduce((sum, c) => sum + c.signals.length, 0)

  if (
    l3Count >= HIERARCHICAL_THRESHOLDS.L3_TO_L4.minChildClusters &&
    l3TotalWeight >= HIERARCHICAL_THRESHOLDS.L3_TO_L4.minTotalWeight &&
    l3TotalSignals >= HIERARCHICAL_THRESHOLDS.L3_TO_L4.minSignals
  ) {
    results.push({
      level: 4,
      ready: true,
      reason: `${l3Count} L3 clusters with ${l3TotalWeight} total weight ready for L4 promotion`,
    })
  } else {
    results.push({
      level: 4,
      ready: false,
      reason: `Need ${HIERARCHICAL_THRESHOLDS.L3_TO_L4.minChildClusters - l3Count} more L3 clusters (have ${l3Count})`,
    })
  }

  return results
}

export function getClusterMetrics(clusters: SignalCluster[]): {
  l1: { count: number; totalWeight: number; totalSignals: number }
  l2: { count: number; totalWeight: number; totalSignals: number }
  l3: { count: number; totalWeight: number; totalSignals: number }
  l4: { count: number; totalWeight: number; totalSignals: number }
  readyForPromotion: boolean[]
} {
  const byLevel = {
    l1: clusters.filter(c => c.level === 1),
    l2: clusters.filter(c => c.level === 2),
    l3: clusters.filter(c => c.level === 3),
    l4: clusters.filter(c => c.level === 4),
  }

  const l1Metrics = {
    count: byLevel.l1.length,
    totalWeight: byLevel.l1.reduce((sum, c) => sum + c.weight, 0),
    totalSignals: byLevel.l1.reduce((sum, c) => sum + c.signals.length, 0),
  }

  const l2Metrics = {
    count: byLevel.l2.length,
    totalWeight: byLevel.l2.reduce((sum, c) => sum + c.weight, 0),
    totalSignals: byLevel.l2.reduce((sum, c) => sum + c.signals.length, 0),
  }

  const l3Metrics = {
    count: byLevel.l3.length,
    totalWeight: byLevel.l3.reduce((sum, c) => sum + c.weight, 0),
    totalSignals: byLevel.l3.reduce((sum, c) => sum + c.signals.length, 0),
  }

  const l4Metrics = {
    count: byLevel.l4.length,
    totalWeight: byLevel.l4.reduce((sum, c) => sum + c.weight, 0),
    totalSignals: byLevel.l4.reduce((sum, c) => sum + c.signals.length, 0),
  }

  return {
    l1: l1Metrics,
    l2: l2Metrics,
    l3: l3Metrics,
    l4: l4Metrics,
    readyForPromotion: [
      l1Metrics.count >= HIERARCHICAL_THRESHOLDS.L1_TO_L2.minChildClusters &&
        l1Metrics.totalWeight >= HIERARCHICAL_THRESHOLDS.L1_TO_L2.minTotalWeight,
      l2Metrics.count >= HIERARCHICAL_THRESHOLDS.L2_TO_L3.minChildClusters &&
        l2Metrics.totalWeight >= HIERARCHICAL_THRESHOLDS.L2_TO_L3.minTotalWeight,
      l3Metrics.count >= HIERARCHICAL_THRESHOLDS.L3_TO_L4.minChildClusters &&
        l3Metrics.totalWeight >= HIERARCHICAL_THRESHOLDS.L3_TO_L4.minTotalWeight,
    ],
  }
}
