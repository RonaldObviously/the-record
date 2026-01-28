import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Broadcast, Stack, Flame, CheckCircle } from '@phosphor-icons/react'

interface AnimatedSignal {
  id: string
  text: string
  x: number
  stage: 'individual' | 'clustering' | 'cluster' | 'problem'
}

const DEMO_SIGNALS = [
  'Water tastes metallic',
  'Brown water from tap',
  'Discolored tap water',
  'Strange smell in water',
  'Water quality issue',
  'Cloudy water today'
]

export function LiveSignalFlowDemo() {
  const [signals, setSignals] = useState<AnimatedSignal[]>([])
  const [clusterFormed, setClusterFormed] = useState(false)
  const [problemCreated, setProblemCreated] = useState(false)
  const [isRunning, setIsRunning] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  const startDemo = () => {
    setSignals([])
    setClusterFormed(false)
    setProblemCreated(false)
    setCurrentIndex(0)
    setIsRunning(true)
  }

  const resetDemo = () => {
    setSignals([])
    setClusterFormed(false)
    setProblemCreated(false)
    setCurrentIndex(0)
    setIsRunning(false)
  }

  useEffect(() => {
    if (!isRunning || currentIndex >= DEMO_SIGNALS.length) {
      if (isRunning && currentIndex >= DEMO_SIGNALS.length && signals.length >= 3) {
        setTimeout(() => setClusterFormed(true), 500)
      }
      return
    }

    const timer = setTimeout(() => {
      const newSignal: AnimatedSignal = {
        id: `signal-${currentIndex}`,
        text: DEMO_SIGNALS[currentIndex],
        x: Math.random() * 80 + 10,
        stage: 'individual'
      }
      
      setSignals(prev => [...prev, newSignal])
      setCurrentIndex(prev => prev + 1)

      setTimeout(() => {
        setSignals(prev => 
          prev.map(s => s.id === newSignal.id ? { ...s, stage: 'clustering' as const } : s)
        )
      }, 800)

      setTimeout(() => {
        setSignals(prev => 
          prev.map(s => s.id === newSignal.id ? { ...s, stage: 'cluster' as const } : s)
        )
      }, 1600)
    }, 1200)

    return () => clearTimeout(timer)
  }, [isRunning, currentIndex, signals.length])

  useEffect(() => {
    if (clusterFormed && !problemCreated) {
      setTimeout(() => {
        setProblemCreated(true)
        setIsRunning(false)
      }, 1500)
    }
  }, [clusterFormed, problemCreated])

  const getSignalPosition = (signal: AnimatedSignal) => {
    if (signal.stage === 'individual') {
      return { x: signal.x, y: 10 }
    } else if (signal.stage === 'clustering') {
      return { x: 50, y: 35 }
    } else {
      return { x: 50, y: 60 }
    }
  }

  const clusterWeight = signals.filter(s => s.stage === 'cluster').length * 10 + 
                        signals.filter(s => s.stage === 'cluster').length * 5

  return (
    <Card className="p-6 bg-card">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-1">Live Signal Aggregation</h3>
            <p className="text-sm text-muted-foreground">
              Watch how individual observations cluster into a verified problem
            </p>
          </div>
          <div className="flex gap-2">
            {!isRunning && signals.length === 0 && (
              <Button onClick={startDemo} size="sm">
                Start Demo
              </Button>
            )}
            {(isRunning || signals.length > 0) && (
              <Button onClick={resetDemo} variant="outline" size="sm">
                Reset
              </Button>
            )}
          </div>
        </div>

        <div className="relative h-[500px] bg-secondary/20 rounded-lg border-2 border-border overflow-hidden">
          <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
            <Badge variant="outline" className="font-mono text-xs">
              L1: SIGNAL LAYER
            </Badge>
            <Badge variant="outline" className="font-mono text-xs">
              Signals: {signals.length} | Weight: {clusterWeight}
            </Badge>
          </div>

          <div className="absolute top-12 left-0 right-0 px-6 space-y-1">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Broadcast size={16} />
              <span className="font-mono">Individual Signals (Raw)</span>
            </div>
            <div className="h-[1px] bg-border" />
          </div>

          <div className="absolute top-[35%] left-0 right-0 px-6 space-y-1">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Stack size={16} />
              <span className="font-mono">Clustering (H3 Cell Match + Category)</span>
            </div>
            <div className="h-[1px] bg-border" />
          </div>

          <div className="absolute top-[60%] left-0 right-0 px-6 space-y-1">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Flame size={16} className={clusterFormed ? 'text-accent' : ''} />
              <span className="font-mono">
                Cluster Formation {clusterFormed && '(Threshold Reached!)'}
              </span>
            </div>
            <div className="h-[1px] bg-border" />
          </div>

          <div className="absolute bottom-12 left-0 right-0 px-6 space-y-1">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <CheckCircle size={16} className={problemCreated ? 'text-success' : ''} />
              <span className="font-mono">
                Problem Created {problemCreated && '✓'}
              </span>
            </div>
            <div className="h-[1px] bg-border" />
          </div>

          <AnimatePresence>
            {signals.map((signal) => {
              const pos = getSignalPosition(signal)
              return (
                <motion.div
                  key={signal.id}
                  initial={{ x: `${signal.x}%`, y: '5%', scale: 0, opacity: 0 }}
                  animate={{ 
                    x: `${pos.x}%`, 
                    y: `${pos.y}%`, 
                    scale: 1, 
                    opacity: signal.stage === 'individual' ? 0.9 : 1
                  }}
                  transition={{ 
                    duration: 0.8, 
                    ease: 'easeInOut',
                    scale: { duration: 0.3 }
                  }}
                  className="absolute"
                  style={{ transformOrigin: 'center' }}
                >
                  <div 
                    className={`
                      px-3 py-2 rounded-md text-xs font-mono border-2 shadow-lg
                      ${signal.stage === 'individual' ? 'bg-primary/10 border-primary/40' : ''}
                      ${signal.stage === 'clustering' ? 'bg-accent/10 border-accent/40' : ''}
                      ${signal.stage === 'cluster' ? 'bg-success/10 border-success/40' : ''}
                    `}
                    style={{ whiteSpace: 'nowrap' }}
                  >
                    {signal.text}
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>

          <AnimatePresence>
            {clusterFormed && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, ease: 'backOut' }}
                className="absolute left-1/2 top-[60%] -translate-x-1/2"
              >
                <Card className="p-4 bg-accent/20 border-accent border-2 shadow-xl min-w-[300px]">
                  <div className="flex items-start gap-3">
                    <Flame size={24} className="text-accent flex-shrink-0" weight="fill" />
                    <div className="text-xs space-y-1">
                      <div className="font-semibold text-accent-foreground">Cluster Mature</div>
                      <div className="text-muted-foreground font-mono">
                        Weight: {clusterWeight} / 100 threshold
                      </div>
                      <div className="text-muted-foreground font-mono">
                        Signals: {signals.filter(s => s.stage === 'cluster').length}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {problemCreated && (
              <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="absolute left-1/2 bottom-4 -translate-x-1/2"
              >
                <Card className="p-4 bg-success/20 border-success border-2 shadow-xl min-w-[400px]">
                  <div className="flex items-start gap-3">
                    <CheckCircle size={24} className="text-success flex-shrink-0" weight="fill" />
                    <div className="text-xs space-y-2">
                      <div className="font-semibold text-success-foreground">
                        Problem Created: prob-cluster-8928374
                      </div>
                      <div className="text-muted-foreground">
                        "Multiple reports of water discoloration and quality issues"
                      </div>
                      <div className="flex gap-4 text-muted-foreground font-mono">
                        <span>Category: Water</span>
                        <span>Priority: 8</span>
                        <span>H3: hex-8928374</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="grid grid-cols-4 gap-3 text-xs">
          <div className="space-y-1">
            <div className="font-semibold text-primary">Step 1</div>
            <div className="text-muted-foreground">Signals submitted individually</div>
          </div>
          <div className="space-y-1">
            <div className="font-semibold text-accent">Step 2</div>
            <div className="text-muted-foreground">Geographic + semantic clustering</div>
          </div>
          <div className="space-y-1">
            <div className="font-semibold text-accent">Step 3</div>
            <div className="text-muted-foreground">Weight calculated from attestations</div>
          </div>
          <div className="space-y-1">
            <div className="font-semibold text-success">Step 4</div>
            <div className="text-muted-foreground">Problem promoted to L1</div>
          </div>
        </div>
      </div>
    </Card>
  )
}
