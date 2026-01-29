import { useEffect, useMemo, useState } from 'react'
import { MapContainer, TileLayer, CircleMarker, Popup, useMap, Polygon, Circle, Polyline } from 'react-leaflet'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import type { Signal, SignalCluster } from '@/lib/types'
import { h3ToLocation, coordinatesToH3, getNeighborCells } from '@/lib/h3Service'
import { MapPin, Planet, Globe, Stack, Fire, Crosshair, FunnelSimple, Clock, Pulse, GitBranch, Lightning, Eye, EyeSlash } from '@phosphor-icons/react'
import { HeatMapLayer } from '@/components/HeatMapLayer'
import 'leaflet/dist/leaflet.css'

interface SatelliteMapViewProps {
  signals: Signal[]
  clusters?: SignalCluster[]
  onSignalClick?: (signal: Signal) => void
  onClusterClick?: (cluster: SignalCluster) => void
  onMeshCellClick?: (h3Cell: string, coordinates: { lat: number; lng: number }) => void
  showMeshRange?: boolean
}

interface SignalWithLocation extends Signal {
  location: { lat: number; lng: number }
}

function MapUpdater({ 
  signalsWithLocations, 
  userLocation 
}: { 
  signalsWithLocations: SignalWithLocation[]
  userLocation: { lat: number; lng: number } | null
}) {
  const map = useMap()
  const [hasInitialized, setHasInitialized] = useState(false)
  
  useEffect(() => {
    if (!hasInitialized && userLocation) {
      map.setView([userLocation.lat, userLocation.lng], 13)
      setHasInitialized(true)
    }
  }, [userLocation, map, hasInitialized])
  
  return null
}

const CATEGORY_COLORS: Record<string, string> = {
  infrastructure: '#ef4444',
  environment: '#10b981',
  safety: '#f59e0b',
  health: '#3b82f6',
  social: '#8b5cf6',
  economic: '#ec4899',
  governance: '#6366f1',
  education: '#14b8a6',
  transport: '#f97316',
  utilities: '#06b6d4',
  climate: '#10b981',
  healthcare: '#3b82f6',
  energy: '#f59e0b',
  housing: '#ec4899',
  economy: '#8b5cf6',
  water: '#06b6d4',
  sanitation: '#14b8a6',
  other: '#6b7280',
}

