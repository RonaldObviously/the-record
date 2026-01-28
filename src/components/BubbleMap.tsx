import type { Bubble } from '@/lib/types'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface BubbleMapProps {
  bubbles: Bubble[]
  selectedBubbleId: string | null
  onSelectBubble: (id: string) => void
}

export function BubbleMap({ bubbles, selectedBubbleId, onSelectBubble }: BubbleMapProps) {
  const selectedBubble = bubbles.find(b => b.id === selectedBubbleId)
  const childBubbles = bubbles.filter(b => b.parentId === (selectedBubbleId || 'global'))

  if (childBubbles.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No sub-contexts available</p>
        <p className="text-sm mt-2">This is a leaf node in the hierarchy</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {childBubbles.map((bubble) => (
        <Card
          key={bubble.id}
          className="p-4 hover:border-primary cursor-pointer transition-colors"
          onClick={() => onSelectBubble(bubble.id)}
        >
          <div className="flex flex-col gap-2">
            <div className="flex items-start justify-between">
              <h3 className="font-semibold text-foreground">{bubble.name}</h3>
              <span className="text-xs px-2 py-0.5 bg-muted rounded text-muted-foreground">
                {bubble.type}
              </span>
            </div>
            
            {bubble.population && (
              <p className="text-xs text-muted-foreground">
                Pop: {(bubble.population / 1000000).toFixed(1)}M
              </p>
            )}
            
            <p className="text-sm text-muted-foreground line-clamp-2">
              {bubble.description}
            </p>
            
            <div className="flex gap-4 mt-2 text-xs">
              <span className="text-muted-foreground">
                {bubble.activeProblems} problems
              </span>
              <span className="text-muted-foreground">
                {bubble.activeProposals} proposals
              </span>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
