import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { BubbleMap } from '@/components/BubbleMap'
import { ProblemList } from '@/components/ProblemList'
import { ProposalList } from '@/components/ProposalList'
import { SystemMonitoring } from '@/components/SystemMonitoring'
import { MetaAlertPanel } from '@/components/MetaAlertPanel'
import { SubmitProblemDialog } from '@/components/SubmitProblemDialog'
import { SubmitProposalDialog } from '@/components/SubmitProposalDialog'
import { BlackBoxLog } from '@/components/BlackBoxLog'
import { initializeSystem } from '@/lib/seedData'
import type { Bubble, Problem, Proposal, MetaAlert, BlackBoxEvent } from '@/lib/types'
import { Plus, Warning } from '@phosphor-icons/react'
import { toast } from 'sonner'

function App() {
  const [initialized, setInitialized] = useKV<boolean>('system-initialized', false)
  const [bubbles, setBubbles] = useKV<Bubble[]>('bubbles', [])
  const [problems, setProblems] = useKV<Problem[]>('problems', [])
  const [proposals, setProposals] = useKV<Proposal[]>('proposals', [])
  const [metaAlerts, setMetaAlerts] = useKV<MetaAlert[]>('meta-alerts', [])
  const [blackBox, setBlackBox] = useKV<BlackBoxEvent[]>('black-box', [])
  
  const [selectedBubbleId, setSelectedBubbleId] = useState<string | null>(null)
  const [showProblemDialog, setShowProblemDialog] = useState(false)
  const [showProposalDialog, setShowProposalDialog] = useState(false)
  const [showSystemHealth, setShowSystemHealth] = useState(false)
  const [currentLayer, setCurrentLayer] = useState<'L1' | 'L2' | 'L3' | 'L4'>('L1')

  useEffect(() => {
    if (!initialized) {
      const data = initializeSystem()
      setBubbles(data.bubbles)
      setProblems(data.problems)
      setProposals(data.proposals)
      setMetaAlerts(data.metaAlerts)
      setBlackBox(data.blackBox)
      setInitialized(true)
      toast.success('The Record initialized')
    }
  }, [initialized])

  const safeBubbles = Array.isArray(bubbles) ? bubbles : []
  const safeProblems = Array.isArray(problems) ? problems : []
  const safeProposals = Array.isArray(proposals) ? proposals : []
  const safeMetaAlerts = Array.isArray(metaAlerts) ? metaAlerts : []
  const safeBlackBox = Array.isArray(blackBox) ? blackBox : []

  const selectedBubble = safeBubbles.find(b => b.id === selectedBubbleId)
  const bubbleProblems = safeProblems.filter(p => p.bubbleId === selectedBubbleId)
  const bubbleProposals = safeProposals.filter(p => p.bubbleId === selectedBubbleId)

  const handleSubmitProblem = (problem: Problem) => {
    setProblems((current) => [...(current || []), problem])
    toast.success('Problem submitted anonymously')
  }

  const handleSubmitProposal = (proposal: Proposal) => {
    setProposals((current) => [...(current || []), proposal])
    toast.success('Proposal submitted for validation')
  }

  const criticalAlerts = safeMetaAlerts.filter(a => a.severity === 'critical' || a.severity === 'high')

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-foreground font-mono">THE RECORD</h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                Transparent Collective Decision System
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSystemHealth(!showSystemHealth)}
              >
                System Health
              </Button>
              {selectedBubbleId && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowProblemDialog(true)}
                  >
                    <Plus size={16} className="mr-1.5" />
                    Report Problem
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => setShowProposalDialog(true)}
                  >
                    <Plus size={16} className="mr-1.5" />
                    Submit Proposal
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {criticalAlerts.length > 0 && (
        <MetaAlertPanel alerts={criticalAlerts} />
      )}

      <main className="container mx-auto px-6 py-8 max-w-7xl">
        {showSystemHealth ? (
          <SystemMonitoring onClose={() => setShowSystemHealth(false)} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="p-6">
                <div className="mb-6">
                  <h2 className="text-lg font-semibold mb-2">
                    {selectedBubble ? selectedBubble.name : 'Global Context'}
                  </h2>
                  {selectedBubble && (
                    <p className="text-sm text-muted-foreground mb-4">
                      {selectedBubble.description}
                    </p>
                  )}
                  {selectedBubbleId && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const parent = selectedBubble?.parentId
                          ? safeBubbles.find(b => b.id === selectedBubble.parentId)
                          : null
                        setSelectedBubbleId(parent?.id || null)
                      }}
                    >
                      ← Back
                    </Button>
                  )}
                </div>

                <BubbleMap
                  bubbles={safeBubbles}
                  selectedBubbleId={selectedBubbleId}
                  onSelectBubble={setSelectedBubbleId}
                />
              </Card>

              {selectedBubbleId && (
                <Card className="p-6 mt-6">
                  <Tabs value={currentLayer} onValueChange={(v) => setCurrentLayer(v as any)}>
                    <TabsList className="mb-6">
                      <TabsTrigger value="L1">L1: Problems</TabsTrigger>
                      <TabsTrigger value="L2">L2: Proposals</TabsTrigger>
                      <TabsTrigger value="L3">L3: Tracking</TabsTrigger>
                      <TabsTrigger value="L4">L4: Meta</TabsTrigger>
                    </TabsList>

                    <TabsContent value="L1" className="mt-0">
                      <ProblemList problems={bubbleProblems} />
                    </TabsContent>

                    <TabsContent value="L2" className="mt-0">
                      <ProposalList 
                        proposals={bubbleProposals}
                        showValidations={true}
                      />
                    </TabsContent>

                    <TabsContent value="L3" className="mt-0">
                      <ProposalList 
                        proposals={bubbleProposals.filter(p => p.status === 'active' || p.status === 'completed')}
                        showPredictions={true}
                      />
                    </TabsContent>

                    <TabsContent value="L4" className="mt-0">
                      <MetaAlertPanel 
                        alerts={safeMetaAlerts.filter(a => 
                          a.affectedBubbles.includes(selectedBubbleId)
                        )} 
                      />
                    </TabsContent>
                  </Tabs>
                </Card>
              )}
            </div>

            <div className="lg:col-span-1">
              <BlackBoxLog events={safeBlackBox.slice(-20)} />
            </div>
          </div>
        )}
      </main>

      {selectedBubbleId && (
        <>
          <SubmitProblemDialog
            open={showProblemDialog}
            onOpenChange={setShowProblemDialog}
            bubbleId={selectedBubbleId}
            onSubmit={handleSubmitProblem}
          />
          <SubmitProposalDialog
            open={showProposalDialog}
            onOpenChange={setShowProposalDialog}
            bubbleId={selectedBubbleId}
            problems={bubbleProblems}
            onSubmit={handleSubmitProposal}
          />
        </>
      )}
    </div>
  )
}

export default App
