import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import type { Problem } from '@/lib/types'

interface ProblemListProps {
  problems: Problem[]
}

export function ProblemList({ problems }: ProblemListProps) {
  if (problems.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No problems reported yet.</p>
        <p className="text-sm mt-2">Use "Report Problem" to submit the first anonymous entry.</p>
      </div>
    )
  }

  const sortedProblems = [...problems].sort((a, b) => b.aggregatedPriority - a.aggregatedPriority)
  const maxPriority = Math.max(...problems.map(p => p.aggregatedPriority))

  return (
    <div className="space-y-4">
      {sortedProblems.map(problem => (
        <Card key={problem.id} className="p-4">
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <Badge variant="outline" className="mb-2">{problem.category}</Badge>
                <p className="text-sm">{problem.description}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Priority</p>
                <p className="text-lg font-mono font-semibold text-warning">
                  {Math.round(problem.aggregatedPriority)}
                </p>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Aggregated Priority Score</span>
                <span className="font-mono">{problem.anonymousVotes} anonymous inputs</span>
              </div>
              <Progress 
                value={(problem.aggregatedPriority / maxPriority) * 100} 
                className="h-2"
              />
            </div>

            <div className="text-xs text-muted-foreground font-mono">
              {new Date(problem.timestamp).toLocaleString()}
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
