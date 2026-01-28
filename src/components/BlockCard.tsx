import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Play, Trash } from '@phosphor-icons/react'
import type { TimeBlock } from '@/lib/types'
import { formatDuration, getEnergyColor, getStatusColor } from '@/lib/helpers'

interface BlockCardProps {
  block: TimeBlock
  onStart: () => void
  onDelete: () => void
}

export function BlockCard({ block, onStart, onDelete }: BlockCardProps) {
  return (
    <Card className={`p-4 ${getStatusColor(block.status)}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-foreground truncate">{block.taskName}</h3>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline" className={getEnergyColor(block.energyLevel)}>
              {block.energyLevel}
            </Badge>
            <span className="text-sm text-muted-foreground">{formatDuration(block.duration)}</span>
            {block.status === 'completed' && block.actualDuration && (
              <span className="text-sm text-success">✓ {formatDuration(block.actualDuration)}</span>
            )}
          </div>
        </div>

        <div className="flex gap-2 ml-4">
          {block.status === 'scheduled' && (
            <Button size="sm" onClick={onStart}>
              <Play size={16} />
            </Button>
          )}
          {block.status !== 'active' && (
            <Button size="sm" variant="ghost" onClick={onDelete}>
              <Trash size={16} />
            </Button>
          )}
        </div>
      </div>

      {block.notes && <p className="text-sm text-muted-foreground mt-3">{block.notes}</p>}
    </Card>
  )
}
