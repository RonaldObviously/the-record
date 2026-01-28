import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Eye, LockKey, Network, Target, Globe, Plus, ChartLine } from '@phosphor-icons/react'

interface WelcomeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function WelcomeDialog({ open, onOpenChange }: WelcomeDialogProps) {
  const [step, setStep] = useState(0)

  const steps = [
    {
      title: 'Welcome to The Record',
      description: 'A transparent collective decision system designed to prevent institutional failure',
      content: (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            The Record is a 4-layer governance coordination platform that enables communities to:
          </p>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-success mt-0.5">✓</span>
              <span>Identify and prioritize problems through anonymous consensus</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-success mt-0.5">✓</span>
              <span>Validate proposals through distributed constraint checking</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-success mt-0.5">✓</span>
              <span>Track prediction accuracy and reward truth over popularity</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-success mt-0.5">✓</span>
              <span>Maintain system integrity through independent meta-layer monitoring</span>
            </li>
          </ul>
        </div>
      )
    },
    {
      title: 'The 4-Layer Architecture',
      description: 'Each layer serves a specific anti-failure function',
      content: (
        <div className="grid grid-cols-1 gap-3">
          <Card className="p-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center shrink-0">
                <LockKey size={16} className="text-primary" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-sm mb-1">L1 - Private Consensus</h4>
                <p className="text-xs text-muted-foreground">
                  Anonymous problem reporting eliminates groupthink and social pressure
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded bg-success/10 flex items-center justify-center shrink-0">
                <Network size={16} className="text-success" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-sm mb-1">L2 - Constraint Network</h4>
                <p className="text-xs text-muted-foreground">
                  Multi-node validation prevents single authority dominance
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded bg-prediction/10 flex items-center justify-center shrink-0">
                <Target size={16} className="text-prediction" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-sm mb-1">L3 - Accountability Mesh</h4>
                <p className="text-xs text-muted-foreground">
                  Prediction tracking rewards accuracy over time
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded bg-warning/10 flex items-center justify-center shrink-0">
                <Eye size={16} className="text-warning" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-sm mb-1">L4 - Meta-Layer</h4>
                <p className="text-xs text-muted-foreground">
                  Independent monitoring detects system drift and capture attempts
                </p>
              </div>
            </div>
          </Card>
        </div>
      )
    },
    {
      title: 'Getting Started',
      description: 'Three ways to interact with The Record',
      content: (
        <div className="space-y-3">
          <Card className="p-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded bg-accent/10 flex items-center justify-center shrink-0">
                <Globe size={16} className="text-accent" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-sm mb-1">1. Explore Bubbles</h4>
                <p className="text-xs text-muted-foreground">
                  Navigate the globe or map view to find geographic or thematic contexts. Click on bubbles to drill down from global to local scales.
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded bg-accent/10 flex items-center justify-center shrink-0">
                <Plus size={16} className="text-accent" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-sm mb-1">2. Report & Propose</h4>
                <p className="text-xs text-muted-foreground">
                  Submit anonymous problems in L1 or create proposals with measurable predictions in L2/L3. Your influence adjusts based on accuracy.
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded bg-accent/10 flex items-center justify-center shrink-0">
                <ChartLine size={16} className="text-accent" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-sm mb-1">3. Monitor System Health</h4>
                <p className="text-xs text-muted-foreground">
                  View the System Health dashboard to track validation performance, prediction accuracy trends, and meta-layer alerts.
                </p>
              </div>
            </div>
          </Card>
        </div>
      )
    }
  ]

  const currentStep = steps[step]

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1)
    } else {
      onOpenChange(false)
      setStep(0)
    }
  }

  const handlePrevious = () => {
    if (step > 0) {
      setStep(step - 1)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{currentStep.title}</DialogTitle>
          <DialogDescription>{currentStep.description}</DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {currentStep.content}
        </div>

        <DialogFooter className="flex items-center justify-between sm:justify-between">
          <div className="flex gap-1">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === step ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>

          <div className="flex gap-2">
            {step > 0 && (
              <Button variant="outline" onClick={handlePrevious}>
                Previous
              </Button>
            )}
            <Button onClick={handleNext}>
              {step < steps.length - 1 ? 'Next' : 'Get Started'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
