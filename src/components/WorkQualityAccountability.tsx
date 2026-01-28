import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Warning, 
  ShieldCheck, 
  Camera, 
  Microphone, 
  WarningCircle,
  CheckCircle,
  XCircle,
  UserCircle
} from '@phosphor-icons/react'
import type { Proposal, WorkQualityInspection, IncidentReport } from '@/lib/types'

interface WorkQualityAccountabilityProps {
  proposal: Proposal
  onRequestInspection: () => void
  onReportIncident: () => void
}

export function WorkQualityAccountability({ 
  proposal, 
  onRequestInspection,
  onReportIncident 
}: WorkQualityAccountabilityProps) {
  const hasFailedInspections = proposal.workQualityInspections.some(i => !i.passed)
  const hasCriticalIncidents = proposal.incidentReports.some(
    r => r.severity === 'serious' || r.severity === 'catastrophic'
  )

  return (
    <div className="space-y-6">
      <Card className="p-6 border-amber-500/20 bg-amber-500/5">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-amber-500/10 rounded-lg">
            <ShieldCheck size={24} className="text-amber-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-2">Work Quality & Accountability</h3>
            <p className="text-sm text-muted-foreground mb-4">
              All completed work must pass quality inspections. Accidents happen, but negligence and fraud are tracked and penalized.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-4 bg-card rounded-lg border border-border">
                <div className="text-xs text-muted-foreground mb-1">Inspections</div>
                <div className="text-2xl font-semibold">
                  {proposal.workQualityInspections.length}
                </div>
                <div className="text-xs mt-1">
                  {proposal.workQualityInspections.filter(i => i.passed).length} passed
                </div>
              </div>
              
              <div className="p-4 bg-card rounded-lg border border-border">
                <div className="text-xs text-muted-foreground mb-1">Incidents</div>
                <div className="text-2xl font-semibold">
                  {proposal.incidentReports.length}
                </div>
                <div className="text-xs mt-1">
                  {proposal.incidentReports.filter(r => r.severity === 'catastrophic' || r.severity === 'serious').length} serious
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-4">
              <Button 
                variant="outline" 
                size="sm"
                onClick={onRequestInspection}
              >
                <Camera size={16} className="mr-2" />
                Request Inspection
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={onReportIncident}
              >
                <Warning size={16} className="mr-2" />
                Report Issue
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {proposal.workQualityInspections.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-semibold text-sm">Quality Inspections</h4>
          {proposal.workQualityInspections.map((inspection) => (
            <InspectionCard key={inspection.id} inspection={inspection} />
          ))}
        </div>
      )}

      {proposal.incidentReports.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-semibold text-sm">Incident Reports</h4>
          {proposal.incidentReports.map((incident) => (
            <IncidentCard key={incident.id} incident={incident} />
          ))}
        </div>
      )}

      {(hasFailedInspections || hasCriticalIncidents) && (
        <Card className="p-4 border-destructive/20 bg-destructive/5">
          <div className="flex items-start gap-3">
            <WarningCircle size={20} className="text-destructive mt-0.5" />
            <div className="flex-1">
              <div className="font-semibold text-sm mb-1">Quality Concerns Detected</div>
              <p className="text-xs text-muted-foreground">
                This proposal has {hasFailedInspections ? 'failed inspections' : ''} 
                {hasFailedInspections && hasCriticalIncidents ? ' and ' : ''}
                {hasCriticalIncidents ? 'critical incidents' : ''}. 
                Influence penalties have been applied to responsible parties.
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}

function InspectionCard({ inspection }: { inspection: WorkQualityInspection }) {
  return (
    <Card className={`p-4 ${!inspection.passed ? 'border-destructive/20 bg-destructive/5' : 'border-green-500/20 bg-green-500/5'}`}>
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-start gap-3">
          {inspection.passed ? (
            <CheckCircle size={20} className="text-green-600 mt-0.5" />
          ) : (
            <XCircle size={20} className="text-destructive mt-0.5" />
          )}
          <div>
            <div className="font-semibold text-sm mb-1">
              {inspection.inspectionDepth === 'comprehensive' ? 'Comprehensive' : 
               inspection.inspectionDepth === 'structural' ? 'Structural' : 'Visual'} Inspection
            </div>
            <div className="text-xs text-muted-foreground">
              By {inspection.inspectorType} inspector • {new Date(inspection.timestamp).toLocaleDateString()}
            </div>
          </div>
        </div>
        <Badge variant={inspection.passed ? 'default' : 'destructive'}>
          {inspection.passed ? 'Passed' : 'Failed'}
        </Badge>
      </div>

      {inspection.criticalFailures.length > 0 && (
        <div className="space-y-2 mt-3">
          <div className="text-xs font-semibold text-destructive">Critical Failures:</div>
          {inspection.criticalFailures.map((failure, idx) => (
            <div key={idx} className="text-xs p-2 bg-destructive/10 rounded border border-destructive/20">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="destructive" className="text-[10px] px-1.5 py-0.5">
                  {failure.severity}
                </Badge>
                <span className="font-semibold">{failure.category}</span>
              </div>
              <div className="text-muted-foreground">{failure.description}</div>
              {failure.requiresImmediateAction && (
                <div className="text-destructive font-semibold mt-1">⚠️ Requires Immediate Action</div>
              )}
            </div>
          ))}
        </div>
      )}

      {inspection.minorIssues.length > 0 && (
        <div className="space-y-2 mt-3">
          <div className="text-xs font-semibold">Minor Issues:</div>
          {inspection.minorIssues.map((issue, idx) => (
            <div key={idx} className="text-xs p-2 bg-muted rounded">
              <div className="font-semibold">{issue.category}</div>
              <div className="text-muted-foreground">{issue.description}</div>
              <div className="text-xs mt-1 text-accent">→ {issue.recommendedAction}</div>
            </div>
          ))}
        </div>
      )}

      {inspection.photographicEvidence.length > 0 && (
        <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
          <Camera size={14} />
          {inspection.photographicEvidence.length} photo{inspection.photographicEvidence.length !== 1 ? 's' : ''} attached
        </div>
      )}

      {inspection.verbalTranscript && (
        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
          <Microphone size={14} />
          Verbal audit completed
        </div>
      )}

      {inspection.influenceImpact !== 0 && (
        <div className="mt-3 pt-3 border-t border-border">
          <div className="text-xs">
            <span className="text-muted-foreground">Influence Impact: </span>
            <span className={inspection.influenceImpact > 0 ? 'text-green-600 font-semibold' : 'text-destructive font-semibold'}>
              {inspection.influenceImpact > 0 ? '+' : ''}{inspection.influenceImpact}
            </span>
          </div>
        </div>
      )}
    </Card>
  )
}

function IncidentCard({ incident }: { incident: IncidentReport }) {
  const severityColors = {
    minor: 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20',
    moderate: 'bg-orange-500/10 text-orange-700 border-orange-500/20',
    serious: 'bg-red-500/10 text-red-700 border-red-500/20',
    catastrophic: 'bg-destructive/10 text-destructive border-destructive/20'
  }

  return (
    <Card className={`p-4 ${severityColors[incident.severity]}`}>
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-start gap-3">
          <Warning size={20} className="mt-0.5" />
          <div>
            <div className="font-semibold text-sm mb-1">
              {incident.incidentType.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
            </div>
            <div className="text-xs opacity-75">
              Reported {new Date(incident.timestamp).toLocaleDateString()}
            </div>
          </div>
        </div>
        <Badge className={severityColors[incident.severity]}>
          {incident.severity}
        </Badge>
      </div>

      <p className="text-sm mb-3">{incident.description}</p>

      {incident.injuries && incident.injuries.length > 0 && (
        <div className="p-3 bg-destructive/10 rounded border border-destructive/20 mb-3">
          <div className="text-xs font-semibold text-destructive mb-2">Injuries Reported:</div>
          {incident.injuries.map((injury, idx) => (
            <div key={idx} className="text-xs mb-1">
              • {injury.severity}: {injury.description}
              {injury.medicalTreatment && ' (Medical treatment received)'}
            </div>
          ))}
        </div>
      )}

      {incident.propertyDamage && (
        <div className="p-3 bg-muted rounded mb-3">
          <div className="text-xs font-semibold mb-1">Property Damage:</div>
          <div className="text-xs">Est. ${incident.propertyDamage.estimatedCost.toLocaleString()}</div>
          <div className="text-xs text-muted-foreground">{incident.propertyDamage.description}</div>
        </div>
      )}

      {incident.rootCause && (
        <div className="space-y-2 mb-3">
          <div className="text-xs font-semibold">Root Cause Analysis:</div>
          <div className="p-3 bg-muted rounded">
            <div className="text-xs mb-2">
              <span className="font-semibold">Primary Cause: </span>
              <span className="text-muted-foreground">
                {incident.rootCause.primaryCause.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
              </span>
            </div>
            {incident.rootCause.contributingFactors.length > 0 && (
              <div className="text-xs">
                <div className="font-semibold mb-1">Contributing Factors:</div>
                <ul className="list-disc list-inside text-muted-foreground">
                  {incident.rootCause.contributingFactors.map((factor, idx) => (
                    <li key={idx}>{factor}</li>
                  ))}
                </ul>
              </div>
            )}
            {incident.rootCause.systemicIssue && (
              <div className="text-xs mt-2 text-destructive font-semibold">
                ⚠️ Systemic issue identified - requires pattern-level intervention
              </div>
            )}
          </div>
        </div>
      )}

      {incident.responsibleParties.length > 0 && (
        <div className="space-y-2 mb-3">
          <div className="text-xs font-semibold">Responsibility Assignment:</div>
          {incident.responsibleParties.map((party, idx) => (
            <div key={idx} className="p-3 bg-muted rounded">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <UserCircle size={14} />
                  <span className="text-xs font-semibold">{party.role}</span>
                </div>
                <span className="text-xs text-muted-foreground">{party.responsibilityPercentage}% responsible</span>
              </div>
              <div className="text-xs text-destructive font-semibold">
                Influence Penalty: -{party.influencePenalty}
              </div>
              {party.banDuration && (
                <div className="text-xs text-destructive mt-1">
                  Temporary ban: {party.banDuration} days
                </div>
              )}
              {party.requiresRetraining && (
                <div className="text-xs text-amber-600 mt-1">
                  Retraining required before next proposal
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="pt-3 border-t border-border">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Investigation Status:</span>
          <Badge variant="outline">{incident.investigationStatus}</Badge>
        </div>
        {incident.preventable && (
          <div className="text-xs text-amber-600 mt-2">
            ⚠️ This incident was preventable
          </div>
        )}
      </div>
    </Card>
  )
}
