'use client'

import { ITask, Status } from "@/types/task"
import { useState } from "react"


const STATUS_CYCLE: Status[] = ["todo", "in-progress", "done"]

const STATUS_CONFIG: Record<
    Status,
    {dotColor: string; badgeCss: string; label: string}
> ={
    "todo": {
        dotColor: "#6b7280",
        badgeCss: "bg-gray-500/10 text-gray-400 border-gray-500/20",
        label: "To Do"
    },
    "in-progress": {
        dotColor: "#f59e0b",
        badgeCss: "bg-amber-500/10 text-amber-400 border-amber-500/20",
        label: "In Progress"
    },
    "done": {
        dotColor: "#10b981",
        badgeCss: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        label: "Done"
    }
}

const PRIORITY_CONFIG: Record<
    ITask["priority"],
    {badgeCss: string}
> = {
    low: {badgeCss: "bg-blue-400/10 text-blue-400 border-blue-400/20"},
    medium: {badgeCss: "bg-orange-400/10 text-orange-400 border-orange-400/20"},
    high: {badgeCss: "bg-red-400/10 text-red-400 border-red-400/20"}
}

interface Props {
    task: ITask;
    onEdit: () => void;
    onDelete: () => void;
    onCycleStatus: () => void
}

export default function TaskCard({task, onEdit, onDelete, onCycleStatus}: Props) {
    const [removing, setRemoving] = useState(false)

    const statusConfig = STATUS_CONFIG[task.status]
    const priorityConfig = PRIORITY_CONFIG[task.priority]

    const nextStatus = STATUS_CYCLE[
        (STATUS_CYCLE.indexOf(task.status) + 1) % STATUS_CYCLE.length
    ]

    function handleDeleteClick() {
        setRemoving(true)
        setTimeout(onDelete, 260)
    }

    return (
        <>
            <div
                className={`
                    group flex items-start gap-4 px-5 py-4
                    bg-[#111827] border border-[#1f2937] rounded-md
                    hover:border-[#374151] hover:bg-[#131b2a]
                    transition-all duration-200
                    ${removing
                        ? "opacity-0 translate-x-3 scale-[0.99]"
                        : "opacity-100 translate-x-0 scale-100"
                    }    
                `}
            >
                {/* Status dot */}
                <button
                    onClick={onCycleStatus}
                    title={`Mark as '${nextStatus}`}
                    className="
                        mt-[3px] flex-shrink-0
                        w-3.5 h-3.5 rounded-full
                        transition-all duration-150
                        hover:ring-2 ring-offset-1 ring-offset-[#111827]
                        focus; outline-none focus:scale-125
                    "
                    style={{
                        backgroundColor: statusConfig.dotColor,
                        boxShadow: `0 0 0 1px ${statusConfig.dotColor}30`,
                        ["--tw-ring-color" as string]: statusConfig.dotColor,
                    }}
                />

                {/* Main COntent */}
                <div className="flex-1 min-w-0">

                    {/* Title row with badges */}
                    <div className="flex items-start gap-3 flex-wrap mb-1">
                        <span
                            className={`
                                flex-1 text-[13px] font-semibold tracking-wide leading-snug
                                ${task.status === "done" 
                                    ? "line-through text-gray-500" 
                                    : "text-gray-100"
                                }    
                            `}    
                        >{task.title}
                        </span>
                    </div>

                    {/* Priority */}
                    <div className="flex gap-1.5 flex-shrink-0 mt-0.5">
                        <span 
                            className={`
                                text-[10px] px-2 py-0.5 rounde border
                                font-semibold tracking-[0.08em] uppercase
                                ${priorityConfig.badgeCss}
                            `}
                        >
                            {task.priority}
                        </span>

                        <span className={`
                            text-[10px] px-2 py-0.5 rounde border
                            font-semibold tracking-[0.08em] uppercase
                            ${priorityConfig.badgeCss}
                        `}>
                            {statusConfig.label}
                        </span>
                    </div>
                </div>

                {/* Description */}
                {task.description && (
                    <p className="text-[12px] text-gray-500 leading-relaxed mb-1,5">
                        {task.description}
                    </p>
                )}

                {/* Created Date */}
                <span className="text-[10px] text-gray-600 tracking-wide">
                    {new Date(task.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric"
                    })}
                </span>
            </div>

            // Action Button
            <div className="flex gap-1 items-center opacity-0 group-hover:opacity-100 transition-opacity duration-150">

                <button
                    onClick={onEdit}
                    title="Edit Task"
                    className="
                    w-7 h-7 flex items-center justify-center rounded
                    text-[13px] text-gray-500
                    hover:text-gray-200 hover:bg-[#1f2937]
                    transition-all duration-150
                    "
                >
                ✎</button>

                <button
                    onClick={handleDeleteClick}
                    title="Delete Task"
                    className="
                    w-7 h-7 flex items-center justify-center rounded
                    text-[13px] text-gray-500
                    hover:text-red-400 hover:bg-red-400/10
                    transition-all duration-150
                    "
                >
                🗑</button>

            </div>
        </>
    )
}