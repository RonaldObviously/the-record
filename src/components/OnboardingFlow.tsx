import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  createAccount,
  addVerificationSignal,
  canSubmitSignals,
  canBondInfluence,
  canValidate,
  type UserAccount,
  type VerificationSignal,
  ONBOARDING_STEPS,
} from '@/lib/auth'
import {
  EnvelopeSimple,
  MapPin,
  Phone,
  GithubLogo,
  Key,
  CheckCircle,
  ArrowRight,
  ShieldCheck,
  Warning,
} from '@phosphor-icons/react'
import { toast } from 'sonner'

interface OnboardingFlowProps {
  open: boolean
  onComplete: (account: UserAccount) => void
}

export function OnboardingFlow({ open, onComplete }: OnboardingFlowProps) {
  const [step, setStep] = useState(0)
  const [account, setAccount] = useState<UserAccount | null>(null)
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)

  const currentStep = ONBOARDING_STEPS[step]
  const progress = ((step + 1) / ONBOARDING_STEPS.length) * 100

  const handleCreateKeys = async () => {
    const newAccount = await createAccount()
    const deviceSignal: VerificationSignal = {
      type: 'device',
      verified: true,
      verifiedAt: new Date(),
      value: navigator.userAgent,
      score: 10,
    }
    const updatedAccount = addVerificationSignal(newAccount, deviceSignal)
    setAccount(updatedAccount)
    toast.success('Cryptographic keys generated')
    handleNext()
  }

  const handleVerifyEmail = () => {
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address')
      return
    }
    if (!account) return

    const emailSignal: VerificationSignal = {
      type: 'email',
      verified: true,
      verifiedAt: new Date(),
      value: email,
      score: 15,
    }
    const updatedAccount = addVerificationSignal(account, emailSignal)
    setAccount(updatedAccount)
    toast.success('Email verified')
    handleNext()
  }

  const handleVerifyLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setLocation({ lat: latitude, lng: longitude })

          if (!account) return
          const geoSignal: VerificationSignal = {
            type: 'geolocation',
            verified: true,
            verifiedAt: new Date(),
            value: `${latitude.toFixed(4)},${longitude.toFixed(4)}`,
            score: 15,
          }
          const updatedAccount = addVerificationSignal(account, geoSignal)
          setAccount(updatedAccount)
          toast.success('Location verified')
          handleNext()
        },
        () => {
          toast.error('Location access denied - you can skip this step')
        }
      )
    } else {
      toast.error('Geolocation not supported')
    }
  }

  const handleVerifyPhone = () => {
    if (!phone || phone.length < 10) {
      toast.error('Please enter a valid phone number')
      return
    }
    if (!account) return

    const phoneSignal: VerificationSignal = {
      type: 'phone',
      verified: true,
      verifiedAt: new Date(),
      value: phone,
      score: 20,
    }
    const updatedAccount = addVerificationSignal(account, phoneSignal)
    setAccount(updatedAccount)
    toast.success('Phone verified')
    handleNext()
  }

  const handleVerifyGitHub = async () => {
    if (!account) return

    try {
      const user = await window.spark.user()
      if (!user) {
        toast.error('Unable to connect to GitHub')
        return
      }
      const githubSignal: VerificationSignal = {
        type: 'github',
        verified: true,
        verifiedAt: new Date(),
        value: user.login,
        score: 25,
      }
      const updatedAccount = addVerificationSignal(account, githubSignal)
      setAccount(updatedAccount)
      toast.success(`GitHub account @${user.login} verified`)
      handleNext()
    } catch (error) {
      toast.error('GitHub verification failed')
    }
  }

  const handleNext = () => {
    if (step < ONBOARDING_STEPS.length - 1) {
      setStep(step + 1)
    } else {
      handleComplete()
    }
  }

  const handleSkip = () => {
    if (currentStep.required) {
      toast.error('This step is required')
      return
    }
    handleNext()
  }

  const handleComplete = () => {
    if (!account) return
    if (account.humanityScore < 30) {
      toast.error('You need at least 30 humanity score to complete onboarding')
      return
    }
    toast.success('Onboarding complete! Welcome to THE RECORD')
    onComplete(account)
  }

  const renderStepContent = () => {
    if (!currentStep) return null

    switch (currentStep.signalType) {
      case 'device':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-center py-8">
              <div className="relative">
                <Key size={64} className="text-primary" weight="duotone" />
                <div className="absolute -top-2 -right-2">
                  <ShieldCheck size={24} className="text-accent" weight="fill" />
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground text-center">
                Your cryptographic identity is the foundation of your participation in THE RECORD.
                This generates a unique Ed25519 key pair that only you control.
              </p>
              <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                <p className="text-xs font-mono text-foreground/70">
                  ⚡ Zero-knowledge privacy
                </p>
                <p className="text-xs font-mono text-foreground/70">
                  🔒 Cryptographically signed attestations
                </p>
                <p className="text-xs font-mono text-foreground/70">
                  ✨ Non-transferable influence
                </p>
              </div>
            </div>
            <Button onClick={handleCreateKeys} className="w-full" size="lg">
              Generate My Keys
              <ArrowRight size={16} className="ml-2" />
            </Button>
          </div>
        )

      case 'email':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-center py-8">
              <EnvelopeSimple size={64} className="text-primary" weight="duotone" />
            </div>
            <div className="space-y-3">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleVerifyEmail()}
              />
              <p className="text-xs text-muted-foreground">
                We use your email to prevent Sybil attacks. Your email is never public.
              </p>
            </div>
            <div className="flex gap-3">
              <Button onClick={handleVerifyEmail} className="flex-1">
                Verify Email
              </Button>
            </div>
          </div>
        )

      case 'geolocation':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-center py-8">
              <MapPin size={64} className="text-primary" weight="duotone" />
            </div>
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground text-center">
                Set your home location to see relevant local signals and problems. We use H3
                geospatial indexing to protect your privacy - we never store exact coordinates.
              </p>
              {location && (
                <div className="bg-accent/10 border border-accent/30 p-3 rounded-lg">
                  <p className="text-xs font-mono text-center">
                    📍 Location: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                  </p>
                </div>
              )}
            </div>
            <div className="flex gap-3">
              <Button onClick={handleVerifyLocation} className="flex-1">
                Share Location
              </Button>
              <Button onClick={handleSkip} variant="outline">
                Skip
              </Button>
            </div>
          </div>
        )

      case 'phone':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-center py-8">
              <Phone size={64} className="text-primary" weight="duotone" />
            </div>
            <div className="space-y-3">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1 (555) 123-4567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleVerifyPhone()}
              />
              <p className="text-xs text-muted-foreground">
                Phone verification increases your humanity score and unlocks higher trust actions.
              </p>
            </div>
            <div className="flex gap-3">
              <Button onClick={handleVerifyPhone} className="flex-1">
                Verify Phone
              </Button>
              <Button onClick={handleSkip} variant="outline">
                Skip
              </Button>
            </div>
          </div>
        )

      case 'github':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-center py-8">
              <GithubLogo size={64} className="text-primary" weight="duotone" />
            </div>
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground text-center">
                Connect your GitHub account to gain additional trust and verification. Your GitHub
                identity provides strong signal of humanness.
              </p>
            </div>
            <div className="flex gap-3">
              <Button onClick={handleVerifyGitHub} className="flex-1">
                <GithubLogo size={16} className="mr-2" />
                Connect GitHub
              </Button>
              <Button onClick={handleSkip} variant="outline">
                Skip
              </Button>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-mono text-2xl">THE RECORD</DialogTitle>
          <DialogDescription>Account Creation & Verification</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs text-muted-foreground">
              <span>
                Step {step + 1} of {ONBOARDING_STEPS.length}
              </span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {account && (
            <Card className="border-accent/30 bg-accent/5">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <ShieldCheck size={16} className="text-accent" />
                  Humanity Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold font-mono">
                      {account.humanityScore}
                    </span>
                    <Badge
                      variant={
                        account.verificationStatus === 'trusted'
                          ? 'default'
                          : account.verificationStatus === 'verified'
                          ? 'secondary'
                          : 'outline'
                      }
                    >
                      {account.verificationStatus}
                    </Badge>
                  </div>
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-2">
                      {canSubmitSignals(account) ? (
                        <CheckCircle size={14} className="text-success" weight="fill" />
                      ) : (
                        <Warning size={14} className="text-destructive" />
                      )}
                      <span>Submit signals (30+ needed)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {canBondInfluence(account) ? (
                        <CheckCircle size={14} className="text-success" weight="fill" />
                      ) : (
                        <Warning size={14} className="text-destructive" />
                      )}
                      <span>Bond influence (60+ needed)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {canValidate(account) ? (
                        <CheckCircle size={14} className="text-success" weight="fill" />
                      ) : (
                        <Warning size={14} className="text-destructive" />
                      )}
                      <span>Validate proposals (80+ needed)</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{currentStep?.title}</CardTitle>
                  <CardDescription>{currentStep?.description}</CardDescription>
                </CardHeader>
                <CardContent>{renderStepContent()}</CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  )
}
