import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { 
  ChartBar, 
  Coins, 
  Cloud, 
  Database, 
  HardDrive,
  CheckCircle,
  WarningCircle,
  ArrowsClockwise,
  CurrencyDollar
} from '@phosphor-icons/react'

export function CostBreakdown() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-mono mb-2">Cost Breakdown & Economics</h1>
        <p className="text-muted-foreground">
          Complete transparency on infrastructure costs, scaling, and sustainability
        </p>
      </div>

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
