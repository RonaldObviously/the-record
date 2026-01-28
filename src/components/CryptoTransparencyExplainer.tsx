import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { HardDrives, Globe, ShieldCheck, Warning, Check, X, CloudArrowUp, Database, Lock } from '@phosphor-icons/react'

export function CryptoTransparencyExplainer() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <ShieldCheck size={16} className="mr-1.5" />
          Storage Security
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0 gap-0">
        <div className="px-6 pt-6 pb-4 shrink-0">
          <DialogHeader>
            <DialogTitle className="text-2xl font-mono">How We Prevent Capture</DialogTitle>
            <DialogDescription className="text-base">
              Why THE RECORD can't be controlled by any single entity—explained simply
            </DialogDescription>
          </DialogHeader>
        </div>

        <ScrollArea className="flex-1 overflow-auto">
          <Tabs defaultValue="problem" className="mt-6 pb-6 px-6 pr-10">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="problem">The Problem</TabsTrigger>
            <TabsTrigger value="solution">Our Solution</TabsTrigger>
            <TabsTrigger value="technical">How It Works</TabsTrigger>
            <TabsTrigger value="guarantees">Guarantees</TabsTrigger>
          </TabsList>

          <TabsContent value="problem" className="space-y-4 mt-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Why Traditional Systems Fail</h3>
              <div className="space-y-3">
                <Card className="p-4 border-destructive/50">
                  <div className="flex items-start gap-3">
                    <Warning size={24} className="text-destructive mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-destructive mb-1">Centralized Hosting</div>
                      <p className="text-sm text-muted-foreground">
                        When data lives on one company's servers, that company controls access, can delete records, or be forced to censor by governments.
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-4 border-destructive/50">
                  <div className="flex items-start gap-3">
                    <Warning size={24} className="text-destructive mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-destructive mb-1">Single Point of Failure</div>
                      <p className="text-sm text-muted-foreground">
                        If the hosting company goes bankrupt, gets hacked, or faces legal action—all data can disappear instantly.
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-4 border-destructive/50">
                  <div className="flex items-start gap-3">
                    <Warning size={24} className="text-destructive mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-destructive mb-1">Hidden Modification</div>
                      <p className="text-sm text-muted-foreground">
                        Database administrators can alter records, delete inconvenient reports, or manipulate outcomes without detection.
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-4 border-destructive/50">
                  <div className="flex items-start gap-3">
                    <Warning size={24} className="text-destructive mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-destructive mb-1">Trust Dependency</div>
                      <p className="text-sm text-muted-foreground">
                        You must trust the platform owner to be honest, neutral, and competent. Trust is a single point of failure.
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            <Card className="p-4 bg-accent/10 border-accent">
              <div className="font-semibold mb-2">The Core Question:</div>
              <p className="text-sm">
                "If THE RECORD is hosted by someone, couldn't they just delete everything? Couldn't a government force them to censor reports?"
              </p>
              <p className="text-sm mt-2 font-semibold text-accent">
                Answer: Yes—if we used traditional hosting. That's why we don't.
              </p>
            </Card>
          </TabsContent>

          <TabsContent value="solution" className="space-y-4 mt-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Multi-Layer Decentralized Storage</h3>
              <p className="text-sm text-muted-foreground mb-4">
                THE RECORD uses a combination of proven decentralized technologies. No single entity controls the data.
              </p>

              <div className="space-y-3">
                <Card className="p-4 border-primary">
                  <div className="flex items-start gap-3">
                    <Globe size={24} className="text-primary mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="font-semibold mb-1">Layer 1: IPFS (Content Storage)</div>
                      <p className="text-sm text-muted-foreground mb-2">
                        InterPlanetary File System - distributed file storage where data is identified by its cryptographic hash, not location.
                      </p>
                      <Badge variant="outline" className="text-xs">Content-Addressed</Badge>
                      <Badge variant="outline" className="text-xs ml-2">P2P Network</Badge>
                    </div>
                  </div>
                </Card>

                <Card className="p-4 border-primary">
                  <div className="flex items-start gap-3">
                    <Database size={24} className="text-primary mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="font-semibold mb-1">Layer 2: Gun.js (Real-Time Sync)</div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Decentralized database that syncs directly between users' browsers. No central server required.
                      </p>
                      <Badge variant="outline" className="text-xs">Real-Time</Badge>
                      <Badge variant="outline" className="text-xs ml-2">Conflict Resolution</Badge>
                    </div>
                  </div>
                </Card>

                <Card className="p-4 border-primary">
                  <div className="flex items-start gap-3">
                    <CloudArrowUp size={24} className="text-primary mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="font-semibold mb-1">Layer 3: Arweave (Permanent Archive)</div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Blockchain designed for permanent storage. Pay once, store forever. Economically guaranteed to never delete.
                      </p>
                      <Badge variant="outline" className="text-xs">Immutable</Badge>
                      <Badge variant="outline" className="text-xs ml-2">200-Year Guarantee</Badge>
                    </div>
                  </div>
                </Card>

                <Card className="p-4 border-primary">
                  <div className="flex items-start gap-3">
                    <HardDrives size={24} className="text-primary mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="font-semibold mb-1">Layer 4: Community Pinning</div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Volunteers worldwide keep copies of the data. Geographic distribution prevents regional censorship.
                      </p>
                      <Badge variant="outline" className="text-xs">Volunteer Network</Badge>
                      <Badge variant="outline" className="text-xs ml-2">Global Distribution</Badge>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="technical" className="space-y-4 mt-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">How Data Flows Through The System</h3>
              
              <div className="space-y-4">
                <div>
                  <div className="font-semibold text-sm mb-2">Step 1: Signal Submission</div>
                  <Card className="p-3 bg-muted/50">
                    <code className="text-xs font-mono">
                      User submits: "Pothole at Main & 5th"<br/>
                      → Hash generated: QmX7k3...<br/>
                      → Stored in Gun.js P2P network<br/>
                      → Synced to IPFS within 2 seconds<br/>
                      → Pinned by 5+ community nodes
                    </code>
                  </Card>
                </div>

                <div>
                  <div className="font-semibold text-sm mb-2">Step 2: Clustering & Validation</div>
                  <Card className="p-3 bg-muted/50">
                    <code className="text-xs font-mono">
                      5 signals in same H3 cell cluster<br/>
                      → Problem created with all signal refs<br/>
                      → Validators check consistency (BFT)<br/>
                      → 2/3 consensus required to advance<br/>
                      → Problem hash stored on IPFS
                    </code>
                  </Card>
                </div>

                <div>
                  <div className="font-semibold text-sm mb-2">Step 3: Proposal & Settlement</div>
                  <Card className="p-3 bg-muted/50">
                    <code className="text-xs font-mono">
                      Proposal submitted with predictions<br/>
                      → Validators check constraints<br/>
                      → Settlement event created<br/>
                      → <strong>Archived to Arweave (permanent)</strong><br/>
                      → Influence adjustments logged forever
                    </code>
                  </Card>
                </div>

                <div>
                  <div className="font-semibold text-sm mb-2">Step 4: Verification</div>
                  <Card className="p-3 bg-muted/50">
                    <code className="text-xs font-mono">
                      Anyone can verify:<br/>
                      1. Download signal from IPFS by hash<br/>
                      2. Check hash chain integrity<br/>
                      3. Query Arweave for settlement proof<br/>
                      4. Verify cryptographic signatures<br/>
                      → If data is tampered, hash won't match
                    </code>
                  </Card>
                </div>
              </div>
            </div>

            <Card className="p-4 bg-primary/10 border-primary mt-6">
              <div className="font-semibold mb-2 flex items-center gap-2">
                <Lock size={18} />
                Cryptographic Guarantee
              </div>
              <p className="text-sm">
                Every piece of data is identified by its SHA-256 hash. Changing even one character creates a completely different hash. This makes tampering mathematically detectable.
              </p>
            </Card>
          </TabsContent>

          <TabsContent value="guarantees" className="space-y-4 mt-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">What We CAN Guarantee</h3>
              <div className="space-y-2">
                <Card className="p-3 border-success/50">
                  <div className="flex items-start gap-2">
                    <Check size={20} className="text-success mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <strong>Tamper Detection:</strong> Hash chains make any modification immediately detectable by anyone
                    </div>
                  </div>
                </Card>

                <Card className="p-3 border-success/50">
                  <div className="flex items-start gap-2">
                    <Check size={20} className="text-success mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <strong>No Single Point of Failure:</strong> Data exists on 100+ nodes worldwide, no central server to attack
                    </div>
                  </div>
                </Card>

                <Card className="p-3 border-success/50">
                  <div className="flex items-start gap-2">
                    <Check size={20} className="text-success mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <strong>Permanent Archive:</strong> Critical settlements stored on Arweave with 200-year economic guarantee
                    </div>
                  </div>
                </Card>

                <Card className="p-3 border-success/50">
                  <div className="flex items-start gap-2">
                    <Check size={20} className="text-success mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <strong>Byzantine Fault Tolerance:</strong> System works correctly even if 33% of validators are malicious
                    </div>
                  </div>
                </Card>

                <Card className="p-3 border-success/50">
                  <div className="flex items-start gap-2">
                    <Check size={20} className="text-success mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <strong>Content Addressing:</strong> Files identified by content hash, not URLs—impossible to censor by location
                    </div>
                  </div>
                </Card>

                <Card className="p-3 border-success/50">
                  <div className="flex items-start gap-2">
                    <Check size={20} className="text-success mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <strong>Open Verification:</strong> Anyone can audit the entire system at any time—full transparency
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-3">What We CANNOT Guarantee</h3>
              <div className="space-y-2">
                <Card className="p-3 border-muted">
                  <div className="flex items-start gap-2">
                    <X size={20} className="text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-muted-foreground">
                      <strong>100% Uptime:</strong> P2P networks have natural variability; occasional sync delays possible
                    </div>
                  </div>
                </Card>

                <Card className="p-3 border-muted">
                  <div className="flex items-start gap-2">
                    <X size={20} className="text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-muted-foreground">
                      <strong>Instant Global Sync:</strong> Eventual consistency model means changes propagate within seconds to minutes
                    </div>
                  </div>
                </Card>

                <Card className="p-3 border-muted">
                  <div className="flex items-start gap-2">
                    <X size={20} className="text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-muted-foreground">
                      <strong>Zero Cost:</strong> Decentralization requires infrastructure; Arweave storage and pinning services cost ~$100/month
                    </div>
                  </div>
                </Card>

                <Card className="p-3 border-muted">
                  <div className="flex items-start gap-2">
                    <X size={20} className="text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-muted-foreground">
                      <strong>Unstoppable Access:</strong> Governments can still block DNS or IPs; use Tor or IPFS gateways to access
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            <Card className="p-4 bg-accent/10 border-accent mt-6">
              <div className="font-semibold mb-2">Bottom Line</div>
              <p className="text-sm">
                We trade perfect uptime and instant sync for something more important: <strong>no single entity can control, censor, or delete the record of what happened.</strong>
              </p>
              <p className="text-sm mt-2">
                This is the only way to build a coordination system that survives capture attempts.
              </p>
            </Card>
          </TabsContent>
        </Tabs>
      </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
