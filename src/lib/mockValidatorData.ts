import {
  type Validator,
  type CredentialValidationRequest,
  type CredentialValidation,
  createMockValidator,
  createValidationRequest,
  selectValidatorQuorum,
  evaluateQuorumConsensus,
  CREDENTIAL_QUORUM_CONFIGS,
} from './professionalValidatorQuorum'
import { createProfessionalCredential } from './professionalVerification'
import type { ProfessionalRole } from './professionalVerification'

export function generateMockValidatorNetwork(): Validator[] {
  const validators: Validator[] = []
  
  const roles: ProfessionalRole[] = [
    'civil-engineer',
    'infrastructure-inspector',
    'public-health-official',
    'emergency-responder',
    'environmental-scientist',
    'utility-worker',
    'medical-professional',
    'licensed-contractor',
  ]
  
  const regions = [
    'North America West',
    'North America East',
    'Europe',
    'Asia Pacific',
    'Latin America',
    'Africa',
  ]
  
  const specializations = {
    'civil-engineer': ['Structural', 'Transportation', 'Water Resources', 'Geotechnical'],
    'infrastructure-inspector': ['Bridges', 'Buildings', 'Roads', 'Tunnels'],
    'public-health-official': ['Epidemiology', 'Environmental Health', 'Emergency Preparedness'],
    'emergency-responder': ['Fire', 'EMS', 'Hazmat', 'Search & Rescue'],
    'environmental-scientist': ['Water Quality', 'Air Quality', 'Soil Science', 'Climate'],
    'utility-worker': ['Water', 'Electrical', 'Gas', 'Telecommunications'],
    'medical-professional': ['Emergency Medicine', 'Public Health', 'Toxicology'],
    'licensed-contractor': ['Plumbing', 'Electrical', 'HVAC', 'General Construction'],
  }
  
  roles.forEach(role => {
    regions.forEach(region => {
      const count = 2 + Math.floor(Math.random() * 3)
      for (let i = 0; i < count; i++) {
        const roleSpecs = specializations[role] || ['General']
        const spec = roleSpecs[Math.floor(Math.random() * roleSpecs.length)]
        validators.push(createMockValidator(role, region, [spec]))
      }
    })
  })
  
  return validators
}

export function simulateCredentialValidation(
  credential: ReturnType<typeof createProfessionalCredential>,
  role: ProfessionalRole,
  validators: Validator[],
  shouldApprove: boolean = true
): CredentialValidationRequest {
  const documentHash = `0x${Math.random().toString(16).substr(2, 64)}`
  const encryptedCID = `Qm${Math.random().toString(36).substr(2, 44)}`
  
  const request = createValidationRequest(credential, role, documentHash, encryptedCID)
  const config = CREDENTIAL_QUORUM_CONFIGS[credential.type] || CREDENTIAL_QUORUM_CONFIGS['professional-license']
  
  const quorum = selectValidatorQuorum(request, validators, config)
  request.validatorsAssigned = quorum.map(v => v.id)
  request.status = 'in-review'
  
  const validations: CredentialValidation[] = []
  const approveCount = shouldApprove ? config.requiredApprovals : Math.floor(config.minimumValidators / 3)
  
  quorum.forEach((validator, idx) => {
    const shouldApproveThis = idx < approveCount
    const confidence = 0.7 + Math.random() * 0.3
    
    const validation: CredentialValidation = {
      validatorId: validator.id,
      validatorPublicKey: validator.publicKey,
      decision: shouldApproveThis ? 'approve' : 'reject',
      confidence,
      reasoning: shouldApproveThis
        ? 'Document appears authentic. License number verified, signatures valid, issuing authority confirmed.'
        : 'Unable to verify license number with issuing authority. Suspicious formatting.',
      flaggedIssues: shouldApproveThis ? [] : ['Unverified license number', 'Formatting inconsistency'],
      timestamp: new Date(Date.now() + idx * 3600000),
      signatureProof: `0x${Math.random().toString(16).substr(2, 128)}`,
      stakedInfluence: validator.stakedInfluence,
    }
    
    validations.push(validation)
  })
  
  request.validations = validations
  
  const consensus = evaluateQuorumConsensus(request, config)
  if (consensus.consensusReached) {
    request.consensusReached = true
    request.finalDecision = consensus.decision === 'pending' ? undefined : consensus.decision
    request.status = consensus.decision === 'approved' ? 'approved' : consensus.decision === 'rejected' ? 'rejected' : 'in-review'
    request.completedAt = consensus.decision !== 'pending' ? new Date() : undefined
  }
  
  return request
}

export function generateMockValidationRequests(
  validators: Validator[],
  count: number = 10
): CredentialValidationRequest[] {
  const requests: CredentialValidationRequest[] = []
  
  const roles: ProfessionalRole[] = [
    'civil-engineer',
    'infrastructure-inspector',
    'public-health-official',
    'emergency-responder',
    'environmental-scientist',
  ]
  
  const credentialTypes = ['professional-license', 'government-id', 'certification', 'employer-verification']
  
  for (let i = 0; i < count; i++) {
    const role = roles[Math.floor(Math.random() * roles.length)]
    const credType = credentialTypes[Math.floor(Math.random() * credentialTypes.length)]
    
    const credential = createProfessionalCredential(credType as any, role, 'Test Organization')
    
    const shouldApprove = Math.random() > 0.3
    const shouldComplete = Math.random() > 0.4
    
    const request = simulateCredentialValidation(credential, role, validators, shouldApprove)
    
    if (!shouldComplete) {
      request.validations = request.validations.slice(0, Math.floor(Math.random() * request.validations.length))
      request.status = 'in-review'
      request.consensusReached = false
      request.finalDecision = undefined
      request.completedAt = undefined
    }
    
    const daysAgo = Math.floor(Math.random() * 30)
    request.submittedAt = new Date(Date.now() - daysAgo * 24 * 3600000)
    
    requests.push(request)
  }
  
  return requests.sort((a, b) => b.submittedAt.getTime() - a.submittedAt.getTime())
}
