import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Info, Shield, Eye, Lock, Users, CheckCircle, Warning, FileText, Cloud } from '@phosphor-icons/react'

export function ProfessionalVerificationExplainer() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Info size={16} />
          How Professional Verification Works
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden p-0">
        <div className="px-6 pt-6 pb-4">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield size={24} className="text-accent" />
              Professional Verification: Decentralized Trust
            </DialogTitle>
            <DialogDescription>
              How THE RECORD verifies professionals without creating a central authority
            </DialogDescription>
          </DialogHeader>
        </div>

        <ScrollArea className="h-[calc(85vh-120px)] px-6 pb-6">
          <div className="space-y-6 pr-4 pb-4">
            <Card className="p-4 bg-accent/10 border-accent/30">
              <div className="flex items-start gap-3">
                <Warning size={24} className="text-accent flex-shrink-0 mt-0.5" />
                <div className="space-y-2">
                  <h3 className="font-semibold">The Core Question</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    "If manual review is required, who does the reviewing? Wouldn't that create a 
                    central authority that could be corrupted, captured, or compromised?"
                  </p>
                  <p className="text-sm font-semibold text-accent">
                    Yes—which is why we DON'T use central review.
                  </p>
                </div>
              </div>
            </Card>

            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Shield size={20} className="text-primary" />
                Multi-Layer Verification System
              </h3>

              <div className="space-y-3">
                <Card className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-accent/20 rounded-lg shrink-0">
                      <CheckCircle size={20} className="text-accent" weight="fill" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm mb-1">Layer 1: Instant Domain Verification</h4>
                      <p className="text-xs text-muted-foreground mb-2">
                        Government (.gov), military (.mil), and educational (.edu) email domains are 
                        automatically verified using cryptographic email confirmation.
                      </p>
                      <Badge variant="outline" className="text-xs">
                        ✅ No human review needed
                      </Badge>
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-accent/20 rounded-lg shrink-0">
                      <Cloud size={20} className="text-accent" weight="fill" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm mb-1">Layer 2: Third-Party APIs</h4>
                      <p className="text-xs text-muted-foreground mb-2">
                        For many professions, we query existing public databases:
                      </p>
                      <div className="space-y-1 text-xs">
                        <div className="flex items-center gap-2">
                          <div className="w-1 h-1 rounded-full bg-accent" />
                          <span className="text-muted-foreground">Medical licenses → State medical boards</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-1 h-1 rounded-full bg-accent" />
                          <span className="text-muted-foreground">Engineering licenses → NCEES database</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-1 h-1 rounded-full bg-accent" />
                          <span className="text-muted-foreground">Contractor licenses → State licensing boards</span>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs mt-2">
                        ✅ Verified against government databases
                      </Badge>
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-accent/20 rounded-lg shrink-0">
                      <Users size={20} className="text-accent" weight="fill" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm mb-1">Layer 3: Decentralized Validator Network</h4>
                      <p className="text-xs text-muted-foreground mb-2">
                        For credentials that can't be auto-verified, we use a Byzantine Fault Tolerant 
                        validator network. Here's how it works:
                      </p>
                      <div className="space-y-2">
                        <div className="bg-muted/50 p-3 rounded-lg space-y-2 text-xs">
                          <div className="flex items-start gap-2">
                            <span className="font-mono text-accent">1.</span>
                            <div>
                              <span className="font-semibold">Document Hashing:</span>
                              <p className="text-muted-foreground">
                                Your credential is hashed using SHA-256. Only the hash is stored on-chain, 
                                never the document itself.
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <span className="font-mono text-accent">2.</span>
                            <div>
                              <span className="font-semibold">IPFS Storage:</span>
                              <p className="text-muted-foreground">
                                The encrypted document is stored on IPFS (decentralized file system). 
                                Only validators can decrypt specific fields needed for verification.
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <span className="font-mono text-accent">3.</span>
                            <div>
                              <span className="font-semibold">Random Validator Selection:</span>
                              <p className="text-muted-foreground">
                                5 validators are randomly selected from a pool of 100+ verified professionals 
                                in the same field (civil engineers review civil engineer credentials).
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <span className="font-mono text-accent">4.</span>
                            <div>
                              <span className="font-semibold">Consensus Requirement:</span>
                              <p className="text-muted-foreground">
                                4 out of 5 validators must approve. If they disagree, a new set of 5 is selected.
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <span className="font-mono text-accent">5.</span>
                            <div>
                              <span className="font-semibold">Stake & Slashing:</span>
                              <p className="text-muted-foreground">
                                Validators stake influence to participate. If they approve fraudulent credentials, 
                                they lose their stake when discovered.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs mt-2">
                        ⚠️ Requires 80+ humanity score to become a validator
                      </Badge>
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-accent/20 rounded-lg shrink-0">
                      <FileText size={20} className="text-accent" weight="fill" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm mb-1">Layer 4: Community Challenge Period</h4>
                      <p className="text-xs text-muted-foreground mb-2">
                        After verification, there's a 7-day challenge period where anyone can:
                      </p>
                      <div className="space-y-1 text-xs">
                        <div className="flex items-center gap-2">
                          <div className="w-1 h-1 rounded-full bg-accent" />
                          <span className="text-muted-foreground">Report fraudulent credentials</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-1 h-1 rounded-full bg-accent" />
                          <span className="text-muted-foreground">Submit counter-evidence</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-1 h-1 rounded-full bg-accent" />
                          <span className="text-muted-foreground">Request re-verification by different validators</span>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs mt-2">
                        ✅ Public transparency period
                      </Badge>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Lock size={20} className="text-primary" />
                Privacy & Security
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Card className="p-4">
                  <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                    <Lock size={16} className="text-accent" />
                    What's Private
                  </h4>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <CheckCircle size={12} className="text-success" />
                      <span>Your full name (unless you opt to share)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle size={12} className="text-success" />
                      <span>License numbers</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle size={12} className="text-success" />
                      <span>Home address</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle size={12} className="text-success" />
                      <span>Document images</span>
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                    <Eye size={16} className="text-accent" />
                    What's Public
                  </h4>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Eye size={12} className="text-muted-foreground" />
                      <span>Professional role (e.g., "Civil Engineer")</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Eye size={12} className="text-muted-foreground" />
                      <span>Verification status (verified/not verified)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Eye size={12} className="text-muted-foreground" />
                      <span>General jurisdiction (e.g., "California")</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Eye size={12} className="text-muted-foreground" />
                      <span>Signal weight multiplier</span>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Shield size={20} className="text-primary" />
                Why This Can Be Trusted
              </h3>

              <div className="space-y-3">
                <Card className="p-4 bg-success/5 border-success/30">
                  <div className="flex items-start gap-3">
                    <CheckCircle size={20} className="text-success flex-shrink-0 mt-0.5" weight="fill" />
                    <div>
                      <h4 className="font-semibold text-sm mb-1">No Single Point of Failure</h4>
                      <p className="text-xs text-muted-foreground">
                        There's no "THE RECORD Inc." that approves credentials. It's a network of validators 
                        who don't know each other and are randomly selected.
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-4 bg-success/5 border-success/30">
                  <div className="flex items-start gap-3">
                    <CheckCircle size={20} className="text-success flex-shrink-0 mt-0.5" weight="fill" />
                    <div>
                      <h4 className="font-semibold text-sm mb-1">Economic Disincentive for Fraud</h4>
                      <p className="text-xs text-muted-foreground">
                        Validators who approve fake credentials lose their stake. The reward for honest 
                        validation is small, but the penalty for dishonesty is large.
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-4 bg-success/5 border-success/30">
                  <div className="flex items-start gap-3">
                    <CheckCircle size={20} className="text-success flex-shrink-0 mt-0.5" weight="fill" />
                    <div>
                      <h4 className="font-semibold text-sm mb-1">Public Audit Trail</h4>
                      <p className="text-xs text-muted-foreground">
                        Every credential verification is logged in the Black Box with cryptographic hashes. 
                        You can trace who validated what and when.
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-4 bg-success/5 border-success/30">
                  <div className="flex items-start gap-3">
                    <CheckCircle size={20} className="text-success flex-shrink-0 mt-0.5" weight="fill" />
                    <div>
                      <h4 className="font-semibold text-sm mb-1">Signal Weight, Not Override</h4>
                      <p className="text-xs text-muted-foreground">
                        Even verified professionals don't get to override consensus. They just contribute 
                        weighted signals. If 100 citizens report a water main break and 1 engineer says 
                        "it's fine," the 100 citizens still win.
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-4 bg-success/5 border-success/30">
                  <div className="flex items-start gap-3">
                    <CheckCircle size={20} className="text-success flex-shrink-0 mt-0.5" weight="fill" />
                    <div>
                      <h4 className="font-semibold text-sm mb-1">Revocable Credentials</h4>
                      <p className="text-xs text-muted-foreground">
                        If a professional submits false signals repeatedly, their credentials can be revoked 
                        by community vote (requiring 2/3 majority of local validators).
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            <Separator />

            <Card className="p-4 bg-muted/50">
              <h3 className="font-semibold text-sm mb-3">Example Verification Flow</h3>
              <div className="space-y-2 text-xs font-mono">
                <div className="flex gap-2">
                  <span className="text-accent">→</span>
                  <span className="text-muted-foreground">Alice submits civil engineering license</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-accent">→</span>
                  <span className="text-muted-foreground">Document is hashed: 8f3a9...</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-accent">→</span>
                  <span className="text-muted-foreground">System checks NCEES database: ✓ Found</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-accent">→</span>
                  <span className="text-muted-foreground">Status changed to "verified" (instant)</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-accent">→</span>
                  <span className="text-muted-foreground">7-day challenge period begins</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-accent">→</span>
                  <span className="text-muted-foreground">No challenges received</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-success">✓</span>
                  <span className="text-success font-semibold">Alice is now a verified civil engineer</span>
                </div>
              </div>
            </Card>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
