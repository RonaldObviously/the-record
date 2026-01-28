import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import type { BlackBoxEntry } from '@/lib/types'

interface BlackBoxLogProps {
  entries: BlackBoxEntry[]
}

export function BlackBoxLog({ entries }: BlackBoxLogProps) {
  if (entries.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No recorded events yet.</p>
        <p className="text-sm mt-2">The Black Box logs all predictions, validations, and outcomes.</p>
      </div>
    )
  }

  const sortedEntries = [...entries].sort((a, b) => b.timestamp - a.timestamp)

  return (
    <ScrollArea className="h-[500px]">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-semibold">Timestamp</TableHead>
            <TableHead className="font-semibold">Type</TableHead>
            <TableHead className="font-semibold">Event Data</TableHead>
            <TableHead className="font-semibold text-center">Immutable</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedEntries.map(entry => (
            <TableRow key={entry.id}>
              <TableCell className="font-mono text-xs whitespace-nowrap">
                {new Date(entry.timestamp).toLocaleString()}
              </TableCell>
              <TableCell>
                <Badge variant={getTypeBadgeVariant(entry.type)}>
                  {entry.type}
                </Badge>
              </TableCell>
              <TableCell className="text-sm max-w-md">
                <div className="truncate">{JSON.stringify(entry.data)}</div>
              </TableCell>
              <TableCell className="text-center">
                {entry.immutable ? (
                  <Badge variant="outline" className="text-xs">✓ Locked</Badge>
                ) : (
                  <span className="text-xs text-muted-foreground">Draft</span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  )
}

function getTypeBadgeVariant(type: string): 'default' | 'secondary' | 'outline' | 'destructive' {
  switch (type) {
    case 'prediction':
      return 'default'
    case 'validation':
      return 'secondary'
    case 'outcome':
      return 'outline'
    case 'warning':
      return 'destructive'
    default:
      return 'outline'
  }
}
