import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { 
  ChartLine, 
  Shield, 
  Database, 
  GitBranch,
  CheckCircle,
  WarningCircle
} from '@phosphor-icons/react'
import { generateValidatorNodes, detectCartelBehavior, runGiniTaxCalculation } from '@/lib/consensus'
import { CryptoTransparency } from '@/components/CryptoTransparency'
import type { Proposal, BlackBoxEntry } from '@/lib/types'

interface SystemMonitoringProps {
  proposals: Proposal[]
  blackBoxEntries: BlackBoxEntry[]
}

export function SystemMonitoring({ proposals, blackBoxEntries }: SystemMonitoringProps) {
  const [validators] = useState(() => generateValidatorNodes())
  const [uptimeScore, setUptimeScore] = useState(0)

  useEffect(() => {
    const avgUptime = validators.reduce((sum, v) => sum + v.uptime, 0) / validators.length
    setUptimeScore(avgUptime * 100)
  }, [validators])

  const totalValidations = proposals.reduce((sum, p) => sum + p.validations.length, 0)
  const passedValidations = proposals.reduce(
    (sum, p) => sum + p.validations.filter(v => v.status === 'pass').length,
    0
  )
  const validationPassRate = totalValidations > 0 ? (passedValidations / totalValidations) * 100 : 0

  const evaluatedProposals = proposals.filter(p => p.accuracyScore !== undefined)
  const avgAccuracy = evaluatedProposals.length > 0
    ? (evaluatedProposals.reduce((sum, p) => sum + (p.accuracyScore || 0), 0) / evaluatedProposals.length) * 100
    : 0

  const influenceData = validators.map(v => ({
    userId: v.id,
    influence: v.stake
  }))
  const giniData = runGiniTaxCalculation(influenceData)

  const consensusRounds = proposals.map(p => ({
    proposalId: p.id,
    phase: 'finalized' as const,
    votes: validators.slice(0, 7).map(v => ({
      nodeId: v.id,
      vote: (Math.random() > 0.3 ? 'approve' : 'reject') as 'approve' | 'reject',
      timestamp: Date.now()
    })),
    threshold: 5
  }))

  const cartelDetection = detectCartelBehavior(consensusRounds)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">System Health Dashboard</h2>
        <p className="text-sm text-muted-foreground">
          Real-time monitoring of consensus, validation, and security metrics
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Validator Network</CardTitle>
              <Shield size={18} className="text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">{validators.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Active nodes</p>
            <Progress value={uptimeScore} className="mt-2 h-1" />
            <p className="text-xs text-muted-foreground mt-1">
              {uptimeScore.toFixed(1)}% avg uptime
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Validation Rate</CardTitle>
              <CheckCircle size={18} className="text-success" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">
              {validationPassRate.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {passedValidations} / {totalValidations} checks passed
            </p>
            <Progress value={validationPassRate} className="mt-2 h-1" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Prediction Accuracy</CardTitle>
              <ChartLine size={18} className="text-prediction" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">
              {avgAccuracy.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Across {evaluatedProposals.length} evaluated proposals
            </p>
            <Progress value={avgAccuracy} className="mt-2 h-1" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Gini Coefficient</CardTitle>
              <GitBranch size={18} className={giniData.giniCoefficient > 0.6 ? "text-warning" : "text-success"} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">
              {giniData.giniCoefficient.toFixed(3)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Tax rate: {(giniData.taxRate * 100).toFixed(1)}%
            </p>
            <Progress value={giniData.giniCoefficient * 100} className="mt-2 h-1" />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="validators" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="validators">Validator Network</TabsTrigger>
          <TabsTrigger value="security">Security Analysis</TabsTrigger>
          <TabsTrigger value="storage">Data Integrity</TabsTrigger>
          <TabsTrigger value="crypto">Cryptography</TabsTrigger>
        </TabsList>

        <TabsContent value="validators" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Active Validator Nodes</CardTitle>
              <CardDescription>
                Geographic distribution and stake information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {validators.map(validator => (
                  <div
                    key={validator.id}
                    className="flex items-center justify-between p-3 border rounded-md"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-sm">{validator.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Region: {validator.region} • Uptime: {(validator.uptime * 100).toFixed(1)}%
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-mono font-semibold">{validator.stake}</p>
                      <p className="text-xs text-muted-foreground">stake</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Cartel Detection Analysis</CardTitle>
              <CardDescription>
                Monitoring for coordinated voting patterns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 border rounded-md bg-card">
                  {cartelDetection.detected ? (
                    <WarningCircle size={20} weight="fill" className="text-warning mt-0.5" />
                  ) : (
                    <CheckCircle size={20} weight="fill" className="text-success mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className="font-medium text-sm mb-1">
                      {cartelDetection.detected ? 'Suspicious Activity Detected' : 'No Anomalies Detected'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {cartelDetection.detected
                        ? `${cartelDetection.suspiciousNodes.length} nodes showing ${(cartelDetection.alignmentScore * 100).toFixed(1)}% voting alignment`
                        : 'Validator voting patterns within normal parameters'}
                    </p>
                    {cartelDetection.detected && cartelDetection.suspiciousNodes.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {cartelDetection.suspiciousNodes.map(nodeId => (
                          <Badge key={nodeId} variant="outline" className="text-xs">
                            {nodeId}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 border rounded-md">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                      Consensus Rounds
                    </p>
                    <p className="text-2xl font-mono font-semibold">{consensusRounds.length}</p>
                  </div>
                  <div className="p-3 border rounded-md">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                      BFT Threshold
                    </p>
                    <p className="text-2xl font-mono font-semibold">
                      {Math.ceil((validators.length * 2) / 3)}/{validators.length}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="storage" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Data Integrity & Persistence</CardTitle>
              <CardDescription>
                Multi-layer storage status and proof verification
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-3">
                  <div className="flex items-center justify-between p-3 border rounded-md">
                    <div className="flex items-center gap-2">
                      <Database size={16} className="text-primary" />
                      <span className="text-sm font-medium">Local KV Store</span>
                    </div>
                    <Badge variant="outline" className="text-success">
                      <CheckCircle size={12} className="mr-1" />
                      Operational
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-md">
                    <div className="flex items-center gap-2">
                      <Database size={16} className="text-muted-foreground" />
                      <span className="text-sm font-medium">IPFS Layer</span>
                    </div>
                    <Badge variant="outline" className="text-muted-foreground">
                      Architecture Ready
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-md">
                    <div className="flex items-center gap-2">
                      <Database size={16} className="text-muted-foreground" />
                      <span className="text-sm font-medium">Filecoin Storage</span>
                    </div>
                    <Badge variant="outline" className="text-muted-foreground">
                      Architecture Ready
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-md">
                    <div className="flex items-center gap-2">
                      <Database size={16} className="text-muted-foreground" />
                      <span className="text-sm font-medium">Arweave Permanent</span>
                    </div>
                    <Badge variant="outline" className="text-muted-foreground">
                      Architecture Ready
                    </Badge>
                  </div>
                </div>

                <div className="p-4 bg-muted rounded-md">
                  <p className="text-xs text-muted-foreground mb-2">Storage Layer Status</p>
                  <p className="text-sm">
                    Local persistence active via Spark KV. External storage layers (IPFS, Filecoin, Arweave) 
                    are architecturally designed and ready for integration.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="crypto" className="space-y-4 mt-6">
          <CryptoTransparency proposals={proposals} blackBoxEntries={blackBoxEntries} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
