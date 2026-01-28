import type { Signal } from './types'

export interface LocationProof {
  timestamp: Date
  h3Cell: string
  latitude: number
  longitude: number
  accuracy: number
  
  ipAddress: string
  isVPN: boolean
  isTor: boolean
  isProxy: boolean
  
  deviceFingerprint: string
  browserFingerprint: string
  
  networkLatency: number
  timezone: string
  timezoneMatch: boolean
  
  wifiNetworks?: WifiNetwork[]
  cellTowers?: CellTower[]
  bluetoothBeacons?: BluetoothBeacon[]
  
  consistencyScore: number
  trustScore: number
}

export interface WifiNetwork {
  bssid: string
  ssid?: string
  signalStrength: number
}

export interface CellTower {
  cellId: string
  lac: string
  mcc: string
  mnc: string
  signalStrength: number
}

export interface BluetoothBeacon {
  uuid: string
  major: number
  minor: number
  rssi: number
}

export interface GeospatialConsistency {
  userId: string
  recentProofs: LocationProof[]
  homeCell: string
  travelPatternNormal: boolean
  velocityRealistic: boolean
  suspiciousJumps: number
}

export class AntiVPNVerification {
  private userLocationHistory: Map<string, LocationProof[]> = new Map()
  private vpnIpRanges: Set<string> = new Set()
  private knownDatacenters: Set<string> = new Set()
  
  constructor() {
    this.initializeVPNDetection()
  }
  
  private initializeVPNDetection() {
    this.vpnIpRanges.add('104.28.')
    this.vpnIpRanges.add('104.16.')
    this.vpnIpRanges.add('172.67.')
    this.vpnIpRanges.add('45.8.')
    this.vpnIpRanges.add('185.230.')
    
    this.knownDatacenters.add('aws')
    this.knownDatacenters.add('google-cloud')
    this.knownDatacenters.add('azure')
    this.knownDatacenters.add('digitalocean')
    this.knownDatacenters.add('vultr')
  }
  
  async createLocationProof(
    userId: string,
    latitude: number,
    longitude: number,
    h3Cell: string
  ): Promise<LocationProof> {
    const ipAddress = await this.getClientIP()
    const isVPN = this.detectVPN(ipAddress)
    const isTor = this.detectTor(ipAddress)
    const isProxy = await this.detectProxy(ipAddress)
    
    const deviceFingerprint = this.generateDeviceFingerprint()
    const browserFingerprint = this.generateBrowserFingerprint()
    
    const networkLatency = await this.measureNetworkLatency()
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    const timezoneMatch = this.verifyTimezone(timezone, longitude)
    
    const wifiNetworks = await this.getWifiNetworks()
    const cellTowers = await this.getCellTowers()
    const bluetoothBeacons = await this.getBluetoothBeacons()
    
    const proof: LocationProof = {
      timestamp: new Date(),
      h3Cell,
      latitude,
      longitude,
      accuracy: 0,
      ipAddress,
      isVPN,
      isTor,
      isProxy,
      deviceFingerprint,
      browserFingerprint,
      networkLatency,
      timezone,
      timezoneMatch,
      wifiNetworks,
      cellTowers,
      bluetoothBeacons,
      consistencyScore: 0,
      trustScore: 0
    }
    
    proof.consistencyScore = this.calculateConsistencyScore(proof)
    proof.trustScore = this.calculateTrustScore(userId, proof)
    
    const history = this.userLocationHistory.get(userId) || []
    history.push(proof)
    if (history.length > 100) history.shift()
    this.userLocationHistory.set(userId, history)
    
    return proof
  }
  
  private detectVPN(ipAddress: string): boolean {
    for (const range of this.vpnIpRanges) {
      if (ipAddress.startsWith(range)) return true
    }
    
    const ipParts = ipAddress.split('.')
    if (ipParts.length !== 4) return false
    
    const firstOctet = parseInt(ipParts[0])
    const secondOctet = parseInt(ipParts[1])
    
    if (firstOctet === 10) return true
    if (firstOctet === 172 && secondOctet >= 16 && secondOctet <= 31) return true
    if (firstOctet === 192 && secondOctet === 168) return true
    
    return false
  }
  
  private detectTor(ipAddress: string): boolean {
    const torExitNodes = [
      '185.220.',
      '185.241.',
      '176.10.',
      '185.100.'
    ]
    
    return torExitNodes.some(node => ipAddress.startsWith(node))
  }
  
