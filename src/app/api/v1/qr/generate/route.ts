import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from 'next/server';
import QRCode from '@/models/qrcode.model'; // Import the QRCode model you provided earlier
import { nanoid } from 'nanoid'; // Import nanoid for generating unique short IDs
import dbConnect from "@/dbConfig/dbConfig";
import UserHistory from "@/models/userhistory.model";

export async function POST(request: NextRequest) {
  await dbConnect()
  try {
    // Extract the JWT token from the request headers
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    // console.log("token ", token)

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id: userId } = token; // Get the user ID from the token
    // console.log("user id : ", userId)

    // Parse the request body to get QR code details
    const formData = await request.formData();
    const title = formData.get("title")
    const showTitle = formData.get("showTitle")
    const textContent = formData.get("textContent")
    const showText = formData.get("showText")
    const targetUrl:any = formData.get("targetUrl") ; 
    let qrOptions:any = formData.get("qrOptions")
    
    // Validate the targetUrl to ensure it's a valid URL
    const urlPattern = /^(http|https):\/\//;
    if (!urlPattern.test(targetUrl)) {
      return NextResponse.json({ message: "Invalid URL" }, { status: 400 });
    }
    
    if (typeof qrOptions === 'string') {
      try {
        qrOptions = JSON.parse(qrOptions);
      } catch (error) {
        return NextResponse.json({ message: "Invalid qrOptions format" }, { status: 400 });
      }
    }
    
    console.log("title ", title , "showTitle ", showTitle , "textContent ", textContent , "showText ", showText , "targetUrl ", targetUrl)
    // console.log("qrOptions:", qrOptions);

    // Generate a short unique ID for the QR code
    const shortId = nanoid(8); // Generates a unique 8-character ID

    // Create a new QRCode document
    const newQRCode = new QRCode({
      user: userId, // Associate with the user
      title,
      showTitle,
      textContent,
      showText,
      targetUrl,
      shortId, // Store the unique short ID instead of the full URL
      qrOptions,
      scanCount: 0, // Initial scan count
    });

    
    const savedQRCode = await newQRCode.save();
  //  console.log("saved qr : ", savedQRCode
    
  //  )

  const historyRecord = await UserHistory.create({
    user: userId,
    actionType: "created",
    targetModel: "QRCode",
    targetId: savedQRCode._id,
    description: `Created a new QR code: ${savedQRCode.title}`,
    changes: {
      title: savedQRCode.title,
      targetUrl: savedQRCode.targetUrl,
      createdAt: savedQRCode.createdAt,
    },
  });
// console.log("history record : ", historyRecord)

    // Respond with the saved QRCode data
    return NextResponse.json({ message: "QR Code created successfully", qrCode: newQRCode,  history: historyRecord }, { status: 201 });

  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ message: "Error processing POST request" }, { status: 500 });
  }
}
