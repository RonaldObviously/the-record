import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowDown, Circle } from '@phosphor-icons/react'
import { HIERARCHICAL_THRESHOLDS } from '@/lib/hierarchicalClustering'

export function HierarchicalClusteringDiagram() {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Hierarchical Clustering Architecture</h3>
      <p className="text-sm text-muted-foreground mb-6">
        Signals automatically cluster and promote across 4 levels as the network grows
      </p>

      <div className="space-y-8">
        <ClusterLevel
          level={1}
          title="L1: Local Clusters"
          description="Individual signals within same H3 cell (~500m radius)"
          threshold={{
            signals: '3+ signals',
            weight: '30+ combined attestations',
          }}
          color="bg-blue-500"
          example="3 people report 'Pothole on Main St'"
        />

        <PromotionArrow
          from={1}
          to={2}
          threshold={HIERARCHICAL_THRESHOLDS.L1_TO_L2}
          description="When enough local clusters exist in neighboring areas"
        />

        <ClusterLevel
          level={2}
          title="L2: District Clusters"
          description="Multiple L1 clusters from neighboring H3 cells"
          threshold={{
            signals: `${HIERARCHICAL_THRESHOLDS.L1_TO_L2.minChildClusters}+ L1 clusters`,
            weight: `${HIERARCHICAL_THRESHOLDS.L1_TO_L2.minTotalWeight}+ total weight`,
          }}
          color="bg-green-500"
          example="9 potholes across downtown area → District road maintenance issue"
        />

        <PromotionArrow
          from={2}
          to={3}
          threshold={HIERARCHICAL_THRESHOLDS.L2_TO_L3}
          description="When districts across a region share the same category"
        />

        <ClusterLevel
          level={3}
          title="L3: Regional Clusters"
          description="Multiple L2 district clusters affecting broader geography"
          threshold={{
            signals: `${HIERARCHICAL_THRESHOLDS.L2_TO_L3.minChildClusters}+ L2 clusters`,
            weight: `${HIERARCHICAL_THRESHOLDS.L2_TO_L3.minTotalWeight}+ total weight`,
          }}
          color="bg-amber-500"
          example="Infrastructure failure pattern across 5 city districts → Regional infrastructure crisis"
        />

        <PromotionArrow
          from={3}
          to={4}
          threshold={HIERARCHICAL_THRESHOLDS.L3_TO_L4}
          description="When multiple regions detect the same systemic pattern"
        />

        <ClusterLevel
          level={4}
          title="L4: Global Clusters"
          description="Multiple L3 regional clusters indicating systemic issue"
          threshold={{
            signals: `${HIERARCHICAL_THRESHOLDS.L3_TO_L4.minChildClusters}+ L3 clusters`,
            weight: `${HIERARCHICAL_THRESHOLDS.L3_TO_L4.minTotalWeight}+ total weight`,
          }}
          color="bg-red-500"
          example="Infrastructure decay patterns across 3+ regions → National infrastructure emergency"
        />
      </div>

      <div className="mt-8 p-4 bg-muted/50 rounded-lg">
        <h4 className="text-sm font-semibold mb-2">Key Properties</h4>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li>• Clustering is <strong>automatic</strong> - no manual intervention required</li>
          <li>• Thresholds are <strong>deterministic</strong> - same inputs always produce same outputs</li>
          <li>• Higher levels require <strong>exponentially more evidence</strong></li>
          <li>• Each level preserves <strong>complete audit trail</strong> to source signals</li>
          <li>• Geographic proximity matters - clusters must be <strong>neighboring H3 cells</strong></li>
        </ul>
      </div>
    </Card>
  )
}

function ClusterLevel({
  level,
  title,
  description,
  threshold,
  color,
  example,
}: {
  level: number
  title: string
  description: string
  threshold: { signals: string; weight: string }
  color: string
  example: string
}) {
  return (
    <div className="relative">
      <div className="flex items-start gap-4">
        <div className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center text-white font-bold flex-shrink-0`}>
          L{level}
        </div>
        <div className="flex-1">
          <h4 className="font-semibold mb-1">{title}</h4>
          <p className="text-sm text-muted-foreground mb-3">{description}</p>
          
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="flex items-center gap-2">
              <Circle size={8} className={color.replace('bg-', 'text-')} weight="fill" />
              <span className="text-xs text-muted-foreground">{threshold.signals}</span>
            </div>
            <div className="flex items-center gap-2">
              <Circle size={8} className={color.replace('bg-', 'text-')} weight="fill" />
              <span className="text-xs text-muted-foreground">{threshold.weight}</span>
            </div>
          </div>

          <div className="p-3 bg-card border border-border rounded text-xs">
            <span className="text-muted-foreground">Example:</span>{' '}
            <span>{example}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function PromotionArrow({
  from,
  to,
  threshold,
  description,
}: {
  from: number
  to: number
  threshold: { minChildClusters: number; minTotalWeight: number; minSignals: number; description: string }
  description: string
}) {
  return (
    <div className="flex items-center gap-3 pl-6">
      <div className="flex flex-col items-center">
        <ArrowDown size={20} className="text-muted-foreground" weight="bold" />
        <div className="h-8 w-px bg-border" />
      </div>
      <div className="flex-1 py-2">
        <div className="flex items-center gap-2 mb-1">
          <Badge variant="outline" className="text-xs">
            Promotion Threshold
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground mb-2">{description}</p>
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="text-xs font-mono">
            {threshold.minChildClusters}+ clusters
          </Badge>
          <Badge variant="secondary" className="text-xs font-mono">
            {threshold.minTotalWeight}+ weight
          </Badge>
          <Badge variant="secondary" className="text-xs font-mono">
            {threshold.minSignals}+ signals
          </Badge>
        </div>
      </div>
    </div>
  )
}
