# Planning Guide

A personal time-blocking and focus management tool that helps knowledge workers protect deep work time, visualize energy patterns, and maintain work-life boundaries through intelligent scheduling and distraction blocking.

**Experience Qualities**: 
1. **Calm Focus** - Interface should reduce anxiety and promote concentration; minimal distractions, clear current task
2. **Respectful Intelligence** - Smart suggestions without nagging; respects user autonomy while offering insights
3. **Honest Reflection** - Shows actual time usage patterns without judgment; builds self-awareness through data

**Complexity Level**: Light Application (multiple features with basic state)
This is a focused productivity tool with time blocking, task management, and analytics. It requires session tracking, calendar visualization, and statistical insights but remains single-purpose and straightforward.

## Essential Features

**Time Block Creation**
- Functionality: Create focused work blocks with duration, task, and energy level
- Purpose: Protect deep work time and set clear intentions
- Trigger: User clicks "New Block" or quick-add shortcut
- Progression: Select duration → Name task → Choose energy level (high/medium/low) → Optional: add notes → Start or schedule
- Success criteria: Block creation takes <10 seconds; blocks persist between sessions; active blocks show countdown

**Focus Timer with Distraction Logging**
- Functionality: Active countdown timer that logs interruptions when paused
- Purpose: Build awareness of interruption patterns and improve focus duration
- Trigger: User starts a time block
- Progression: Timer counts down → User works → If interrupted, click pause and log reason → Resume or end → Review interruption patterns
- Success criteria: Timer visible at all times; pause is one click; interruption logging is optional but encouraged

**Weekly Energy Map**
- Functionality: Visual heatmap showing when user is most productive based on completed blocks
- Purpose: Help schedule deep work during peak energy times
- Trigger: View analytics tab
- Progression: Heatmap loads → Shows time-of-day vs day-of-week → Color intensity = completed focus time → Insights suggest best scheduling
- Success criteria: Pattern emerges after 2 weeks of data; insights are actionable

**Task Backlog Management**
- Functionality: Simple list of tasks to pull into time blocks
- Purpose: Separate task capture from scheduling; reduce mental overhead
- Trigger: User adds task to backlog or imports from existing list
- Progression: Add task → Optionally estimate time → Drag into time block when ready → Mark complete
- Success criteria: Quick capture; easy scheduling; no complex dependencies

**Daily Reflection Prompt**
- Functionality: End-of-day review asking what worked and what didn't
- Purpose: Build self-awareness and improve future planning
- Trigger: Automatically appears at end of workday or manually triggered
- Progression: System asks 2-3 simple questions → User responds briefly → Responses stored for pattern analysis
- Success criteria: Takes <2 minutes; insights surface after consistent use

## Edge Case Handling

- **Missed Blocks**: Show as incomplete with time estimate; no shame, just data
- **Overlapping Blocks**: Warn on creation; allow override if intentional
- **Block Overrun**: Timer goes negative to show actual time; don't auto-end
- **No Data**: Empty states encourage first block creation with templates
- **Long Breaks**: Detect inactivity; ask if block should be ended
- **Timezone Changes**: Use local time; don't break historical data

## Design Direction

The design should feel like a calm workspace - focused, uncluttered, and supportive. Think analog notebook meets smart stopwatch. Warm, human, trustworthy. Not gamified or patronizing. The interface should fade into the background during focus time, then provide thoughtful insights during reflection.

## Color Selection

A warm, focused palette that promotes concentration without being clinical.

- **Primary Color**: Deep Indigo `oklch(0.35 0.10 265)` - Calm authority for active timers and primary actions
- **Secondary Colors**: 
  - Warm Sand `oklch(0.92 0.02 75)` - Background warmth without harshness
  - Charcoal `oklch(0.25 0.01 240)` - Primary text with slight warmth
- **Accent Color**: Amber `oklch(0.70 0.15 70)` - Attention for interruptions and insights
- **Foreground/Background Pairings**:
  - Primary (Deep Indigo): White text - Ratio 8.5:1 ✓
  - Accent (Amber): Dark Charcoal text - Ratio 7.2:1 ✓
  - Warm Sand background: Charcoal text - Ratio 13.1:1 ✓

Additional semantic colors:
- **Focus Mode**: `oklch(0.45 0.12 265)` - Deep indigo for active work
- **Success**: `oklch(0.60 0.12 150)` - Muted green for completed blocks
- **Low Energy**: `oklch(0.55 0.08 220)` - Cool blue for low-energy blocks
- **High Energy**: `oklch(0.50 0.15 30)` - Warm red-orange for peak blocks

## Font Selection

Clean, readable typography that doesn't draw attention to itself. Balanced between technical precision and human warmth.

- **Primary Typeface**: Inter - Excellent readability at all sizes; neutral personality
- **Timer/Data**: JetBrains Mono - For countdown display and time values
- **Typographic Hierarchy**:
  - H1 (Page Title): Inter SemiBold / 28px / -0.02em letter spacing
  - H2 (Section): Inter Medium / 20px / normal spacing
  - Timer Display: JetBrains Mono Bold / 48px / tabular-nums
  - Body: Inter Regular / 15px / 1.6 line height
  - Small Labels: Inter Medium / 13px / 0.02em tracking
  - Metadata: Inter Regular / 13px / muted color

## Animations

Subtle and purposeful - reinforce focus state changes and celebrate completions. Timer pulses gently when active; completed blocks get a satisfying check animation; energy map builds in gradually. All transitions smooth (250-300ms ease-out). No unnecessary motion that could distract during focus time.

## Component Selection

- **Components**:
  - **Card**: Container for time blocks, daily summary, insights
  - **Button**: Primary actions (Start, Pause, Complete)
  - **Input**: Quick task entry, reflection prompts
  - **Badge**: Energy level indicators, tags
  - **Progress**: Visual completion within blocks
  - **Tabs**: Switch between Today, Week, Analytics
  - **Dialog**: Block creation, settings
  - **Popover**: Quick-add menu, interruption logging
  - **Calendar**: Week view with time blocks
  - **Separator**: Between time periods
  - **Tooltip**: Explain features without clutter

- **Customizations**:
  - **Focus Timer**: Large countdown display with pause/stop controls
  - **Energy Heatmap**: Custom D3 visualization showing productive hours
  - **Time Block Card**: Shows task, timer, and quick actions
  - **Interruption Logger**: Quick modal to capture what broke focus

- **States**:
  - Blocks: Scheduled (outline), Active (filled primary), Paused (amber border), Complete (muted with check)
  - Timer: Running (pulsing primary), Paused (amber), Complete (success green)
  - Tasks: Backlog (neutral), Scheduled (primary), Complete (muted strikethrough)

- **Icon Selection**:
  - Timer: `Clock`, `Play`, `Pause`, `Stop`
  - Energy: `Lightning`, `BatteryHigh`, `BatteryMedium`, `BatteryLow`
  - Tasks: `ListBullets`, `Plus`, `Check`, `X`
  - Analytics: `ChartBar`, `CalendarBlank`, `TrendUp`
  - Interruptions: `Bell`, `ChatCircle`, `EnvelopeSimple`

- **Spacing**:
  - Cards: `p-6` for time blocks, `p-4` for task items
  - Layout: `gap-6` for main sections, `gap-4` for lists
  - Inline: `gap-2` for icon+text, `gap-3` for button groups

- **Mobile**:
  - Timer takes center stage full-width
  - Week view scrolls horizontally
  - Bottom nav for quick actions
  - Swipe to complete blocks
  - Simplified heatmap with tap for details
