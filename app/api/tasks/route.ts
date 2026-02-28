import { dbConnect } from "@/lib/dbConnect";
import Task from "@/models/Task";
import { CreateTask } from "@/types/task";
import { NextRequest, NextResponse } from "next/server";



export async function GET(request: NextRequest) {
    try {
        await dbConnect()

        const { searchParams } = new URL(request.url)
        const status = searchParams.get("status")
        const priority = searchParams.get("priority")
        const search = searchParams.get("search")

        const filter: Record<string, any> = {}

        if (status) filter.status = status
        if (priority) filter.priority = priority

        if (search) {
            filter.$or = [
                {title: {$regex: search, $options: "i"}},
                {description: {$regex: search, $options: "i"}}
            ]
        }

        const tasks = await Task.find(filter).sort({createdAt: -1})

        return NextResponse.json(
            {
                success: true,
                data: tasks
            }
        )
    } catch (error) {
        console.error("[GET /api/tasks", error)
        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch data"
            }, {status: 500}
        )
    }
}


export async function POST(request: NextRequest) {
    try {
        await dbConnect()

        const body: CreateTask = await request.json()

        if (!body.title?.trim()) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Title is required"
                }, {status: 400}
            )
        }

        const task = await Task.create(
            {
                title: body.title.trim(),
                description: body.description?.trim() ?? "",
                priority: body.priority ?? "medium",
                status: body.status ?? "todo"
            }
        )

        return NextResponse.json(
            {
                success: true,
                data: task
            }, {status: 201}
        )
    } catch (error) {
        console.error("[POST /api/tasks]", error)
        if (
            error instanceof Error &&
            error.name === "ValidationError"
        ) {
            return NextResponse.json(
                {
                    success: false,
                    error: error.message
                }, {status: 400}
            )
        }

        return NextResponse.json(
            {
                success: false,
                error: "Failed to create task"
            }, {status: 500}
        )
    }
}