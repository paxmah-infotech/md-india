import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import dbConnect from '@/dbConfig/dbConfig';
import UserHistory from '@/models/userhistory.model';

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

    // Fetch the total count of user activity history
    const totalHistoryItems = await UserHistory.countDocuments({ user: userId });

    // Fetch activity history with pagination
    const history = await UserHistory.find({ user: userId })
      .sort({ createdAt: -1 }) // Sort by most recent actions
      .skip(skip)
      .limit(limit)
      .select('actionType targetModel targetId changes description createdAt') // Select relevant fields
      .lean();

    // Format the response
    const responseData = {
      history: history.map((item) => ({
        id: item._id,
        actionType: item.actionType,
        targetModel: item.targetModel,
        targetId: item.targetId,
        changes: item.changes,
        description: item.description,
        createdAt: item.createdAt,
      })),
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalHistoryItems / limit),
        totalItems: totalHistoryItems,
        itemsPerPage: limit,
      },
    };

    return NextResponse.json({ message: "User activity history fetched successfully",success: true, data: responseData }, { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ message: "Error processing request" }, { status: 500 });
  }
}
