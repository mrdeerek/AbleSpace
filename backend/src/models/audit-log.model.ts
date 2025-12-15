import mongoose, { Schema, Document } from "mongoose";

export interface IAuditLog extends Document {
    taskId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    action: string;
    details: string;
    timestamp: Date;
}

const AuditLogSchema = new Schema<IAuditLog>(
    {
        taskId: { type: Schema.Types.ObjectId, ref: "Task", required: true },
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        action: { type: String, required: true },
        details: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
    }
);

export const AuditLog = mongoose.model<IAuditLog>("AuditLog", AuditLogSchema);
