'use client'

interface Props {
    total: number;
    todo: number;
    inProgress: number;
    done: number;
}

export default function StatsBar({total, todo, inProgress, done}: Props) {
    const percentage = total > 0 ? Math.round((done / total) * 100) : 0

    const stats = [
        {label: "Total", value: total, color: "text-gray-200"},
        {label: "To Do", value: todo, color: "text-gray-400"},
        {label: "In Progress", value: inProgress, color: "text-amber-400"},
        {label: "Done", value: done, color: "text-emerald-400"}
    ]

    return (
        <div className="flex items-center gap-8 px-8 py-4 border-b border-[#1f2937] flex-wrap">

        {/* Counters */}
        {
            stats.map((s) => (
                <div key={s.label} className="flex flex-col gap-0.5">
                    <span 
                        className={`text-2xl font-bold leading-none font-mono ${s.color}`}
                    >
                        {s.value}
                    </span>
                    <span 
                        className="text-[10px] text-gray-600 tracking-[0.1em] uppercase"
                    >
                        {s.label}
                    </span>
                </div>
            ))
        }

        {/* Progress Bar */}
        <div className="flex items-center gap-3 ml-auto min-w-[140px]">
            <div className="flex-1 h-[3px] bg-[#1f2937] rounded-full overflow-hidden">
                <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-700 ease-out"
                    style={{width: `${percentage}%`}}
                    role="progressbar"
                    aria-valuenow={percentage}
                    aria-valuemin={0}
                    aria-valuemax={100}
                />
            </div>
            <span className="text-[11px] text-gray-600 font-mono tabular-nums w-8 text-right">
                {percentage}%
            </span>
        </div>

        </div>
    )
}