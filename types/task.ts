export type Priority = "low" | "medium" | "high"
export type Status = "todo" | "in-progress" | "done"

export interface ITask {
    id: string;
    title: string;
    description: string;
    priority: Priority;
    status: Status;
    createdAt: string;
    updatedAt: string
}

export type CreateTask = {
    title: string;
    description?: string;
    priority: Priority;
    status: Status
}

export type UpdateTask = Partial<CreateTask>