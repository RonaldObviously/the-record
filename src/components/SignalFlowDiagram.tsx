import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowRight, 
  Broadcast, 
  Crosshair, 
  Stack, 
  CheckCircle, 
  Flame,
  Users,
  Warning
} from '@phosphor-icons/react'

interface Step {
  number: number
  title: string
  description: string
  icon: React.ReactNode
  color: string
  examples: string[]
}

const steps: Step[] = [
  {
    number: 1,
    title: 'Individual Signal',
    description: 'Someone observes a problem in their area and submits it anonymously. The system records their observation without storing personal identity.',
    icon: <Broadcast size={32} weight="duotone" />,
    color: 'oklch(0.60 0.15 240)',
    examples: [
      '"Pothole on Main Street near 5th Ave"',
      '"Street light out on my block"',
      '"Water smells strange in our building"'
    ]
  },
  {
    number: 2,
    title: 'Geographic Clustering',
    description: 'Signals in the same H3 cell (approximately 500m radius) with similar categories automatically group together. This happens without human intervention.',
    icon: <Crosshair size={32} weight="duotone" />,
    color: 'oklch(0.55 0.15 200)',
    examples: [
      '3 reports of water quality in hex-8928374',
      '5 reports of road damage in hex-2837465',
      '7 reports of lighting in hex-9283746'
    ]
  },
  {
    number: 3,
    title: 'Signal Cluster Forms',
    description: 'When 3+ signals share location and category, they form a cluster. The system calculates combined weight from attestations and influence.',
    icon: <Stack size={32} weight="duotone" />,
    color: 'oklch(0.60 0.15 160)',
    examples: [
      'Cluster weight: 47 (from 5 signals)',
      'Average attestations: 2.3 per signal',
      'Geographic consistency confirmed'
    ]
  },
  {
    number: 4,
    title: 'Semantic Analysis',
    description: 'AI analyzes all descriptions in the cluster to generate a unified summary that captures the common issue being reported.',
    icon: <Users size={32} weight="duotone" />,
    color: 'oklch(0.58 0.15 120)',
    examples: [
      'Original: "water tastes weird", "brown tap water", "discolored water"',
      'Summary: "Multiple reports of water discoloration and quality issues"',
      'Category confirmed: Water/Sanitation'
    ]
  },
  {
    number: 5,
    title: 'Gravity Threshold',
    description: 'As more signals join and attestations increase, cluster "gravity" rises. When it crosses threshold (usually 6+ signals with high attestations), it becomes actionable.',
    icon: <Flame size={32} weight="duotone" />,
    color: 'oklch(0.65 0.15 70)',
    examples: [
      'Gravity formula: signals × 10 + attestations × 5 + influence × 0.1',
      'Threshold reached: 100+ gravity points',
      'Status: Ready for promotion'
    ]
  },
  {
    number: 6,
    title: 'Problem Created',
    description: 'The cluster is promoted to an official Problem in L1. It can now receive proposals. All original signals are linked and preserved in the black box ledger.',
    icon: <CheckCircle size={32} weight="duotone" />,
    color: 'oklch(0.55 0.15 165)',
    examples: [
      'Problem ID: prob-cluster-8928374-1234567890',
      'Priority calculated from cluster weight',
      'Ready for L2 proposal submission'
    ]
  }
]

export function SignalFlowDiagram() {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-3">
        <h2 className="text-2xl font-semibold">How Signals Become Problems</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          THE RECORD uses a deterministic process to aggregate individual observations into 
          validated problems. No voting, no committees—just math and cryptography.
        </p>
      </div>

      <div className="relative">
        {steps.map((step, index) => (
          <div key={step.number} className="relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15 }}
            >
              <Card 
                className="p-6 mb-6 border-2 transition-all hover:shadow-lg"
                style={{ 
                  borderColor: step.color,
                  background: `linear-gradient(135deg, ${step.color}08 0%, transparent 100%)`
                }}
              >
                <div className="flex gap-6">
                  <div 
                    className="flex-shrink-0 w-20 h-20 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${step.color}15`, color: step.color }}
                  >
                    {step.icon}
                  </div>

                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <Badge 
                        variant="outline" 
                        className="font-mono text-xs"
                        style={{ borderColor: step.color, color: step.color }}
                      >
                        STEP {step.number}
                      </Badge>
                      <h3 className="text-lg font-semibold">{step.title}</h3>
                    </div>

                    <p className="text-sm text-foreground/90 leading-relaxed">
                      {step.description}
                    </p>

                    <div className="bg-muted/50 rounded-md p-4 space-y-2">
                      <div className="text-xs font-mono text-muted-foreground mb-2">
                        EXAMPLES:
                      </div>
                      {step.examples.map((example, i) => (
                        <div 
                          key={i} 
                          className="text-xs font-mono text-foreground/80 flex items-start gap-2"
                        >
                          <span className="text-muted-foreground">→</span>
                          <span>{example}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            {index < steps.length - 1 && (
              <div className="flex justify-center my-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.15 + 0.1 }}
                  className="text-muted-foreground"
                >
                  <ArrowRight size={24} weight="bold" />
                </motion.div>
              </div>
            )}
          </div>
        ))}
      </div>

      <Card className="p-6 bg-accent/10 border-accent">
        <div className="flex gap-4">
          <div className="flex-shrink-0">
            <Warning size={32} className="text-accent" weight="duotone" />
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold text-accent-foreground">Why This Matters</h4>
            <div className="text-sm text-accent-foreground/90 space-y-2">
              <p>
                <strong>No Human Gatekeepers:</strong> The transition from signal → cluster → problem 
                is fully deterministic. No committee decides what's "important enough."
              </p>
              <p>
                <strong>Privacy Protected:</strong> Individual signals are anonymized using H3 geographic 
                cells. You prove a problem exists in a 500m radius without revealing your exact location.
              </p>
              <p>
                <strong>Sybil Resistant:</strong> Creating fake signals is expensive (humanity score required) 
                and ineffective (clustering requires geographic + semantic consistency).
              </p>
              <p>
                <strong>Immutable Record:</strong> Every step is logged in the black box ledger with 
                cryptographic hashes. The history cannot be rewritten.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
