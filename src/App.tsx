import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { BubbleMap } from '@/components/BubbleMap'
import { BubbleDashboard } from '@/components/BubbleDashboard'
import { Header } from '@/components/Header'
import { MetaAlertPanel } from '@/components/MetaAlertPanel'
import { SystemMonitoring } from '@/components/SystemMonitoring'
import { Button } from '@/components/ui/button'
import { ChartLine } from '@phosphor-icons/react'
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
  const [bubbles, setBubbles] = useKV<Bubble[]>('bubbles', [])
  const [problems, setProblems] = useKV<Problem[]>('problems', [])
  const [proposals, setProposals] = useKV<Proposal[]>('proposals', [])
  const [blackBox, setBlackBox] = useKV<BlackBoxEntry[]>('blackbox', [])
  const [metaAlerts, setMetaAlerts] = useKV<MetaAlert[]>('meta-alerts', [])
  const [initialized, setInitialized] = useKV<boolean>('system-initialized', false)

  const safeBubbles = Array.isArray(bubbles) ? bubbles : []
  const safeProblems = Array.isArray(problems) ? problems : []
  const safeProposals = Array.isArray(proposals) ? proposals : []
  const safeBlackBox = Array.isArray(blackBox) ? blackBox : []
  const safeMetaAlerts = Array.isArray(metaAlerts) ? metaAlerts : []

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
    }
  }, [initialized, safeBubbles.length, setBubbles, setProblems, setProposals, setBlackBox, setMetaAlerts, setInitialized])

  const handleBubbleSelect = (bubble: Bubble) => {
    setSelectedBubble(bubble)
  }

  const handleBack = () => {
    if (selectedBubble?.parentId) {
      const parentBubble = safeBubbles.find(b => b.id === selectedBubble.parentId)
      setSelectedBubble(parentBubble || null)
    } else {
      setSelectedBubble(null)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      
      <main className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            {selectedBubble && (
              <Button variant="ghost" onClick={handleBack}>
                ← Back
              </Button>
            )}
            {showSystemMonitor && (
              <Button variant="ghost" onClick={() => setShowSystemMonitor(false)}>
                ← Back to Bubbles
              </Button>
            )}
          </div>
          
          {!showSystemMonitor && (
            <Button 
              variant="outline"
              onClick={() => {
                setShowSystemMonitor(true)
                setSelectedBubble(null)
              }}
            >
              <ChartLine size={16} className="mr-2" />
              System Health
            </Button>
          )}
        </div>

        {safeMetaAlerts.length > 0 && !showSystemMonitor && (
          <MetaAlertPanel alerts={safeMetaAlerts} />
        )}

        {showSystemMonitor ? (
          <SystemMonitoring proposals={safeProposals} blackBoxEntries={safeBlackBox} />
        ) : !selectedBubble ? (
          <BubbleMap 
            bubbles={safeBubbles}
            onBubbleSelect={handleBubbleSelect}
          />
        ) : (
          <BubbleDashboard
            bubble={selectedBubble}
            bubbles={safeBubbles}
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
