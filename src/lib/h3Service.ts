export interface H3Location {
  h3Cell: string
  resolution: number
  coordinates: { lat: number; lng: number }
  boundary: Array<[number, number]>
}

function simpleH3Hash(lat: number, lng: number, resolution: number = 8): string {
  const latNorm = Math.floor((lat + 90) * Math.pow(2, resolution))
  const lngNorm = Math.floor((lng + 180) * Math.pow(2, resolution))
  return `${resolution}-${latNorm}-${lngNorm}`
}

function generateHexBoundary(lat: number, lng: number, size: number): Array<[number, number]> {
  const hexSize = size * 0.001
  const points: Array<[number, number]> = []
  
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i
    const offsetLat = lat + hexSize * Math.sin(angle)
    const offsetLng = lng + hexSize * Math.cos(angle)
    points.push([offsetLat, offsetLng])
  }
  
  return points
}

export function coordinatesToH3(lat: number, lng: number, resolution: number = 8): string {
  return simpleH3Hash(lat, lng, resolution)
}

export function h3ToLocation(h3Cell: string): H3Location {
  const [resStr, latStr, lngStr] = h3Cell.split('-')
  const resolution = parseInt(resStr)
  const latNorm = parseInt(latStr)
  const lngNorm = parseInt(lngStr)
  
  const lat = (latNorm / Math.pow(2, resolution)) - 90
  const lng = (lngNorm / Math.pow(2, resolution)) - 180
  
  const hexSize = 100 / Math.pow(2, resolution - 5)
  const boundary = generateHexBoundary(lat, lng, hexSize)

  return {
    h3Cell,
    resolution,
    coordinates: { lat, lng },
    boundary,
  }
}

export function getNeighborCells(h3Cell: string, radius: number = 1): string[] {
  const center = h3ToLocation(h3Cell)
  const neighbors: string[] = []
  
  const offsets = [
    [0, 0],
    [1, 0], [-1, 0], [0, 1], [0, -1],
    [1, 1], [-1, -1], [1, -1], [-1, 1]
  ]
  
  offsets.forEach(([dLat, dLng]) => {
    const neighborLat = center.coordinates.lat + (dLat * 0.01)
    const neighborLng = center.coordinates.lng + (dLng * 0.01)
    neighbors.push(coordinatesToH3(neighborLat, neighborLng, center.resolution))
  })
  
  return neighbors.slice(0, radius * 6 + 1)
}

export function blurLocation(lat: number, lng: number, resolution: number = 8): H3Location {
  const h3Cell = coordinatesToH3(lat, lng, resolution)
  return h3ToLocation(h3Cell)
}
