import { Eye } from '@phosphor-icons/react'

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
            <div className="text-right">
              <p className="text-xs uppercase tracking-wide text-muted-foreground font-medium">Status</p>
              <p className="text-sm font-mono text-success">All Systems Operational</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
