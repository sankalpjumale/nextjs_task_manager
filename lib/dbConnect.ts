import { error } from "console";
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URL as string

if (!MONGODB_URI){
    throw new Error("MONGODB_URI is missing")
}

declare global {
    var _mongoose: {
        conn: typeof mongoose | null;
        promise: Promise<typeof mongoose> | null
    }
}

if (!global._mongoose) {
    global._mongoose = { conn: null, promise: null}
}

const cached = global._mongoose

export async function dbConnect(): Promise<typeof mongoose> {
    if(cached.conn) {
        return cached.conn
    }

    if (!cached.promise) {
        const opts: mongoose.ConnectOptions = {
            bufferCommands: false
        }

        cached.promise = mongoose
        .connect(MONGODB_URI, opts)
        .then((mongooseInstance) => {
            console.log("MongoDB connected successfully")
            return mongooseInstance
        })
        .catch((err) => {
            cached.promise = null
            console.error("MongoDb connection failed", err.message)
            throw err
        })
    }

    cached.conn = await cached.promise
    return cached.conn
}