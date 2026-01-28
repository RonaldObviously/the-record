import { Card } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BookOpen, Lightbulb, Flask, Database } from '@phosphor-icons/react'

export function ResearchSystemExplainer() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <BookOpen size={16} className="mr-1.5" />
          Research & Knowledge
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Research, Information & Ideas in THE RECORD</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[calc(90vh-8rem)] pr-4">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="research">Research</TabsTrigger>
              <TabsTrigger value="ideas">Ideas</TabsTrigger>
              <TabsTrigger value="knowledge">Knowledge</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6 mt-6">
              <div>
                <h3 className="font-semibold text-lg mb-3">The Knowledge Layer</h3>
                <p className="text-sm text-muted-foreground">
                  THE RECORD isn't just about reporting problems and proposing solutions. It's also a collective intelligence system that stores, validates, and builds upon research, ideas, and information.
                </p>
              </div>

              <div className="grid gap-4">
                <Card className="p-4">
                  <div className="flex items-start gap-3">
                    <Flask size={24} className="text-primary mt-1" />
                    <div>
                      <h4 className="font-semibold mb-2">Research Papers & Studies</h4>
                      <p className="text-sm text-muted-foreground">
                        Peer-reviewed research, technical reports, and evidence-based studies that inform decision-making. Stored on IPFS, validated by experts, linked to relevant problems.
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="flex items-start gap-3">
                    <Lightbulb size={24} className="text-accent mt-1" />
                    <div>
                      <h4 className="font-semibold mb-2">Ideas & Innovations</h4>
                      <p className="text-sm text-muted-foreground">
                        Unproven concepts, experimental approaches, and creative solutions. Anyone can submit ideas; they gain credibility through prediction accuracy and real-world testing.
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="flex items-start gap-3">
                    <Database size={24} className="text-success mt-1" />
                    <div>
                      <h4 className="font-semibold mb-2">Collective Knowledge Base</h4>
                      <p className="text-sm text-muted-foreground">
                        Accumulated wisdom from resolved problems, successful proposals, and verified outcomes. Searchable, tagged, and linked to make past learnings accessible.
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="research" className="space-y-6 mt-6">
              <div>
                <h3 className="font-semibold text-lg mb-3">How Research Works in THE RECORD</h3>
              </div>

              <Card className="p-4 bg-card/50">
                <div className="space-y-4">
                  <div>
                    <Badge variant="outline" className="mb-2">Step 1: Submission</Badge>
                    <p className="text-sm text-muted-foreground">
                      Researchers submit papers, studies, or technical reports. These can be linked to specific problems, proposals, or bubbles.
                    </p>
                    <div className="mt-2 pl-4 border-l-2 border-border">
                      <p className="text-xs font-mono text-muted-foreground">
                        Format: PDF, markdown, or IPFS hash<br/>
                        Metadata: Authors, date, methodology, key findings<br/>
                        Tags: Related categories, H3 cells, problems
                      </p>
                    </div>
                  </div>

                  <div>
                    <Badge variant="outline" className="mb-2">Step 2: Validation</Badge>
                    <p className="text-sm text-muted-foreground">
                      Professional validators in relevant fields review the research for:
                    </p>
                    <ul className="mt-2 space-y-1 text-sm">
                      <li className="flex gap-2">
                        <span className="text-accent">•</span>
                        <span>Methodological soundness</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-accent">•</span>
                        <span>Data quality and sources</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-accent">•</span>
                        <span>Reproducibility</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-accent">•</span>
                        <span>Conflicts of interest</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <Badge variant="outline" className="mb-2">Step 3: Credibility Scoring</Badge>
                    <p className="text-sm text-muted-foreground">
                      Research earns credibility through:
                    </p>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-mono text-primary">+50</span>
                        <span className="text-muted-foreground">Peer validation by 3+ professionals</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-mono text-primary">+100</span>
                        <span className="text-muted-foreground">Predictions made from research are accurate</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-mono text-primary">+25</span>
                        <span className="text-muted-foreground">Referenced by validated proposals</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-mono text-destructive">-75</span>
                        <span className="text-muted-foreground">Predictions prove false or methodology flawed</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Badge variant="outline" className="mb-2">Step 4: Integration</Badge>
                    <p className="text-sm text-muted-foreground">
                      Validated research becomes part of the decision-making process. When someone submits a proposal, the system surfaces relevant research automatically. Validators use research to assess feasibility and impact.
                    </p>
                  </div>
                </div>
              </Card>

              <div className="bg-muted/30 p-4 rounded-lg border border-border">
                <h4 className="font-semibold mb-2">Example: Water Treatment Research</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  A city has multiple signals about brown water. A university submits research on aging pipe infrastructure and corrosion patterns. Validators verify the methodology. When proposals for pipe replacement come in, the system links them to this research. Predictions about corrosion rates can be tested against actual outcomes.
                </p>
                <div className="flex gap-2 text-xs">
                  <Badge variant="secondary">Linked to 47 signals</Badge>
                  <Badge variant="secondary">Referenced by 12 proposals</Badge>
                  <Badge variant="secondary">85% prediction accuracy</Badge>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="ideas" className="space-y-6 mt-6">
              <div>
                <h3 className="font-semibold text-lg mb-3">Ideas: From Concept to Reality</h3>
                <p className="text-sm text-muted-foreground">
                  Ideas in THE RECORD are lower-confidence proposals that haven't been proven yet. They exist in a separate track where innovation can be explored without requiring full validation.
                </p>
              </div>

              <Card className="p-4 bg-card/50">
                <h4 className="font-semibold mb-3">Idea Lifecycle</h4>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-semibold">1</div>
                    <div className="flex-1">
                      <h5 className="font-semibold text-sm mb-1">Submission</h5>
                      <p className="text-sm text-muted-foreground">Anyone can submit an idea. No validation required initially.</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-semibold">2</div>
                    <div className="flex-1">
                      <h5 className="font-semibold text-sm mb-1">Community Interest</h5>
                      <p className="text-sm text-muted-foreground">Other users can signal interest, suggest refinements, or identify potential problems.</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-semibold">3</div>
                    <div className="flex-1">
                      <h5 className="font-semibold text-sm mb-1">Experimental Testing</h5>
                      <p className="text-sm text-muted-foreground">If enough interest accumulates, a small-scale test can be proposed with minimal influence bonded.</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-success/20 flex items-center justify-center text-sm font-semibold">4</div>
                    <div className="flex-1">
                      <h5 className="font-semibold text-sm mb-1">Graduation to Proposal</h5>
                      <p className="text-sm text-muted-foreground">If the experiment succeeds, the idea can graduate to a full proposal with predictions and validation.</p>
                    </div>
                  </div>
                </div>
              </Card>

              <div className="bg-accent/10 p-4 rounded-lg border border-accent/30">
                <h4 className="font-semibold mb-2">Why Ideas Matter</h4>
                <p className="text-sm text-muted-foreground">
                  Not every solution has been proven. Innovation requires space to experiment. The Ideas track allows creativity while protecting the main system from unproven approaches. Ideas that work become proposals. Ideas that fail don't damage the core system.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="knowledge" className="space-y-6 mt-6">
              <div>
                <h3 className="font-semibold text-lg mb-3">The Collective Knowledge Base</h3>
                <p className="text-sm text-muted-foreground">
                  Every problem solved, every proposal executed, and every outcome verified becomes part of the permanent knowledge base. This is how THE RECORD learns and improves over time.
                </p>
              </div>

              <Card className="p-4 bg-card/50">
                <h4 className="font-semibold mb-3">What Gets Stored</h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="secondary" className="text-xs">Problem Patterns</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      What problems occurred, where, when, and what signals predicted them. Used to detect similar patterns early.
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="secondary" className="text-xs">Solution Effectiveness</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Which proposals worked, which failed, and why. Includes actual vs predicted outcomes, costs, timelines, and side effects.
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="secondary" className="text-xs">Validator Performance</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Which validators were accurate in their assessments. Used to weight future validations.
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="secondary" className="text-xs">Prediction Accuracy</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Who made accurate predictions and in which domains. Builds reputation without identity.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-4 bg-card/50">
                <h4 className="font-semibold mb-3">How It's Used</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex gap-2">
                    <span className="text-accent font-semibold">→</span>
                    <div>
                      <span className="font-semibold">Pattern Matching:</span>
                      <span className="text-muted-foreground ml-1">When a new problem is reported, the system searches for similar past problems and surfaces relevant solutions</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <span className="text-accent font-semibold">→</span>
                    <div>
                      <span className="font-semibold">Validation Reference:</span>
                      <span className="text-muted-foreground ml-1">Validators can see how similar proposals performed in the past</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <span className="text-accent font-semibold">→</span>
                    <div>
                      <span className="font-semibold">Prediction Improvement:</span>
                      <span className="text-muted-foreground ml-1">Historical data trains better prediction models over time</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <span className="text-accent font-semibold">→</span>
                    <div>
                      <span className="font-semibold">Cross-Bubble Learning:</span>
                      <span className="text-muted-foreground ml-1">Solutions that worked in one city can be discovered by other cities facing similar problems</span>
                    </div>
                  </div>
                </div>
              </Card>

              <div className="bg-primary/10 p-4 rounded-lg border border-primary/30">
                <h4 className="font-semibold mb-2">Immutable & Decentralized</h4>
                <p className="text-sm text-muted-foreground">
                  All knowledge is stored on IPFS with cryptographic hashes in the black box ledger. No one can delete or alter the historical record. This ensures institutional memory survives political changes, power shifts, or attempted censorship.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
