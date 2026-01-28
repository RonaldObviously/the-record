import type { MetaAlert } from '@/lib/types'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Warning, WarningCircle, Info } from '@phosphor-icons/react'
import { formatDistanceToNow } from 'date-fns'

interface MetaAlertPanelProps {
  alerts: MetaAlert[]
}

const severityConfig = {
  critical: { icon: Warning, color: 'text-red-600', bg: 'bg-red-500/10' },
  high: { icon: WarningCircle, color: 'text-orange-600', bg: 'bg-orange-500/10' },
  medium: { icon: WarningCircle, color: 'text-yellow-600', bg: 'bg-yellow-500/10' },
  low: { icon: Info, color: 'text-blue-600', bg: 'bg-blue-500/10' }
}

export function MetaAlertPanel({ alerts }: MetaAlertPanelProps) {
  if (alerts.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No meta-layer alerts</p>
        <p className="text-sm mt-2">System operating normally</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {alerts.map((alert) => {
        const config = severityConfig[alert.severity]
        const Icon = config.icon

        return (
          <Card key={alert.id} className={`p-4 border-l-4 ${config.bg}`}>
            <div className="flex items-start gap-3">
              <Icon size={20} className={`${config.color} mt-0.5`} />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-foreground">{alert.type}</span>
                  <Badge variant="outline" className="text-xs">
                    {alert.severity}
                  </Badge>
                </div>
                <p className="text-sm text-foreground mb-2">{alert.message}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>
                    {formatDistanceToNow(new Date(alert.timestamp), { addSuffix: true })}
                  </span>
                  <span>
                    {alert.affectedBubbles.length} bubble{alert.affectedBubbles.length !== 1 ? 's' : ''} affected
                  </span>
                </div>
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
