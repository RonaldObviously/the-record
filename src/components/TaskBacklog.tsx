import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Check, Trash } from '@phosphor-icons/react'
import type { Task, TimeBlock } from '@/lib/types'
import { generateId } from '@/lib/helpers'

interface TaskBacklogProps {
  tasks: Task[]
  blocks: TimeBlock[]
  onAddTask: (task: Task) => void
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void
  onDeleteTask: (taskId: string) => void
  onCreateBlockFromTask: (task: Task) => void
}

export function TaskBacklog({
  tasks,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
}: TaskBacklogProps) {
  const [newTaskTitle, setNewTaskTitle] = useState('')

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTaskTitle.trim()) return

    const newTask: Task = {
      id: generateId(),
      title: newTaskTitle.trim(),
      createdAt: new Date(),
      completed: false,
    }

    onAddTask(newTask)
    setNewTaskTitle('')
  }

  const activeTasks = tasks.filter((t) => !t.completed)
  const completedTasks = tasks.filter((t) => t.completed)

  return (
    <Card className="p-4 sticky top-4">
      <h3 className="font-semibold text-foreground mb-4">Task Backlog</h3>

      <form onSubmit={handleAddTask} className="flex gap-2 mb-4">
        <Input
          placeholder="Add a task..."
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" size="icon">
          <Plus size={16} />
        </Button>
      </form>

      <div className="space-y-2 max-h-[500px] overflow-y-auto">
        {activeTasks.length === 0 && completedTasks.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">No tasks yet</p>
        )}

        {activeTasks.map((task) => (
          <div
            key={task.id}
            className="flex items-center gap-2 p-2 rounded hover:bg-muted transition-colors group"
          >
            <button
              onClick={() => onUpdateTask(task.id, { completed: true })}
              className="w-4 h-4 rounded border border-border flex-shrink-0 hover:border-primary"
            />
            <span className="text-sm text-foreground flex-1 truncate">{task.title}</span>
            <button
              onClick={() => onDeleteTask(task.id)}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-1"
            >
              <Trash size={14} className="text-muted-foreground hover:text-destructive" />
            </button>
          </div>
        ))}

        {completedTasks.length > 0 && (
          <>
            <div className="border-t border-border my-3 pt-3">
              <p className="text-xs text-muted-foreground mb-2">Completed</p>
            </div>
            {completedTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center gap-2 p-2 rounded hover:bg-muted transition-colors group opacity-60"
              >
                <Check size={16} className="text-success flex-shrink-0" />
                <span className="text-sm text-muted-foreground flex-1 truncate line-through">
                  {task.title}
                </span>
                <button
                  onClick={() => onDeleteTask(task.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1"
                >
                  <Trash size={14} className="text-muted-foreground hover:text-destructive" />
                </button>
              </div>
            ))}
          </>
        )}
      </div>
    </Card>
  )
}
