import { useState, useEffect, useCallback } from 'react'
import {
  initializeIPFS,
  shutdownIPFS,
  storeSignalToIPFS,
  storeProblemToIPFS,
  storeProposalToIPFS,
  storeBlackBoxEventToIPFS,
  storeBatchToIPFS,
  retrieveFromIPFS,
  pinContent,
  unpinContent,
  listPinnedContent,
  getIPFSStats,
  createPeriodicBackup,
  restoreFromBackup,
  type IPFSStorageMetadata,
  type IPFSBatchUpload,
} from '@/lib/ipfsStorage'
import type { Signal, Problem, Proposal, BlackBoxEvent } from '@/lib/types'
import { toast } from 'sonner'

export interface IPFSStorageState {
  initialized: boolean
  peerId: string | null
  pinnedCount: number
  online: boolean
  error: string | null
}

export function useIPFSStorage() {
  const [state, setState] = useState<IPFSStorageState>({
    initialized: false,
    peerId: null,
    pinnedCount: 0,
    online: false,
    error: null,
  })

  const [autoBackupEnabled, setAutoBackupEnabled] = useState(false)

  const initialize = useCallback(async () => {
    try {
      await initializeIPFS()
      const stats = await getIPFSStats()
      setState({
        initialized: stats.initialized,
        peerId: stats.peerId || null,
        pinnedCount: stats.pinnedCount,
        online: stats.online,
        error: null,
      })
      toast.success('IPFS storage initialized')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      setState((prev) => ({
        ...prev,
        error: errorMessage,
      }))
      toast.error(`IPFS initialization failed: ${errorMessage}`)
    }
  }, [])

  const shutdown = useCallback(async () => {
    try {
      await shutdownIPFS()
      setState({
        initialized: false,
        peerId: null,
        pinnedCount: 0,
        online: false,
        error: null,
      })
      toast.info('IPFS storage shut down')
    } catch (error) {
      toast.error('Failed to shut down IPFS')
    }
  }, [])

  const storeSignal = useCallback(async (signal: Signal): Promise<IPFSStorageMetadata | null> => {
    try {
      const metadata = await storeSignalToIPFS(signal)
      await pinContent(metadata.cid)
      setState((prev) => ({
        ...prev,
        pinnedCount: prev.pinnedCount + 1,
      }))
      return metadata
    } catch (error) {
      console.error('Failed to store signal to IPFS:', error)
      return null
    }
  }, [])

  const storeProblem = useCallback(async (problem: Problem): Promise<IPFSStorageMetadata | null> => {
    try {
      const metadata = await storeProblemToIPFS(problem)
      await pinContent(metadata.cid)
      setState((prev) => ({
        ...prev,
        pinnedCount: prev.pinnedCount + 1,
      }))
      return metadata
    } catch (error) {
      console.error('Failed to store problem to IPFS:', error)
      return null
    }
  }, [])

  const storeProposal = useCallback(async (proposal: Proposal): Promise<IPFSStorageMetadata | null> => {
    try {
      const metadata = await storeProposalToIPFS(proposal)
      await pinContent(metadata.cid)
      setState((prev) => ({
        ...prev,
        pinnedCount: prev.pinnedCount + 1,
      }))
      return metadata
    } catch (error) {
      console.error('Failed to store proposal to IPFS:', error)
      return null
    }
  }, [])

  const storeBlackBoxEvent = useCallback(async (event: BlackBoxEvent): Promise<IPFSStorageMetadata | null> => {
    try {
      const metadata = await storeBlackBoxEventToIPFS(event)
      await pinContent(metadata.cid)
      setState((prev) => ({
        ...prev,
        pinnedCount: prev.pinnedCount + 1,
      }))
      return metadata
    } catch (error) {
      console.error('Failed to store blackbox event to IPFS:', error)
      return null
    }
  }, [])

  const storeBatch = useCallback(async (
    signals: Signal[],
    problems: Problem[],
    proposals: Proposal[],
    blackBoxEvents: BlackBoxEvent[]
  ): Promise<IPFSStorageMetadata | null> => {
    try {
      toast.loading('Creating IPFS backup...', { id: 'ipfs-backup' })
      const metadata = await createPeriodicBackup(signals, problems, proposals, blackBoxEvents)
      await pinContent(metadata.cid)
      
      setState((prev) => ({
        ...prev,
        pinnedCount: prev.pinnedCount + 1,
      }))
      
      toast.success(`Backup created: ${metadata.cid}`, { id: 'ipfs-backup' })
      return metadata
    } catch (error) {
      toast.error('Failed to create backup', { id: 'ipfs-backup' })
      console.error('Failed to store batch to IPFS:', error)
      return null
    }
  }, [])

  const retrieve = useCallback(async <T = any>(cid: string): Promise<T | null> => {
    try {
      return await retrieveFromIPFS<T>(cid)
    } catch (error) {
      console.error('Failed to retrieve from IPFS:', error)
      return null
    }
  }, [])

  const pin = useCallback(async (cid: string): Promise<boolean> => {
    try {
      await pinContent(cid)
      setState((prev) => ({
        ...prev,
        pinnedCount: prev.pinnedCount + 1,
      }))
      toast.success(`Pinned: ${cid.slice(0, 12)}...`)
      return true
    } catch (error) {
      toast.error('Failed to pin content')
      return false
    }
  }, [])

  const unpin = useCallback(async (cid: string): Promise<boolean> => {
    try {
      await unpinContent(cid)
      setState((prev) => ({
        ...prev,
        pinnedCount: Math.max(0, prev.pinnedCount - 1),
      }))
      toast.success(`Unpinned: ${cid.slice(0, 12)}...`)
      return true
    } catch (error) {
      toast.error('Failed to unpin content')
      return false
    }
  }, [])

  const listPinned = useCallback(async (): Promise<string[]> => {
    try {
      return await listPinnedContent()
    } catch (error) {
      console.error('Failed to list pinned content:', error)
      return []
    }
  }, [])

  const refreshStats = useCallback(async () => {
    try {
      const stats = await getIPFSStats()
      setState({
        initialized: stats.initialized,
        peerId: stats.peerId || null,
        pinnedCount: stats.pinnedCount,
        online: stats.online,
        error: null,
      })
    } catch (error) {
      console.error('Failed to refresh IPFS stats:', error)
    }
  }, [])

  const restoreBackup = useCallback(async (cid: string): Promise<IPFSBatchUpload | null> => {
    try {
      toast.loading('Restoring from IPFS backup...', { id: 'ipfs-restore' })
      const backup = await restoreFromBackup(cid)
      toast.success(`Restored ${backup.signals.length} signals, ${backup.problems.length} problems`, { id: 'ipfs-restore' })
      return backup
    } catch (error) {
      toast.error('Failed to restore backup', { id: 'ipfs-restore' })
      console.error('Failed to restore from IPFS:', error)
      return null
    }
  }, [])

  useEffect(() => {
    if (autoBackupEnabled && state.initialized) {
      const interval = setInterval(async () => {
        console.log('🔄 Auto-backup check (IPFS)')
      }, 5 * 60 * 1000)

      return () => clearInterval(interval)
    }
  }, [autoBackupEnabled, state.initialized])

  useEffect(() => {
    return () => {
      shutdownIPFS().catch(console.error)
    }
  }, [])

  return {
    state,
    initialize,
    shutdown,
    storeSignal,
    storeProblem,
    storeProposal,
    storeBlackBoxEvent,
    storeBatch,
    retrieve,
    pin,
    unpin,
    listPinned,
    refreshStats,
    restoreBackup,
    autoBackupEnabled,
    setAutoBackupEnabled,
  }
}
