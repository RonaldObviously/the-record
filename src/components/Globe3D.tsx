import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import type { Bubble, Problem, Proposal } from '@/lib/types'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MapPin, Warning, CheckCircle, MagnifyingGlassPlus, MagnifyingGlassMinus, Compass, Lightning, ChartLine } from '@phosphor-icons/react'

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
  pillar?: THREE.Mesh
  glow?: THREE.Mesh
  pulse?: THREE.Mesh
  problems: Problem[]
  proposals: Proposal[]
  activity: number
  lastUpdate: number
}

const getBubbleCoordinates = (bubble: Bubble): { lat: number; lng: number } => {
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

  const hash = bubble.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
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
  if (bubble.activeAlerts > 5) return new THREE.Color(0xff3366)
  if (bubble.activeAlerts > 2) return new THREE.Color(0xff9944)
  
  const pendingProposals = proposals.filter(p => p.status === 'validating' || p.status === 'draft')
  if (pendingProposals.length > 3) return new THREE.Color(0xffcc44)
  
  const completedProposals = proposals.filter(p => p.status === 'completed')
  if (completedProposals.length > 0) return new THREE.Color(0x44ffaa)
  
  return new THREE.Color(0x66aaff)
}

const createEarthTexture = (): THREE.Texture => {
  const canvas = document.createElement('canvas')
  canvas.width = 4096
  canvas.height = 2048
  const ctx = canvas.getContext('2d')!

  const deepOcean = '#0a1e3d'
  const shallowOcean = '#1a4d7a'
  const landBase = '#2d5a3a'
  const landHigh = '#4a7a5a'
  const mountain = '#8a9a7a'
  const desert = '#c4a56a'
  const ice = '#e8f4f8'

  const oceanGradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
  oceanGradient.addColorStop(0, deepOcean)
  oceanGradient.addColorStop(0.5, shallowOcean)
  oceanGradient.addColorStop(1, deepOcean)
  ctx.fillStyle = oceanGradient
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  const drawContinent = (coords: number[][], color: string) => {
    ctx.fillStyle = color
    ctx.beginPath()
    coords.forEach((point, i) => {
      const x = (point[0] + 180) * (canvas.width / 360)
      const y = (90 - point[1]) * (canvas.height / 180)
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    })
    ctx.closePath()
    ctx.fill()
  }

  const northAmerica = [
    [-170, 70], [-130, 72], [-100, 70], [-80, 65], [-70, 50], [-75, 40], [-80, 30],
    [-95, 25], [-105, 28], [-115, 32], [-125, 45], [-130, 50], [-140, 58], [-160, 65], [-170, 70]
  ]
  
  const southAmerica = [
    [-80, 12], [-75, 5], [-70, -5], [-68, -20], [-70, -35], [-72, -50], [-68, -55],
    [-60, -52], [-55, -35], [-50, -15], [-52, -5], [-58, 0], [-65, 8], [-75, 10], [-80, 12]
  ]

  const europe = [
    [-10, 60], [0, 62], [10, 58], [20, 54], [25, 50], [30, 48], [25, 45],
    [15, 43], [5, 45], [-5, 50], [-10, 55], [-10, 60]
  ]

  const africa = [
    [-18, 35], [-10, 30], [10, 25], [25, 20], [35, 15], [42, 5], [50, -5],
    [45, -15], [35, -25], [25, -30], [20, -34], [15, -30], [10, -20], [5, -10],
    [0, 5], [-5, 15], [-10, 25], [-15, 32], [-18, 35]
  ]

  const asia = [
    [30, 75], [60, 70], [90, 72], [120, 68], [140, 60], [145, 50], [140, 40],
    [130, 35], [120, 25], [110, 20], [100, 22], [90, 25], [80, 28], [70, 32],
    [60, 40], [50, 50], [40, 60], [35, 70], [30, 75]
  ]

  const australia = [
    [115, -10], [130, -12], [145, -15], [150, -25], [148, -38], [140, -40],
    [130, -35], [120, -30], [112, -20], [113, -13], [115, -10]
  ]

  ctx.shadowColor = 'rgba(0, 0, 0, 0.3)'
  ctx.shadowBlur = 8

  drawContinent(northAmerica, landBase)
  drawContinent(southAmerica, landHigh)
  drawContinent(europe, landHigh)
  drawContinent(africa, landBase)
  drawContinent(asia, landBase)
  drawContinent(australia, desert)

  ctx.shadowBlur = 0

  const greenland = [[[-45, 80], [-40, 75], [-50, 70], [-55, 75], [-45, 80]]]
  greenland.forEach(land => drawContinent(land, ice))

  const antarctica = [
    [-180, -65], [-120, -70], [-60, -72], [0, -75], [60, -72], [120, -70], [180, -65],
    [180, -90], [-180, -90], [-180, -65]
  ]
  drawContinent(antarctica, ice)

  const mountainRanges = [
    { lat: 40, lng: -120, size: 30 },
    { lat: 28, lng: 85, size: 40 },
    { lat: -15, lng: -70, size: 35 },
    { lat: 48, lng: 10, size: 20 },
  ]

  mountainRanges.forEach(range => {
    const x = ((range.lng + 180) / 360) * canvas.width
    const y = ((90 - range.lat) / 180) * canvas.height
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, range.size)
    gradient.addColorStop(0, mountain)
    gradient.addColorStop(0.7, landHigh)
    gradient.addColorStop(1, landBase)
    ctx.fillStyle = gradient
    ctx.fillRect(x - range.size, y - range.size, range.size * 2, range.size * 2)
  })

  ctx.fillStyle = 'rgba(255, 255, 255, 0.04)'
  for (let i = 0; i < 2000; i++) {
    const x = Math.random() * canvas.width
    const y = Math.random() * canvas.height
    ctx.fillRect(x, y, 1, 1)
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.needsUpdate = true
  return texture
}

