import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ContextualHelp, helpContent } from '@/components/ContextualHelp'
import type { Signal, ProblemCategory } from '@/lib/types'
import { coordinatesToH3, h3ToLocation } from '@/lib/h3Service'
import { antiVPNService, type LocationProof } from '@/lib/anti-vpn'
import { LocationVerificationExplainer } from '@/components/LocationVerificationExplainer'
import { MapPin, ShieldCheck, ShieldWarning, Eye, EyeSlash, Info } from '@phosphor-icons/react'
import { toast } from 'sonner'

interface SubmitSignalDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  bubbleId: string
  onSubmit: (signal: Signal) => void
  preselectedH3Cell?: string
}

const CATEGORIES: { value: ProblemCategory; label: string }[] = [
  { value: 'infrastructure', label: 'Infrastructure' },
  { value: 'water', label: 'Water & Sanitation' },
  { value: 'safety', label: 'Public Safety' },
  { value: 'energy', label: 'Energy' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'education', label: 'Education' },
  { value: 'housing', label: 'Housing' },
  { value: 'climate', label: 'Climate' },
  { value: 'economy', label: 'Economy' },
  { value: 'other', label: 'Other' },
]

export function SubmitSignalDialog({
  open,
  onOpenChange,
  bubbleId,
  onSubmit,
  preselectedH3Cell,
}: SubmitSignalDialogProps) {
  const [category, setCategory] = useState<ProblemCategory>('infrastructure')
  const [description, setDescription] = useState('')
  const [useLocation, setUseLocation] = useState(!!preselectedH3Cell)
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [h3Cell, setH3Cell] = useState<string>(preselectedH3Cell || '')
  const [blurredArea, setBlurredArea] = useState<string>(
    preselectedH3Cell ? '~500m radius' : ''
  )
  const [anonymous, setAnonymous] = useState(true)
  const [locationProof, setLocationProof] = useState<LocationProof | null>(null)
  const [showVerificationExplainer, setShowVerificationExplainer] = useState(false)
  const [verifying, setVerifying] = useState(false)

  useEffect(() => {
    if (preselectedH3Cell) {
      setH3Cell(preselectedH3Cell)
      setUseLocation(true)
      setBlurredArea('~500m radius')
    }
  }, [preselectedH3Cell])

  useEffect(() => {
    if (open) {
      setCategory('infrastructure')
      setDescription('')
      if (!preselectedH3Cell) {
        setUseLocation(false)
        setLocation(null)
        setH3Cell('')
        setBlurredArea('')
      }
      setLocationProof(null)
      setVerifying(false)
    }
  }, [open, preselectedH3Cell])

  const handleGetLocation = async () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation not supported by browser')
      return
    }

    setUseLocation(true)
    setVerifying(true)
    toast.loading('Verifying your location...')

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        setLocation({ lat: latitude, lng: longitude })

        const h3 = coordinatesToH3(latitude, longitude, 8)
        setH3Cell(h3)

        const blurred = h3ToLocation(h3)
        setBlurredArea(`~${Math.round(blurred.boundary.length * 50)}m radius`)

        const proof = await antiVPNService.createLocationProof(
          'current-user',
          latitude,
          longitude,
          h3
        )
        
        setLocationProof(proof)
        setVerifying(false)
        toast.dismiss()

        if (proof.isVPN || proof.isTor) {
          toast.error('VPN or Tor detected - cannot verify location')
        } else if (proof.consistencyScore < 50) {
          toast.warning('Location verification weak - signal may have lower trust')
        } else {
          toast.success('Location verified with multi-layer proofs')
        }
      },
      (error) => {
        setVerifying(false)
        toast.dismiss()
        toast.error('Could not get location: ' + error.message)
        setUseLocation(false)
      }
    )
  }

  const handleSubmit = () => {
    if (!description.trim()) {
      toast.error('Please describe the issue')
      return
    }

    if (!category) {
      toast.error('Please select a category')
      return
    }

    if (locationProof && (locationProof.isVPN || locationProof.isTor)) {
      toast.error('Cannot submit - VPN/Tor detected. Please disable and try again.')
      return
    }

    const signal: Signal = {
      id: `signal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      bubbleId,
      h3Cell: h3Cell || `synthetic-${bubbleId}`,
      category,
      description: description.trim(),
      rawText: description.trim(),
      submittedAt: new Date(),
      anonymous,
      status: 'raw',
      attestations: 0,
      influence: 1,
    }

    onSubmit(signal)
    
    setDescription('')
    setCategory('infrastructure')
    setUseLocation(false)
    setLocation(null)
    setH3Cell('')
    setBlurredArea('')
    setLocationProof(null)
    onOpenChange(false)

    toast.success('Signal submitted anonymously to The Record')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Submit Signal
            <ContextualHelp {...helpContent.signals} />
          </DialogTitle>
          <DialogDescription>
            Report an issue or observation in this area. Your submission is anonymous and uses H3
            geospatial blurring to protect your privacy.
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="flex-1 pr-4">
          <div className="bg-accent/10 border border-accent/30 p-3 rounded-lg mb-4">
            <p className="text-xs text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Why anonymous?</strong> Private input prevents
              groupthink, social pressure, and retaliation. Your signal will be clustered with others
              to form collective truth without revealing individual identities.
            </p>
          </div>

          <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={(v) => setCategory(v as ProblemCategory)}>
              <SelectTrigger id="category">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe what you observed..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              Be specific and factual. Avoid personal opinions.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Location Privacy</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowVerificationExplainer(true)}
                className="gap-1 h-auto py-1"
              >
                <Info size={14} />
                <span className="text-xs">Why verify?</span>
              </Button>
            </div>
            
            {!useLocation ? (
              <Button
                type="button"
                variant="outline"
                onClick={handleGetLocation}
                className="w-full"
                disabled={verifying}
              >
                <MapPin size={16} className="mr-2" />
                {verifying ? 'Verifying Location...' : 'Add Location (H3 Blurred)'}
              </Button>
            ) : (
              <div className="space-y-2">
                <div className="p-3 bg-muted/40 rounded-lg border border-border">
                  <div className="flex items-center gap-2 text-sm mb-2">
                    {locationProof ? (
                      locationProof.isVPN || locationProof.isTor ? (
                        <ShieldWarning size={16} className="text-destructive" />
                      ) : (
                        <ShieldCheck size={16} className="text-success" />
                      )
                    ) : (
                      <ShieldCheck size={16} className="text-success" />
                    )}
                    <span className={`font-medium ${
                      locationProof?.isVPN || locationProof?.isTor
                        ? 'text-destructive'
                        : 'text-success'
                    }`}>
                      {preselectedH3Cell
                        ? 'Mesh Cell Selected from Map'
                        : locationProof?.isVPN || locationProof?.isTor
                        ? 'VPN/Tor Detected'
                        : 'Location Verified'}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">
                    {preselectedH3Cell
                      ? 'You selected this mesh cell from the satellite map. Your signal will be associated with this hexagonal area.'
                      : locationProof?.isVPN || locationProof?.isTor
                      ? 'Please disable VPN/Tor and try again. THE RECORD requires verified locations to prevent manipulation.'
                      : `Your exact location has been cryptographically blurred to a ${blurredArea} hexagonal cell. This proves the signal is from this area without revealing your precise location.`}
                  </p>
                  <div className="font-mono text-[10px] text-muted-foreground break-all">
                    H3 Cell: {h3Cell}
                  </div>
                </div>

                {locationProof && (
                  <div className="p-2 bg-muted/20 rounded border border-border/50 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Consistency Score</span>
                      <span className={`font-semibold ${
                        locationProof.consistencyScore >= 70 ? 'text-success' :
                        locationProof.consistencyScore >= 50 ? 'text-accent' :
                        'text-destructive'
                      }`}>
                        {locationProof.consistencyScore}/100
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Trust Score</span>
                      <span className={`font-semibold ${
                        locationProof.trustScore >= 70 ? 'text-success' :
                        locationProof.trustScore >= 50 ? 'text-accent' :
                        'text-destructive'
                      }`}>
                        {locationProof.trustScore}/100
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {locationProof.timezoneMatch && (
                        <span className="text-[10px] px-1.5 py-0.5 bg-success/20 text-success rounded">
                          Timezone ✓
                        </span>
                      )}
                      {!locationProof.isVPN && (
                        <span className="text-[10px] px-1.5 py-0.5 bg-success/20 text-success rounded">
                          No VPN ✓
                        </span>
                      )}
                      {locationProof.isVPN && (
                        <span className="text-[10px] px-1.5 py-0.5 bg-destructive/20 text-destructive rounded">
                          VPN ✗
                        </span>
                      )}
                      {locationProof.isTor && (
                        <span className="text-[10px] px-1.5 py-0.5 bg-destructive/20 text-destructive rounded">
                          Tor ✗
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Anonymity</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setAnonymous(!anonymous)}
                className="gap-2"
              >
                {anonymous ? (
                  <>
                    <EyeSlash size={16} />
                    Anonymous
                  </>
                ) : (
                  <>
                    <Eye size={16} />
                    Attributed
                  </>
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              {anonymous
                ? 'Your signal is submitted anonymously. No one can trace it back to you.'
                : 'Your account will be publicly linked to this signal. This increases trust but reduces privacy.'}
            </p>
          </div>
        </div>
        </ScrollArea>

        <DialogFooter className="flex-shrink-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={locationProof?.isVPN || locationProof?.isTor}
          >
            Submit Signal
          </Button>
        </DialogFooter>
      </DialogContent>

      <LocationVerificationExplainer
        open={showVerificationExplainer}
        onOpenChange={setShowVerificationExplainer}
        currentProof={locationProof || undefined}
      />
    </Dialog>
  )
}
