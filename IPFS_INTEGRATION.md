# IPFS Integration for The Record

## Overview

The Record now includes full IPFS (InterPlanetary File System) integration for **decentralized, censorship-resistant storage** of all signals, problems, proposals, and black box events.

## Why IPFS?

### The Problem with Centralized Storage
- **Single Point of Failure**: If the hosting server goes down, all data is lost
- **Censorship Risk**: A single entity can delete or modify records
- **Capture Vulnerability**: Authorities can seize servers and destroy evidence
- **Trust Dependency**: Users must trust the host won't tamper with data

### How IPFS Solves This
- **Content Addressing**: Data is identified by its cryptographic hash (CID), not location
- **Peer-to-Peer Network**: Files are distributed across many nodes
- **Tamper-Proof**: Any modification changes the CID, making tampering obvious
- **Permissionless**: No single entity controls the network
- **Verifiable**: Anyone can verify data authenticity using the CID

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                   THE RECORD DATA FLOW                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. USER SUBMITS SIGNAL                                    │
│     ├─ Stored locally (Spark KV storage)                  │
│     └─ Uploaded to IPFS node                              │
│                                                             │
│  2. IPFS NODE PROCESSES DATA                               │
│     ├─ Content is chunked and hashed                       │
│     ├─ Unique CID is generated                            │
│     ├─ Data is added to local IPFS storage                │
│     └─ CID is returned to app                             │
│                                                             │
│  3. CONTENT IS PINNED                                      │
│     ├─ Pinning prevents garbage collection                │
│     ├─ Ensures content remains available                  │
│     └─ Can be pinned by multiple nodes                    │
│                                                             │
│  4. NETWORK PROPAGATION                                    │
│     ├─ Content is announced to IPFS network               │
│     ├─ Other nodes can discover and retrieve it           │
│     └─ Redundancy increases over time                     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Implementation

### Core Technology: Helia

We use **Helia**, the modern browser-compatible IPFS implementation that runs entirely in the browser without requiring a separate daemon.

```typescript
import { createHelia } from 'helia'
import { unixfs } from '@helia/unixfs'
import { strings } from '@helia/strings'
```

### Storage Service (`src/lib/ipfsStorage.ts`)

The IPFS storage service provides:

1. **Node Management**
   - `initializeIPFS()`: Start the IPFS node
   - `shutdownIPFS()`: Stop the node
   - `getIPFSStats()`: Get node status and metrics

2. **Content Storage**
   - `storeSignalToIPFS(signal)`: Store a signal
   - `storeProblemToIPFS(problem)`: Store a problem
   - `storeProposalToIPFS(proposal)`: Store a proposal
   - `storeBlackBoxEventToIPFS(event)`: Store a black box event
   - `storeBatchToIPFS(batch)`: Store a complete backup

3. **Content Retrieval**
   - `retrieveFromIPFS<T>(cid)`: Retrieve content by CID
   - `verifyIPFSContent(cid, hash)`: Verify content integrity

4. **Pin Management**
   - `pinContent(cid)`: Pin content to prevent deletion
   - `unpinContent(cid)`: Unpin content
   - `listPinnedContent()`: List all pinned CIDs

### React Hook (`src/hooks/use-ipfs-storage.ts`)

The `useIPFSStorage` hook provides a React-friendly API:

```typescript
const ipfs = useIPFSStorage()

// Initialize IPFS
await ipfs.initialize()

// Store a signal
const metadata = await ipfs.storeSignal(signal)
console.log(`Stored at: ${metadata.cid}`)

// Create a backup
await ipfs.storeBatch(signals, problems, proposals, blackBoxEvents)

// Restore from backup
const backup = await ipfs.restoreBackup(cid)
```

### UI Component (`src/components/IPFSStoragePanel.tsx`)

The IPFS Storage Panel provides:

