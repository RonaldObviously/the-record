import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Flask, 
  GitBranch, 
  CheckCircle, 
  XCircle, 
  Clock,
  TrendUp,
  Link as LinkIcon,
  FileText,
  Users
} from '@phosphor-icons/react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useState } from 'react'

export function ResearchSystemExplainer() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Flask size={16} className="mr-1.5" />
          Research System
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[90vh] p-0 gap-0 flex flex-col">
        <div className="px-6 pt-6 pb-4 flex-shrink-0">
          <DialogHeader>
            <DialogTitle className="font-mono text-2xl">L2.5: Research Validation Layer</DialogTitle>
            <DialogDescription>
              How THE RECORD handles research, knowledge synthesis, and evidence-based problem solving
            </DialogDescription>
          </DialogHeader>
        </div>

        <ScrollArea className="flex-1">
          <div className="px-6 pb-6 space-y-6">
            {/* Why Research Matters */}
            <Card className="p-6 bg-accent/10 border-accent">
              <div className="flex items-start gap-4">
                <Flask size={32} className="text-accent flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">Why We Need a Research Layer</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Not all problems can be solved immediately. Some require investigation, data collection, 
                    and methodical study before action. The Research Layer bridges the gap between observing 
                    a problem and knowing how to fix it.
                  </p>
                </div>
              </div>
            </Card>

            {/* Research Workflow */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Research Submission & Validation Workflow</h3>
              <div className="space-y-3">
                <Card className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-mono text-sm flex-shrink-0">
                      1
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Research Submission</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Researchers submit findings linked to specific problems. Required fields:
                      </p>
                      <ul className="text-sm space-y-1 text-muted-foreground">
                        <li className="flex items-center gap-2">
                          <CheckCircle size={14} className="text-success" />
                          <span><strong>Title & Abstract</strong> - What was studied and why</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle size={14} className="text-success" />
                          <span><strong>Methodology</strong> - How data was collected</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle size={14} className="text-success" />
                          <span><strong>Data Sources</strong> - Where information came from</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle size={14} className="text-success" />
                          <span><strong>Findings & Conclusions</strong> - What was discovered</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle size={14} className="text-success" />
                          <span><strong>Linked Problems</strong> - Which signals/problems this addresses</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-mono text-sm flex-shrink-0">
                      2
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Peer Review Process</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        3-5 randomly selected peer validators review the research on multiple criteria:
                      </p>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="bg-secondary/50 p-3 rounded">
                          <div className="font-mono text-xs text-muted-foreground mb-1">METHODOLOGY</div>
                          <div className="text-sm">Is the approach sound?</div>
                        </div>
                        <div className="bg-secondary/50 p-3 rounded">
                          <div className="font-mono text-xs text-muted-foreground mb-1">DATA QUALITY</div>
                          <div className="text-sm">Is the data reliable?</div>
                        </div>
                        <div className="bg-secondary/50 p-3 rounded">
                          <div className="font-mono text-xs text-muted-foreground mb-1">REPRODUCIBILITY</div>
                          <div className="text-sm">Can others verify this?</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-mono text-sm flex-shrink-0">
                      3
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Credibility Scoring</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Research that is later validated by real-world outcomes increases researcher influence:
                      </p>
                      <div className="bg-background/80 p-3 rounded font-mono text-sm space-y-2">
                        <div>Credibility = (Peer Review Score × 0.3) + (Citation Count × 0.2) + (Outcome Accuracy × 0.5)</div>
                        <div className="text-xs text-muted-foreground">
                          If a proposal based on your research succeeds, your credibility increases.
                          If it fails, credibility decreases.
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-success text-success-foreground font-mono text-sm flex-shrink-0">
                      4
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Publication & Knowledge Graph</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Validated research is published openly and linked in the knowledge graph:
                      </p>
                      <ul className="text-sm space-y-2">
                        <li className="flex items-start gap-2">
                          <LinkIcon size={16} className="text-accent mt-0.5 flex-shrink-0" />
                          <span><strong>Linked to Problems:</strong> Research becomes evidence supporting problem existence</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <LinkIcon size={16} className="text-accent mt-0.5 flex-shrink-0" />
                          <span><strong>Linked to Proposals:</strong> Solutions cite research as justification</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <LinkIcon size={16} className="text-accent mt-0.5 flex-shrink-0" />
                          <span><strong>Linked to Other Research:</strong> Citations create knowledge network</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <FileText size={16} className="text-success mt-0.5 flex-shrink-0" />
                          <span><strong>Stored on IPFS:</strong> Permanent, uncensorable access to all data</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            {/* Research vs Proposals */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Research vs Action Proposals</h3>
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-4 bg-blue-500/10 border-blue-500/30">
                  <div className="flex items-center gap-2 mb-3">
                    <Flask size={20} className="text-blue-500" />
                    <h4 className="font-semibold">Research Submission</h4>
                  </div>
                  <ul className="text-sm space-y-2 text-muted-foreground">
                    <li>✓ Goal: Understand the problem</li>
                    <li>✓ Output: Data, analysis, insights</li>
                    <li>✓ Validated by: Peer review</li>
                    <li>✓ Timeline: Weeks to months</li>
                    <li>✓ Influence from: Research accuracy</li>
                  </ul>
                </Card>

                <Card className="p-4 bg-green-500/10 border-green-500/30">
                  <div className="flex items-center gap-2 mb-3">
                    <GitBranch size={20} className="text-green-500" />
                    <h4 className="font-semibold">Action Proposal</h4>
                  </div>
                  <ul className="text-sm space-y-2 text-muted-foreground">
                    <li>✓ Goal: Fix the problem</li>
                    <li>✓ Output: Physical change</li>
                    <li>✓ Validated by: BFT consensus</li>
                    <li>✓ Timeline: Days to weeks</li>
                    <li>✓ Influence from: Outcome accuracy</li>
                  </ul>
                </Card>
              </div>
            </div>

            {/* Example Flow */}
            <Card className="p-6 bg-muted/50">
              <h3 className="font-semibold mb-4">Example: Lead Pipe Crisis</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <Badge variant="outline" className="flex-shrink-0 mt-0.5">L1</Badge>
                  <div>
                    <strong>Signals:</strong> 47 residents report "metallic taste in water" in H3 cell 8819abc
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Badge variant="outline" className="flex-shrink-0 mt-0.5 bg-blue-500/20 border-blue-500">L2.5</Badge>
                  <div>
                    <strong>Research Requested:</strong> Water quality testing needed. Local university submits research proposal.
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Badge variant="outline" className="flex-shrink-0 mt-0.5 bg-blue-500/20 border-blue-500">L2.5</Badge>
                  <div>
                    <strong>Research Published:</strong> "Lead levels 3x EPA limit. Source: 1950s-era pipes." 
                    Peer reviewed by 4 validators. Credibility: 94/100
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Badge variant="outline" className="flex-shrink-0 mt-0.5">L2</Badge>
                  <div>
                    <strong>Proposal Submitted:</strong> "Replace lead pipes in district 4" cites research as evidence. 
                    Budget validated. Feasibility checked.
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Badge variant="outline" className="flex-shrink-0 mt-0.5">L3</Badge>
                  <div>
                    <strong>Outcome:</strong> Pipes replaced. Water tests show lead levels normal. 
                    Research credibility +15. Proposer influence +30.
                  </div>
                </div>
              </div>
            </Card>

            {/* Why This Matters */}
            <Card className="p-6 bg-accent/5 border-accent/30">
              <h3 className="font-semibold text-lg mb-3">Why This Prevents Rushed Solutions</h3>
              <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                <p>
                  <strong className="text-foreground">Without research layer:</strong> People see "metallic water" 
                  and propose expensive treatments without knowing the cause. Money wasted on wrong solution.
                </p>
                <p>
                  <strong className="text-foreground">With research layer:</strong> Problem identified → Research 
                  commissioned → Root cause found → Targeted solution proposed → Resources used efficiently.
                </p>
                <p className="text-accent">
                  <strong>The Research Layer turns THE RECORD from a reactive complaint system into a 
                  proactive knowledge engine.</strong>
                </p>
              </div>
            </Card>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
