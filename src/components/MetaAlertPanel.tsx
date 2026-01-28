import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { WarningDiamond, XCircle } from '@phosphor-icons/react'
import type { MetaAlert } from '@/lib/types'

interface MetaAlertPanelProps {
  alerts: MetaAlert[]
}

export function MetaAlertPanel({ alerts }: MetaAlertPanelProps) {
  const criticalAlerts = alerts.filter(a => a.severity === 'critical' || a.severity === 'high')
  
  if (criticalAlerts.length === 0) return null

  return (
    <div className="mb-6 space-y-3">
      {criticalAlerts.slice(0, 3).map(alert => (
        <Alert 
          key={alert.id}
          className={`border-l-4 ${
            alert.severity === 'critical' 
              ? 'border-l-destructive bg-destructive/10' 
              : 'border-l-warning bg-warning/10'
          }`}
        >
          <div className="flex items-start gap-3">
            {alert.severity === 'critical' ? (
              <XCircle size={20} weight="fill" className="text-destructive mt-0.5" />
            ) : (
              <WarningDiamond size={20} weight="fill" className="text-warning mt-0.5" />
            )}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant={alert.severity === 'critical' ? 'destructive' : 'outline'} className="uppercase text-xs">
                  L4 Meta-Layer
                </Badge>
                <span className="text-xs font-mono text-muted-foreground">
                  {new Date(alert.timestamp).toLocaleString()}
                </span>
              </div>
              <AlertDescription className="text-sm">
                {alert.message}
              </AlertDescription>
            </div>
          </div>
        </Alert>
      ))}
    </div>
  )
}
