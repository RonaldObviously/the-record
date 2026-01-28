import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import type { Bubble, Problem, Proposal } from '@/lib/types'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MapPin, Warning, CheckCircle, XCircle, MagnifyingGlassPlus, MagnifyingGlassMinus, Compass } from '@phosphor-icons/react'

interface Globe3DProps {
  bubbles: Bubble[]
  problems: Problem[]
  proposals: Proposal[]
  onBubbleSelect: (bubble: Bubble) => void
}

interface GlobeMarker {
  bubble: Bubble
  position: THREE.Vector3
  lat: number
  lng: number
  mesh?: THREE.Mesh
  problems: Problem[]
  proposals: Proposal[]
}

const getBubbleCoordinates = (bubble: Bubble): { lat: number; lng: number } => {
  const hash = bubble.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  
  const geographicCoords: Record<string, { lat: number; lng: number }> = {
    'global': { lat: 0, lng: 0 },
    'north-america': { lat: 40, lng: -100 },
    'california': { lat: 37, lng: -120 },
    'san-francisco': { lat: 37.77, lng: -122.41 },
    'mission': { lat: 37.76, lng: -122.42 },
    'education-k12': { lat: 37.78, lng: -122.40 },
    'south-america': { lat: -15, lng: -60 },
    'europe': { lat: 50, lng: 10 },
    'asia': { lat: 35, lng: 105 },
    'africa': { lat: 0, lng: 20 },
    'oceania': { lat: -25, lng: 135 },
  }

  if (geographicCoords[bubble.id]) {
    return geographicCoords[bubble.id]
  }

  const lat = ((hash % 180) - 90) * 0.8
  const lng = ((hash % 360) - 180) * 0.9
  return { lat, lng }
}

const latLngToVector3 = (lat: number, lng: number, radius: number): THREE.Vector3 => {
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lng + 180) * (Math.PI / 180)

  const x = -(radius * Math.sin(phi) * Math.cos(theta))
  const z = radius * Math.sin(phi) * Math.sin(theta)
  const y = radius * Math.cos(phi)

  return new THREE.Vector3(x, y, z)
}

const getSeverityColor = (bubble: Bubble, problems: Problem[], proposals: Proposal[]): THREE.Color => {
  if (bubble.activeAlerts > 5) return new THREE.Color(0xff4444)
  if (bubble.activeAlerts > 2) return new THREE.Color(0xffaa44)
  
  const pendingProposals = proposals.filter(p => p.status === 'validating' || p.status === 'draft')
  if (pendingProposals.length > 3) return new THREE.Color(0xffdd66)
  
  const completedProposals = proposals.filter(p => p.status === 'completed')
  if (completedProposals.length > 0) return new THREE.Color(0x44ff88)
  
  return new THREE.Color(0x6699ff)
}