  private async detectProxy(ipAddress: string): Promise<boolean> {
    return false
  }
  
  private async getClientIP(): Promise<string> {
    if (typeof window === 'undefined') return '127.0.0.1'
    
    try {
      const pc = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
      })
      
      pc.createDataChannel('')
      
      const offer = await pc.createOffer()
      await pc.setLocalDescription(offer)
      
      return new Promise((resolve) => {
        pc.onicecandidate = (ice) => {
          if (!ice || !ice.candidate) {
            pc.close()
            resolve('unknown')
            return
          }
          
          const ipMatch = ice.candidate.candidate.match(/([0-9]{1,3}\.){3}[0-9]{1,3}/)
          if (ipMatch) {
            pc.close()
            resolve(ipMatch[0])
          }
        }
        
        setTimeout(() => {
          pc.close()
          resolve('unknown')
        }, 2000)
      })
    } catch (err) {
      return 'unknown'
    }
  }
  
  private generateDeviceFingerprint(): string {
    if (typeof window === 'undefined') return 'server'
    
    const nav = window.navigator as any
    const screen = window.screen
    
    const components = [
      nav.userAgent,
      nav.language,
      nav.hardwareConcurrency || 0,
      screen.width,
      screen.height,
      screen.colorDepth,
      new Date().getTimezoneOffset(),
      !!nav.cookieEnabled,
      !!nav.doNotTrack,
      nav.maxTouchPoints || 0
    ]
    
    const fingerprint = components.join('|')
    return this.simpleHash(fingerprint)
  }
  
  private generateBrowserFingerprint(): string {
    if (typeof window === 'undefined') return 'server'
    
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return 'no-canvas'
    
    ctx.textBaseline = 'top'
    ctx.font = '14px Arial'
    ctx.textBaseline = 'alphabetic'
    ctx.fillStyle = '#f60'
    ctx.fillRect(125, 1, 62, 20)
    ctx.fillStyle = '#069'
    ctx.fillText('THE RECORD', 2, 15)
    ctx.fillStyle = 'rgba(102, 204, 0, 0.7)'
    ctx.fillText('Browser Fingerprint', 4, 17)
    
    const dataURL = canvas.toDataURL()
    return this.simpleHash(dataURL)
  }
  
  private async measureNetworkLatency(): Promise<number> {
    const start = performance.now()
    
    try {
      await fetch('/api/ping', { method: 'HEAD' })
    } catch {
    }
    
    return performance.now() - start
  }
  
  private verifyTimezone(timezone: string, longitude: number): boolean {
    const expectedOffset = Math.round(longitude / 15)
    const actualOffset = -new Date().getTimezoneOffset() / 60
    
    const difference = Math.abs(expectedOffset - actualOffset)
    return difference <= 2
  }
  
  private async getWifiNetworks(): Promise<WifiNetwork[] | undefined> {
    return undefined
  }
  
  private async getCellTowers(): Promise<CellTower[] | undefined> {
    return undefined
  }
  
  private async getBluetoothBeacons(): Promise<BluetoothBeacon[] | undefined> {
    return undefined
  }
  
  private calculateConsistencyScore(proof: LocationProof): number {
    let score = 100
    
    if (proof.isVPN) score -= 40
    if (proof.isTor) score -= 50
    if (proof.isProxy) score -= 30
    if (!proof.timezoneMatch) score -= 20
    
    if (proof.wifiNetworks && proof.wifiNetworks.length > 0) score += 15
    if (proof.cellTowers && proof.cellTowers.length > 0) score += 15
    if (proof.bluetoothBeacons && proof.bluetoothBeacons.length > 0) score += 10
    
    if (proof.networkLatency > 200) score -= 15
    if (proof.networkLatency > 500) score -= 25
    
    return Math.max(0, Math.min(100, score))
  }
  
  private calculateTrustScore(userId: string, currentProof: LocationProof): number {
    const history = this.userLocationHistory.get(userId) || []
    if (history.length === 0) return currentProof.consistencyScore
    
    let score = currentProof.consistencyScore
    
    const deviceConsistency = this.checkDeviceConsistency(userId, currentProof.deviceFingerprint)
    score += deviceConsistency * 10
    
    const velocityCheck = this.checkVelocityRealistic(history, currentProof)
    if (!velocityCheck) score -= 40
    
    const patternCheck = this.checkTravelPattern(history, currentProof)
    if (!patternCheck) score -= 20
    
    return Math.max(0, Math.min(100, score))
  }
  
  private checkDeviceConsistency(userId: string, deviceFingerprint: string): number {
    const history = this.userLocationHistory.get(userId) || []
    if (history.length === 0) return 1
    
    const recentDevices = history.slice(-10).map(p => p.deviceFingerprint)
    const matchCount = recentDevices.filter(d => d === deviceFingerprint).length
    
    return matchCount / recentDevices.length
  }
  
  private checkVelocityRealistic(history: LocationProof[], current: LocationProof): boolean {
    if (history.length === 0) return true
    
    const previous = history[history.length - 1]
    const timeDiff = (current.timestamp.getTime() - previous.timestamp.getTime()) / 1000
    
    if (timeDiff < 60) return true
    
    const distance = this.haversineDistance(
      previous.latitude,
      previous.longitude,
      current.latitude,
      current.longitude
    )
    
    const speedKmH = (distance / 1000) / (timeDiff / 3600)
    
    const maxRealisticSpeed = 900
    return speedKmH <= maxRealisticSpeed
  }
  
  private checkTravelPattern(history: LocationProof[], current: LocationProof): boolean {
    if (history.length < 5) return true
    
    const recent = history.slice(-5)
    const uniqueCells = new Set(recent.map(p => p.h3Cell))
    
    if (uniqueCells.size === recent.length && !recent.some(p => p.isVPN)) {
      return false
    }
    
    return true
  }
  
  private haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371e3
    const φ1 = (lat1 * Math.PI) / 180
    const φ2 = (lat2 * Math.PI) / 180
    const Δφ = ((lat2 - lat1) * Math.PI) / 180
    const Δλ = ((lon2 - lon1) * Math.PI) / 180
    
    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    
    return R * c
  }
  
  private simpleHash(str: string): string {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash
    }
    return Math.abs(hash).toString(36)
  }
  
  verifySignalLocation(userId: string, signal: Signal, proof: LocationProof): {
    verified: boolean
    reason: string
    confidence: number
  } {
    if (proof.isVPN) {
      return {
        verified: false,
        reason: 'VPN detected - location cannot be verified',
        confidence: 0
      }
    }
    
    if (proof.isTor) {
      return {
        verified: false,
        reason: 'Tor network detected - location cannot be verified',
        confidence: 0
      }
    }
    
    if (proof.consistencyScore < 50) {
      return {
        verified: false,
        reason: 'Low consistency score - multiple verification failures',
        confidence: proof.consistencyScore
      }
    }
    
    if (proof.trustScore < 40) {
      return {
        verified: false,
        reason: 'Low trust score - suspicious travel pattern or device inconsistency',
        confidence: proof.trustScore
      }
    }
    
    if (!proof.timezoneMatch) {
      return {
        verified: false,
        reason: 'Timezone mismatch - reported location does not match system timezone',
        confidence: 30
      }
    }
    
    const velocity = this.checkVelocityRealistic(
      this.userLocationHistory.get(userId) || [],
      proof
    )
    
    if (!velocity) {
      return {
        verified: false,
        reason: 'Impossible velocity - location changed too quickly',
        confidence: 20
      }
    }
    
    const confidence = (proof.consistencyScore + proof.trustScore) / 2
    
    return {
      verified: true,
      reason: 'Location verified with multiple signals',
      confidence
    }
  }
  
  getUserGeospatialConsistency(userId: string): GeospatialConsistency | null {
    const history = this.userLocationHistory.get(userId)
    if (!history || history.length === 0) return null
    
    const recentProofs = history.slice(-20)
    
    const cellCounts = new Map<string, number>()
    for (const proof of recentProofs) {
      cellCounts.set(proof.h3Cell, (cellCounts.get(proof.h3Cell) || 0) + 1)
    }
    
    const homeCell = Array.from(cellCounts.entries())
      .sort((a, b) => b[1] - a[1])[0]?.[0] || ''
    
    let suspiciousJumps = 0
    for (let i = 1; i < recentProofs.length; i++) {
      const velocity = this.checkVelocityRealistic([recentProofs[i - 1]], recentProofs[i])
      if (!velocity) suspiciousJumps++
    }
    
    const travelPatternNormal = suspiciousJumps < 3
    const velocityRealistic = suspiciousJumps === 0
    
    return {
      userId,
      recentProofs,
      homeCell,
      travelPatternNormal,
      velocityRealistic,
      suspiciousJumps
    }
  }
}

export const antiVPNService = new AntiVPNVerification()
