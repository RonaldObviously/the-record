import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import type { TimeBlock, Task, EnergyLevel } from '@/lib/types'
import { generateId } from '@/lib/helpers'

interface CreateBlockDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreateBlock: (block: TimeBlock) => void
  tasks: Task[]
}

export function CreateBlockDialog({ open, onOpenChange, onCreateBlock, tasks }: CreateBlockDialogProps) {
  const [taskName, setTaskName] = useState('')
  const [duration, setDuration] = useState('60')
  const [energyLevel, setEnergyLevel] = useState<EnergyLevel>('medium')
  const [notes, setNotes] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!taskName.trim() || !duration) return

    const newBlock: TimeBlock = {
      id: generateId(),
      taskName: taskName.trim(),
      duration: parseInt(duration),
      energyLevel,
      status: 'scheduled',
      interruptions: [],
      notes: notes.trim() || undefined,
    }

    onCreateBlock(newBlock)
    setTaskName('')
    setDuration('60')
    setEnergyLevel('medium')
    setNotes('')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Focus Block</DialogTitle>
          <DialogDescription>Set up a time block for focused work.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="task-name">Task Name</Label>
            <Input
              id="task-name"
              placeholder="What will you focus on?"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger id="duration">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 min</SelectItem>
                  <SelectItem value="25">25 min</SelectItem>
                  <SelectItem value="30">30 min</SelectItem>
                  <SelectItem value="45">45 min</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                  <SelectItem value="90">1.5 hours</SelectItem>
                  <SelectItem value="120">2 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="energy">Energy Level</Label>
              <Select value={energyLevel} onValueChange={(v) => setEnergyLevel(v as EnergyLevel)}>
                <SelectTrigger id="energy">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              placeholder="Any additional context or goals..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Block</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
