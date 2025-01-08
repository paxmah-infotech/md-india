import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/dbConfig/dbConfig';
import QRCode from '@/models/qrcode.model';
import { getToken } from 'next-auth/jwt';
import UserHistory from '@/models/userhistory.model';

export async function DELETE(request: NextRequest) {
    try {
        // Parse the body to get the QR code ID
        const searchParams = request.nextUrl.searchParams;
        const qrCodeId = searchParams.get('qrId') as any;

        // Get the user token from the request
        const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

        // If no token, the user is unauthorized
        if (!token) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        // Ensure qrCodeId is provided
        if (!qrCodeId) {
            return NextResponse.json({ message: 'QR code ID is required' }, { status: 400 });
        }

        // Connect to the database
        await dbConnect();

        // Find the QR code by its ID
        const qrCode = await QRCode.findById(qrCodeId);

        // If QR code is not found
        if (!qrCode) {
            return NextResponse.json({ message: 'QR code not found' }, { status: 404 });
        }

        // Check if the user ID from the token matches the user ID associated with the QR code
        if (qrCode.user.toString() !== token.sub) {
            return NextResponse.json({ message: "You are not authorized to delete this QR code" }, { status: 403 });
        }


        const qrCodeDetails = {
            title: qrCode?.title,
            targetUrl: qrCode?.targetUrl,
            createdAt: qrCode?.createdAt,
        };
        // Proceed to delete the QR code if the user is the owner
        await QRCode.findByIdAndDelete(qrCodeId);

        const historyRecord = await UserHistory.create({
            user: token.sub,
            actionType: "deleted",
            targetModel: "QRCode",
            targetId: qrCodeId,
            description: `Deleted QR code: ${qrCodeDetails?.title}`,
            changes: qrCodeDetails, // Optional: Add additional details about the deleted QR code
        });

        // Return a success message
        return NextResponse.json({ message: 'QR code deleted successfully',   historyId: historyRecord._id , success: true }, { status: 200 });

    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ message: 'Error processing DELETE request' }, { status: 500 });
    }
}
