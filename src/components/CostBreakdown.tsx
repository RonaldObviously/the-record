import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { 
  ChartBar, 
  Coins, 
  Cloud, 
  Database, 
  HardDrive,
  CheckCircle,
  WarningCircle,
  ArrowsClockwise,
  CurrencyDollar,
  TrendUp,
  TrendDown,
  Vault,
  Users,
  Lightning
} from '@phosphor-icons/react'

export function CostBreakdown() {
  const [activeEconomicsTab, setActiveEconomicsTab] = useState('revenue')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-mono mb-2">Economics & Cost Transparency</h1>
        <p className="text-muted-foreground">
          Complete breakdown of how The Record makes money, stores it, and distributes it
        </p>
      </div>

      <Card className="p-6 bg-primary/10 border-primary">
        <div className="flex items-start gap-4">
          <Vault size={32} weight="fill" className="text-primary flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold text-lg mb-2">The Economic Model: Zero-Sum Influence Economy</h3>
            <p className="text-sm text-muted-foreground mb-3">
              THE RECORD operates a <strong>closed-loop influence economy</strong> where influence cannot be 
              purchased with money. Instead, it's earned through accuracy and lost through error. This creates 
              a sustainable economic model that funds infrastructure while preventing plutocracy.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <TrendUp size={16} className="text-success" />
                <span>Revenue from slashing false claims</span>
              </div>
              <div className="flex items-center gap-2">
                <Vault size={16} className="text-accent" />
                <span>Treasury stores operational funds</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendDown size={16} className="text-primary" />
                <span>Distributed to validators & infrastructure</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Tabs value={activeEconomicsTab} onValueChange={setActiveEconomicsTab}>
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="revenue">How Money Comes In</TabsTrigger>
          <TabsTrigger value="storage">How Money Is Stored</TabsTrigger>
          <TabsTrigger value="distribution">How Money Goes Out</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="space-y-6">
          <RevenueStreams />
        </TabsContent>

        <TabsContent value="storage" className="space-y-6">
          <TreasuryStorage />
        </TabsContent>

        <TabsContent value="distribution" className="space-y-6">
          <MoneyDistribution />
        </TabsContent>
      </Tabs>

      <InfrastructureCostTabs />

      <Tabs defaultValue="small">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="small">Small (1K)</TabsTrigger>
          <TabsTrigger value="medium">Medium (100K)</TabsTrigger>
          <TabsTrigger value="large">Large (10M)</TabsTrigger>
          <TabsTrigger value="global">Global (100M+)</TabsTrigger>
        </TabsList>

        <TabsContent value="small" className="space-y-6">
          <ScenarioCard
            title="Small Community"
            subtitle="100-1,000 users"
            example="A neighborhood, small town, or local organization"
            monthlyCost={50}
            yearlyCost={600}
            perUserYearly={0.60}
            components={[
              { name: 'User Devices (P2P)', cost: 0, description: 'Each user\'s browser stores their own submissions' },
              { name: 'IPFS Pinning', cost: 20, description: 'Free tier + small paid tier for 1-5 GB' },
              { name: 'Coordination Nodes', cost: 60, description: '3 small VPS servers for BFT consensus' },
              { name: 'DNS + Domain', cost: 1, description: 'Annual domain registration (pro-rated)' },
            ]}
            whoPaysList={[
              'Community fund (each user contributes $1-2/year)',
              'Local organization sponsors it',
              'Volunteer-run (donated server credits)'
            ]}
          />
        </TabsContent>

        <TabsContent value="medium" className="space-y-6">
          <ScenarioCard
            title="Mid-Size Region"
            subtitle="10,000-100,000 users"
            example="A city, county, or large organization"
            monthlyCost={300}
            yearlyCost={3500}
            perUserYearly={0.035}
            oneTimeCost={50}
            components={[
              { name: 'User Devices (P2P)', cost: 0, description: '200-500 power users run dedicated nodes' },
              { name: 'IPFS Pinning', cost: 70, description: 'Pinata Pro for 100-500 GB' },
              { name: 'Filecoin Storage', cost: 0.05, description: '500 GB permanent archive (~$0.0001/GB/month)' },
              { name: 'Arweave Storage', cost: 0, description: '$50 one-time for 100 GB critical records' },
              { name: 'Coordination Nodes', cost: 200, description: '5 medium VPS servers for BFT' },
              { name: 'Load Balancer + CDN', cost: 30, description: 'Cloudflare or AWS CloudFront' },
            ]}
            whoPaysList={[
              'Municipal/county budget ($3,500/year = less than 1 employee)',
              'Community co-op (each user pays $0.35/year)',
              'Sponsored by local businesses'
            ]}
          />
        </TabsContent>

        <TabsContent value="large" className="space-y-6">
          <ScenarioCard
            title="Large Region/State"
            subtitle="1-10 million users"
            example="A state, province, or national pilot program"
            monthlyCost={6400}
            yearlyCost={76800}
            perUserYearly={0.0077}
            oneTimeCost={500}
            components={[
              { name: 'User Devices (P2P)', cost: 0, description: '10,000+ dedicated community nodes' },
              { name: 'IPFS Cluster', cost: 500, description: 'Enterprise tier or self-hosted for 5-10 TB' },
              { name: 'Filecoin Storage', cost: 1, description: '10 TB permanent archive' },
              { name: 'Arweave Storage', cost: 0, description: '$500 one-time for 1 TB critical records' },
              { name: 'Coordination Nodes', cost: 1200, description: '15 high-performance servers globally distributed' },
              { name: 'Database Cluster', cost: 600, description: 'PostgreSQL replicas for fast queries' },
              { name: 'Monitoring & Security', cost: 100, description: 'Prometheus, Grafana, DDoS protection' },
              { name: 'Developer Maintenance', cost: 4000, description: 'Part-time devops engineer (20 hrs/week)' },
            ]}
            whoPaysList={[
              'State budget allocation (less than 2 full-time employees)',
              'User fees ($0.08/user/year)',
              'Public-private partnership'
            ]}
          />
        </TabsContent>

        <TabsContent value="global" className="space-y-6">
          <ScenarioCard
            title="Global Scale"
            subtitle="100+ million users"
            example="International deployment across multiple countries"
            monthlyCost={70000}
            yearlyCost={840000}
            perUserYearly={0.0084}
            oneTimeCost={5000}
            components={[
              { name: 'User Devices (P2P)', cost: 0, description: '500,000+ community nodes worldwide' },
              { name: 'IPFS Global Network', cost: 3000, description: '50 self-hosted nodes globally for 100+ TB' },
              { name: 'Filecoin Storage', cost: 10, description: '100 TB permanent archive' },
              { name: 'Arweave Storage', cost: 0, description: '$5,000 one-time for 10 TB governance records' },
              { name: 'Coordination Nodes', cost: 12000, description: '100 servers across 6 continents' },
              { name: 'Database Sharding', cost: 8000, description: 'CockroachDB or distributed SQL (20 nodes)' },
              { name: 'CDN & Edge Computing', cost: 2000, description: 'Cloudflare Enterprise' },
              { name: 'Security & Compliance', cost: 5000, description: 'Audits, bug bounties, legal compliance' },
              { name: 'Development Team', cost: 40000, description: '5 full-time engineers + specialists' },
            ]}
            whoPaysList={[
              'Foundation/DAO with grant funding',
              'Consortium of participating governments ($0.008/user/year)',
              'Decentralized treasury (influence staking generates fees)'
            ]}
          />
        </TabsContent>
      </Tabs>

      <ComparisonTable />
      
      <WhyCheaper />
      
      <TreasuryModel />
      
      <ComponentCosts />
      
      <Weaknesses />
    </div>
  )
}

