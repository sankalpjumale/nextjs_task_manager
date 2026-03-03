'use client'

import { CreateTask, ITask, Priority, Status } from "@/types/task"
import { useState } from "react";


interface Props{
    task?: ITask;
    saving: boolean;
    onSave: (data: CreateTask) => Promise<void>
    onClose: () => void
}

export default function TaskModel({task, saving, onSave, onClose}: Props) {
    const [form, setForm] = useState<CreateTask>({
        title: task?.title ?? "",
        description: task?.description ?? "",
        priority: task?.priority ?? "medium",
        status: task?.status ?? "todo"
    })
    const [titleError, setTitleError] = useState("")

    function setField<K extends keyof CreateTask>(
        key: K,
        value: CreateTask[K]
    ) {
        setForm((prev) => ({...prev, [key]: value}))
        if (key === "title") setTitleError("")
    }

    async function handleSubmit() {
        if (!form.title.trim()) {
            setTitleError("Title is required")
            return 
        }
        await onSave(form)
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose()
            }}
        >

            {/* Model Panel */}
            <div className="
            w-full max-w-md
            bg-[#111827] border border-[#1f2937] rounded-lg
            p-7 flex flex-col gap-5 animate-in">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <h2>{task ? "Edit Task" : "New Task"}</h2>
                    <button 
                    onClick={onClose}
                    className="
                    w-7 h-7 flex items-center justify-center rounded text-gray-500 hover:text-gray-300 hover:bg-[#1f2937] text-base transition-all duration-150">✕</button>
                </div>

                {/* Title Field */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-gray-500 tracking-[0.12em] uppercase">
                        Title <span className="text-red-400">*</span>
                    </label>
                    <input 
                        autoFocus
                        type="text" 
                        value={form.title}
                        onChange={(e) => setField("title", e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                        placeholder="What needs to be done?"
                        className="
                        w-full bg-[#0a0a0f] border rounded px-3 py-2.5
                        text-[13px] text-gray-200 placeholder:text-gray-600
                        font-mono outline-none transitions-colors 
                        focus:border-amber-500/70
                        border-[#1f2937]"
                    />
                    {titleError && (
                        <p className="text-[11px] text-red-400">{titleError}</p>
                    )}
                </div>

                {/* Description Field */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-gray-500 tracking-[0.12em] uppercase">Description</label>
                    <textarea 
                        value={form.description}
                        onChange={(e) => setField("description", e.target.value)}
                        placeholder= "Optional details..."
                        rows={3}
                        className="
                        w-full bg-[#0a0a0f] border border-[#1f2937] rounded px-3 py-2.5 text-[13px] text-gray-200 placeholder:text-gray-600 font-mono outline-none resize-none transition-colors focus:border-amber-500/70"
                    />
                </div>

                {/* Priority  */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] text-gray-500 tracking-[0.12em] uppercase">Priority</label>

                        <select
                            value={form.priority}
                            onChange={(e) => setField("priority", e.target.value as Priority)}
                            className="w-full bg-[#0a0a0f] border border-[#1f2937] rounded px-3 py-2.5 text-[13px] text-gray-200 font-mono outline-none cursor-pointer focus:border-amber-500/70 transition-colors"
                        >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] text-gray-500 tracking-[0.12em] uppercase">Status</label>
                        <select
                            value={form.status}
                            onChange={(e) => setField("status", e.target.value as Status)}
                            className="w-full bg-[#0a0a0f] border border-[#1f2937] rounded px-3 py-2.5 text-[13px] text-gray-200 font-mono outline-none cursor-pointer focus:border-amber-500/70 transition-colors"
                        >
                            <option value="todo">To Do</option>
                            <option value="in-progress">In Progress</option>
                            <option value="done">Done</option>
                        </select>
                    </div>
                </div>

                    {/* Footer Button */}
                    <div className="flex justify-end gap-2 pt-1">
                        <button
                            onClick={onClose}
                            disabled={saving}
                            className="px-4 py-2 rounded border border-[#1f2937] text-gray-500 text-[12px] font-mono tracking-wide hover:text-gray-300 hover:border-[#374151] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150"
                        >Cancel</button>

                        <button
                            onClick={handleSubmit}
                            disabled={saving || !form.title.trim()}
                            className="
                            px-5 py-2 rounded bg-amber-500 hover:bg-amber-400 text-black text-[12px] font-bold font-mono tracking-wide disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150"
                        >
                            {saving
                                ? "Saving..." 
                                : task ? "Save changes" : "Create Task"}
                        </button>
                    </div>
            </div>
        </div>
    )
}