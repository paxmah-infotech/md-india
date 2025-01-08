import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/dbConfig/dbConfig'
import ScanLog from '@/models/qrscanlog.model'
import { getToken } from 'next-auth/jwt'

export async function GET (request: NextRequest) {
  try {
    const token = await getToken({ req: request })
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await dbConnect()

    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const qrCodeId = searchParams.get('qrCodeId')

    if (!qrCodeId) {
      return NextResponse.json(
        { error: 'QR Code ID is required' },
        { status: 400 }
      )
    }

    // Calculate skip value for pagination
    const skip = (page - 1) * limit

    // Get total count for pagination
    const totalCount = await ScanLog.countDocuments({ qrCode: qrCodeId })

    // Get paginated scan logs with only necessary fields
    const scanLogs = await ScanLog.find({ qrCode: qrCodeId })
      .sort({ timestamp: -1 }) // Latest first
      .skip(skip)
      .limit(limit)
      .select({
        _id: 1,
        ip: 1,
        userAgent: 1,
        referer: 1,
        timestamp: 1,
        cityName: 1,
        countryName: 1,
        regionName: 1,
        latitude: 1,
        longitude: 1
      })
      .lean() // Convert to plain JavaScript objects

    // Transform the data for client
    const transformedLogs = scanLogs.map((log: any) => ({
      _id: log._id.toString(),
      ip: log.ip,
      userAgent: log.userAgent,
      referer: log.referer,
      timestamp: log.timestamp,
      location: {
        city: log.cityName,
        country: log.countryName,
        region: log.regionName,
        coordinates: {
          lat: log.latitude,
          lng: log.longitude
        }
      }
    }))

    return NextResponse.json({
      success: true,
      data: {
        scanLogs: transformedLogs,
        pagination: {
          total: totalCount,
          page,
          limit,
          hasMore: totalCount > skip + limit
        }
      }
    })
  } catch (error) {
    console.error('Error fetching scan logs:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
