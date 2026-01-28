import { ActiveTimer } from '@/components/ActiveTimer'
import { BlockCard } from '@/components/BlockCard'
import type { TimeBlock, DailyReflection } from '@/lib/types'

interface TodayViewProps {
  blocks: TimeBlock[]
  activeBlock: TimeBlock | undefined
  onStartBlock: (blockId: string) => void
  onPauseBlock: (blockId: string) => void
  onCompleteBlock: (blockId: string, actualDuration: number) => void
  onUpdateBlock: (blockId: string, updates: Partial<TimeBlock>) => void
  onDeleteBlock: (blockId: string) => void
  reflections: DailyReflection[]
  onAddReflection: (reflection: DailyReflection) => void
}

export function TodayView({
  blocks,
  activeBlock,
  onStartBlock,
  onPauseBlock,
  onCompleteBlock,
  onDeleteBlock,
}: TodayViewProps) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const todayBlocks = blocks.filter((block) => {
    if (!block.scheduledFor && block.status === 'scheduled') return true
    if (block.startedAt) {
      const blockDate = new Date(block.startedAt)
      blockDate.setHours(0, 0, 0, 0)
      return blockDate.getTime() === today.getTime()
    }
    return false
  })

  const scheduledBlocks = todayBlocks.filter((b) => b.status === 'scheduled')
  const completedBlocks = todayBlocks.filter((b) => b.status === 'completed')

  const totalMinutes = completedBlocks.reduce((sum, b) => sum + (b.actualDuration || 0), 0)
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60

  return (
    <div className="space-y-6">
      {activeBlock && (
        <ActiveTimer
          block={activeBlock}
          onPause={() => onPauseBlock(activeBlock.id)}
          onComplete={(duration) => onCompleteBlock(activeBlock.id, duration)}
          onDelete={() => onDeleteBlock(activeBlock.id)}
        />
      )}

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-foreground">Today's Schedule</h2>
          {completedBlocks.length > 0 && (
            <p className="text-sm text-muted-foreground">
              {hours > 0 && `${hours}h `}
              {minutes}m focused today
            </p>
          )}
        </div>

        {scheduledBlocks.length === 0 && !activeBlock ? (
          <div className="text-center py-12 bg-muted rounded-lg">
            <p className="text-muted-foreground">No blocks scheduled for today</p>
            <p className="text-sm text-muted-foreground mt-1">Create a new block to get started</p>
          </div>
        ) : (
          <div className="space-y-3">
            {scheduledBlocks.map((block) => (
              <BlockCard
                key={block.id}
                block={block}
                onStart={() => onStartBlock(block.id)}
                onDelete={() => onDeleteBlock(block.id)}
              />
            ))}
          </div>
        )}
      </div>

      {completedBlocks.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-foreground mb-3">Completed</h3>
          <div className="space-y-3">
            {completedBlocks.map((block) => (
              <BlockCard
                key={block.id}
                block={block}
                onStart={() => {}}
                onDelete={() => onDeleteBlock(block.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