export function Globe3D({ bubbles, problems, proposals, onBubbleSelect }: Globe3DProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const globeRef = useRef<THREE.Mesh | null>(null)
  const markersRef = useRef<GlobeMarker[]>([])
  const animationIdRef = useRef<number | null>(null)
  const isDraggingRef = useRef(false)
  const previousMouseRef = useRef({ x: 0, y: 0 })
  const rotationRef = useRef({ x: 0, y: 0 })
  const targetRotationRef = useRef({ x: 0, y: 0 })
  const raycasterRef = useRef<THREE.Raycaster>(new THREE.Raycaster())
  const mouseRef = useRef<THREE.Vector2>(new THREE.Vector2())

  const [hoveredBubble, setHoveredBubble] = useState<GlobeMarker | null>(null)
  const [zoom, setZoom] = useState(1)

  useEffect(() => {
    if (!containerRef.current) return

    const scene = new THREE.Scene()
    sceneRef.current = scene
    scene.background = new THREE.Color(0x0a0a0f)

    const camera = new THREE.PerspectiveCamera(
      50,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    )
    camera.position.z = 300
    cameraRef.current = camera

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    rendererRef.current = renderer
    containerRef.current.appendChild(renderer.domElement)

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(5, 3, 5)
    scene.add(directionalLight)

    const backLight = new THREE.DirectionalLight(0x6666ff, 0.3)
    backLight.position.set(-5, -3, -5)
    scene.add(backLight)

    const globeGeometry = new THREE.SphereGeometry(100, 64, 64)
    
    const canvas = document.createElement('canvas')
    canvas.width = 2048
    canvas.height = 1024
    const ctx = canvas.getContext('2d')!
    
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
    gradient.addColorStop(0, '#e8f4f8')
    gradient.addColorStop(0.3, '#4a90a4')
    gradient.addColorStop(0.5, '#2b5876')
    gradient.addColorStop(0.7, '#4a90a4')
    gradient.addColorStop(1, '#e8f4f8')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    ctx.fillStyle = '#1a4d2e'
    for (let i = 0; i < 150; i++) {
      const x = Math.random() * canvas.width
      const y = Math.random() * canvas.height
      const size = Math.random() * 200 + 50
      ctx.beginPath()
      for (let j = 0; j < 8; j++) {
        const angle = (j / 8) * Math.PI * 2 + Math.random() * 0.5
        const radius = size * (0.5 + Math.random() * 0.5)
        const px = x + Math.cos(angle) * radius
        const py = y + Math.sin(angle) * radius
        if (j === 0) ctx.moveTo(px, py)
        else ctx.lineTo(px, py)
      }
      ctx.closePath()
      ctx.fill()
    }
    
    const texture = new THREE.CanvasTexture(canvas)
    texture.needsUpdate = true
    
    const globeMaterial = new THREE.MeshPhongMaterial({
      map: texture,
      bumpMap: texture,
      bumpScale: 0.5,
      specular: 0x333333,
      shininess: 15,
    })
    const globe = new THREE.Mesh(globeGeometry, globeMaterial)
    globeRef.current = globe
    scene.add(globe)

    const wireframeGeometry = new THREE.SphereGeometry(100.5, 32, 32)
    const wireframeMaterial = new THREE.MeshBasicMaterial({
      color: 0x2a2a4e,
      wireframe: true,
      transparent: true,
      opacity: 0.15,
    })
    const wireframe = new THREE.Mesh(wireframeGeometry, wireframeMaterial)
    scene.add(wireframe)

    const markers: GlobeMarker[] = bubbles.map(bubble => {
      const coords = getBubbleCoordinates(bubble)
      const position = latLngToVector3(coords.lat, coords.lng, 102)
      
      const bubbleProblems = problems.filter(p => p.bubbleId === bubble.id)
      const bubbleProposals = proposals.filter(p => p.bubbleId === bubble.id)
      
      const markerGeometry = new THREE.SphereGeometry(2, 16, 16)
      const markerMaterial = new THREE.MeshPhongMaterial({
        color: getSeverityColor(bubble, bubbleProblems, bubbleProposals),
        emissive: getSeverityColor(bubble, bubbleProblems, bubbleProposals),
        emissiveIntensity: 0.5,
      })
      const markerMesh = new THREE.Mesh(markerGeometry, markerMaterial)
      markerMesh.position.copy(position)
      markerMesh.userData = { bubble }
      scene.add(markerMesh)

      const glowGeometry = new THREE.SphereGeometry(3, 16, 16)
      const glowMaterial = new THREE.MeshBasicMaterial({
        color: getSeverityColor(bubble, bubbleProblems, bubbleProposals),
        transparent: true,
        opacity: 0.3,
      })
      const glow = new THREE.Mesh(glowGeometry, glowMaterial)
      glow.position.copy(position)
      scene.add(glow)

      return {
        bubble,
        position,
        lat: coords.lat,
        lng: coords.lng,
        mesh: markerMesh,
        problems: bubbleProblems,
        proposals: bubbleProposals,
      }
    })
    markersRef.current = markers

    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate)

      if (!isDraggingRef.current) {
        targetRotationRef.current.y += 0.001
      }

      rotationRef.current.x += (targetRotationRef.current.x - rotationRef.current.x) * 0.1
      rotationRef.current.y += (targetRotationRef.current.y - rotationRef.current.y) * 0.1

      if (globeRef.current) {
        globeRef.current.rotation.x = rotationRef.current.x
        globeRef.current.rotation.y = rotationRef.current.y
      }

      scene.children.forEach(child => {
        if (child.userData.bubble) {
          child.rotation.x = rotationRef.current.x
          child.rotation.y = rotationRef.current.y
        }
      })

      if (cameraRef.current) {
        cameraRef.current.position.z = 300 / zoom
      }

      renderer.render(scene, camera)
    }
    animate()

    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return
      const width = containerRef.current.clientWidth
      const height = containerRef.current.clientHeight
      cameraRef.current.aspect = width / height
      cameraRef.current.updateProjectionMatrix()
      rendererRef.current.setSize(width, height)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current)
      }
      if (containerRef.current && rendererRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement)
      }
      rendererRef.current?.dispose()
    }
  }, [bubbles, problems, proposals, zoom])

  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true
    previousMouseRef.current = { x: e.clientX, y: e.clientY }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    mouseRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
    mouseRef.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1

    if (isDraggingRef.current) {
      const deltaX = e.clientX - previousMouseRef.current.x
      const deltaY = e.clientY - previousMouseRef.current.y

      targetRotationRef.current.y += deltaX * 0.005
      targetRotationRef.current.x += deltaY * 0.005

      targetRotationRef.current.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, targetRotationRef.current.x))

      previousMouseRef.current = { x: e.clientX, y: e.clientY }
    } else {
      if (cameraRef.current && sceneRef.current) {
        raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current)
        const intersects = raycasterRef.current.intersectObjects(
          sceneRef.current.children.filter(child => child.userData.bubble)
        )

        if (intersects.length > 0) {
          const intersected = intersects[0].object
          const marker = markersRef.current.find(m => m.mesh === intersected)
          setHoveredBubble(marker || null)
        } else {
          setHoveredBubble(null)
        }
      }
    }
  }

  const handleMouseUp = () => {
    isDraggingRef.current = false
  }

  const handleMouseLeave = () => {
    isDraggingRef.current = false
    setHoveredBubble(null)
  }

  const handleClick = (e: React.MouseEvent) => {
    if (!containerRef.current || !cameraRef.current || !sceneRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    mouseRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
    mouseRef.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1

    raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current)
    const intersects = raycasterRef.current.intersectObjects(
      sceneRef.current.children.filter(child => child.userData.bubble)
    )

    if (intersects.length > 0) {
      const intersected = intersects[0].object
      const marker = markersRef.current.find(m => m.mesh === intersected)
      if (marker) {
        onBubbleSelect(marker.bubble)
      }
    }
  }

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.2, 3))
  }

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.2, 0.5))
  }

  const handleResetView = () => {
    targetRotationRef.current = { x: 0, y: 0 }
    setZoom(1)
  }

  return (
    <div className="relative w-full h-[600px] rounded-lg overflow-hidden border border-border">
      <div
        ref={containerRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      />

      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <Button size="sm" variant="secondary" onClick={handleZoomIn}>
          <MagnifyingGlassPlus size={16} />
        </Button>
        <Button size="sm" variant="secondary" onClick={handleZoomOut}>
          <MagnifyingGlassMinus size={16} />
        </Button>
        <Button size="sm" variant="secondary" onClick={handleResetView}>
          <Compass size={16} />
        </Button>
      </div>

      {hoveredBubble && (
        <Card className="absolute bottom-4 left-4 p-4 max-w-sm bg-card/95 backdrop-blur">
          <div className="flex items-start gap-3">
            <MapPin size={24} className="text-accent shrink-0 mt-1" />
            <div className="space-y-2 flex-1 min-w-0">
              <h3 className="font-semibold text-foreground truncate">{hoveredBubble.bubble.name}</h3>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="outline" className="text-xs">
                  {hoveredBubble.bubble.type}
                </Badge>
                {hoveredBubble.bubble.level && (
                  <Badge variant="secondary" className="text-xs">
                    {hoveredBubble.bubble.level}
                  </Badge>
                )}
                {hoveredBubble.bubble.domain && (
                  <Badge variant="secondary" className="text-xs">
                    {hoveredBubble.bubble.domain}
                  </Badge>
                )}
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="flex items-center gap-1">
                  <Warning size={14} className="text-muted-foreground" />
                  <span className="text-muted-foreground">{hoveredBubble.problems.length} issues</span>
                </div>
                <div className="flex items-center gap-1">
                  {hoveredBubble.proposals.filter(p => p.status === 'completed').length > 0 ? (
                    <CheckCircle size={14} className="text-success" />
                  ) : (
                    <XCircle size={14} className="text-muted-foreground" />
                  )}
                  <span className="text-muted-foreground">{hoveredBubble.proposals.length} proposals</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin size={14} className="text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {hoveredBubble.lat.toFixed(1)}°, {hoveredBubble.lng.toFixed(1)}°
                  </span>
                </div>
              </div>
              {hoveredBubble.bubble.activeAlerts > 0 && (
                <div className="text-xs text-destructive font-medium">
                  ⚠ {hoveredBubble.bubble.activeAlerts} active alerts
                </div>
              )}
            </div>
          </div>
        </Card>
      )}

      <div className="absolute top-4 left-4">
        <Card className="p-3 bg-card/90 backdrop-blur">
          <div className="text-xs space-y-2">
            <div className="font-semibold text-foreground">Globe Legend</div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#44ff88]"></div>
              <span className="text-muted-foreground">Resolved</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#6699ff]"></div>
              <span className="text-muted-foreground">Active</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#ffdd66]"></div>
              <span className="text-muted-foreground">Pending</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#ffaa44]"></div>
              <span className="text-muted-foreground">Warning</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#ff4444]"></div>
              <span className="text-muted-foreground">Critical</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
