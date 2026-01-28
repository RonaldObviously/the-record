import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  ShieldCheck,
  Eye,
  ChartLine,
  Network,
  ArrowRight,
  Lock,
  CheckCircle,
  XCircle,
} from '@phosphor-icons/react'

interface WelcomeDialogProps {
  open: boolean
  onGetStarted: () => void
}

export function WelcomeDialog({ open, onGetStarted }: WelcomeDialogProps) {
  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="max-w-3xl max-h-[85vh] flex flex-col p-0 gap-0">
        <div className="px-6 pt-6 pb-4 shrink-0">
          <DialogHeader>
            <DialogTitle className="font-mono text-3xl">Welcome to THE RECORD</DialogTitle>
            <DialogDescription className="text-base">
              A Sovereign Coordination Engine for Transparent Decision-Making
            </DialogDescription>
          </DialogHeader>
        </div>

        <ScrollArea className="flex-1 px-6">
          <div className="space-y-6 pb-4 pr-4">
          <div className="bg-accent/10 border border-accent/30 p-4 rounded-lg">
            <p className="text-sm leading-relaxed">
              THE RECORD is <strong>not a government, voting system, or social network</strong>.
              It's a parallel truth-and-coordination engine that helps communities identify problems,
              propose solutions, and track outcomes <strong>without political influence or hidden
              agendas</strong>.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-primary/30">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Lock size={20} className="text-primary" weight="duotone" />
                  <CardTitle className="text-sm">Anonymous Input</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Submit problems privately to prevent social pressure and retaliation. Your identity
                  is protected while your truth is heard.
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary/30">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Eye size={20} className="text-primary" weight="duotone" />
                  <CardTitle className="text-sm">Radical Transparency</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Every decision, validation, and outcome is publicly visible and cryptographically
                  verifiable. No backroom deals.
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary/30">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <ChartLine size={20} className="text-primary" weight="duotone" />
                  <CardTitle className="text-sm">Merit-Based Influence</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Influence earned through accurate predictions, not money or connections. Reality is
                  the final judge.
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary/30">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Network size={20} className="text-primary" weight="duotone" />
                  <CardTitle className="text-sm">Distributed Validation</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Multiple independent validators check every proposal. No single authority controls
                  decisions.
                </p>
              </CardContent>
            </Card>
          </div>

          <Separator />

          <div className="space-y-3">
            <h3 className="font-semibold text-base">What Makes This Different?</h3>
            
            <div className="grid grid-cols-1 gap-3">
              <Card className="border-success/30 bg-success/5">
                <CardContent className="pt-4">
                  <div className="flex gap-3">
                    <CheckCircle size={20} className="text-success flex-shrink-0 mt-0.5" weight="fill" />
                    <div className="space-y-1">
                      <p className="text-sm font-semibold">THE RECORD</p>
                      <p className="text-xs text-muted-foreground">
                        • Anonymous problem reporting → Private consensus → Collective truth<br />
                        • Influence earned by prediction accuracy → Can't be bought or sold<br />
                        • Complete audit trail in cryptographic Black Box → Tamper-proof<br />
                        • Distributed validators → No single point of failure or corruption
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-destructive/30 bg-destructive/5">
                <CardContent className="pt-4">
                  <div className="flex gap-3">
                    <XCircle size={20} className="text-destructive flex-shrink-0 mt-0.5" weight="fill" />
                    <div className="space-y-1">
                      <p className="text-sm font-semibold">Traditional Systems</p>
                      <p className="text-xs text-muted-foreground">
                        • Public voting → Social pressure → Groupthink<br />
                        • Money buys influence → Corruption and capture<br />
                        • Hidden processes → "No one could have known"<br />
                        • Single authorities → Conflicts of interest
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <h3 className="font-semibold text-base">Getting Started</h3>
            <div className="bg-muted/50 p-4 rounded-lg space-y-2">
              <p className="text-sm text-foreground">
                You'll create a cryptographic identity and verify your humanity through multiple
                independent signals:
              </p>
              <ul className="space-y-1 text-xs text-muted-foreground ml-4">
                <li>• <strong>Cryptographic keys</strong> - Your sovereign digital identity</li>
                <li>• <strong>Email</strong> - Prevents duplicate accounts (never public)</li>
                <li>• <strong>Location</strong> - See local problems (H3 blurred for privacy)</li>
                <li>• <strong>Phone</strong> (optional) - Increases trust score</li>
                <li>• <strong>GitHub</strong> (optional) - Proof of established identity</li>
              </ul>
              <p className="text-xs text-muted-foreground mt-3">
                Combined, these create a <strong>Humanity Score</strong> that unlocks capabilities
                without revealing your identity. At 30+ you can submit signals, at 60+ you can bond
                influence, and at 80+ you can validate proposals.
              </p>
            </div>
          </div>
          </div>
        </ScrollArea>

        <div className="px-6 pb-6 pt-4 border-t shrink-0">
          <div className="flex justify-end gap-3">
            <Button onClick={onGetStarted} size="lg" className="w-full md:w-auto">
              <ShieldCheck size={18} className="mr-2" />
              Create My Account
              <ArrowRight size={18} className="ml-2" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
