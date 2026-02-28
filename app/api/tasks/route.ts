import { dbConnect } from "@/lib/dbConnect";
import Task from "@/models/Task";
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