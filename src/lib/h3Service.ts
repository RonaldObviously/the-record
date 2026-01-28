import { latLngToCell, cellToBoundary, gridDisk, getResolution } from 'h3-js'

export interface H3Location {
  h3Cell: string
  resolution: number
  coordinates: { lat: number; lng: number }
  boundary: Array<[number, number]>
}

export function coordinatesToH3(lat: number, lng: number, resolution: number = 8): string {
  return latLngToCell(lat, lng, resolution)
}

export function h3ToLocation(h3Cell: string): H3Location {
  const boundary = cellToBoundary(h3Cell)
  const resolution = getResolution(h3Cell)
  
  const centerLat = boundary.reduce((sum, [lat]) => sum + lat, 0) / boundary.length
  const centerLng = boundary.reduce((sum, [, lng]) => sum + lng, 0) / boundary.length

  return {
    h3Cell,
    resolution,
    coordinates: { lat: centerLat, lng: centerLng },
    boundary,
  }
}

export function getNeighborCells(h3Cell: string, radius: number = 1): string[] {
  return gridDisk(h3Cell, radius)
}

export function blurLocation(lat: number, lng: number, resolution: number = 8): H3Location {
  const h3Cell = coordinatesToH3(lat, lng, resolution)
  return h3ToLocation(h3Cell)
}
