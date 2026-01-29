import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack,
  CheckCircle,
  XCircle,
  Warning,
  Info,
  Code,
  Globe,
  Lock,
  LockOpen,
  Database,
  HardDrives,
  Users,
  ShieldCheck,
  Cpu
} from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'

interface WalkthroughStep {
  id: string
  title: string
  category: 'demo' | 'production' | 'architecture' | 'security'
  demoStatus: 'working' | 'simulated' | 'disabled'
  productionStatus: 'required' | 'optional' | 'enhanced'
  description: string
  demoExplanation: string
  productionRequirements: string[]
  technicalDetails: string
  estimatedCost?: string
  estimatedTime?: string
  dependencies?: string[]
  icon: any
}

const walkthroughSteps: WalkthroughStep[] = [
  {
    id: 'data-persistence',
    title: 'Data Storage & Persistence',
    category: 'architecture',
    demoStatus: 'simulated',
    productionStatus: 'required',
    icon: Database,
    description: 'How The Record stores signals, problems, proposals, and the black box event log',
    demoExplanation: 'In demo mode, all data is stored in your browser using the spark.kv system (localStorage). This means data persists between sessions BUT only on your device. Refreshing clears temporary state, and data is not shared with other users.',
    productionRequirements: [
      'Distributed IPFS network for content-addressed storage',
      'Filecoin for long-term archival with economic guarantees',
      'Arweave for permanent, immutable historical records',
      'Local node software for community members to pin critical data',
      'Proof-of-persistence challenges to verify data availability'
    ],
    technicalDetails: 'Demo uses browser localStorage (~5-10MB limit). Production needs distributed hash tables (DHT) across thousands of nodes, cryptographic proofs of storage, and economic incentives for data retention.',
    estimatedCost: '$2,000-10,000/month for 1,000 active users',
    estimatedTime: '4-6 weeks to implement',
    dependencies: ['IPFS daemon', 'Filecoin storage contracts', 'Arweave gateway']
  },
  {
    id: 'location-verification',
    title: 'Location Verification & Privacy',
    category: 'security',
    demoStatus: 'simulated',
    productionStatus: 'required',
    icon: Globe,
    description: 'How The Record verifies you are in the location you claim while protecting your privacy',
    demoExplanation: 'Demo mode SIMULATES location. It does not access your actual GPS. You can "pretend" to be anywhere. The H3 cell blurring works correctly, but the input location is fake.',
    productionRequirements: [
      'Real GPS access with user permission',
      'H3 geospatial indexing (already implemented correctly)',
      'Multi-signal verification (IP, GPS, device fingerprint)',
      'Proximity attestation from nearby trusted nodes',
      'Anti-spoofing detection using movement patterns',
      'Zero-knowledge proofs to verify location without revealing exact coordinates'
    ],
    technicalDetails: 'Production uses probabilistic location verification: GPS + cell tower triangulation + IP geolocation + peer attestation. The system never stores exact coordinates, only H3 cell IDs (500m-1km hexagons).',
    estimatedCost: '$500-2,000/month for geolocation APIs',
    estimatedTime: '2-3 weeks to implement',
    dependencies: ['H3 library (already installed)', 'GPS permissions', 'IP geolocation service']
  },
  {
    id: 'identity-verification',
    title: 'Identity & Sybil Resistance',
    category: 'security',
    demoStatus: 'simulated',
    productionStatus: 'required',
    icon: ShieldCheck,
    description: 'How The Record ensures one person = one account while maintaining anonymity',
    demoExplanation: 'Demo mode lets you create ANY account with ANY humanity score. There is NO actual verification. You can create 100 accounts in 100 seconds. This is intentionally broken to let you explore the system.',
    productionRequirements: [
      'Phone number verification (SMS)',
      'Email verification',
      'Hardware device fingerprinting',
      'Biometric liveness detection (optional)',
      'Social graph analysis (connections to verified users)',
      'Behavioral pattern analysis',
      'Professional credential validation for experts',
      'Multi-validator quorum for high-stakes verifications'
    ],
    technicalDetails: 'Production uses a weighted scoring system: phone (30 pts) + email (20 pts) + device uniqueness (15 pts) + social attestations (20 pts) + time in system (15 pts) = humanity score. Scores decay over time without activity.',
    estimatedCost: '$0.01-0.05 per verification',
    estimatedTime: '3-4 weeks to implement',
    dependencies: ['Twilio (SMS)', 'SendGrid (email)', 'FingerprintJS', 'ML model for behavior analysis']
  },
  {
    id: 'professional-verification',
    title: 'Professional Credential Validation',
    category: 'security',
    demoStatus: 'simulated',
    productionStatus: 'required',
    icon: Users,
    description: 'How The Record verifies doctors, engineers, scientists, and other professionals',
    demoExplanation: 'Demo mode accepts ANY credential claim. You can claim to be a nuclear physicist with zero proof. The "validator review" is fake—no one actually reviews anything.',
    productionRequirements: [
      'Decentralized validator network (30+ independent validators)',
      'Document verification (OCR + authenticity checks)',
      'Cross-reference with professional registries',
      'Peer attestation from verified professionals in same field',
      'Time-locked credential challenges (must maintain proof over time)',
      'Stake-based validation (validators risk reputation)',
      'Multi-signature quorum (3-5 validators must agree)'
    ],
    technicalDetails: 'Production uses a Byzantine Fault Tolerant validation process: uploaded credentials are sharded and sent to random validators. Each validator scores authenticity (0-100). If ≥67% score >80, credential is approved. Validators who approve fake credentials lose influence.',
    estimatedCost: '$5-20 per credential validation',
    estimatedTime: '6-8 weeks to implement',
    dependencies: ['Validator node network', 'OCR service', 'Professional registry APIs', 'BFT consensus implementation']
  },
  {
    id: 'signal-clustering',
    title: 'Signal Aggregation & Clustering',
    category: 'architecture',
    demoStatus: 'working',
    productionStatus: 'enhanced',
    icon: Cpu,
    description: 'How The Record groups similar signals into clusters and promotes them to problems',
    demoExplanation: 'Demo mode implements REAL clustering algorithms. The Jaccard similarity, TF-IDF, and hierarchical clustering all work correctly. This is one of the few fully-functional production-ready components.',
    productionRequirements: [
      'LLM-based semantic similarity (using Gemini, already integrated)',
      'Distributed processing for large signal volumes',
      'Real-time stream processing',
      'Geographic clustering using H3 hierarchy',
      'Temporal clustering (signals within time windows)',
      'Cross-bubble correlation detection',
      'Automated L2→L3→L4 promotion based on weight thresholds'
    ],
    technicalDetails: 'Production enhances the current algorithm with distributed processing. Signals are processed in batches of 100-500. Each batch runs through semantic embedding, cosine similarity matrices, and DBSCAN clustering. Results are merged using a reduce operation.',
    estimatedCost: '$100-500/month for LLM API calls',
    estimatedTime: '1-2 weeks to optimize',
    dependencies: ['Gemini API (already integrated)', 'Message queue (RabbitMQ/Kafka)', 'Worker nodes']
  },
  {
    id: 'consensus-validation',
    title: 'Byzantine Fault Tolerant Consensus',
    category: 'architecture',
    demoStatus: 'simulated',
    productionStatus: 'required',
    icon: Lock,
    description: 'How The Record reaches agreement on truth when some nodes may lie',
    demoExplanation: 'Demo mode PRETENDS to run BFT consensus. The validator nodes are fake. They always agree. There is no actual network communication, no view changes, no fault tolerance.',
    productionRequirements: [
      'Full PBFT (Practical Byzantine Fault Tolerance) implementation',
      'View change protocol for leader failures',
      'Network communication layer (WebRTC or libp2p)',
      'Validator reputation scoring',
      'Slashing conditions for malicious validators',
      'Dynamic validator set (nodes can join/leave)',
      'Checkpoint protocol for finality'
    ],
    technicalDetails: 'Production implements 3-phase commit: PRE-PREPARE (leader proposes block) → PREPARE (validators validate) → COMMIT (validators agree). Requires ≥67% honest validators. Uses cryptographic signatures for non-repudiation.',
    estimatedCost: '$1,000-5,000/month for validator infrastructure',
    estimatedTime: '8-12 weeks to implement (or use Tendermint)',
    dependencies: ['Libp2p networking', 'Ed25519 signing (already working)', 'Validator node software']
  },
  {
    id: 'ipfs-storage',
    title: 'IPFS Content Storage',
    category: 'architecture',
    demoStatus: 'simulated',
    productionStatus: 'required',
    icon: HardDrives,
    description: 'How The Record stores files (photos, documents) in a decentralized way',
    demoExplanation: 'Demo mode generates FAKE IPFS CIDs. Files are NOT actually uploaded anywhere. The CIDs look real but point to nothing. The "storage" is imaginary.',
    productionRequirements: [
      'IPFS daemon running on server',
      'Pinning service (Pinata, Infura, or self-hosted)',
      'Client-side IPFS upload library',
      'Garbage collection policy',
      'Proof-of-persistence challenges',
      'Redundancy replication (3-5 copies)',
      'User node software for distributed pinning'
    ],
    technicalDetails: 'Production uses content-addressed storage: hash of file = its address. Files are chunked (256KB blocks), merkle tree is built, root CID is stored on-chain. Multiple nodes pin each file for redundancy.',
    estimatedCost: '$0.10-0.50 per GB stored',
    estimatedTime: '2-3 weeks to implement',
    dependencies: ['IPFS daemon', 'Pinning service API', 'Helia (browser IPFS)']
  },
  {
    id: 'cryptographic-proofs',
    title: 'Cryptographic Hash Chain',
    category: 'architecture',
    demoStatus: 'working',
    productionStatus: 'enhanced',
    icon: Code,
    description: 'How The Record creates an immutable history of all events',
    demoExplanation: 'Demo mode implements REAL cryptographic hashing. The SHA-256 hashes are correct. The hash chain is immutable. Each event references the previous hash. This is production-quality.',
    productionRequirements: [
      'Persistent storage of hash chain (currently in-memory)',
      'Merkle tree proofs for event inclusion',
      'Timestamping service for temporal ordering',
      'Public API for third-party verification',
      'Archive nodes for full history',
      'Light client proofs for mobile users'
    ],
    technicalDetails: 'Production adds persistent storage and public verification. Anyone can download the full hash chain and verify every event from genesis to present. Merkle proofs let you prove a specific event exists without downloading the entire chain.',
    estimatedCost: '$100-500/month for archive storage',
    estimatedTime: '1-2 weeks to implement',
    dependencies: ['Database (PostgreSQL/SQLite)', 'Merkle tree library (already working)']
  },
  {
    id: 'reality-settlement',
    title: 'Reality Settlement & Oracles',
    category: 'architecture',
    demoStatus: 'simulated',
    productionStatus: 'required',
    icon: CheckCircle,
    description: 'How The Record verifies that problems were actually solved in the real world',
    demoExplanation: 'Demo mode accepts ANY claim of completion. You can say "I fixed the pothole" and the system believes you. There is no actual verification. Settlement happens instantly with fake proofs.',
    productionRequirements: [
      'Photo/video verification with EXIF metadata',
      'Timestamp verification',
      'Location verification (must match original signal)',
      'Multi-user attestation (3+ people confirm)',
      'Professional inspection for high-value items',
      'Sensor data integration (IoT devices)',
      'AI visual verification (Gemini Vision API)',
      'Fraud detection (reverse image search, deepfake detection)'
    ],
    technicalDetails: 'Production uses layered verification: (1) Submitter provides photo+audio description, (2) AI checks logical consistency, (3) Nearby users are prompted to verify, (4) Professional validators inspect if bounty >$1000, (5) Settlement only happens after 3/5 checks pass.',
    estimatedCost: '$0.50-5.00 per settlement verification',
    estimatedTime: '4-6 weeks to implement',
    dependencies: ['Gemini Vision API', 'EXIF parser', 'Image forensics service', 'Professional validator network']
  },
  {
    id: 'influence-economics',
    title: 'Influence & Economic Model',
    category: 'architecture',
    demoStatus: 'working',
    productionStatus: 'enhanced',
    icon: Users,
    description: 'How The Record tracks influence, stakes, and rewards',
    demoExplanation: 'Demo mode implements REAL zero-sum math. The influence calculations are correct. Gini tax works. Settlement deltas are accurate. This is one of the most complete components.',
    productionRequirements: [
      'Persistent ledger (currently in-memory)',
      'Audit trail for all influence changes',
      'Public transparency dashboard',
      'Inflation/deflation controls',
      'Emergency circuit breakers',
      'Multi-signature treasury for high-value bounties',
      'Tax collection and redistribution mechanisms'
    ],
    technicalDetails: 'Production adds persistent ledger and public auditability. Every influence change is signed, hashed, and added to the black box. Total influence supply is tracked. Gini coefficient is computed every 24h to detect capture.',
    estimatedCost: 'Minimal (computation only)',
    estimatedTime: '2-3 weeks to add persistence',
    dependencies: ['Database', 'Black box ledger (already working)']
  }
]

