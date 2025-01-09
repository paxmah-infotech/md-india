import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { getUserQRCodes } from '@/services/qrService';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import * as XLSX from 'xlsx';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      console.error('No user ID found in session:', session);
      return new NextResponse('Unauthorized - No user ID', { status: 401 });
    }

    const format = request.nextUrl.searchParams.get('format') || 'pdf';
    console.log('Fetching QR codes for user:', session.user.id);
    
    const qrCodes = await getUserQRCodes(session.user.id);
    console.log(`Retrieved ${qrCodes.length} QR codes`);
    
    // Format the data
    const exportData = {
      user: {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name || session.user.email
      },
      qrCodes
    };

    if (format === 'pdf') {
      const pdfDoc = await PDFDocument.create();
      const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

      // Cover page with minimal height
      const coverPage = pdfDoc.addPage([595, 250]); // Significantly reduced height
      let yOffset = 200; // Start closer to top

      // Title
      coverPage.drawText('QR Code Export Report', {
        x: 50,
        y: yOffset,
        size: 20, // Slightly smaller title
        font: helveticaBold,
        color: rgb(0, 0, 0)
      });

      yOffset -= 25;

      coverPage.drawText(`Generated on: ${new Date().toLocaleDateString()}`, {
        x: 50,
        y: yOffset,
        size: 11,
        font: helvetica,
        color: rgb(0.4, 0.4, 0.4)
      });

      yOffset -= 30;

      // User info - no separate header, more compact
      const userInfo = [
        `Name: ${exportData.user.name}`,
        `Email: ${exportData.user.email}`
      ];

      userInfo.forEach((info) => {
        coverPage.drawText(info, {
          x: 50,
          y: yOffset,
          size: 11,
          font: helvetica,
          color: rgb(0.2, 0.2, 0.2)
        });
        yOffset -= 20;
      });

      // Summary section with minimal height
      const summaryPage = pdfDoc.addPage([595, 200]); // Reduced height
      yOffset = 150; // Start closer to top

      summaryPage.drawText('Summary', {
        x: 50,
        y: yOffset,
        size: 16,
        font: helveticaBold,
        color: rgb(0, 0, 0)
      });

      yOffset -= 25;

      const qrCodes = exportData.qrCodes || [];
      const totalQRs = qrCodes.length;
      const totalScans = qrCodes.reduce((acc, qr) => acc + (qr.scanCount || 0), 0);
      const avgScansPerQR = totalQRs > 0 ? Math.round(totalScans / totalQRs) : 0;
      const mostUsedType = getMostCommonType(qrCodes) || 'N/A';
      const mostScannedQR = qrCodes.length > 0 
        ? qrCodes.reduce((prev, current) => 
            ((prev.scanCount || 0) > (current.scanCount || 0)) ? prev : current
          )
        : null;

      const summaryItems = [
        `Total QR Codes: ${totalQRs}`,
        `Total Scans: ${totalScans}`,
        `Most Used Type: ${mostUsedType}`
      ];

      summaryItems.forEach(item => {
        summaryPage.drawText(item, {
          x: 50,
          y: yOffset,
          size: 11,
          font: helvetica,
          color: rgb(0.2, 0.2, 0.2)
        });
        yOffset -= 20;
      });

      // QR Code details with optimized layout
      const itemsPerPage = 5;
      for (let i = 0; i < exportData.qrCodes.length; i += itemsPerPage) {
        const pageQRCodes = exportData.qrCodes.slice(i, i + itemsPerPage);
        const pageHeight = 200 + (pageQRCodes.length * 100);
        const page = pdfDoc.addPage([595, pageHeight]);
        yOffset = pageHeight - 50;

        pageQRCodes.forEach(qr => {
          page.drawText(qr.title, {
            x: 50,
            y: yOffset,
            size: 14,
            font: helveticaBold,
            color: rgb(0, 0, 0)
          });

          yOffset -= 25;

          const details = [
            `Type: ${qr.type}`,
            `URL: ${qr.url}`,
            `Created: ${new Date(qr.createdAt).toLocaleDateString()}`,
            `Total Scans: ${qr.scanCount}`
          ];

          details.forEach(detail => {
            page.drawText(detail, {
              x: 50,
              y: yOffset,
              size: 11,
              font: helvetica,
              color: rgb(0.2, 0.2, 0.2)
            });
            yOffset -= 20;
          });

          yOffset -= 15;
        });
      }

      const pdfBytes = await pdfDoc.save();
      return new NextResponse(pdfBytes, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'attachment; filename=QRData.pdf'
        }
      });
    }
    
    if (format === 'excel') {
      const workbook = XLSX.utils.book_new();

      // Add metadata
      workbook.Props = {
        Title: "QR Code Export Report",
        Subject: "QR Code Data Export",
        Author: exportData.user.name,
        CreatedDate: new Date()
      };

      // QR Codes Sheet with styling
      const qrCodesData = exportData.qrCodes.map(qr => ({
        'QR Title': qr.title,
        'Type': qr.type.toUpperCase(),
        'Target URL': qr.url,
        'Created Date': new Date(qr.createdAt).toLocaleDateString(),
        'Last Modified': new Date(qr.updatedAt).toLocaleDateString(),
        'Total Scans': qr.scanCount,
        'Status': 'Active'
      }));
      
      const qrSheet = XLSX.utils.json_to_sheet(qrCodesData);

      // Set column widths
      const qrColWidths = [
        { wch: 30 }, // QR Title
        { wch: 15 }, // Type
        { wch: 40 }, // Target URL
        { wch: 15 }, // Created Date
        { wch: 15 }, // Last Modified
        { wch: 12 }, // Total Scans
        { wch: 10 }  // Status
      ];
      qrSheet['!cols'] = qrColWidths;

      // Add header style
      const qrRange = XLSX.utils.decode_range(qrSheet['!ref'] || 'A1');
      for (let C = qrRange.s.c; C <= qrRange.e.c; ++C) {
        const address = XLSX.utils.encode_col(C) + "1";
        if (!qrSheet[address]) continue;
        qrSheet[address].s = {
          font: { bold: true, color: { rgb: "FFFFFF" } },
          fill: { fgColor: { rgb: "4F81BD" } },
          alignment: { horizontal: "center" }
        };
      }

      XLSX.utils.book_append_sheet(workbook, qrSheet, 'QR Codes');

      // Analytics Sheet with enhanced metrics
      const qrCodes = exportData.qrCodes || [];
      const totalQRs = qrCodes.length;
      const totalScans = qrCodes.reduce((acc, qr) => acc + (qr.scanCount || 0), 0);
      const avgScansPerQR = totalQRs > 0 ? Math.round(totalScans / totalQRs) : 0;
      const mostUsedType = getMostCommonType(qrCodes) || 'N/A';
      const mostScannedQR = qrCodes.length > 0 
        ? qrCodes.reduce((prev, current) => 
            ((prev.scanCount || 0) > (current.scanCount || 0)) ? prev : current
          )
        : null;

      const analytics = [
        { 'Metric': 'Total QR Codes', 'Value': totalQRs },
        { 'Metric': 'Total Scans', 'Value': totalScans },
        { 'Metric': 'Average Scans per QR', 'Value': avgScansPerQR },
        { 'Metric': 'Most Used Type', 'Value': mostUsedType },
        { 'Metric': 'Most Scanned QR', 'Value': mostScannedQR?.title },
        { 'Metric': 'Most Scanned QR (Scans)', 'Value': mostScannedQR?.scanCount },
        { 'Metric': 'Export Date', 'Value': new Date().toLocaleDateString() },
        { 'Metric': 'User', 'Value': exportData.user.name }
      ];

      const analyticsSheet = XLSX.utils.json_to_sheet(analytics);

      // Set analytics column widths
      analyticsSheet['!cols'] = [
        { wch: 25 }, // Metric
        { wch: 30 }  // Value
      ];

      // Style analytics headers
      const analyticsRange = XLSX.utils.decode_range(analyticsSheet['!ref'] || 'A1');
      for (let C = analyticsRange.s.c; C <= analyticsRange.e.c; ++C) {
        const address = XLSX.utils.encode_col(C) + "1";
        if (!analyticsSheet[address]) continue;
        analyticsSheet[address].s = {
          font: { bold: true, color: { rgb: "FFFFFF" } },
          fill: { fgColor: { rgb: "4F81BD" } },
          alignment: { horizontal: "center" }
        };
      }

      XLSX.utils.book_append_sheet(workbook, analyticsSheet, 'Analytics');

      // Usage Trends Sheet
      const trends = exportData.qrCodes.map(qr => ({
        'QR Code': qr.title,
        'Type': qr.type.toUpperCase(),
        'Days Active': Math.ceil((new Date().getTime() - new Date(qr.createdAt).getTime()) / (1000 * 3600 * 24)),
        'Total Scans': qr.scanCount,
        'Avg. Scans per Day': (qr.scanCount / Math.max(1, Math.ceil((new Date().getTime() - new Date(qr.createdAt).getTime()) / (1000 * 3600 * 24)))).toFixed(2)
      })).sort((a, b) => b['Total Scans'] - a['Total Scans']);

      const trendsSheet = XLSX.utils.json_to_sheet(trends);

      // Set trends column widths
      trendsSheet['!cols'] = [
        { wch: 30 }, // QR Code
        { wch: 15 }, // Type
        { wch: 12 }, // Days Active
        { wch: 12 }, // Total Scans
        { wch: 15 }  // Avg. Scans per Day
      ];

      // Style trends headers
      const trendsRange = XLSX.utils.decode_range(trendsSheet['!ref'] || 'A1');
      for (let C = trendsRange.s.c; C <= trendsRange.e.c; ++C) {
        const address = XLSX.utils.encode_col(C) + "1";
        if (!trendsSheet[address]) continue;
        trendsSheet[address].s = {
          font: { bold: true, color: { rgb: "FFFFFF" } },
          fill: { fgColor: { rgb: "4F81BD" } },
          alignment: { horizontal: "center" }
        };
      }

      XLSX.utils.book_append_sheet(workbook, trendsSheet, 'Usage Trends');

      const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
      return new NextResponse(excelBuffer, {
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': 'attachment; filename=QRData.xlsx'
        }
      });
    }

    return new NextResponse('Invalid format specified', { status: 400 });
  } catch (error: any) {
    console.error('Export error:', error);
    return new NextResponse(error.message || 'Export failed', { status: 500 });
  }
}

function getMostCommonType(qrCodes: any[]): string {
  if (!qrCodes || qrCodes.length === 0) return 'N/A';
  
  const typeCounts = qrCodes.reduce((acc: { [key: string]: number }, qr) => {
    const type = qr.type || 'Unknown';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(typeCounts).reduce((a, b) => a[1] > b[1] ? a : b)[0];
}