- **Node Status**: View peer ID, pinned content count, online status
- **Auto-Backup**: Toggle automatic periodic backups (every 5 minutes)
- **Manual Backup**: Create backups on demand
- **Restore**: Restore data from a backup CID
- **Pin Management**: View and manage pinned content
- **Educational Info**: Explanations of how IPFS works

## Data Structure

### Signal Storage Format

```json
{
  "id": "signal-123",
  "category": "infrastructure",
  "description": "Pothole on Main St",
  "h3Cell": "8c2a1072b1b47ff",
  "bubbleId": "bubble-city-1",
  "submittedAt": "2024-01-15T10:30:00Z",
  "status": "raw",
  "attestations": 0,
  "storedAt": "2024-01-15T10:30:05Z",
  "storageType": "ipfs-decentralized"
}
```

### Batch Backup Format

```json
{
  "signals": [...],
  "problems": [...],
  "proposals": [...],
  "blackBoxEvents": [...],
  "timestamp": 1705318205000,
  "batchHash": "a3f8d9c2e1b4a6f7",
  "storedAt": "2024-01-15T10:30:05Z",
  "storageType": "ipfs-decentralized-batch"
}
```

## Storage Metadata

Every IPFS storage operation returns metadata:

```typescript
{
  cid: "bafybeig6xv5nwphfmvcnektpnojts33jqcuam7bmye2pb54adnrtccjlsu",
  timestamp: 1705318205000,
  dataType: "signal" | "problem" | "proposal" | "blackbox" | "batch",
  hash: "a3f8d9c2e1b4a6f7",
  size: 1024
}
```

## Integration Points

### Automatic Storage

When IPFS is initialized, all new submissions are automatically stored:

```typescript
const handleSubmitSignal = async (signal: Signal) => {
  setSignals((current) => [...current, signal])
  
  // Automatic IPFS storage
  if (ipfs.state.initialized) {
    await ipfs.storeSignal(signal)
  }
  
  toast.success('Signal submitted to L1 layer')
}
```

### Periodic Backups

When auto-backup is enabled:

```typescript
useEffect(() => {
  if (ipfs.autoBackupEnabled && ipfs.state.initialized) {
    const interval = setInterval(() => {
      ipfs.storeBatch(signals, problems, proposals, blackBoxEvents)
    }, 5 * 60 * 1000) // Every 5 minutes

    return () => clearInterval(interval)
  }
}, [ipfs.autoBackupEnabled, ipfs.state.initialized])
```

## Security Considerations

### Content Addressing
- Each piece of content has a unique CID based on its hash
- Tampering with content creates a different CID
- Original CID can be used to verify authenticity

### Decentralization
- No single point of control
- Data persists as long as one node pins it
- Network effect: More users = more redundancy

### Privacy
- IPFS is **content-addressed, not user-addressed**
- No personal identifiers in the content
- CIDs are deterministic based on content only

