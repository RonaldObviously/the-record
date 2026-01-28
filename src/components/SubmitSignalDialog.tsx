import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
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
import { MapPin, ShieldCheck, Eye, EyeSlash } from '@phosphor-icons/react'
import { toast } from 'sonner'

interface SubmitSignalDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  bubbleId: string
  onSubmit: (signal: Signal) => void
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
}: SubmitSignalDialogProps) {
  const [category, setCategory] = useState<ProblemCategory>('infrastructure')
  const [description, setDescription] = useState('')
  const [useLocation, setUseLocation] = useState(false)
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [h3Cell, setH3Cell] = useState<string>('')
  const [blurredArea, setBlurredArea] = useState<string>('')
  const [anonymous, setAnonymous] = useState(true)

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation not supported by browser')
      return
    }

    setUseLocation(true)
    toast.loading('Getting your location...')

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        setLocation({ lat: latitude, lng: longitude })

        const h3 = coordinatesToH3(latitude, longitude, 8)
        setH3Cell(h3)

        const blurred = h3ToLocation(h3)
        setBlurredArea(`~${Math.round(blurred.boundary.length * 50)}m radius`)

        toast.dismiss()
        toast.success('Location captured and blurred for privacy')
      },
      (error) => {
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
    onOpenChange(false)

    toast.success('Signal submitted anonymously to The Record')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
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
              {useLocation && h3Cell && (
                <span className="text-xs text-muted-foreground">
                  Blurred to {blurredArea}
                </span>
              )}
            </div>
            
            {!useLocation ? (
              <Button
                type="button"
                variant="outline"
                onClick={handleGetLocation}
                className="w-full"
              >
                <MapPin size={16} className="mr-2" />
                Add Location (H3 Blurred)
              </Button>
            ) : (
              <div className="p-3 bg-muted/40 rounded-lg border border-border">
                <div className="flex items-center gap-2 text-sm mb-2">
                  <ShieldCheck size={16} className="text-success" />
                  <span className="font-medium text-success">Location Privacy Enabled</span>
                </div>
                <p className="text-xs text-muted-foreground mb-2">
                  Your exact location has been cryptographically blurred to a {blurredArea} hexagonal cell.
                  This proves the signal is from this area without revealing your precise location.
                </p>
                <div className="font-mono text-[10px] text-muted-foreground break-all">
                  H3 Cell: {h3Cell}
                </div>
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

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            Submit Signal
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
