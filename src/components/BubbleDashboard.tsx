import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, LockKey, Network, Target, Eye, Plus } from '@phosphor-icons/react'
import { ProblemList } from '@/components/ProblemList'
import { ProposalList } from '@/components/ProposalList'
import { BlackBoxLog } from '@/components/BlackBoxLog'
import { SubmitProblemDialog } from '@/components/SubmitProblemDialog'
import { SubmitProposalDialog } from '@/components/SubmitProposalDialog'
import type { Bubble, Problem, Proposal, BlackBoxEntry } from '@/lib/types'

interface BubbleDashboardProps {
  bubble: Bubble
  bubbles: Bubble[]
  problems: Problem[]
  proposals: Proposal[]
  blackBoxEntries: BlackBoxEntry[]
  onBack: () => void
  onBubbleSelect: (bubble: Bubble) => void
}

export function BubbleDashboard({ 
  bubble, 
  bubbles,
  problems, 
  proposals, 
  blackBoxEntries,
  onBack,
  onBubbleSelect
}: BubbleDashboardProps) {
  const [showProblemDialog, setShowProblemDialog] = useState(false)
  const [showProposalDialog, setShowProposalDialog] = useState(false)

  const childBubbles = bubbles.filter(b => b.parentId === bubble.id)

  const layers = [
    { id: 'L1', name: 'Private Consensus', icon: LockKey, color: 'text-primary' },
    { id: 'L2', name: 'Constraint Network', icon: Network, color: 'text-success' },
    { id: 'L3', name: 'Accountability', icon: Target, color: 'text-prediction' },
    { id: 'L4', name: 'Meta-Layer', icon: Eye, color: 'text-warning' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft size={20} />
          </Button>
          <div>
            <h2 className="text-2xl font-semibold">{bubble.name}</h2>
            <p className="text-sm text-muted-foreground capitalize">
              {bubble.level || bubble.domain}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button onClick={() => setShowProblemDialog(true)}>
            <Plus size={16} className="mr-2" />
            Report Problem
          </Button>
          <Button onClick={() => setShowProposalDialog(true)} variant="secondary">
            <Plus size={16} className="mr-2" />
            Submit Proposal
          </Button>
        </div>
      </div>

      {childBubbles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Sub-Contexts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {childBubbles.map(child => (
                <Badge 
                  key={child.id}
                  variant="outline"
                  className="cursor-pointer hover:bg-muted"
                  onClick={() => onBubbleSelect(child)}
                >
                  {child.name}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="L1" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          {layers.map(layer => {
            const Icon = layer.icon
            return (
              <TabsTrigger key={layer.id} value={layer.id} className="flex items-center gap-2">
                <Icon size={16} className={layer.color} />
                <span className="hidden sm:inline">{layer.name}</span>
                <span className="sm:hidden">{layer.id}</span>
              </TabsTrigger>
            )
          })}
        </TabsList>

        <TabsContent value="L1" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <LockKey size={20} className="text-primary" />
                <CardTitle>L1 — Private Consensus Engine</CardTitle>
              </div>
              <CardDescription>
                Anonymous problem reporting and aggregated community patterns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProblemList problems={problems} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="L2" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Network size={20} className="text-success" />
                <CardTitle>L2 — Distributed Constraint Network</CardTitle>
              </div>
              <CardDescription>
                Multi-node validation of feasibility, budget, legality, and impact
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProposalList proposals={proposals} view="validation" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="L3" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Target size={20} className="text-prediction" />
                <CardTitle>L3 — Decentralized Accountability Mesh</CardTitle>
              </div>
              <CardDescription>
                Prediction tracking and accuracy-based influence weighting
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProposalList proposals={proposals} view="accountability" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="L4" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Eye size={20} className="text-warning" />
                <CardTitle>L4 — Independent Meta-Layer</CardTitle>
              </div>
              <CardDescription>
                System oversight, drift detection, and transparency monitoring
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BlackBoxLog entries={blackBoxEntries} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <SubmitProblemDialog 
        open={showProblemDialog}
        onOpenChange={setShowProblemDialog}
        bubbleId={bubble.id}
      />

      <SubmitProposalDialog
        open={showProposalDialog}
        onOpenChange={setShowProposalDialog}
        bubbleId={bubble.id}
        problems={problems}
      />
    </div>
  )
}
