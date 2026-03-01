'use client'

export type FilterStatus = "all" | "todo" | "in-progress" | "done"
export type SortKey = "createdAt" | "priority" | "status"

interface Props {
    search: string;
    filter: FilterStatus;
    sortBy: SortKey;
    onSearch: (value: string) => void;
    onFilter: (value: FilterStatus) => void;
    onSort: (value: SortKey) => void
}

const FILTER_TABS: {value: FilterStatus; label: string}[] =[
    {value: "all", label: "All"},
    {value: "todo", label: "To Do"},
    {value: "in-progress", label: "In Progerss"},
    {value: "done", label: "Done"}
]

export default function TaskFilters({
    search, filter, sortBy, onSearch, onFilter, onSort
}: Props) {
  return (
    <div className="flex items-center gap-3 px-8 py-3 border-b border-[#1f2937] flex-wrap">

        {/* Search */}
        <input 
            type="search"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search Tasks..."
            className="
                bg-[#1f2937] rounded
                px-3 py-2 w-52
                text-[12px] text-gray-300 placeholder:text-gray-600
                font-mono outline-none
                focus:border-amber-500/60
                transition-colors
            " 
        />

        {/* Status filter tabs */}
        <div className="flex gap-1">
            {
                FILTER_TABS.map((tab) => {
                    const isActive = filter === tab.value
                    return (
                        <button 
                            key={tab.value} 
                            onClick={() => onFilter(tab.value)} 
                            className={`
                                px-3 py-1.5 rounded border 
                                text-[11px] font-mono tracking-wide
                                transition-all duration-150
                                ${isActive
                                    ? "bg-[#1f2937] text-gray-200 border-[#374151]"
                                    : "bg-transparent text-gray-500 border-[#1f2937] hover:text-gray-300 hover: border-[#374151]"
                                }`}
                        >
                            {tab.label}
                        </button>
                    )
                })
            }
        </div>

        {/* Sort Selector */}
        <select 
            value={sortBy}
            onChange={(e) => onSort(e.target.value as SortKey)}
            className="
                ml-auto
                bg-[#111827] border border-[#1f2037] rounded
                px-3 py-2
                text-[11px] text-gray-400 font-mono
                outline-none cursor-pointer
                hover:border-[#374151] focus:border-amber-500/60
                transition-colors
            "
        >
            <option value="createdAt">Newest first</option>
            <option value="priority">By priority</option>
            <option value="status">By status</option>
        </select>
    </div>
  )
}

