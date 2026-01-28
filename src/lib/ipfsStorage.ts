import { createHelia } from 'helia'
import { unixfs } from '@helia/unixfs'
import { strings } from '@helia/strings'
import type { Helia } from '@helia/interface'
import type { UnixFS } from '@helia/unixfs'
import type { Strings } from '@helia/strings'
import type { Signal, Problem, Proposal, BlackBoxEvent } from './types'

let heliaInstance: Helia | null = null
let unixfsInstance: UnixFS | null = null
let stringsInstance: Strings | null = null
let initializationPromise: Promise<void> | null = null

export interface IPFSStorageMetadata {
  cid: string
  timestamp: number
  dataType: 'signal' | 'problem' | 'proposal' | 'blackbox' | 'batch'
  hash: string
  size: number
}

export interface IPFSStoredSignal extends Signal {
  ipfsCID?: string
  ipfsTimestamp?: number
}

export interface IPFSStoredProblem extends Problem {
  ipfsCID?: string
  ipfsTimestamp?: number
}

export interface IPFSStoredProposal extends Proposal {
  ipfsCID?: string
  ipfsTimestamp?: number
}

export interface IPFSBatchUpload {
  signals: Signal[]
  problems: Problem[]
  proposals: Proposal[]
  blackBoxEvents: BlackBoxEvent[]
  timestamp: number
  batchHash: string
}

export async function initializeIPFS(): Promise<void> {
  if (initializationPromise) {
    return initializationPromise
  }

  initializationPromise = (async () => {
    try {
      if (!heliaInstance) {
        console.log('🌐 Initializing IPFS (Helia) node...')
        heliaInstance = await createHelia()
        unixfsInstance = unixfs(heliaInstance)
        stringsInstance = strings(heliaInstance)
        console.log('✅ IPFS node initialized')
      }
    } catch (error) {
      console.error('❌ IPFS initialization failed:', error)
      throw error
    }
  })()

  return initializationPromise
}

export async function getIPFSInstance(): Promise<{
  helia: Helia
  unixfs: UnixFS
  strings: Strings
}> {
  await initializeIPFS()
  
  if (!heliaInstance || !unixfsInstance || !stringsInstance) {
    throw new Error('IPFS not initialized')
  }

  return {
    helia: heliaInstance,
    unixfs: unixfsInstance,
    strings: stringsInstance,
  }
}

export async function shutdownIPFS(): Promise<void> {
  if (heliaInstance) {
    console.log('🛑 Shutting down IPFS node...')
    await heliaInstance.stop()
    heliaInstance = null
    unixfsInstance = null
    stringsInstance = null
    initializationPromise = null
    console.log('✅ IPFS node stopped')
  }
}

function createDataHash(data: any): string {
  const dataString = JSON.stringify(data)
  const encoder = new TextEncoder()
  const dataBuffer = encoder.encode(dataString)
  return Array.from(dataBuffer)
    .reduce((hash, byte) => ((hash << 5) - hash + byte) | 0, 0)
    .toString(16)
}

export async function storeSignalToIPFS(signal: Signal): Promise<IPFSStorageMetadata> {
  try {
    const { strings } = await getIPFSInstance()
    
    const signalData = {
      ...signal,
      storedAt: new Date().toISOString(),
      storageType: 'ipfs-decentralized',
    }
    
    const jsonString = JSON.stringify(signalData, null, 2)
    const cid = await strings.add(jsonString)
    
    const metadata: IPFSStorageMetadata = {
      cid: cid.toString(),
      timestamp: Date.now(),
      dataType: 'signal',
      hash: createDataHash(signalData),
      size: new Blob([jsonString]).size,
    }
    
    console.log(`📦 Signal stored to IPFS: ${metadata.cid}`)
    return metadata
  } catch (error) {
    console.error('Failed to store signal to IPFS:', error)
    throw error
  }
}

export async function storeProblemToIPFS(problem: Problem): Promise<IPFSStorageMetadata> {
  try {
    const { strings } = await getIPFSInstance()
    
    const problemData = {
      ...problem,
      storedAt: new Date().toISOString(),
      storageType: 'ipfs-decentralized',
    }
    
    const jsonString = JSON.stringify(problemData, null, 2)
    const cid = await strings.add(jsonString)
    
    const metadata: IPFSStorageMetadata = {
      cid: cid.toString(),
      timestamp: Date.now(),
      dataType: 'problem',
      hash: createDataHash(problemData),
      size: new Blob([jsonString]).size,
    }
    
    console.log(`📦 Problem stored to IPFS: ${metadata.cid}`)
    return metadata
  } catch (error) {
    console.error('Failed to store problem to IPFS:', error)
    throw error
  }
}

export async function storeProposalToIPFS(proposal: Proposal): Promise<IPFSStorageMetadata> {
  try {
    const { strings } = await getIPFSInstance()
    
    const proposalData = {
      ...proposal,
      storedAt: new Date().toISOString(),
      storageType: 'ipfs-decentralized',
    }
    
    const jsonString = JSON.stringify(proposalData, null, 2)
    const cid = await strings.add(jsonString)
    
    const metadata: IPFSStorageMetadata = {
      cid: cid.toString(),
      timestamp: Date.now(),
      dataType: 'proposal',
      hash: createDataHash(proposalData),
      size: new Blob([jsonString]).size,
    }
    
    console.log(`📦 Proposal stored to IPFS: ${metadata.cid}`)
    return metadata
  } catch (error) {
    console.error('Failed to store proposal to IPFS:', error)
    throw error
  }
}

