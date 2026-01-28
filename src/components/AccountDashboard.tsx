import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import type { UserAccount } from '@/lib/auth'
import { ProfessionalBadge } from '@/components/ProfessionalBadge'
import {
  ShieldCheck,
  Key,
  ChartLine,
  CheckCircle,
  Clock,
} from '@phosphor-icons/react'

interface AccountDashboardProps {
  account: UserAccount
}

export function AccountDashboard({ account }: AccountDashboardProps) {
  const verifiedSignals = account.verificationSignals.filter(s => s.verified)

  return (
    <div className="space-y-4">
      <Card className="border-accent/30 bg-gradient-to-br from-accent/10 to-accent/5">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <ShieldCheck size={20} className="text-accent" weight="duotone" />
                Your Account
              </CardTitle>
              <CardDescription className="font-mono text-xs mt-1">
                ID: {account.id}
              </CardDescription>
            </div>
            <Badge
              variant={
                account.verificationStatus === 'trusted'
                  ? 'default'
                  : account.verificationStatus === 'verified'
                  ? 'secondary'
                  : 'outline'
              }
              className="text-xs"
            >
              {account.verificationStatus.toUpperCase()}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <ChartLine size={14} />
                Humanity Score
              </p>
              <p className="text-2xl font-bold font-mono">{account.humanityScore}</p>
              <Progress value={account.humanityScore} className="h-1.5" />
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <ChartLine size={14} />
                Influence (Φ)
              </p>
              <p className="text-2xl font-bold font-mono">{account.influence}</p>
            </div>
          </div>

          <div className="border-t border-border/50 pt-4 space-y-2">
            <p className="text-xs font-semibold text-muted-foreground">Verification Signals</p>
            <div className="space-y-1.5">
              {account.verificationSignals.map((signal, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between text-xs bg-muted/30 px-3 py-2 rounded"
                >
                  <div className="flex items-center gap-2">
                    {signal.verified ? (
                      <CheckCircle size={14} className="text-success" weight="fill" />
                    ) : (
                      <Clock size={14} className="text-muted-foreground" />
                    )}
                    <span className="capitalize">{signal.type}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">+{signal.score}</span>
                    {signal.verifiedAt && (
                      <span className="text-muted-foreground text-[10px]">
                        {new Date(signal.verifiedAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {account.professionalProfile && (
            <div className="border-t border-border/50 pt-4">
              <ProfessionalBadge profile={account.professionalProfile} />
            </div>
          )}

          <div className="border-t border-border/50 pt-4 space-y-2">
            <p className="text-xs font-semibold text-muted-foreground">Capabilities</p>
            <div className="grid grid-cols-1 gap-2">
              <div className="flex items-center justify-between text-xs bg-muted/20 px-3 py-2 rounded">
                <span>Submit Signals</span>
                {account.humanityScore >= 30 ? (
                  <CheckCircle size={14} className="text-success" weight="fill" />
                ) : (
                  <Badge variant="outline" className="text-[10px] h-5">
                    Need 30+
                  </Badge>
                )}
              </div>
              <div className="flex items-center justify-between text-xs bg-muted/20 px-3 py-2 rounded">
                <span>Bond Influence</span>
                {account.humanityScore >= 60 ? (
                  <CheckCircle size={14} className="text-success" weight="fill" />
                ) : (
                  <Badge variant="outline" className="text-[10px] h-5">
                    Need 60+
                  </Badge>
                )}
              </div>
              <div className="flex items-center justify-between text-xs bg-muted/20 px-3 py-2 rounded">
                <span>Validate Proposals</span>
                {account.humanityScore >= 80 && account.influence >= 500 ? (
                  <CheckCircle size={14} className="text-success" weight="fill" />
                ) : (
                  <Badge variant="outline" className="text-[10px] h-5">
                    Need 80+ & 500Φ
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <div className="border-t border-border/50 pt-4">
            <div className="bg-muted/50 p-3 rounded space-y-1">
              <div className="flex items-center gap-2">
                <Key size={12} className="text-muted-foreground" />
                <p className="text-[10px] font-mono text-muted-foreground">Public Key</p>
              </div>
              <p className="text-[10px] font-mono text-foreground/80 break-all">
                {account.publicKey.slice(0, 64)}...
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
