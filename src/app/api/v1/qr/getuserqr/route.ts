import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import QRCode from '@/models/qrcode.model'; // QRCode model
import ScanLog from '@/models/qrscanlog.model'; // ScanLog model
import dbConnect from '@/dbConfig/dbConfig';

export async function GET(request: NextRequest) {
  try {
    // Extract the JWT token from the request headers
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Get the userId from the token
    const { id: userId } = token;

    await dbConnect();

    // Parse query parameters for pagination
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);

    if (page < 1 || limit < 1) {
      return NextResponse.json({ message: "Invalid pagination parameters" }, { status: 400 });
    }

    const skip = (page - 1) * limit;

    // Fetch the total count of QR codes for the user
    const totalQRCodes = await QRCode.countDocuments({ user: userId });

    // Fetch QR codes with pagination
    const qrCodes = await QRCode.find({ user: userId })
      .sort({ createdAt: -1 }) // Sort by `createdAt` in descending order
      .skip(skip)
      .limit(limit)
      .select('title showTitle targetUrl scanCount qrOptions shortId createdAt updatedAt')
      .lean();

    // Populate scan logs for each QR code
    const qrCodesWithScans = await Promise.all(
      qrCodes.map(async (qrCode) => {
        let qrOptions = qrCode.qrOptions;

        // Generate the correct QR code URL
        const baseUrl = process.env.NEXTAUTH_URL || process.env.DOMAIN || '';
        const qrRedirectUrl = `${baseUrl}/api/v1/qr?shortId=${qrCode.shortId}&targetUrl=${qrCode.targetUrl}`;

        if (qrOptions?.data) {
          // Update the QR data to use the correct URL format
          qrOptions.data = qrRedirectUrl;
        }

        const qrImageUrl = qrRedirectUrl;

        // Fetch scan logs for the current QR code
        // const scans = await ScanLog.find({ qrCode: qrCode._id })
        //   .select('ip userAgent referer timestamp')
        //   .lean();

        return {
          _id: qrCode._id,
          title: qrCode.title,
          showTitle: qrCode.showTitle,
          targetUrl: qrCode.targetUrl,
          scanCount: qrCode.scanCount,
          qrOptions: {
            ...qrOptions,
            data: qrRedirectUrl
          },
          shortId: qrCode.shortId,
          createdAt: qrCode.createdAt,
          updatedAt: qrCode.updatedAt,
          qrImageUrl,
          // scans,
        };
      })
    );

    // Format the response with QR codes and pagination info
    const responseData = {
      qrCodes: qrCodesWithScans,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalQRCodes / limit),
        totalItems: totalQRCodes,
        itemsPerPage: limit,
      },
    };

    return NextResponse.json({ message: "QR codes fetched successfully", data: responseData, success: true }, { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ message: "Error processing request" }, { status: 500 });
  }
}
