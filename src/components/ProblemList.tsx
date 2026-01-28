import type { Problem } from '@/lib/types'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDistanceToNow } from 'date-fns'

interface ProblemListProps {
  problems: Problem[]
}

const categoryColors: Record<string, string> = {
  education: 'bg-blue-500/10 text-blue-700',
  healthcare: 'bg-green-500/10 text-green-700',
  infrastructure: 'bg-orange-500/10 text-orange-700',
  climate: 'bg-teal-500/10 text-teal-700',
  safety: 'bg-red-500/10 text-red-700',
  energy: 'bg-yellow-500/10 text-yellow-700',
  housing: 'bg-purple-500/10 text-purple-700',
  economy: 'bg-indigo-500/10 text-indigo-700',
  other: 'bg-gray-500/10 text-gray-700'
}

export function ProblemList({ problems }: ProblemListProps) {
  if (problems.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No problems reported yet</p>
        <p className="text-sm mt-2">Click "Report Problem" to submit anonymously</p>
      </div>
    )
  }

  const sortedProblems = [...problems].sort((a, b) => b.priority - a.priority)

  return (
    <div className="space-y-3">
      {sortedProblems.map((problem) => (
        <Card key={problem.id} className="p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge className={categoryColors[problem.category] || categoryColors.other}>
                  {problem.category}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  Priority: {problem.priority}/10
                </span>
              </div>
              <p className="text-sm text-foreground">{problem.description}</p>
              <p className="text-xs text-muted-foreground mt-2">
                Reported {formatDistanceToNow(new Date(problem.submittedAt), { addSuffix: true })}
                {problem.anonymous && ' • Anonymous'}
              </p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
