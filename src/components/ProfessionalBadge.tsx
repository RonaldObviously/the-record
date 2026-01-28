import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Certificate, Shield, CheckCircle, Clock } from '@phosphor-icons/react'
import { PROFESSIONAL_ROLES, type ProfessionalProfile } from '@/lib/professionalVerification'

interface ProfessionalBadgeProps {
  profile: ProfessionalProfile
  compact?: boolean
}

export function ProfessionalBadge({ profile, compact = false }: ProfessionalBadgeProps) {
  const roleConfig = PROFESSIONAL_ROLES[profile.role]

  if (compact) {
    return (
      <Badge variant="outline" className="border-accent/50 bg-accent/10">
        <Certificate size={12} className="mr-1" />
        {roleConfig.label}
      </Badge>
    )
  }

  return (
    <Card className="p-4 bg-accent/5 border-accent/30">
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <Certificate size={24} className="text-accent flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-sm mb-1">{roleConfig.label}</h4>
              <p className="text-xs text-muted-foreground">{roleConfig.description}</p>
              {profile.organizationName && (
                <p className="text-xs text-muted-foreground mt-1 font-mono">
                  {profile.organizationName}
                </p>
              )}
            </div>
          </div>
          {roleConfig.publicTrust && (
            <Shield size={20} className="text-accent flex-shrink-0" />
          )}
        </div>

        <Separator />

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <p className="text-muted-foreground mb-1">Signal Weight</p>
            <p className="font-semibold font-mono">{roleConfig.signalWeight}x</p>
          </div>
          <div>
            <p className="text-muted-foreground mb-1">Influence Bonus</p>
            <p className="font-semibold font-mono">+{roleConfig.baseInfluenceBonus}</p>
          </div>
        </div>

        {profile.specializations.length > 0 && (
          <>
            <Separator />
            <div>
              <p className="text-xs text-muted-foreground mb-2">Specializations</p>
              <div className="flex flex-wrap gap-1">
                {profile.specializations.map((spec) => (
                  <Badge key={spec} variant="secondary" className="text-xs">
                    {spec}
                  </Badge>
                ))}
              </div>
            </div>
          </>
        )}

        {profile.credentials.length > 0 && (
          <>
            <Separator />
            <div>
              <p className="text-xs text-muted-foreground mb-2">Verified Credentials</p>
              <div className="space-y-1">
                {profile.credentials.filter(c => c.status === 'verified').map((cred) => (
                  <div key={cred.id} className="flex items-center gap-2 text-xs">
                    <CheckCircle size={14} className="text-success flex-shrink-0" />
                    <span>{cred.type.replace('-', ' ')}</span>
                  </div>
                ))}
                {profile.credentials.filter(c => c.status === 'pending').map((cred) => (
                  <div key={cred.id} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock size={14} className="flex-shrink-0" />
                    <span>{cred.type.replace('-', ' ')} (pending review)</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </Card>
  )
}
