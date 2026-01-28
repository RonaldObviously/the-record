# Planning Guide

A non-political, transparent, collective decision system that enables communities to identify problems, allocate resources, track execution, and validate predictions through a 4-layer anti-group-failure architecture. This browser-based implementation demonstrates the core concepts with persistent data storage and full UI functionality.

**Experience Qualities**: 
1. **Clinical Clarity** - Interface should feel like mission control, not a social network; data-first, emotion-neutral presentation
2. **Radical Transparency** - Every layer, prediction, and outcome visible at a glance; nothing hidden, everything traceable
3. **Purposeful Calm** - Despite handling complex systems, the UI should reduce cognitive load and inspire confidence through systematic organization

**Complexity Level**: Complex Application (advanced functionality, likely with multiple views)
This is a sophisticated governance coordination platform with nested geographic/thematic bubbles, multi-layered validation systems, prediction tracking, and real-time monitoring dashboards. It requires multiple interconnected views, data visualization, state management across layers, and the ability to drill down from global to hyper-local contexts.

**Implementation Status**: ✅ FULLY FUNCTIONAL
- All core features implemented and working
- Data persists between sessions using Spark KV storage
- Seed data populates system on first launch
- Users can submit problems and proposals with predictions
- All 4 layers (L1-L4) functional with proper validation
- Black Box flight recorder captures all events
- Meta-layer alerts display system health warnings

## Essential Features

**3D Globe View with Geographic Navigation**
- Functionality: Interactive 3D Earth visualization displaying all bubbles as geographic markers with real-time status indicators, similar to Google Earth but representing Record system data
- Purpose: Provide spatial context for all bubbles; enable intuitive geographic navigation; visualize global system health at a glance
- Trigger: User selects "Globe View" toggle or app loads with globe as default
- Progression: Globe loads with all bubbles as colored markers → User rotates/zooms globe → Hovers over marker to see bubble details → Clicks marker to drill into bubble dashboard → Can zoom from global to neighborhood level
- Success criteria: Globe is performant with 50+ markers; markers color-coded by severity/status; smooth 3D rotation and zoom; tooltip shows bubble stats on hover; seamless transition to bubble detail view
- Implementation: Three.js for 3D rendering, raycasting for marker interaction, dynamic marker colors based on alert status, geographic coordinate mapping for bubble positions

**Bubble Map Navigation**
- Functionality: Visual navigation system showing nested geographic (Global → City → Neighborhood) and thematic (Education, Healthcare, Infrastructure) bubbles
- Purpose: Provide intuitive entry point into any community scale or problem domain; alternative flat view to globe
- Trigger: User loads app or clicks a bubble to drill down; toggle to "Map View" from globe
- Progression: Landing view shows bubble grid → User selects bubble → Zooms into sub-bubbles or domain dashboard → Can navigate back up hierarchy
- Success criteria: Users can navigate from global to local context in under 3 clicks; bubble hierarchy is immediately comprehensible

**Private Problem Intake (L1 - Private Consensus Engine)**
- Functionality: Anonymous submission of problems, judgments, or concerns with aggregation into collective patterns
- Purpose: Eliminate groupthink, social pressure, and identity-based bias while capturing honest community input
- Trigger: User selects "Report Problem" from any bubble context
- Progression: Select bubble context → Choose problem category → Submit anonymous input → View aggregated patterns (not individual responses)
- Success criteria: Submissions are truly anonymous; aggregated patterns reveal dominant issues without attribution

**Proposal System with Prediction Tracking (L3 - DAM)**
- Functionality: Submit solutions with required outcome predictions; track prediction accuracy over time
- Purpose: Reward accuracy over popularity; create accountability through prediction-outcome matching
- Trigger: User selects "Submit Proposal" from problem dashboard
- Progression: Define proposal → Set predicted outcomes with metrics → Submit for validation → Track execution → Compare predictions to reality → Influence weight adjusts
- Success criteria: All proposals have measurable predictions; accuracy scoring is transparent and immutable

