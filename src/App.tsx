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

  const handleBubbleSelect = (bubble: Bubble) => {
    setSelectedBubble(bubble)
  }

  const handleBack = () => {
    if (selectedBubble?.parentId) {
      const parentBubble = (bubbles || []).find(b => b.id === selectedBubble.parentId)
      setSelectedBubble(parentBubble || null)
    } else {
      setSelectedBubble(null)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      
      <main className="container mx-auto px-4 py-6 max-w-7xl">
        {(metaAlerts || []).length > 0 && (
          <MetaAlertPanel alerts={metaAlerts || []} />
        )}

        {!selectedBubble ? (
          <BubbleMap 
            bubbles={bubbles || []}
            onBubbleSelect={handleBubbleSelect}
          />
        ) : (
          <BubbleDashboard
            bubble={selectedBubble}
            bubbles={bubbles || []}
            problems={(problems || []).filter(p => p.bubbleId === selectedBubble.id)}
            proposals={(proposals || []).filter(p => p.bubbleId === selectedBubble.id)}
            blackBoxEntries={(blackBox || []).filter(e => e.bubbleId === selectedBubble.id)}
            onBack={handleBack}
            onBubbleSelect={handleBubbleSelect}
          />
        )}
      </main>
    </div>
  )
}

export default App
