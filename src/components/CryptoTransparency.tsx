import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { LockKey, ArrowDown, CheckCircle } from '@phosphor-icons/react'
import { sha256Hash, generateMerkleTree } from '@/lib/crypto'
import type { Proposal, BlackBoxEntry } from '@/lib/types'

interface CryptoTransparencyProps {
  proposals: Proposal[]
  blackBoxEntries: BlackBoxEntry[]
}

interface Block {
  index: number
  timestamp: number
  data: string
  previousHash: string
  hash: string
}

export function CryptoTransparency({ proposals, blackBoxEntries }: CryptoTransparencyProps) {
  const [chain, setChain] = useState<Block[]>([])
  const [merkleRoot, setMerkleRoot] = useState<string>('')
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationResult, setVerificationResult] = useState<boolean | null>(null)

  useEffect(() => {
    buildBlockchain()
  }, [proposals, blackBoxEntries])

  const buildBlockchain = async () => {
    const blocks: Block[] = []
    
    const genesisBlock: Block = {
      index: 0,
      timestamp: Date.now() - 1000000,
      data: 'Genesis Block - The Record System Initialized',
      previousHash: '0',
      hash: ''
    }
    genesisBlock.hash = await sha256Hash(
      JSON.stringify({
        index: genesisBlock.index,
        timestamp: genesisBlock.timestamp,
        data: genesisBlock.data,
        previousHash: genesisBlock.previousHash
      })
    )
    blocks.push(genesisBlock)

    const allData = [
      ...proposals.map(p => `PROPOSAL:${p.id}:${p.title}`),
      ...blackBoxEntries.map(e => `ENTRY:${e.id}:${e.type}`)
    ]

    for (let i = 0; i < Math.min(allData.length, 10); i++) {
      const previousBlock = blocks[blocks.length - 1]
      const newBlock: Block = {
        index: blocks.length,
        timestamp: Date.now() - (1000000 - i * 10000),
        data: allData[i],
        previousHash: previousBlock.hash,
        hash: ''
      }
      
      newBlock.hash = await sha256Hash(
        JSON.stringify({
          index: newBlock.index,
          timestamp: newBlock.timestamp,
          data: newBlock.data,
          previousHash: newBlock.previousHash
        })
      )
      
      blocks.push(newBlock)
    }

    setChain(blocks)

    const proposalTitles = proposals.map(p => p.title)
    const { root } = generateMerkleTree(proposalTitles)
    setMerkleRoot(root)
  }

  const verifyChain = async () => {
    setIsVerifying(true)
    setVerificationResult(null)

    await new Promise(resolve => setTimeout(resolve, 1000))

    let isValid = true
    for (let i = 1; i < chain.length; i++) {
      const block = chain[i]
      const previousBlock = chain[i - 1]

      if (block.previousHash !== previousBlock.hash) {
        isValid = false
        break
      }

      const calculatedHash = await sha256Hash(
        JSON.stringify({
          index: block.index,
          timestamp: block.timestamp,
          data: block.data,
          previousHash: block.previousHash
        })
      )

      if (block.hash !== calculatedHash) {
        isValid = false
        break
      }
    }

    setVerificationResult(isValid)
    setIsVerifying(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Cryptographic Integrity</h3>
        <p className="text-sm text-muted-foreground">
          Hash chain verification and Merkle tree proof of inclusion
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Hash Chain</CardTitle>
              <Button 
                size="sm" 
                onClick={verifyChain}
                disabled={isVerifying || chain.length === 0}
              >
                {isVerifying ? 'Verifying...' : 'Verify Chain'}
              </Button>
            </div>
            <CardDescription>
              Immutable blockchain demonstrating tamper-evident storage
            </CardDescription>
          </CardHeader>
          <CardContent>
            {verificationResult !== null && (
              <div className={`mb-4 p-3 rounded-md border ${
                verificationResult 
                  ? 'border-success/30 bg-success/10' 
                  : 'border-destructive/30 bg-destructive/10'
              }`}>
                <div className="flex items-center gap-2">
                  {verificationResult ? (
                    <>
                      <CheckCircle size={16} className="text-success" weight="fill" />
                      <p className="text-sm font-medium text-success">
                        Chain integrity verified
                      </p>
                    </>
                  ) : (
                    <>
                      <LockKey size={16} className="text-destructive" />
                      <p className="text-sm font-medium text-destructive">
                        Chain verification failed
                      </p>
                    </>
                  )}
                </div>
              </div>
            )}

            <ScrollArea className="h-[400px]">
              <div className="space-y-3">
                {chain.map((block, index) => (
                  <div key={block.index}>
                    <div className="border rounded-md p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <Badge variant={index === 0 ? 'default' : 'outline'}>
                          Block {block.index}
                        </Badge>
                        <span className="text-xs font-mono text-muted-foreground">
                          {new Date(block.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Data:</p>
                        <p className="text-xs font-mono break-all">{block.data}</p>
                      </div>

                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Hash:</p>
                        <p className="text-xs font-mono break-all text-primary">
                          {block.hash.slice(0, 32)}...
                        </p>
                      </div>

                      {index > 0 && (
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">Previous Hash:</p>
                          <p className="text-xs font-mono break-all text-muted-foreground">
                            {block.previousHash.slice(0, 32)}...
                          </p>
                        </div>
                      )}
                    </div>
                    
                    {index < chain.length - 1 && (
                      <div className="flex justify-center py-1">
                        <ArrowDown size={16} className="text-muted-foreground" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Merkle Tree</CardTitle>
            <CardDescription>
              Cryptographic proof of proposal inclusion in the ledger
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-primary/10 rounded-md border border-primary/30">
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
                  Merkle Root
                </p>
                <p className="text-sm font-mono break-all text-primary font-semibold">
                  {merkleRoot || 'No data available'}
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  How it works:
                </p>
                <div className="space-y-2 text-xs text-muted-foreground">
                  <p>
                    <strong className="text-foreground">1. Hash Leaves:</strong> Each proposal is hashed individually
                  </p>
                  <p>
                    <strong className="text-foreground">2. Build Tree:</strong> Pairs of hashes are combined and hashed again
                  </p>
                  <p>
                    <strong className="text-foreground">3. Merkle Root:</strong> Final hash represents all data
                  </p>
                  <p>
                    <strong className="text-foreground">4. Verification:</strong> Any change invalidates the root
                  </p>
                </div>
              </div>

              <div className="p-3 bg-muted rounded-md">
                <p className="text-xs font-semibold mb-2">Security Guarantee:</p>
                <p className="text-xs text-muted-foreground">
                  Changing a single character in any proposal would completely alter the Merkle root, 
                  making tampering immediately detectable. This provides O(log n) proof verification.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 border rounded-md">
                  <p className="text-xs text-muted-foreground mb-1">Total Proposals</p>
                  <p className="text-lg font-mono font-semibold">{proposals.length}</p>
                </div>
                <div className="p-3 border rounded-md">
                  <p className="text-xs text-muted-foreground mb-1">Chain Blocks</p>
                  <p className="text-lg font-mono font-semibold">{chain.length}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
