import { dbConnect } from "@/lib/dbConnect";
import Task from "@/models/Task";
import { UpdateTask } from "@/types/task";
import mongoose, { mongo } from "mongoose";
import { NextRequest, NextResponse } from "next/server";




function isValidObjectId(id: string): boolean {
    return mongoose.Types.ObjectId.isValid(id)
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{id: string}>}
) {
    try {
        const { id } = await params

        if (!isValidObjectId(id)) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Invalid task id format"
                }, {status: 400}
            )
        }

        await dbConnect()

        const body: UpdateTask = await request.json()

        const updates: Record<string, any> = {}

        if (body.title !== undefined) updates.title = body.title.trim()
        if (body.description !== undefined) updates.description = body.description.trim()
        if (body.priority !== undefined) updates.priority = body.priority
        if (body.status !== undefined) updates.status = body.status

        if (Object.keys(updates).length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    error: "No fields provided to update"
                }, {status: 400 }
            )
        }

        const task = await Task.findByIdAndUpdate(
            id,
            { $set: updates },
            { new : true, runValidators: true}
        )

        if (!task) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Task not found"
                }, {status: 404}
            )
        }

        return NextResponse.json(
            {
                success: true,
                data: task
            }
        )
        
    } catch (error) {
        console.error('[PATCH /api/tasks/:id]', error)

        if (error instanceof Error && error.name === "ValidationError") {
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
                error: "Failed to update task"
            }, {status: 500}
        )
    }
}


export async function DELETE(
    _request: NextRequest,
    { params }: { params: Promise<{id: string}>}
) {
    try {
        const { id } = await params

        if (!isValidObjectId(id)) {
            return NextResponse.json(
                {
                    success: false, 
                    error: "Invalid task id format"
                }, {status: 400}
            )
        }

        await dbConnect()

        const task = await Task.findByIdAndDelete(id)

        if (!task) {
            return NextResponse.json(
                {
                    success:    false,
                    error: "Task not found"
                }, {status: 404}
            )
        }

        return NextResponse.json(
            {
                success: true,
                data: {message: "Task deleted successfully", id}
            }
        )
    } catch (error) {
        console.error("[DELETE /api/tasks/:id]", error)
        return NextResponse.json(
            {
                success: false,
                error: "Filed to delete task"
            }, {status: 500}
        )
    }
}