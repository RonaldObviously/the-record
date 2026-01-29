import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import { toast } from 'sonner'
import {
  type Validator,
  type CredentialValidationRequest,
  type CredentialValidation,
  CREDENTIAL_QUORUM_CONFIGS,
  selectValidatorQuorum,
  evaluateQuorumConsensus,
  calculateValidatorReward,
  detectValidatorCollusion,
  createMockValidator,
  VALIDATOR_ROLE_DESCRIPTIONS,
} from '@/lib/professionalValidatorQuorum'
import {
  Shield,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  Warning,
  Info,
  CodesandboxLogo,
  Fingerprint,
  Lightning,
  TrendUp,
  MapPin,
  CurrencyCircleDollar,
} from '@phosphor-icons/react'

interface ValidatorQuorumPanelProps {
  validationRequests: CredentialValidationRequest[]
  validators: Validator[]
  onValidationComplete?: (request: CredentialValidationRequest) => void
}

export function ValidatorQuorumPanel({
  validationRequests,
  validators,
  onValidationComplete,
}: ValidatorQuorumPanelProps) {
  const [selectedRequest, setSelectedRequest] = useState<CredentialValidationRequest | null>(null)

  const pendingRequests = validationRequests.filter(r => r.status === 'pending' || r.status === 'in-review')
  const completedRequests = validationRequests.filter(r => r.status === 'approved' || r.status === 'rejected')
  const disputedRequests = validationRequests.filter(r => r.status === 'disputed')

  const activeValidators = validators.filter(v => v.isActive)
  const avgReputation = activeValidators.length > 0
    ? activeValidators.reduce((sum, v) => sum + v.reputation, 0) / activeValidators.length
    : 0

  const collusionCheck = detectValidatorCollusion(validators, validationRequests.slice(-50))

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Credential Validator Network</h2>
        <p className="text-sm text-muted-foreground">
          Decentralized professional credential verification with Byzantine fault tolerance
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Active Validators</span>
            <Users size={20} className="text-accent" />
          </div>
          <div className="text-2xl font-bold">{activeValidators.length}</div>
          <div className="text-xs text-muted-foreground mt-1">
            Across {new Set(activeValidators.map(v => v.role)).size} roles
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Pending Reviews</span>
            <Clock size={20} className="text-warning" />
          </div>
          <div className="text-2xl font-bold">{pendingRequests.length}</div>
          <div className="text-xs text-muted-foreground mt-1">
            {pendingRequests.filter(r => r.status === 'in-review').length} in progress
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Network Reputation</span>
            <TrendUp size={20} className="text-success" />
          </div>
          <div className="text-2xl font-bold">{(avgReputation * 100).toFixed(0)}%</div>
          <div className="text-xs text-muted-foreground mt-1">
            Average validator score
          </div>
        </Card>

        <Card className={`p-4 ${collusionCheck.collusionDetected ? 'border-warning' : 'border-border'}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Security Status</span>
            {collusionCheck.collusionDetected ? (
              <Warning size={20} className="text-warning" />
            ) : (
              <Shield size={20} className="text-success" />
            )}
          </div>
          <div className="text-2xl font-bold">
            {collusionCheck.collusionDetected ? 'Alert' : 'Secure'}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {collusionCheck.collusionDetected ? 'Collusion detected' : 'No collusion detected'}
          </div>
        </Card>
      </div>

      {collusionCheck.collusionDetected && (
        <Card className="p-4 bg-warning/5 border-warning">
          <div className="flex items-start gap-3">
            <Warning size={24} className="text-warning mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="font-semibold text-sm mb-1">Collusion Detection Alert</h3>
              <p className="text-xs text-muted-foreground mb-2">{collusionCheck.reason}</p>
              <div className="flex flex-wrap gap-2">
                {collusionCheck.suspiciousValidators.slice(0, 5).map(vid => (
                  <Badge key={vid} variant="outline" className="text-xs">
                    {vid.substring(0, 12)}...
                  </Badge>
                ))}
                {collusionCheck.suspiciousValidators.length > 5 && (
                  <Badge variant="outline" className="text-xs">
                    +{collusionCheck.suspiciousValidators.length - 5} more
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </Card>
      )}

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="pending">
            Pending ({pendingRequests.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({completedRequests.length})
          </TabsTrigger>
          <TabsTrigger value="validators">
            Validators ({activeValidators.length})
          </TabsTrigger>
          <TabsTrigger value="how-it-works">
            How It Works
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {pendingRequests.length === 0 ? (
            <Card className="p-8 text-center">
              <CheckCircle size={48} className="text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No pending validation requests</p>
            </Card>
          ) : (
            <div className="space-y-3">
              {pendingRequests.map(request => (
                <ValidationRequestCard
                  key={request.id}
                  request={request}
                  onClick={() => setSelectedRequest(request)}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedRequests.length === 0 ? (
            <Card className="p-8 text-center">
              <Clock size={48} className="text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No completed validations yet</p>
            </Card>
          ) : (
            <div className="space-y-3">
              {completedRequests.map(request => (
                <ValidationRequestCard
                  key={request.id}
                  request={request}
                  onClick={() => setSelectedRequest(request)}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="validators" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeValidators.slice(0, 10).map(validator => (
              <Card key={validator.id} className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Fingerprint size={16} className="text-accent" />
                      <span className="text-xs font-mono text-muted-foreground">
                        {validator.id.substring(0, 16)}...
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-xs">
                        {validator.role}
                      </Badge>
                      <Badge variant="outline" className="text-xs flex items-center gap-1">
                        <MapPin size={12} />
                        {validator.geographicRegion}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold">
                      {(validator.reputation * 100).toFixed(0)}%
                    </div>
                    <div className="text-xs text-muted-foreground">reputation</div>
                  </div>
                </div>

                <Separator className="my-2" />

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <div className="text-muted-foreground">Staked</div>
                    <div className="font-semibold">{validator.stakedInfluence} Ψ</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Validations</div>
                    <div className="font-semibold">{validator.validationsCompleted}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Accuracy</div>
                    <div className="font-semibold">
                      {(validator.validationAccuracy * 100).toFixed(0)}%
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Specializations</div>
                    <div className="font-semibold">{validator.specialization.length}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {activeValidators.length > 10 && (
            <div className="text-center text-sm text-muted-foreground">
              Showing 10 of {activeValidators.length} active validators
            </div>
          )}
        </TabsContent>

        <TabsContent value="how-it-works">
          <div className="space-y-6">
            <HowItWorksSection
              title={VALIDATOR_ROLE_DESCRIPTIONS.requirements.title}
              items={VALIDATOR_ROLE_DESCRIPTIONS.requirements.items}
              icon={<Shield size={24} className="text-accent" />}
            />

            <HowItWorksSection
              title={VALIDATOR_ROLE_DESCRIPTIONS.process.title}
              items={VALIDATOR_ROLE_DESCRIPTIONS.process.items}
              icon={<CodesandboxLogo size={24} className="text-accent" />}
            />

            <HowItWorksSection
              title={VALIDATOR_ROLE_DESCRIPTIONS.safety.title}
              items={VALIDATOR_ROLE_DESCRIPTIONS.safety.items}
              icon={<Lightning size={24} className="text-warning" />}
            />

            <Card className="p-6 bg-accent/5 border-accent/30">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <CurrencyCircleDollar size={24} className="text-accent" />
                Economic Incentives
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Stake Required</span>
                  <span className="font-semibold">200-500 Ψ</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Reward (correct vote)</span>
                  <span className="font-semibold text-success">+10% of stake</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Penalty (wrong vote)</span>
                  <span className="font-semibold text-destructive">-50% of stake</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Abstain</span>
                  <span className="font-semibold text-muted-foreground">No change</span>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {selectedRequest && (
        <ValidationRequestDetail
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
        />
      )}
    </div>
  )
}

function ValidationRequestCard({
  request,
  onClick,
}: {
  request: CredentialValidationRequest
  onClick: () => void
}) {
  const config = CREDENTIAL_QUORUM_CONFIGS[request.credentialType] || CREDENTIAL_QUORUM_CONFIGS['professional-license']
  const consensus = evaluateQuorumConsensus(request, config)
  const progress = (request.validations.length / config.minimumValidators) * 100

  const approvals = request.validations.filter(v => v.decision === 'approve').length
  const rejections = request.validations.filter(v => v.decision === 'reject').length

  return (
    <Card className="p-4 cursor-pointer hover:border-accent transition-colors" onClick={onClick}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline">
              {request.professionalRole}
            </Badge>
            <Badge variant={request.status === 'approved' ? 'default' : request.status === 'rejected' ? 'destructive' : 'outline'}>
              {request.status}
            </Badge>
          </div>
          <div className="text-sm font-medium mb-1">{request.credentialType.replace('-', ' ')}</div>
          <div className="text-xs text-muted-foreground font-mono">
            Hash: {request.documentHash.substring(0, 24)}...
          </div>
        </div>
        <div className="text-right text-xs">
          <div className="text-muted-foreground">
            {new Date(request.submittedAt).toLocaleDateString()}
          </div>
        </div>
      </div>

      <Separator className="my-3" />

      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Validation Progress</span>
          <span className="font-medium">
            {request.validations.length} / {config.minimumValidators}
          </span>
        </div>
        <Progress value={progress} className="h-2" />

        <div className="flex items-center justify-between text-xs pt-1">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <CheckCircle size={14} className="text-success" />
              {approvals} approve
            </span>
            <span className="flex items-center gap-1">
              <XCircle size={14} className="text-destructive" />
              {rejections} reject
            </span>
          </div>
          {consensus.consensusReached && (
            <Badge variant={consensus.decision === 'approved' ? 'default' : 'destructive'} className="text-xs">
              {consensus.decision} ({(consensus.confidence * 100).toFixed(0)}%)
            </Badge>
          )}
        </div>
      </div>
    </Card>
  )
}

function ValidationRequestDetail({
  request,
  onClose,
}: {
  request: CredentialValidationRequest
  onClose: () => void
}) {
  const config = CREDENTIAL_QUORUM_CONFIGS[request.credentialType] || CREDENTIAL_QUORUM_CONFIGS['professional-license']
  const consensus = evaluateQuorumConsensus(request, config)

  return (
    <Card className="p-6 border-accent">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-lg font-semibold">Validation Request Details</h3>
        <Button variant="ghost" size="sm" onClick={onClose}>
          Close
        </Button>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-muted-foreground mb-1">Request ID</div>
            <div className="font-mono text-xs">{request.id}</div>
          </div>
          <div>
            <div className="text-muted-foreground mb-1">Status</div>
            <Badge variant={request.status === 'approved' ? 'default' : request.status === 'rejected' ? 'destructive' : 'outline'}>
              {request.status}
            </Badge>
          </div>
          <div>
            <div className="text-muted-foreground mb-1">Professional Role</div>
            <div className="font-medium">{request.professionalRole}</div>
          </div>
          <div>
            <div className="text-muted-foreground mb-1">Credential Type</div>
            <div className="font-medium">{request.credentialType.replace('-', ' ')}</div>
          </div>
          <div>
            <div className="text-muted-foreground mb-1">Submitted</div>
            <div className="font-medium">{new Date(request.submittedAt).toLocaleString()}</div>
          </div>
          {request.completedAt && (
            <div>
              <div className="text-muted-foreground mb-1">Completed</div>
              <div className="font-medium">{new Date(request.completedAt).toLocaleString()}</div>
            </div>
          )}
        </div>

        <Separator />

        <div>
          <h4 className="font-semibold mb-3">Validator Decisions</h4>
          <div className="space-y-2">
            {request.validations.map((validation, idx) => (
              <Card key={idx} className="p-3">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Fingerprint size={16} className="text-accent" />
                    <span className="text-xs font-mono">
                      {validation.validatorId.substring(0, 12)}...
                    </span>
                  </div>
                  <Badge variant={validation.decision === 'approve' ? 'default' : validation.decision === 'reject' ? 'destructive' : 'outline'}>
                    {validation.decision}
                  </Badge>
                </div>
                <div className="text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Confidence</span>
                    <span className="font-medium">{(validation.confidence * 100).toFixed(0)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Staked</span>
                    <span className="font-medium">{validation.stakedInfluence} Ψ</span>
                  </div>
                  {validation.reasoning && (
                    <div className="mt-2 p-2 bg-muted/50 rounded text-xs">
                      {validation.reasoning}
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>

        {consensus.consensusReached && (
          <>
            <Separator />
            <Card className="p-4 bg-accent/5 border-accent/30">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold mb-1">Consensus Reached</h4>
                  <p className="text-sm text-muted-foreground">
                    {consensus.decision === 'approved' ? 'Credential approved by quorum' : 'Credential rejected by quorum'}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">{(consensus.confidence * 100).toFixed(0)}%</div>
                  <div className="text-xs text-muted-foreground">confidence</div>
                </div>
              </div>
            </Card>
          </>
        )}
      </div>
    </Card>
  )
}

function HowItWorksSection({
  title,
  items,
  icon,
}: {
  title: string
  items: string[]
  icon: React.ReactNode
}) {
  return (
    <Card className="p-6">
      <h3 className="font-semibold mb-4 flex items-center gap-2">
        {icon}
        {title}
      </h3>
      <div className="space-y-2">
        {items.map((item, idx) => (
          <div key={idx} className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs font-semibold text-accent">{idx + 1}</span>
            </div>
            <p className="text-sm text-muted-foreground flex-1">{item}</p>
          </div>
        ))}
      </div>
    </Card>
  )
}
