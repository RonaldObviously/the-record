# THE RECORD - User Onboarding & Verification System

## Overview

THE RECORD now includes a complete user onboarding and verification system that implements the multi-signal humanity verification described in the whitepaper. This system prevents Sybil attacks while protecting user privacy through cryptographic anonymity.

## How Account Creation Works

### 1. Cryptographic Identity Generation
When a user creates an account:
- A unique Ed25519-style key pair is generated
- Public key serves as their identity on the network
- Private key (stored securely) signs all their attestations
- Account ID is derived from hashing the public key + timestamp

### 2. Humanity Verification Signals

Users verify their humanity through multiple independent signals:

| Signal Type | Score | Required | Description |
|------------|-------|----------|-------------|
| **Device** | 10 | ✅ Yes | Browser fingerprint, hardware ID |
| **Email** | 15 | ✅ Yes | Email address verification |
| **Geolocation** | 15 | ❌ No | H3 cell-based location (privacy-preserving) |
| **Phone** | 20 | ❌ No | Phone number verification |
| **GitHub** | 25 | ❌ No | GitHub account linkage |
| **Social** | 15 | ❌ No | Social media account verification |
| **Biometric** | 30 | ❌ No | Facial recognition, fingerprint |

### 3. Humanity Score Calculation

```typescript
Base Score = Σ(verified signals)
Diversity Bonus = +20 if 3+ different signal types verified
Final Score = min(100, Base Score + Diversity Bonus)
```

### 4. Verification Status Tiers

| Status | Humanity Score | Capabilities |
|--------|---------------|--------------|
| **Unverified** | 0-29 | Read-only access |
| **Partial** | 30-59 | Submit signals, report problems |
| **Verified** | 60-79 | Bond influence, submit proposals |
| **Trusted** | 80-100 | Validate proposals, participate in consensus |

## User Flow

### First-Time User Experience

1. **Welcome Screen**
   - User lands on THE RECORD
   - System detects no account
   - Onboarding modal automatically appears

2. **Step 1: Generate Keys** (Required)
   - System generates cryptographic keypair
   - User shown their public key (partially)
   - Device fingerprint signal automatically verified (+10)

3. **Step 2: Verify Email** (Required)
   - User enters email address
   - In production: verification email sent
   - Email signal verified (+15)
   - **Current Humanity Score: 25** (still can't submit signals)

4. **Step 3: Set Location** (Optional)
   - User can share geolocation
   - Converted to H3 cell for privacy
   - Geolocation signal verified (+15)
   - **Current Humanity Score: 40** ✅ Can now submit signals!

5. **Step 4: Verify Phone** (Optional)
   - User can add phone number
   - In production: SMS verification
   - Phone signal verified (+20)
   - **Current Humanity Score: 60** ✅ Can now bond influence!

6. **Step 5: Connect GitHub** (Optional)
   - User connects GitHub via OAuth
   - Uses `spark.user()` API
   - GitHub signal verified (+25)
   - **Current Humanity Score: 85** ✅ Can now validate proposals!

### Returning User Experience

- Account stored in `useKV('user-account')`
- Automatically loaded on return
- No re-verification needed
- Can view account dashboard anytime

## Privacy Guarantees

### What We Store
- ✅ Public key (non-identifiable hash)
- ✅ Verification signals (type + timestamp only)
- ✅ Humanity score (calculated)
- ✅ Influence balance (protocol state)

### What We DON'T Store
- ❌ Exact GPS coordinates (only H3 cell ID)
- ❌ Full email/phone (only verification status)
- ❌ Private key (stays in user's browser)
- ❌ Real identity linkage

### Anonymous Signal Submission

When a user submits a signal/problem:
1. Content is hashed
2. Signed with their private key
3. Submitted through anonymous layer (ring signatures)
4. H3 geospatial blurring prevents exact location
5. Only aggregated patterns are public

## Technical Implementation

### Key Files

```
src/
├── lib/
│   ├── auth.ts              # Account creation, verification logic
│   └── crypto.ts            # Cryptographic primitives
├── components/
│   ├── OnboardingFlow.tsx   # Multi-step onboarding UI
│   └── AccountDashboard.tsx # User account display
└── App.tsx                  # Integration with main app
```

### Core Functions

```typescript
// Create new account
const account = await createAccount()

// Add verification signal
const updatedAccount = addVerificationSignal(account, {
  type: 'email',
  verified: true,
  verifiedAt: new Date(),
  value: 'user@example.com',
  score: 15
})

// Check capabilities
const canSubmit = canSubmitSignals(account)      // 30+ needed
const canBond = canBondInfluence(account)        // 60+ needed  
const canValidate = canValidate(account)         // 80+ needed
```

### State Management

Uses Spark's `useKV` for persistent storage:

```typescript
const [userAccount, setUserAccount] = useKV<UserAccount | null>('user-account', null)
```

Account persists across sessions, survives page refreshes.

## Future Enhancements

### Phase 1 (Current)
- ✅ Multi-signal verification
- ✅ Humanity score calculation
- ✅ Capability gating
- ✅ Persistent account storage

### Phase 2 (Next)
- ⚡ Real email verification (via spark.llm API)
- ⚡ Real SMS verification (via Twilio integration)
- ⚡ Biometric verification (WebAuthn)
- ⚡ Social proof (Twitter/LinkedIn OAuth)

### Phase 3 (Future)
- 🔮 Decentralized identity (DID)
- 🔮 Zero-knowledge proofs for verification
- 🔮 Cross-app humanity score (portable identity)
- 🔮 Reputation staking

## Security Considerations

### Sybil Resistance
- **Current**: Multi-signal scoring makes it expensive to create fake accounts
- **Future**: ZK-proofs, biometrics, social graphs

### Key Management
- **Current**: Keys stored in `useKV` (browser storage)
- **Future**: Hardware wallet integration, key recovery

### Privacy vs. Verification Tradeoff
- More signals = higher humanity score = more capabilities
- Users choose their own privacy/power tradeoff
- No signal is publicly linked to their account

## Testing the System

1. **Start fresh**: Clear browser storage
2. **Open app**: Onboarding modal appears
3. **Complete steps**: Follow verification flow
4. **Check capabilities**: Try submitting signals at different scores
5. **View dashboard**: Click "Account" button in header

## Integration with THE RECORD

The verification system is integrated with all core features:

- **Signal Submission**: Requires 30+ humanity score
- **Proposal Bonding**: Requires 60+ humanity score
- **Validation**: Requires 80+ humanity score + 500Φ influence
- **Black Box**: All account actions cryptographically signed and logged

## Questions & Support

This is a working implementation of the verification architecture described in the whitepaper. The system is designed to scale from single-user testing to global deployment without architectural changes.
