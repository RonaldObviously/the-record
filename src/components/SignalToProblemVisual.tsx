import { useState } from 'react'
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
  ArrowsClockwise
} from '@phosphor-icons/react'

interface SignalDot {
  id: string
  x: number
  y: number
  description: string
}

interface Cluster {
  id: string
  signals: SignalDot[]
  centerX: number
  centerY: number
  gravity: number
}

export function SignalToProblemVisual() {
  const [stage, setStage] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [signals, setSignals] = useState<SignalDot[]>([])
  const [clusters, setClusters] = useState<Cluster[]>([])
  const [problem, setProblem] = useState<Cluster | null>(null)

  const stages = [
    {
      title: 'Individual Signals',
      description: 'Multiple people independently report water quality issues in their neighborhood',
      icon: <Broadcast size={24} weight="duotone" />
    },
    {
      title: 'Geographic Clustering',
      description: 'System detects signals in same H3 cell with similar categories',
      icon: <Crosshair size={24} weight="duotone" />
    },
    {
      title: 'Cluster Formation',
      description: 'Signals group together based on location and semantic similarity',
      icon: <Stack size={24} weight="duotone" />
    },
    {
      title: 'Semantic Analysis',
      description: 'AI synthesizes individual descriptions into unified summary',
      icon: <Users size={24} weight="duotone" />
    },
    {
      title: 'Gravity Threshold',
      description: 'Cluster weight reaches critical mass for promotion',
      icon: <Flame size={24} weight="duotone" />
    },
    {
      title: 'Problem Created',
      description: 'Official problem created and ready for proposals',
      icon: <CheckCircle size={24} weight="duotone" />
    }
  ]

  const simulateSignals = () => {
    const newSignals: SignalDot[] = [
      { id: 's1', x: 150, y: 180, description: 'Water tastes metallic' },
      { id: 's2', x: 180, y: 160, description: 'Brown tap water' },
      { id: 's3', x: 160, y: 200, description: 'Discolored water' },
      { id: 's4', x: 190, y: 190, description: 'Strange water smell' },
      { id: 's5', x: 170, y: 170, description: 'Cloudy water' },
      { id: 's6', x: 155, y: 195, description: 'Water quality issue' }
    ]
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
      gravity: signals.length * 15
    }])
  }

  const promoteToProblem = () => {
    if (clusters.length > 0) {
      setProblem(clusters[0])
    }
  }

  const nextStage = () => {
    const next = stage + 1
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

    if (next >= stages.length) {
      setStage(0)
      setSignals([])
      setClusters([])
      setProblem(null)
    }
  }

  const playAnimation = () => {
    setIsPlaying(true)
    setStage(0)
    setSignals([])
    setClusters([])
    setProblem(null)

    const interval = setInterval(() => {
      setStage(prev => {
        const next = prev + 1
        
        if (next === 1) simulateSignals()
        else if (next === 2) formClusters()
        else if (next === 5) promoteToProblem()

        if (next >= stages.length) {
          clearInterval(interval)
          setIsPlaying(false)
          return 0
        }
        return next
      })
    }, 2500)
  }

  const reset = () => {
    setStage(0)
    setSignals([])
    setClusters([])
    setProblem(null)
    setIsPlaying(false)
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-3">
        <h2 className="text-2xl font-semibold">Signal to Problem: Visual Flow</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto text-sm">
          Watch how individual anonymous observations automatically aggregate into validated problems
          through deterministic algorithms—no committees, no voting, just math.
        </p>
      </div>

      <div className="flex gap-3 justify-center">
        <Button
          onClick={playAnimation}
          disabled={isPlaying}
          size="sm"
        >
          {isPlaying ? (
            <>
              <Pause size={16} className="mr-2" />
              Playing...
            </>
          ) : (
            <>
              <Play size={16} className="mr-2" />
              Play Animation
            </>
          )}
        </Button>
        <Button
          onClick={nextStage}
          disabled={isPlaying}
          variant="outline"
          size="sm"
        >
          Next Step
        </Button>
        <Button
          onClick={reset}
          variant="outline"
          size="sm"
        >
          <ArrowsClockwise size={16} className="mr-2" />
          Reset
        </Button>
      </div>

      <Card className="p-8 bg-card">
        <div className="relative bg-muted/30 rounded-lg" style={{ height: '400px' }}>
          <svg width="100%" height="100%" className="absolute inset-0">
            <defs>
              <radialGradient id="clusterGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="oklch(0.65 0.15 70)" stopOpacity="0.3" />
                <stop offset="100%" stopColor="oklch(0.65 0.15 70)" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="problemGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="oklch(0.55 0.15 165)" stopOpacity="0.4" />
                <stop offset="100%" stopColor="oklch(0.55 0.15 165)" stopOpacity="0" />
              </radialGradient>
            </defs>

            <AnimatePresence>
              {clusters.length > 0 && stage >= 2 && stage < 5 && (
                <motion.g
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <motion.circle
                    cx={clusters[0].centerX}
                    cy={clusters[0].centerY}
                    r={60}
                    fill="url(#clusterGlow)"
                    initial={{ r: 0 }}
                    animate={{ r: 60 }}
                    transition={{ duration: 0.8 }}
                  />
                  <motion.circle
                    cx={clusters[0].centerX}
                    cy={clusters[0].centerY}
                    r={3}
                    fill="oklch(0.65 0.15 70)"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3 }}
                  />
                </motion.g>
              )}

              {problem && stage >= 5 && (
                <motion.g
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <motion.circle
                    cx={problem.centerX}
                    cy={problem.centerY}
                    r={80}
                    fill="url(#problemGlow)"
                    initial={{ r: 0 }}
                    animate={{ r: 80 }}
                    transition={{ duration: 1 }}
                  />
                  <motion.circle
                    cx={problem.centerX}
                    cy={problem.centerY}
                    r={8}
                    fill="oklch(0.55 0.15 165)"
                    stroke="oklch(0.98 0 0)"
                    strokeWidth={2}
                    initial={{ scale: 0 }}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ 
                      scale: { repeat: Infinity, duration: 2 },
                      delay: 0.3 
                    }}
                  />
                </motion.g>
              )}

              {signals.map((signal, idx) => (
                <motion.g
                  key={signal.id}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1,
                    x: stage >= 2 ? clusters[0]?.centerX - signal.x : 0,
                    y: stage >= 2 ? clusters[0]?.centerY - signal.y : 0
                  }}
                  exit={{ opacity: 0 }}
                  transition={{ 
                    delay: idx * 0.15,
                    x: { delay: 0.5, duration: 0.8 },
                    y: { delay: 0.5, duration: 0.8 }
                  }}
                >
                  <circle
                    cx={signal.x}
                    cy={signal.y}
                    r={6}
                    fill="oklch(0.60 0.15 240)"
                    stroke="oklch(0.98 0 0)"
                    strokeWidth={1}
                  />
                  <motion.circle
                    cx={signal.x}
                    cy={signal.y}
                    r={6}
                    fill="none"
                    stroke="oklch(0.60 0.15 240)"
                    strokeWidth={1}
                    initial={{ r: 6, opacity: 0.8 }}
                    animate={{ r: 15, opacity: 0 }}
                    transition={{ 
                      repeat: Infinity, 
                      duration: 2,
                      delay: idx * 0.15
                    }}
                  />
                </motion.g>
              ))}
            </AnimatePresence>

            {stage >= 3 && clusters.length > 0 && (
              <motion.g
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {signals.map((signal, idx) => (
                  <motion.line
                    key={`line-${signal.id}`}
                    x1={signal.x}
                    y1={signal.y}
                    x2={clusters[0].centerX}
                    y2={clusters[0].centerY}
                    stroke="oklch(0.58 0.15 120)"
                    strokeWidth={1}
                    strokeOpacity={0.3}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 0.5 + idx * 0.1, duration: 0.5 }}
                  />
                ))}
              </motion.g>
            )}
          </svg>

          <div className="absolute top-4 right-4 text-right space-y-1">
            <AnimatePresence mode="wait">
              {signals.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <Badge variant="secondary" className="font-mono text-xs">
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
                >
                  <Badge 
                    variant="secondary" 
                    className="font-mono text-xs"
                    style={{ 
                      backgroundColor: 'oklch(0.65 0.15 70 / 0.2)',
                      borderColor: 'oklch(0.65 0.15 70)'
                    }}
                  >
                    gravity: {clusters[0].gravity}
                  </Badge>
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
                    className="font-mono text-xs"
                    style={{ 
                      backgroundColor: 'oklch(0.55 0.15 165 / 0.2)',
                      borderColor: 'oklch(0.55 0.15 165)'
                    }}
                  >
                    ✓ Problem Created
                  </Badge>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </Card>

      <div className="grid gap-4">
        {stages.map((s, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0.5 }}
            animate={{ 
              opacity: stage === idx ? 1 : 0.5,
              scale: stage === idx ? 1 : 0.98
            }}
            transition={{ duration: 0.3 }}
          >
            <Card 
              className={`p-4 border-2 transition-all ${
                stage === idx 
                  ? 'border-primary shadow-lg' 
                  : 'border-border'
              }`}
            >
              <div className="flex items-start gap-4">
                <div 
                  className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center transition-all ${
                    stage === idx
                      ? 'bg-primary/20 text-primary'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {s.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge 
                      variant={stage === idx ? 'default' : 'outline'}
                      className="font-mono text-xs"
                    >
                      {idx + 1}
                    </Badge>
                    <h4 className="font-semibold text-sm">{s.title}</h4>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {s.description}
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card className="p-6 bg-accent/5 border-accent/20">
        <div className="space-y-4">
          <h3 className="font-semibold text-sm flex items-center gap-2">
            <CheckCircle size={20} className="text-accent" weight="duotone" />
            Key Technical Details
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <div className="font-mono text-muted-foreground">CLUSTERING ALGORITHM</div>
              <div className="text-foreground/90">
                Signals → 3+ in same H3 cell + similar category → Automatic cluster
              </div>
            </div>
            <div className="space-y-1">
              <div className="font-mono text-muted-foreground">GRAVITY FORMULA</div>
              <div className="text-foreground/90">
                (signals × 10) + (attestations × 5) + (influence × 0.1)
              </div>
            </div>
            <div className="space-y-1">
              <div className="font-mono text-muted-foreground">THRESHOLD</div>
              <div className="text-foreground/90">
                Cluster becomes Problem when gravity ≥ 100 points
              </div>
            </div>
            <div className="space-y-1">
              <div className="font-mono text-muted-foreground">PRIVACY</div>
              <div className="text-foreground/90">
                H3 cells provide ~500m radius anonymity zone
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
