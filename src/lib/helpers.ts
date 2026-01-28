export function formatTime(seconds: number): string {
  const mins = Math.floor(Math.abs(seconds) / 60)
  const secs = Math.abs(seconds) % 60
  const sign = seconds < 0 ? '-' : ''
  return `${sign}${mins}:${secs.toString().padStart(2, '0')}`
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}m`
  }
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
}

export function getEnergyColor(level: 'high' | 'medium' | 'low'): string {
  switch (level) {
    case 'high':
      return 'bg-high-energy text-high-energy-foreground'
    case 'medium':
      return 'bg-accent text-accent-foreground'
    case 'low':
      return 'bg-low-energy text-low-energy-foreground'
  }
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'active':
      return 'bg-focus text-focus-foreground'
    case 'paused':
      return 'border-accent border-2 bg-background'
    case 'completed':
      return 'bg-success text-success-foreground'
    case 'missed':
      return 'bg-muted text-muted-foreground'
    default:
      return 'border border-border bg-background'
  }
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

export function getDayOfWeek(date: Date): number {
  return date.getDay()
}

export function getHourOfDay(date: Date): number {
  return date.getHours()
}
