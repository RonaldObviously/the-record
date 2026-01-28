# The Record - Transparent Collective Decision System

A browser-based demonstration of a 4-layer anti-group-failure architecture for transparent, uncensorable, and accountable collective decision-making.

**Experience Qualities**: 
1. **Clinical Precision** - Interface designed for information density and clarity; technical without being intimidating
2. **Radical Transparency** - Every decision, validation, and outcome is visible and traceable; no hidden processes
3. **Institutional Trust** - Professional, serious design that conveys stability and reliability for governance use

**Complexity Level**: Complex Application (advanced functionality, likely with multiple views)
This is a multi-layered governance system with hierarchical navigation, cryptographic verification, distributed validation, prediction tracking, and meta-layer monitoring. Requires sophisticated state management, real-time data visualization, and multiple interconnected views.

## Essential Features

**Hierarchical Bubble Navigation**
- Functionality: Navigate through geographic and thematic governance contexts
- Purpose: Allow users to drill down from global to local contexts, or explore thematic areas
- Trigger: User clicks on a bubble/context card
- Progression: Start at Global → Select continent/theme → Select nation → Select state → Select city → Select district
- Success criteria: Navigation is intuitive; breadcrumb trail shows current location; can easily go back up the hierarchy

**L1 - Anonymous Problem Reporting**
- Functionality: Submit problems anonymously with category and priority
- Purpose: Protect against social pressure and groupthink by allowing private consensus signals
- Trigger: User clicks "Report Problem" in any bubble context
- Progression: Select category → Describe problem → Set priority → Submit anonymously → Problem appears in L1 view
- Success criteria: No identity stored; submission takes <30 seconds; problems aggregate by pattern

**L2 - Distributed Proposal Validation**
- Functionality: Submit proposals with required predictions, see multi-validator validation results
- Purpose: Prevent single-authority dominance through distributed constraint checking
- Trigger: User clicks "Submit Proposal"
- Progression: Link to problem (optional) → Write title/description → Add predictions (required) → Submit → Validators check budget/legal/feasibility/impact → Status updates to validated/rejected
- Success criteria: Predictions are mandatory; validation results are transparent; multiple validator types required

**L3 - Prediction Tracking & Accountability**
- Functionality: Track predicted vs actual outcomes, calculate accuracy scores
- Purpose: Create accountability through skin-in-the-game predictions; influence based on accuracy
- Trigger: Proposal reaches active/completed status
- Progression: View predictions → Time passes → Actual outcomes recorded → Accuracy calculated → Influence adjusted
- Success criteria: Clear display of prediction vs reality; accuracy scoring is transparent; historical track record visible

**L4 - Meta-Layer System Monitoring**
- Functionality: Independent oversight detecting system drift, bias, and capture attempts
- Purpose: Self-correcting system that flags anomalies without ability to control lower layers
- Trigger: Automated analysis or user clicks "System Health"
- Progression: Monitor validator patterns → Detect cartels/bias → Generate alerts → Display red flags → Cannot modify lower layers
- Success criteria: Alerts are timely; severity levels are clear; monitoring is independent

**Black Box Event Log**
- Functionality: Immutable hash-chained event ledger showing all system activity, with IPFS backup
- Purpose: Provide cryptographic proof of data integrity, complete audit trail, and decentralized storage
- Trigger: Automatic logging of all problems, proposals, validations, predictions
- Progression: Event occurs → Hash calculated → Linked to previous hash → Stored to IPFS (if enabled) → Added to chain → Displayed in log
- Success criteria: Hash chain is verifiable; tampering is detectable; events are immutable; IPFS CID recorded

**IPFS Decentralized Storage**
- Functionality: Store all signals, problems, proposals, and black box events on peer-to-peer IPFS network
- Purpose: Prevent censorship, ensure data cannot be deleted by single entity, provide tamper-proof storage
- Trigger: User initializes IPFS node; automatic storage on submission; periodic backups
- Progression: Initialize node → Content stored to IPFS → CID generated → Content pinned → Network propagation → Backup/restore capability
- Success criteria: Node runs in browser; automatic storage works; backups can be restored; pinned content persists

**System Health Dashboard**
- Functionality: Real-time monitoring of validator network, security analysis, cryptographic verification
- Purpose: Provide transparency into system operation and health metrics
- Trigger: User clicks "System Health"
- Progression: View validator network → See geographic distribution → Check uptime/stake → Analyze security → Verify cryptography
- Success criteria: All metrics update in real-time; easy to understand even if non-technical; trust-building

## Edge Case Handling

- **No Child Bubbles**: Show clear message that context is a leaf node
- **Empty Problem/Proposal Lists**: Encourage first submission with clear CTAs
- **Missing Predictions**: Block proposal submission until at least one prediction added
- **Validator Downtime**: Show status clearly; BFT threshold ensures continued operation
- **Hash Chain Verification Failure**: Display critical alert; system integrity compromised
- **Cartel Detection**: Auto-flag and display severity; cannot block but increases transparency
- **No Active Bubble Selected**: Hide submission buttons; show navigation prompt

## Design Direction

The design should evoke institutional authority and technical precision. Think Bloomberg Terminal meets research dashboard - information-dense, serious, trustworthy. Dark theme with clinical color palette. No consumer app flourishes or unnecessary decoration. Every element serves a functional purpose. Typography should be highly readable with clear hierarchy for scanning dense information.

