import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Broadcast, 
  Crosshair, 
  Stack, 
  CheckCircle, 
  Flame,
  Users,
  Play,
  Pause,
  ArrowsClockwise,
  Lightning,
  Brain,
  Target
} from '@phosphor-icons/react'

interface SignalDot {
  id: string
  x: number
  y: number
  description: string
  category: string
  timestamp: number
  color: string
}

interface Cluster {
  id: string
  signals: SignalDot[]
  centerX: number
  centerY: number
  gravity: number
  semanticScore: number
}

interface Problem {
  id: string
  description: string
  category: string
  priority: number
  signalCount: number
  h3Cell: string
  x: number
  y: number
}

const SIGNAL_DATA = [
  { desc: 'Water tastes metallic', category: 'water', x: 140, y: 160, color: 'oklch(0.60 0.15 240)' },
  { desc: 'Brown tap water', category: 'water', x: 180, y: 140, color: 'oklch(0.60 0.15 240)' },
  { desc: 'Discolored water', category: 'water', x: 155, y: 185, color: 'oklch(0.60 0.15 240)' },
  { desc: 'Strange water smell', category: 'water', x: 195, y: 175, color: 'oklch(0.60 0.15 240)' },
  { desc: 'Cloudy water', category: 'water', x: 165, y: 155, color: 'oklch(0.60 0.15 240)' },
  { desc: 'Water quality issue', category: 'water', x: 150, y: 170, color: 'oklch(0.60 0.15 240)' }
]