export function VideoWalkthrough() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const currentStepData = walkthroughSteps[currentStep]
  const progress = ((currentStep + 1) / walkthroughSteps.length) * 100

  const filteredSteps = selectedCategory === 'all' 
    ? walkthroughSteps 
    : walkthroughSteps.filter(s => s.category === selectedCategory)

  const nextStep = () => {
    if (currentStep < walkthroughSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      setCurrentStep(0)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    } else {
      setCurrentStep(walkthroughSteps.length - 1)
    }
  }

  const getDemoStatusBadge = (status: string) => {
    switch(status) {
      case 'working':
        return <Badge className="bg-success text-success-foreground"><CheckCircle size={14} className="mr-1" />Fully Working</Badge>
      case 'simulated':
        return <Badge className="bg-accent text-accent-foreground"><Warning size={14} className="mr-1" />Simulated</Badge>
      case 'disabled':
        return <Badge variant="destructive"><XCircle size={14} className="mr-1" />Not Active</Badge>
    }
  }

  const getProductionStatusBadge = (status: string) => {
    switch(status) {
      case 'required':
        return <Badge variant="destructive"><Warning size={14} className="mr-1" />Required</Badge>
      case 'optional':
        return <Badge variant="outline"><Info size={14} className="mr-1" />Optional</Badge>
      case 'enhanced':
        return <Badge className="bg-primary text-primary-foreground"><CheckCircle size={14} className="mr-1" />Enhance Existing</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Demo vs Production Walkthrough</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Understanding what works now and what's needed for real deployment
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedCategory('all')}
          >
            All ({walkthroughSteps.length})
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedCategory('architecture')}
          >
            Architecture
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedCategory('security')}
          >
            Security
          </Button>
        </div>
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-lg">
              <currentStepData.icon size={24} className="text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">{currentStepData.title}</h3>
              <p className="text-sm text-muted-foreground">{currentStepData.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={prevStep}
            >
              <SkipBack size={18} />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? <Pause size={18} /> : <Play size={18} />}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={nextStep}
            >
              <SkipForward size={18} />
            </Button>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
            <span>Step {currentStep + 1} of {walkthroughSteps.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Tabs defaultValue="demo" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="demo">
              <LockOpen size={16} className="mr-2" />
              Demo Mode
            </TabsTrigger>
            <TabsTrigger value="production">
              <Lock size={16} className="mr-2" />
              Production
            </TabsTrigger>
            <TabsTrigger value="technical">
              <Code size={16} className="mr-2" />
              Technical
            </TabsTrigger>
          </TabsList>

          <TabsContent value="demo" className="mt-4">
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">Current Demo Status</h4>
                  {getDemoStatusBadge(currentStepData.demoStatus)}
                </div>

                <div className="p-4 bg-muted/50 rounded-lg border border-border">
                  <p className="text-sm leading-relaxed">
                    {currentStepData.demoExplanation}
                  </p>
                </div>

                <div className="space-y-2">
                  <h5 className="font-semibold text-sm">What This Means</h5>
                  {currentStepData.demoStatus === 'working' && (
                    <div className="p-3 bg-success/10 border border-success/30 rounded-lg">
                      <p className="text-sm text-success-foreground">
                        ✅ This component is production-ready. The code works correctly and can be used as-is or with minor enhancements.
                      </p>
                    </div>
                  )}
                  {currentStepData.demoStatus === 'simulated' && (
                    <div className="p-3 bg-accent/10 border border-accent/30 rounded-lg">
                      <p className="text-sm">
                        ⚠️ This component APPEARS to work but uses fake data or simulated responses. It demonstrates the concept but cannot be used in production.
                      </p>
                    </div>
                  )}
                  {currentStepData.demoStatus === 'disabled' && (
                    <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-lg">
                      <p className="text-sm text-destructive-foreground">
                        ❌ This component is not currently active in the demo. It exists in design only.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="production" className="mt-4">
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">Production Requirements</h4>
                  {getProductionStatusBadge(currentStepData.productionStatus)}
                </div>

                <div className="space-y-3">
                  {currentStepData.productionRequirements.map((req, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                      <CheckCircle size={18} className="text-primary mt-0.5 flex-shrink-0" />
                      <p className="text-sm">{req}</p>
                    </div>
                  ))}
                </div>

                {currentStepData.estimatedCost && (
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="p-4 bg-accent/10 rounded-lg border border-accent/30">
                      <p className="text-xs text-muted-foreground mb-1">Estimated Cost</p>
                      <p className="text-lg font-semibold">{currentStepData.estimatedCost}</p>
                    </div>
                    <div className="p-4 bg-primary/10 rounded-lg border border-primary/30">
                      <p className="text-xs text-muted-foreground mb-1">Implementation Time</p>
                      <p className="text-lg font-semibold">{currentStepData.estimatedTime}</p>
                    </div>
                  </div>
                )}

                {currentStepData.dependencies && (
                  <div className="mt-4">
                    <h5 className="font-semibold text-sm mb-2">Dependencies</h5>
                    <div className="flex flex-wrap gap-2">
                      {currentStepData.dependencies.map((dep, idx) => (
                        <Badge key={idx} variant="outline">{dep}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="technical" className="mt-4">
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-4">
                <h4 className="font-semibold">Technical Deep Dive</h4>

                <div className="p-4 bg-muted/50 rounded-lg border border-border font-mono text-xs leading-relaxed">
                  {currentStepData.technicalDetails}
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <div className="p-4 bg-card rounded-lg border border-border">
                    <h5 className="font-semibold text-sm mb-2 flex items-center gap-2">
                      <LockOpen size={16} />
                      Demo Implementation
                    </h5>
                    <p className="text-xs text-muted-foreground">
                      {currentStepData.demoStatus === 'working' 
                        ? 'Fully implemented with production-quality code'
                        : currentStepData.demoStatus === 'simulated'
                        ? 'Implemented with mock data and simulated responses'
                        : 'Not implemented - concept only'}
                    </p>
                  </div>

                  <div className="p-4 bg-card rounded-lg border border-border">
                    <h5 className="font-semibold text-sm mb-2 flex items-center gap-2">
                      <Lock size={16} />
                      Production Gap
                    </h5>
                    <p className="text-xs text-muted-foreground">
                      {currentStepData.productionStatus === 'required'
                        ? 'Must be fully implemented before production launch'
                        : currentStepData.productionStatus === 'enhanced'
                        ? 'Current implementation works but needs optimization for scale'
                        : 'Can launch without this, add later for improved UX'}
                    </p>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {walkthroughSteps.map((step, idx) => (
          <motion.div
            key={step.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Card
              className={`p-3 cursor-pointer transition-all ${
                currentStep === idx
                  ? 'border-primary bg-primary/5'
                  : 'hover:border-primary/50'
              }`}
              onClick={() => setCurrentStep(idx)}
            >
              <div className="flex items-center gap-2 mb-2">
                <step.icon size={18} className={currentStep === idx ? 'text-primary' : 'text-muted-foreground'} />
                <span className="text-xs font-semibold truncate">{step.title}</span>
              </div>
              <div className="flex gap-1">
                {step.demoStatus === 'working' && (
                  <div className="w-2 h-2 rounded-full bg-success" />
                )}
                {step.demoStatus === 'simulated' && (
                  <div className="w-2 h-2 rounded-full bg-accent" />
                )}
                {step.demoStatus === 'disabled' && (
                  <div className="w-2 h-2 rounded-full bg-destructive" />
                )}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card className="p-6 bg-primary/5 border-primary/30">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <Info size={20} className="text-primary" />
          Understanding Demo Mode
        </h3>
        <div className="space-y-2 text-sm">
          <p>
            <strong>Demo Mode</strong> is designed to let you explore The Record's concepts, architecture, and user experience WITHOUT needing production infrastructure.
          </p>
          <p>
            <strong>What's Real:</strong> The UI, the data flow, the clustering algorithms, the influence calculations, the hash chain, and the zero-sum economics.
          </p>
          <p>
            <strong>What's Simulated:</strong> Identity verification, location verification, decentralized storage, consensus validation, and reality settlement.
          </p>
          <p className="text-muted-foreground">
            Think of it as a high-fidelity architectural prototype. The blueprint is complete, the physics is correct, but it's not yet connected to the real world.
          </p>
        </div>
      </Card>
    </div>
  )
}