**Constraint Validation Dashboard (L2 - DCN)**
- Functionality: Multi-node validation showing budget, feasibility, legality, impact, and contradiction checks
- Purpose: Prevent single-authority dominance; surface hidden constraints early
- Trigger: Proposal submitted → Automatic validation cascade
- Progression: Proposal enters system → Parallel validators run checks → Results displayed as validation grid → Red flags highlighted → Proposal advances or dies based on constraint satisfaction
- Success criteria: Validation results are clear, multi-dimensional, and show reasoning; bad proposals filtered before community consideration

**Black Box Flight Recorder**
- Functionality: Immutable, time-stamped log of all predictions, decisions, validations, warnings, and outcomes
- Purpose: Create public ledger of truth performance; prevent institutional suppression of failures
- Trigger: Any significant system event (prediction, validation, outcome)
- Progression: Event occurs → Timestamped entry created → Added to public record → Available for audit/comparison → Builds legitimacy reflex over time
- Success criteria: All critical events are logged; historical accuracy is searchable and comparable; data cannot be retroactively altered

**Meta-Layer Monitoring (L4 - IML)**
- Functionality: Independent oversight that detects systemic drift, bias accumulation, capture attempts, and anomalies
- Purpose: Ensure the system itself doesn't corrupt over time
- Trigger: Continuous background monitoring
- Progression: System monitors patterns → Detects anomalies or drift → Publishes warning (no direct action) → Community sees red flags
- Success criteria: Warnings are clear, actionable, and non-coercive; meta-layer cannot make decisions

## Edge Case Handling

- **Empty Bubbles**: Show "No active problems or proposals" with CTA to submit first entry
- **Gaming Attempts**: Meta-layer flags suspicious patterns; influence only adjusts based on prediction accuracy
- **Contradictory Validators**: Display all validator results transparently; let users see disagreement
- **Failed Predictions**: Don't punish, just reduce influence weight mathematically; show historical accuracy
- **Data Overload**: Provide filtering by time, domain, priority; use visual hierarchy to surface critical signals
- **No Geographic Context**: Allow participation in thematic bubbles without location requirement
- **Tie-breaking**: Use prediction accuracy history as tiebreaker for priority rankings

## Design Direction

The design should evoke clinical precision, scientific rigor, and trustworthy infrastructure—like air traffic control meets research lab. This is not a consumer app; it's a coordination instrument. The aesthetic should feel institutional but not bureaucratic, data-dense but not cluttered, serious but not intimidating. Think: Bloomberg Terminal meets government transparency dashboard meets academic research interface.

## Color Selection

The palette should communicate institutional trust, scientific objectivity, and alert clarity without political association.

- **Primary Color**: Deep Slate Blue `oklch(0.35 0.05 250)` - Suggests institutional credibility and analytical thinking without partisan blue
- **Secondary Colors**: 
  - Warm Neutral `oklch(0.88 0.01 60)` - Backgrounds and de-emphasized containers
  - Cool Gray `oklch(0.45 0.02 240)` - Supporting text and borders
