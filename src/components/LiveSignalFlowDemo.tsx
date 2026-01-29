import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Broadcast, Stack, Flame, CheckCircle, Play, Pause, ArrowsClockwise, Brain, Users } from '@phosphor-icons/react'

interface AnimatedSignal {
  id: string
  text: string
  x: number
  y: number
  stage: 'spawning' | 'individual' | 'clustering' | 'cluster' | 'analyzing' | 'problem'
  color: string
}

const DEMO_SIGNALS = [
  { text: 'Water tastes metallic', color: 'oklch(0.60 0.15 240)' },
  { text: 'Brown water from tap', color: 'oklch(0.60 0.15 250)' },
  { text: 'Discolored tap water', color: 'oklch(0.60 0.15 230)' },
  { text: 'Strange smell in water', color: 'oklch(0.60 0.15 260)' },
  { text: 'Water quality issue', color: 'oklch(0.60 0.15 235)' },
  { text: 'Cloudy water today', color: 'oklch(0.60 0.15 245)' }
]

export function LiveSignalFlowDemo() {
  const [signals, setSignals] = useState<AnimatedSignal[]>([])
  const [clusterFormed, setClusterFormed] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [problemCreated, setProblemCreated] = useState(false)
  const [isRunning, setIsRunning] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const startDemo = () => {
    setSignals([])
    setClusterFormed(false)
    setAnalyzing(false)
    setProblemCreated(false)
    setCurrentIndex(0)
    setIsRunning(true)
    setIsPaused(false)
  }

  const pauseDemo = () => {
    setIsPaused(!isPaused)
  }

  const resetDemo = () => {
    setSignals([])
    setClusterFormed(false)
    setAnalyzing(false)
    setProblemCreated(false)
    setCurrentIndex(0)
    setIsRunning(false)
    setIsPaused(false)
  }

  useEffect(() => {
    if (!isRunning || isPaused || currentIndex >= DEMO_SIGNALS.length) {
      if (isRunning && !isPaused && currentIndex >= DEMO_SIGNALS.length && signals.length >= 3) {
        setTimeout(() => {
          setSignals(prev => prev.map(s => ({ ...s, stage: 'cluster' as const })))
          setClusterFormed(true)
        }, 500)
        
        setTimeout(() => {
          setSignals(prev => prev.map(s => ({ ...s, stage: 'analyzing' as const })))
          setAnalyzing(true)
        }, 2000)
        
        setTimeout(() => {
          setSignals(prev => prev.map(s => ({ ...s, stage: 'problem' as const })))
          setProblemCreated(true)
          setIsRunning(false)
        }, 4000)
      }
      return
    }

    const timer = setTimeout(() => {
      const signalData = DEMO_SIGNALS[currentIndex]
      const newSignal: AnimatedSignal = {
        id: `signal-${currentIndex}`,
        text: signalData.text,
        x: Math.random() * 70 + 15,
        y: 8,
        stage: 'spawning',
        color: signalData.color
      }
      
      setSignals(prev => [...prev, newSignal])
      setCurrentIndex(prev => prev + 1)

      setTimeout(() => {
        setSignals(prev => 
          prev.map(s => s.id === newSignal.id ? { ...s, stage: 'individual' as const } : s)
        )
      }, 100)

      setTimeout(() => {
        setSignals(prev => 
          prev.map(s => s.id === newSignal.id ? { ...s, stage: 'clustering' as const } : s)
        )
      }, 1000)
    }, 1400)

    return () => clearTimeout(timer)
  }, [isRunning, isPaused, currentIndex, signals.length])

  const getSignalPosition = (signal: AnimatedSignal) => {
    if (signal.stage === 'spawning' || signal.stage === 'individual') {
      return { x: signal.x, y: signal.y }
    } else if (signal.stage === 'clustering') {
      return { x: 50, y: 30 }
    } else if (signal.stage === 'cluster') {
      return { x: 50, y: 50 }
    } else if (signal.stage === 'analyzing') {
      return { x: 50, y: 65 }
    } else {
      return { x: 50, y: 82 }
    }
  }

  const clusterWeight = signals.filter(s => s.stage === 'cluster' || s.stage === 'analyzing' || s.stage === 'problem').length * 10 + 
                        signals.filter(s => s.stage === 'cluster' || s.stage === 'analyzing' || s.stage === 'problem').length * 5

  return (
    <Card className="p-6 bg-gradient-to-br from-card to-muted/10 border-2">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold font-mono mb-1">LIVE SIGNAL AGGREGATION</h3>
            <p className="text-sm text-muted-foreground">
              Real-time visualization of how individual observations cluster into validated problems
            </p>
          </div>
          <div className="flex gap-2">
            {!isRunning && signals.length === 0 && (
              <Button onClick={startDemo} size="sm" className="gap-2">
                <Play size={16} weight="fill" />
                Start Demo
              </Button>
            )}
            {isRunning && (
              <Button onClick={pauseDemo} variant="outline" size="sm" className="gap-2">
                {isPaused ? (
                  <>
                    <Play size={16} weight="fill" />
                    Resume
                  </>
                ) : (
                  <>
                    <Pause size={16} weight="fill" />
                    Pause
                  </>
                )}
              </Button>
            )}
            {(isRunning || signals.length > 0) && (
              <Button onClick={resetDemo} variant="outline" size="sm" className="gap-2">
                <ArrowsClockwise size={16} />
                Reset
              </Button>
            )}
          </div>
        </div>

        <div className="relative h-[600px] bg-gradient-to-b from-background via-muted/20 to-background rounded-xl border-2 border-border overflow-hidden">
          {/* Status indicators */}
          <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
            <Badge variant="outline" className="font-mono text-xs bg-card/90 backdrop-blur-sm">
              LAYER 1: SIGNAL PROCESSING
            </Badge>
            <div className="flex gap-2">
              <Badge variant="outline" className="font-mono text-xs bg-card/90 backdrop-blur-sm">
                Signals: {signals.length}
              </Badge>
              {clusterWeight > 0 && (
                <Badge 
                  variant="outline" 
                  className="font-mono text-xs bg-accent/10 border-accent/40"
                >
                  Weight: {clusterWeight}
                </Badge>
              )}
            </div>
          </div>

          {/* Layer dividers */}
          <div className="absolute top-[15%] left-0 right-0 px-6 space-y-1 z-0">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Broadcast size={16} weight="duotone" />
              <span className="font-mono">Individual Signals (Raw Submission)</span>
            </div>
            <div className="h-[2px] bg-gradient-to-r from-transparent via-border to-transparent" />
          </div>

          <div className="absolute top-[32%] left-0 right-0 px-6 space-y-1 z-0">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Stack size={16} weight="duotone" />
              <span className="font-mono">Clustering (H3 Cell + Category Match)</span>
            </div>
            <div className="h-[2px] bg-gradient-to-r from-transparent via-border to-transparent" />
          </div>

          <div className="absolute top-[52%] left-0 right-0 px-6 space-y-1 z-0">
            <div className="flex items-center gap-2 text-xs">
              <Flame size={16} weight="duotone" className={clusterFormed ? 'text-accent' : 'text-muted-foreground'} />
              <span className={`font-mono ${clusterFormed ? 'text-accent font-semibold' : 'text-muted-foreground'}`}>
                Cluster Formation {clusterFormed && '(Gravity Threshold Reached ✓)'}
              </span>
            </div>
            <div className={`h-[2px] bg-gradient-to-r from-transparent to-transparent ${clusterFormed ? 'via-accent' : 'via-border'}`} />
          </div>

          <div className="absolute top-[67%] left-0 right-0 px-6 space-y-1 z-0">
            <div className="flex items-center gap-2 text-xs">
              <Brain size={16} weight="duotone" className={analyzing ? 'text-primary' : 'text-muted-foreground'} />
              <span className={`font-mono ${analyzing ? 'text-primary font-semibold' : 'text-muted-foreground'}`}>
                AI Semantic Analysis {analyzing && '(Processing ⚡)'}
              </span>
            </div>
            <div className={`h-[2px] bg-gradient-to-r from-transparent to-transparent ${analyzing ? 'via-primary' : 'via-border'}`} />
          </div>

          <div className="absolute bottom-[12%] left-0 right-0 px-6 space-y-1 z-0">
            <div className="flex items-center gap-2 text-xs">
              <CheckCircle size={16} weight={problemCreated ? 'fill' : 'duotone'} className={problemCreated ? 'text-success' : 'text-muted-foreground'} />
              <span className={`font-mono ${problemCreated ? 'text-success font-semibold' : 'text-muted-foreground'}`}>
                Problem Created {problemCreated && '✓'}
              </span>
            </div>
            <div className={`h-[2px] bg-gradient-to-r from-transparent to-transparent ${problemCreated ? 'via-success' : 'via-border'}`} />
          </div>

          {/* Animated signals */}
          <AnimatePresence>
            {signals.map((signal, idx) => {
              const pos = getSignalPosition(signal)
              const isInCluster = signal.stage === 'cluster' || signal.stage === 'analyzing' || signal.stage === 'problem'
              const orbitAngle = isInCluster ? (idx / signals.length) * Math.PI * 2 : 0
              const orbitRadius = isInCluster ? 12 : 0
              const finalX = pos.x + (isInCluster ? Math.cos(orbitAngle) * orbitRadius : 0)
              const finalY = pos.y + (isInCluster ? Math.sin(orbitAngle) * orbitRadius : 0)

              return (
                <motion.div
                  key={signal.id}
                  initial={{ x: `${signal.x}%`, y: `${signal.y}%`, scale: 0, opacity: 0 }}
                  animate={{ 
                    x: `${finalX}%`, 
                    y: `${finalY}%`, 
                    scale: signal.stage === 'problem' ? 0 : 1,
                    opacity: signal.stage === 'problem' ? 0 : 1
                  }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ 
                    duration: 0.8, 
                    ease: 'easeInOut',
                    scale: { duration: signal.stage === 'spawning' ? 0.3 : 0.5 }
                  }}
                  className="absolute z-20"
                  style={{ transformOrigin: 'center' }}
                >
                  <div className="relative">
                    <motion.div
                      animate={isInCluster ? {
                        rotate: [0, 360]
                      } : {}}
                      transition={isInCluster ? {
                        rotate: { repeat: Infinity, duration: 20, ease: 'linear' }
                      } : {}}
                      className={`
                        px-3 py-2 rounded-lg text-xs font-mono border-2 shadow-lg backdrop-blur-sm
                        ${signal.stage === 'spawning' || signal.stage === 'individual' ? 'bg-primary/10 border-primary/40' : ''}
                        ${signal.stage === 'clustering' ? 'bg-accent/10 border-accent/40' : ''}
                        ${signal.stage === 'cluster' ? 'bg-accent/20 border-accent/60' : ''}
                        ${signal.stage === 'analyzing' ? 'bg-primary/20 border-primary/60' : ''}
                      `}
                      style={{ whiteSpace: 'nowrap' }}
                    >
                      {signal.text}
                    </motion.div>
                    
                    {/* Pulse effect */}
                    {(signal.stage === 'spawning' || signal.stage === 'individual') && (
                      <motion.div
                        className="absolute inset-0 rounded-lg border-2 border-primary/40"
                        initial={{ scale: 1, opacity: 0.6 }}
                        animate={{ scale: 1.5, opacity: 0 }}
                        transition={{ 
                          repeat: Infinity, 
                          duration: 1.5,
                          ease: 'easeOut'
                        }}
                      />
                    )}
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>

          {/* Cluster visualization */}
          <AnimatePresence>
            {clusterFormed && !problemCreated && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.6, ease: 'backOut' }}
                className="absolute left-1/2 top-[50%] -translate-x-1/2 -translate-y-1/2 z-10"
              >
                <Card className="p-4 bg-accent/10 border-accent border-2 shadow-2xl min-w-[320px] backdrop-blur-md">
                  <div className="flex items-start gap-3">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
                    >
                      <Flame size={28} className="text-accent flex-shrink-0" weight="fill" />
                    </motion.div>
                    <div className="text-xs space-y-2">
                      <div className="font-semibold text-foreground">Cluster Reached Maturity</div>
                      <div className="space-y-1 font-mono">
                        <div className="flex justify-between gap-4">
                          <span className="text-muted-foreground">Weight:</span>
                          <span className="text-accent font-semibold">{clusterWeight} / 100</span>
                        </div>
                        <div className="flex justify-between gap-4">
                          <span className="text-muted-foreground">Signals:</span>
                          <span className="text-foreground">{signals.filter(s => s.stage === 'cluster').length}</span>
                        </div>
                        <div className="flex justify-between gap-4">
                          <span className="text-muted-foreground">H3 Cell:</span>
                          <span className="text-foreground">hex-8928374</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* AI Analysis visualization */}
          <AnimatePresence>
            {analyzing && !problemCreated && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.6, ease: 'backOut' }}
                className="absolute left-1/2 top-[65%] -translate-x-1/2 -translate-y-1/2 z-10"
              >
                <Card className="p-4 bg-primary/10 border-primary border-2 shadow-2xl min-w-[360px] backdrop-blur-md">
                  <div className="flex items-start gap-3">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                    >
                      <Brain size={28} className="text-primary flex-shrink-0" weight="duotone" />
                    </motion.div>
                    <div className="text-xs space-y-2 flex-1">
                      <div className="font-semibold text-foreground">Semantic Analysis in Progress</div>
                      <div className="text-muted-foreground leading-relaxed">
                        AI synthesizing {signals.length} individual descriptions into unified technical summary...
                      </div>
                      <div className="flex items-center gap-2 text-primary font-mono">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                          className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full"
                        />
                        Processing
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Problem created */}
          <AnimatePresence>
            {problemCreated && (
              <motion.div
                initial={{ y: -50, opacity: 0, scale: 0.9 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: 'backOut' }}
                className="absolute left-1/2 bottom-4 -translate-x-1/2 z-30"
              >
                <Card className="p-5 bg-success/15 border-success border-2 shadow-2xl min-w-[450px] backdrop-blur-md">
                  <div className="flex items-start gap-4">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                    >
                      <CheckCircle size={32} className="text-success flex-shrink-0" weight="fill" />
                    </motion.div>
                    <div className="text-xs space-y-3 flex-1">
                      <div className="font-semibold text-success-foreground text-sm">
                        ✓ Problem Created: prob-cluster-8928374
                      </div>
                      <div className="text-foreground bg-card/50 p-2 rounded border border-border">
                        "Multiple reports of water discoloration and quality issues"
                      </div>
                      <div className="grid grid-cols-3 gap-3 font-mono">
                        <div className="space-y-0.5">
                          <div className="text-muted-foreground text-[10px]">Category</div>
                          <div className="text-foreground font-semibold">Water</div>
                        </div>
                        <div className="space-y-0.5">
                          <div className="text-muted-foreground text-[10px]">Priority</div>
                          <div className="text-accent font-semibold">8/10</div>
                        </div>
                        <div className="space-y-0.5">
                          <div className="text-muted-foreground text-[10px]">H3 Cell</div>
                          <div className="text-foreground font-semibold">hex-8928374</div>
                        </div>
                      </div>
                      <div className="pt-2 border-t border-border/40">
                        <div className="flex items-center gap-2 text-success">
                          <Users size={14} />
                          <span className="text-[10px] font-mono">Ready for community proposals & resource allocation</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Progress explanation */}
        <div className="grid grid-cols-4 gap-4 text-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Broadcast size={16} className="text-primary" />
              <div className="font-semibold">Raw Signals</div>
            </div>
            <div className="text-muted-foreground leading-relaxed">
              Individual observations submitted anonymously to the mesh
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Stack size={16} className="text-accent" />
              <div className="font-semibold">Auto-Clustering</div>
            </div>
            <div className="text-muted-foreground leading-relaxed">
              Geographic + semantic matching groups similar reports
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Brain size={16} className="text-primary" />
              <div className="font-semibold">AI Synthesis</div>
            </div>
            <div className="text-muted-foreground leading-relaxed">
              Gemini AI creates unified technical summary
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <CheckCircle size={16} className="text-success" />
              <div className="font-semibold">Problem Live</div>
            </div>
            <div className="text-muted-foreground leading-relaxed">
              Promoted to official problem, ready for action
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
