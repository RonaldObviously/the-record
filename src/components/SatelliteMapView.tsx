import { useEffect, useMemo, useState } from 'react'
import { MapContainer, TileLayer, CircleMarker, Popup, useMap, Polygon, Circle } from 'react-leaflet'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import type { Signal, SignalCluster } from '@/lib/types'
import { h3ToLocation, coordinatesToH3, getNeighborCells } from '@/lib/h3Service'
import { MapPin, Planet, Globe, Stack, Fire, Crosshair } from '@phosphor-icons/react'
import { HeatMapLayer } from '@/components/HeatMapLayer'
import 'leaflet/dist/leaflet.css'

interface SatelliteMapViewProps {
  signals: Signal[]
  clusters?: SignalCluster[]
  onSignalClick?: (signal: Signal) => void
  onClusterClick?: (cluster: SignalCluster) => void
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

export function SatelliteMapView({ signals, clusters = [], onSignalClick, onClusterClick, showMeshRange = true }: SatelliteMapViewProps) {
  const [showHeatMap, setShowHeatMap] = useState(true)
  const [heatIntensity, setHeatIntensity] = useState<'low' | 'medium' | 'high'>('medium')
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [meshRangeVisible, setMeshRangeVisible] = useState(showMeshRange)
  const [meshRadius, setMeshRadius] = useState(1)
  
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
    return signals.map(signal => {
      const h3Location = h3ToLocation(signal.h3Cell)
      return {
        ...signal,
        location: h3Location.coordinates
      }
    })
  }, [signals])

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
          </p>
        </div>
        
        <div className="flex items-center gap-3">
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
          <Badge variant="outline" className="gap-1.5">
            <Globe size={16} />
            Satellite View
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
                >
                  <Popup>
                    <div className="p-2">
                      <div className="text-xs font-semibold mb-1">Mesh Cell</div>
                      <div className="text-xs font-mono">{meshCell.cell}</div>
                      <div className="text-xs text-muted-foreground mt-2">
                        This is your reporting range. Signals you submit will be blurred to this hex area for privacy.
                      </div>
                    </div>
                  </Popup>
                </Polygon>
              ))}
            </>
          )}
          
          {signalsWithLocations.map((signal) => {
            const color = getCategoryColor(signal.category)
            
            return (
              <CircleMarker
                key={signal.id}
                center={[signal.location.lat, signal.location.lng]}
                radius={8}
                pathOptions={{
                  fillColor: color,
                  fillOpacity: signal.status === 'clustered' ? 0.8 : 0.6,
                  color: color,
                  weight: 2,
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
          
          {clustersWithLocations.map((cluster) => {
            return (
              <CircleMarker
                key={cluster.id}
                center={[cluster.location.lat, cluster.location.lng]}
                radius={15}
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
                        Cluster
                      </Badge>
                      <span className="text-xs font-mono">
                        {cluster.signals.length} signals
                      </span>
                    </div>
                    <p className="text-sm font-medium mb-2">
                      {cluster.category}
                    </p>
                    <div className="text-xs text-muted-foreground">
                      Click to promote to Problem
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            )
          })}
        </MapContainer>

{meshRangeVisible && userLocation && (
          <div className="absolute top-20 right-4 z-[1000] bg-card/90 backdrop-blur-sm p-3 rounded-lg border border-border">
            <div className="text-xs font-semibold mb-2 flex items-center gap-1.5">
              <Crosshair size={14} className="text-blue-500" />
              Your Mesh Range
            </div>
            <div className="text-xs text-muted-foreground mb-3">
              Adjust reporting radius
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
          <div className="text-xs font-semibold mb-2">Signal Distribution</div>
          <div className="space-y-1 max-h-48 overflow-y-auto">
            {Object.entries(
              signals.reduce((acc, s) => {
                acc[s.category] = (acc[s.category] || 0) + 1
                return acc
              }, {} as Record<string, number>)
            ).map(([category, count]) => (
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
        
        <div className="absolute top-4 right-4 z-[1000] bg-card/90 backdrop-blur-sm p-2 rounded-lg border border-border">
          <div className="text-xs font-semibold mb-1">Total Signals</div>
          <div className="text-2xl font-mono font-bold">{signals.length}</div>
          {showHeatMap && (
            <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <Fire size={12} weight="fill" className="text-orange-500" />
              Heat map active
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
