import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { toast } from 'sonner'
import { 
  PROFESSIONAL_ROLES, 
  type ProfessionalRole, 
  type CredentialType,
  type ProfessionalCredential,
  type ProfessionalProfile,
  createProfessionalCredential,
  verifyWorkEmailDomain,
  validateCredentialRequirements,
  PROFESSIONAL_VERIFICATION_SAFEGUARDS,
} from '@/lib/professionalVerification'
import { 
  Certificate, 
  Shield, 
  EnvelopeSimple, 
  File, 
  Warning,
  CheckCircle,
  Info,
  Briefcase,
  IdentificationCard,
  MapPin,
  Users,
} from '@phosphor-icons/react'
import { ProfessionalVerificationExplainer } from './ProfessionalVerificationExplainer'

interface ProfessionalVerificationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onComplete: (profile: ProfessionalProfile) => void
}

export function ProfessionalVerificationDialog({
  open,
  onOpenChange,
  onComplete,
}: ProfessionalVerificationDialogProps) {
  const [currentStep, setCurrentStep] = useState<'role' | 'credentials' | 'details' | 'review'>('role')
  const [selectedRole, setSelectedRole] = useState<ProfessionalRole | null>(null)
  const [credentials, setCredentials] = useState<ProfessionalCredential[]>([])
  const [workEmail, setWorkEmail] = useState('')
  const [organizationName, setOrganizationName] = useState('')
  const [specializations, setSpecializations] = useState<string[]>([])
  const [jurisdictions, setJurisdictions] = useState<string[]>([])
  const [publicContact, setPublicContact] = useState(false)

  const handleRoleSelect = (role: ProfessionalRole) => {
    setSelectedRole(role)
    setCurrentStep('credentials')
  }

  const handleEmailVerification = () => {
    const result = verifyWorkEmailDomain(workEmail)
    
    if (result.valid) {
      const credential = createProfessionalCredential(
        'work-email-domain',
        selectedRole!,
        result.organization || 'Unknown Organization'
      )
      credential.status = 'verified'
      credential.verificationMethod = 'email-domain'
      
      setCredentials([...credentials, credential])
      setOrganizationName(result.organization || '')
      toast.success('Work email verified')
    } else {
      toast.error('Email domain not recognized. Please upload documentation instead.')
    }
  }

  const handleDocumentUpload = (type: CredentialType) => {
    const credential = createProfessionalCredential(
      type,
      selectedRole!,
      organizationName || 'To Be Verified'
    )
    
    setCredentials([...credentials, credential])
    toast.info('Document submitted to decentralized validator network. Review takes 1-3 days.')
  }

  const handleComplete = () => {
    if (!selectedRole) return

    const validation = validateCredentialRequirements(selectedRole, credentials)
    
    if (!validation.valid) {
      toast.error(validation.message)
      return
    }

    const profile: ProfessionalProfile = {
      userId: '',
      role: selectedRole,
      credentials: credentials,
      specializations: specializations,
      jurisdictions: jurisdictions,
      organizationName: organizationName || undefined,
      verificationLevel: credentials.some(c => c.type === 'government-id') ? 'government' : 'standard',
      publicContact: publicContact,
      professionalInfluenceBonus: 0,
      signalWeightMultiplier: 0,
      canIssueOfficialReports: credentials.some(c => c.type === 'government-id'),
    }

    onComplete(profile)
    onOpenChange(false)
  }

  const roleConfig = selectedRole ? PROFESSIONAL_ROLES[selectedRole] : null
  const validation = selectedRole ? validateCredentialRequirements(selectedRole, credentials) : null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl h-[90vh] flex flex-col p-0 gap-0 overflow-hidden">
        <div className="px-6 pt-6 pb-4 shrink-0">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Certificate size={24} className="text-accent" />
              Professional Verification
              <Badge variant="outline" className="ml-auto text-xs">DEMO: Files stay local</Badge>
            </DialogTitle>
            <DialogDescription className="flex items-center justify-between gap-4">
              <span>Connect as a verified professional to contribute with enhanced credibility</span>
              <ProfessionalVerificationExplainer />
            </DialogDescription>
          </DialogHeader>
        </div>

        <ScrollArea className="flex-1 overflow-auto">
          <Tabs value={currentStep} onValueChange={(v) => setCurrentStep(v as any)} className="pb-4 px-6 pr-10">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="role">Role</TabsTrigger>
            <TabsTrigger value="credentials" disabled={!selectedRole}>Credentials</TabsTrigger>
            <TabsTrigger value="details" disabled={!selectedRole}>Details</TabsTrigger>
            <TabsTrigger value="review" disabled={!validation?.valid}>Review</TabsTrigger>
          </TabsList>

          <TabsContent value="role" className="space-y-4">
            <Card className="p-4 bg-muted/50 border-accent/30">
              <div className="flex items-start gap-3">
                <Info size={20} className="text-accent mt-0.5 flex-shrink-0" />
                <div className="text-sm space-y-2">
                  <p className="font-semibold">Why Professional Verification?</p>
                  <p className="text-muted-foreground">
                    The general population trusts professionals because their signals carry real-world expertise. 
                    However, professionals don't override the system—they provide weighted input that helps 
                    surface critical issues faster.
                  </p>
                </div>
              </div>
            </Card>

            <div className="space-y-3">
              <Label>Select Your Professional Role</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Object.entries(PROFESSIONAL_ROLES).map(([key, config]) => (
                  <Card
                    key={key}
                    className={`p-4 cursor-pointer transition-all hover:border-accent ${
                      selectedRole === key ? 'border-accent bg-accent/5' : ''
                    }`}
                    onClick={() => handleRoleSelect(key as ProfessionalRole)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-sm">{config.label}</h3>
                          {config.publicTrust && (
                            <Shield size={16} className="text-accent" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">{config.description}</p>
                      </div>
                      {selectedRole === key && (
                        <CheckCircle size={20} className="text-accent flex-shrink-0" />
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="credentials" className="space-y-4">
            {roleConfig && (
              <>
                <Card className="p-4 bg-muted/50">
                  <h3 className="font-semibold text-sm mb-2">Required Credentials for {roleConfig.label}</h3>
                  <div className="flex flex-wrap gap-2">
                    {roleConfig.requiredCredentials.map((cred) => (
                      <Badge key={cred} variant="outline">
                        {cred.replace('-', ' ')}
                      </Badge>
                    ))}
                  </div>
                </Card>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <EnvelopeSimple size={16} />
                      Work Email Verification (Instant)
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        type="email"
                        placeholder="yourname@organization.gov"
                        value={workEmail}
                        onChange={(e) => setWorkEmail(e.target.value)}
                      />
                      <Button onClick={handleEmailVerification}>
                        Verify
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Government (.gov), military (.mil), or educational (.edu) domains are instantly verified
                    </p>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <File size={16} />
                      Upload Documentation (Manual Review)
                    </Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        onClick={() => handleDocumentUpload('professional-license')}
                      >
                        <IdentificationCard size={16} className="mr-2" />
                        Professional License
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleDocumentUpload('government-id')}
                      >
                        <Shield size={16} className="mr-2" />
                        Government ID
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleDocumentUpload('certification')}
                      >
                        <Certificate size={16} className="mr-2" />
                        Certification
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleDocumentUpload('employer-verification')}
                      >
                        <Briefcase size={16} className="mr-2" />
                        Employer Letter
                      </Button>
                    </div>
                    <div className="bg-accent/10 border border-accent/30 p-3 rounded-lg">
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        <strong className="text-foreground">Decentralized Review:</strong> Documents are hashed 
                        (SHA-256) and encrypted on IPFS. A random selection of 5 validators from your professional 
                        field review the credentials. 4 out of 5 must approve. Validators stake influence and lose 
                        it if they approve fraudulent credentials. No central authority controls this process.
                      </p>
                    </div>
                  </div>

                  {credentials.length > 0 && (
                    <>
                      <Separator />
                      <div className="space-y-2">
                        <Label>Submitted Credentials</Label>
                        <div className="space-y-2">
                          {credentials.map((cred) => (
                            <Card key={cred.id} className="p-3">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-sm font-medium">
                                    {cred.type.replace('-', ' ')}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {cred.issuingOrganization}
                                  </p>
                                </div>
                                <Badge
                                  variant={cred.status === 'verified' ? 'default' : 'outline'}
                                >
                                  {cred.status}
                                </Badge>
                              </div>
                            </Card>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  {validation && !validation.valid && (
                    <Card className="p-4 border-warning bg-warning/5">
                      <div className="flex items-start gap-2">
                        <Warning size={20} className="text-warning mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Missing Required Credentials</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {validation.message}
                          </p>
                        </div>
                      </div>
                    </Card>
                  )}
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="details" className="space-y-4">
            <div className="space-y-2">
              <Label>Organization Name</Label>
              <Input
                placeholder="e.g., San Francisco Public Works"
                value={organizationName}
                onChange={(e) => setOrganizationName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Specializations (Optional)</Label>
              <Input
                placeholder="e.g., Water Treatment, Bridge Inspection"
                onChange={(e) => setSpecializations(e.target.value.split(',').map(s => s.trim()))}
              />
              <p className="text-xs text-muted-foreground">
                Your signals in these areas will carry extra weight
              </p>
            </div>

            <div className="space-y-2">
              <Label>Jurisdictions (Optional)</Label>
              <Input
                placeholder="e.g., San Francisco County, California"
                onChange={(e) => setJurisdictions(e.target.value.split(',').map(s => s.trim()))}
              />
              <p className="text-xs text-muted-foreground">
                Geographic areas where your credentials apply
              </p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="public-contact"
                checked={publicContact}
                onChange={(e) => setPublicContact(e.target.checked)}
              />
              <Label htmlFor="public-contact" className="cursor-pointer">
                Allow public to see my professional role (identity remains private)
              </Label>
            </div>
          </TabsContent>

          <TabsContent value="review" className="space-y-4">
            <Card className="p-4 bg-accent/5 border-accent/30">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Shield size={20} className="text-accent" />
                Public Trust Safeguards
              </h3>
              <div className="space-y-2 text-sm">
                {Object.entries(PROFESSIONAL_VERIFICATION_SAFEGUARDS).map(([key, value]) => (
                  <div key={key} className="flex items-start gap-2">
                    <CheckCircle size={16} className="text-accent mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">{value.description}</p>
                      <p className="text-xs text-muted-foreground">{value.implementation}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {roleConfig && (
              <Card className="p-4">
                <h3 className="font-semibold mb-3">Your Professional Profile</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Role:</span>
                    <span className="font-medium">{roleConfig.label}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Base Influence Bonus:</span>
                    <span className="font-medium">+{roleConfig.baseInfluenceBonus}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Signal Weight:</span>
                    <span className="font-medium">{roleConfig.signalWeight}x</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Public Trust Role:</span>
                    <span className="font-medium">{roleConfig.publicTrust ? 'Yes' : 'No'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Credentials Verified:</span>
                    <span className="font-medium">{credentials.filter(c => c.status === 'verified').length}</span>
                  </div>
                </div>
              </Card>
            )}

            <Button onClick={handleComplete} className="w-full" size="lg">
              Complete Professional Verification
            </Button>
          </TabsContent>
        </Tabs>
      </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
