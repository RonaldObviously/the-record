import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { ArrowUp, CheckCircle, Circle, Warning } from '@phosphor-icons/react'
import { HIERARCHICAL_THRESHOLDS, checkClusteringThresholds, getClusterMetrics } from '@/lib/hierarchicalClustering'
import type { SignalCluster } from '@/lib/types'

interface HierarchicalClusteringMonitorProps {
  allClusters: SignalCluster[]
  onTriggerClustering: (level: 2 | 3 | 4) => void
}

export function HierarchicalClusteringMonitor({
  allClusters,
  onTriggerClustering,
}: HierarchicalClusteringMonitorProps) {
  const thresholdChecks = checkClusteringThresholds(allClusters)
  const metrics = getClusterMetrics(allClusters)

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-1">Hierarchical Clustering Status</h3>
        <p className="text-sm text-muted-foreground">
          Automatic promotion when thresholds are met
        </p>
      </div>

      <div className="space-y-6">
        <ClusterLevelStatus
          level={1}
          label="L1: Local Clusters"
          count={metrics.l1.count}
          totalWeight={metrics.l1.totalWeight}
          totalSignals={metrics.l1.totalSignals}
          color="bg-blue-500"
        />

        <ClusterPromotionStatus
          fromLevel={1}
          toLevel={2}
          threshold={HIERARCHICAL_THRESHOLDS.L1_TO_L2}
          currentCount={metrics.l1.count}
          currentWeight={metrics.l1.totalWeight}
          currentSignals={metrics.l1.totalSignals}
          ready={thresholdChecks.find(c => c.level === 2)?.ready || false}
          reason={thresholdChecks.find(c => c.level === 2)?.reason || ''}
          onTrigger={() => onTriggerClustering(2)}
        />

        <ClusterLevelStatus
          level={2}
          label="L2: District Clusters"
          count={metrics.l2.count}
          totalWeight={metrics.l2.totalWeight}
          totalSignals={metrics.l2.totalSignals}
          color="bg-green-500"
        />

        <ClusterPromotionStatus
          fromLevel={2}
          toLevel={3}
          threshold={HIERARCHICAL_THRESHOLDS.L2_TO_L3}
          currentCount={metrics.l2.count}
          currentWeight={metrics.l2.totalWeight}
          currentSignals={metrics.l2.totalSignals}
          ready={thresholdChecks.find(c => c.level === 3)?.ready || false}
          reason={thresholdChecks.find(c => c.level === 3)?.reason || ''}
          onTrigger={() => onTriggerClustering(3)}
        />

        <ClusterLevelStatus
          level={3}
          label="L3: Regional Clusters"
          count={metrics.l3.count}
          totalWeight={metrics.l3.totalWeight}
          totalSignals={metrics.l3.totalSignals}
          color="bg-amber-500"
        />

        <ClusterPromotionStatus
          fromLevel={3}
          toLevel={4}
          threshold={HIERARCHICAL_THRESHOLDS.L3_TO_L4}
          currentCount={metrics.l3.count}
          currentWeight={metrics.l3.totalWeight}
          currentSignals={metrics.l3.totalSignals}
          ready={thresholdChecks.find(c => c.level === 4)?.ready || false}
          reason={thresholdChecks.find(c => c.level === 4)?.reason || ''}
          onTrigger={() => onTriggerClustering(4)}
        />

        <ClusterLevelStatus
          level={4}
          label="L4: Global Clusters"
          count={metrics.l4.count}
          totalWeight={metrics.l4.totalWeight}
          totalSignals={metrics.l4.totalSignals}
          color="bg-red-500"
        />
      </div>
    </Card>
  )
}

function ClusterLevelStatus({
  level,
  label,
  count,
  totalWeight,
  totalSignals,
  color,
}: {
  level: number
  label: string
  count: number
  totalWeight: number
  totalSignals: number
  color: string
}) {
  return (
    <div className="flex items-center gap-4">
      <div className={`w-3 h-3 rounded-full ${color}`} />
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-medium">{label}</span>
          <Badge variant="outline" className="font-mono">
            {count} cluster{count !== 1 ? 's' : ''}
          </Badge>
        </div>
        <div className="text-xs text-muted-foreground">
          Weight: {totalWeight} • Signals: {totalSignals}
        </div>
      </div>
    </div>
  )
}

function ClusterPromotionStatus({
  fromLevel,
  toLevel,
  threshold,
  currentCount,
  currentWeight,
  currentSignals,
  ready,
  reason,
  onTrigger,
}: {
  fromLevel: number
  toLevel: number
  threshold: { minChildClusters: number; minTotalWeight: number; minSignals: number; description: string }
  currentCount: number
  currentWeight: number
  currentSignals: number
  ready: boolean
  reason: string
  onTrigger: () => void
}) {
  const clusterProgress = Math.min(100, (currentCount / threshold.minChildClusters) * 100)
  const weightProgress = Math.min(100, (currentWeight / threshold.minTotalWeight) * 100)
  const signalProgress = Math.min(100, (currentSignals / threshold.minSignals) * 100)

  return (
    <div className="ml-4 pl-4 border-l-2 border-dashed border-border py-3">
      <div className="flex items-start gap-3 mb-3">
        <ArrowUp size={16} className={ready ? 'text-success' : 'text-muted-foreground'} />
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium">
              Promotion: L{fromLevel} → L{toLevel}
            </span>
            {ready ? (
              <CheckCircle size={14} className="text-success" weight="fill" />
            ) : (
              <Circle size={14} className="text-muted-foreground" />
            )}
          </div>
          <p className="text-xs text-muted-foreground mb-2">{threshold.description}</p>
        </div>
      </div>

      <div className="space-y-2 ml-5">
        <ProgressBar
          label="Clusters"
          current={currentCount}
          required={threshold.minChildClusters}
          progress={clusterProgress}
        />
        <ProgressBar
          label="Weight"
          current={currentWeight}
          required={threshold.minTotalWeight}
          progress={weightProgress}
        />
        <ProgressBar
          label="Signals"
          current={currentSignals}
          required={threshold.minSignals}
          progress={signalProgress}
        />
      </div>

      <div className="mt-3 ml-5">
        {ready ? (
          <Button size="sm" variant="default" onClick={onTrigger} className="w-full">
            <CheckCircle size={14} className="mr-1.5" />
            Trigger L{toLevel} Clustering
          </Button>
        ) : (
          <div className="flex items-start gap-2 p-2 bg-muted/50 rounded text-xs text-muted-foreground">
            <Warning size={14} className="mt-0.5 flex-shrink-0" />
            <span>{reason}</span>
          </div>
        )}
      </div>
    </div>
  )
}

function ProgressBar({
  label,
  current,
  required,
  progress,
}: {
  label: string
  current: number
  required: number
  progress: number
}) {
  const isComplete = current >= required

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className={`text-xs font-mono ${isComplete ? 'text-success' : 'text-muted-foreground'}`}>
          {current} / {required}
        </span>
      </div>
      <Progress value={progress} className="h-1.5" />
    </div>
  )
}