const createAtmosphereShader = () => {
  return {
    vertexShader: `
      varying vec3 vNormal;
      varying vec3 vPosition;
      
      void main() {
        vNormal = normalize(normalMatrix * normal);
        vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying vec3 vNormal;
      varying vec3 vPosition;
      
      void main() {
        float intensity = pow(0.6 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
        vec3 atmosphere = vec3(0.3, 0.6, 1.0) * intensity;
        gl_FragColor = vec4(atmosphere, intensity * 0.8);
      }
    `
  }
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
  const rotationRef = useRef({ x: 0.3, y: 0 })
  const targetRotationRef = useRef({ x: 0.3, y: 0 })
  const raycasterRef = useRef<THREE.Raycaster>(new THREE.Raycaster())
  const mouseRef = useRef<THREE.Vector2>(new THREE.Vector2())
  const timeRef = useRef(0)

  const [hoveredBubble, setHoveredBubble] = useState<GlobeMarker | null>(null)
  const [zoom, setZoom] = useState(1)
  const [liveActivity, setLiveActivity] = useState(0)

  useEffect(() => {
    if (!containerRef.current) return

    const scene = new THREE.Scene()
    sceneRef.current = scene
    
    const starGeometry = new THREE.BufferGeometry()
    const starVertices: number[] = []
    for (let i = 0; i < 3000; i++) {
      const x = (Math.random() - 0.5) * 2000
      const y = (Math.random() - 0.5) * 2000
      const z = (Math.random() - 0.5) * 2000
      starVertices.push(x, y, z)
    }
    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3))
    const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 1.5, transparent: true, opacity: 0.8 })
    const stars = new THREE.Points(starGeometry, starMaterial)
    scene.add(stars)

    scene.background = new THREE.Color(0x000510)

    const camera = new THREE.PerspectiveCamera(
      45,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      2000
    )
    camera.position.z = 350
    cameraRef.current = camera

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false })
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    rendererRef.current = renderer
    containerRef.current.appendChild(renderer.domElement)

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)

    const sunLight = new THREE.DirectionalLight(0xffffff, 1.2)
    sunLight.position.set(5, 3, 5)
    scene.add(sunLight)

    const fillLight = new THREE.DirectionalLight(0x4488ff, 0.4)
    fillLight.position.set(-5, -2, -3)
    scene.add(fillLight)

    const pointLight = new THREE.PointLight(0xffffff, 0.6)
    pointLight.position.set(10, 10, 10)
    scene.add(pointLight)

    const globeRadius = 100
    const globeGeometry = new THREE.SphereGeometry(globeRadius, 128, 128)
    const earthTexture = createEarthTexture()
    
    const globeMaterial = new THREE.MeshPhongMaterial({
      map: earthTexture,
      bumpMap: earthTexture,
      bumpScale: 1.2,
      specular: new THREE.Color(0x333333),
      shininess: 25,
      reflectivity: 0.1,
    })
    
    const globe = new THREE.Mesh(globeGeometry, globeMaterial)
    globeRef.current = globe
    scene.add(globe)

    const atmosphereShader = createAtmosphereShader()
    const atmosphereGeometry = new THREE.SphereGeometry(globeRadius * 1.15, 64, 64)
    const atmosphereMaterial = new THREE.ShaderMaterial({
      vertexShader: atmosphereShader.vertexShader,
      fragmentShader: atmosphereShader.fragmentShader,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
    })
    const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial)
    scene.add(atmosphere)

    const cloudGeometry = new THREE.SphereGeometry(globeRadius * 1.01, 64, 64)
    const cloudCanvas = document.createElement('canvas')
    cloudCanvas.width = 2048
    cloudCanvas.height = 1024
    const cloudCtx = cloudCanvas.getContext('2d')!
    cloudCtx.fillStyle = 'rgba(0, 0, 0, 0)'
    cloudCtx.fillRect(0, 0, cloudCanvas.width, cloudCanvas.height)
    
    for (let i = 0; i < 250; i++) {
      const x = Math.random() * cloudCanvas.width
      const y = Math.random() * cloudCanvas.height
      const size = Math.random() * 120 + 40
      const gradient = cloudCtx.createRadialGradient(x, y, 0, x, y, size)
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0.4)')
      gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.15)')
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
      cloudCtx.fillStyle = gradient
      cloudCtx.fillRect(x - size, y - size, size * 2, size * 2)
    }
    
    const cloudTexture = new THREE.CanvasTexture(cloudCanvas)
    const cloudMaterial = new THREE.MeshPhongMaterial({
      map: cloudTexture,
      transparent: true,
      opacity: 0.4,
      depthWrite: false,
    })
    const clouds = new THREE.Mesh(cloudGeometry, cloudMaterial)
    scene.add(clouds)

    const gridGeometry = new THREE.SphereGeometry(globeRadius * 1.005, 48, 48)
    const gridMaterial = new THREE.MeshBasicMaterial({
      color: 0x88ccff,
      wireframe: true,
      transparent: true,
      opacity: 0.08,
    })
    const grid = new THREE.Mesh(gridGeometry, gridMaterial)
    scene.add(grid)

    const markers: GlobeMarker[] = bubbles.map(bubble => {
      const coords = getBubbleCoordinates(bubble)
      const surfacePosition = latLngToVector3(coords.lat, coords.lng, globeRadius)
      
      const bubbleProblems = problems.filter(p => p.bubbleId === bubble.id)
      const bubbleProposals = proposals.filter(p => p.bubbleId === bubble.id)
      
      const color = getSeverityColor(bubble, bubbleProblems, bubbleProposals)
      const activity = bubbleProblems.length + bubbleProposals.length + bubble.activeAlerts

      const pillarHeight = Math.min(3 + activity * 0.5, 15)
      const pillarGeometry = new THREE.CylinderGeometry(0.5, 0.8, pillarHeight, 8)
      const pillarMaterial = new THREE.MeshPhongMaterial({
        color: color,
        emissive: color,
        emissiveIntensity: 0.4,
        transparent: true,
        opacity: 0.85,
      })
      const pillar = new THREE.Mesh(pillarGeometry, pillarMaterial)
      
      const direction = surfacePosition.clone().normalize()
      const pillarPosition = surfacePosition.clone().add(direction.clone().multiplyScalar(pillarHeight / 2))
      pillar.position.copy(pillarPosition)
      pillar.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction)
      scene.add(pillar)

      const markerPosition = surfacePosition.clone().add(direction.clone().multiplyScalar(pillarHeight))
      const markerGeometry = new THREE.SphereGeometry(1.5, 16, 16)
      const markerMaterial = new THREE.MeshPhongMaterial({
        color: color,
        emissive: color,
        emissiveIntensity: 0.8,
      })
      const markerMesh = new THREE.Mesh(markerGeometry, markerMaterial)
      markerMesh.position.copy(markerPosition)
      markerMesh.userData = { bubble }
      scene.add(markerMesh)

      const glowGeometry = new THREE.SphereGeometry(2.5, 16, 16)
      const glowMaterial = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.25,
      })
      const glow = new THREE.Mesh(glowGeometry, glowMaterial)
      glow.position.copy(markerPosition)
      scene.add(glow)

      const pulseGeometry = new THREE.RingGeometry(2, 3, 32)
      const pulseMaterial = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.5,
        side: THREE.DoubleSide,
      })
      const pulse = new THREE.Mesh(pulseGeometry, pulseMaterial)
      pulse.position.copy(markerPosition)
      pulse.lookAt(camera.position)
      scene.add(pulse)

      return {
        bubble,
        position: surfacePosition,
        lat: coords.lat,
        lng: coords.lng,
        mesh: markerMesh,
        pillar,
        glow,
        pulse,
        problems: bubbleProblems,
        proposals: bubbleProposals,
        activity,
        lastUpdate: Date.now(),
      }
    })
    markersRef.current = markers

    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate)
      timeRef.current += 0.01

      if (!isDraggingRef.current) {
        targetRotationRef.current.y += 0.0008
      }

      rotationRef.current.x += (targetRotationRef.current.x - rotationRef.current.x) * 0.05
      rotationRef.current.y += (targetRotationRef.current.y - rotationRef.current.y) * 0.05

      if (globeRef.current) {
        globeRef.current.rotation.x = rotationRef.current.x
        globeRef.current.rotation.y = rotationRef.current.y
      }

      scene.children.forEach(child => {
        if (child instanceof THREE.Mesh && child.material instanceof THREE.ShaderMaterial) {
          child.rotation.x = rotationRef.current.x
          child.rotation.y = rotationRef.current.y
        }
      })

      if (clouds) {
        clouds.rotation.y = rotationRef.current.y + timeRef.current * 0.05
      }

      markersRef.current.forEach((marker, index) => {
        const parent = new THREE.Object3D()
        parent.rotation.x = rotationRef.current.x
        parent.rotation.y = rotationRef.current.y
        
        if (marker.mesh) {
          const pulseScale = 1 + Math.sin(timeRef.current * 2 + index) * 0.15
          marker.mesh.scale.set(pulseScale, pulseScale, pulseScale)
        }

        if (marker.glow) {
          const glowScale = 1 + Math.sin(timeRef.current * 1.5 + index * 0.5) * 0.3
          marker.glow.scale.set(glowScale, glowScale, glowScale)
          marker.glow.material.opacity = 0.15 + Math.sin(timeRef.current * 2 + index) * 0.1
        }

        if (marker.pulse && cameraRef.current) {
          marker.pulse.lookAt(cameraRef.current.position)
          const pulseScale = 1 + Math.sin(timeRef.current * 3 + index * 0.3) * 0.5
          marker.pulse.scale.set(pulseScale, pulseScale, 1)
          marker.pulse.material.opacity = 0.3 + Math.sin(timeRef.current * 3 + index * 0.3) * 0.2
        }

        if (marker.pillar) {
          const emissiveIntensity = 0.4 + Math.sin(timeRef.current * 2 + index * 0.7) * 0.2
          if (marker.pillar.material instanceof THREE.MeshPhongMaterial) {
            marker.pillar.material.emissiveIntensity = emissiveIntensity
          }
        }
      })

      if (cameraRef.current) {
        cameraRef.current.position.z = 350 / zoom
      }

      const activityLevel = markersRef.current.reduce((sum, m) => sum + m.activity, 0)
      setLiveActivity(activityLevel)

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
      if (containerRef.current && rendererRef.current && rendererRef.current.domElement.parentNode === containerRef.current) {
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
          if (containerRef.current) {
            containerRef.current.style.cursor = 'pointer'
          }
        } else {
          setHoveredBubble(null)
          if (containerRef.current) {
            containerRef.current.style.cursor = isDraggingRef.current ? 'grabbing' : 'grab'
          }
        }
      }
    }
  }

  const handleMouseUp = () => {
    isDraggingRef.current = false
    if (containerRef.current) {
      containerRef.current.style.cursor = 'grab'
    }
  }

  const handleMouseLeave = () => {
    isDraggingRef.current = false
    setHoveredBubble(null)
    if (containerRef.current) {
      containerRef.current.style.cursor = 'grab'
    }
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
    setZoom(prev => Math.min(prev + 0.3, 4))
  }

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.3, 0.5))
  }

  const handleResetView = () => {
    targetRotationRef.current = { x: 0.3, y: 0 }
    setZoom(1)
  }

  return (
    <div className="relative w-full h-[700px] rounded-xl overflow-hidden border-2 border-border shadow-lg">
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
        <Button size="sm" variant="secondary" onClick={handleZoomIn} className="shadow-lg">
          <MagnifyingGlassPlus size={18} />
        </Button>
        <Button size="sm" variant="secondary" onClick={handleZoomOut} className="shadow-lg">
          <MagnifyingGlassMinus size={18} />
        </Button>
        <Button size="sm" variant="secondary" onClick={handleResetView} className="shadow-lg">
          <Compass size={18} />
        </Button>
      </div>

      <Card className="absolute top-4 left-4 p-3 bg-card/95 backdrop-blur-md shadow-lg border-border/50">
        <div className="flex items-center gap-3 mb-3">
          <ChartLine size={20} className="text-primary" />
          <div>
            <div className="text-sm font-semibold text-foreground">Live System Activity</div>
            <div className="text-xs text-muted-foreground">Real-time data visualization</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Lightning size={16} className="text-warning animate-pulse" />
          <span className="text-sm font-mono text-foreground">{liveActivity} active items</span>
        </div>
      </Card>

      {hoveredBubble && (
        <Card className="absolute bottom-4 left-4 p-4 max-w-md bg-card/95 backdrop-blur-md shadow-xl border-border/50">
          <div className="flex items-start gap-3">
            <MapPin size={24} className="text-primary shrink-0 mt-1" />
            <div className="space-y-2 flex-1 min-w-0">
              <h3 className="font-bold text-foreground truncate text-lg">{hoveredBubble.bubble.name}</h3>
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
                  <Badge className="text-xs bg-accent">
                    {hoveredBubble.bubble.domain}
                  </Badge>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <Warning size={16} className="text-warning" />
                  <span className="font-medium">{hoveredBubble.problems.length} problems</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-success" />
                  <span className="font-medium">{hoveredBubble.proposals.length} proposals</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <MapPin size={12} />
                <span>
                  {hoveredBubble.lat.toFixed(2)}°N, {hoveredBubble.lng.toFixed(2)}°E
                </span>
              </div>
              {hoveredBubble.bubble.activeAlerts > 0 && (
                <div className="flex items-center gap-2 text-sm text-destructive font-semibold bg-destructive/10 px-2 py-1 rounded">
                  <Warning size={16} />
                  {hoveredBubble.bubble.activeAlerts} active alerts
                </div>
              )}
            </div>
          </div>
        </Card>
      )}

      <Card className="absolute top-4 right-20 p-3 bg-card/90 backdrop-blur-md shadow-lg border-border/50">
        <div className="text-xs space-y-2 min-w-[140px]">
          <div className="font-semibold text-foreground mb-2">Activity Status</div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#44ffaa] shadow-lg shadow-[#44ffaa]/50"></div>
            <span className="text-muted-foreground">Resolved</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#66aaff] shadow-lg shadow-[#66aaff]/50"></div>
            <span className="text-muted-foreground">Active</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#ffcc44] shadow-lg shadow-[#ffcc44]/50"></div>
            <span className="text-muted-foreground">Pending</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#ff9944] shadow-lg shadow-[#ff9944]/50"></div>
            <span className="text-muted-foreground">Warning</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#ff3366] shadow-lg shadow-[#ff3366]/50 animate-pulse"></div>
            <span className="text-muted-foreground">Critical</span>
          </div>
        </div>
      </Card>
    </div>
  )
}
