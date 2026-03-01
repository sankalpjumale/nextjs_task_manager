import type {
    ITask,
    CreateTask,
    UpdateTask
} from "@/types/task"

const BASE_URL = "/api/tasks"

async function fetchApi<T>(
    url: string,
    options: RequestInit = {}
): Promise<T> {
    const response = await fetch(url, {
        headers: {
            "Content-Type": "application/json",
            ...options.headers
        },
        ...options
    })

    const json = await response.json()

    if (!response.ok || !json.success) {
        throw new Error(
            json.error ?? `Request failed: ${response.status} ${response.statusText}`
        )
    }

    return json.data as T
}

export async function fetchTasks(
    filters: {
        status?: string;
        priority?: string;
        search?: string;
    } = {}
): Promise<ITask[]> {

    const params = new URLSearchParams();
    if (filters.status) params.set("status", filters.status)
    if (filters.priority) params.set("priority", filters.priority)
    if (filters.search) params.set("search", filters.search)

    const queryString = params.toString()
    const url = queryString ? `${BASE_URL}?${queryString}`: BASE_URL

    return fetchApi<ITask[]>(url)
}

export async function createTask(input: CreateTask): Promise<ITask> {
    return fetchApi<ITask>(BASE_URL, {
        method: "POST",
        body: JSON.stringify(input)
    })
}

export async function updateTask(
    id: string,
    input: UpdateTask
): Promise<ITask> {
    return fetchApi<ITask>(`${BASE_URL}/${id}`, {
        method: "PATCH",
        body: JSON.stringify(input)
    })
}

export async function deleteTask(id: string): Promise<void> {
    await fetchApi<{ message: string; id:string }>(`${BASE_URL}/${id}`, {
        method: "DELETE"
    })
}