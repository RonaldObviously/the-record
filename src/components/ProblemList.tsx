import { useState, useMemo } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { MagnifyingGlass } from '@phosphor-icons/react'
import type { Problem } from '@/lib/types'

interface ProblemListProps {
  problems: Problem[]
}

export function ProblemList({ problems }: ProblemListProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'priority' | 'recent'>('priority')

  const categories = useMemo(() => {
    const cats = new Set(problems.map(p => p.category))
    return ['all', ...Array.from(cats)]
  }, [problems])

  const filteredAndSortedProblems = useMemo(() => {
    let filtered = problems.filter(p => {
      const matchesSearch = searchQuery === '' || 
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter
      return matchesSearch && matchesCategory
    })

    return filtered.sort((a, b) => {
      if (sortBy === 'priority') {
        return b.aggregatedPriority - a.aggregatedPriority
      } else {
        return b.timestamp - a.timestamp
      }
    })
  }, [problems, searchQuery, categoryFilter, sortBy])

  if (problems.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No problems reported yet.</p>
        <p className="text-sm mt-2">Use "Report Problem" to submit the first anonymous entry.</p>
      </div>
    )
  }

  const maxPriority = Math.max(...problems.map(p => p.aggregatedPriority), 1)

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <MagnifyingGlass size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search problems..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map(cat => (
              <SelectItem key={cat} value={cat} className="capitalize">
                {cat === 'all' ? 'All Categories' : cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={(v) => setSortBy(v as 'priority' | 'recent')}>
          <SelectTrigger className="w-full sm:w-[150px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="priority">By Priority</SelectItem>
            <SelectItem value="recent">By Recent</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="text-xs text-muted-foreground">
        Showing {filteredAndSortedProblems.length} of {problems.length} problems
      </div>

      <div className="space-y-4">
        {filteredAndSortedProblems.map(problem => (
          <Card key={problem.id} className="p-4 hover:shadow-md transition-shadow">
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

      {filteredAndSortedProblems.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p>No problems match your filters.</p>
        </div>
      )}
    </div>
  )
}
