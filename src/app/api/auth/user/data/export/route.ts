import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { getUserQRCodes } from '@/services/qrService';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import ExcelJS from 'exceljs';
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
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('QR Codes');

      // Add headers
      worksheet.columns = [
        { header: 'QR Code ID', key: 'id', width: 30 },
        { header: 'Created Date', key: 'createdAt', width: 20 },
        { header: 'Content', key: 'content', width: 50 },
        { header: 'Type', key: 'type', width: 15 },
        { header: 'Scan Count', key: 'scanCount', width: 15 },
        { header: 'Last Scanned', key: 'lastScanned', width: 20 }
      ];

      // Style the header row
      worksheet.getRow(1).font = { bold: true };
      worksheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE0E0E0' }
      };

      // Add data
      qrCodes.forEach((qr: any) => {
        worksheet.addRow({
          id: qr._id,
          createdAt: new Date(qr.createdAt).toLocaleDateString(),
          content: qr.content,
          type: qr.type,
          scanCount: qr.scanCount || 0,
          lastScanned: qr.lastScanned ? new Date(qr.lastScanned).toLocaleDateString() : 'Never'
        });
      });

      const buffer = await workbook.xlsx.writeBuffer();
      
      return new NextResponse(buffer, {
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': 'attachment; filename="qr-codes-export.xlsx"'
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
