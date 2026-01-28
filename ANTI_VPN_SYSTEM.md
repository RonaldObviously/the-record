# Anti-VPN & Location Verification System

## The Problem: Why Location Verification Matters

THE RECORD is a geospatial truth coordination system. For it to work, we must know that signals actually come from the locations they claim to represent. Without proper verification:

1. **Sybil Attacks**: A single person could use VPNs to create signals from 100 different cities
2. **Manufactured Consensus**: Bad actors could fake "local support" for proposals
3. **Geographic Manipulation**: Someone in Moscow could submit signals claiming to be in New York
4. **Spam Coordination**: Coordinated bot networks could overwhelm legitimate signals

## The Solution: Multi-Layer Location Proofs

We don't just check IP addresses. We create a comprehensive "Location Proof" that combines multiple independent signals that are extremely difficult to fake simultaneously.

### Layer 1: GPS + H3 Geohashing

**What it does:**
- Captures device GPS coordinates
- Immediately converts to H3 cell (level 8 = ~500m radius hexagon)
- Discards exact coordinates, stores only H3 cell hash

**Privacy guarantee:**
- We never know your house
- We only know you're in a ~500m area
- H3 cells have 7.5 million possible values globally

**What it prevents:**
- Random fake locations (no GPS = no signal)
- Precision spoofing (can't claim to be at exact building)

**Weakness:**
- GPS can be spoofed with rooted devices or emulators

---

### Layer 2: IP Address Analysis

**What it does:**
- Extracts your real IP address via WebRTC STUN (bypasses proxies)
- Checks IP against known VPN/datacenter/Tor ranges
- Verifies IP geolocation matches GPS claim

**Detection methods:**
- Known VPN IP ranges (NordVPN, ExpressVPN, etc.)
- Cloud/datacenter IPs (AWS, Google Cloud, DigitalOcean)
- Tor exit node IP ranges
- Private network IPs (10.x.x.x, 192.168.x.x)

**What it prevents:**
- VPN users pretending to be local
- Datacenter bots submitting signals
- Tor users claiming physical location

**Weakness:**
- New VPN IPs not yet in database
- Residential proxy networks

---

### Layer 3: Timezone Verification

**What it does:**
- Reads system timezone from browser
- Calculates expected timezone based on GPS longitude
- Flags mismatches (e.g., NYC GPS but Tokyo timezone)

**Math:**
```
Expected timezone offset = longitude / 15 degrees
Actual offset = browser.getTimezoneOffset()
Match if difference <= 2 hours (accounts for daylight savings)
```

**What it prevents:**
- VPN users who forget to change system time
- Remote attackers with wrong time settings
- Automated bots with server timezones

**Weakness:**
- Timezone boundaries aren't perfect (China is all UTC+8)
- Users who intentionally set wrong timezone

---

### Layer 4: Device Fingerprinting

**What it does:**
- Creates unique hash of device characteristics:
  - Screen resolution
  - Browser/OS user agent
  - Hardware concurrency (CPU cores)
  - Color depth
  - Touch support
  - Canvas rendering signature
  - WebGL renderer info

**Consistency check:**
- Your last 10 signals should come from same device fingerprint
- If fingerprint keeps changing = suspicious

**What it prevents:**
- Mass account creation on different VMs
- Browser automation tools (fingerprints differently)
- Users switching devices to evade detection

**Weakness:**
- Browser updates can change fingerprint
- Privacy tools deliberately randomize fingerprint
- Legitimate users with multiple devices

---

### Layer 5: Network Signal Analysis (Advanced)

**What it does (when available):**
- Scans nearby WiFi networks (BSSIDs)
- Detects cellular towers (cell IDs)
- Reads Bluetooth beacons
- Compares to known geolocation databases

**Example:**
```
WiFi Networks Detected:
- BSSID: 00:11:22:33:44:55 (Starbucks WiFi) -> Maps to exact location
- BSSID: AA:BB:CC:DD:EE:FF (Home router) -> Consistent with H3 cell

Cell Towers:
- Cell ID: 12345, LAC: 678 -> Verifies NYC location
```

**What it prevents:**
- GPS spoofing (can't fake WiFi/cell tower signals)
- Emulator attacks (no physical radio signals)
- Remote VPN users (wrong network environment)

**Weakness:**
- Requires browser permissions
- Not available on all devices
- Can be faked with sophisticated hardware

---

### Layer 6: Velocity & Travel Pattern Analysis

**What it does:**
- Tracks your location history over time
- Calculates speed between locations
- Flags physically impossible movements

**Example:**
```
User submits signal from NYC at 2:00 PM
User submits signal from London at 2:05 PM

Distance: 5,500 km
Time: 5 minutes
Speed: 66,000 km/h

Fastest plane: ~1,000 km/h
Verdict: IMPOSSIBLE - Reject signal
```

**Pattern detection:**
- If you're always in NYC, sudden signal from Tokyo = suspicious
- If you jump between 20 cities in 1 hour = bot
- If you have consistent "home cell" = trusted

**What it prevents:**
- VPN hopping attacks
- Coordinated multi-location spam
- Stolen account usage from different location

**Weakness:**
- Legitimate travel can trigger false positives
- First-time users have no history

---

## Scoring System

Every location proof gets two scores:

### 1. Consistency Score (0-100)

Calculated as:
```typescript
score = 100
if (isVPN) score -= 40
if (isTor) score -= 50
if (isProxy) score -= 30
if (!timezoneMatch) score -= 20
if (hasWiFiProof) score += 15
if (hasCellTowerProof) score += 15
if (hasBluetoothProof) score += 10
if (networkLatency > 200ms) score -= 15
```

**Thresholds:**
- 70-100: High trust (residential user, strong proofs)
- 50-69: Medium trust (some concerns, still usable)
- 30-49: Low trust (multiple red flags, heavily downweighted)
- 0-29: Reject (VPN/Tor/obvious manipulation)

### 2. Trust Score (0-100)

Calculated as:
```typescript
score = consistencyScore
score += (deviceConsistency * 10)  // Same device over time
score += velocityRealistic ? 0 : -40  // Impossible speed
score += travelPatternNormal ? 0 : -20  // Erratic location changes
```

**Trust builds over time:**
- New users: Low trust
- Consistent users: Trust grows
- Suspicious activity: Trust destroyed

---

## Attack Scenarios & Defenses

### Attack 1: "I'll just use a VPN"

**Attacker:** Uses NordVPN to appear in NYC

**Defense:**
1. IP detected as VPN (Layer 2) -> Consistency score = 0
2. System timezone doesn't match NYC (Layer 3) -> Additional penalty
3. Device fingerprint changes frequently (Layer 4) -> Suspicious
4. Signal **rejected**

**Result:** Cannot submit signal

---

### Attack 2: "I'll use a residential proxy"

**Attacker:** Uses rotating residential IPs (harder to detect)

**Defense:**
1. IP might pass (some residential proxies are new)
2. But: GPS still required (proxy doesn't fake GPS)
3. Timezone verification (Layer 3) -> Likely fails
4. Device fingerprint (Layer 4) -> Changes on each request
5. Velocity check (Layer 6) -> User "teleports" between cities
6. **Pattern detected, trust score = 0**

**Result:** Signal accepted but given zero weight in consensus

---

### Attack 3: "I'll spoof my GPS with a rooted phone"

**Attacker:** Uses GPS spoofing app on rooted Android

**Defense:**
1. GPS coordinates say "I'm in NYC"
2. IP address is from Mumbai -> **Mismatch detected**
3. Timezone is UTC+5:30 (India) but GPS says UTC-5 (NYC) -> **Major red flag**
4. Network signals (WiFi/cell towers) are from Mumbai -> **Contradiction**
5. **System detects multi-layer inconsistency, rejects signal**

**Result:** Cannot submit signal

---

### Attack 4: "I'll use a GPS spoofing VPN AND fake my timezone"

**Attacker:** Sophisticated attack with coordinated spoofing

**Defense:**
1. GPS: Faked to NYC ✓
2. IP: Using VPN that claims NYC -> **Detected as VPN via WebRTC**
3. Timezone: Changed to UTC-5 ✓
4. But: Device fingerprint changes on every request (running in VM)
5. And: Network latency is 350ms (too high for local)
6. And: No WiFi/cell tower signals (emulator has no radio)
7. **Consistency score = 15 (too low to pass)**

**Result:** Signal rejected

---

### Attack 5: "I'll rent a cloud VM in the target city"

**Attacker:** Spins up AWS EC2 instance in NYC region

**Defense:**
1. IP address is from AWS datacenter -> **Immediately flagged**
2. No GPS available (server has no GPS sensor) -> **Cannot submit location**
3. Device fingerprint is Linux server, not mobile/desktop -> **Obvious bot**
4. **System rejects as datacenter bot**

**Result:** Cannot submit signal

---

### Attack 6: "I'll hire someone in the target city to submit for me"

**Attacker:** Pays local person to submit fake signals

**Defense:**
This attack **succeeds** at the individual level (they are physically there).

**But:**
1. Byzantine Fault Tolerance requires 2/3+ consensus (one person can't create fake consensus)
2. If they submit 100 signals from same device -> **Pattern detected** (one device shouldn't create that many signals)
3. If they submit contradictory signals -> **Semantic analysis** detects inconsistency
4. If their signals never get attested by others -> **They die as noise**
5. Over time, their influence score drops to zero if predictions are wrong

**Result:** Single corrupted user has minimal impact due to consensus requirements

---

## What VPN Users Should Do

### If you legitimately use VPN for privacy:

**Option 1: Disable VPN temporarily**
- Turn off VPN when submitting signals
- Re-enable after submission
- Your location is still H3-blurred (privacy-preserving)

**Option 2: Use the "Mesh Cell Selection" feature**
- Use the satellite map view
- Click on your actual neighborhood's mesh cell
- Submit signal associated with that cell
- Still requires IP verification but less strict

**Option 3: Build location proof history**
- Submit signals consistently from your real location (without VPN)
- Build up trust score over weeks
- System learns your legitimate travel patterns
- Future signals get higher trust

---

## Privacy Guarantees (Even With All This Verification)

Despite all these checks, THE RECORD still **never knows**:

1. **Your exact address** - Only H3 cell (~500m radius)
2. **Your identity** - Signals are anonymous
3. **Your full location history** - Only last 100 proofs stored, then deleted
4. **Your browsing habits** - We only check location, nothing else
5. **Your home** - H3 cell could contain 100-1000 buildings

**The system only knows:**
- You are a human (not a bot)
- You are physically in the area you claim
- Your location submissions are consistent over time

---

## Technical Implementation

### File: `/src/lib/anti-vpn.ts`

Key classes:
- `AntiVPNVerification`: Main verification engine
- `LocationProof`: Data structure containing all verification signals
- `GeospatialConsistency`: Tracks user movement patterns over time

Key methods:
- `createLocationProof()`: Generates comprehensive location proof
- `verifySignalLocation()`: Validates signal against proof
- `checkVelocityRealistic()`: Detects impossible travel
- `detectVPN()`: Identifies VPN/proxy/Tor IPs

### File: `/src/components/LocationVerificationExplainer.tsx`

User-facing explanation dialog showing:
- Why we verify location
- How each layer works
- Current verification status
- Privacy guarantees

### File: `/src/components/SubmitSignalDialog.tsx`

Integrated verification into signal submission:
- Real-time verification during submission
- Visual feedback on verification status
- Blocking submission if VPN detected
- Display of consistency and trust scores

---

## Future Enhancements

### 1. Blockchain-Based Proof of Location

Store location proofs on-chain:
- Immutable history
- Cryptographic verification
- Slashing for proven location fraud

### 2. Trusted Hardware Attestation

Use device secure enclaves:
- iOS Secure Enclave
- Android StrongBox
- Intel SGX
- Proves location came from real hardware

### 3. Satellite-Based Verification

Cross-check with satellite imagery:
- User submits photo
- Geotag extracted and verified
- Image matched to satellite view of claimed location

### 4. Mesh Network Cross-Validation

Users verify each other:
- Submit signal
- Nearby users can attest "I see this too"
- Attestations come from different IPs/devices
- Creates web of trust

### 5. Machine Learning Anomaly Detection

Train ML models on:
- Normal human movement patterns
- Typical device usage
- Expected network signatures
- Flag anomalies automatically

---

## Conclusion

VPNs are **effectively blocked** through multi-layer verification. 

A sophisticated attacker would need to:
1. Fake GPS coordinates
2. Use residential proxy in target city
3. Change system timezone
4. Spoof device fingerprint to look consistent
5. Fake WiFi/cell tower signals
6. Maintain realistic travel patterns
7. Pass semantic consistency checks
8. Get past Byzantine consensus

**This is borderline impossible for mass attacks and economically unfeasible for individual attacks.**

The system is designed so that **it's easier to just tell the truth** than to construct an elaborate lie.
