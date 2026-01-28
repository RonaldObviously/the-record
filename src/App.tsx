import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Plus } from '@phosphor-icons/react'
import { TodayView } from '@/components/TodayView'
import { WeekView } from '@/components/WeekView'
import { AnalyticsView } from '@/components/AnalyticsView'
import { TaskBacklog } from '@/components/TaskBacklog'
import { CreateBlockDialog } from '@/components/CreateBlockDialog'
import type { TimeBlock, Task, DailyReflection } from '@/lib/types'
import { toast } from 'sonner'

function App() {
  const [blocks, setBlocks] = useKV<TimeBlock[]>('time-blocks', [])
  const [tasks, setTasks] = useKV<Task[]>('tasks', [])
  const [reflections, setReflections] = useKV<DailyReflection[]>('reflections', [])
  const [activeBlockId, setActiveBlockId] = useKV<string | null>('active-block-id', null)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [currentTab, setCurrentTab] = useState('today')

  const safeBlocks = Array.isArray(blocks) ? blocks : []
  const safeTasks = Array.isArray(tasks) ? tasks : []
  const safeReflections = Array.isArray(reflections) ? reflections : []

  const handleCreateBlock = (block: TimeBlock) => {
    setBlocks((current) => [...(current || []), block])
    toast.success('Time block created')
  }

  const handleUpdateBlock = (blockId: string, updates: Partial<TimeBlock>) => {
    setBlocks((current) =>
      (current || []).map((block) => (block.id === blockId ? { ...block, ...updates } : block))
    )
  }

  const handleDeleteBlock = (blockId: string) => {
    setBlocks((current) => (current || []).filter((block) => block.id !== blockId))
    if (activeBlockId === blockId) {
      setActiveBlockId(null)
    }
    toast.success('Block deleted')
  }

  const handleStartBlock = (blockId: string) => {
    if (activeBlockId && activeBlockId !== blockId) {
      handleUpdateBlock(activeBlockId, {
        status: 'paused',
      })
    }

    handleUpdateBlock(blockId, {
      status: 'active',
      startedAt: new Date(),
    })
    setActiveBlockId(blockId)
    toast.success('Focus timer started')
  }

  const handlePauseBlock = (blockId: string) => {
    handleUpdateBlock(blockId, {
      status: 'paused',
    })
    toast.info('Timer paused')
  }

  const handleCompleteBlock = (blockId: string, actualDuration: number) => {
    handleUpdateBlock(blockId, {
      status: 'completed',
      completedAt: new Date(),
      actualDuration,
    })
    if (activeBlockId === blockId) {
      setActiveBlockId(null)
    }
    toast.success('Block completed!', {
      description: 'Great work staying focused.',
    })
  }

  const handleAddTask = (task: Task) => {
    setTasks((current) => [...(current || []), task])
  }

  const handleUpdateTask = (taskId: string, updates: Partial<Task>) => {
    setTasks((current) => (current || []).map((task) => (task.id === taskId ? { ...task, ...updates } : task)))
  }

  const handleDeleteTask = (taskId: string) => {
    setTasks((current) => (current || []).filter((task) => task.id !== taskId))
  }

  const handleAddReflection = (reflection: DailyReflection) => {
    setReflections((current) => [...(current || []), reflection])
  }

  const activeBlock = safeBlocks.find((block) => block.id === activeBlockId)

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6 max-w-6xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-foreground">Focus</h1>
              <p className="text-sm text-muted-foreground mt-1">Time blocking & deep work</p>
            </div>
            <Button onClick={() => setShowCreateDialog(true)} size="lg">
              <Plus size={20} className="mr-2" />
              New Block
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Tabs value={currentTab} onValueChange={setCurrentTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="today">Today</TabsTrigger>
                <TabsTrigger value="week">Week</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>

              <TabsContent value="today" className="mt-0">
                <TodayView
                  blocks={safeBlocks}
                  activeBlock={activeBlock}
                  onStartBlock={handleStartBlock}
                  onPauseBlock={handlePauseBlock}
                  onCompleteBlock={handleCompleteBlock}
                  onUpdateBlock={handleUpdateBlock}
                  onDeleteBlock={handleDeleteBlock}
                  reflections={safeReflections}
                  onAddReflection={handleAddReflection}
                />
              </TabsContent>

              <TabsContent value="week" className="mt-0">
                <WeekView
                  blocks={safeBlocks}
                  onStartBlock={handleStartBlock}
                  onUpdateBlock={handleUpdateBlock}
                />
              </TabsContent>

              <TabsContent value="analytics" className="mt-0">
                <AnalyticsView blocks={safeBlocks} reflections={safeReflections} />
              </TabsContent>
            </Tabs>
          </div>

          <div className="lg:col-span-1">
            <TaskBacklog
              tasks={safeTasks}
              blocks={safeBlocks}
              onAddTask={handleAddTask}
              onUpdateTask={handleUpdateTask}
              onDeleteTask={handleDeleteTask}
              onCreateBlockFromTask={(task) => {
                setShowCreateDialog(true)
              }}
            />
          </div>
        </div>
      </main>

      <CreateBlockDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onCreateBlock={handleCreateBlock}
        tasks={safeTasks}
      />
    </div>
  )
}

export default App
