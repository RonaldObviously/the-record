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
import { SubmitSignalDialog } from '@/components/SubmitSignalDialog'
import { SignalAggregationMatrix } from '@/components/SignalAggregationMatrix'
import { GlobeVisualization } from '@/components/GlobeVisualization'
import { SatelliteMapView } from '@/components/SatelliteMapView'
import { BlackBoxLog } from '@/components/BlackBoxLog'
import { OnboardingFlow } from '@/components/OnboardingFlow'
import { AccountDashboard } from '@/components/AccountDashboard'
import { SystemExplanation } from '@/components/SystemExplanation'
import { WelcomeDialog } from '@/components/WelcomeDialog'
import { CryptoTransparencyExplainer } from '@/components/CryptoTransparencyExplainer'
import { initializeSystem } from '@/lib/seedData'
import { promoteClusterToProblem } from '@/lib/signalLifecycle'
import type { Bubble, Problem, Proposal, MetaAlert, BlackBoxEvent, Signal, SignalCluster } from '@/lib/types'
import type { UserAccount } from '@/lib/auth'
import { canSubmitSignals } from '@/lib/auth'
import { Plus, Warning, User, Broadcast, MapPin, HardDrive } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { IPFSStoragePanel } from '@/components/IPFSStoragePanel'
import { useIPFSStorage } from '@/hooks/use-ipfs-storage'

