import mongoose, { Schema, Document } from "mongoose";

// Interface for user history document
interface IUserHistory extends Document {
  user: mongoose.Types.ObjectId; // Reference to the user
  actionType: string; // e.g., "deleted", "updated", "created"
  targetModel: string; // e.g., "QRCode", "ScanLog"
  targetId: mongoose.Types.ObjectId; // Reference to the affected document (e.g., a QRCode)
  changes?: Record<string, any>; // Capture what was changed, if applicable
  description?: string; // Brief summary of the action
  createdAt: Date; // When the action occurred
}

// User History Schema
const UserHistorySchema = new Schema<IUserHistory>({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  actionType: {
    type: String,
    required: true,
    enum: ["created", "updated", "deleted"],
  },
  targetModel: {
    type: String,
    required: true,
  },
  targetId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  changes: {
    type: Schema.Types.Mixed, // Store details about the changes (e.g., before/after values)
  },
  description: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Ensure indexing for faster queries
UserHistorySchema.index({ user: 1, createdAt: -1 });

const UserHistory =
  mongoose.models.UserHistory || mongoose.model<IUserHistory>("UserHistory", UserHistorySchema);

export default UserHistory;
