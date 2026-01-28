import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Shield, Database, Globe, Users, Eye, CheckCircle, XCircle, Lock } from '@phosphor-icons/react'

export function DataIntegrityExplainer() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Shield size={16} className="mr-1.5" />
          Data Protection
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl h-[85vh] p-0 gap-0">
        <div className="px-6 pt-6 pb-4">
          <DialogHeader>
            <DialogTitle>How THE RECORD Protects Your Data</DialogTitle>
          </DialogHeader>
        </div>
        <div className="flex-1 overflow-y-auto px-6 pr-4">
          <div className="pb-6">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="layers">7 Layers</TabsTrigger>
              <TabsTrigger value="attacks">Attack Scenarios</TabsTrigger>
              <TabsTrigger value="proof">Verify Yourself</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4 mt-4">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">The Core Question</h3>
                  <p className="text-sm text-muted-foreground">
                    What if information is lost, tampered with, or destroyed?
                  </p>
                </div>

                <Card className="p-4 bg-primary/5 border-primary">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Lock className="text-primary" size={20} />
                    The Answer: 7-Layer Defense
                  </h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    THE RECORD uses a defense-in-depth strategy where up to 6 out of 7 storage layers can fail or turn malicious, and the system will still recover the complete, verified truth.
                  </p>
                  <div className="text-xs font-mono bg-background p-3 rounded border">
                    If you have 7 storage layers → 6 can fail<br/>
                    Even if IPFS, Filecoin, Arweave, validators, and user nodes all disappeared,<br/>
                    the cryptographic proofs would still prove what was true.
                  </div>
                </Card>

                <div className="grid grid-cols-2 gap-3">
                  <Card className="p-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="text-success mt-1" size={20} />
                      <div>
                        <h4 className="font-semibold text-sm mb-1">Cannot Be Lost</h4>
                        <p className="text-xs text-muted-foreground">
                          7 redundant storage layers ensure at least one copy always survives
                        </p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="text-success mt-1" size={20} />
                      <div>
                        <h4 className="font-semibold text-sm mb-1">Cannot Be Tampered</h4>
                        <p className="text-xs text-muted-foreground">
                          Cryptographic hashes detect any change instantly. Content addressing prevents substitution
                        </p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="text-success mt-1" size={20} />
                      <div>
                        <h4 className="font-semibold text-sm mb-1">Cannot Be Destroyed</h4>
                        <p className="text-xs text-muted-foreground">
                          Economic incentives ensure permanent storage. Distributed across hundreds of independent nodes
                        </p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="text-success mt-1" size={20} />
                      <div>
                        <h4 className="font-semibold text-sm mb-1">Mathematically Provable</h4>
                        <p className="text-xs text-muted-foreground">
                          SHA-256 collision resistance is a mathematical fact, not a trust assumption
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>

                <div className="bg-accent/10 p-4 rounded-lg border border-accent">
                  <h4 className="font-semibold text-sm mb-2">Cost to Store a City's Data for a Year</h4>
                  <p className="text-2xl font-bold mb-1">$5.10</p>
                  <p className="text-xs text-muted-foreground">
                    For a city of 100,000 people generating 1,000 signals per day. Compare to: one F-35 fighter jet ($80 million).
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="layers" className="space-y-4 mt-4">
              <div className="space-y-3">
                <LayerCard
                  number={1}
                  title="Hash Chain (Immutable Ledger)"
                  icon={<Lock size={20} />}
                  status="implemented"
                  description="Every event is cryptographically linked. Changing one block breaks the entire chain."
                  howItWorks="Block[i].hash = SHA256(Block[i].data + Block[i-1].hash)"
                  protection="Tamper detection: Any change breaks the chain (detectable in <1ms)"
                />

                <LayerCard
                  number={2}
                  title="IPFS (Content-Addressed Storage)"
                  icon={<Globe size={20} />}
                  status="implemented"
                  description="Peer-to-peer network where files are addressed by their hash. Files distributed across thousands of nodes."
                  howItWorks="Data → SHA-256 hash → CID. Network stores file at that address. Retrieve by CID, verify by re-hashing."
                  protection="Content cannot be changed: CID is the hash, so any change creates different CID"
                />

                <LayerCard
                  number={3}
                  title="Filecoin (Economic Storage)"
                  icon={<Database size={20} />}
                  status="design"
                  description="Miners stake collateral and are paid to store data. Network challenges them daily to prove they still have it."
                  howItWorks="Pay miners → They stake collateral → Daily challenges → Fail = lose stake"
                  protection="Economic disincentive: Losing stake costs more than deleting saves"
                  cost="~$0.10/GB/year"
                />

                <LayerCard
                  number={4}
                  title="Arweave (Permanent Storage)"
                  icon={<Database size={20} />}
                  status="design"
                  description="Pay once, store forever. Protocol invests payment into endowment that pays miners perpetually."
                  howItWorks="One-time payment → Endowment earns interest → Interest pays miners forever"
                  protection="Permanent economic incentive: Endowment pays miners even if you disappear"
                  cost="~$5/GB one-time"
                />

                <LayerCard
                  number={5}
                  title="User Nodes (Citizen Backup)"
                  icon={<Users size={20} />}
                  status="implemented"
                  description="Every user can pin copies of data they care about. Like BitTorrent, distributed across millions."
                  howItWorks="User clicks 'Pin' → Browser downloads and keeps file → Even if servers die, users have proof"
                  protection="No single point of failure: 1 million users = 1 million redundant copies"
                  cost="FREE (users donate storage)"
                />

                <LayerCard
                  number={6}
                  title="Validator Network (BFT Consensus)"
                  icon={<Shield size={20} />}
                  status="partial"
                  description="Independent nodes vote on truth. Byzantine Fault Tolerance: up to 33% can be malicious."
                  howItWorks="10 validators → 7 must agree → 3 can lie without breaking system"
                  protection="Geographic diversity: No country/org/provider can control >30% of validators"
                  cost="FREE (earn influence)"
                />

                <LayerCard
                  number={7}
                  title="Meta-Layer (Oversight AI)"
                  icon={<Eye size={20} />}
                  status="implemented"
                  description="AI monitors for cartels, whale capture, data anomalies. Read-only access (cannot modify truth)."
                  howItWorks="Detect voting patterns → Flag collusion → Apply Gini-tax → Raise alerts"
                  protection="Transparent alerts: Even if meta-layer is captured, it can only warn (not censor)"
                  cost="FREE (automated)"
                />
              </div>
            </TabsContent>

            <TabsContent value="attacks" className="space-y-4 mt-4">
              <div className="space-y-3">
                <AttackScenario
                  title="Government Orders Data Deletion"
                  attack="Government orders all IPFS nodes in their country to delete a specific file."
                  defense={[
                    'IPFS nodes outside that country still have it',
                    'Filecoin miners (economically incentivized) still have it',
                    'Arweave (permanent storage) still has it',
                    'User nodes (distributed citizens) still have it',
                    'Hash chain proves file existed with specific hash',
                    'Meta-layer detects sudden drop in availability → Alert'
                  ]}
                  result="File cannot be deleted. Even if 99% of IPFS nodes comply, 1% + other layers preserve it."
                />

                <AttackScenario
                  title="Billionaire Bribes Validators"
                  attack="Billionaire pays 5 out of 10 validators to say 'This signal never happened.'"
                  defense={[
                    '5/10 = 50% (not enough for BFT consensus, needs 67%)',
                    'Remaining 5 validators say signal DID happen → Signal stays',
                    'Meta-layer detects 5 validators voted against consensus → Flags cartel',
                    'Those 5 validators get slashed (lose influence)',
                    'Hash chain still has cryptographic proof',
                    'IPFS/Filecoin/Arweave still have original file'
                  ]}
                  result="Attack fails. Billionaire loses money, validators lose influence, signal stays."
                />

                <AttackScenario
                  title="Hacker Compromises Database"
                  attack="Hacker gains access and changes Block[50] to remove a signal."
                  defense={[
                    "Block[50].hash changes (because content changed)",
                    "Block[51] expects old Block[50].hash → Invalid",
                    "All blocks after [50] are now invalid",
                    "Meta-layer runs verification every 10 min → Detects break",
                    "CRITICAL ALERT: Hash chain integrity violated",
                    "Validators compare their copies → Majority wins",
                    "Hacker's version rejected (only 1/10 validators)"
                  ]}
                  result="Attack detected in <10 minutes. Correct chain restored from other validators."
                />

                <AttackScenario
                  title="ALL Storage Layers Fail"
                  attack="IPFS collapses, Filecoin shuts down, Arweave banned, users delete nodes, validators offline."
                  defense={[
                    'Hash chain still exists (at least locally)',
                    'Hashes prove what SHOULD exist at timestamp X',
                    'If ONE person saved the file, they can prove authenticity',
                    'Re-hash file → Matches Block[50] hash → Proof confirmed',
                    'Legal/forensic: Courts accept hash as proof of existence'
                  ]}
                  result="Even in catastrophic failure, cryptographic proofs survive. Files recoverable from any single backup."
                />

                <AttackScenario
                  title="67% Validator Collusion"
                  attack="7 out of 10 validators coordinate to rewrite history."
                  defense={[
                    'BFT FAILS (67% is the threshold)',
                    'Meta-layer detects 7/10 voting identically → CRITICAL ALERT',
                    'Hash chain on 3 honest validators still has truth',
                    'IPFS/Filecoin/Arweave files cannot be deleted by validators',
                    'Users compare: Majority chain vs Minority chain vs IPFS files',
                    'Users trust chain that matches IPFS files'
                  ]}
                  result="Attack DETECTED but not prevented at consensus layer. Truth still recoverable from IPFS. Users fork network, exclude corrupt validators."
                />
              </div>
            </TabsContent>

            <TabsContent value="proof" className="space-y-4 mt-4">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">How to Verify the System Yourself</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Don't trust, verify. Here's how anyone can audit THE RECORD.
                  </p>
                </div>

                <Card className="p-4">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Users className="text-primary" size={18} />
                    For Non-Technical Users
                  </h4>
                  <ol className="space-y-2 text-sm list-decimal list-inside">
                    <li>Click "System Health" → See validator network status</li>
                    <li>Click "Black Box" → See hash chain of all events</li>
                    <li>Click any event → See the hash (like a fingerprint)</li>
                    <li>Compare hashes with another user → If different, someone is lying</li>
                  </ol>
                </Card>

                <Card className="p-4">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Shield className="text-primary" size={18} />
                    For Technical Auditors
                  </h4>
                  <ol className="space-y-2 text-sm list-decimal list-inside">
                    <li>Download the hash chain (JSON export)</li>
                    <li>Re-compute all hashes from genesis block to current</li>
                    <li>Compare your hashes to the published hashes</li>
                    <li>If they match: Chain is intact</li>
                    <li>If they don't match: Someone tampered with the chain</li>
                  </ol>
                </Card>

                <Card className="p-4">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Lock className="text-primary" size={18} />
                    For Cryptographers
                  </h4>
                  <ol className="space-y-2 text-sm list-decimal list-inside">
                    <li>Verify SHA-256 implementation (standard library)</li>
                    <li>Verify Merkle tree construction (standard algorithm)</li>
                    <li>Verify BFT consensus (follows PBFT spec)</li>
                    <li>Verify signature scheme (Ed25519 standard)</li>
                    <li>Attempt to forge a hash collision (you can't, it's SHA-256)</li>
                  </ol>
                </Card>

                <div className="bg-accent/10 p-4 rounded-lg border border-accent">
                  <h4 className="font-semibold text-sm mb-2">Mathematical Guarantee</h4>
                  <p className="text-xs text-muted-foreground mb-2">
                    SHA-256 collision resistance is not a matter of trust or policy. It is a mathematical fact.
                  </p>
                  <div className="font-mono text-xs bg-background p-3 rounded border space-y-1">
                    <div>SHA-256 has 2^256 possible outputs</div>
                    <div>Current computing: ~2^80 hashes/second (entire Bitcoin network)</div>
                    <div>To find collision: ~2^128 hashes needed</div>
                    <div>Time required: 2^128 / 2^80 = 2^48 seconds ≈ 9 million years</div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    No one can create a fake file with the same hash as a real file.
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

