import mongoose, { Schema, Document } from 'mongoose'

export interface IQRCode extends Document {
  qrType: any
  user: mongoose.Types.ObjectId
  title: string
  showTitle: boolean
  textContent: string
  showText: boolean
  targetUrl: string
  shortId: string
  qrOptions: any
  scanCount: number
  createdAt: Date
  updatedAt: Date
}

const QRCodeSchema = new Schema<IQRCode>({
  qrType: { type: String, enum: ['url', 'text'], default: 'url' },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true, maxlength: 100 },
  showTitle: { type: Boolean, default: true },
  textContent: { type: String, maxlength: 500, default: '' },
  showText: { type: Boolean, default: true },
  targetUrl: { type: String, required: true, validate: /^(http|https):\/\// },
  shortId: { type: String, required: true },
  qrOptions: { type: Object },
  scanCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

QRCodeSchema.pre<IQRCode>('save', function (next) {
  this.updatedAt = new Date()
  next()
})

const QRCode =
  mongoose.models.QRCode || mongoose.model<IQRCode>('QRCode', QRCodeSchema)

export default QRCode
