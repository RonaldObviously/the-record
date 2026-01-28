import { Card } from '@/components/ui/card'
import type { TimeBlock } from '@/lib/types'

interface WeekViewProps {
  blocks: TimeBlock[]
  onStartBlock: (blockId: string) => void
  onUpdateBlock: (blockId: string, updates: Partial<TimeBlock>) => void
}

export function WeekView({ blocks }: WeekViewProps) {
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const today = new Date()
  const startOfWeek = new Date(today)
  startOfWeek.setDate(today.getDate() - today.getDay())
  startOfWeek.setHours(0, 0, 0, 0)

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(startOfWeek)
    date.setDate(startOfWeek.getDate() + i)
    return date
  })

  const getBlocksForDay = (date: Date) => {
    return blocks.filter((block) => {
      if (!block.startedAt) return false
      const blockDate = new Date(block.startedAt)
      return (
        blockDate.getFullYear() === date.getFullYear() &&
        blockDate.getMonth() === date.getMonth() &&
        blockDate.getDate() === date.getDate()
      )
    })
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">This Week</h2>

      <div className="grid grid-cols-7 gap-2">
        {weekDays.map((date, index) => {
          const dayBlocks = getBlocksForDay(date)
          const isToday = date.toDateString() === today.toDateString()
          const completedBlocks = dayBlocks.filter((b) => b.status === 'completed')
          const totalMinutes = completedBlocks.reduce((sum, b) => sum + (b.actualDuration || 0), 0)

          return (
            <Card
              key={index}
              className={`p-3 ${isToday ? 'border-primary border-2' : ''}`}
            >
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-1">{daysOfWeek[index]}</p>
                <p className={`text-lg font-semibold ${isToday ? 'text-primary' : 'text-foreground'}`}>
                  {date.getDate()}
                </p>
                {totalMinutes > 0 && (
                  <p className="text-xs text-success mt-2">{Math.floor(totalMinutes / 60)}h {totalMinutes % 60}m</p>
                )}
                {dayBlocks.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1 justify-center">
                    {dayBlocks.slice(0, 3).map((block) => (
                      <div
                        key={block.id}
                        className={`w-2 h-2 rounded-full ${
                          block.status === 'completed' ? 'bg-success' : 'bg-muted'
                        }`}
                        title={block.taskName}
                      />
                    ))}
                  </div>
                )}
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
