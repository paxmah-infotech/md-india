import dbConnect from "@/dbConfig/dbConfig";
import UserHistory from "@/models/userhistory.model";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest) {
    try {
      const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
      if (!token) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
      }
  
      const { id: userId } = token;
  
      await dbConnect();
  
      const { searchParams } = new URL(request.url);
      const historyId = searchParams.get('id');
  
      if (!historyId) {
        return NextResponse.json({ message: "History ID is required" }, { status: 400 });
      }
  
      const historyItem = await UserHistory.findOne({ _id: historyId, user: userId });
  
      if (!historyItem) {
        return NextResponse.json({ message: "History item not found" }, { status: 404 });
      }
  
      await UserHistory.deleteOne({ _id: historyId, user: userId });
  
      return NextResponse.json({ message: "History item deleted successfully" }, { status: 200 });
    } catch (error) {
      console.error("Error:", error);
      return NextResponse.json({ message: "Error processing request" }, { status: 500 });
    }
  }