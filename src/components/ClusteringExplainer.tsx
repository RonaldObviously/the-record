import { Card } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Info, ArrowRight, Stack, Globe } from '@phosphor-icons/react'

export function ClusteringExplainer() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Stack size={16} className="mr-1.5" />
          How Clustering Works
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Signal Clustering & Global Issue Detection</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[calc(90vh-8rem)] pr-4">
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-3">The Clustering Hierarchy</h3>
              <p className="text-sm text-muted-foreground mb-4">
                THE RECORD uses a multi-level clustering system to surface issues from local to global scale.
              </p>
            </div>

            <Card className="p-4 bg-card/50">
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="mt-0.5">Level 1</Badge>
                <div className="flex-1">
                  <h4 className="font-semibold mb-2">Local Signal Clustering</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Individual signals in the same H3 cell (≈500m radius) with the same category automatically cluster together.
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Threshold:</span>
                      <span className="font-mono">3+ signals</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Result:</span>
                      <span>Forms a <strong>Local Cluster</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Example:</span>
                      <span className="text-xs">5 people report "pothole" at same intersection → <strong>Local Road Damage Cluster</strong></span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <div className="flex items-center justify-center">
              <ArrowRight size={24} className="text-muted-foreground" />
            </div>

            <Card className="p-4 bg-card/50">
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="mt-0.5">Level 2</Badge>
                <div className="flex-1">
                  <h4 className="font-semibold mb-2">District Pattern Recognition</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    When multiple local clusters form in neighboring H3 cells, they merge into a district-level pattern.
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Threshold:</span>
                      <span className="font-mono">3+ neighboring clusters OR 50+ total weight</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Result:</span>
                      <span>Forms a <strong>District Problem</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Example:</span>
                      <span className="text-xs">10 blocks report potholes → <strong>District Infrastructure Degradation</strong></span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <div className="flex items-center justify-center">
              <ArrowRight size={24} className="text-muted-foreground" />
            </div>

            <Card className="p-4 bg-card/50">
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="mt-0.5">Level 3</Badge>
                <div className="flex-1">
                  <h4 className="font-semibold mb-2">City/Regional Trends</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    District problems with semantic similarity and geographic proximity merge into city-wide issues.
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Threshold:</span>
                      <span className="font-mono">5+ district problems OR 200+ total weight</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Result:</span>
                      <span>Forms a <strong>Regional Crisis</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Example:</span>
                      <span className="text-xs">Entire city reports infrastructure issues → <strong>Citywide Infrastructure Crisis</strong></span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <div className="flex items-center justify-center">
              <ArrowRight size={24} className="text-muted-foreground" />
            </div>

            <Card className="p-4 bg-card/50 border-accent">
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="mt-0.5 border-accent text-accent">Level 4</Badge>
                <div className="flex-1">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Globe size={18} />
                    Global Issue Emergence
                  </h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    When the same pattern appears across multiple regions/nations, it becomes a global issue requiring coordinated response.
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Threshold:</span>
                      <span className="font-mono">3+ regional crises across different nations OR 1000+ total weight</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Result:</span>
                      <span>Forms a <strong>Global Coordinated Problem</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Example:</span>
                      <span className="text-xs">Multiple countries report aging infrastructure → <strong>Global Infrastructure Investment Crisis</strong></span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <div className="bg-muted/30 p-4 rounded-lg border border-border">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Info size={18} />
                Why This Matters
              </h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex gap-2">
                  <span className="text-accent">•</span>
                  <span><strong>Bottom-Up Truth:</strong> Global issues emerge from ground-level observations, not top-down declarations</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-accent">•</span>
                  <span><strong>No Centralized Agenda:</strong> The system mathematically surfaces what people actually experience</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-accent">•</span>
                  <span><strong>Coordinated Response:</strong> When an issue goes global, resources can be pooled across regions</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-accent">•</span>
                  <span><strong>Pattern Detection:</strong> Identifies systemic problems that wouldn't be visible at local scale</span>
                </li>
              </ul>
            </div>

            <div className="bg-secondary/20 p-4 rounded-lg border border-secondary">
              <h4 className="font-semibold mb-2">Current Implementation</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Right now, THE RECORD implements Level 1 (Local) and Level 2 (District) clustering. Levels 3-4 are designed but not yet active.
              </p>
              <p className="text-sm text-muted-foreground">
                As the network grows and more bubbles activate, higher-level clustering will automatically engage when thresholds are met.
              </p>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
