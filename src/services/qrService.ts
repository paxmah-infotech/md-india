
import dbConnect from '@/dbConfig/dbConfig';
import QRCode, { IQRCode } from '@/models/qrcode.model';
import { Types } from 'mongoose';

export interface QRCodeExportData {
  _id: string;
  title: string;
  type: string;
  url: string;
  createdAt: string;
  updatedAt: string;
  active: boolean;
  scanCount: number;
  lastScan?: string;
  scans: Array<{
    timestamp: string;
    location: string;
    device: string;
    browser: string;
    os: string;
  }>;
}

export async function getUserQRCodes(userId: string): Promise<QRCodeExportData[]> {
  try {
    await dbConnect();
    
    // Validate userId is a valid ObjectId
    if (!Types.ObjectId.isValid(userId)) {
      throw new Error('Invalid user ID');
    }

    const qrCodes = await QRCode.find({ user: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    if (!qrCodes || qrCodes.length === 0) {
      console.log('No QR codes found for user:', userId);
      return [];
    }

    console.log(`Found ${qrCodes.length} QR codes for user:`, userId);

    return qrCodes.map((qr: any) => ({
      _id: qr._id.toString(),
      title: qr.title || 'Untitled QR Code',
      type: qr.qrType || 'url',
      url: qr.targetUrl || '',
      createdAt: qr.createdAt?.toISOString() || new Date().toISOString(),
      updatedAt: qr.updatedAt?.toISOString() || new Date().toISOString(),
      active: true, // QR codes are always active in current model
      scanCount: qr.scanCount || 0,
      lastScan: undefined, // Current model doesn't track last scan
      scans: [] // Current model doesn't store scan details
    }));
  } catch (error) {
    console.error('Error fetching QR codes:', error);
    throw new Error('Failed to fetch QR codes');
  }
}