- **Accent Color**: Amber Alert `oklch(0.75 0.15 75)` - For warnings, predictions requiring attention, and call-to-action elements
- **Foreground/Background Pairings**:
  - Primary (Deep Slate Blue #3d4f6b): White text (#FFFFFF) - Ratio 7.2:1 ✓
  - Accent (Amber Alert #d9a855): Black text (#000000) - Ratio 8.1:1 ✓
  - Warm Neutral background (#e8e6e0): Dark Gray text (#2d2d2d) - Ratio 11.4:1 ✓
  - Black background (#0a0a0a): Warm Neutral text (#e8e6e0) - Ratio 12.8:1 ✓

Additional semantic colors:
- **Success/Validated**: `oklch(0.65 0.15 160)` - Muted teal for validated proposals
- **Critical/Red Flag**: `oklch(0.55 0.20 25)` - Subdued red for meta-layer warnings
- **Prediction Tracking**: `oklch(0.60 0.12 280)` - Violet for prediction data points

## Font Selection

Typography should convey precision, legibility at data density, and institutional authority. Monospaced elements for data; humanist sans for readability.

- **Primary Typeface**: IBM Plex Sans - Technical clarity with warmth; excellent for dense information
- **Data/Metrics**: JetBrains Mono - For timestamps, numerical data, prediction values, validation results
- **Typographic Hierarchy**:
  - H1 (Bubble Titles): IBM Plex Sans SemiBold / 32px / -0.02em letter spacing
  - H2 (Section Headers): IBM Plex Sans Medium / 20px / -0.01em letter spacing
  - H3 (Subsections): IBM Plex Sans Medium / 16px / normal spacing
  - Body (Content): IBM Plex Sans Regular / 15px / 1.6 line height
  - Data Labels: JetBrains Mono Regular / 13px / tabular-nums
  - Metadata: IBM Plex Sans Regular / 13px / muted color
  - Critical Alerts: IBM Plex Sans SemiBold / 14px / uppercase / tracked

## Animations

Animations should reinforce system logic and data relationships, never decorative. Use motion to show causality (input → validation → outcome), hierarchy transitions (bubble zoom in/out), and state changes (prediction → reality matching). Subtle pulse for live data updates; smooth transitions when drilling down bubble levels; delayed sequential reveals for validation results to show independent processing; gentle highlight flash when meta-layer flags appear. Duration: 200-350ms for transitions, 1200ms for data pulses. Easing: ease-out for expanding, ease-in-out for state changes.

## Component Selection

- **Components**:
  - **Bubble Grid**: Custom component using Framer Motion for zoom/drill-down interactions
  - **Card**: Primary container for problems, proposals, validation results
  - **Tabs**: Navigate between L1/L2/L3/L4 layers within a bubble
  - **Badge**: Display bubble categories, validation status, influence scores
  - **Progress**: Show proposal execution timeline
  - **Accordion**: Collapse/expand detailed validation results
  - **Dialog**: Modal for problem submission, proposal creation
  - **Table**: Black Box flight recorder log, prediction accuracy history
  - **Separator**: Visual breaks between layer sections
  - **Scroll Area**: Handle data-dense validation grids
  - **Alert**: Meta-layer warnings and red flags
  - **Tooltip**: Explain technical terms, validator logic

- **Customizations**:
  - **Prediction Tracker**: Custom component showing predicted vs. actual outcomes with timeline visualization
  - **Validation Grid**: Multi-column display of independent validator results with pass/fail/warning states
  - **Influence Weight Indicator**: Visual representation of proposal-maker's historical accuracy
  - **Bubble Map Canvas**: Interactive D3-based or custom SVG grid showing geographic/thematic hierarchy

- **States**:
  - Buttons: Default, hover with subtle lift, active press, disabled (low opacity)
  - Cards: Default with border, hover with shadow expansion, selected with primary border
  - Validation indicators: Pending (pulsing), Pass (muted teal), Fail (subdued red), Warning (amber)
  - Proposals: Draft, Under Validation, Active, Completed, Accuracy Evaluated

- **Icon Selection**:
  - Problems: `WarningCircle`, `Bug`, `Question`
  - Proposals: `Lightbulb`, `FileText`, `CheckCircle`
  - Layers: `LockKey` (L1 privacy), `Network` (L2 DCN), `Target` (L3 accountability), `Eye` (L4 meta)
  - Navigation: `CaretRight`, `CaretDown`, `ArrowsOut`, `ArrowsIn`
  - Actions: `Plus`, `MagnifyingGlass`, `Download`, `UploadSimple`
  - Validation: `CheckCircle`, `XCircle`, `WarningDiamond`, `Clock`

- **Spacing**:
  - Containers: `p-6` for cards, `p-8` for page sections
  - Grids: `gap-4` for bubble grids, `gap-6` for dashboard layouts
  - Lists: `space-y-3` for problem lists, `space-y-4` for proposal cards
  - Inline elements: `gap-2` for icon+text, `gap-3` for button groups

- **Mobile**:
  - Bubble map switches to vertical scrolling list with drill-down
  - Tabs convert to dropdown selector for layers
  - Validation grid stacks vertically with collapsible sections
  - Tables switch to card-based layout for flight recorder
  - Touch targets minimum 44px for all interactive elements
  - Bottom navigation for primary actions (Report Problem, Submit Proposal)
