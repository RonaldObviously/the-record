import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ShieldCheck, ShieldWarning, MapPin, DeviceMobile, Globe, Clock, WifiHigh, CellSignalFull } from '@phosphor-icons/react'
import type { LocationProof } from '@/lib/anti-vpn'

interface LocationVerificationExplainerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentProof?: LocationProof
}

export function LocationVerificationExplainer({ open, onOpenChange, currentProof }: LocationVerificationExplainerProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl h-[90vh] p-0 gap-0 flex flex-col overflow-hidden">
        <div className="px-6 pt-6 pb-4 shrink-0">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShieldCheck size={24} className="text-accent" />
              Why THE RECORD Verifies Your Location
            </DialogTitle>
            <DialogDescription>
              Understanding our multi-layer anti-manipulation system
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pr-4 pb-6">
        <div className="space-y-6">
          <Card className="p-4 bg-muted/30">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Globe size={20} />
              The Problem We're Solving
            </h3>
            <p className="text-sm text-muted-foreground">
              Without location verification, bad actors could use VPNs to:
            </p>
            <ul className="text-sm text-muted-foreground mt-2 space-y-1 ml-4 list-disc">
              <li>Submit fake problems from neighborhoods they don't live in</li>
              <li>Create multiple accounts appearing to be from different locations</li>
              <li>Manipulate voting patterns by pretending to be local residents</li>
              <li>Overwhelm real signals with coordinated spam attacks</li>
            </ul>
          </Card>

          <div>
            <h3 className="font-semibold mb-3">How We Verify Your Location (Multi-Layer)</h3>
            <div className="space-y-3">
              <Card className="p-3">
                <div className="flex items-start gap-3">
                  <MapPin size={20} className="text-primary mt-1" />
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">1. GPS + H3 Geohashing</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Your device's GPS is converted to an H3 cell (500m radius). We never store your exact location—only the general area.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-3">
                <div className="flex items-start gap-3">
                  <Globe size={20} className="text-primary mt-1" />
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">2. IP Address Analysis</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      We check if your IP comes from a VPN, proxy, Tor, or datacenter. Residential IPs get higher trust scores.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-3">
                <div className="flex items-start gap-3">
                  <Clock size={20} className="text-primary mt-1" />
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">3. Timezone Verification</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Your system timezone must match your reported location. A user in New York can't have a timezone set to Tokyo.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-3">
                <div className="flex items-start gap-3">
                  <DeviceMobile size={20} className="text-primary mt-1" />
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">4. Device Fingerprinting</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      We create a unique fingerprint of your device (screen size, browser, hardware). Consistent devices get higher trust.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-3">
                <div className="flex items-start gap-3">
                  <WifiHigh size={20} className="text-primary mt-1" />
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">5. Network Signal Analysis (Optional)</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      WiFi networks, cell towers, and Bluetooth beacons near you provide additional proof you're actually there.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-3">
                <div className="flex items-start gap-3">
                  <CellSignalFull size={20} className="text-primary mt-1" />
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">6. Velocity & Pattern Checking</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      You can't teleport. If you submitted a signal in New York 5 minutes ago, you can't submit from London now.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {currentProof && (
            <Card className="p-4 border-2 border-accent/20">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <ShieldCheck size={20} className="text-accent" />
                Your Current Verification Status
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-muted-foreground">Consistency Score</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 bg-muted h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-accent h-full transition-all"
                        style={{ width: `${currentProof.consistencyScore}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold">{currentProof.consistencyScore}</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Trust Score</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 bg-muted h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-success h-full transition-all"
                        style={{ width: `${currentProof.trustScore}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold">{currentProof.trustScore}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {currentProof.isVPN && (
                  <Badge variant="destructive" className="gap-1">
                    <ShieldWarning size={14} />
                    VPN Detected
                  </Badge>
                )}
                {currentProof.isTor && (
                  <Badge variant="destructive" className="gap-1">
                    <ShieldWarning size={14} />
                    Tor Network
                  </Badge>
                )}
                {currentProof.timezoneMatch && (
                  <Badge variant="default" className="gap-1 bg-success">
                    <ShieldCheck size={14} />
                    Timezone Match
                  </Badge>
                )}
                {currentProof.wifiNetworks && currentProof.wifiNetworks.length > 0 && (
                  <Badge variant="default" className="gap-1 bg-success">
                    <WifiHigh size={14} />
                    WiFi Verified ({currentProof.wifiNetworks.length})
                  </Badge>
                )}
              </div>

              {(currentProof.isVPN || currentProof.isTor) && (
                <div className="mt-4 p-3 bg-destructive/10 rounded-md border border-destructive/20">
                  <p className="text-sm font-medium text-destructive">⚠️ Location Cannot Be Verified</p>
                  <p className="text-xs text-destructive/80 mt-1">
                    Please disable your VPN/Tor and try again. THE RECORD requires honest location data to function.
                  </p>
                </div>
              )}
            </Card>
          )}

          <Card className="p-4 bg-accent/5 border-accent/20">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <ShieldCheck size={20} className="text-accent" />
              Privacy Guarantee
            </h3>
            <p className="text-sm text-muted-foreground">
              Even with all these checks, we NEVER know your exact address. We only verify you're in the general area (H3 cell) you claim to be in. 
              Your GPS coordinates are hashed immediately and never stored.
            </p>
          </Card>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
