import { useEffect, useRef } from 'react'
import { useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet.heat'

declare module 'leaflet' {
  function heatLayer(
    latlngs: Array<[number, number, number]>,
    options?: {
      minOpacity?: number
      maxZoom?: number
      max?: number
      radius?: number
      blur?: number
      gradient?: Record<number, string>
    }
  ): L.Layer
}

interface Signal {
  location: { lat: number; lng: number }
  attestations?: number
  status?: string
}

interface HeatMapLayerProps {
  signals: Signal[]
  intensity?: 'low' | 'medium' | 'high'
}

const INTENSITY_CONFIG = {
  low: {
    radius: 20,
    blur: 15,
    max: 0.5,
    minOpacity: 0.2,
  },
  medium: {
    radius: 30,
    blur: 20,
    max: 1.0,
    minOpacity: 0.3,
  },
  high: {
    radius: 40,
    blur: 25,
    max: 2.0,
    minOpacity: 0.4,
  },
}

export function HeatMapLayer({ signals, intensity = 'medium' }: HeatMapLayerProps) {
  const map = useMap()
  const heatLayerRef = useRef<L.Layer | null>(null)

  useEffect(() => {
    if (heatLayerRef.current) {
      map.removeLayer(heatLayerRef.current)
    }

    const config = INTENSITY_CONFIG[intensity]

    const heatData: Array<[number, number, number]> = signals.map(signal => {
      const weight = Math.max(1, (signal.attestations || 1) * 0.5)
      return [
        signal.location.lat,
        signal.location.lng,
        weight
      ]
    })

    const gradient = {
      0.0: '#0000ff',
      0.2: '#00ffff',
      0.4: '#00ff00',
      0.6: '#ffff00',
      0.8: '#ff8800',
      1.0: '#ff0000',
    }

    heatLayerRef.current = L.heatLayer(heatData, {
      radius: config.radius,
      blur: config.blur,
      max: config.max,
      minOpacity: config.minOpacity,
      maxZoom: 18,
      gradient,
    })

    heatLayerRef.current.addTo(map)

    return () => {
      if (heatLayerRef.current) {
        map.removeLayer(heatLayerRef.current)
      }
    }
  }, [map, signals, intensity])

  return null
}