## Color Selection

A dark, technical palette that conveys seriousness and institutional trust.

- **Primary Color**: Deep Slate `oklch(0.45 0.12 240)` - Institutional authority for main actions and active states
- **Secondary Colors**: 
  - Dark Charcoal `oklch(0.15 0.01 240)` - Background that reduces eye strain
  - Light Gray `oklch(0.95 0.01 240)` - Primary text with high contrast
- **Accent Color**: Amber `oklch(0.65 0.15 70)` - Attention for warnings and meta-alerts
- **Foreground/Background Pairings**:
  - Background (Dark Charcoal): Light Gray text - Ratio 14.2:1 ✓
  - Primary (Deep Slate): White text - Ratio 6.8:1 ✓
  - Accent (Amber): Dark text - Ratio 8.1:1 ✓
  - Card (Slightly Lighter): Light Gray text - Ratio 12.5:1 ✓

Additional semantic colors:
- **Success**: `oklch(0.55 0.15 165)` - Muted teal for validated proposals and passed checks
- **Destructive**: `oklch(0.55 0.20 25)` - Red for rejected proposals and critical alerts
- **Muted**: `oklch(0.22 0.01 240)` - Subdued backgrounds for secondary content
- **Border**: `oklch(0.28 0.01 240)` - Subtle borders that don't compete with content

## Font Selection

Technical typefaces that convey precision and clarity. IBM Plex Sans for excellent readability and professional character; JetBrains Mono for data/metrics.

- **Primary Typeface**: IBM Plex Sans - Clean, professional, excellent at all sizes
- **Data/Metrics**: JetBrains Mono - Tabular nums, high clarity for technical data
- **Typographic Hierarchy**:
  - H1 (Main Title): IBM Plex Sans SemiBold / 24px / -0.01em letter spacing / Mono styling
  - H2 (Section): IBM Plex Sans SemiBold / 18px / normal spacing
  - H3 (Subsection): IBM Plex Sans SemiBold / 16px / normal spacing
  - Body: IBM Plex Sans Regular / 14px / 1.5 line height
  - Small: IBM Plex Sans Regular / 12px / 1.4 line height
  - Data: JetBrains Mono Regular / 14px / tabular-nums / monospace
  - Hash: JetBrains Mono Regular / 11px / monospace / muted color

## Animations

Minimal, functional animations only. Transitions should be quick (150-200ms) to maintain professional feel. No playful or decorative motion. Button states change instantly. Tab switches fade smoothly. Dialog appears/disappears with subtle scale. Loading states use simple progress indicators, never spinners. Everything serves to clarify state changes, nothing exists for delight.

## Component Selection

- **Components**:
  - **Card**: Primary container for all content sections - bubbles, problems, proposals, monitoring
  - **Button**: All actions - submit, navigate, close; clear primary vs secondary states
  - **Dialog**: Problem submission, proposal creation; modal for focused input
  - **Tabs**: Layer navigation (L1/L2/L3/L4), system monitoring sections
  - **Badge**: Status indicators, severity levels, bubble types, validator locations
  - **Input/Textarea**: Form fields for submissions
  - **Select**: Dropdowns for categories, priorities, problem linking
  - **ScrollArea**: Black box log, long lists
  - **Progress**: Validator uptime, Gini coefficient visualization
  - **Separator**: Between sections within cards

- **Customizations**:
  - **Bubble Card**: Clickable cards showing bubble name, type, description, population, problem/proposal counts
  - **Problem Card**: Shows category badge, description, priority, timestamp
  - **Proposal Card**: Title, description, status, validations (checkmarks), predictions (timeline)
  - **Meta Alert**: Severity icon + color, message, affected bubbles, timestamp
  - **Black Box Event**: Monospace hash display, event type icon, timestamp
  - **Validator Card**: Name, location, uptime %, stake amount, progress bar
  - **Hash Chain Block**: Block number, hash, previous hash, event count

- **States**:
  - Bubbles: Default (border), Hover (primary border), Selected (primary background in breadcrumb)
  - Proposals: Pending (gray), Validated (green), Rejected (red), Active (blue), Completed (purple)
  - Validations: Passed (green check), Failed (red X)
  - Alerts: Low (blue), Medium (yellow), High (orange), Critical (red)
  - Validators: Active (green indicator), Offline (gray), Suspicious (yellow flag)

- **Icon Selection**:
  - Navigation: Standard UI icons from Phosphor
  - Warnings: `Warning`, `WarningCircle`, `Info`
  - Actions: `Plus`, `X`, `Check`, `Clock`
  - Status: `CheckCircle`, `XCircle`
  - No decorative icons - function only

- **Spacing**:
  - Page margins: `px-6 py-8` (max-w-7xl container)
  - Card padding: `p-6` for main cards, `p-4` for nested/smaller cards
  - Section gaps: `gap-6` for main layout, `gap-4` for lists
  - Element gaps: `gap-3` within cards, `gap-2` for badges/inline
  - List spacing: `space-y-3` for cards, `space-y-2` for small items

- **Mobile**:
  - Single column layout (grid-cols-1 on mobile, grid-cols-3 on lg)
  - System Health becomes full-screen overlay
  - Bubble cards stack vertically
  - Black Box log moves below main content
  - Tabs remain horizontal with scroll if needed
  - Dialogs become full-screen on small devices
  - Touch-friendly targets (min 44px)
