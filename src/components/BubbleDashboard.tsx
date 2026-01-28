import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, LockKey, Network, Target, Eye, Plus, Download, ChartBar } from '@phosphor-icons/react'
import { ProblemList } from '@/components/ProblemList'
import { ProposalList } from '@/components/ProposalList'
import { BlackBoxLog } from '@/components/BlackBoxLog'
import { SubmitProblemDialog } from '@/components/SubmitProblemDialog'
import { SubmitProposalDialog } from '@/components/SubmitProposalDialog'
import { toast } from 'sonner'
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

  const stats = useMemo(() => {
    const totalProblems = problems.length
    const totalProposals = proposals.length
    const activeProposals = proposals.filter(p => p.status === 'active').length
    const completedProposals = proposals.filter(p => p.status === 'completed').length
    const validatingProposals = proposals.filter(p => p.status === 'validating').length
    
    const avgAccuracy = proposals
      .filter(p => p.accuracyScore !== undefined)
      .reduce((sum, p) => sum + (p.accuracyScore || 0), 0) / 
      (proposals.filter(p => p.accuracyScore !== undefined).length || 1)

    return {
      totalProblems,
      totalProposals,
      activeProposals,
      completedProposals,
      validatingProposals,
      avgAccuracy: Math.round(avgAccuracy * 100)
    }
  }, [problems, proposals])

  const handleExportData = () => {
    const exportData = {
      bubble: {
        id: bubble.id,
        name: bubble.name,
        type: bubble.type,
        level: bubble.level,
        domain: bubble.domain
      },
      statistics: stats,
      problems: problems.map(p => ({
        id: p.id,
        category: p.category,
        description: p.description,
        priority: p.aggregatedPriority,
        timestamp: new Date(p.timestamp).toISOString()
      })),
      proposals: proposals.map(p => ({
        id: p.id,
        title: p.title,
        status: p.status,
        predictions: p.predictions,
        accuracyScore: p.accuracyScore,
        timestamp: new Date(p.timestamp).toISOString()
      })),
      exportedAt: new Date().toISOString()
    }

    const dataStr = JSON.stringify(exportData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${bubble.id}-export-${Date.now()}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    
    toast.success('Data exported successfully')
  }

  const layers = [
    { id: 'L1', name: 'Private Consensus', icon: LockKey, color: 'text-primary' },
    { id: 'L2', name: 'Constraint Network', icon: Network, color: 'text-success' },
    { id: 'L3', name: 'Accountability', icon: Target, color: 'text-prediction' },
    { id: 'L4', name: 'Meta-Layer', icon: Eye, color: 'text-warning' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
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

        <div className="flex items-center gap-2 flex-wrap">
          <Button onClick={handleExportData} variant="outline" size="sm">
            <Download size={16} className="mr-2" />
            Export Data
          </Button>
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

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Total Problems</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProblems}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Total Proposals</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProposals}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Validating</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{stats.validatingProposals}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Active</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{stats.activeProposals}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Completed</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-prediction">{stats.completedProposals}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Avg Accuracy</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgAccuracy}%</div>
          </CardContent>
        </Card>
      </div>

      {childBubbles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Sub-Contexts ({childBubbles.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {childBubbles.map(child => (
                <Badge 
                  key={child.id}
                  variant="outline"
                  className="cursor-pointer hover:bg-muted transition-colors"
                  onClick={() => onBubbleSelect(child)}
                >
                  {child.name}
                  <span className="ml-2 text-xs opacity-60">
                    {child.problemCount || 0} / {child.proposalCount || 0}
                  </span>
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
