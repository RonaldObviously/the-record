import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Info,
  ShieldCheck,
  Eye,
  Broadcast,
  CheckCircle,
  ArrowRight,
  Lock,
  Network,
  ChartLine,
  Question,
} from '@phosphor-icons/react'
import { SignalFlowDiagram } from '@/components/SignalFlowDiagram'
import { LiveSignalFlowDemo } from '@/components/LiveSignalFlowDemo'

export function SystemExplanation() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Question size={16} className="mr-1.5" />
          How THE RECORD Works
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[85vh] flex flex-col p-0 gap-0">
        <div className="px-6 pt-6 pb-4 shrink-0">
          <DialogHeader>
            <DialogTitle className="font-mono text-2xl">Understanding THE RECORD</DialogTitle>
            <DialogDescription>
              A transparent coordination engine for collective decision-making
            </DialogDescription>
          </DialogHeader>
        </div>

        <ScrollArea className="flex-1 px-6">
          <Tabs defaultValue="intro" className="w-full pb-4 pr-4">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="intro">Overview</TabsTrigger>
            <TabsTrigger value="how">How It Works</TabsTrigger>
            <TabsTrigger value="flow">Signal Flow</TabsTrigger>
            <TabsTrigger value="demo">Live Demo</TabsTrigger>
            <TabsTrigger value="why">Why Different</TabsTrigger>
            <TabsTrigger value="layers">4 Layers</TabsTrigger>
          </TabsList>

          <TabsContent value="intro" className="space-y-6 mt-6">
            <div className="space-y-4">
              <div className="bg-accent/10 border border-accent/30 p-4 rounded-lg">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Info size={18} className="text-accent" />
                  What is THE RECORD?
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  THE RECORD is not a government, voting system, or social network. It's a{' '}
                  <strong className="text-foreground">parallel truth-and-coordination engine</strong>{' '}
                  that helps communities identify problems, propose solutions, and track outcomes
                  without political influence or hidden agendas.
                </p>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Core Principles</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex gap-3">
                    <Eye size={20} className="text-primary mt-0.5 flex-shrink-0" weight="duotone" />
                    <div>
                      <h4 className="font-semibold text-sm">Radical Transparency</h4>
                      <p className="text-xs text-muted-foreground">
                        Every decision, validation, and outcome is publicly visible and cryptographically
                        verifiable. No hidden processes, no backroom deals.
                      </p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex gap-3">
                    <Lock size={20} className="text-primary mt-0.5 flex-shrink-0" weight="duotone" />
                    <div>
                      <h4 className="font-semibold text-sm">Anonymous Input</h4>
                      <p className="text-xs text-muted-foreground">
                        Submit problems and signals privately to prevent social pressure, groupthink, and
                        retaliation. Your identity is protected while your truth is heard.
                      </p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex gap-3">
                    <ChartLine size={20} className="text-primary mt-0.5 flex-shrink-0" weight="duotone" />
                    <div>
                      <h4 className="font-semibold text-sm">Prediction-Based Influence</h4>
                      <p className="text-xs text-muted-foreground">
                        Influence cannot be bought or inherited. It's earned by making accurate predictions
                        about outcomes. Reality is the final judge.
                      </p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex gap-3">
                    <Network size={20} className="text-primary mt-0.5 flex-shrink-0" weight="duotone" />
                    <div>
                      <h4 className="font-semibold text-sm">Distributed Validation</h4>
                      <p className="text-xs text-muted-foreground">
                        No single authority controls decisions. Multiple independent validators check budget,
                        legality, feasibility, and impact before anything advances.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="how" className="space-y-6 mt-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">The Journey of a Problem</h3>

              <div className="space-y-3">
                <Card className="border-l-4 border-l-primary">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="font-mono">STEP 1</Badge>
                      <CardTitle className="text-base">Anonymous Signal Submission</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      You notice a broken water main, teacher burnout, or unsafe intersection. You submit
                      it <strong>anonymously</strong> to THE RECORD with location (H3 cell) and category.
                    </p>
                  </CardContent>
                </Card>

                <div className="flex justify-center">
                  <ArrowRight size={24} className="text-muted-foreground" />
                </div>

                <Card className="border-l-4 border-l-primary">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="font-mono">STEP 2</Badge>
                      <CardTitle className="text-base">Pattern Detection & Clustering</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      When multiple people report similar problems in the same area, AI clusters them into
                      a single verified problem. Individual signals become collective truth.
                    </p>
                  </CardContent>
                </Card>

                <div className="flex justify-center">
                  <ArrowRight size={24} className="text-muted-foreground" />
                </div>

                <Card className="border-l-4 border-l-accent">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="font-mono">STEP 3</Badge>
                      <CardTitle className="text-base">Proposal Submission</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Anyone can propose a solution. <strong>Predictions are mandatory</strong>: You must
                      predict cost, timeline, impact, and risks. This creates accountability.
                    </p>
                  </CardContent>
                </Card>

                <div className="flex justify-center">
                  <ArrowRight size={24} className="text-muted-foreground" />
                </div>

                <Card className="border-l-4 border-l-accent">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="font-mono">STEP 4</Badge>
                      <CardTitle className="text-base">Distributed Validation</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Independent validators check: Is the budget realistic? Is it legal? What are the
                      failure modes? Bad proposals die early. Good ones survive.
                    </p>
                  </CardContent>
                </Card>

                <div className="flex justify-center">
                  <ArrowRight size={24} className="text-muted-foreground" />
                </div>

                <Card className="border-l-4 border-l-success">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="font-mono">STEP 5</Badge>
                      <CardTitle className="text-base">Execution & Reality Settlement</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      When the work is done, reality is checked against predictions. If you predicted
                      accurately, your influence grows. If you were wrong, you lose influence.{' '}
                      <strong>Reality is the final judge.</strong>
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="flow" className="space-y-6 mt-6">
            <SignalFlowDiagram />
          </TabsContent>

          <TabsContent value="demo" className="space-y-6 mt-6">
            <LiveSignalFlowDemo />
          </TabsContent>

          <TabsContent value="why" className="space-y-6 mt-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Why THE RECORD is Different</h3>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">The Crisis of Traditional Systems</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <p className="text-muted-foreground">
                    Current governance fails because of:
                  </p>
                  <ul className="space-y-1.5 ml-4 text-muted-foreground">
                    <li className="flex gap-2">
                      <span className="text-destructive">•</span>
                      <span><strong>Political capture</strong> - Money and power corrupt decisions</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-destructive">•</span>
                      <span><strong>Information asymmetry</strong> - Data is weeks old and filtered</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-destructive">•</span>
                      <span><strong>Hidden incentives</strong> - Backroom deals and conflicts of interest</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-destructive">•</span>
                      <span><strong>No accountability</strong> - Politicians promise and disappear</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-destructive">•</span>
                      <span><strong>Groupthink</strong> - Social pressure silences dissent</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-success/30 bg-success/5">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <CheckCircle size={18} className="text-success" weight="fill" />
                    THE RECORD's Solution
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="space-y-2">
                    <div className="flex gap-3">
                      <span className="text-success font-bold">✓</span>
                      <div>
                        <strong>Influence cannot be bought</strong>
                        <p className="text-xs text-muted-foreground">
                          Earned only through predictive accuracy, not money or connections
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <span className="text-success font-bold">✓</span>
                      <div>
                        <strong>Real-time truth</strong>
                        <p className="text-xs text-muted-foreground">
                          Problems are visible immediately, not filtered through bureaucracy
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <span className="text-success font-bold">✓</span>
                      <div>
                        <strong>Complete transparency</strong>
                        <p className="text-xs text-muted-foreground">
                          Every decision has a cryptographic audit trail in the Black Box
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <span className="text-success font-bold">✓</span>
                      <div>
                        <strong>Prediction-based accountability</strong>
                        <p className="text-xs text-muted-foreground">
                          Your influence adjusts based on whether your predictions match reality
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <span className="text-success font-bold">✓</span>
                      <div>
                        <strong>Anonymous truth-telling</strong>
                        <p className="text-xs text-muted-foreground">
                          Report problems without fear of retaliation or social pressure
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm text-foreground italic">
                  "When you separate decision-making from power, you eliminate corruption."
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  — THE RECORD Philosophy
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="layers" className="space-y-6 mt-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">The 4-Layer Anti-Group-Failure Architecture</h3>

              <Card className="border-primary/30">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Badge className="font-mono">L1</Badge>
                    <CardTitle className="text-base">Private Consensus Engine</CardTitle>
                  </div>
                  <CardDescription>Anonymous signal submission and clustering</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p className="text-muted-foreground">
                    <strong>Purpose:</strong> Prevent groupthink, bullying, and identity-based voting
                  </p>
                  <p className="text-muted-foreground">
                    <strong>How:</strong> Submit signals anonymously. AI detects patterns and clusters
                    similar reports. Individual opinions become collective observations.
                  </p>
                  <p className="text-muted-foreground">
                    <strong>Example:</strong> 50 teachers privately report "burnout" → System clusters
                    them → "Teacher burnout" becomes a verified problem
                  </p>
                </CardContent>
              </Card>

              <Card className="border-accent/30">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Badge className="font-mono bg-accent text-accent-foreground">L2</Badge>
                    <CardTitle className="text-base">Distributed Constraint Network</CardTitle>
                  </div>
                  <CardDescription>Multi-validator proposal checking</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p className="text-muted-foreground">
                    <strong>Purpose:</strong> Prevent single experts or authorities from dominating
                  </p>
                  <p className="text-muted-foreground">
                    <strong>How:</strong> Independent nodes validate budget, legality, feasibility, and
                    impact. Each specializes in different domains. All must agree.
                  </p>
                  <p className="text-muted-foreground">
                    <strong>Example:</strong> Proposal for "24/7 transit" checked by budget validator,
                    labor-law validator, safety validator, and energy-use validator
                  </p>
                </CardContent>
              </Card>

              <Card className="border-success/30">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Badge className="font-mono bg-success text-success-foreground">L3</Badge>
                    <CardTitle className="text-base">Decentralized Accountability Mesh</CardTitle>
                  </div>
                  <CardDescription>Prediction tracking and reality settlement</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p className="text-muted-foreground">
                    <strong>Purpose:</strong> Reward accuracy, not popularity or authority
                  </p>
                  <p className="text-muted-foreground">
                    <strong>How:</strong> Every proposal requires predictions. When reality occurs,
                    predictions are checked. Accurate = gain influence. Inaccurate = lose influence.
                  </p>
                  <p className="text-muted-foreground">
                    <strong>Example:</strong> You predict "$50k cost, 3 months." Actual: "$48k, 3.5 months."
                    High accuracy → Influence increases
                  </p>
                </CardContent>
              </Card>

              <Card className="border-destructive/30">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Badge className="font-mono bg-destructive text-destructive-foreground">L4</Badge>
                    <CardTitle className="text-base">Independent Meta-Layer</CardTitle>
                  </div>
                  <CardDescription>System oversight and drift detection</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p className="text-muted-foreground">
                    <strong>Purpose:</strong> Watch for system capture, bias, and corruption
                  </p>
                  <p className="text-muted-foreground">
                    <strong>How:</strong> AI monitors voting patterns, influence distribution, and data
                    anomalies. Cannot make decisions—only warn and publish alerts.
                  </p>
                  <p className="text-muted-foreground">
                    <strong>Example:</strong> Detects 5 validators always voting together → Flags potential
                    cartel → Issues public alert
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-3 pt-4 border-t mt-4">
          <Button onClick={() => setOpen(false)}>
            Got it, let's start
            <ArrowRight size={16} className="ml-2" />
          </Button>
        </div>
      </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