### Limitations
- **Public by Design**: All IPFS content is publicly accessible
- **Privacy Tradeoff**: Anyone with a CID can retrieve the content
- **Not Anonymous**: Your IPFS node has a peer ID (though it's pseudonymous)

## Production Deployment Strategy

### Browser-Based Deployment (Current)
✅ **Works Now**
- Helia runs in the browser
- No server infrastructure needed
- Each user runs their own node

⚠️ **Limitations**
- Limited uptime (node only runs while browser is open)
- Limited storage capacity
- Slower network propagation

### Recommended Production Architecture

```
┌─────────────────────────────────────────────────────────────┐
│              MULTI-TIER IPFS DEPLOYMENT                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  TIER 1: User Browser Nodes (Helia)                       │
│  ├─ Runs in user's browser                                │
│  ├─ Submits content to network                            │
│  └─ Pins their own submissions                            │
│                                                             │
│  TIER 2: Dedicated Pinning Services                        │
│  ├─ Pinata, Infura, or Web3.Storage                       │
│  ├─ High-availability pinning                             │
│  ├─ Automatic replication                                 │
│  └─ Cost: ~$20-200/month depending on usage               │
│                                                             │
│  TIER 3: Community Nodes                                   │
│  ├─ Validators run full IPFS nodes                        │
│  ├─ Pin critical system data                              │
│  ├─ Provide redundancy and resilience                     │
│  └─ Earn influence for providing storage                  │
│                                                             │
│  TIER 4: Archive Layer (Arweave/Filecoin)                │
│  ├─ Permanent storage of critical proofs                  │
│  ├─ Pay-once, store-forever model                         │
│  └─ Ultimate backup for historical record                 │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Performance Considerations

### Optimization Strategies

1. **Batch Operations**
   - Store multiple items in one IPFS operation
   - Reduces overhead and CID generation time

2. **Lazy Loading**
   - Only initialize IPFS when user opts in
   - Don't slow down initial app load

3. **Selective Pinning**
   - Pin only critical data (problems, proposals)
   - Let raw signals expire after clustering

4. **Content Deduplication**
   - IPFS automatically deduplicates identical content
   - Same data = same CID = stored once

## Usage Guide

### For Users

1. **Open IPFS Storage Panel**
   - Click "IPFS Storage" button in header
   - Button turns blue when IPFS is active

2. **Initialize Node**
   - Click "Initialize IPFS Node"
   - Wait 2-5 seconds for node to start
   - Peer ID will be displayed

3. **Enable Auto-Backup**
   - Toggle "Auto-Backup" switch
   - Creates backups every 5 minutes
   - CID displayed in toast notification

4. **Manual Backup**
   - Backups happen automatically when you submit content
   - Check "Pinned Content" to see all stored CIDs

5. **Restore from Backup**
   - Paste a backup CID
   - Click "Restore"
   - All data from that backup will be loaded

### For Developers

```typescript
import { useIPFSStorage } from '@/hooks/use-ipfs-storage'

function MyComponent() {
  const ipfs = useIPFSStorage()

  // Initialize on mount
  useEffect(() => {
    ipfs.initialize()
  }, [])

  // Store data
  const handleSubmit = async (data) => {
    const metadata = await ipfs.storeSignal(data)
    console.log(`CID: ${metadata.cid}`)
  }

  // Retrieve data
  const handleRetrieve = async (cid: string) => {
    const data = await ipfs.retrieve(cid)
    console.log(data)
  }

  return (
    <div>
      <p>IPFS Status: {ipfs.state.initialized ? 'Online' : 'Offline'}</p>
      <p>Pinned Items: {ipfs.state.pinnedCount}</p>
    </div>
  )
}
```

## Troubleshooting

### "IPFS not initialized"
- Solution: Click "Initialize IPFS Node" in the storage panel
- This is normal - IPFS only starts when you activate it

### "Failed to store to IPFS"
- Check browser console for errors
- Ensure you have a stable internet connection
- Try refreshing the page and reinitializing

### Content not retrievable
- IPFS content may take time to propagate
- If you just stored it, wait 10-30 seconds
- Pin important content to prevent garbage collection

### Slow performance
- IPFS operations are async and network-dependent
- First storage operation may be slower (node warming up)
- Consider using batch operations for multiple items

## Future Enhancements

### Planned Features
- ✅ Browser-based IPFS node (Helia) - **COMPLETE**
- ✅ Automatic storage of signals/problems/proposals - **COMPLETE**
- ✅ Periodic backups - **COMPLETE**
- ✅ Pin management UI - **COMPLETE**
- 🔄 Integration with pinning services (Pinata, Web3.Storage)
- 🔄 Encrypted storage for sensitive data
- 🔄 Proof-of-persistence challenges
- 🔄 Network health monitoring
- 🔄 Peer discovery and connection stats

## Conclusion

IPFS integration transforms The Record from a centralized application into a truly decentralized coordination system. By storing all critical data on IPFS:

- **No single entity can censor records**
- **Data survives even if the app goes offline**
- **Anyone can verify the integrity of stored data**
- **The system becomes more resilient as more users join**

This is a critical step toward making The Record a **sovereign, uncapturable coordination engine**.
