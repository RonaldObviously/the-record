import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { GitBranch } from '@phosphor-icons/react'
import { SignalToProblemVisual } from '@/components/SignalToProblemVisual'
import { SignalFlowDiagram } from '@/components/SignalFlowDiagram'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export function SignalLifecycleExplainer() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <GitBranch size={16} className="mr-1.5" />
          Signal Lifecycle
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl max-h-[90vh] p-0 gap-0 flex flex-col">
        <div className="px-6 pt-6 pb-4 flex-shrink-0">
          <DialogHeader>
            <DialogTitle className="font-mono text-2xl">Signal to Problem Lifecycle</DialogTitle>
            <DialogDescription>
              How individual observations become validated problems through deterministic algorithms
            </DialogDescription>
          </DialogHeader>
        </div>

        <ScrollArea className="flex-1 px-6 pb-6">
          <Tabs defaultValue="visual" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="visual">Interactive Visual</TabsTrigger>
              <TabsTrigger value="detailed">Detailed Steps</TabsTrigger>
            </TabsList>

            <TabsContent value="visual" className="space-y-6">
              <SignalToProblemVisual />
            </TabsContent>

            <TabsContent value="detailed" className="space-y-6">
              <SignalFlowDiagram />
            </TabsContent>
          </Tabs>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
