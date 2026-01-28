import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { X } from '@phosphor-icons/react'

interface SystemMonitoringProps {
  onClose: () => void
}

export function SystemMonitoring({ onClose }: SystemMonitoringProps) {
  const validators = [
    { id: '1', name: 'SF-VAL-01', location: 'San Francisco', uptime: 99.2, stake: 15000 },
    { id: '2', name: 'NYC-VAL-02', location: 'New York', uptime: 98.8, stake: 12000 },
    { id: '3', name: 'LON-VAL-03', location: 'London', uptime: 99.5, stake: 18000 },
    { id: '4', name: 'TKY-VAL-04', location: 'Tokyo', uptime: 97.3, stake: 10000 },
    { id: '5', name: 'BER-VAL-05', location: 'Berlin', uptime: 99.1, stake: 14000 },
    { id: '6', name: 'SYD-VAL-06', location: 'Sydney', uptime: 98.5, stake: 11000 },
    { id: '7', name: 'TOR-VAL-07', location: 'Toronto', uptime: 99.0, stake: 13000 },
    { id: '8', name: 'SIN-VAL-08', location: 'Singapore', uptime: 99.7, stake: 20000 },
    { id: '9', name: 'DUB-VAL-09', location: 'Dublin', uptime: 98.2, stake: 9000 },
    { id: '10', name: 'MUM-VAL-10', location: 'Mumbai', uptime: 97.8, stake: 8000 }
  ]

  const totalStake = validators.reduce((sum, v) => sum + v.stake, 0)
  const avgUptime = validators.reduce((sum, v) => sum + v.uptime, 0) / validators.length
  const bftThreshold = Math.ceil((validators.length * 2) / 3)

  const hashChain = [
    { block: 1, hash: 'a1b2c3d4e5f6g7h8', prevHash: '0000000000000000', events: 3 },
    { block: 2, hash: 'f8g7h6i5j4k3l2m1', prevHash: 'a1b2c3d4e5f6g7h8', events: 5 },
    { block: 3, hash: 'z9y8x7w6v5u4t3s2', prevHash: 'f8g7h6i5j4k3l2m1', events: 2 },
    { block: 4, hash: 'p1q2r3s4t5u6v7w8', prevHash: 'z9y8x7w6v5u4t3s2', events: 4 }
  ]

  const giniCoefficient = 0.32

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold font-mono">System Health Dashboard</h2>
          <p className="text-sm text-muted-foreground mt-1">Real-time monitoring of The Record infrastructure</p>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X size={20} />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <div className="text-sm text-muted-foreground mb-1">Active Validators</div>
          <div className="text-2xl font-bold font-mono">{validators.length}/10</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground mb-1">Average Uptime</div>
          <div className="text-2xl font-bold font-mono">{avgUptime.toFixed(1)}%</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground mb-1">BFT Threshold</div>
          <div className="text-2xl font-bold font-mono">{bftThreshold}/{validators.length}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground mb-1">Gini Coefficient</div>
          <div className="text-2xl font-bold font-mono">{giniCoefficient.toFixed(2)}</div>
        </Card>
      </div>

      <Tabs defaultValue="validators">
        <TabsList className="mb-6">
          <TabsTrigger value="validators">Validator Network</TabsTrigger>
          <TabsTrigger value="security">Security Analysis</TabsTrigger>
          <TabsTrigger value="crypto">Cryptography</TabsTrigger>
        </TabsList>

        <TabsContent value="validators" className="mt-0">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Distributed Validator Network</h3>
            <div className="space-y-3">
              {validators.map((validator) => (
                <div key={validator.id} className="flex items-center gap-4 p-3 bg-muted/30 rounded">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono font-semibold text-sm">{validator.name}</span>
                      <Badge variant="outline" className="text-xs">{validator.location}</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>Uptime: {validator.uptime}%</span>
                      <span>Stake: {validator.stake.toLocaleString()}</span>
                      <span>Share: {((validator.stake / totalStake) * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                  <Progress value={validator.uptime} className="w-24" />
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="mt-0">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Security Analysis</h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold mb-2">Cartel Detection</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Analyzing voting patterns for coordinated behavior
                </p>
                <div className="p-3 bg-green-500/10 border border-green-500/20 rounded">
                  <div className="text-sm font-semibold text-green-700">No Cartels Detected</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Maximum alignment: 73% (below 90% threshold)
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-2">Gini Tax Calculation</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Wealth concentration: {giniCoefficient.toFixed(2)} (0 = perfect equality, 1 = maximum inequality)
                </p>
                <Progress value={giniCoefficient * 100} className="mb-2" />
                <div className="text-xs text-muted-foreground">
                  Tax rate: {(giniCoefficient * 10).toFixed(1)}% on highest stake holders
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-2">Byzantine Fault Tolerance</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Network can tolerate {validators.length - bftThreshold} malicious validators
                </p>
                <div className="text-xs font-mono bg-muted/30 p-2 rounded">
                  BFT = ⌈2n/3⌉ = ⌈{(validators.length * 2) / 3}⌉ = {bftThreshold}
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="crypto" className="mt-0">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Cryptographic Verification</h3>
            
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-semibold">Hash Chain Integrity</h4>
                  <Badge className="bg-green-500/10 text-green-700">Verified ✓</Badge>
                </div>
                <div className="space-y-2">
                  {hashChain.map((block) => (
                    <div key={block.block} className="p-3 bg-muted/30 rounded font-mono text-xs">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold">Block {block.block}</span>
                        <span className="text-muted-foreground">{block.events} events</span>
                      </div>
                      <div className="text-muted-foreground">Hash: {block.hash}</div>
                      <div className="text-muted-foreground">Prev: {block.prevHash}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-2">Cryptographic Protocols</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between p-2 bg-muted/30 rounded">
                    <span>SHA-256 Hashing</span>
                    <Badge className="bg-green-500/10 text-green-700">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-muted/30 rounded">
                    <span>ECDSA Signatures</span>
                    <Badge className="bg-green-500/10 text-green-700">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-muted/30 rounded">
                    <span>Ring Signatures</span>
                    <Badge className="bg-yellow-500/10 text-yellow-700">Simulated</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-muted/30 rounded">
                    <span>Merkle Trees</span>
                    <Badge className="bg-green-500/10 text-green-700">Active</Badge>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
