import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { BubbleMap } from '@/components/BubbleMap'
import { BubbleDashboard } from '@/components/BubbleDashboard'
import { Header } from '@/components/Header'
import { MetaAlertPanel } from '@/components/MetaAlertPanel'
import type { Bubble, Problem, Proposal, BlackBoxEntry, MetaAlert } from '@/lib/types'

function App() {
  const [selectedBubble, setSelectedBubble] = useState<Bubble | null>(null)
  const [bubbles] = useKV<Bubble[]>('bubbles', [])
  const [problems] = useKV<Problem[]>('problems', [])
  const [proposals] = useKV<Proposal[]>('proposals', [])
  const [blackBox] = useKV<BlackBoxEntry[]>('blackbox', [])
  const [metaAlerts] = useKV<MetaAlert[]>('meta-alerts', [])

  const safeBubbles = Array.isArray(bubbles) ? bubbles : []
  const safeProblems = Array.isArray(problems) ? problems : []
  const safeProposals = Array.isArray(proposals) ? proposals : []
  const safeBlackBox = Array.isArray(blackBox) ? blackBox : []
  const safeMetaAlerts = Array.isArray(metaAlerts) ? metaAlerts : []

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
        {safeMetaAlerts.length > 0 && (
          <MetaAlertPanel alerts={safeMetaAlerts} />
        )}

        {!selectedBubble ? (
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