function App() {
  const [initialized, setInitialized] = useKV<boolean>('system-initialized', false)
  const [bubbles, setBubbles] = useKV<Bubble[]>('bubbles', [])
  const [signals, setSignals] = useKV<Signal[]>('signals', [])
  const [problems, setProblems] = useKV<Problem[]>('problems', [])
  const [proposals, setProposals] = useKV<Proposal[]>('proposals', [])
  const [metaAlerts, setMetaAlerts] = useKV<MetaAlert[]>('meta-alerts', [])
  const [blackBox, setBlackBox] = useKV<BlackBoxEvent[]>('black-box', [])
  const [userAccount, setUserAccount] = useKV<UserAccount | null>('user-account', null)
  
  const [selectedBubbleId, setSelectedBubbleId] = useState<string | null>(null)
  const [showSignalDialog, setShowSignalDialog] = useState(false)
  const [showProblemDialog, setShowProblemDialog] = useState(false)
  const [showProposalDialog, setShowProposalDialog] = useState(false)
  const [showSystemHealth, setShowSystemHealth] = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [showWelcome, setShowWelcome] = useState(false)
  const [showAccountDashboard, setShowAccountDashboard] = useState(false)
  const [showGlobeView, setShowGlobeView] = useState(false)
  const [showSatelliteMap, setShowSatelliteMap] = useState(false)
  const [currentLayer, setCurrentLayer] = useState<'L1' | 'L2' | 'L3' | 'L4'>('L1')
  const [selectedH3Cell, setSelectedH3Cell] = useState<string | null>(null)
  const [showIPFSPanel, setShowIPFSPanel] = useState(false)

  const ipfs = useIPFSStorage()

  useEffect(() => {
    if (!initialized) {
      const data = initializeSystem()
      setBubbles(data.bubbles)
      setProblems(data.problems)
      setProposals(data.proposals)
      setMetaAlerts(data.metaAlerts)
      setBlackBox(data.blackBox)
      setSignals([])
      setInitialized(true)
      toast.success('THE RECORD initialized')
    }
  }, [initialized])

  useEffect(() => {
    if (!userAccount && initialized) {
      setShowWelcome(true)
    }
  }, [userAccount, initialized])

  const safeBubbles = Array.isArray(bubbles) ? bubbles : []
  const safeSignals = Array.isArray(signals) ? signals : []
  const safeProblems = Array.isArray(problems) ? problems : []
  const safeProposals = Array.isArray(proposals) ? proposals : []
  const safeMetaAlerts = Array.isArray(metaAlerts) ? metaAlerts : []
  const safeBlackBox = Array.isArray(blackBox) ? blackBox : []

  const selectedBubble = safeBubbles.find(b => b.id === selectedBubbleId)
  const bubbleSignals = safeSignals.filter(s => s.bubbleId === selectedBubbleId)
  const bubbleProblems = safeProblems.filter(p => p.bubbleId === selectedBubbleId)
  const bubbleProposals = safeProposals.filter(p => p.bubbleId === selectedBubbleId)

  const handleSubmitSignal = async (signal: Signal) => {
    if (!userAccount || !canSubmitSignals(userAccount)) {
      toast.error('You need a humanity score of 30+ to submit signals')
      return
    }
    
    setSignals((current) => [...(current || []), signal])
    
    const event: BlackBoxEvent = {
      id: `event-${Date.now()}`,
      type: 'signal-submitted',
      timestamp: new Date(),
      data: {
        signalId: signal.id,
        category: signal.category,
        h3Cell: signal.h3Cell,
      },
      hash: `hash-${Date.now()}`,
      previousHash: safeBlackBox[safeBlackBox.length - 1]?.hash || 'genesis',
    }
    setBlackBox((current) => [...(current || []), event])
    
    if (ipfs.state.initialized) {
      await ipfs.storeSignal(signal)
      await ipfs.storeBlackBoxEvent(event)
    }
    
    toast.success('Signal submitted to L1 layer')
  }

  const handleClusterPromoted = (cluster: SignalCluster) => {
    const problem = promoteClusterToProblem(cluster)
    setProblems((current) => [...(current || []), problem])
    
    setSignals((current) =>
      (current || []).map(s =>
        cluster.signals.some(cs => cs.id === s.id)
          ? { ...s, status: 'clustered' as const, clusterId: cluster.id }
          : s
      )
    )
    
    const event: BlackBoxEvent = {
      id: `event-${Date.now()}`,
      type: 'cluster-promoted',
      timestamp: new Date(),
      data: {
        clusterId: cluster.id,
        problemId: problem.id,
        signalCount: cluster.signals.length,
      },
      hash: `hash-${Date.now()}`,
      previousHash: safeBlackBox[safeBlackBox.length - 1]?.hash || 'genesis',
    }
    setBlackBox((current) => [...(current || []), event])
    
    toast.success(`Cluster promoted to Problem: "${problem.description}"`)
  }

  const handleSubmitProblem = async (problem: Problem) => {
    if (!userAccount || !canSubmitSignals(userAccount)) {
      toast.error('You need a humanity score of 30+ to submit signals')
      return
    }
    setProblems((current) => [...(current || []), problem])
    
    if (ipfs.state.initialized) {
      await ipfs.storeProblem(problem)
    }
    
    toast.success('Problem submitted anonymously')
  }

  const handleSubmitProposal = async (proposal: Proposal) => {
    if (!userAccount || !canSubmitSignals(userAccount)) {
      toast.error('You need a humanity score of 30+ to submit proposals')
      return
    }
    setProposals((current) => [...(current || []), proposal])
    
    if (ipfs.state.initialized) {
      await ipfs.storeProposal(proposal)
    }
    
    toast.success('Proposal submitted for validation')
  }

  const handleOnboardingComplete = (account: UserAccount) => {
    setUserAccount(account)
    setShowOnboarding(false)
    setShowWelcome(false)
    toast.success(`Welcome to THE RECORD, ${account.id}!`)
  }

  const handleStartOnboarding = () => {
    setShowWelcome(false)
    setShowOnboarding(true)
  }

  const handleMeshCellClick = (position: { x: number; y: number }) => {
    if (!userAccount || !canSubmitSignals(userAccount)) {
      toast.error('You need a humanity score of 30+ to submit signals')
      return
    }
    
    if (!selectedBubbleId) {
      toast.error('Please select a bubble first')
      return
    }

    setShowSignalDialog(true)
    toast.info('Click to submit a signal at this mesh location')
  }

  const handleCreateIPFSBackup = async () => {
    if (!ipfs.state.initialized) {
      toast.error('IPFS not initialized')
      return
    }

    const metadata = await ipfs.storeBatch(
      safeSignals,
      safeProblems,
      safeProposals,
      safeBlackBox
    )

    if (metadata) {
      toast.success(`Backup created: ${metadata.cid}`, { duration: 10000 })
    }
  }

  const handleRestoreIPFSBackup = async (backup: any) => {
    if (backup.signals) setSignals(backup.signals)
    if (backup.problems) setProblems(backup.problems)
    if (backup.proposals) setProposals(backup.proposals)
    if (backup.blackBoxEvents) setBlackBox(backup.blackBoxEvents)
  }

  useEffect(() => {
    if (ipfs.autoBackupEnabled && ipfs.state.initialized) {
      const interval = setInterval(() => {
        handleCreateIPFSBackup()
      }, 5 * 60 * 1000)

      return () => clearInterval(interval)
    }
  }, [ipfs.autoBackupEnabled, ipfs.state.initialized, safeSignals.length, safeProblems.length, safeProposals.length, safeBlackBox.length])

  const criticalAlerts = safeMetaAlerts.filter(a => a.severity === 'critical' || a.severity === 'high')

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-foreground font-mono">THE RECORD</h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                Sovereign Coordination Engine
              </p>
            </div>
            <div className="flex items-center gap-3">
              <SystemExplanation />
              <CryptoTransparencyExplainer />
              <Button
                variant={ipfs.state.initialized ? "default" : "outline"}
                size="sm"
                onClick={() => setShowIPFSPanel(true)}
              >
                <HardDrive size={16} className="mr-1.5" />
                IPFS Storage
              </Button>
              {userAccount && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAccountDashboard(!showAccountDashboard)}
                >
                  <User size={16} className="mr-1.5" />
                  Account
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowSatelliteMap(!showSatelliteMap)
                  setShowGlobeView(false)
                }}
              >
                <MapPin size={16} className="mr-1.5" />
                Satellite Map
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowGlobeView(!showGlobeView)
                  setShowSatelliteMap(false)
                }}
              >
                <Broadcast size={16} className="mr-1.5" />
                Globe View
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSystemHealth(!showSystemHealth)}
              >
                System Health
              </Button>
              {selectedBubbleId && userAccount && canSubmitSignals(userAccount) && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowSignalDialog(true)}
                  >
                    <Plus size={16} className="mr-1.5" />
                    Submit Signal
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
              {!userAccount && (
                <Button size="sm" onClick={() => setShowWelcome(true)}>
                  Create Account
                </Button>
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
        ) : showSatelliteMap ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Button variant="outline" onClick={() => setShowSatelliteMap(false)}>
                Back to Bubble View
              </Button>
            </div>
            <SatelliteMapView
              signals={safeSignals}
              clusters={[]}
              onSignalClick={(signal) => {
                console.log('Selected signal:', signal)
              }}
              onMeshCellClick={(h3Cell, coordinates) => {
                if (!userAccount || !canSubmitSignals(userAccount)) {
                  toast.error('You need a humanity score of 30+ to submit signals')
                  return
                }
                setSelectedH3Cell(h3Cell)
                setShowSignalDialog(true)
                toast.info(`Submit a signal for H3 cell: ${h3Cell}`)
              }}
            />
          </div>
        ) : showGlobeView ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">Global Signal Map</h2>
                <p className="text-sm text-muted-foreground">
                  Real-time visualization of all signals across The Record
                </p>
              </div>
              <Button variant="outline" onClick={() => setShowGlobeView(false)}>
                Back to Bubble View
              </Button>
            </div>
            <GlobeVisualization
              signals={safeSignals}
              clusters={[]}
              bubbles={safeBubbles}
              selectedBubbleId={selectedBubbleId}
              onSelectLocation={(lat, lng) => {
                console.log('Selected location:', lat, lng)
              }}
            />
            {selectedBubbleId && (
              <SignalAggregationMatrix
                signals={bubbleSignals}
                onClusterPromoted={handleClusterPromoted}
                onCellClick={handleMeshCellClick}
              />
            )}
          </div>
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
                <>
                  <Card className="p-6 mt-6">
                    <SignalAggregationMatrix
                      signals={bubbleSignals}
                      onClusterPromoted={handleClusterPromoted}
                      onCellClick={handleMeshCellClick}
                    />
                  </Card>

                  <Card className="p-6 mt-6">
                    <Tabs value={currentLayer} onValueChange={(v) => setCurrentLayer(v as any)}>
                      <TabsList className="mb-6">
                        <TabsTrigger value="L1">L1: Signals</TabsTrigger>
                        <TabsTrigger value="L2">L2: Proposals</TabsTrigger>
                        <TabsTrigger value="L3">L3: Tracking</TabsTrigger>
                        <TabsTrigger value="L4">L4: Meta</TabsTrigger>
                      </TabsList>

                      <TabsContent value="L1" className="mt-0">
                        <div className="space-y-4">
                          <div>
                            <h3 className="font-semibold mb-2">Raw Signals</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                              Individual observations submitted anonymously
                            </p>
                          </div>
                          {bubbleSignals.filter(s => s.status === 'raw').length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                              No raw signals yet. Be the first to submit one.
                            </div>
                          ) : (
                            <div className="space-y-3">
                              {bubbleSignals.filter(s => s.status === 'raw').map(signal => (
                                <Card key={signal.id} className="p-4">
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-2">
                                        <span className="text-xs font-mono text-muted-foreground">
                                          {signal.category}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                          {new Date(signal.submittedAt).toLocaleString()}
                                        </span>
                                      </div>
                                      <p className="text-sm">{signal.description}</p>
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                      {signal.attestations} attestations
                                    </div>
                                  </div>
                                </Card>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="mt-6">
                          <ProblemList problems={bubbleProblems} />
                        </div>
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
                </>
              )}
            </div>

            <div className="lg:col-span-1 space-y-6">
              {userAccount && showAccountDashboard && (
                <AccountDashboard account={userAccount} />
              )}
              <BlackBoxLog events={safeBlackBox.slice(-20)} />
            </div>
          </div>
        )}
      </main>

      {(selectedBubbleId || showSatelliteMap) && userAccount && (
        <>
          <SubmitSignalDialog
            open={showSignalDialog}
            onOpenChange={(open) => {
              setShowSignalDialog(open)
              if (!open) {
                setSelectedH3Cell(null)
              }
            }}
            bubbleId={selectedBubbleId || 'global'}
            onSubmit={handleSubmitSignal}
            preselectedH3Cell={selectedH3Cell || undefined}
          />
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
        </>
      )}

      <WelcomeDialog open={showWelcome} onGetStarted={handleStartOnboarding} />
      <OnboardingFlow open={showOnboarding} onComplete={handleOnboardingComplete} />
      <IPFSStoragePanel
        open={showIPFSPanel}
        onOpenChange={setShowIPFSPanel}
        onBackupCreated={handleCreateIPFSBackup}
        onBackupRestored={handleRestoreIPFSBackup}
      />
    </div>
  )
}

export default App
