import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ContextualHelp, helpContent } from '@/components/ContextualHelp'
import type { Signal, SignalCluster } from '@/lib/types'
import {
  clusterSignals,
  promoteClusterToProblem,
  calculateClusterGravity,
  shouldPromoteCluster,
} from '@/lib/signalLifecycle'
import { Flame, MapPin, Users } from '@phosphor-icons/react'

interface SignalAggregationMatrixProps {
  signals: Signal[]
  onClusterPromoted: (cluster: SignalCluster) => void
}

interface FloatingSignal extends Signal {
  x: number
  y: number
  velocityX: number
  velocityY: number
}

const SIGNAL_SIZE = 40
const CLUSTER_SIZE = 80
const ANIMATION_SPEED = 0.5

export function SignalAggregationMatrix({ signals, onClusterPromoted }: SignalAggregationMatrixProps) {
  const [floatingSignals, setFloatingSignals] = useState<FloatingSignal[]>([])
  const [clusters, setClusters] = useState<SignalCluster[]>([])
  const containerRef = useRef<HTMLDivElement>(null)
  const animationFrameRef = useRef<number | null>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const newFloatingSignals: FloatingSignal[] = signals
      .filter(s => s.status === 'raw')
      .map(signal => ({
        ...signal,
        x: Math.random() * (container.clientWidth - SIGNAL_SIZE),
        y: Math.random() * (container.clientHeight - SIGNAL_SIZE),
        velocityX: (Math.random() - 0.5) * ANIMATION_SPEED,
        velocityY: (Math.random() - 0.5) * ANIMATION_SPEED,
      }))

    setFloatingSignals(newFloatingSignals)
  }, [signals])

  useEffect(() => {
    const animate = () => {
      setFloatingSignals(prev => {
        const container = containerRef.current
        if (!container) return prev

        return prev.map(signal => {
          let { x, y, velocityX, velocityY } = signal

          x += velocityX
          y += velocityY

          if (x <= 0 || x >= container.clientWidth - SIGNAL_SIZE) {
            velocityX *= -1
            x = Math.max(0, Math.min(x, container.clientWidth - SIGNAL_SIZE))
          }
          if (y <= 0 || y >= container.clientHeight - SIGNAL_SIZE) {
            velocityY *= -1
            y = Math.max(0, Math.min(y, container.clientHeight - SIGNAL_SIZE))
          }

          const nearbySignals = prev.filter(s => 
            s.h3Cell === signal.h3Cell &&
            s.category === signal.category &&
            s.id !== signal.id
          )

          for (const nearby of nearbySignals) {
            const dx = nearby.x - x
            const dy = nearby.y - y
            const distance = Math.sqrt(dx * dx + dy * dy)

            if (distance < 100 && distance > 0) {
              const pullStrength = 0.02
              velocityX += (dx / distance) * pullStrength
              velocityY += (dy / distance) * pullStrength
            }
          }

          const damping = 0.98
          velocityX *= damping
          velocityY *= damping

          return {
            ...signal,
            x,
            y,
            velocityX,
            velocityY,
          }
        })
      })

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animationFrameRef.current = requestAnimationFrame(animate)
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  useEffect(() => {
    const rawSignals = signals.filter(s => s.status === 'raw')
    const result = clusterSignals(rawSignals)
    setClusters(result.clusters)

    result.clusters.forEach(cluster => {
      if (shouldPromoteCluster(cluster)) {
        setTimeout(() => onClusterPromoted(cluster), 1000)
      }
    })
  }, [signals])

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      infrastructure: 'bg-orange-500/20 border-orange-500',
      water: 'bg-blue-500/20 border-blue-500',
      safety: 'bg-red-500/20 border-red-500',
      energy: 'bg-yellow-500/20 border-yellow-500',
      healthcare: 'bg-green-500/20 border-green-500',
    }
    return colors[category] || 'bg-gray-500/20 border-gray-500'
  }

  return (
    <Card className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">Live Signal Aggregation</h3>
            <ContextualHelp {...helpContent.clustering} />
          </div>
          <p className="text-sm text-muted-foreground">
            Watch raw signals cluster into collective truth. Critical mass = verified problem.
          </p>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-primary/40" />
            <span className="text-muted-foreground">Raw: {signals.filter(s => s.status === 'raw').length}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-accent/40" />
            <span className="text-muted-foreground">Clusters: {clusters.length}</span>
          </div>
        </div>
      </div>

      <div
        ref={containerRef}
        className="relative w-full h-96 bg-background/40 border border-border rounded-lg overflow-hidden"
      >
        <AnimatePresence>
          {floatingSignals.map((signal) => (
            <motion.div
              key={signal.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: 1,
                scale: 1,
                x: signal.x,
                y: signal.y,
              }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ type: 'spring', stiffness: 100 }}
              className={`absolute w-10 h-10 rounded-full border-2 ${getCategoryColor(signal.category)} 
                          flex items-center justify-center cursor-pointer hover:scale-110 transition-transform`}
              title={signal.description}
            >
              <MapPin size={16} className="text-foreground/60" weight="fill" />
            </motion.div>
          ))}
        </AnimatePresence>

        {clusters.map((cluster) => {
          const avgX = cluster.signals.reduce((sum, s) => {
            const fs = floatingSignals.find(f => f.id === s.id)
            return sum + (fs?.x || 0)
          }, 0) / cluster.signals.length

          const avgY = cluster.signals.reduce((sum, s) => {
            const fs = floatingSignals.find(f => f.id === s.id)
            return sum + (fs?.y || 0)
          }, 0) / cluster.signals.length

          const gravity = calculateClusterGravity(cluster)
          const isReady = shouldPromoteCluster(cluster)

          return (
            <motion.div
              key={cluster.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: 0.8,
                scale: isReady ? 1.2 : 1,
                x: avgX - CLUSTER_SIZE / 2,
                y: avgY - CLUSTER_SIZE / 2,
              }}
              className={`absolute w-20 h-20 rounded-full border-4 ${
                isReady ? 'border-accent bg-accent/20' : 'border-primary bg-primary/10'
              } flex flex-col items-center justify-center backdrop-blur-sm`}
            >
              {isReady && (
                <Flame size={24} className="text-accent animate-pulse" weight="fill" />
              )}
              <div className="flex items-center gap-1 text-xs font-mono">
                <Users size={12} />
                <span>{cluster.signals.length}</span>
              </div>
              <div className="text-[10px] font-mono text-muted-foreground">
                {Math.round(gravity)}g
              </div>
            </motion.div>
          )
        })}
      </div>

      {clusters.filter(shouldPromoteCluster).length > 0 && (
        <div className="mt-4 p-4 bg-accent/10 border border-accent rounded-lg">
          <div className="flex items-center gap-2 text-sm">
            <Flame size={20} className="text-accent" weight="fill" />
            <span className="font-semibold text-accent">
              {clusters.filter(shouldPromoteCluster).length} cluster(s) ready to ignite into Priority Cards
            </span>
          </div>
        </div>
      )}
    </Card>
  )
}