interface ScenarioCardProps {
  title: string
  subtitle: string
  example: string
  monthlyCost: number
  yearlyCost: number
  perUserYearly: number
  oneTimeCost?: number
  components: Array<{ name: string; cost: number; description: string }>
  whoPaysList: string[]
}

function ScenarioCard({ 
  title, 
  subtitle, 
  example, 
  monthlyCost, 
  yearlyCost, 
  perUserYearly,
  oneTimeCost,
  components,
  whoPaysList
}: ScenarioCardProps) {
  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-1">{title}</h2>
          <p className="text-sm text-muted-foreground mb-2">{subtitle}</p>
          <p className="text-sm italic">Example: {example}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-secondary/50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <CurrencyDollar size={20} className="text-accent" />
              <span className="text-sm font-medium">Monthly Cost</span>
            </div>
            <p className="text-2xl font-bold">${monthlyCost.toLocaleString()}</p>
          </div>
          
          <div className="bg-secondary/50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <ChartBar size={20} className="text-accent" />
              <span className="text-sm font-medium">Yearly Cost</span>
            </div>
            <p className="text-2xl font-bold">${yearlyCost.toLocaleString()}</p>
            {oneTimeCost && (
              <p className="text-xs text-muted-foreground mt-1">
                + ${oneTimeCost} one-time
              </p>
            )}
          </div>
          
          <div className="bg-accent/20 p-4 rounded-lg border border-accent">
            <div className="flex items-center gap-2 mb-2">
              <Coins size={20} className="text-accent" />
              <span className="text-sm font-medium">Per User/Year</span>
            </div>
            <p className="text-2xl font-bold">${perUserYearly}</p>
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Database size={18} />
            Infrastructure Components
          </h3>
          <div className="space-y-2">
            {components.map((component, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 bg-secondary/30 rounded">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm">{component.name}</span>
                    <span className="text-sm font-mono">
                      ${component.cost === 0 ? '0' : component.cost.toLocaleString()}/mo
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{component.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Who Pays?</h3>
          <ul className="space-y-2">
            {whoPaysList.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm">
                <CheckCircle size={16} className="text-success flex-shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Card>
  )
}

function ComparisonTable() {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold mb-4">Cost Comparison to Traditional Systems</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left p-2">System Type</th>
              <th className="text-right p-2">Users</th>
              <th className="text-right p-2">Annual Cost</th>
              <th className="text-right p-2">Per-User Cost</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border/50">
              <td className="p-2">Traditional Gov Portal</td>
              <td className="text-right p-2">100,000</td>
              <td className="text-right p-2">$500,000-2M</td>
              <td className="text-right p-2 text-destructive">$5-20/user</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="p-2">Enterprise SaaS</td>
              <td className="text-right p-2">100,000</td>
              <td className="text-right p-2">$1-5M</td>
              <td className="text-right p-2 text-destructive">$10-50/user</td>
            </tr>
            <tr className="bg-accent/20">
              <td className="p-2 font-bold">THE RECORD</td>
              <td className="text-right p-2 font-bold">100,000</td>
              <td className="text-right p-2 font-bold">$3,500</td>
              <td className="text-right p-2 font-bold text-success">$0.035/user</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="text-sm text-muted-foreground mt-4">
        THE RECORD is <strong>100-1000x cheaper</strong> than traditional systems because data lives 
        on user devices and decentralized networks, not expensive centralized servers.
      </p>
    </Card>
  )
}

function WhyCheaper() {
  const reasons = [
    {
      icon: <HardDrive size={24} />,
      title: 'Data Lives on User Devices',
      before: 'Central database stores EVERYTHING → Scales linearly with users',
      after: 'Users store their own submissions → Scales logarithmically'
    },
    {
      icon: <Cloud size={24} />,
      title: 'No Application Servers',
      before: 'Needs servers to render pages → High CPU usage',
      after: 'Static files + client-side app → 10x less CPU needed'
    },
    {
      icon: <Database size={24} />,
      title: 'Permanent Storage Is One-Time',
      before: '$0.023/GB/month (AWS S3) → Recurring forever',
      after: '$0.50/GB one-time (Arweave) → Pay once, stored forever'
    },
    {
      icon: <ArrowsClockwise size={24} />,
      title: 'Byzantine Consensus Is Efficient',
      before: '10,000+ mining nodes → Massive energy waste',
      after: '3-15 validator nodes → Deterministic finality'
    }
  ]

  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold mb-4">Why THE RECORD Is 100x Cheaper</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reasons.map((reason, idx) => (
          <div key={idx} className="p-4 bg-secondary/30 rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <div className="text-accent">{reason.icon}</div>
              <h3 className="font-semibold">{reason.title}</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <WarningCircle size={16} className="text-destructive flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground">{reason.before}</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle size={16} className="text-success flex-shrink-0 mt-0.5" />
                <span className="text-foreground font-medium">{reason.after}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

function TreasuryModel() {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold mb-4">How Servers Are Paid For: The Treasury Model</h2>
      <p className="text-sm text-muted-foreground mb-4">
        THE RECORD uses a decentralized treasury funded by multiple sources:
      </p>
      <div className="space-y-4">
        <div className="p-4 bg-secondary/30 rounded-lg">
          <h3 className="font-semibold mb-2">1. Influence Slashing Revenue</h3>
          <p className="text-sm text-muted-foreground mb-2">
            When validators or users make false claims:
          </p>
          <div className="bg-background/50 p-3 rounded font-mono text-xs">
            <div>User stakes 100 influence on false claim</div>
            <div>→ Claim is disproven</div>
            <div>→ 100 influence goes to treasury</div>
            <div>→ Treasury converts to $$ for servers</div>
          </div>
        </div>

        <div className="p-4 bg-secondary/30 rounded-lg">
          <h3 className="font-semibold mb-2">2. Optional Professional Validation Fees</h3>
          <p className="text-sm text-muted-foreground mb-2">
            Communities can hire expert validators:
          </p>
          <div className="bg-background/50 p-3 rounded font-mono text-xs">
            <div>Civil engineer validates "Bridge is unsafe"</div>
            <div>→ Community pays $50 for expert review</div>
            <div>→ 20% ($10) → treasury</div>
            <div>→ 80% ($40) → professional</div>
          </div>
        </div>

        <div className="p-4 bg-secondary/30 rounded-lg">
          <h3 className="font-semibold mb-2">3. Grant Funding (Bootstrap Phase)</h3>
          <p className="text-sm text-muted-foreground">
            Initial deployment funded by civic tech grants, government innovation budgets, 
            and foundation grants (Gitcoin, Protocol Labs, etc.)
          </p>
        </div>

        <div className="p-4 bg-secondary/30 rounded-lg">
          <h3 className="font-semibold mb-2">4. Community Contributions</h3>
          <p className="text-sm text-muted-foreground">
            Users can donate spare server capacity (run a node), monthly subscriptions ($1-5/month), 
            or one-time donations
          </p>
        </div>
      </div>
    </Card>
  )
}

function ComponentCosts() {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold mb-4">Cost Breakdown by Component</h2>
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold mb-2">Signal Storage (L1)</h3>
          <div className="text-sm space-y-1">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Cost per signal:</span>
              <span className="font-mono">$0.00001</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">1 million signals/year:</span>
              <span className="font-mono font-bold">$10/year</span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Aggregated Problems (L2)</h3>
          <div className="text-sm space-y-1">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Cost per problem:</span>
              <span className="font-mono">$0.001</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">10,000 problems/year:</span>
              <span className="font-mono font-bold">$10/year</span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Settlement Records (L3)</h3>
          <div className="text-sm space-y-1">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Cost per settlement:</span>
              <span className="font-mono">$0.01 (one-time)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">1,000 settlements:</span>
              <span className="font-mono font-bold">$10 (one-time)</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}

function Weaknesses() {
  return (
    <Card className="p-6 border-destructive/50">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <WarningCircle size={24} className="text-destructive" />
        Weaknesses & Mitigation
      </h2>
      <div className="space-y-4">
        <div className="p-4 bg-destructive/10 rounded-lg">
          <h3 className="font-semibold mb-2">Weakness: "If Users Don't Run Nodes, Data Is Lost"</h3>
          <p className="text-sm text-muted-foreground mb-2">Mitigation:</p>
          <div className="text-sm space-y-1">
            <div>✓ Multi-layer redundancy (5 backup systems)</div>
            <div>✓ IPFS network (100+ volunteer nodes)</div>
            <div>✓ Filecoin miners (paid storage)</div>
            <div>✓ Arweave (permanent archive)</div>
            <div>✓ Community nodes (local volunteers)</div>
            <div className="font-bold mt-2">Probability of total data loss: {'<'} 0.00001%</div>
          </div>
        </div>

        <div className="p-4 bg-destructive/10 rounded-lg">
          <h3 className="font-semibold mb-2">Weakness: "What If Treasury Runs Out?"</h3>
          <p className="text-sm text-muted-foreground mb-2">Mitigation:</p>
          <div className="text-sm space-y-1">
            <div>✓ Alert community if balance {'<'} 3 months runway</div>
            <div>✓ Emergency governance vote if balance {'<'} 1 month</div>
            <div>✓ Reduce non-critical services gracefully</div>
            <div className="font-bold mt-2">Data is ALWAYS preserved (Arweave permanent storage)</div>
          </div>
        </div>

        <div className="p-4 bg-destructive/10 rounded-lg">
          <h3 className="font-semibold mb-2">Weakness: "What If Hosting Providers Shut Down?"</h3>
          <p className="text-sm text-muted-foreground mb-2">Mitigation:</p>
          <div className="text-sm space-y-1">
            <div>✓ Nodes across 5+ cloud providers</div>
            <div>✓ Self-hosted nodes in community data centers</div>
            <div>✓ Kubernetes for easy migration</div>
            <div className="font-bold mt-2">Can rebuild entire system in {'<'} 1 hour</div>
          </div>
        </div>
      </div>
    </Card>
  )
}

function RevenueStreams() {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <TrendUp size={28} className="text-success" />
          Revenue Streams: How The Record Makes Money
        </h2>
        <p className="text-sm text-muted-foreground mb-6">
          The Record generates revenue through multiple sustainable mechanisms that align incentives 
          with truth-seeking behavior. All revenue flows into the transparent treasury.
        </p>

        <div className="space-y-4">
          <div className="p-5 bg-success/10 border border-success/30 rounded-lg">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-bold text-lg mb-1">1. Influence Slashing (Primary Revenue)</h3>
                <p className="text-xs text-muted-foreground">~70-80% of total revenue</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-success">$$$</div>
              </div>
            </div>
            <p className="text-sm mb-3">
              When users make false claims or validators approve incorrect information, their staked 
              influence is slashed and flows to the treasury.
            </p>
            <div className="bg-background/80 p-4 rounded font-mono text-xs space-y-1">
              <div className="text-muted-foreground">// Example flow</div>
              <div>User stakes <span className="text-accent">100</span> influence on claim: "Bridge collapsed"</div>
              <div>→ Reality check reveals: Bridge is intact</div>
              <div>→ <span className="text-destructive">100 influence slashed</span></div>
              <div>→ <span className="text-success">100 influence → Treasury</span></div>
              <div>→ Treasury converts to operational funds</div>
            </div>
            <div className="mt-3 p-3 bg-accent/10 rounded">
              <div className="text-sm font-semibold mb-1">Revenue Scale Examples:</div>
              <div className="text-xs space-y-1">
                <div>• Small community (1K users, 2% error rate): ~$50-100/month</div>
                <div>• Medium city (100K users, 1.5% error rate): ~$500-1000/month</div>
                <div>• Large region (10M users, 1% error rate): ~$10,000-20,000/month</div>
              </div>
            </div>
          </div>

          <div className="p-5 bg-primary/10 border border-primary/30 rounded-lg">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-bold text-lg mb-1">2. Professional Validation Fees (Optional)</h3>
                <p className="text-xs text-muted-foreground">~10-20% of total revenue</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary">$$</div>
              </div>
            </div>
            <p className="text-sm mb-3">
              Communities can request expert validation for critical infrastructure decisions. 
              Professionals are paid for their work, with a percentage going to the treasury.
            </p>
            <div className="bg-background/80 p-4 rounded font-mono text-xs space-y-1">
              <div className="text-muted-foreground">// Example flow</div>
              <div>Problem: "Water main needs replacement - $500K project"</div>
              <div>→ Community requests civil engineer review</div>
              <div>→ Engineer charges <span className="text-accent">$200</span> for detailed inspection</div>
              <div>→ <span className="text-primary">$160 → Professional</span></div>
              <div>→ <span className="text-success">$40 (20%) → Treasury</span></div>
            </div>
            <div className="mt-3 p-3 bg-accent/10 rounded text-xs">
              <div className="font-semibold mb-1">Fee Structure:</div>
              <div>• 80% to the professional</div>
              <div>• 20% to treasury for infrastructure costs</div>
            </div>
          </div>

          <div className="p-5 bg-accent/10 border border-accent/30 rounded-lg">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-bold text-lg mb-1">3. Priority Escalation Fees (Micro-transactions)</h3>
                <p className="text-xs text-muted-foreground">~5-10% of total revenue</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-accent">$</div>
              </div>
            </div>
            <p className="text-sm mb-3">
              Users can pay small fees to fast-track urgent issues (water main break, gas leak) to 
              immediate validator attention instead of waiting in the queue.
            </p>
            <div className="bg-background/80 p-4 rounded font-mono text-xs space-y-1">
              <div className="text-muted-foreground">// Example flow</div>
              <div>User reports: "Gas leak at 123 Main St"</div>
              <div>→ Pays <span className="text-accent">$2 priority fee</span></div>
              <div>→ Issue jumps to front of validation queue</div>
              <div>→ <span className="text-success">$2 → Treasury</span></div>
            </div>
            <div className="mt-3 p-3 bg-accent/10 rounded text-xs">
              <div className="font-semibold mb-1">Fee Ranges:</div>
              <div>• Low priority: Free (standard queue)</div>
              <div>• Medium priority: $1-5 (24hr validation)</div>
              <div>• High priority: $10-20 (2hr validation)</div>
              <div>• Emergency: Free but requires 3+ attestations</div>
            </div>
          </div>

          <div className="p-5 bg-secondary/50 border border-border rounded-lg">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-bold text-lg mb-1">4. Grant Funding (Bootstrap & Growth)</h3>
                <p className="text-xs text-muted-foreground">Early stage: 50-100% / Mature: 0-5%</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-foreground">$$$</div>
              </div>
            </div>
            <p className="text-sm mb-3">
              Initial deployment and expansion funded by civic tech grants, government innovation budgets, 
              and foundation support.
            </p>
            <div className="bg-background/80 p-4 rounded text-xs space-y-2">
              <div>
                <div className="font-semibold mb-1">Potential Grant Sources:</div>
                <div className="space-y-1">
                  <div>• Protocol Labs / Filecoin Foundation: $50K-500K</div>
                  <div>• Gitcoin Public Goods Funding: $10K-100K/round</div>
                  <div>• Government Innovation Grants: $100K-2M</div>
                  <div>• Civic Tech Foundations: $25K-200K</div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-5 bg-secondary/50 border border-border rounded-lg">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-bold text-lg mb-1">5. Community Contributions (Optional)</h3>
                <p className="text-xs text-muted-foreground">~5-10% of total revenue</p>
              </div>
            </div>
            <p className="text-sm mb-3">
              Users can voluntarily contribute to support their local deployment:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="bg-background/80 p-3 rounded">
                <div className="font-semibold mb-1">Server Capacity</div>
                <div className="text-muted-foreground">Run a validator node from home</div>
              </div>
              <div className="bg-background/80 p-3 rounded">
                <div className="font-semibold mb-1">Monthly Donations</div>
                <div className="text-muted-foreground">$1-10/month recurring</div>
              </div>
              <div className="bg-background/80 p-3 rounded">
                <div className="font-semibold mb-1">One-Time Gifts</div>
                <div className="text-muted-foreground">Any amount, any time</div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-success/10 border-success">
        <h3 className="font-bold text-lg mb-3">Projected Annual Revenue by Scale</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-2">Deployment Size</th>
                <th className="text-right p-2">Influence Slashing</th>
                <th className="text-right p-2">Professional Fees</th>
                <th className="text-right p-2">Priority Fees</th>
                <th className="text-right p-2">Total Annual</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border/50">
                <td className="p-2">Small (1K users)</td>
                <td className="text-right p-2 font-mono">$600</td>
                <td className="text-right p-2 font-mono">$100</td>
                <td className="text-right p-2 font-mono">$50</td>
                <td className="text-right p-2 font-bold text-success">$750/year</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="p-2">Medium (100K users)</td>
                <td className="text-right p-2 font-mono">$8,000</td>
                <td className="text-right p-2 font-mono">$2,000</td>
                <td className="text-right p-2 font-mono">$1,000</td>
                <td className="text-right p-2 font-bold text-success">$11,000/year</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="p-2">Large (10M users)</td>
                <td className="text-right p-2 font-mono">$180,000</td>
                <td className="text-right p-2 font-mono">$50,000</td>
                <td className="text-right p-2 font-mono">$20,000</td>
                <td className="text-right p-2 font-bold text-success">$250,000/year</td>
              </tr>
              <tr className="bg-success/20">
                <td className="p-2 font-bold">Global (100M users)</td>
                <td className="text-right p-2 font-mono">$2,000,000</td>
                <td className="text-right p-2 font-mono">$600,000</td>
                <td className="text-right p-2 font-mono">$200,000</td>
                <td className="text-right p-2 font-bold text-success">$2.8M/year</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          * Assumes 1-2% error rate (claims that get slashed), typical professional validation request rate, 
          and ~5% of users using priority escalation features.
        </p>
      </Card>
    </div>
  )
}

function TreasuryStorage() {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Vault size={28} className="text-accent" />
          Treasury Storage: How Money Is Kept Safe
        </h2>
        <p className="text-sm text-muted-foreground mb-6">
          The Record uses a multi-signature decentralized treasury to ensure funds cannot be stolen, 
          misused, or frozen by any single party.
        </p>

        <div className="space-y-4">
          <div className="p-5 bg-primary/10 border border-primary/30 rounded-lg">
            <h3 className="font-bold text-lg mb-3">Storage Architecture</h3>
            <div className="space-y-3">
              <div className="bg-background/80 p-4 rounded">
                <div className="font-semibold mb-2 flex items-center gap-2">
                  <CheckCircle size={18} className="text-success" />
                  Primary: Multi-Signature Smart Contract
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  Funds are held in a 3-of-5 or 5-of-9 multi-sig wallet on Ethereum or similar blockchain.
                </p>
                <div className="bg-background p-3 rounded font-mono text-xs space-y-1">
                  <div className="text-muted-foreground">// Wallet Structure</div>
                  <div>5 keyholders required to spend funds:</div>
                  <div>• 2 elected community representatives</div>
                  <div>• 1 technical operations lead</div>
                  <div>• 1 independent auditor</div>
                  <div>• 1 backup key (time-locked, emergency only)</div>
                  <div className="mt-2 text-success">→ Requires 3 signatures to spend</div>
                </div>
              </div>

              <div className="bg-background/80 p-4 rounded">
                <div className="font-semibold mb-2 flex items-center gap-2">
                  <CheckCircle size={18} className="text-success" />
                  Secondary: Transparent Accounting Ledger
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  Every transaction is recorded in The Record's own immutable ledger for public audit.
                </p>
                <div className="bg-background p-3 rounded font-mono text-xs space-y-1">
                  <div className="text-muted-foreground">// Every transaction includes</div>
                  <div>timestamp: <span className="text-accent">"2025-06-15T14:23:00Z"</span></div>
                  <div>amount: <span className="text-accent">$500</span></div>
                  <div>purpose: <span className="text-accent">"Server hosting - June 2025"</span></div>
                  <div>approvers: <span className="text-accent">[addr1, addr2, addr3]</span></div>
                  <div>txHash: <span className="text-accent">"0x7a3f..."</span></div>
                </div>
              </div>

              <div className="bg-background/80 p-4 rounded">
                <div className="font-semibold mb-2 flex items-center gap-2">
                  <CheckCircle size={18} className="text-success" />
                  Tertiary: Reserve Fund (Stablecoin Diversification)
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  Treasury maintains 6-12 months operating reserves across multiple stablecoins to hedge risk.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs mt-2">
                  <div className="bg-background p-2 rounded">
                    <div className="font-semibold">40% USDC</div>
                    <div className="text-muted-foreground">Circle-backed</div>
                  </div>
                  <div className="bg-background p-2 rounded">
                    <div className="font-semibold">40% DAI</div>
                    <div className="text-muted-foreground">Decentralized</div>
                  </div>
                  <div className="bg-background p-2 rounded">
                    <div className="font-semibold">20% ETH/BTC</div>
                    <div className="text-muted-foreground">Long-term hedge</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-5 bg-accent/10 border border-accent/30 rounded-lg">
            <h3 className="font-bold text-lg mb-3">Security Mechanisms</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-background/80 rounded">
                <CheckCircle size={20} className="text-success flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-sm">Time-Lock for Large Withdrawals</div>
                  <div className="text-xs text-muted-foreground">
                    Any transaction &gt; $10,000 requires 72-hour public notice period before execution
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-background/80 rounded">
                <CheckCircle size={20} className="text-success flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-sm">Automatic Budget Limits</div>
                  <div className="text-xs text-muted-foreground">
                    Smart contract enforces max monthly spending caps (e.g., 15% of total treasury per month)
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-background/80 rounded">
                <CheckCircle size={20} className="text-success flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-sm">Emergency Freeze Capability</div>
                  <div className="text-xs text-muted-foreground">
                    If suspicious activity detected, any 2 keyholders can freeze treasury for 48hrs pending investigation
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-background/80 rounded">
                <CheckCircle size={20} className="text-success flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-sm">Quarterly Public Audits</div>
                  <div className="text-xs text-muted-foreground">
                    Independent auditor reviews all transactions and publishes report to The Record
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-5 bg-destructive/10 border border-destructive/30 rounded-lg">
            <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
              <WarningCircle size={22} className="text-destructive" />
              What If The Treasury Is Compromised?
            </h3>
            <div className="space-y-3 text-sm">
              <div>
                <div className="font-semibold mb-1">Scenario: All 5 Keyholders Collude</div>
                <div className="text-muted-foreground text-xs mb-2">
                  Probability: &lt; 0.01% (requires corruption of elected reps, technical lead, AND independent auditor)
                </div>
                <div className="bg-background/80 p-3 rounded text-xs space-y-1">
                  <div className="text-destructive font-semibold">Impact:</div>
                  <div>• Treasury funds could be stolen (operational funds only)</div>
                  <div>• <strong>User data remains safe</strong> (stored on IPFS/Filecoin/Arweave)</div>
                  <div>• <strong>Influence system continues</strong> (runs on-chain, separate from treasury)</div>
                  <div>• Community can fork the system with new treasury</div>
                  <div className="mt-2 text-success font-semibold">Recovery:</div>
                  <div>• Emergency governance vote within 24 hours</div>
                  <div>• Deploy new multi-sig with new keyholders</div>
                  <div>• Freeze compromised wallet via blockchain governance</div>
                  <div>• System back online in &lt; 48 hours</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-primary/10 border-primary">
        <h3 className="font-bold text-lg mb-3">Treasury Balance Targets</h3>
        <p className="text-sm text-muted-foreground mb-4">
          The Record maintains reserves to ensure uninterrupted service even during revenue fluctuations.
        </p>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-background/80 rounded">
            <div>
              <div className="font-semibold">Minimum Reserve (3 months)</div>
              <div className="text-xs text-muted-foreground">Triggers community alert</div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold">25% of annual costs</div>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-success/10 rounded border border-success/30">
            <div>
              <div className="font-semibold text-success">Target Reserve (6-12 months)</div>
              <div className="text-xs text-muted-foreground">Healthy operating range</div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-success">50-100% of annual costs</div>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-background/80 rounded">
            <div>
              <div className="font-semibold">Maximum Reserve (18+ months)</div>
              <div className="text-xs text-muted-foreground">Excess distributed to community projects</div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold">150%+ of annual costs</div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

function MoneyDistribution() {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <TrendDown size={28} className="text-primary" />
          Distribution: How Money Flows Out
        </h2>
        <p className="text-sm text-muted-foreground mb-6">
          Treasury funds are distributed transparently according to predetermined budgets and community governance.
        </p>

        <div className="space-y-4">
          <div className="p-5 bg-primary/10 border border-primary/30 rounded-lg">
            <h3 className="font-bold text-lg mb-3">Monthly Operating Budget Breakdown</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Example: Medium-sized deployment (100K users, $300/month operating cost)
            </p>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-full bg-background rounded overflow-hidden">
                  <div className="bg-accent h-8 flex items-center px-3 text-sm font-semibold" style={{ width: '60%' }}>
                    Infrastructure (60%) - $180
                  </div>
                </div>
              </div>
              <div className="pl-6 text-xs text-muted-foreground space-y-1">
                <div>• Server hosting: $100</div>
                <div>• IPFS pinning: $40</div>
                <div>• Database: $20</div>
                <div>• CDN & bandwidth: $15</div>
                <div>• Monitoring tools: $5</div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-full bg-background rounded overflow-hidden">
                  <div className="bg-success h-8 flex items-center px-3 text-sm font-semibold" style={{ width: '25%' }}>
                    Validator Rewards (25%) - $75
                  </div>
                </div>
              </div>
              <div className="pl-6 text-xs text-muted-foreground space-y-1">
                <div>• Split among 5-15 validator nodes</div>
                <div>• Weighted by uptime & accuracy</div>
                <div>• ~$5-15 per validator/month</div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-full bg-background rounded overflow-hidden">
                  <div className="bg-primary h-8 flex items-center px-3 text-sm font-semibold" style={{ width: '10%' }}>
                    Development (10%) - $30
                  </div>
                </div>
              </div>
              <div className="pl-6 text-xs text-muted-foreground space-y-1">
                <div>• Bug fixes & updates</div>
                <div>• Security patches</div>
                <div>• Feature improvements</div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-full bg-background rounded overflow-hidden">
                  <div className="bg-secondary h-8 flex items-center px-3 text-sm font-semibold text-foreground" style={{ width: '5%' }}>
                    Reserve (5%) - $15
                  </div>
                </div>
              </div>
              <div className="pl-6 text-xs text-muted-foreground">
                <div>• Builds emergency fund</div>
              </div>
            </div>
          </div>

          <div className="p-5 bg-accent/10 border border-accent/30 rounded-lg">
            <h3 className="font-bold text-lg mb-3">Validator Reward Distribution</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Validators earn rewards based on performance metrics, not just participation.
            </p>

            <div className="bg-background/80 p-4 rounded font-mono text-xs space-y-2">
              <div className="text-muted-foreground">// Reward calculation formula</div>
              <div>validatorReward = baseReward × performanceMultiplier</div>
              <div className="mt-2 space-y-1">
                <div>where performanceMultiplier =</div>
                <div className="pl-4">• Uptime: 0-40% (must be &gt;99.5% uptime)</div>
                <div className="pl-4">• Accuracy: 0-40% (% of correct validations)</div>
                <div className="pl-4">• Speed: 0-20% (avg response time)</div>
              </div>
              <div className="mt-3 text-muted-foreground">// Example</div>
              <div>Monthly validator pool: <span className="text-accent">$75</span></div>
              <div>5 active validators</div>
              <div>Validator A: 99.9% uptime, 98% accuracy, fast → gets <span className="text-success">$20</span></div>
              <div>Validator B: 99.5% uptime, 95% accuracy, medium → gets <span className="text-success">$17</span></div>
              <div>Validator C: 99.8% uptime, 92% accuracy, slow → gets <span className="text-success">$14</span></div>
              <div>...etc</div>
            </div>
          </div>

          <div className="p-5 bg-secondary/50 border border-border rounded-lg">
            <h3 className="font-bold text-lg mb-3">Automatic Payment Schedule</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-background/80 rounded">
                <Lightning size={20} className="text-accent flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-sm">Daily: Infrastructure Auto-Pay</div>
                  <div className="text-xs text-muted-foreground">
                    Server hosting, IPFS, database costs paid automatically from treasury (pre-approved monthly budget)
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-background/80 rounded">
                <Lightning size={20} className="text-accent flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-sm">Weekly: Validator Payouts</div>
                  <div className="text-xs text-muted-foreground">
                    Every Sunday at midnight UTC, validator rewards calculated and distributed
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-background/80 rounded">
                <Lightning size={20} className="text-accent flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-sm">Monthly: Development & Maintenance</div>
                  <div className="text-xs text-muted-foreground">
                    Contractors paid on 1st of each month for previous month's work (invoice-based)
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-background/80 rounded">
                <Lightning size={20} className="text-accent flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-sm">Quarterly: Governance Review</div>
                  <div className="text-xs text-muted-foreground">
                    Community votes on budget adjustments, new allocations, reserve fund usage
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-5 bg-success/10 border border-success/30 rounded-lg">
            <h3 className="font-bold text-lg mb-3">Surplus Distribution Policy</h3>
            <p className="text-sm text-muted-foreground mb-4">
              When treasury exceeds 150% of annual operating costs, surplus is distributed:
            </p>

            <div className="space-y-3">
              <div className="p-3 bg-background/80 rounded">
                <div className="font-semibold text-sm mb-2">40% → Community Projects</div>
                <div className="text-xs text-muted-foreground">
                  Fund local infrastructure improvements, community initiatives identified by The Record
                </div>
              </div>

              <div className="p-3 bg-background/80 rounded">
                <div className="font-semibold text-sm mb-2">30% → Validator Bonuses</div>
                <div className="text-xs text-muted-foreground">
                  Reward high-performing validators who kept the system running smoothly
                </div>
              </div>

              <div className="p-3 bg-background/80 rounded">
                <div className="font-semibold text-sm mb-2">20% → Development Fund</div>
                <div className="text-xs text-muted-foreground">
                  Accelerate new features, security audits, and system improvements
                </div>
              </div>

              <div className="p-3 bg-background/80 rounded">
                <div className="font-semibold text-sm mb-2">10% → Emergency Reserve</div>
                <div className="text-xs text-muted-foreground">
                  Maintain buffer for unexpected costs or economic downturns
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-destructive/10 border-destructive">
        <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
          <WarningCircle size={22} className="text-destructive" />
          Failure Modes & Automatic Safeguards
        </h3>
        <div className="space-y-3">
          <div className="p-3 bg-background/80 rounded">
            <div className="font-semibold text-sm mb-1">Scenario: Treasury Runs Low (1-3 month runway)</div>
            <div className="text-xs space-y-1">
              <div>→ <span className="text-destructive">Alert</span> sent to all community members</div>
              <div>→ Emergency funding drive initiated</div>
              <div>→ Non-critical services gracefully degraded (CDN → basic hosting)</div>
              <div>→ <span className="text-success">Core functions always preserved</span> (data storage, validation)</div>
            </div>
          </div>

          <div className="p-3 bg-background/80 rounded">
            <div className="font-semibold text-sm mb-1">Scenario: Validator Rewards Too Low (volunteers quit)</div>
            <div className="text-xs space-y-1">
              <div>→ System detects declining validator count</div>
              <div>→ Automatically increases % of budget allocated to validators</div>
              <div>→ Community vote on permanent budget adjustment</div>
            </div>
          </div>

          <div className="p-3 bg-background/80 rounded">
            <div className="font-semibold text-sm mb-1">Scenario: Infrastructure Costs Spike Unexpectedly</div>
            <div className="text-xs space-y-1">
              <div>→ Emergency reserve fund tapped (5-10% buffer)</div>
              <div>→ Governance notified within 24 hours</div>
              <div>→ Temporary spending freeze on non-essential items</div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

function InfrastructureCostTabs() {
  return (
    <>
      <Card className="p-6 bg-accent/20 border-accent">
        <div className="flex items-start gap-4">
          <CheckCircle size={32} weight="fill" className="text-success flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold text-lg mb-2">Core Principle: Data Lives on the Edges</h3>
            <p className="text-sm text-muted-foreground">
              THE RECORD achieves <strong>sub-penny per-user costs</strong> by storing data on user devices 
              and decentralized networks, not expensive centralized servers. This means costs scale 
              logarithmically, not linearly.
            </p>
          </div>
        </div>
      </Card>

      <Tabs defaultValue="small">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="small">Small (1K)</TabsTrigger>
          <TabsTrigger value="medium">Medium (100K)</TabsTrigger>
          <TabsTrigger value="large">Large (10M)</TabsTrigger>
          <TabsTrigger value="global">Global (100M+)</TabsTrigger>
        </TabsList>

        <TabsContent value="small" className="space-y-6">
          <ScenarioCard
            title="Small Community"
            subtitle="100-1,000 users"
            example="A neighborhood, small town, or local organization"
            monthlyCost={50}
            yearlyCost={600}
            perUserYearly={0.60}
            components={[
              { name: 'User Devices (P2P)', cost: 0, description: 'Each user\'s browser stores their own submissions' },
              { name: 'IPFS Pinning', cost: 20, description: 'Free tier + small paid tier for 1-5 GB' },
              { name: 'Coordination Nodes', cost: 60, description: '3 small VPS servers for BFT consensus' },
              { name: 'DNS + Domain', cost: 1, description: 'Annual domain registration (pro-rated)' },
            ]}
            whoPaysList={[
              'Community fund (each user contributes $1-2/year)',
              'Local organization sponsors it',
              'Volunteer-run (donated server credits)'
            ]}
          />
        </TabsContent>

        <TabsContent value="medium" className="space-y-6">
          <ScenarioCard
            title="Mid-Size Region"
            subtitle="10,000-100,000 users"
            example="A city, county, or large organization"
            monthlyCost={300}
            yearlyCost={3500}
            perUserYearly={0.035}
            oneTimeCost={50}
            components={[
              { name: 'User Devices (P2P)', cost: 0, description: '200-500 power users run dedicated nodes' },
              { name: 'IPFS Pinning', cost: 70, description: 'Pinata Pro for 100-500 GB' },
              { name: 'Filecoin Storage', cost: 0.05, description: '500 GB permanent archive (~$0.0001/GB/month)' },
              { name: 'Arweave Storage', cost: 0, description: '$50 one-time for 100 GB critical records' },
              { name: 'Coordination Nodes', cost: 200, description: '5 medium VPS servers for BFT' },
              { name: 'Load Balancer + CDN', cost: 30, description: 'Cloudflare or AWS CloudFront' },
            ]}
            whoPaysList={[
              'Municipal/county budget ($3,500/year = less than 1 employee)',
              'Community co-op (each user pays $0.35/year)',
              'Sponsored by local businesses'
            ]}
          />
        </TabsContent>

        <TabsContent value="large" className="space-y-6">
          <ScenarioCard
            title="Large Region/State"
            subtitle="1-10 million users"
            example="A state, province, or national pilot program"
            monthlyCost={6400}
            yearlyCost={76800}
            perUserYearly={0.0077}
            oneTimeCost={500}
            components={[
              { name: 'User Devices (P2P)', cost: 0, description: '10,000+ dedicated community nodes' },
              { name: 'IPFS Cluster', cost: 500, description: 'Enterprise tier or self-hosted for 5-10 TB' },
              { name: 'Filecoin Storage', cost: 1, description: '10 TB permanent archive' },
              { name: 'Arweave Storage', cost: 0, description: '$500 one-time for 1 TB critical records' },
              { name: 'Coordination Nodes', cost: 1200, description: '15 high-performance servers globally distributed' },
              { name: 'Database Cluster', cost: 600, description: 'PostgreSQL replicas for fast queries' },
              { name: 'Monitoring & Security', cost: 100, description: 'Prometheus, Grafana, DDoS protection' },
              { name: 'Developer Maintenance', cost: 4000, description: 'Part-time devops engineer (20 hrs/week)' },
            ]}
            whoPaysList={[
              'State budget allocation (less than 2 full-time employees)',
              'User fees ($0.08/user/year)',
              'Public-private partnership'
            ]}
          />
        </TabsContent>

        <TabsContent value="global" className="space-y-6">
          <ScenarioCard
            title="Global Scale"
            subtitle="100+ million users"
            example="International deployment across multiple countries"
            monthlyCost={70000}
            yearlyCost={840000}
            perUserYearly={0.0084}
            oneTimeCost={5000}
            components={[
              { name: 'User Devices (P2P)', cost: 0, description: '500,000+ community nodes worldwide' },
              { name: 'IPFS Global Network', cost: 3000, description: '50 self-hosted nodes globally for 100+ TB' },
              { name: 'Filecoin Storage', cost: 10, description: '100 TB permanent archive' },
              { name: 'Arweave Storage', cost: 0, description: '$5,000 one-time for 10 TB governance records' },
              { name: 'Coordination Nodes', cost: 12000, description: '100 servers across 6 continents' },
              { name: 'Database Sharding', cost: 8000, description: 'CockroachDB or distributed SQL (20 nodes)' },
              { name: 'CDN & Edge Computing', cost: 2000, description: 'Cloudflare Enterprise' },
              { name: 'Security & Compliance', cost: 5000, description: 'Audits, bug bounties, legal compliance' },
              { name: 'Development Team', cost: 40000, description: '5 full-time engineers + specialists' },
            ]}
            whoPaysList={[
              'Foundation/DAO with grant funding',
              'Consortium of participating governments ($0.008/user/year)',
              'Decentralized treasury (influence staking generates fees)'
            ]}
          />
        </TabsContent>
      </Tabs>

      <ComparisonTable />
      
      <WhyCheaper />
      
      <ComponentCosts />
      
      <Weaknesses />
    </>
  )
}