export function SatelliteMapView({ signals, clusters = [], onSignalClick, onClusterClick, onMeshCellClick, showMeshRange = true }: SatelliteMapViewProps) {
  const [showHeatMap, setShowHeatMap] = useState(true)
  const [heatIntensity, setHeatIntensity] = useState<'low' | 'medium' | 'high'>('medium')
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [meshRangeVisible, setMeshRangeVisible] = useState(showMeshRange)
  const [meshRadius, setMeshRadius] = useState(1)
  const [showClusters, setShowClusters] = useState(true)
  const [showClusterLinks, setShowClusterLinks] = useState(false)
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set())
  const [timeRange, setTimeRange] = useState<number>(24)
  const [showSignalAge, setShowSignalAge] = useState(true)
  const [showFilterPanel, setShowFilterPanel] = useState(false)
  const [signalOpacity, setSignalOpacity] = useState(0.7)
  
  useEffect(() => {
    if (showMeshRange && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
        },
        (error) => {
          console.log('Geolocation not available:', error)
        }
      )
    }
  }, [showMeshRange])

  const signalsWithLocations = useMemo<SignalWithLocation[]>(() => {
    const now = Date.now()
    const timeRangeMs = timeRange * 60 * 60 * 1000
    
    return signals
      .filter(signal => {
        const signalAge = now - new Date(signal.submittedAt).getTime()
        const withinTimeRange = timeRange === 0 || signalAge <= timeRangeMs
        const matchesCategory = selectedCategories.size === 0 || selectedCategories.has(signal.category)
        return withinTimeRange && matchesCategory
      })
      .map(signal => {
        const h3Location = h3ToLocation(signal.h3Cell)
        return {
          ...signal,
          location: h3Location.coordinates
        }
      })
  }, [signals, timeRange, selectedCategories])

  const clustersWithLocations = useMemo(() => {
    return clusters.map(cluster => {
      const h3Location = h3ToLocation(cluster.h3Cell)
      return {
        ...cluster,
        location: h3Location.coordinates
      }
    })
  }, [clusters])

  const getCategoryColor = (category: string) => {
    return CATEGORY_COLORS[category.toLowerCase()] || '#6b7280'
  }
  
  const getSignalAge = (signal: Signal) => {
    const now = Date.now()
    const ageMs = now - new Date(signal.submittedAt).getTime()
    const ageHours = ageMs / (1000 * 60 * 60)
    
    if (ageHours < 1) return { label: '<1h', opacity: 1.0, pulse: true }
    if (ageHours < 6) return { label: '<6h', opacity: 0.85, pulse: false }
    if (ageHours < 24) return { label: '<24h', opacity: 0.7, pulse: false }
    if (ageHours < 72) return { label: '<3d', opacity: 0.55, pulse: false }
    return { label: '>3d', opacity: 0.4, pulse: false }
  }
  
  const allCategories = useMemo(() => {
    const cats = new Set<string>()
    signals.forEach(s => cats.add(s.category))
    return Array.from(cats).sort()
  }, [signals])
  
  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => {
      const next = new Set(prev)
      if (next.has(category)) {
        next.delete(category)
      } else {
        next.add(category)
      }
      return next
    })
  }
  
  const clusterLinks = useMemo(() => {
    if (!showClusterLinks) return []
    
    const links: Array<{ from: [number, number]; to: [number, number] }> = []
    
    clusters.forEach(cluster => {
      const clusterLocation = h3ToLocation(cluster.h3Cell)
      cluster.signals.forEach(signal => {
        const signalLocation = h3ToLocation(signal.h3Cell)
        links.push({
          from: [clusterLocation.coordinates.lat, clusterLocation.coordinates.lng],
          to: [signalLocation.coordinates.lat, signalLocation.coordinates.lng]
        })
      })
    })
    
    return links
  }, [clusters, showClusterLinks])
  
  const meshCells = useMemo(() => {
    if (!userLocation || !meshRangeVisible) return []
    
    const userH3 = coordinatesToH3(userLocation.lat, userLocation.lng, 8)
    const neighborCells = getNeighborCells(userH3, meshRadius)
    
    return neighborCells.map(cell => {
      const location = h3ToLocation(cell)
      return {
        cell,
        boundary: location.boundary,
        center: location.coordinates
      }
    })
  }, [userLocation, meshRangeVisible, meshRadius])

  const center: [number, number] = userLocation
    ? [userLocation.lat, userLocation.lng]
    : signalsWithLocations.length > 0
    ? [signalsWithLocations[0].location.lat, signalsWithLocations[0].location.lng]
    : [37.7749, -122.4194]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Planet size={24} className="text-accent" weight="duotone" />
            Live Signal Map
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time geospatial distribution of signals across Earth
            {onMeshCellClick && meshRangeVisible && (
              <span className="ml-2 text-accent font-medium">
                • Click any mesh cell to submit a signal
              </span>
            )}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            variant={showFilterPanel ? "default" : "outline"}
            size="sm"
            onClick={() => setShowFilterPanel(!showFilterPanel)}
          >
            <FunnelSimple size={16} className="mr-1.5" />
            Filters
          </Button>
          <Button
            variant={meshRangeVisible ? "default" : "outline"}
            size="sm"
            onClick={() => setMeshRangeVisible(!meshRangeVisible)}
          >
            <Crosshair size={16} className="mr-1.5" />
            My Mesh Range
          </Button>
          <Button
            variant={showHeatMap ? "default" : "outline"}
            size="sm"
            onClick={() => setShowHeatMap(!showHeatMap)}
          >
            <Fire size={16} className="mr-1.5" />
            Heat Map
          </Button>
          <Button
            variant={showClusters ? "default" : "outline"}
            size="sm"
            onClick={() => setShowClusters(!showClusters)}
          >
            <Stack size={16} className="mr-1.5" />
            Clusters
          </Button>
          <Badge variant="outline" className="gap-1.5">
            <Globe size={16} />
            {signalsWithLocations.length} / {signals.length} signals
          </Badge>
        </div>
      </div>

      <Card className="relative overflow-hidden h-[600px]">
        <MapContainer
          center={center}
          zoom={12}
          style={{ height: '100%', width: '100%' }}
          zoomControl={true}
        >
          <TileLayer
            attribution='&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
            url='https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
          />
          
          <MapUpdater signalsWithLocations={signalsWithLocations} userLocation={userLocation} />
          
          {showHeatMap && (
            <HeatMapLayer 
              signals={signalsWithLocations} 
              intensity={heatIntensity}
            />
          )}
          
          {showClusterLinks && clusterLinks.map((link, index) => (
            <Polyline
              key={`cluster-link-${index}`}
              positions={[link.from, link.to]}
              pathOptions={{
                color: '#f59e0b',
                weight: 1,
                opacity: 0.3,
                dashArray: '2, 4',
              }}
            />
          ))}
          
          {meshRangeVisible && userLocation && (
            <>
              <Circle
                center={[userLocation.lat, userLocation.lng]}
                radius={10}
                pathOptions={{
                  fillColor: '#3b82f6',
                  fillOpacity: 1,
                  color: '#ffffff',
                  weight: 3,
                }}
              />
              
              {meshCells.map((meshCell, index) => (
                <Polygon
                  key={`${meshCell.cell}-${index}`}
                  positions={meshCell.boundary}
                  pathOptions={{
                    fillColor: '#3b82f6',
                    fillOpacity: 0.15,
                    color: '#3b82f6',
                    weight: 2,
                    dashArray: '4, 4',
                  }}
                  eventHandlers={{
                    click: () => {
                      onMeshCellClick?.(meshCell.cell, meshCell.center)
                    },
                    mouseover: (e) => {
                      const target = e.target as any
                      target.setStyle({
                        fillOpacity: 0.3,
                        weight: 3,
                      })
                    },
                    mouseout: (e) => {
                      const target = e.target as any
                      target.setStyle({
                        fillOpacity: 0.15,
                        weight: 2,
                      })
                    },
                  }}
                >
                  <Popup>
                    <div className="p-2">
                      <div className="text-xs font-semibold mb-1">Mesh Cell</div>
                      <div className="text-xs font-mono mb-2">{meshCell.cell}</div>
                      <div className="text-xs text-muted-foreground mb-2">
                        This is your reporting range. Signals you submit will be blurred to this hex area for privacy.
                      </div>
                      {onMeshCellClick && (
                        <Button 
                          size="sm" 
                          className="w-full text-xs mt-2"
                          onClick={() => onMeshCellClick(meshCell.cell, meshCell.center)}
                        >
                          Submit Signal Here
                        </Button>
                      )}
                    </div>
                  </Popup>
                </Polygon>
              ))}
            </>
          )}
          
          {signalsWithLocations.map((signal) => {
            const color = getCategoryColor(signal.category)
            const age = getSignalAge(signal)
            const finalOpacity = showSignalAge ? age.opacity * signalOpacity : signalOpacity
            
            return (
              <CircleMarker
                key={signal.id}
                center={[signal.location.lat, signal.location.lng]}
                radius={age.pulse ? 10 : 8}
                pathOptions={{
                  fillColor: color,
                  fillOpacity: signal.status === 'clustered' ? finalOpacity * 1.2 : finalOpacity,
                  color: color,
                  weight: age.pulse ? 3 : 2,
                  className: age.pulse ? 'animate-pulse' : undefined,
                }}
                eventHandlers={{
                  click: () => {
                    onSignalClick?.(signal)
                  },
                }}
              >
                <Popup>
                  <div className="p-2 min-w-[200px]">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary" className="text-xs">
                        {signal.category}
                      </Badge>
                      <Badge 
                        variant={signal.status === 'raw' ? 'outline' : 'default'}
                        className="text-xs"
                      >
                        {signal.status}
                      </Badge>
                      {showSignalAge && (
                        <Badge variant="outline" className="text-xs">
                          <Clock size={10} className="mr-1" />
                          {age.label}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm font-medium mb-2">{signal.description}</p>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <div>H3 Cell: {signal.h3Cell}</div>
                      <div>Attestations: {signal.attestations}</div>
                      <div className="text-xs">
                        {new Date(signal.submittedAt).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            )
          })}
          
          {showClusters && clustersWithLocations.map((cluster) => {
            return (
              <CircleMarker
                key={cluster.id}
                center={[cluster.location.lat, cluster.location.lng]}
                radius={15 + cluster.signals.length * 0.5}
                pathOptions={{
                  fillColor: '#f59e0b',
                  fillOpacity: 0.3,
                  color: '#f59e0b',
                  weight: 3,
                  dashArray: '5, 5',
                }}
                eventHandlers={{
                  click: () => {
                    onClusterClick?.(cluster)
                  },
                }}
              >
                <Popup>
                  <div className="p-2 min-w-[200px]">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="text-xs bg-orange-500">
                        L{cluster.level || 1} Cluster
                      </Badge>
                      <span className="text-xs font-mono">
                        {cluster.signals.length} signals
                      </span>
                    </div>
                    <p className="text-sm font-medium mb-2">
                      {cluster.category}
                    </p>
                    <div className="text-xs text-muted-foreground mb-2">
                      Weight: {cluster.weight.toFixed(2)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Click to promote to Problem
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            )
          })}
        </MapContainer>

{showFilterPanel && (
          <div className="absolute top-4 left-4 z-[1000] bg-card/95 backdrop-blur-sm p-4 rounded-lg border border-border max-w-xs max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-semibold flex items-center gap-2">
                <FunnelSimple size={16} />
                Filters & Layers
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFilterPanel(false)}
              >
                <EyeSlash size={16} />
              </Button>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label className="text-xs font-semibold mb-2 block">Time Range</Label>
                <div className="space-y-2">
                  <Slider
                    value={[timeRange]}
                    onValueChange={(val) => setTimeRange(val[0])}
                    min={0}
                    max={168}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Last {timeRange === 0 ? 'All' : timeRange === 1 ? '1 hour' : `${timeRange} hours`}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setTimeRange(0)}
                      className="text-xs h-6"
                    >
                      Reset
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-border pt-4">
                <Label className="text-xs font-semibold mb-2 block">Categories</Label>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {allCategories.map(category => (
                    <div key={category} className="flex items-center gap-2">
                      <Switch
                        checked={selectedCategories.size === 0 || selectedCategories.has(category)}
                        onCheckedChange={() => toggleCategory(category)}
                        id={`cat-${category}`}
                      />
                      <label
                        htmlFor={`cat-${category}`}
                        className="flex items-center gap-2 text-xs cursor-pointer flex-1"
                      >
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: getCategoryColor(category) }}
                        />
                        <span className="capitalize">{category}</span>
                      </label>
                    </div>
                  ))}
                  {allCategories.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedCategories(new Set())}
                      className="text-xs w-full"
                    >
                      Show All
                    </Button>
                  )}
                </div>
              </div>
              
              <div className="border-t border-border pt-4">
                <Label className="text-xs font-semibold mb-3 block">Visualization</Label>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="show-age" className="text-xs">Signal Age Indicator</Label>
                    <Switch
                      id="show-age"
                      checked={showSignalAge}
                      onCheckedChange={setShowSignalAge}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="cluster-links" className="text-xs">Cluster Links</Label>
                    <Switch
                      id="cluster-links"
                      checked={showClusterLinks}
                      onCheckedChange={setShowClusterLinks}
                    />
                  </div>
                  <div>
                    <Label className="text-xs mb-2 block">Signal Opacity</Label>
                    <Slider
                      value={[signalOpacity * 100]}
                      onValueChange={(val) => setSignalOpacity(val[0] / 100)}
                      min={10}
                      max={100}
                      step={5}
                      className="w-full"
                    />
                    <div className="text-xs text-muted-foreground text-right mt-1">
                      {Math.round(signalOpacity * 100)}%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {meshRangeVisible && userLocation && (
          <div className="absolute top-20 right-4 z-[1000] bg-card/90 backdrop-blur-sm p-3 rounded-lg border border-border">
            <div className="text-xs font-semibold mb-2 flex items-center gap-1.5">
              <Crosshair size={14} className="text-blue-500" />
              Your Mesh Range
            </div>
            <div className="text-xs text-muted-foreground mb-3">
              {onMeshCellClick 
                ? 'Click any blue cell to submit a signal' 
                : 'Adjust reporting radius'}
            </div>
            <div className="flex flex-col gap-2">
              <Button
                size="sm"
                variant={meshRadius === 0 ? 'default' : 'outline'}
                onClick={() => setMeshRadius(0)}
                className="text-xs"
              >
                Exact Cell
              </Button>
              <Button
                size="sm"
                variant={meshRadius === 1 ? 'default' : 'outline'}
                onClick={() => setMeshRadius(1)}
                className="text-xs"
              >
                1 Cell (~500m)
              </Button>
              <Button
                size="sm"
                variant={meshRadius === 2 ? 'default' : 'outline'}
                onClick={() => setMeshRadius(2)}
                className="text-xs"
              >
                2 Cells (~1km)
              </Button>
              <Button
                size="sm"
                variant={meshRadius === 3 ? 'default' : 'outline'}
                onClick={() => setMeshRadius(3)}
                className="text-xs"
              >
                3 Cells (~1.5km)
              </Button>
            </div>
            <div className="mt-3 pt-3 border-t border-border">
              <div className="text-xs text-muted-foreground">
                <div className="font-semibold mb-1">Privacy Protection</div>
                Your exact location is never recorded. Signals are blurred to the H3 mesh cell shown.
              </div>
            </div>
          </div>
        )}
        
        {showHeatMap && (
          <div className="absolute bottom-4 right-4 z-[1000] bg-card/90 backdrop-blur-sm p-3 rounded-lg border border-border">
            <div className="text-xs font-semibold mb-2">Heat Map Intensity</div>
            <div className="flex flex-col gap-2">
              <Button
                size="sm"
                variant={heatIntensity === 'low' ? 'default' : 'outline'}
                onClick={() => setHeatIntensity('low')}
                className="text-xs"
              >
                Low
              </Button>
              <Button
                size="sm"
                variant={heatIntensity === 'medium' ? 'default' : 'outline'}
                onClick={() => setHeatIntensity('medium')}
                className="text-xs"
              >
                Medium
              </Button>
              <Button
                size="sm"
                variant={heatIntensity === 'high' ? 'default' : 'outline'}
                onClick={() => setHeatIntensity('high')}
                className="text-xs"
              >
                High
              </Button>
            </div>
            <div className="mt-3 pt-3 border-t border-border">
              <div className="text-xs font-semibold mb-2">Density Scale</div>
              <div className="flex items-center gap-1 h-4 rounded overflow-hidden">
                <div className="flex-1 h-full" style={{ backgroundColor: '#0000ff' }} />
                <div className="flex-1 h-full" style={{ backgroundColor: '#00ffff' }} />
                <div className="flex-1 h-full" style={{ backgroundColor: '#00ff00' }} />
                <div className="flex-1 h-full" style={{ backgroundColor: '#ffff00' }} />
                <div className="flex-1 h-full" style={{ backgroundColor: '#ff8800' }} />
                <div className="flex-1 h-full" style={{ backgroundColor: '#ff0000' }} />
              </div>
              <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                <span>Low</span>
                <span>High</span>
              </div>
            </div>
          </div>
        )}
        
        <div className="absolute bottom-4 left-4 z-[1000] bg-card/90 backdrop-blur-sm p-3 rounded-lg border border-border max-w-xs">
          <div className="text-xs font-semibold mb-2 flex items-center gap-1.5">
            <Pulse size={14} />
            Signal Analytics
          </div>
          <div className="space-y-3">
            <div>
              <div className="text-xs text-muted-foreground mb-1">Active Signals</div>
              <div className="text-2xl font-mono font-bold">{signalsWithLocations.length}</div>
            </div>
            
            {showClusters && clusters.length > 0 && (
              <div className="pt-2 border-t border-border">
                <div className="text-xs text-muted-foreground mb-1">Active Clusters</div>
                <div className="text-xl font-mono font-semibold">{clusters.length}</div>
              </div>
            )}
            
            <div className="pt-2 border-t border-border">
              <div className="text-xs font-semibold mb-2">Category Distribution</div>
              <div className="space-y-1 max-h-36 overflow-y-auto">
                {Object.entries(
                  signalsWithLocations.reduce((acc, s) => {
                    acc[s.category] = (acc[s.category] || 0) + 1
                    return acc
                  }, {} as Record<string, number>)
                )
                  .sort((a, b) => b[1] - a[1])
                  .map(([category, count]) => (
                    <div key={category} className="flex items-center gap-2 text-xs">
                      <div
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: getCategoryColor(category) }}
                      />
                      <span className="capitalize flex-1 truncate">{category}</span>
                      <span className="font-mono">{count}</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="absolute top-4 right-4 z-[1000] bg-card/90 backdrop-blur-sm p-2 rounded-lg border border-border">
          <div className="flex items-center gap-2">
            <div>
              <div className="text-xs font-semibold mb-1">View Mode</div>
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                <Globe size={12} weight="fill" />
                Satellite
              </div>
            </div>
            {showHeatMap && (
              <div className="pl-2 border-l border-border">
                <div className="text-xs font-semibold mb-1">Heat Map</div>
                <div className="text-xs text-muted-foreground flex items-center gap-1">
                  <Fire size={12} weight="fill" className="text-orange-500" />
                  {heatIntensity}
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}
