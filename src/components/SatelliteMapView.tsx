import { useEffect, useMemo } from 'react'
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { Signal, SignalCluster } from '@/lib/types'
import { h3ToLocation } from '@/lib/h3Service'
import { MapPin, Planet, Globe, Stack } from '@phosphor-icons/react'
import 'leaflet/dist/leaflet.css'

interface SatelliteMapViewProps {
  signals: Signal[]
  clusters?: SignalCluster[]
  onSignalClick?: (signal: Signal) => void
  onClusterClick?: (cluster: SignalCluster) => void
}

interface SignalWithLocation extends Signal {
  location: { lat: number; lng: number }
}

function MapUpdater({ signalsWithLocations }: { signalsWithLocations: SignalWithLocation[] }) {
  const map = useMap()
  
  useEffect(() => {
    if (signalsWithLocations.length > 0) {
      const bounds = signalsWithLocations.map(s => [s.location.lat, s.location.lng] as [number, number])
      
      if (bounds.length > 0) {
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 12 })
      }
    }
  }, [signalsWithLocations, map])
  
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

export function SatelliteMapView({ signals, clusters = [], onSignalClick, onClusterClick }: SatelliteMapViewProps) {
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

  const center: [number, number] = signalsWithLocations.length > 0
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
          
          <MapUpdater signalsWithLocations={signalsWithLocations} />
          
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
        
        <div className="absolute bottom-4 left-4 z-[1000] bg-card/90 backdrop-blur-sm p-3 rounded-lg border border-border">
          <div className="text-xs font-semibold mb-2">Signal Distribution</div>
          <div className="space-y-1">
            {Object.entries(
              signals.reduce((acc, s) => {
                acc[s.category] = (acc[s.category] || 0) + 1
                return acc
              }, {} as Record<string, number>)
            ).map(([category, count]) => (
              <div key={category} className="flex items-center gap-2 text-xs">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: getCategoryColor(category) }}
                />
                <span className="capitalize">{category}</span>
                <span className="font-mono ml-auto">{count}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="absolute top-4 right-4 z-[1000] bg-card/90 backdrop-blur-sm p-2 rounded-lg border border-border">
          <div className="text-xs font-semibold mb-1">Total Signals</div>
          <div className="text-2xl font-mono font-bold">{signals.length}</div>
        </div>
      </Card>
    </div>
  )
}
