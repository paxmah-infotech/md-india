import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import User from '@/models/user.model';
import QRCode from '@/models/qrcode.model';
import dbConnect from '@/dbConfig/dbConfig';
import ScanLog from '@/models/qrscanlog.model';
import UserHistory from '@/models/userhistory.model';
import { startOfDay, subDays, format } from 'date-fns';

export async function GET(request: NextRequest) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id: userId } = token;

    await dbConnect();
    const user = await User.findById(userId).select('name email avatar isVerified createdAt');
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Get QR codes for the user
    const qrCodes = await QRCode.find({ user: userId })
      .sort({ createdAt: -1 })
      .lean();

    const qrCodeIds = qrCodes.map(qr => qr._id);

    // Get the last 7 days
    const last7Days = Array.from({ length: 7 }, (_, i) => ({
      date: startOfDay(subDays(new Date(), i)),
      count: 0
    })).reverse();

    // Get scan logs for the last 7 days
    const scanLogs = await ScanLog.find({
      qrCode: { $in: qrCodeIds },
      timestamp: {
        $gte: last7Days[0].date,
        $lte: new Date()
      }
    });

    // Count scans per day
    scanLogs.forEach(scan => {
      const scanDate = startOfDay(new Date(scan.timestamp));
      const dayIndex = last7Days.findIndex(day =>
        day.date.getTime() === scanDate.getTime()
      );
      if (dayIndex !== -1) {
        last7Days[dayIndex].count++;
      }
    });

    // Get the first page of scan logs for each QR code
    const LIMIT = 10;
    const recentScansPromises = qrCodeIds.map(async qrCodeId => {
      const logs = await ScanLog.find({ qrCode: qrCodeId })
        .sort({ timestamp: -1 })
        .limit(LIMIT)
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
        .lean();

      const totalCount = await ScanLog.countDocuments({ qrCode: qrCodeId });

      return {
        qrCodeId: qrCodeId?.toString(),
        scanLogs: logs.map(log => ({
          _id: log?._id?.toString(),
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
        })),
        pagination: {
          total: totalCount,
          page: 1,
          limit: LIMIT,
          hasMore: totalCount > LIMIT
        }
      };
    });

    const recentScans = await Promise.all(recentScansPromises);

    // Transform QR codes and add their scan counts
    const transformedQRCodes = qrCodes.map((qr:any) => {
      const scans = recentScans.find(scan => scan.qrCodeId === qr._id.toString());
      return {
        ...qr,
        _id: qr._id.toString(),
        scanLogs: scans?.scanLogs || [],
        pagination: scans?.pagination || {
          total: 0,
          page: 1,
          limit: LIMIT,
          hasMore: false
        }
      };
    });

    // Combine all dashboard data
    const dashboardData = {
      user: {
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        isVerified: user.isVerified,
        createdAt: user.createdAt,
      },
      stats: {
        totalQrCodes: qrCodes.length,
        totalScans: scanLogs.length,
        recentScans: last7Days[last7Days.length - 1].count, // Today's scans
        activeQrCodes: qrCodes.filter(qr => qr.isActive).length,
      },
      graphData: {
        labels: last7Days.map(day => format(day.date, 'MMM dd')),
        scans: last7Days.map(day => day.count),
      },
      qrCodes: transformedQRCodes,
      analytics: {
        last7Days
      }
    };

    return NextResponse.json({
      success: true,
      message: "Dashboard data fetched successfully",
      data: dashboardData
    });

  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { message: "Error fetching dashboard data" },
      { status: 500 }
    );
  }
}