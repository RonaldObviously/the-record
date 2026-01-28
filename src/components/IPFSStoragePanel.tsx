import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  HardDrive,
  Cloud,
  Database,
  Upload,
  Download,
  PushPin,
  X,
  Copy,
  CheckCircle,
  XCircle,
  Info,
} from '@phosphor-icons/react'
import { useIPFSStorage } from '@/hooks/use-ipfs-storage'
import { toast } from 'sonner'

interface IPFSStoragePanelProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onBackupCreated?: (cid: string) => void
  onBackupRestored?: (data: any) => void
}

export function IPFSStoragePanel({
  open,
  onOpenChange,
  onBackupCreated,
  onBackupRestored,
}: IPFSStoragePanelProps) {
  const ipfs = useIPFSStorage()
  const [pinnedList, setPinnedList] = useState<string[]>([])
  const [restoreCID, setRestoreCID] = useState('')
  const [showPinnedList, setShowPinnedList] = useState(false)

  const handleInitialize = async () => {
    await ipfs.initialize()
    await ipfs.refreshStats()
  }

  const handleShutdown = async () => {
    await ipfs.shutdown()
  }

  const handleLoadPinnedList = async () => {
    const list = await ipfs.listPinned()
    setPinnedList(list)
    setShowPinnedList(true)
  }

  const handleCopyCID = (cid: string) => {
    navigator.clipboard.writeText(cid)
    toast.success('CID copied to clipboard')
  }

  const handleUnpin = async (cid: string) => {
    const success = await ipfs.unpin(cid)
    if (success) {
      setPinnedList((prev) => prev.filter((c) => c !== cid))
    }
  }

  const handleRestoreBackup = async () => {
    if (!restoreCID.trim()) {
      toast.error('Please enter a valid CID')
      return
    }

    const backup = await ipfs.restoreBackup(restoreCID)
    if (backup && onBackupRestored) {
      onBackupRestored(backup)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col p-0 gap-0">
        <div className="px-6 pt-6 pb-4 shrink-0">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Cloud size={24} className="text-primary" />
              IPFS Decentralized Storage
            </DialogTitle>
            <DialogDescription>
              Store signals, problems, and proposals on a decentralized peer-to-peer network
            </DialogDescription>
          </DialogHeader>
        </div>

        <ScrollArea className="flex-1 px-6">
          <div className="space-y-6 pb-4 pr-4">
            <Card className="p-4 border-primary/20">
              <div className="flex items-start gap-3">
                <Info size={20} className="text-primary mt-0.5 flex-shrink-0" />
                <div className="text-sm space-y-1">
                  <p className="font-medium text-foreground">Why IPFS?</p>
                  <p className="text-muted-foreground">
                    IPFS (InterPlanetary File System) ensures your data cannot be censored,
                    deleted, or controlled by any single party. Content is addressed by its hash,
                    making it tamper-proof and verifiable.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Node Status</h3>
                  {ipfs.state.initialized ? (
                    <Badge variant="default" className="bg-success text-success-foreground">
                      <CheckCircle size={14} className="mr-1" />
                      Online
                    </Badge>
                  ) : (
                    <Badge variant="secondary">
                      <XCircle size={14} className="mr-1" />
                      Offline
                    </Badge>
                  )}
                </div>

                <Separator />

                {ipfs.state.initialized ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Peer ID</p>
                        <div className="flex items-center gap-2 mt-1">
                          <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
                            {ipfs.state.peerId?.slice(0, 20)}...
                          </code>
                          {ipfs.state.peerId && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleCopyCID(ipfs.state.peerId!)}
                            >
                              <Copy size={14} />
                            </Button>
                          )}
                        </div>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Pinned Content</p>
                        <p className="text-2xl font-semibold mt-1">
                          {ipfs.state.pinnedCount}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={ipfs.refreshStats}
                      >
                        Refresh Stats
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleLoadPinnedList}
                      >
                        <PushPin size={16} className="mr-1.5" />
                        View Pinned
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={handleShutdown}
                      >
                        Shutdown Node
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <Button onClick={handleInitialize}>
                      <HardDrive size={16} className="mr-1.5" />
                      Initialize IPFS Node
                    </Button>
                    <p className="text-xs text-muted-foreground mt-2">
                      This will start a local IPFS node in your browser
                    </p>
                  </div>
                )}
              </div>
            </Card>

            <Card className="p-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Auto-Backup</h3>
                  <Switch
                    checked={ipfs.autoBackupEnabled}
                    onCheckedChange={ipfs.setAutoBackupEnabled}
                    disabled={!ipfs.state.initialized}
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Automatically create periodic backups of all signals, problems, and proposals
                  to IPFS every 5 minutes
                </p>
              </div>
            </Card>

            <Card className="p-4">
              <div className="space-y-4">
                <h3 className="font-semibold">Restore from Backup</h3>
                <div className="space-y-2">
                  <Label htmlFor="restore-cid">Backup CID</Label>
                  <div className="flex gap-2">
                    <Input
                      id="restore-cid"
                      placeholder="bafybeig..."
                      value={restoreCID}
                      onChange={(e) => setRestoreCID(e.target.value)}
                      disabled={!ipfs.state.initialized}
                      className="font-mono text-sm"
                    />
                    <Button
                      onClick={handleRestoreBackup}
                      disabled={!ipfs.state.initialized || !restoreCID.trim()}
                    >
                      <Download size={16} className="mr-1.5" />
                      Restore
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Enter the CID of a previous backup to restore your data
                  </p>
                </div>
              </div>
            </Card>

            {showPinnedList && pinnedList.length > 0 && (
              <Card className="p-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Pinned Content ({pinnedList.length})</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowPinnedList(false)}
                    >
                      <X size={16} />
                    </Button>
                  </div>
                  <Separator />
                  <ScrollArea className="h-[200px]">
                    <div className="space-y-2">
                      {pinnedList.map((cid) => (
                        <div
                          key={cid}
                          className="flex items-center justify-between p-2 bg-muted rounded text-sm"
                        >
                          <code className="font-mono text-xs flex-1 truncate">
                            {cid}
                          </code>
                          <div className="flex gap-1 ml-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleCopyCID(cid)}
                            >
                              <Copy size={14} />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleUnpin(cid)}
                            >
                              <X size={14} />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </Card>
            )}

            <Card className="p-4 bg-muted/50">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Database size={18} className="text-muted-foreground" />
                  <h4 className="font-medium text-sm">How IPFS Storage Works</h4>
                </div>
                <ul className="text-xs text-muted-foreground space-y-2 ml-6 list-disc">
                  <li>Data is content-addressed by cryptographic hash (CID)</li>
                  <li>Files are chunked and distributed across peer network</li>
                  <li>Pinning ensures content remains available</li>
                  <li>No central server can delete or censor your data</li>
                  <li>Anyone with the CID can verify content authenticity</li>
                </ul>
              </div>
            </Card>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