interface LayerCardProps {
  number: number
  title: string
  icon: React.ReactNode
  status: 'implemented' | 'partial' | 'design'
  description: string
  howItWorks: string
  protection: string
  cost?: string
}

function LayerCard({ number, title, icon, status, description, howItWorks, protection, cost }: LayerCardProps) {
  const statusColor = {
    implemented: 'success',
    partial: 'accent',
    design: 'muted-foreground'
  }[status]

  const statusText = {
    implemented: 'Implemented',
    partial: 'Partial',
    design: 'Design Only'
  }[status]

  return (
    <Card className="p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="text-primary">{icon}</div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-sm">Layer {number}: {title}</h4>
              <Badge variant="outline" className={`text-${statusColor} border-${statusColor}`}>
                {statusText}
              </Badge>
            </div>
          </div>
        </div>
        {cost && (
          <div className="text-xs font-semibold text-accent">{cost}</div>
        )}
      </div>
      <p className="text-xs text-muted-foreground mb-3">{description}</p>
      <div className="space-y-2">
        <div>
          <div className="text-xs font-semibold mb-1">How it works:</div>
          <div className="text-xs font-mono bg-muted p-2 rounded">{howItWorks}</div>
        </div>
        <div>
          <div className="text-xs font-semibold mb-1">Protection:</div>
          <div className="text-xs text-muted-foreground">{protection}</div>
        </div>
      </div>
    </Card>
  )
}

interface AttackScenarioProps {
  title: string
  attack: string
  defense: string[]
  result: string
}

function AttackScenario({ title, attack, defense, result }: AttackScenarioProps) {
  return (
    <Card className="p-4">
      <h4 className="font-semibold mb-3">{title}</h4>
      <div className="space-y-3">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <XCircle className="text-destructive" size={16} />
            <div className="text-xs font-semibold">Attack:</div>
          </div>
          <p className="text-xs text-muted-foreground pl-6">{attack}</p>
        </div>
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Shield className="text-success" size={16} />
            <div className="text-xs font-semibold">Defense:</div>
          </div>
          <ul className="space-y-1 pl-6">
            {defense.map((item, i) => (
              <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                <CheckCircle className="text-success mt-0.5 flex-shrink-0" size={12} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-success/10 p-3 rounded-lg border border-success">
          <div className="text-xs font-semibold mb-1 text-success">Result:</div>
          <p className="text-xs">{result}</p>
        </div>
      </div>
    </Card>
  )
}
