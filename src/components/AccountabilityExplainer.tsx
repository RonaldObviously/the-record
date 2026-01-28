import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  ShieldCheck, 
  Warning, 
  Scales, 
  Camera,
  UserCircle,
  CheckCircle,
  XCircle,
  ArrowRight
} from '@phosphor-icons/react'

interface AccountabilityExplainerProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function AccountabilityExplainer({ open, onOpenChange }: AccountabilityExplainerProps) {
  const [isOpen, setIsOpen] = useState(open ?? false)

  const handleOpenChange = (newOpen: boolean) => {
    setIsOpen(newOpen)
    onOpenChange?.(newOpen)
  }

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => handleOpenChange(true)}>
        <ShieldCheck size={16} className="mr-2" />
        Accountability
      </Button>

      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className="p-2 bg-amber-500/10 rounded-lg">
                <ShieldCheck size={24} className="text-amber-600" />
              </div>
              Work Quality & Accountability System
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <Card className="p-6 bg-amber-500/5 border-amber-500/20">
              <h3 className="font-semibold mb-3">The Problem: Accidents vs. Negligence</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Consider a welder who claims a bounty for fixing a bridge. The weld looks fine on the surface, but it's structurally unsound. 
                A month later, the bridge fails and someone gets hurt.
              </p>
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">The Question:</strong> How does The Record distinguish between:
              </p>
              <ul className="list-disc list-inside text-sm text-muted-foreground mt-2 space-y-1">
                <li>Honest accidents (materials failed unexpectedly)</li>
                <li>Negligence (didn't follow proper welding procedures)</li>
                <li>Fraud (knowingly did shoddy work to save time/money)</li>
              </ul>
            </Card>

            <Tabs defaultValue="inspection" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="inspection">Inspections</TabsTrigger>
                <TabsTrigger value="incidents">Incidents</TabsTrigger>
                <TabsTrigger value="penalties">Penalties</TabsTrigger>
                <TabsTrigger value="example">Example</TabsTrigger>
              </TabsList>

              <TabsContent value="inspection" className="space-y-4 mt-6">
                <h3 className="font-semibold">Multi-Layer Quality Inspection</h3>
                
                <div className="space-y-3">
                  <Card className="p-4">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="p-2 bg-primary/10 rounded">
                        <UserCircle size={20} className="text-primary" />
                      </div>
                      <div>
                        <div className="font-semibold text-sm">1. Peer Inspection (Free)</div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Community members with relevant experience can visually inspect the work. 
                          Good for simple tasks like "paint the fence" or "clean the park."
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Camera size={14} />
                      Photo evidence required
                    </div>
                  </Card>

                  <Card className="p-4">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="p-2 bg-accent/10 rounded">
                        <ShieldCheck size={20} className="text-accent" />
                      </div>
                      <div>
                        <div className="font-semibold text-sm">2. Professional Inspection (Costs Influence)</div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Verified professionals (engineers, licensed contractors) perform detailed inspections. 
                          Required for critical infrastructure: bridges, electrical, plumbing, structural work.
                        </p>
                      </div>
                    </div>
                    <div className="text-xs">
                      <Badge variant="outline" className="mr-2">Structural analysis</Badge>
                      <Badge variant="outline" className="mr-2">Code compliance</Badge>
                      <Badge variant="outline">Safety certification</Badge>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="p-2 bg-green-500/10 rounded">
                        <CheckCircle size={20} className="text-green-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-sm">3. Independent Third-Party (High-Stakes)</div>
                        <p className="text-xs text-muted-foreground mt-1">
                          For high-value or public-safety work, independent auditors with no stake in the outcome 
                          perform comprehensive inspections. Their reputation is on the line.
                        </p>
                      </div>
                    </div>
                    <div className="text-xs text-amber-600 font-semibold">
                      Inspector's influence is bonded - they lose it if their approval was wrong
                    </div>
                  </Card>

                  <Card className="p-4">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="p-2 bg-blue-500/10 rounded">
                        <Camera size={20} className="text-blue-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-sm">4. Automated Sensor Verification</div>
                        <p className="text-xs text-muted-foreground mt-1">
                          IoT sensors can provide objective data: load tests for bridges, water quality tests, 
                          thermal imaging for insulation. No human bias.
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="incidents" className="space-y-4 mt-6">
                <h3 className="font-semibold">Incident Reporting & Investigation</h3>
                
                <p className="text-sm text-muted-foreground">
                  When something goes wrong after work is completed, The Record has a formal incident investigation process:
                </p>

                <div className="space-y-3">
                  <Card className="p-4 border-l-4 border-l-amber-500">
                    <div className="font-semibold text-sm mb-2">Step 1: Incident Report</div>
                    <p className="text-xs text-muted-foreground">
                      Anyone can file an incident report. It's logged immutably in the Black Box with:
                    </p>
                    <ul className="list-disc list-inside text-xs text-muted-foreground mt-2 space-y-1">
                      <li>What happened (description, photos, witness statements)</li>
                      <li>Severity (minor, moderate, serious, catastrophic)</li>
                      <li>Injuries or property damage</li>
                      <li>Timestamp and location</li>
                    </ul>
                  </Card>

                  <div className="flex justify-center">
                    <ArrowRight size={24} className="text-muted-foreground" />
                  </div>

                  <Card className="p-4 border-l-4 border-l-blue-500">
                    <div className="font-semibold text-sm mb-2">Step 2: Root Cause Analysis</div>
                    <p className="text-xs text-muted-foreground mb-2">
                      The system (with help from AI and expert validators) determines:
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2 bg-muted rounded">
                        <div className="font-semibold mb-1">Design Flaw</div>
                        <div className="text-muted-foreground">The plan was bad</div>
                      </div>
                      <div className="p-2 bg-muted rounded">
                        <div className="font-semibold mb-1">Material Failure</div>
                        <div className="text-muted-foreground">Unpredictable failure</div>
                      </div>
                      <div className="p-2 bg-muted rounded">
                        <div className="font-semibold mb-1">Human Error</div>
                        <div className="text-muted-foreground">Honest mistake</div>
                      </div>
                      <div className="p-2 bg-destructive/10 rounded border border-destructive/20">
                        <div className="font-semibold mb-1 text-destructive">Negligence</div>
                        <div className="text-muted-foreground">Didn't follow procedure</div>
                      </div>
                      <div className="p-2 bg-destructive/10 rounded border border-destructive/20">
                        <div className="font-semibold mb-1 text-destructive">Fraud</div>
                        <div className="text-muted-foreground">Knowingly did bad work</div>
                      </div>
                      <div className="p-2 bg-destructive/10 rounded border border-destructive/20">
                        <div className="font-semibold mb-1 text-destructive">Poor Inspection</div>
                        <div className="text-muted-foreground">Inspector missed it</div>
                      </div>
                    </div>
                  </Card>

                  <div className="flex justify-center">
                    <ArrowRight size={24} className="text-muted-foreground" />
                  </div>

                  <Card className="p-4 border-l-4 border-l-destructive">
                    <div className="font-semibold text-sm mb-2">Step 3: Responsibility Assignment</div>
                    <p className="text-xs text-muted-foreground mb-3">
                      The system assigns responsibility percentages to all parties involved:
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 bg-muted rounded">
                        <span className="text-xs">Welder (executor)</span>
                        <Badge variant="destructive">70% responsible</Badge>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-muted rounded">
                        <span className="text-xs">Inspector</span>
                        <Badge variant="destructive">20% responsible</Badge>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-muted rounded">
                        <span className="text-xs">Design validator</span>
                        <Badge className="bg-amber-500/20 text-amber-700">10% responsible</Badge>
                      </div>
                    </div>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="penalties" className="space-y-4 mt-6">
                <h3 className="font-semibold">Influence Penalties & Consequences</h3>

                <Card className="p-6 bg-accent/5 border-accent/20">
                  <h4 className="font-semibold mb-3">Accidents Happen - Context Matters</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    The Record understands that even skilled professionals make mistakes. The penalty system is proportional and considers intent:
                  </p>

                  <div className="space-y-3">
                    <div className="p-4 bg-card rounded-lg border">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-semibold text-sm">Honest Accident</div>
                        <Badge variant="outline" className="bg-green-500/10 text-green-700">Minor Penalty</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">
                        Material failed unexpectedly, weather was worse than predicted, unforeseen complications.
                      </p>
                      <div className="text-xs">
                        <div className="text-muted-foreground">Penalty: <span className="text-foreground">-10 to -30 influence</span></div>
                        <div className="text-muted-foreground">Ban: <span className="text-foreground">None</span></div>
                        <div className="text-green-600 mt-1">✓ Can continue working immediately</div>
                      </div>
                    </div>

                    <div className="p-4 bg-card rounded-lg border border-amber-500/20">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-semibold text-sm">Negligence</div>
                        <Badge variant="outline" className="bg-amber-500/20 text-amber-700">Moderate Penalty</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">
                        Didn't follow safety procedures, skipped inspection steps, used wrong materials to save money.
                      </p>
                      <div className="text-xs">
                        <div className="text-muted-foreground">Penalty: <span className="text-foreground">-50 to -200 influence</span></div>
                        <div className="text-muted-foreground">Ban: <span className="text-foreground">7-30 days</span></div>
                        <div className="text-amber-600 mt-1">⚠️ Retraining required</div>
                      </div>
                    </div>

                    <div className="p-4 bg-destructive/5 rounded-lg border border-destructive/20">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-semibold text-sm">Fraud / Deliberate Harm</div>
                        <Badge variant="destructive">Severe Penalty</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">
                        Knowingly did shoddy work, lied about completion, forged inspection reports.
                      </p>
                      <div className="text-xs">
                        <div className="text-muted-foreground">Penalty: <span className="text-destructive font-semibold">All influence slashed to 0</span></div>
                        <div className="text-muted-foreground">Ban: <span className="text-destructive font-semibold">Permanent</span></div>
                        <div className="text-destructive mt-1 font-semibold">✗ Legal authorities notified</div>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="p-4 border-blue-500/20 bg-blue-500/5">
                  <h4 className="font-semibold text-sm mb-2">Inspector Accountability</h4>
                  <p className="text-xs text-muted-foreground">
                    Inspectors who approve bad work also lose influence. Their bonded influence is slashed proportionally to their responsibility.
                    This creates strong incentive for thorough inspections.
                  </p>
                </Card>
              </TabsContent>

              <TabsContent value="example" className="space-y-4 mt-6">
                <h3 className="font-semibold">Real-World Example: The Bridge Weld</h3>

                <div className="space-y-3">
                  <Card className="p-4 bg-blue-500/5 border-blue-500/20">
                    <div className="text-xs text-blue-600 font-semibold mb-2">DAY 1: PROPOSAL</div>
                    <p className="text-sm">
                      Alice submits proposal: "Repair cracked weld on pedestrian bridge support beam."
                      She bonds 150 influence and predicts completion in 2 days.
                    </p>
                  </Card>

                  <Card className="p-4 bg-green-500/5 border-green-500/20">
                    <div className="text-xs text-green-600 font-semibold mb-2">DAY 3: COMPLETION</div>
                    <p className="text-sm mb-2">
                      Alice completes the weld. She submits photos. Peer inspector Bob (who has welding experience) 
                      visually inspects and approves. Alice earns +50 influence.
                    </p>
                    <div className="text-xs text-muted-foreground">
                      Bob bonds 20 influence to his inspection approval.
                    </div>
                  </Card>

                  <Card className="p-4 bg-amber-500/5 border-amber-500/20">
                    <div className="text-xs text-amber-600 font-semibold mb-2">DAY 15: INCIDENT</div>
                    <p className="text-sm mb-2">
                      The weld cracks again during a moderate windstorm. No one is hurt, but the bridge is closed.
                    </p>
                    <div className="text-xs text-muted-foreground">
                      Community member files incident report. Investigation begins.
                    </div>
                  </Card>

                  <Card className="p-4 bg-purple-500/5 border-purple-500/20">
                    <div className="text-xs text-purple-600 font-semibold mb-2">DAY 17: ROOT CAUSE ANALYSIS</div>
                    <div className="space-y-2 text-sm">
                      <p>Professional structural engineer (paid by system) examines the weld.</p>
                      <div className="p-3 bg-muted rounded">
                        <div className="font-semibold mb-1">Finding:</div>
                        <ul className="list-disc list-inside text-xs text-muted-foreground space-y-1">
                          <li>Weld penetration was insufficient (negligence)</li>
                          <li>Visual inspection couldn't catch this (not Bob's fault)</li>
                          <li>Bridge should have required professional inspection due to public safety (system gap)</li>
                        </ul>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4 bg-destructive/5 border-destructive/20">
                    <div className="text-xs text-destructive font-semibold mb-2">DAY 18: PENALTIES APPLIED</div>
                    <div className="space-y-2">
                      <div className="p-3 bg-card rounded border">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-sm">Alice (welder)</span>
                          <Badge variant="destructive">80% responsible</Badge>
                        </div>
                        <div className="text-xs space-y-1">
                          <div className="text-muted-foreground">Original reward reversed: <span className="text-destructive">-50 influence</span></div>
                          <div className="text-muted-foreground">Negligence penalty: <span className="text-destructive">-100 influence</span></div>
                          <div className="text-muted-foreground">Ban: <span className="text-amber-600">14 days</span></div>
                          <div className="text-amber-600 mt-2">Must complete welding certification course before next proposal</div>
                        </div>
                      </div>

                      <div className="p-3 bg-card rounded border">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-sm">Bob (inspector)</span>
                          <Badge className="bg-green-500/20 text-green-700">10% responsible</Badge>
                        </div>
                        <div className="text-xs space-y-1">
                          <div className="text-muted-foreground">Bonded influence lost: <span className="text-amber-600">-10 influence</span></div>
                          <div className="text-green-600 mt-1">No ban - visual inspection was appropriate for his skill level</div>
                        </div>
                      </div>

                      <div className="p-3 bg-card rounded border">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-sm">System (policy gap)</span>
                          <Badge className="bg-blue-500/20 text-blue-700">10% responsible</Badge>
                        </div>
                        <div className="text-xs space-y-1">
                          <div className="text-blue-600">Meta-layer alert generated: Bridge infrastructure now requires professional inspection</div>
                          <div className="text-muted-foreground mt-1">Policy updated to prevent future similar incidents</div>
                        </div>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4 bg-green-500/5 border-green-500/20">
                    <div className="text-xs text-green-600 font-semibold mb-2">DAY 20: RESOLUTION</div>
                    <p className="text-sm">
                      Professional welder completes proper repair with structural engineer inspection. 
                      Bridge reopens. Alice can see exactly why her work failed and what she needs to learn.
                    </p>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>

            <Card className="p-6 bg-primary/5 border-primary/20">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Scales size={20} className="text-primary" />
                Key Principles
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <CheckCircle size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                  <p><strong>Proportional:</strong> Penalties match severity and intent. Honest mistakes aren't career-ending.</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                  <p><strong>Transparent:</strong> All investigations are public. You can see exactly why someone was penalized.</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                  <p><strong>Educational:</strong> System identifies skill gaps and suggests training, not just punishment.</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                  <p><strong>Systematic:</strong> When incidents reveal policy gaps, the meta-layer updates rules to prevent recurrence.</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                  <p><strong>Immutable:</strong> All incident reports and investigations are permanently recorded in the Black Box.</p>
                </div>
              </div>
            </Card>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
