import mongoose, {Schema, Document, Model} from "mongoose";
import type { Priority, Status } from "@/types/task";

export interface TaskDocument extends Document {
    title: string;
    description: string;
    priority: Priority;
    status: Status;
}

const TaskSchema = new Schema<TaskDocument> (
    {
        title: {
            type: String,
            required: [true, 'Title required'],
            trim: true,
            maxlength: [200, "Title cannot exceed 200 characters"]
        },
        description: {
            type: String,
            default: "",
            trim: true,
            maxlength: [1000, "Description cannot exceed 1000 characters"]
        },
        priority: {
            type: String,
            enum: {
                values: ["low", "medium", "high"] as Priority[],
                message: '"{VALUE}" is not a valid priority. Use low, medium, or high.'
            },
            default: "medium" as Priority
        },
        status: {
            type: String,
            enum: {
                values: ["todo", "in-progress", "done"] as Status[],
                message: '"{VALUE}" is not a valid status. Use todo, in-progress, or done.'
            },
            default: "todo" as Status
        }
    },
    {
        timestamps: true,
        toJSON: {
            virtuals: true,
            transform: (_doc, ret: any) => {
                ret.id = ret._id.toString()
                delete ret._id
                delete ret.__v
                return ret
            },
        }
    }
)

const Task: Model<TaskDocument> = mongoose.models.Task || mongoose.model<TaskDocument>("Task", TaskSchema)

export default Task