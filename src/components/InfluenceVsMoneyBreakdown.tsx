import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CurrencyDollar, Scales, Warning, CheckCircle, XCircle, ArrowsClockwise, TrendUp, ShieldCheck, Coins } from '@phosphor-icons/react'

export function InfluenceVsMoneyBreakdown() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Scales size={16} className="mr-1.5" />
          Influence vs Money
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl max-h-[90vh] flex flex-col p-0 gap-0">
        <div className="px-6 pt-6 pb-4 shrink-0">
          <DialogHeader>
            <DialogTitle className="text-2xl font-mono">The Critical Distinction: Ψ vs $</DialogTitle>
          </DialogHeader>
        </div>
        <ScrollArea className="flex-1 overflow-auto">
          <div className="px-6 pb-6 pr-10">
          <div className="space-y-6">
            <Card className="p-6 border-accent bg-accent/5">
              <div className="flex items-start gap-4">
                <Warning size={32} className="text-accent flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">Why This Matters</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    THE RECORD operates on a fundamentally different paradigm than traditional platforms.
                    Understanding the distinction between <span className="font-mono text-accent">Influence (Ψ)</span> and <span className="font-mono text-success">Money ($)</span> is
                    essential to understanding how the system prevents corruption, gaming, and capture.
                  </p>
                </div>
              </div>
            </Card>

            <Tabs defaultValue="comparison" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="comparison">Comparison</TabsTrigger>
                <TabsTrigger value="influence">Influence (Ψ)</TabsTrigger>
                <TabsTrigger value="money">Money ($)</TabsTrigger>
                <TabsTrigger value="why">Why This Design</TabsTrigger>
              </TabsList>

              <TabsContent value="comparison" className="space-y-4 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="p-6 border-primary bg-primary/5">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                        <span className="text-2xl font-mono text-primary">Ψ</span>
                      </div>
                      <h3 className="font-semibold text-lg">Influence</h3>
                    </div>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-start gap-2">
                        <CheckCircle size={16} className="text-success mt-0.5 flex-shrink-0" />
                        <span>Earned through <strong>predictive accuracy</strong></span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle size={16} className="text-success mt-0.5 flex-shrink-0" />
                        <span><strong>Cannot be bought</strong> or transferred</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle size={16} className="text-success mt-0.5 flex-shrink-0" />
                        <span><strong>Decays over time</strong> if not used</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle size={16} className="text-success mt-0.5 flex-shrink-0" />
                        <span><strong>Slashed</strong> when predictions are wrong</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle size={16} className="text-success mt-0.5 flex-shrink-0" />
                        <span>Determines <strong>proposal weight</strong></span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle size={16} className="text-success mt-0.5 flex-shrink-0" />
                        <span><strong>Zero-sum</strong> within system</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle size={16} className="text-success mt-0.5 flex-shrink-0" />
                        <span>Meritocratic: <strong>skill-based</strong></span>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-6 border-success bg-success/5">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center">
                        <CurrencyDollar size={24} className="text-success" />
                      </div>
                      <h3 className="font-semibold text-lg">Money</h3>
                    </div>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-start gap-2">
                        <Coins size={16} className="text-success mt-0.5 flex-shrink-0" />
                        <span>Optional: <strong>Fund proposals</strong> you believe in</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Coins size={16} className="text-success mt-0.5 flex-shrink-0" />
                        <span><strong>Can be transferred</strong> freely</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Coins size={16} className="text-success mt-0.5 flex-shrink-0" />
                        <span><strong>Does not decay</strong></span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Coins size={16} className="text-success mt-0.5 flex-shrink-0" />
                        <span><strong>Not slashed</strong> for inaccuracy</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Coins size={16} className="text-success mt-0.5 flex-shrink-0" />
                        <span>Determines <strong>resource allocation</strong></span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Coins size={16} className="text-success mt-0.5 flex-shrink-0" />
                        <span><strong>Not zero-sum</strong> (can grow/shrink)</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Coins size={16} className="text-success mt-0.5 flex-shrink-0" />
                        <span>Democratic: <strong>dollar-based</strong></span>
                      </div>
                    </div>
                  </Card>
                </div>

                <Card className="p-6 border-destructive bg-destructive/5">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <XCircle size={20} className="text-destructive" />
                    Critical Rule: Influence ≠ Money
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p className="text-muted-foreground">
                      <strong>You CANNOT:</strong>
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                      <li>Buy influence with money</li>
                      <li>Sell your influence for money</li>
                      <li>Transfer influence to another account</li>
                      <li>Use money to vote on problems</li>
                      <li>Use influence to withdraw money</li>
                      <li>Create influence out of thin air</li>
                    </ul>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="influence" className="space-y-4 mt-6">
                <Card className="p-6">
                  <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    <span className="text-2xl font-mono text-primary">Ψ</span>
                    How Influence Works
                  </h3>
                  
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold mb-2 text-primary">1. Earning Influence</h4>
                      <div className="bg-card border border-border rounded p-4 space-y-2 text-sm">
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0">
                            <CheckCircle size={14} className="text-success" />
                          </div>
                          <div>
                            <strong>Submit accurate signals:</strong> Report problems that get verified by others in your H3 mesh cell (+10-50 Ψ)
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0">
                            <CheckCircle size={14} className="text-success" />
                          </div>
                          <div>
                            <strong>Attest to real problems:</strong> Verify signals submitted by others in your area (+5-15 Ψ)
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0">
                            <CheckCircle size={14} className="text-success" />
                          </div>
                          <div>
                            <strong>Make accurate predictions:</strong> Propose solutions that work as predicted (+100-500 Ψ)
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0">
                            <CheckCircle size={14} className="text-success" />
                          </div>
                          <div>
                            <strong>Complete tasks:</strong> Execute on proposals and deliver results (+50-200 Ψ)
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2 text-destructive">2. Losing Influence</h4>
                      <div className="bg-card border border-border rounded p-4 space-y-2 text-sm">
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-destructive/20 flex items-center justify-center flex-shrink-0">
                            <XCircle size={14} className="text-destructive" />
                          </div>
                          <div>
                            <strong>Submit false signals:</strong> Report problems that don't exist or can't be verified (-50-200 Ψ)
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-destructive/20 flex items-center justify-center flex-shrink-0">
                            <XCircle size={14} className="text-destructive" />
                          </div>
                          <div>
                            <strong>Inaccurate predictions:</strong> Propose solutions that fail to deliver promised outcomes (-100-1000 Ψ)
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-destructive/20 flex items-center justify-center flex-shrink-0">
                            <XCircle size={14} className="text-destructive" />
                          </div>
                          <div>
                            <strong>Time decay:</strong> Unused influence decays at 2% per month (encourages active participation)
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-destructive/20 flex items-center justify-center flex-shrink-0">
                            <XCircle size={14} className="text-destructive" />
                          </div>
                          <div>
                            <strong>Spam/gaming detection:</strong> Algorithmic detection of coordination or bot behavior (-500-5000 Ψ)
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">3. Using Influence</h4>
                      <div className="bg-card border border-border rounded p-4 space-y-2 text-sm">
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                            <TrendUp size={14} className="text-primary" />
                          </div>
                          <div>
                            <strong>Proposal weight:</strong> Your Ψ determines how much your proposals are prioritized by the system
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                            <TrendUp size={14} className="text-primary" />
                          </div>
                          <div>
                            <strong>Validation authority:</strong> Higher Ψ users can validate more complex proposals
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                            <TrendUp size={14} className="text-primary" />
                          </div>
                          <div>
                            <strong>Resource allocation:</strong> Influence determines your say in how community resources are allocated
                          </div>
                        </div>
                      </div>
                    </div>

                    <Card className="p-4 bg-accent/10 border-accent">
                      <p className="text-sm font-mono">
                        <strong>Zero-Sum Rule:</strong> Total Ψ in the system is constant. When you gain influence, it comes from the 
                        Treasury Pool (filled by slashed Ψ from inaccurate participants). When you lose Ψ, it returns to the Treasury.
                      </p>
                    </Card>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="money" className="space-y-4 mt-6">
                <Card className="p-6">
                  <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    <CurrencyDollar size={24} className="text-success" />
                    How Money Works (Optional)
                  </h3>
                  
                  <div className="space-y-6">
                    <Card className="p-4 bg-accent/10 border-accent">
                      <p className="text-sm">
                        <strong>Important:</strong> Money is <em>completely optional</em> in THE RECORD. You can participate fully—submit signals, 
                        attest to problems, propose solutions—without spending a single dollar. Money only enters the system when communities 
                        want to fund the execution of proposals.
                      </p>
                    </Card>

                    <div>
                      <h4 className="font-semibold mb-2 text-success">When Money Is Used</h4>
                      <div className="bg-card border border-border rounded p-4 space-y-3 text-sm">
                        <div>
                          <strong className="text-success">1. Funding Proposals</strong>
                          <p className="text-muted-foreground mt-1">
                            Once a proposal reaches the "Validated" stage, the community can contribute money to fund its execution. 
                            This might pay for materials, labor, permits, or professional services.
                          </p>
                          <div className="mt-2 p-3 bg-muted rounded text-xs font-mono">
                            Example: "Fix the water main on Oak Street" needs $15,000 for parts and a plumber. 
                            Community members contribute $, proposal gets funded, work gets done.
                          </div>
                        </div>

                        <div>
                          <strong className="text-success">2. Bounties for Execution</strong>
                          <p className="text-muted-foreground mt-1">
                            Proposals can include bounties for completion. If you have the skills to execute, you can claim 
                            the bounty by delivering the promised outcome.
                          </p>
                          <div className="mt-2 p-3 bg-muted rounded text-xs font-mono">
                            Example: "Install bike racks at Metro Station" has a $500 bounty. A local welder completes it, 
                            provides proof, and receives $500.
                          </div>
                        </div>

                        <div>
                          <strong className="text-success">3. Infrastructure Costs</strong>
                          <p className="text-muted-foreground mt-1">
                            THE RECORD itself has operational costs (servers, storage, bandwidth). These are funded by:
                          </p>
                          <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground ml-4">
                            <li>Optional microtransactions (e.g., $0.01 per signal for priority processing)</li>
                            <li>Grants from organizations that benefit from transparent coordination</li>
                            <li>Validator node operators who stake resources</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">What Money Does NOT Do</h4>
                      <div className="bg-card border border-destructive/50 rounded p-4 space-y-2 text-sm">
                        <div className="flex items-start gap-3">
                          <XCircle size={16} className="text-destructive mt-0.5 flex-shrink-0" />
                          <div>
                            <strong>Does NOT buy influence:</strong> You cannot purchase Ψ with money under any circumstances
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <XCircle size={16} className="text-destructive mt-0.5 flex-shrink-0" />
                          <div>
                            <strong>Does NOT determine truth:</strong> Rich people can't "vote" their preferred reality into existence
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <XCircle size={16} className="text-destructive mt-0.5 flex-shrink-0" />
                          <div>
                            <strong>Does NOT guarantee proposal acceptance:</strong> Even well-funded proposals must pass validation
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <XCircle size={16} className="text-destructive mt-0.5 flex-shrink-0" />
                          <div>
                            <strong>Does NOT protect from slashing:</strong> If you make bad predictions, you lose Ψ regardless of wealth
                          </div>
                        </div>
                      </div>
                    </div>

                    <Card className="p-4 bg-primary/10 border-primary">
                      <p className="text-sm font-mono">
                        <strong>Key Principle:</strong> Money in THE RECORD is a tool for <em>resource allocation</em>, not 
                        <em>decision-making power</em>. You can't buy your way to authority—you must earn it through accuracy.
                      </p>
                    </Card>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="why" className="space-y-4 mt-6">
                <Card className="p-6">
                  <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    <ShieldCheck size={24} className="text-primary" />
                    Why This Design Prevents Corruption
                  </h3>
                  
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold mb-3 text-primary">Problem 1: Plutocracy</h4>
                      <div className="grid gap-4">
                        <Card className="p-4 bg-destructive/5 border-destructive/50">
                          <p className="text-sm mb-2"><strong>Traditional systems:</strong></p>
                          <p className="text-sm text-muted-foreground">
                            Wealthy individuals or corporations can buy influence through lobbying, campaign donations, 
                            controlling media narratives, or simply outspending opponents. This creates a "pay-to-win" 
                            environment where truth becomes whatever the richest party wants it to be.
                          </p>
                        </Card>
                        <Card className="p-4 bg-success/5 border-success/50">
                          <p className="text-sm mb-2"><strong>THE RECORD solution:</strong></p>
                          <p className="text-sm text-muted-foreground">
                            Influence is mathematically impossible to purchase. It can ONLY be earned through predictive accuracy. 
                            A billionaire with 0 Ψ has less decision-making power than a postal worker with 500 Ψ earned 
                            through accurate neighborhood observations.
                          </p>
                        </Card>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3 text-primary">Problem 2: Popularity Contests</h4>
                      <div className="grid gap-4">
                        <Card className="p-4 bg-destructive/5 border-destructive/50">
                          <p className="text-sm mb-2"><strong>Traditional systems:</strong></p>
                          <p className="text-sm text-muted-foreground">
                            Voting systems (democratic or shareholder-based) reward charisma, marketing, and social proof 
                            rather than competence. The most popular idea wins, not necessarily the most correct one.
                          </p>
                        </Card>
                        <Card className="p-4 bg-success/5 border-success/50">
                          <p className="text-sm mb-2"><strong>THE RECORD solution:</strong></p>
                          <p className="text-sm text-muted-foreground">
                            Proposals are validated against reality, not popular opinion. A proposal's success is measured 
                            by whether its predictions came true, not by how many people "liked" it. If you predicted 
                            a solution would work and it didn't, you lose Ψ—regardless of how popular you are.
                          </p>
                        </Card>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3 text-primary">Problem 3: Credential Worship</h4>
                      <div className="grid gap-4">
                        <Card className="p-4 bg-destructive/5 border-destructive/50">
                          <p className="text-sm mb-2"><strong>Traditional systems:</strong></p>
                          <p className="text-sm text-muted-foreground">
                            Technocracies and expert-driven systems can be correct, but they're vulnerable to groupthink, 
                            institutional capture, and the "because I said so" problem. Credentials become shields against 
                            accountability.
                          </p>
                        </Card>
                        <Card className="p-4 bg-success/5 border-success/50">
                          <p className="text-sm mb-2"><strong>THE RECORD solution:</strong></p>
                          <p className="text-sm text-muted-foreground">
                            Professional credentials give you a <em>starting boost</em> in Ψ (to recognize expertise), 
                            but that Ψ decays if you make bad predictions. A plumber with 10 years of accurate leak predictions 
                            will have more Ψ than a newly-credentialed engineer with no track record. Expertise must be proven continuously.
                          </p>
                        </Card>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3 text-primary">Problem 4: Influence Accumulation</h4>
                      <div className="grid gap-4">
                        <Card className="p-4 bg-destructive/5 border-destructive/50">
                          <p className="text-sm mb-2"><strong>Traditional systems:</strong></p>
                          <p className="text-sm text-muted-foreground">
                            Power compounds. Once you have influence, you can use it to gain more influence, creating 
                            runaway feedback loops that entrench elites and exclude newcomers.
                          </p>
                        </Card>
                        <Card className="p-4 bg-success/5 border-success/50">
                          <p className="text-sm mb-2"><strong>THE RECORD solution:</strong></p>
                          <p className="text-sm text-muted-foreground">
                            Influence decays at 2% per month and is slashed on bad predictions. The Gini-tax applies 
                            exponentially higher costs when a small group controls too much Ψ. This forces continuous 
                            re-validation of expertise and prevents oligarchies from forming.
                          </p>
                        </Card>
                      </div>
                    </div>

                    <Card className="p-6 bg-accent/10 border-accent">
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <ArrowsClockwise size={20} className="text-accent" />
                        The Evolutionary Pressure
                      </h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        By separating Ψ from $, THE RECORD creates an evolutionary environment where the only way to maintain 
                        influence is to <em>continue being right about reality</em>. You can't inherit it, buy it, or fake it. 
                        This means that over time, the people making decisions are <em>provably</em> the people who understand 
                        the problems best—not the richest, loudest, or most connected.
                      </p>
                    </Card>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>

            <Card className="p-6 border-primary bg-primary/5">
              <h3 className="font-semibold mb-3">Visual Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-3 h-3 rounded-full bg-primary" />
                    <span className="font-mono">Ψ (Influence)</span>
                  </div>
                  <div className="pl-5 text-xs text-muted-foreground space-y-1">
                    <div>→ Earned through accuracy</div>
                    <div>→ Lost through error</div>
                    <div>→ Cannot be bought/sold</div>
                    <div>→ Decays over time</div>
                    <div>→ Zero-sum system</div>
                    <div>→ Determines decision power</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-3 h-3 rounded-full bg-success" />
                    <span className="font-mono">$ (Money)</span>
                  </div>
                  <div className="pl-5 text-xs text-muted-foreground space-y-1">
                    <div>→ Optional funding mechanism</div>
                    <div>→ Freely transferable</div>
                    <div>→ Does not decay</div>
                    <div>→ Not slashed for errors</div>
                    <div>→ Not zero-sum</div>
                    <div>→ Determines resource allocation</div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
