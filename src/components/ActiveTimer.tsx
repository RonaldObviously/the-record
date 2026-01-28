import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Play, Pause, Stop, Trash } from '@phosphor-icons/react'
import type { TimeBlock } from '@/lib/types'
import { formatTime, getEnergyColor, getStatusColor } from '@/lib/helpers'

interface ActiveTimerProps {
  block: TimeBlock
  onPause: () => void
  onComplete: (actualDuration: number) => void
  onDelete: () => void
}

export function ActiveTimer({ block, onPause, onComplete, onDelete }: ActiveTimerProps) {
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const targetSeconds = block.duration * 60

  useEffect(() => {
    if (block.status !== 'active') return

    const startTime = block.startedAt ? new Date(block.startedAt).getTime() : Date.now()
    
    const interval = setInterval(() => {
      const now = Date.now()
      const elapsed = Math.floor((now - startTime) / 1000)
      setElapsedSeconds(elapsed)
    }, 100)

    return () => clearInterval(interval)
  }, [block.status, block.startedAt])

  const remainingSeconds = targetSeconds - elapsedSeconds
  const isOvertime = remainingSeconds < 0

  return (
    <Card className={`p-8 ${isOvertime ? 'border-accent border-2' : 'border-focus border-2'}`}>
      <div className="text-center space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-foreground mb-2">{block.taskName}</h2>
          <Badge className={getEnergyColor(block.energyLevel)}>{block.energyLevel} energy</Badge>
        </div>

        <div className="font-mono text-7xl font-bold text-foreground tabular-nums">
          {formatTime(remainingSeconds)}
        </div>

        {isOvertime && (
          <p className="text-accent text-sm font-medium">Overtime - Consider wrapping up</p>
        )}

        <div className="flex justify-center gap-3">
          {block.status === 'active' && (
            <Button variant="outline" size="lg" onClick={onPause}>
              <Pause size={20} className="mr-2" />
              Pause
            </Button>
          )}
          
          <Button 
            size="lg" 
            onClick={() => onComplete(Math.floor(elapsedSeconds / 60))}
            className="bg-success text-success-foreground hover:bg-success/90"
          >
            <Stop size={20} className="mr-2" />
            Complete
          </Button>

          <Button variant="destructive" size="lg" onClick={onDelete}>
            <Trash size={20} />
          </Button>
        </div>

        {block.notes && (
          <div className="text-left pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground">{block.notes}</p>
          </div>
        )}
      </div>
    </Card>
  )
}
