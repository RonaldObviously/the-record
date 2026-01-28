import type { Proposal } from '@/lib/types'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { CheckCircle, XCircle, Clock } from '@phosphor-icons/react'
import { formatDistanceToNow } from 'date-fns'

interface ProposalListProps {
  proposals: Proposal[]
  showValidations?: boolean
  showPredictions?: boolean
}

const statusColors: Record<Proposal['status'], string> = {
  pending: 'bg-gray-500/10 text-gray-700',
  validated: 'bg-green-500/10 text-green-700',
  rejected: 'bg-red-500/10 text-red-700',
  active: 'bg-blue-500/10 text-blue-700',
  completed: 'bg-purple-500/10 text-purple-700'
}

export function ProposalList({ proposals, showValidations, showPredictions }: ProposalListProps) {
  if (proposals.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No proposals yet</p>
        <p className="text-sm mt-2">Click "Submit Proposal" to create one</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {proposals.map((proposal) => (
        <Card key={proposal.id} className="p-5">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="flex-1">
              <h3 className="font-semibold text-foreground mb-1">{proposal.title}</h3>
              <p className="text-sm text-muted-foreground">{proposal.description}</p>
            </div>
            <Badge className={statusColors[proposal.status]}>
              {proposal.status}
            </Badge>
          </div>

          <p className="text-xs text-muted-foreground mb-3">
            Submitted {formatDistanceToNow(new Date(proposal.submittedAt), { addSuffix: true })}
          </p>

          {showValidations && proposal.validations.length > 0 && (
            <>
              <Separator className="my-3" />
              <div>
                <h4 className="text-xs font-semibold text-foreground mb-2">Validations</h4>
                <div className="space-y-2">
                  {proposal.validations.map((validation) => (
                    <div key={validation.id} className="flex items-start gap-2 text-xs">
                      {validation.passed ? (
                        <CheckCircle size={16} className="text-green-600 mt-0.5" />
                      ) : (
                        <XCircle size={16} className="text-red-600 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <span className="font-medium capitalize">{validation.type}</span>
                        <p className="text-muted-foreground">{validation.notes}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {showPredictions && proposal.predictions.length > 0 && (
            <>
              <Separator className="my-3" />
              <div>
                <h4 className="text-xs font-semibold text-foreground mb-2">Predictions</h4>
                <div className="space-y-2">
                  {proposal.predictions.map((prediction) => (
                    <div key={prediction.id} className="text-xs">
                      <div className="flex items-start gap-2">
                        <Clock size={16} className="text-muted-foreground mt-0.5" />
                        <div className="flex-1">
                          <span className="font-medium">{prediction.metric}</span>
                          <p className="text-muted-foreground">
                            Predicted: {prediction.predictedOutcome} ({prediction.timeframe})
                          </p>
                          {prediction.actualOutcome && (
                            <p className="text-foreground mt-1">
                              Actual: {prediction.actualOutcome}
                              {prediction.accuracy !== undefined && (
                                <span className="ml-2 text-green-600">
                                  {(prediction.accuracy * 100).toFixed(0)}% accurate
                                </span>
                              )}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </Card>
      ))}
    </div>
  )
}
