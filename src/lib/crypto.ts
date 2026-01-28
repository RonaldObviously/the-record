export async function sha256Hash(data: string): Promise<string> {
  const encoder = new TextEncoder()
  const dataBuffer = encoder.encode(data)
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

export async function generateKeyPair() {
  const keyPair = await crypto.subtle.generateKey(
    {
      name: 'ECDSA',
      namedCurve: 'P-256'
    },
    true,
    ['sign', 'verify']
  )
  return keyPair
}

export async function signData(privateKey: CryptoKey, data: string): Promise<string> {
  const encoder = new TextEncoder()
  const dataBuffer = encoder.encode(data)
  
  const signature = await crypto.subtle.sign(
    {
      name: 'ECDSA',
      hash: { name: 'SHA-256' }
    },
    privateKey,
    dataBuffer
  )
  
  const signatureArray = Array.from(new Uint8Array(signature))
  return signatureArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

export async function verifySignature(
  publicKey: CryptoKey,
  signature: string,
  data: string
): Promise<boolean> {
  const encoder = new TextEncoder()
  const dataBuffer = encoder.encode(data)
  
  const signatureBuffer = new Uint8Array(
    signature.match(/.{1,2}/g)?.map(byte => parseInt(byte, 16)) || []
  )
  
  try {
    return await crypto.subtle.verify(
      {
        name: 'ECDSA',
        hash: { name: 'SHA-256' }
      },
      publicKey,
      signatureBuffer,
      dataBuffer
    )
  } catch {
    return false
  }
}

export function generateMerkleTree(data: string[]): {
  root: string
  tree: string[][]
} {
  if (data.length === 0) {
    return { root: '', tree: [] }
  }

  const tree: string[][] = []
  
  let currentLevel = data.map(item => {
    const hash = btoa(item).slice(0, 16)
    return hash
  })
  
  tree.push([...currentLevel])
  
  while (currentLevel.length > 1) {
    const nextLevel: string[] = []
    
    for (let i = 0; i < currentLevel.length; i += 2) {
      if (i + 1 < currentLevel.length) {
        const combined = currentLevel[i] + currentLevel[i + 1]
        const hash = btoa(combined).slice(0, 16)
        nextLevel.push(hash)
      } else {
        nextLevel.push(currentLevel[i])
      }
    }
    
    tree.push(nextLevel)
    currentLevel = nextLevel
  }
  
  return {
    root: currentLevel[0],
    tree
  }
}

export function generateProofOfInclusion(
  data: string,
  allData: string[]
): { proof: string[]; index: number } {
  const index = allData.indexOf(data)
  if (index === -1) {
    return { proof: [], index: -1 }
  }
  
  const { tree } = generateMerkleTree(allData)
  const proof: string[] = []
  let currentIndex = index
  
  for (let level = 0; level < tree.length - 1; level++) {
    const levelData = tree[level]
    const siblingIndex = currentIndex % 2 === 0 ? currentIndex + 1 : currentIndex - 1
    
    if (siblingIndex < levelData.length) {
      proof.push(levelData[siblingIndex])
    }
    
    currentIndex = Math.floor(currentIndex / 2)
  }
  
  return { proof, index }
}

export function simulateRingSignature(
  message: string,
  signerIndex: number,
  ringSize: number
): {
  signature: string
  ring: string[]
  message: string
} {
  const ring: string[] = []
  for (let i = 0; i < ringSize; i++) {
    ring.push(`pubkey_${Math.random().toString(36).slice(2, 10)}`)
  }
  
  const combinedData = message + ring.join('') + signerIndex
  const signature = btoa(combinedData).slice(0, 32)
  
  return {
    signature,
    ring,
    message
  }
}
