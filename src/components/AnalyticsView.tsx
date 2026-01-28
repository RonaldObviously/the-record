import { useMemo } from 'react'
import { Card } from '@/components/ui/card'
import type { TimeBlock, DailyReflection } from '@/lib/types'
import { getDayOfWeek, getHourOfDay } from '@/lib/helpers'

interface AnalyticsViewProps {
  blocks: TimeBlock[]
  reflections: DailyReflection[]
}

export function AnalyticsView({ blocks }: AnalyticsViewProps) {
  const completedBlocks = blocks.filter((b) => b.status === 'completed')

  const energyMap = useMemo(() => {
    const map: { [key: string]: { minutes: number; count: number } } = {}

    completedBlocks.forEach((block) => {
      if (!block.startedAt) return
      const date = new Date(block.startedAt)
      const dayOfWeek = getDayOfWeek(date)
      const hour = getHourOfDay(date)
      const key = `${dayOfWeek}-${hour}`

      if (!map[key]) {
        map[key] = { minutes: 0, count: 0 }
      }

      map[key].minutes += block.actualDuration || block.duration
      map[key].count += 1
    })

    return map
  }, [completedBlocks])

  const totalMinutes = completedBlocks.reduce((sum, b) => sum + (b.actualDuration || 0), 0)
  const totalHours = Math.floor(totalMinutes / 60)
  const avgBlockDuration =
    completedBlocks.length > 0
      ? Math.round(completedBlocks.reduce((sum, b) => sum + (b.actualDuration || 0), 0) / completedBlocks.length)
      : 0

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const hours = Array.from({ length: 12 }, (_, i) => i + 8)

  const getIntensity = (dayOfWeek: number, hour: number) => {
    const key = `${dayOfWeek}-${hour}`
    const data = energyMap[key]
    if (!data) return 0

    const maxMinutes = Math.max(...Object.values(energyMap).map((v) => v.minutes))
    return data.minutes / maxMinutes
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">Analytics</h2>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Total Focus Time</p>
            <p className="text-2xl font-bold text-foreground mt-1">{totalHours}h</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Blocks Completed</p>
            <p className="text-2xl font-bold text-foreground mt-1">{completedBlocks.length}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Avg Block Duration</p>
            <p className="text-2xl font-bold text-foreground mt-1">{avgBlockDuration}m</p>
          </Card>
        </div>
      </div>

      {completedBlocks.length > 5 ? (
        <div>
          <h3 className="text-lg font-medium text-foreground mb-3">Energy Heatmap</h3>
          <Card className="p-4">
            <div className="space-y-1">
              <div className="flex gap-1 items-end">
                <div className="w-12" />
                {daysOfWeek.map((day) => (
                  <div key={day} className="flex-1 text-center text-xs text-muted-foreground">
                    {day}
                  </div>
                ))}
              </div>

              {hours.map((hour) => (
                <div key={hour} className="flex gap-1 items-center">
                  <div className="w-12 text-xs text-muted-foreground text-right pr-2">
                    {hour}:00
                  </div>
                  {daysOfWeek.map((_, dayIndex) => {
                    const intensity = getIntensity(dayIndex, hour)
                    return (
                      <div
                        key={dayIndex}
                        className="flex-1 h-6 rounded"
                        style={{
                          backgroundColor:
                            intensity > 0
                              ? `oklch(${0.45 + intensity * 0.2} ${intensity * 0.12} 265 / ${
                                  intensity * 0.8
                                })`
                              : 'oklch(0.95 0.01 75)',
                        }}
                        title={
                          energyMap[`${dayIndex}-${hour}`]
                            ? `${energyMap[`${dayIndex}-${hour}`].minutes}m`
                            : 'No data'
                        }
                      />
                    )
                  })}
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              Darker colors indicate more focus time during that hour
            </p>
          </Card>
        </div>
      ) : (
        <Card className="p-8">
          <div className="text-center text-muted-foreground">
            <p>Complete more blocks to see your energy patterns</p>
            <p className="text-sm mt-1">Insights will appear after 5+ completed blocks</p>
          </div>
        </Card>
      )}
    </div>
  )
}
