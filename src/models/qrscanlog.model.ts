import mongoose, { Schema, Document } from "mongoose";

export interface IScanLog extends Document {
  qrCode: mongoose.Types.ObjectId;
  ip: string;
  userAgent: string;
  referer: string;
  timestamp: Date;
  // Location information
  cityName: string;
  countryName: string;
  countryCode: string;
  regionName: string;
  latitude: number;
  longitude: number;
}

const ScanLogSchema = new Schema<IScanLog>({
  qrCode: { type: Schema.Types.ObjectId, ref: "QRCode", required: true },
  ip: { type: String, required: true },
  userAgent: { type: String, required: true },
  referer: { type: String, default: null },
  timestamp: { type: Date, default: Date.now },
  // Location information
  cityName: { type: String, required: true },
  countryName: { type: String, required: true },
  countryCode: { type: String, required: true },
  regionName: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true }
});

const ScanLog = mongoose.models.ScanLog || mongoose.model<IScanLog>("ScanLog", ScanLogSchema);

export default ScanLog;
