'use client';

import { CreateTask, ITask, Status } from "@/types/task";
import { useCallback, useEffect, useMemo, useState } from "react";
import TaskFilters, { FilterStatus, SortKey } from "./components/TaskFilters";
import { createTask, deleteTask, fetchTasks, updateTask } from "@/lib/api";
import TaskCard from "./components/TaskCard";
import TaskModel from "./components/TaskModel";
import StatsBar from "./components/StatsBar";



const PRIORITY_RANK: Record<string, number> = {low: 1, medium: 2, high: 3}
const STATUS_RANK: Record<string, number> = {"todo": 1, "in-progress": 2, "done": 3}

const STATUS_CYCLE: Status[] = ["todo", "in-progress", "done"]

export default function Home() {

  const [tasks, setTasks] = useState<ITask[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const [modelOpen, setModelOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<ITask | undefined>()
  const [saving, setSaving] = useState(false)

  const [search, setSearch] = useState<string>("")
  const [filter, setFilter] = useState<FilterStatus>("all")
  const [sortBy, setSortBy] = useState<SortKey>("createdAt")

  const loadTask = useCallback(async () => {
    try {
      setLoading(true)
      setError("")
      const data = await fetchTasks()
      console.log("tasks from API: ", data)
      setTasks(data)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load tasks"
      )
    } finally{
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadTask()
  }, [loadTask])

  const visibleTasks = useMemo(() => {

    return tasks

    .filter((task) => {
      if (filter !== "all" && task.status !== filter) return false

      if (search.trim()) {
        const query = search.toLowerCase()
        const inTitle = task.title.toLowerCase().includes(query)
        const inDesc = task.description.toLowerCase().includes(query)
        if (!inTitle && !inDesc) return false
      }
      return true
    })

    .sort((a, b) => {
      switch (sortBy) {
        case "priority":
          return PRIORITY_RANK[b.priority] - PRIORITY_RANK[a.priority]
        case "status":
          return STATUS_RANK[a.status] - STATUS_RANK[b.status]
        case "createdAt":
        default:
          return (
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime() 
          )
      }
    })
  }, [tasks, filter, search, sortBy])

  const stats = useMemo(() => ({
    total: tasks.length,
    todo: tasks.filter((t) => t.status === "todo").length,
    inProgress: tasks.filter((t) => t.status === "in-progress").length,
    done: tasks.filter((t) => t.status === "done").length
  }), [tasks])

  function openCreateModel() {
    setEditingTask(undefined)
    setModelOpen(true)
  }

  function openEditModel(task:ITask) {
    setEditingTask(task)
    setModelOpen(true)
  }

  function closeModel() {
    setModelOpen(false)
    setEditingTask(undefined)
  }

  async function handleSave(data: CreateTask) {
    setSaving(true)
    try {
      if (editingTask) {
        const updated = await updateTask(editingTask.id, data)
        setTasks((prev) => 
          prev.map((t) => t.id === updated.id ? updated: t)
        )
      } else{
        const created = await createTask(data)
        setTasks((prev) => [created, ...prev])
      }
      closeModel()
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to save Task")
    } finally{
      setSaving(false)
    }
  }

  async function handleCycleStatus(task: ITask) {
    const currentIndex = STATUS_CYCLE.indexOf(task.status)
    const nextStatus = STATUS_CYCLE[(currentIndex + 1 ) % STATUS_CYCLE.length]

    setTasks((prev) => 
      prev.map((t) => t.id === task.id ? {...t, status: nextStatus} : t)
    )

    try {
      await updateTask(task.id, {status: nextStatus})
    } catch (error) {
      setTasks((prev) => 
        prev.map((t) => t.id === task.id? {...t, status: task.status} : t))
    }
  }

  async function handleDelete(taskId: string) {
    const taskBackup = tasks.find((t) => t.id === taskId)
    setTasks((prev) => prev.filter((t) => t.id !== taskId))

    try {
      await deleteTask(taskId)
    } catch (error) {
      if (taskBackup) {
        setTasks((prev) => [...prev, taskBackup])
      }
    }
  }


  return (
    <div className="min-h-screen bg-[#0a0a0f] text-gray-200 font-mono flex flex-col">

      {/* Header */}
      <header className="sticky top-0 z-40 flex items-center justify-between px-8 py-5 border-b border-[#1f2937] bg-[#0d0d15]/95 backdrop-blur-md ">
        <div className="flex items-center gap-3">
          <span className="text-amber-500 text-xl leading-none">▣</span>
          <span className="text-[13px] font-bold tracking-[0.2em] uppercase text-gray-100">TaskFlow</span>
          <span className="text-[10px] text-gray-600 tracking-widest border border-[#1f2937] px-2 py-0.5 rounded">Next.js + MongoDB</span>
        </div>

        {/* Primary Action */}
        <button 
          onClick={openCreateModel}
          className="
          bg-amber-500 hover:bg-amber-400 text-black text-[12px] font-bold tracking-wide px-4 py-2 rounded transition-all duration-150 hover:translate-y-px hover:shadow-lg hover:shadow-amber-500/20 active:translate-y-0">+ New Task</button>
      </header>

      {/* Stats Bar */}
      <StatsBar
        total={stats.total}
        todo={stats.todo}
        inProgress={stats.inProgress}
        done={stats.done}
      />

      {/* Filters */}
      <TaskFilters
        search={search}
        filter={filter}
        sortBy={sortBy}
        onSearch={setSearch}
        onFilter={setFilter}
        onSort={setSortBy}
      />

      {/* Task List */}
      <main className="flex-1 flex flex-col gap-2 px-8 py-4">

        {/* Loading state */}
        {loading && (
          <div className="flex items-center justify-center gap-3 py-24 text-gray-600">
            <div
              className="w-4 h-4 rounded-full border-2 border-amber-500/20 border-t-amber-500 animate-spin"
            />
            <span className="text-[13px]">Loading tasks...</span>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="flex flex-col items-center gap-4 py-24">
            <span className="text-4xl text-red-400/40">⚠</span>
            <p className="text-[13px] text-red-400">{error}</p>
            <button
              onClick={loadTask}
              className="text-[12px] font-mono border border-red-400/30 text-red-400 px-4 py-1.5 rounded hover:border-red-400/60 transition-colors duration-150"
            >Try again</button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && visibleTasks.length === 0 && (
          <div className="flex flex-col items-center gap-3 py-24 text-gray-600">
            <span className="text-5xl leading-none">◻</span>
            {tasks.length === 0 ? (
              <>
                <p>No tasks yet</p>
                <button
                  onClick={openCreateModel}
                  className="text-[12px] text-amber-500 hover:text-amber-400 border border-amber-500/30 hover:border-amber-500/60 px-4 py-1.5 rounded font-mono transition-colors duration-150"
                >Create your first task</button>
              </>
            ) : (
              <p className="text-[13px]">No tasks match your filters.</p>
            )}
          </div>
        )}

        {/* Task Cards */}
        {!loading && !error && visibleTasks.map((task) => {
          return (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={() => openEditModel(task)}
              onDelete={() => handleDelete(task.id)}
              onCycleStatus={() => handleCycleStatus(task)}
            />
          )
        })}
      </main>

      {/* Model */}
      {modelOpen && (
        <TaskModel
          task={editingTask}
          saving={saving}
          onSave={handleSave}
          onClose={closeModel}
        />
      )}
    </div>
  );
}
