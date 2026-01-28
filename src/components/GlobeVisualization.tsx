import { useEffect, useRef, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Signal, SignalCluster, Bubble } from '@/lib/types'
import { Warning, CheckCircle, Clock } from '@phosphor-icons/react'
import * as THREE from 'three'

interface GlobeVisualizationProps {
  signals: Signal[]
  clusters: SignalCluster[]
  bubbles: Bubble[]
  selectedBubbleId: string | null
  onSelectLocation: (lat: number, lng: number) => void
}

export function GlobeVisualization({
  signals,
  clusters,
  bubbles,
  selectedBubbleId,
  onSelectLocation,
}: GlobeVisualizationProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const globeRef = useRef<THREE.Mesh | null>(null)
  const [isRotating, setIsRotating] = useState(true)
  const [activeSignals, setActiveSignals] = useState(0)
  const [criticalClusters, setCriticalClusters] = useState(0)

  useEffect(() => {
    if (!containerRef.current) return

    const width = containerRef.current.clientWidth
    const height = 500

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x0a0a0f)
    sceneRef.current = scene

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000)
    camera.position.z = 3
    cameraRef.current = camera

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    containerRef.current.appendChild(renderer.domElement)
    rendererRef.current = renderer

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(5, 3, 5)
    scene.add(directionalLight)

    const geometry = new THREE.SphereGeometry(1, 64, 64)
    
    const material = new THREE.MeshPhongMaterial({
      color: 0x1a1a2e,
      emissive: 0x0a0a1a,
      specular: 0x333344,
      shininess: 10,
      wireframe: false,
    })

    const globe = new THREE.Mesh(geometry, material)
    scene.add(globe)
    globeRef.current = globe

    const wireframeGeometry = new THREE.WireframeGeometry(geometry)
    const wireframeMaterial = new THREE.LineBasicMaterial({
      color: 0x3a3a5e,
      opacity: 0.3,
      transparent: true,
      linewidth: 1,
    })
    const wireframe = new THREE.LineSegments(wireframeGeometry, wireframeMaterial)
    globe.add(wireframe)

    const addSignalMarkers = () => {
      const signalGroup = new THREE.Group()
      signalGroup.name = 'signals'

      signals.forEach((signal) => {
        if (!signal.h3Cell) return

        const bubble = bubbles.find(b => b.id === signal.bubbleId)
        if (!bubble?.coordinates) return

        const { lat, lng } = bubble.coordinates
        
        const phi = (90 - lat) * (Math.PI / 180)
        const theta = (lng + 180) * (Math.PI / 180)

        const x = -Math.sin(phi) * Math.cos(theta)
        const y = Math.cos(phi)
        const z = Math.sin(phi) * Math.sin(theta)

        const markerGeometry = new THREE.SphereGeometry(0.015, 8, 8)
        const markerColor = signal.status === 'validated' ? 0x10b981 : 
                            signal.status === 'clustered' ? 0xf59e0b :
                            0x6366f1
        const markerMaterial = new THREE.MeshBasicMaterial({
          color: markerColor,
          transparent: true,
          opacity: 0.8,
        })
        
        const marker = new THREE.Mesh(markerGeometry, markerMaterial)
        marker.position.set(x * 1.02, y * 1.02, z * 1.02)
        signalGroup.add(marker)

        if (signal.attestations > 5) {
          const pulseGeometry = new THREE.RingGeometry(0.02, 0.03, 16)
          const pulseMaterial = new THREE.MeshBasicMaterial({
            color: markerColor,
            transparent: true,
            opacity: 0.4,
            side: THREE.DoubleSide,
          })
          const pulse = new THREE.Mesh(pulseGeometry, pulseMaterial)
          pulse.position.copy(marker.position)
          pulse.lookAt(0, 0, 0)
          signalGroup.add(pulse)
        }
      })

      clusters.forEach((cluster) => {
        const bubble = bubbles.find(b => cluster.signals.some(s => s.bubbleId === b.id))
        if (!bubble?.coordinates) return

        const { lat, lng } = bubble.coordinates
        
        const phi = (90 - lat) * (Math.PI / 180)
        const theta = (lng + 180) * (Math.PI / 180)

        const x = -Math.sin(phi) * Math.cos(theta)
        const y = Math.cos(phi)
        const z = Math.sin(phi) * Math.sin(theta)

        const clusterSize = Math.min(0.05, 0.02 + cluster.signals.length * 0.005)
        const clusterGeometry = new THREE.SphereGeometry(clusterSize, 12, 12)
        const clusterMaterial = new THREE.MeshBasicMaterial({
          color: cluster.status === 'priority' ? 0xef4444 : 0xf59e0b,
          transparent: true,
          opacity: 0.7,
        })
        
        const clusterMesh = new THREE.Mesh(clusterGeometry, clusterMaterial)
        clusterMesh.position.set(x * 1.05, y * 1.05, z * 1.05)
        signalGroup.add(clusterMesh)
      })

      const existingSignals = scene.getObjectByName('signals')
      if (existingSignals) {
        scene.remove(existingSignals)
      }
      scene.add(signalGroup)
    }

    addSignalMarkers()

    const animate = () => {
      requestAnimationFrame(animate)

      if (isRotating && globe) {
        globe.rotation.y += 0.002
      }

      renderer.render(scene, camera)
    }

    animate()

    const handleResize = () => {
      if (!containerRef.current) return
      const newWidth = containerRef.current.clientWidth
      camera.aspect = newWidth / height
      camera.updateProjectionMatrix()
      renderer.setSize(newWidth, height)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement)
      }
      renderer.dispose()
    }
  }, [])

  useEffect(() => {
    if (!sceneRef.current) return

    const scene = sceneRef.current
    const signalGroup = new THREE.Group()
    signalGroup.name = 'signals'

    signals.forEach((signal) => {
      if (!signal.h3Cell) return

      const bubble = bubbles.find(b => b.id === signal.bubbleId)
      if (!bubble?.coordinates) return

      const { lat, lng } = bubble.coordinates
      
      const phi = (90 - lat) * (Math.PI / 180)
      const theta = (lng + 180) * (Math.PI / 180)

      const x = -Math.sin(phi) * Math.cos(theta)
      const y = Math.cos(phi)
      const z = Math.sin(phi) * Math.sin(theta)

      const markerGeometry = new THREE.SphereGeometry(0.015, 8, 8)
      const markerColor = signal.status === 'validated' ? 0x10b981 : 
                          signal.status === 'clustered' ? 0xf59e0b :
                          0x6366f1
      const markerMaterial = new THREE.MeshBasicMaterial({
        color: markerColor,
        transparent: true,
        opacity: 0.8,
      })
      
      const marker = new THREE.Mesh(markerGeometry, markerMaterial)
      marker.position.set(x * 1.02, y * 1.02, z * 1.02)
      signalGroup.add(marker)
    })

    clusters.forEach((cluster) => {
      const bubble = bubbles.find(b => cluster.signals.some(s => s.bubbleId === b.id))
      if (!bubble?.coordinates) return

      const { lat, lng } = bubble.coordinates
      
      const phi = (90 - lat) * (Math.PI / 180)
      const theta = (lng + 180) * (Math.PI / 180)

      const x = -Math.sin(phi) * Math.cos(theta)
      const y = Math.cos(phi)
      const z = Math.sin(phi) * Math.sin(theta)

      const clusterSize = Math.min(0.05, 0.02 + cluster.signals.length * 0.005)
      const clusterGeometry = new THREE.SphereGeometry(clusterSize, 12, 12)
      const clusterMaterial = new THREE.MeshBasicMaterial({
        color: cluster.status === 'priority' ? 0xef4444 : 0xf59e0b,
        transparent: true,
        opacity: 0.7,
      })
      
      const clusterMesh = new THREE.Mesh(clusterGeometry, clusterMaterial)
      clusterMesh.position.set(x * 1.05, y * 1.05, z * 1.05)
      signalGroup.add(clusterMesh)
    })

    const existingSignals = scene.getObjectByName('signals')
    if (existingSignals) {
      scene.remove(existingSignals)
    }
    scene.add(signalGroup)

    setActiveSignals(signals.length)
    setCriticalClusters(clusters.filter(c => c.status === 'priority').length)
  }, [signals, clusters, bubbles])

  return (
    <Card className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Global Signal Map</h3>
          <p className="text-sm text-muted-foreground">
            Real-time visualization of submitted signals and clusters
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="gap-1.5">
            <div className="w-2 h-2 rounded-full bg-indigo-500" />
            Raw: {signals.filter(s => s.status === 'raw').length}
          </Badge>
          <Badge variant="outline" className="gap-1.5">
            <div className="w-2 h-2 rounded-full bg-amber-500" />
            Clustered: {signals.filter(s => s.status === 'clustered').length}
          </Badge>
          <Badge variant="outline" className="gap-1.5">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            Validated: {signals.filter(s => s.status === 'validated').length}
          </Badge>
        </div>
      </div>

      <div
        ref={containerRef}
        className="relative w-full bg-background/40 border border-border rounded-lg overflow-hidden cursor-grab active:cursor-grabbing"
        onClick={() => setIsRotating(!isRotating)}
      />

      {criticalClusters > 0 && (
        <div className="mt-4 p-3 bg-destructive/10 border border-destructive rounded-lg flex items-center gap-2">
          <Warning size={20} className="text-destructive" weight="fill" />
          <span className="text-sm font-medium text-destructive">
            {criticalClusters} critical cluster{criticalClusters > 1 ? 's' : ''} require immediate attention
          </span>
        </div>
      )}

      <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
        <div className="p-3 bg-muted/40 rounded-lg">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Clock size={16} />
            <span>Active Signals</span>
          </div>
          <div className="text-2xl font-semibold font-mono">{activeSignals}</div>
        </div>
        <div className="p-3 bg-muted/40 rounded-lg">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Warning size={16} />
            <span>Forming Clusters</span>
          </div>
          <div className="text-2xl font-semibold font-mono">{clusters.length}</div>
        </div>
        <div className="p-3 bg-muted/40 rounded-lg">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <CheckCircle size={16} />
            <span>Critical</span>
          </div>
          <div className="text-2xl font-semibold font-mono">{criticalClusters}</div>
        </div>
      </div>

      <p className="mt-4 text-xs text-muted-foreground text-center">
        Click globe to {isRotating ? 'pause' : 'resume'} rotation • Signals update in real-time
      </p>
    </Card>
  )
}
