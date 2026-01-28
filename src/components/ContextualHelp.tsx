import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Info } from '@phosphor-icons/react'

interface ContextualHelpProps {
  title: string
  description: string
  example?: string
}

export function ContextualHelp({ title, description, example }: ContextualHelpProps) {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={200}>
        <TooltipTrigger asChild>
          <button className="inline-flex items-center justify-center">
            <Info size={14} className="text-muted-foreground hover:text-foreground transition-colors" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          <div className="space-y-2">
            <p className="font-semibold text-sm">{title}</p>
            <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
            {example && (
              <div className="bg-muted/50 p-2 rounded text-xs font-mono mt-2">
                <span className="text-muted-foreground">Example:</span> {example}
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export const helpContent = {
  bubbles: {
    title: 'What are Bubbles?',
    description:
      'Bubbles are nested contexts - geographic (Global → City → District) or thematic (Education, Healthcare, Infrastructure). They help organize problems and proposals by scope.',
    example: 'San Francisco → Mission District → 16th Street',
  },
  signals: {
    title: 'What are Signals?',
    description:
      'Signals are anonymous observations you submit about problems in your area. They use H3 geospatial indexing to protect your privacy while proving the problem exists in a specific location.',
    example: 'Report "water main leak" at your street corner anonymously',
  },
  clustering: {
    title: 'Signal Clustering',
    description:
      'When multiple people report similar problems in the same area, AI clusters them together. This transforms individual signals into collective truth without revealing who reported what.',
    example: '15 signals about "potholes" on Oak St → Clustered into 1 verified problem',
  },
  problems: {
    title: 'What are Problems?',
    description:
      'Problems are verified issues that have been promoted from clustered signals or directly submitted. They represent collective agreement that something needs attention.',
    example: 'Teacher burnout in District 5 (promoted from 42 clustered signals)',
  },
  proposals: {
    title: 'What are Proposals?',
    description:
      'Proposals are solutions to problems. They require mandatory predictions about cost, timeline, impact, and risks. This creates accountability through "skin in the game."',
    example: 'Fix pothole: Predict $2k cost, 1 week timeline, 85% success rate',
  },
  predictions: {
    title: 'Why Predictions Matter',
    description:
      'Predictions create accountability. When reality occurs, your predictions are checked. Accurate predictions earn influence. Inaccurate predictions lose influence. This prevents manipulation.',
    example: 'Predicted 3 months, took 3.2 months = high accuracy = +influence',
  },
  validation: {
    title: 'Distributed Validation',
    description:
      'Multiple independent validators check different aspects: budget feasibility, legal compliance, technical viability, and social impact. All must agree before a proposal advances.',
    example: 'Budget validator ✓, Legal validator ✓, Safety validator ✗ = Rejected',
  },
  influence: {
    title: 'What is Influence (κ)?',
    description:
      'Influence is your decision-making weight, earned through predictive accuracy. It cannot be bought, sold, or transferred. You gain it by making accurate predictions and lose it by being wrong.',
    example: 'Accurate predictions: κ increases. Wrong predictions: κ decreases.',
  },
  humanityScore: {
    title: 'Humanity Score',
    description:
      'Multi-signal verification (email, phone, location, GitHub) proves you\'re a unique human, not a bot or duplicate account. Higher scores unlock more capabilities.',
    example: '30+ to submit signals, 60+ to bond influence, 80+ to validate',
  },
  blackBox: {
    title: 'Black Box Flight Recorder',
    description:
      'Every action is cryptographically logged in an immutable hash chain. This provides a complete audit trail and makes tampering detectable. Think aircraft black box but for governance.',
    example: 'Each event has a hash linking to the previous event. Change one = breaks chain.',
  },
  metaAlerts: {
    title: 'Meta-Layer Alerts',
    description:
      'Independent AI monitors the system for capture attempts, bias accumulation, and validator cartels. It can only warn, never control. This creates a self-correcting system.',
    example: 'Alert: "5 validators voting identically 95% of time" = Potential cartel',
  },
  h3: {
    title: 'H3 Geospatial Privacy',
    description:
      'Instead of storing your exact GPS coordinates, we use H3 hexagonal cells (~500m radius). This proves a problem exists in an area without revealing which house you live in.',
    example: 'Your location: 37.7749,-122.4194 → H3 cell: 8828308281fffff',
  },
  byzantineFaultTolerance: {
    title: 'Byzantine Fault Tolerance',
    description:
      'The system assumes up to 33% of validators might be malicious (lying, hacked, or corrupt). Consensus requires 2/3+ agreement, making it impossible for bad actors to control outcomes.',
    example: '10 validators: Need 7 to agree. 3 bad actors cannot block or force decisions.',
  },
  zeroSum: {
    title: 'Zero-Sum Influence',
    description:
      'Total influence in the system is fixed. When you gain influence, it comes from those who made bad predictions. When you lose it, it goes to accurate predictors. This prevents influence inflation.',
    example: 'You gain +50κ = Someone else loses -50κ. Total remains constant.',
  },
  cryptographicProof: {
    title: 'Cryptographic Verification',
    description:
      'All data is signed with Ed25519 signatures and hashed with SHA-256. This makes it mathematically impossible to forge records or claim someone said something they didn\'t.',
    example: 'Proposal hash: a3f5... If content changes, hash changes = tampering detected.',
  },
}