export async function storeBlackBoxEventToIPFS(event: BlackBoxEvent): Promise<IPFSStorageMetadata> {
  try {
    const { strings } = await getIPFSInstance()
    
    const eventData = {
      ...event,
      storedAt: new Date().toISOString(),
      storageType: 'ipfs-decentralized',
    }
    
    const jsonString = JSON.stringify(eventData, null, 2)
    const cid = await strings.add(jsonString)
    
    const metadata: IPFSStorageMetadata = {
      cid: cid.toString(),
      timestamp: Date.now(),
      dataType: 'blackbox',
      hash: createDataHash(eventData),
      size: new Blob([jsonString]).size,
    }
    
    console.log(`📦 BlackBox event stored to IPFS: ${metadata.cid}`)
    return metadata
  } catch (error) {
    console.error('Failed to store blackbox event to IPFS:', error)
    throw error
  }
}

export async function storeBatchToIPFS(batch: IPFSBatchUpload): Promise<IPFSStorageMetadata> {
  try {
    const { strings } = await getIPFSInstance()
    
    const batchData = {
      ...batch,
      storedAt: new Date().toISOString(),
      storageType: 'ipfs-decentralized-batch',
    }
    
    const jsonString = JSON.stringify(batchData, null, 2)
    const cid = await strings.add(jsonString)
    
    const metadata: IPFSStorageMetadata = {
      cid: cid.toString(),
      timestamp: Date.now(),
      dataType: 'batch',
      hash: createDataHash(batchData),
      size: new Blob([jsonString]).size,
    }
    
    console.log(`📦 Batch stored to IPFS: ${metadata.cid} (${batch.signals.length} signals, ${batch.problems.length} problems, ${batch.proposals.length} proposals)`)
    return metadata
  } catch (error) {
    console.error('Failed to store batch to IPFS:', error)
    throw error
  }
}

export async function retrieveFromIPFS<T = any>(cid: string): Promise<T> {
  try {
    const { strings } = await getIPFSInstance()
    
    console.log(`📥 Retrieving from IPFS: ${cid}`)
    const jsonString = await strings.get(cid as any)
    const data = JSON.parse(jsonString)
    
    console.log(`✅ Retrieved from IPFS: ${cid}`)
    return data as T
  } catch (error) {
    console.error(`Failed to retrieve from IPFS (${cid}):`, error)
    throw error
  }
}

export async function verifyIPFSContent(cid: string, expectedHash: string): Promise<boolean> {
  try {
    const data = await retrieveFromIPFS(cid)
    const actualHash = createDataHash(data)
    return actualHash === expectedHash
  } catch (error) {
    console.error(`Failed to verify IPFS content (${cid}):`, error)
    return false
  }
}

export async function pinContent(cid: string): Promise<void> {
  try {
    const { helia } = await getIPFSInstance()
    await helia.pins.add(cid as any)
    console.log(`📌 Pinned content: ${cid}`)
  } catch (error) {
    console.error(`Failed to pin content (${cid}):`, error)
    throw error
  }
}

export async function unpinContent(cid: string): Promise<void> {
  try {
    const { helia } = await getIPFSInstance()
    await helia.pins.rm(cid as any)
    console.log(`📌 Unpinned content: ${cid}`)
  } catch (error) {
    console.error(`Failed to unpin content (${cid}):`, error)
    throw error
  }
}

export async function listPinnedContent(): Promise<string[]> {
  try {
    const { helia } = await getIPFSInstance()
    const pins: string[] = []
    
    for await (const cid of helia.pins.ls()) {
      pins.push(cid.toString())
    }
    
    return pins
  } catch (error) {
    console.error('Failed to list pinned content:', error)
    return []
  }
}

export async function getIPFSStats(): Promise<{
  initialized: boolean
  peerId?: string
  pinnedCount: number
  online: boolean
}> {
  try {
    if (!heliaInstance) {
      return {
        initialized: false,
        pinnedCount: 0,
        online: false,
      }
    }

    const pinnedContent = await listPinnedContent()
    
    return {
      initialized: true,
      peerId: heliaInstance.libp2p.peerId.toString(),
      pinnedCount: pinnedContent.length,
      online: true,
    }
  } catch (error) {
    console.error('Failed to get IPFS stats:', error)
    return {
      initialized: false,
      pinnedCount: 0,
      online: false,
    }
  }
}

export async function createPeriodicBackup(
  signals: Signal[],
  problems: Problem[],
  proposals: Proposal[],
  blackBoxEvents: BlackBoxEvent[]
): Promise<IPFSStorageMetadata> {
  const batch: IPFSBatchUpload = {
    signals,
    problems,
    proposals,
    blackBoxEvents,
    timestamp: Date.now(),
    batchHash: createDataHash({ signals, problems, proposals, blackBoxEvents }),
  }
  
  return await storeBatchToIPFS(batch)
}

export async function restoreFromBackup(cid: string): Promise<IPFSBatchUpload> {
  return await retrieveFromIPFS<IPFSBatchUpload>(cid)
}
