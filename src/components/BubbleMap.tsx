import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowsOut, WarningCircle, Lightbulb, WarningDiamond } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import type { Bubble } from '@/lib/types'

interface BubbleMapProps {
  bubbles: Bubble[]
  onBubbleSelect: (bubble: Bubble) => void
}

export function BubbleMap({ bubbles, onBubbleSelect }: BubbleMapProps) {
  const geographicBubbles = bubbles.filter(b => b.type === 'geographic')
  const thematicBubbles = bubbles.filter(b => b.type === 'thematic')

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold mb-4">Geographic Contexts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {geographicBubbles.map((bubble, index) => (
            <BubbleCard 
              key={bubble.id}
              bubble={bubble}
              onClick={() => onBubbleSelect(bubble)}
              index={index}
            />
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Thematic Domains</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {thematicBubbles.map((bubble, index) => (
            <BubbleCard 
              key={bubble.id}
              bubble={bubble}
              onClick={() => onBubbleSelect(bubble)}
              index={index}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

interface BubbleCardProps {
  bubble: Bubble
  onClick: () => void
  index: number
}

function BubbleCard({ bubble, onClick, index }: BubbleCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
    >
      <Card 
        className="p-6 cursor-pointer hover:shadow-lg hover:border-primary/50 transition-all duration-200"
        onClick={onClick}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-1">{bubble.name}</h3>
            <p className="text-sm text-muted-foreground capitalize">
              {bubble.level || bubble.domain}
            </p>
          </div>
          <ArrowsOut size={20} className="text-muted-foreground" />
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5">
            <WarningCircle size={16} className="text-muted-foreground" />
            <span className="text-sm font-mono">{bubble.problemCount}</span>
            <span className="text-xs text-muted-foreground">problems</span>
          </div>
          
          <div className="flex items-center gap-1.5">
            <Lightbulb size={16} className="text-muted-foreground" />
            <span className="text-sm font-mono">{bubble.proposalCount}</span>
            <span className="text-xs text-muted-foreground">proposals</span>
          </div>

          {bubble.activeAlerts > 0 && (
            <Badge variant="destructive" className="ml-auto">
              <WarningDiamond size={12} className="mr-1" />
              {bubble.activeAlerts}
            </Badge>
          )}
        </div>
      </Card>
    </motion.div>
  )
}
