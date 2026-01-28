import { Eye, LockKey, Network, Target, Database } from '@phosphor-icons/react'
import { Badge } from '@/components/ui/badge'

export function Header() {
  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-4 py-4 max-w-7xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-md flex items-center justify-center">
              <Eye size={24} weight="bold" className="text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">The Record</h1>
              <p className="text-sm text-muted-foreground">Transparent Collective Decision System</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-3">
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
            
            <div className="text-right">
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
