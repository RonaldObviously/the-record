import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Plus, X } from '@phosphor-icons/react'
import { toast } from 'sonner'
import type { Problem, Proposal, Prediction, ValidationResult, BlackBoxEntry } from '@/lib/types'

interface SubmitProposalDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  bubbleId: string
  problems: Problem[]
}

export function SubmitProposalDialog({ open, onOpenChange, bubbleId, problems }: SubmitProposalDialogProps) {
  const [proposals, setProposals] = useKV<Proposal[]>('proposals', [])
  const [blackBox, setBlackBox] = useKV<BlackBoxEntry[]>('blackbox', [])
  
  const [problemId, setProblemId] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [predictions, setPredictions] = useState<Prediction[]>([
    { metric: '', predicted: '', timeframe: '' }
  ])

  const addPrediction = () => {
    setPredictions([...predictions, { metric: '', predicted: '', timeframe: '' }])
  }

  const removePrediction = (index: number) => {
    setPredictions(predictions.filter((_, i) => i !== index))
  }

  const updatePrediction = (index: number, field: keyof Prediction, value: string) => {
    const updated = [...predictions]
    updated[index] = { ...updated[index], [field]: value }
    setPredictions(updated)
  }

  const handleSubmit = () => {
    if (!title.trim() || !description.trim()) {
      toast.error('Please fill in title and description')
      return
    }

    const validPredictions = predictions.filter(p => p.metric && p.predicted && p.timeframe)
    
    if (validPredictions.length === 0) {
      toast.error('At least one complete prediction is required')
      return
    }

    const validators = ['Budget Validator', 'Legal Validator', 'Impact Validator', 'Safety Validator']
    const validations: ValidationResult[] = validators.map(validator => ({
      validator,
      status: Math.random() > 0.3 ? 'pass' : (Math.random() > 0.5 ? 'warning' : 'pending'),
      message: `${validator} check ${Math.random() > 0.3 ? 'passed' : 'requires review'}`,
      timestamp: Date.now()
    }))

    const newProposal: Proposal = {
      id: `prop-${Date.now()}`,
      bubbleId,
      problemId: problemId || '',
      title: title.trim(),
      description: description.trim(),
      submittedBy: 'anonymous',
      timestamp: Date.now(),
      predictions: validPredictions,
      validations,
      status: 'validating',
      influenceWeight: 1.0
    }

    setProposals((current) => [...(current || []), newProposal])

    const blackBoxEntry: BlackBoxEntry = {
      id: `bb-${Date.now()}`,
      timestamp: Date.now(),
      type: 'prediction',
      bubbleId,
      proposalId: newProposal.id,
      data: {
        proposal: title,
        predictions: validPredictions
      },
      immutable: true
    }

    setBlackBox((current) => [...(current || []), blackBoxEntry])

    toast.success('Proposal submitted for validation')
    
    setProblemId('')
    setTitle('')
    setDescription('')
    setPredictions([{ metric: '', predicted: '', timeframe: '' }])
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Submit Proposal (L2/L3)</DialogTitle>
          <DialogDescription>
            Propose a solution with measurable predictions. Accuracy determines influence.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {problems.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="problem">Related Problem (Optional)</Label>
              <Select value={problemId} onValueChange={setProblemId}>
                <SelectTrigger id="problem">
                  <SelectValue placeholder="Select related problem" />
                </SelectTrigger>
                <SelectContent>
                  {problems.map(prob => (
                    <SelectItem key={prob.id} value={prob.id}>
                      {prob.category}: {prob.description.slice(0, 50)}...
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="title">Proposal Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Brief, descriptive title"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed explanation of the proposal..."
              rows={4}
            />
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-base">Predictions (Required)</Label>
              <Button variant="outline" size="sm" onClick={addPrediction}>
                <Plus size={16} className="mr-1" />
                Add Prediction
              </Button>
            </div>

            <p className="text-xs text-muted-foreground">
              Your influence weight adjusts based on prediction accuracy over time.
            </p>

            {predictions.map((prediction, index) => (
              <div key={index} className="border rounded-md p-3 space-y-3 bg-card">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Prediction {index + 1}</span>
                  {predictions.length > 1 && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => removePrediction(index)}
                    >
                      <X size={16} />
                    </Button>
                  )}
                </div>

                <div className="space-y-2">
                  <Input
                    placeholder="Metric (e.g., 'Student test scores')"
                    value={prediction.metric}
                    onChange={(e) => updatePrediction(index, 'metric', e.target.value)}
                  />
                  <Input
                    placeholder="Predicted outcome (e.g., '15% increase')"
                    value={prediction.predicted}
                    onChange={(e) => updatePrediction(index, 'predicted', e.target.value)}
                  />
                  <Input
                    placeholder="Timeframe (e.g., '6 months')"
                    value={prediction.timeframe}
                    onChange={(e) => updatePrediction(index, 'timeframe', e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            Submit Proposal
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
