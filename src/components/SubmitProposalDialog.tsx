import { useState } from 'react'
import type { Proposal, Problem, Prediction } from '@/lib/types'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, X } from '@phosphor-icons/react'

interface SubmitProposalDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  bubbleId: string
  problems: Problem[]
  onSubmit: (proposal: Proposal) => void
}

export function SubmitProposalDialog({ open, onOpenChange, bubbleId, problems, onSubmit }: SubmitProposalDialogProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [problemId, setProblemId] = useState<string>('')
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [newPrediction, setNewPrediction] = useState({
    metric: '',
    predictedOutcome: '',
    timeframe: ''
  })

  const handleAddPrediction = () => {
    if (!newPrediction.metric || !newPrediction.predictedOutcome || !newPrediction.timeframe) return

    const prediction: Prediction = {
      id: `pred-${Date.now()}-${predictions.length}`,
      metric: newPrediction.metric,
      predictedOutcome: newPrediction.predictedOutcome,
      timeframe: newPrediction.timeframe
    }

    setPredictions([...predictions, prediction])
    setNewPrediction({ metric: '', predictedOutcome: '', timeframe: '' })
  }

  const handleRemovePrediction = (id: string) => {
    setPredictions(predictions.filter(p => p.id !== id))
  }

  const handleSubmit = () => {
    if (!title.trim() || !description.trim() || predictions.length === 0) return

    const proposal: Proposal = {
      id: `proposal-${Date.now()}`,
      bubbleId,
      problemId: problemId || undefined,
      title: title.trim(),
      description: description.trim(),
      predictions,
      validations: [],
      submittedAt: new Date(),
      submittedBy: `anon-${Date.now()}`,
      status: 'pending'
    }

    onSubmit(proposal)
    setTitle('')
    setDescription('')
    setProblemId('')
    setPredictions([])
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Submit Proposal (L2/L3)</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {problems.length > 0 && (
            <div>
              <Label htmlFor="problem">Link to Problem (Optional)</Label>
              <Select value={problemId} onValueChange={setProblemId}>
                <SelectTrigger id="problem">
                  <SelectValue placeholder="Select a problem..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {problems.map((problem) => (
                    <SelectItem key={problem.id} value={problem.id}>
                      {problem.description.slice(0, 60)}...
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Proposal title..."
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your proposal..."
              rows={4}
            />
          </div>

          <div>
            <Label>Predictions (Required)</Label>
            <div className="mt-2 space-y-2">
              {predictions.map((pred) => (
                <div key={pred.id} className="flex items-center gap-2 p-2 bg-muted rounded">
                  <div className="flex-1 text-sm">
                    <div className="font-medium">{pred.metric}</div>
                    <div className="text-muted-foreground text-xs">
                      {pred.predictedOutcome} ({pred.timeframe})
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemovePrediction(pred.id)}
                  >
                    <X size={16} />
                  </Button>
                </div>
              ))}

              <div className="grid grid-cols-3 gap-2">
                <Input
                  placeholder="Metric"
                  value={newPrediction.metric}
                  onChange={(e) => setNewPrediction({ ...newPrediction, metric: e.target.value })}
                />
                <Input
                  placeholder="Predicted outcome"
                  value={newPrediction.predictedOutcome}
                  onChange={(e) => setNewPrediction({ ...newPrediction, predictedOutcome: e.target.value })}
                />
                <div className="flex gap-2">
                  <Input
                    placeholder="Timeframe"
                    value={newPrediction.timeframe}
                    onChange={(e) => setNewPrediction({ ...newPrediction, timeframe: e.target.value })}
                  />
                  <Button
                    size="sm"
                    onClick={handleAddPrediction}
                    disabled={!newPrediction.metric || !newPrediction.predictedOutcome || !newPrediction.timeframe}
                  >
                    <Plus size={16} />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!title.trim() || !description.trim() || predictions.length === 0}
            >
              Submit Proposal
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
