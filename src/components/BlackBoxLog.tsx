import type { BlackBoxEvent } from '@/lib/types'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { formatDistanceToNow } from 'date-fns'

interface BlackBoxLogProps {
  events: BlackBoxEvent[]
}

const eventIcons: Record<BlackBoxEvent['type'], string> = {
  problem: '🔴',
  proposal: '📋',
  validation: '✓',
  prediction: '🎯',
  alert: '⚠️'
}

export function BlackBoxLog({ events }: BlackBoxLogProps) {
  return (
    <Card className="p-4">
      <h3 className="text-sm font-semibold text-foreground mb-3">Black Box Log</h3>
      <p className="text-xs text-muted-foreground mb-4">
        Immutable event ledger with hash chain integrity
      </p>
      
      <ScrollArea className="h-[600px]">
        <div className="space-y-2 pr-4">
          {events.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-8">
              No events recorded yet
            </p>
          ) : (
            events.map((event) => (
              <div
                key={event.id}
                className="p-3 bg-muted/30 rounded border border-border text-xs font-mono"
              >
                <div className="flex items-start gap-2 mb-1">
                  <span>{eventIcons[event.type]}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{event.type.toUpperCase()}</span>
                      <span className="text-muted-foreground">
                        {formatDistanceToNow(new Date(event.timestamp), { addSuffix: true })}
                      </span>
                    </div>
                    <div className="mt-1 text-muted-foreground">
                      <div className="truncate">Hash: {event.hash.slice(0, 16)}...</div>
                      <div className="truncate">Prev: {event.previousHash.slice(0, 16)}...</div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </Card>
  )
}
