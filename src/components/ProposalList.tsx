import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { CheckCircle, XCircle, WarningDiamond, Clock } from '@phosphor-icons/react'
import type { Proposal } from '@/lib/types'

interface ProposalListProps {
  proposals: Proposal[]
  view: 'validation' | 'accountability'
}

export function ProposalList({ proposals, view }: ProposalListProps) {
  if (proposals.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No proposals submitted yet.</p>
        <p className="text-sm mt-2">Submit a proposal with predictions to get started.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {proposals.map(proposal => (
        <Card key={proposal.id} className="p-4">
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h4 className="font-medium mb-1">{proposal.title}</h4>
                <p className="text-sm text-muted-foreground">{proposal.description}</p>
              </div>
              <Badge variant={getStatusVariant(proposal.status)}>
                {proposal.status}
              </Badge>
            </div>

            {view === 'validation' && (
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Validation Results
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {proposal.validations.map((validation, idx) => (
                    <div 
                      key={idx}
                      className={`flex items-center gap-2 p-2 rounded border ${getValidationBorderClass(validation.status)}`}
                    >
                      {getValidationIcon(validation.status)}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate">{validation.validator}</p>
                        <p className="text-xs text-muted-foreground truncate">{validation.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {view === 'accountability' && proposal.predictions.length > 0 && (
              <Accordion type="single" collapsible>
                <AccordionItem value="predictions">
                  <AccordionTrigger className="text-sm">
                    Prediction Tracking
                    {proposal.accuracyScore !== undefined && (
                      <Badge variant="outline" className="ml-2">
                        Accuracy: {Math.round(proposal.accuracyScore * 100)}%
                      </Badge>
                    )}
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3 pt-2">
                      {proposal.predictions.map((prediction, idx) => (
                        <div key={idx} className="border-l-2 border-prediction pl-3 space-y-1">
                          <p className="text-sm font-medium">{prediction.metric}</p>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                              <span className="text-muted-foreground">Predicted:</span>
                              <span className="ml-2 font-mono">{prediction.predicted}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Actual:</span>
                              <span className="ml-2 font-mono">
                                {prediction.actual || 'Pending'}
                              </span>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Timeframe: {prediction.timeframe}
                          </p>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )}

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="font-mono">{new Date(proposal.timestamp).toLocaleString()}</span>
              {proposal.influenceWeight !== undefined && (
                <span>Influence Weight: <span className="font-mono">{proposal.influenceWeight.toFixed(2)}</span></span>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}

function getStatusVariant(status: string): 'default' | 'secondary' | 'outline' | 'destructive' {
  switch (status) {
    case 'active':
    case 'completed':
      return 'default'
    case 'validating':
      return 'secondary'
    case 'draft':
      return 'outline'
    default:
      return 'outline'
  }
}

function getValidationIcon(status: string) {
  switch (status) {
    case 'pass':
      return <CheckCircle size={16} className="text-success" weight="fill" />
    case 'fail':
      return <XCircle size={16} className="text-destructive" weight="fill" />
    case 'warning':
      return <WarningDiamond size={16} className="text-warning" weight="fill" />
    case 'pending':
      return <Clock size={16} className="text-muted-foreground" />
    default:
      return null
  }
}

function getValidationBorderClass(status: string): string {
  switch (status) {
    case 'pass':
      return 'border-success/30 bg-success/5'
    case 'fail':
      return 'border-destructive/30 bg-destructive/5'
    case 'warning':
      return 'border-warning/30 bg-warning/5'
    default:
      return 'border-border'
  }
}
