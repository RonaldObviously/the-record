import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import type { Problem } from '@/lib/types'

interface SubmitProblemDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  bubbleId: string
}

const categories = [
  'Infrastructure',
  'Education',
  'Healthcare',
  'Safety',
  'Budget',
  'Staffing',
  'Communication',
  'Technology',
  'Environment',
  'Other'
]

export function SubmitProblemDialog({ open, onOpenChange, bubbleId }: SubmitProblemDialogProps) {
  const [problems, setProblems] = useKV<Problem[]>('problems', [])
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')

  const handleSubmit = () => {
    if (!category || !description.trim()) {
      toast.error('Please fill in all fields')
      return
    }

    const newProblem: Problem = {
      id: `prob-${Date.now()}`,
      bubbleId,
      category,
      description: description.trim(),
      anonymousVotes: 1,
      timestamp: Date.now(),
      aggregatedPriority: Math.floor(Math.random() * 100) + 1
    }

    setProblems((current) => [...(current || []), newProblem])
    
    toast.success('Problem reported anonymously')
    setCategory('')
    setDescription('')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Report Problem (L1 - Private Consensus)</DialogTitle>
          <DialogDescription>
            Submit anonymous feedback. Your identity is never recorded.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the problem or concern..."
              rows={4}
            />
          </div>

          <div className="bg-muted p-3 rounded text-xs text-muted-foreground">
            <p className="font-semibold mb-1">Privacy Notice:</p>
            <p>This submission is completely anonymous. No identifying information is stored.</p>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            Submit Anonymously
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
