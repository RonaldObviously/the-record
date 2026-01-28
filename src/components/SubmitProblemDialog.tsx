import { useState } from 'react'
import type { Problem, ProblemCategory } from '@/lib/types'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface SubmitProblemDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  bubbleId: string
  onSubmit: (problem: Problem) => void
}

const categories: ProblemCategory[] = [
  'education',
  'healthcare',
  'infrastructure',
  'climate',
  'safety',
  'energy',
  'housing',
  'economy',
  'other'
]

export function SubmitProblemDialog({ open, onOpenChange, bubbleId, onSubmit }: SubmitProblemDialogProps) {
  const [category, setCategory] = useState<ProblemCategory>('other')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState('5')

  const handleSubmit = () => {
    if (!description.trim()) return

    const problem: Problem = {
      id: `problem-${Date.now()}`,
      bubbleId,
      category,
      description: description.trim(),
      priority: parseInt(priority),
      submittedAt: new Date(),
      anonymous: true,
      attestations: 1
    }

    onSubmit(problem)
    setDescription('')
    setCategory('other')
    setPriority('5')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Report Problem (L1 - Anonymous)</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={(v) => setCategory(v as ProblemCategory)}>
              <SelectTrigger id="category">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the problem..."
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="priority">Priority (1-10)</Label>
            <Select value={priority} onValueChange={setPriority}>
              <SelectTrigger id="priority">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                  <SelectItem key={num} value={String(num)}>
                    {num}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={!description.trim()}>
              Submit Anonymously
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
