import { useState, useEffect, useMemo } from 'react'
import { useKV } from '@github/spark/hooks'
import { BubbleMap } from '@/components/BubbleMap'
import { BubbleDashboard } from '@/components/BubbleDashboard'
import { Header } from '@/components/Header'
import { MetaAlertPanel } from '@/components/MetaAlertPanel'
import { SystemMonitoring } from '@/components/SystemMonitoring'
import { Globe3D } from '@/components/Globe3D'
import { WelcomeDialog } from '@/components/WelcomeDialog'
import { Button } from '@/components/ui/button'
import { ChartLine, Globe, MapTrifold, ArrowsClockwise } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { 
  generateSeedBubbles, 
  generateSeedProblems, 
  generateSeedProposals, 
  generateSeedBlackBoxEntries,
  generateSeedMetaAlerts
} from '@/lib/seedData'
import type { Bubble, Problem, Proposal, BlackBoxEntry, MetaAlert } from '@/lib/types'

function App() {
  const [selectedBubble, setSelectedBubble] = useState<Bubble | null>(null)
  const [showSystemMonitor, setShowSystemMonitor] = useState(false)
  const [viewMode, setViewMode] = useState<'map' | 'globe'>('globe')
  const [bubbles, setBubbles] = useKV<Bubble[]>('bubbles', [])
  const [problems, setProblems] = useKV<Problem[]>('problems', [])
  const [proposals, setProposals] = useKV<Proposal[]>('proposals', [])
  const [blackBox, setBlackBox] = useKV<BlackBoxEntry[]>('blackbox', [])
  const [metaAlerts, setMetaAlerts] = useKV<MetaAlert[]>('meta-alerts', [])
  const [initialized, setInitialized] = useKV<boolean>('system-initialized', false)
  const [hasSeenWelcome, setHasSeenWelcome] = useKV<boolean>('has-seen-welcome', false)
  const [showWelcome, setShowWelcome] = useState(false)

  const safeBubbles = Array.isArray(bubbles) ? bubbles : []
  const safeProblems = Array.isArray(problems) ? problems : []
  const safeProposals = Array.isArray(proposals) ? proposals : []
  const safeBlackBox = Array.isArray(blackBox) ? blackBox : []
  const safeMetaAlerts = Array.isArray(metaAlerts) ? metaAlerts : []

  const bubblesWithStats = useMemo(() => {
    return safeBubbles.map(bubble => ({
      ...bubble,
      problemCount: safeProblems.filter(p => p.bubbleId === bubble.id).length,
      proposalCount: safeProposals.filter(p => p.bubbleId === bubble.id).length,
      activeAlerts: safeMetaAlerts.filter(a => a.bubbleId === bubble.id && a.severity !== 'low').length
    }))
  }, [safeBubbles, safeProblems, safeProposals, safeMetaAlerts])

  useEffect(() => {
    if (!initialized && safeBubbles.length === 0) {
      const seedBubbles = generateSeedBubbles()
      setBubbles(seedBubbles)

      const allProblems: Problem[] = []
      const allProposals: Proposal[] = []
      const allBlackBoxEntries: BlackBoxEntry[] = []

      seedBubbles.forEach(bubble => {
        const bubbleProblems = generateSeedProblems(bubble.id)
        const bubbleProposals = generateSeedProposals(bubble.id, bubbleProblems)
        const bubbleBlackBox = generateSeedBlackBoxEntries(bubble.id, bubbleProposals)

        allProblems.push(...bubbleProblems)
        allProposals.push(...bubbleProposals)
        allBlackBoxEntries.push(...bubbleBlackBox)
      })

      setProblems(allProblems)
      setProposals(allProposals)
      setBlackBox(allBlackBoxEntries)
      setMetaAlerts(generateSeedMetaAlerts())
      setInitialized(true)
      toast.success('System initialized with seed data')
    }
  }, [initialized, safeBubbles.length, setBubbles, setProblems, setProposals, setBlackBox, setMetaAlerts, setInitialized])

  useEffect(() => {
    if (initialized && !hasSeenWelcome) {
      setShowWelcome(true)
    }
  }, [initialized, hasSeenWelcome])

  const handleBubbleSelect = (bubble: Bubble) => {
    const updatedBubble = bubblesWithStats.find(b => b.id === bubble.id) || bubble
    setSelectedBubble(updatedBubble)
    setShowSystemMonitor(false)
  }

  const handleBack = () => {
    if (selectedBubble?.parentId) {
      const parentBubble = bubblesWithStats.find(b => b.id === selectedBubble.parentId)
      setSelectedBubble(parentBubble || null)
    } else {
      setSelectedBubble(null)
    }
  }

  const handleRefresh = () => {
    toast.info('Refreshing system data...')
    const updatedBubbles = bubblesWithStats.map(bubble => ({
      ...bubble,
      problemCount: safeProblems.filter(p => p.bubbleId === bubble.id).length,
      proposalCount: safeProposals.filter(p => p.bubbleId === bubble.id).length,
      activeAlerts: safeMetaAlerts.filter(a => a.bubbleId === bubble.id && a.severity !== 'low').length
    }))
    setBubbles(updatedBubbles)
    toast.success('System data refreshed')
  }

  const handleWelcomeClose = (open: boolean) => {
    setShowWelcome(open)
    if (!open && !hasSeenWelcome) {
      setHasSeenWelcome(true)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      
      <WelcomeDialog open={showWelcome} onOpenChange={handleWelcomeClose} />
      
      <main className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div className="flex items-center gap-2">
            {selectedBubble && (
              <Button variant="ghost" onClick={handleBack}>
                ← Back
              </Button>
            )}
            {showSystemMonitor && (
              <Button variant="ghost" onClick={() => setShowSystemMonitor(false)}>
                ← Back to {viewMode === 'globe' ? 'Globe' : 'Map'}
              </Button>
            )}
          </div>
          
          <div className="flex items-center gap-2 flex-wrap">
            {!showSystemMonitor && !selectedBubble && (
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'map' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('map')}
                >
                  <MapTrifold size={16} className="mr-2" />
                  <span className="hidden sm:inline">Map View</span>
                </Button>
                <Button
                  variant={viewMode === 'globe' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('globe')}
                >
                  <Globe size={16} className="mr-2" />
                  <span className="hidden sm:inline">Globe View</span>
                </Button>
              </div>
            )}
            
            <Button 
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              title="Refresh data"
            >
              <ArrowsClockwise size={16} />
            </Button>
            
            {!showSystemMonitor && (
              <Button 
                variant="outline"
                onClick={() => {
                  setShowSystemMonitor(true)
                  setSelectedBubble(null)
                }}
              >
                <ChartLine size={16} className="mr-2" />
                <span className="hidden sm:inline">System Health</span>
                <span className="sm:hidden">Health</span>
              </Button>
            )}
          </div>
        </div>

        {safeMetaAlerts.length > 0 && !showSystemMonitor && (
          <MetaAlertPanel alerts={safeMetaAlerts} />
        )}

        {showSystemMonitor ? (
          <SystemMonitoring proposals={safeProposals} blackBoxEntries={safeBlackBox} />
        ) : !selectedBubble ? (
          viewMode === 'globe' ? (
            <Globe3D
              bubbles={bubblesWithStats}
              problems={safeProblems}
              proposals={safeProposals}
              onBubbleSelect={handleBubbleSelect}
            />
          ) : (
            <BubbleMap 
              bubbles={bubblesWithStats}
              onBubbleSelect={handleBubbleSelect}
            />
          )
        ) : (
          <BubbleDashboard
            bubble={selectedBubble}
            bubbles={bubblesWithStats}
            problems={safeProblems.filter(p => p.bubbleId === selectedBubble.id)}
            proposals={safeProposals.filter(p => p.bubbleId === selectedBubble.id)}
            blackBoxEntries={safeBlackBox.filter(e => e.bubbleId === selectedBubble.id)}
            onBack={handleBack}
            onBubbleSelect={handleBubbleSelect}
          />
        )}
      </main>
    </div>
  )
}

export default App
