export type EnergyLevel = 'high' | 'medium' | 'low'

export type BlockStatus = 'scheduled' | 'active' | 'paused' | 'completed' | 'missed'

export interface TimeBlock {
  id: string
  taskName: string
  duration: number
  energyLevel: EnergyLevel
  status: BlockStatus
  scheduledFor?: Date
  startedAt?: Date
  completedAt?: Date
  actualDuration?: number
  interruptions: Interruption[]
  notes?: string
}

export interface Interruption {
  id: string
  timestamp: Date
  reason: string
  duration: number
}

export interface Task {
  id: string
  title: string
  estimatedMinutes?: number
  createdAt: Date
  scheduledBlockId?: string
  completed: boolean
}

export interface DailyReflection {
  id: string
  date: Date
  whatWorked: string
  whatDidnt: string
  tomorrowFocus: string
}

export interface EnergyData {
  dayOfWeek: number
  hour: number
  completedMinutes: number
  blocksCompleted: number
}