export function SignalToProblemVisual() {
  const [stage, setStage] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [signals, setSignals] = useState<SignalDot[]>([])
  const [clusters, setClusters] = useState<Cluster[]>([])
  const [problem, setProblem] = useState<Problem | null>(null)
  const [hoveredSignal, setHoveredSignal] = useState<string | null>(null)
  const animationRef = useRef<NodeJS.Timeout | null>(null)

  const stages = [
    {
      id: 0,
      title: 'Anonymous Signal Submission',
      description: 'Multiple people independently report water quality issues in their neighborhood. Each signal is H3-geolocated but identity-anonymous.',
      icon: <Broadcast size={24} weight="duotone" />,
      color: 'oklch(0.60 0.15 240)',
      tech: 'H3 Level 9 cells (~500m radius)'
    },
    {
      id: 1,
      title: 'Geographic Clustering Detection',
      description: 'System scans for signals in the same H3 cell with semantic similarity. Clustering happens automatically without human intervention.',
      icon: <Crosshair size={24} weight="duotone" />,
      color: 'oklch(0.65 0.15 70)',
      tech: 'Spatial indexing + Category matching'
    },
    {
      id: 2,
      title: 'Cluster Formation',
      description: 'Signals group together based on geographic proximity and category. Lines show the relationship strength between signals.',
      icon: <Stack size={24} weight="duotone" />,
      color: 'oklch(0.65 0.15 70)',
      tech: 'DBSCAN clustering algorithm'
    },
    {
      id: 3,
      title: 'Semantic AI Analysis',
      description: 'AI reads all signal descriptions and generates a unified technical summary. Detects patterns and synthesizes meaning.',
      icon: <Brain size={24} weight="duotone" />,
      color: 'oklch(0.65 0.15 150)',
      tech: 'Gemini 2.0 Flash semantic synthesis'
    },
    {
      id: 4,
      title: 'Gravity Weight Calculation',
      description: 'Cluster weight = (signals × 10) + (attestations × 5) + (submitter influence × 0.1). Must reach threshold of 100.',
      icon: <Flame size={24} weight="duotone" />,
      color: 'oklch(0.65 0.15 70)',
      tech: 'Zero-sum influence math'
    },
    {
      id: 5,
      title: 'Problem Promotion',
      description: 'Cluster reaches critical mass and is promoted to official Problem. Ready for proposals and resource allocation.',
      icon: <CheckCircle size={24} weight="duotone" />,
      color: 'oklch(0.55 0.15 165)',
      tech: 'Byzantine consensus validation'
    }
  ]

  const simulateSignals = () => {
    const newSignals: SignalDot[] = SIGNAL_DATA.map((data, idx) => ({
      id: `s${idx + 1}`,
      x: data.x,
      y: data.y,
      description: data.desc,
      category: data.category,
      timestamp: Date.now() + idx * 100,
      color: data.color
    }))
    setSignals(newSignals)
  }

  const formClusters = () => {
    if (signals.length === 0) return
    
    const centerX = signals.reduce((sum, s) => sum + s.x, 0) / signals.length
    const centerY = signals.reduce((sum, s) => sum + s.y, 0) / signals.length
    
    setClusters([{
      id: 'c1',
      signals: signals,
      centerX,
      centerY,
      gravity: signals.length * 10 + signals.length * 5,
      semanticScore: 0.87
    }])
  }

  const promoteToProblem = () => {
    if (clusters.length === 0) return
    const cluster = clusters[0]
    
    setProblem({
      id: 'prob-8928374',
      description: 'Multiple reports of water discoloration and quality issues',
      category: 'water',
      priority: 8,
      signalCount: cluster.signals.length,
      h3Cell: 'hex-8928374ab2c',
      x: cluster.centerX,
      y: cluster.centerY
    })
  }

  const nextStage = () => {
    const next = stage + 1
    
    if (next >= stages.length) {
      reset()
      return
    }
    
    setStage(next)

    if (next === 0) {
      setSignals([])
      setClusters([])
      setProblem(null)
    } else if (next === 1) {
      simulateSignals()
    } else if (next === 2) {
      formClusters()
    } else if (next === 5) {
      promoteToProblem()
    }
  }

  const playAnimation = () => {
    reset()
    setIsPlaying(true)
    
    const stages = [
      { delay: 0, fn: () => setStage(0) },
      { delay: 2000, fn: () => { setStage(1); simulateSignals() } },
      { delay: 5000, fn: () => { setStage(2); formClusters() } },
      { delay: 7500, fn: () => setStage(3) },
      { delay: 9500, fn: () => setStage(4) },
      { delay: 11500, fn: () => { setStage(5); promoteToProblem() } },
      { delay: 14000, fn: () => setIsPlaying(false) }
    ]

    stages.forEach(({ delay, fn }) => {
      setTimeout(fn, delay)
    })
  }

  const reset = () => {
    setStage(0)
    setSignals([])
    setClusters([])
    setProblem(null)
    setIsPlaying(false)
    if (animationRef.current) {
      clearTimeout(animationRef.current)
    }
  }

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current)
      }
    }
  }, [])

  const clusterGravity = clusters[0]?.gravity || 0
  const currentStage = stages[stage]

  return (
    <div className="space-y-6">
      <div className="text-center space-y-3">
        <h2 className="text-3xl font-bold font-mono">SIGNAL → PROBLEM LIFECYCLE</h2>
        <p className="text-muted-foreground max-w-3xl mx-auto">
          Watch how individual anonymous observations automatically aggregate into validated problems
          through deterministic algorithms—no committees, no voting, just math.
        </p>
      </div>

      <div className="flex gap-3 justify-center items-center flex-wrap">
        <Button
          onClick={playAnimation}
          disabled={isPlaying}
          size="sm"
          className="gap-2"
        >
          {isPlaying ? (
            <>
              <Pause size={16} weight="fill" />
              Playing...
            </>
          ) : (
            <>
              <Play size={16} weight="fill" />
              Play Full Animation
            </>
          )}
        </Button>
        <Button
          onClick={nextStage}
          disabled={isPlaying}
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <Lightning size={16} />
          Step Forward
        </Button>
        <Button
          onClick={reset}
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <ArrowsClockwise size={16} />
          Reset
        </Button>
        <Badge variant="outline" className="font-mono ml-4">
          Stage {stage + 1} / {stages.length}
        </Badge>
      </div>

      <Card className="p-8 bg-gradient-to-br from-card to-muted/20 border-2">
        <div className="relative bg-background/60 backdrop-blur-sm rounded-xl border-2 border-border" style={{ height: '500px' }}>
          <svg width="100%" height="100%" className="absolute inset-0">
            <defs>
              <radialGradient id="clusterGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="oklch(0.65 0.15 70)" stopOpacity="0.4" />
                <stop offset="50%" stopColor="oklch(0.65 0.15 70)" stopOpacity="0.2" />
                <stop offset="100%" stopColor="oklch(0.65 0.15 70)" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="problemGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="oklch(0.55 0.15 165)" stopOpacity="0.5" />
                <stop offset="50%" stopColor="oklch(0.55 0.15 165)" stopOpacity="0.2" />
                <stop offset="100%" stopColor="oklch(0.55 0.15 165)" stopOpacity="0" />
              </radialGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>

            {/* Grid background */}
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="oklch(0.28 0.01 240)" strokeWidth="0.5" opacity="0.2"/>
            </pattern>
            <rect width="100%" height="100%" fill="url(#grid)" />

            {/* Cluster glow effect */}
            <AnimatePresence>
              {clusters.length > 0 && stage >= 2 && stage < 5 && (
                <motion.g
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <motion.circle
                    cx={clusters[0].centerX}
                    cy={clusters[0].centerY}
                    r={90}
                    fill="url(#clusterGlow)"
                    initial={{ r: 0 }}
                    animate={{ r: 90 }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                  />
                  <motion.circle
                    cx={clusters[0].centerX}
                    cy={clusters[0].centerY}
                    r={4}
                    fill="oklch(0.65 0.15 70)"
                    filter="url(#glow)"
                    initial={{ scale: 0 }}
                    animate={{ scale: [0, 1.2, 1] }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                  />
                </motion.g>
              )}

              {/* Problem glow effect */}
              {problem && stage >= 5 && (
                <motion.g
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1 }}
                >
                  <motion.circle
                    cx={problem.x}
                    cy={problem.y}
                    r={120}
                    fill="url(#problemGlow)"
                    initial={{ r: 0 }}
                    animate={{ r: 120 }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                  />
                  <motion.circle
                    cx={problem.x}
                    cy={problem.y}
                    r={10}
                    fill="oklch(0.55 0.15 165)"
                    stroke="oklch(0.98 0 0)"
                    strokeWidth={3}
                    filter="url(#glow)"
                    initial={{ scale: 0 }}
                    animate={{ 
                      scale: [0, 1.3, 1],
                      opacity: [1, 0.8, 1]
                    }}
                    transition={{ 
                      scale: { repeat: Infinity, duration: 3, ease: 'easeInOut' },
                      opacity: { repeat: Infinity, duration: 3, ease: 'easeInOut' }
                    }}
                  />
                </motion.g>
              )}

              {/* Connection lines between signals and cluster */}
              {stage >= 2 && clusters.length > 0 && (
                <motion.g
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                >
                  {signals.map((signal, idx) => (
                    <motion.line
                      key={`line-${signal.id}`}
                      x1={signal.x}
                      y1={signal.y}
                      x2={clusters[0].centerX}
                      y2={clusters[0].centerY}
                      stroke={stage >= 3 ? 'oklch(0.65 0.15 150)' : 'oklch(0.65 0.15 70)'}
                      strokeWidth={2}
                      strokeOpacity={hoveredSignal === signal.id ? 0.8 : 0.3}
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ 
                        delay: 0.5 + idx * 0.1, 
                        duration: 0.6,
                        pathLength: { ease: 'easeInOut' }
                      }}
                    />
                  ))}
                </motion.g>
              )}

              {/* Individual signals */}
              {signals.map((signal, idx) => {
                const targetX = stage >= 2 && clusters[0] ? clusters[0].centerX : signal.x
                const targetY = stage >= 2 && clusters[0] ? clusters[0].centerY : signal.y
                const orbitAngle = (idx / signals.length) * Math.PI * 2
                const orbitRadius = 50
                const finalX = targetX + Math.cos(orbitAngle) * orbitRadius
                const finalY = targetY + Math.sin(orbitAngle) * orbitRadius

                return (
                  <motion.g
                    key={signal.id}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ 
                      opacity: stage >= 5 ? 0 : 1,
                      scale: stage >= 5 ? 0 : 1,
                      x: stage >= 2 ? finalX - signal.x : 0,
                      y: stage >= 2 ? finalY - signal.y : 0
                    }}
                    exit={{ opacity: 0, scale: 0 }}
                    transition={{ 
                      delay: idx * 0.15,
                      duration: stage >= 2 ? 1 : 0.4,
                      x: { delay: 0.8, duration: 1.2, ease: 'easeInOut' },
                      y: { delay: 0.8, duration: 1.2, ease: 'easeInOut' }
                    }}
                    onMouseEnter={() => setHoveredSignal(signal.id)}
                    onMouseLeave={() => setHoveredSignal(null)}
                    style={{ cursor: 'pointer' }}
                  >
                    <circle
                      cx={signal.x}
                      cy={signal.y}
                      r={hoveredSignal === signal.id ? 9 : 7}
                      fill={signal.color}
                      stroke="oklch(0.98 0 0)"
                      strokeWidth={hoveredSignal === signal.id ? 2.5 : 1.5}
                      filter="url(#glow)"
                    />
                    {/* Pulse ring */}
                    <motion.circle
                      cx={signal.x}
                      cy={signal.y}
                      r={7}
                      fill="none"
                      stroke={signal.color}
                      strokeWidth={2}
                      initial={{ r: 7, opacity: 0.8 }}
                      animate={{ r: 20, opacity: 0 }}
                      transition={{ 
                        repeat: Infinity, 
                        duration: 2,
                        delay: idx * 0.3,
                        ease: 'easeOut'
                      }}
                    />
                  </motion.g>
                )
              })}
            </AnimatePresence>
          </svg>

          {/* Stats overlay */}
          <div className="absolute top-4 right-4 space-y-2">
            <AnimatePresence mode="wait">
              {signals.length > 0 && stage < 5 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <Badge variant="secondary" className="font-mono text-xs bg-primary/10 border-primary/40">
                    <Broadcast size={14} className="mr-1.5" />
                    {signals.length} signals
                  </Badge>
                </motion.div>
              )}
            </AnimatePresence>
            
            <AnimatePresence mode="wait">
              {clusters.length > 0 && stage >= 2 && stage < 5 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-2"
                >
                  <Badge 
                    variant="secondary" 
                    className="font-mono text-xs bg-accent/10 border-accent/40 block"
                  >
                    <Flame size={14} className="mr-1.5 inline" />
                    Gravity: {clusterGravity} / 100
                  </Badge>
                  {stage >= 3 && (
                    <Badge 
                      variant="secondary" 
                      className="font-mono text-xs bg-success/10 border-success/40 block"
                    >
                      <Brain size={14} className="mr-1.5 inline" />
                      Semantic: {(clusters[0].semanticScore * 100).toFixed(0)}%
                    </Badge>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
              {problem && stage >= 5 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <Badge 
                    variant="secondary" 
                    className="font-mono text-xs bg-success/20 border-success font-semibold"
                  >
                    <CheckCircle size={14} className="mr-1.5 inline" weight="fill" />
                    PROBLEM LIVE
                  </Badge>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Hovered signal tooltip */}
          <AnimatePresence>
            {hoveredSignal && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-4 left-4 bg-card/95 backdrop-blur-sm border-2 border-border rounded-lg p-3 shadow-lg"
                style={{ maxWidth: '250px' }}
              >
                {signals.find(s => s.id === hoveredSignal) && (
                  <div className="space-y-1">
                    <div className="font-mono text-xs text-muted-foreground">
                      Signal {hoveredSignal}
                    </div>
                    <div className="text-sm font-medium">
                      "{signals.find(s => s.id === hoveredSignal)?.description}"
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Category: {signals.find(s => s.id === hoveredSignal)?.category}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Card>

      {/* Current stage indicator */}
      <Card className="p-6 bg-gradient-to-r from-accent/5 to-transparent border-l-4 border-accent">
        <div className="flex items-start gap-4">
          <div 
            className="flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center"
            style={{ 
              backgroundColor: `${currentStage.color} / 0.15`,
              color: currentStage.color
            }}
          >
            {currentStage.icon}
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-3">
              <Badge variant="default" className="font-mono">
                STAGE {stage + 1}
              </Badge>
              <h3 className="text-lg font-semibold">{currentStage.title}</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {currentStage.description}
            </p>
            <div className="flex items-center gap-2 pt-2">
              <Target size={14} className="text-muted-foreground" />
              <span className="text-xs font-mono text-muted-foreground">
                {currentStage.tech}
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Stage progress timeline */}
      <div className="grid grid-cols-6 gap-3">
        {stages.map((s, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0.4 }}
            animate={{ 
              opacity: stage >= idx ? 1 : 0.4,
              scale: stage === idx ? 1.05 : 1
            }}
            transition={{ duration: 0.3 }}
          >
            <Card 
              className={`p-3 border-2 transition-all ${
                stage === idx 
                  ? 'border-accent shadow-lg shadow-accent/20' 
                  : stage > idx
                  ? 'border-success/40 bg-success/5'
                  : 'border-border/40'
              }`}
            >
              <div className="space-y-2">
                <div 
                  className={`w-10 h-10 rounded-lg mx-auto flex items-center justify-center ${
                    stage === idx
                      ? 'bg-accent/20 text-accent'
                      : stage > idx
                      ? 'bg-success/20 text-success'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {stage > idx ? (
                    <CheckCircle size={20} weight="fill" />
                  ) : (
                    s.icon
                  )}
                </div>
                <div className="text-center">
                  <div className="text-xs font-mono font-semibold mb-1">
                    {idx + 1}
                  </div>
                  <div className="text-xs text-muted-foreground leading-tight">
                    {s.title.split(' ')[0]}
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Technical details */}
      <Card className="p-6 bg-muted/30 border-2 border-dashed border-border">
        <div className="space-y-4">
          <h3 className="font-semibold text-sm flex items-center gap-2">
            <Lightning size={20} className="text-accent" weight="fill" />
            Mathematical & Cryptographic Details
          </h3>
          <div className="grid md:grid-cols-3 gap-6 text-xs">
            <div className="space-y-2">
              <div className="font-mono text-muted-foreground font-semibold">CLUSTERING ALGORITHM</div>
              <div className="text-foreground/90 leading-relaxed">
                Signals → 3+ in same H3 cell + category match + semantic similarity &gt; 0.7 → Automatic cluster formation
              </div>
            </div>
            <div className="space-y-2">
              <div className="font-mono text-muted-foreground font-semibold">GRAVITY FORMULA</div>
              <div className="text-foreground/90 font-mono leading-relaxed">
                G = (S × 10) + (A × 5) + (Σφ × 0.1)
              </div>
              <div className="text-muted-foreground text-[10px]">
                S=signals, A=attestations, φ=influence
              </div>
            </div>
            <div className="space-y-2">
              <div className="font-mono text-muted-foreground font-semibold">PROMOTION THRESHOLD</div>
              <div className="text-foreground/90 leading-relaxed">
                Cluster becomes Problem when gravity ≥ 100 points AND semantic score &gt; 0.75
              </div>
            </div>
            <div className="space-y-2">
              <div className="font-mono text-muted-foreground font-semibold">PRIVACY GUARANTEE</div>
              <div className="text-foreground/90 leading-relaxed">
                H3 Level 9 cells provide ~500m radius anonymity zone. Submitter identity never recorded.
              </div>
            </div>
            <div className="space-y-2">
              <div className="font-mono text-muted-foreground font-semibold">BYZANTINE CONSENSUS</div>
              <div className="text-foreground/90 leading-relaxed">
                2/3+ validator agreement required for promotion. Prevents single-point manipulation.
              </div>
            </div>
            <div className="space-y-2">
              <div className="font-mono text-muted-foreground font-semibold">IMMUTABILITY</div>
              <div className="text-foreground/90 leading-relaxed">
                All steps recorded in cryptographic hash chain. Problem creation is provably deterministic.
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
