import { useState, useEffect } from 'react'
import { Eye, LockKey, Network, Target, Database, Question } from '@phosphor-icons/react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

export function Header() {
  const [showHelp, setShowHelp] = useState(false)

  return (
    <header className="border-b border-border bg-card sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 max-w-7xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-md flex items-center justify-center">
              <Eye size={24} weight="bold" className="text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">The Record</h1>
              <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">Transparent Collective Decision System</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 sm:gap-6">
            <div className="hidden lg:flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <LockKey size={14} className="text-primary" />
                <span className="text-xs text-muted-foreground">L1</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Network size={14} className="text-success" />
                <span className="text-xs text-muted-foreground">L2</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Target size={14} className="text-prediction" />
                <span className="text-xs text-muted-foreground">L3</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Eye size={14} className="text-warning" />
                <span className="text-xs text-muted-foreground">L4</span>
              </div>
            </div>
            
            <Dialog open={showHelp} onOpenChange={setShowHelp}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" title="Help">
                  <Question size={20} />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>The Record - User Guide</DialogTitle>
                  <DialogDescription>
                    A 4-layer transparent decision system
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 text-sm">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 font-semibold">
                      <LockKey size={16} className="text-primary" />
                      <span>L1 - Private Consensus Engine</span>
                    </div>
                    <p className="text-muted-foreground">
                      Submit problems anonymously. No identity tracking, only aggregated patterns visible.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 font-semibold">
                      <Network size={16} className="text-success" />
                      <span>L2 - Distributed Constraint Network</span>
                    </div>
                    <p className="text-muted-foreground">
                      Multi-validator checks for feasibility, budget, legality, and impact before proposals advance.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 font-semibold">
                      <Target size={16} className="text-prediction" />
                      <span>L3 - Decentralized Accountability Mesh</span>
                    </div>
                    <p className="text-muted-foreground">
                      All proposals require measurable predictions. Accuracy determines influence weight over time.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 font-semibold">
                      <Eye size={16} className="text-warning" />
                      <span>L4 - Independent Meta-Layer</span>
                    </div>
                    <p className="text-muted-foreground">
                      System monitoring detects drift, bias, and capture attempts. Immutable black box records all events.
                    </p>
                  </div>

                  <div className="pt-4 border-t space-y-2">
                    <p className="font-semibold">Quick Actions:</p>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>Click bubbles on globe/map to explore contexts</li>
                      <li>Report problems anonymously in any bubble</li>
                      <li>Submit proposals with required predictions</li>
                      <li>Track validation results and accuracy scores</li>
                      <li>Export data for external analysis</li>
                    </ul>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            
            <div className="text-right hidden sm:block">
              <p className="text-xs uppercase tracking-wide text-muted-foreground font-medium">Status</p>
              <div className="flex items-center gap-2">
                <Database size={12} className="text-success" />
                <p className="text-sm font-mono text-success">Operational</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
