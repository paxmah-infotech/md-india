import dbConnect from '@/dbConfig/dbConfig'
import { NextRequest, NextResponse } from 'next/server'
import QRCode from '@/models/qrcode.model'
import ScanLog from '@/models/qrscanlog.model'
import { getClientIP, getIPInfo } from '@/utils/ip.utils'

// API to handle redirection and save scan data in the background
export async function GET (request: NextRequest) {
  await dbConnect()

  try {
    const searchParams = request.nextUrl.searchParams
    const shortId = searchParams.get('shortId')
    const targetUrl = searchParams.get('targetUrl')

    if (!shortId || !targetUrl) {
      return NextResponse.json(
        { error: 'Short ID or target URL missing' },
        { status: 400 }
      )
    }

    // Get client IP and ensure it's public
    const clientIP = getClientIP(request)

    // Get IP location information first
    const ipInfo = await getIPInfo(clientIP)

    if (!ipInfo.success || !ipInfo.data) {
      // console.error('Failed to get IP info:', ipInfo.error)
      return NextResponse.json(
        { error: 'Failed to get location information' },
        { status: 500 }
      )
    }

    // Extract client information with the verified public IP
    const clientInfo = {
      ip: ipInfo.data.ipAddress, // Use the verified public IP
      userAgent: request.headers.get('user-agent') || 'Unknown User-Agent',
      referer: request.headers.get('referer') || 'No Referrer'
    }
// console.log("short id : ", shortId)
    // Find and update QR Code
    const qrCode = await QRCode.findOneAndUpdate(
      { shortId },
      { $inc: { scanCount: 1 } },
      { new: true }
    )
    // console.log('ipinfo', ipInfo)
    if (qrCode) {
      // Create scan log with location information
      await ScanLog.create({
        qrCode: qrCode._id,
        ...clientInfo,
        cityName: ipInfo.data.cityName,
        countryName: ipInfo.data.countryName,
        countryCode: ipInfo.data.countryCode,
        regionName: ipInfo.data.regionName,
        latitude: ipInfo.data.latitude,
        longitude: ipInfo.data.longitude
      })
    }

    // console.log('qrcode ', qrCode)
    // Perform the redirect
    return NextResponse.redirect(targetUrl, 302)
  } catch (error) {
    console.error('Error processing QR scan:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
