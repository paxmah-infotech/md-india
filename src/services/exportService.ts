import { toast } from 'react-hot-toast';
import ExcelJS from 'exceljs';

export type ExportFormat = 'excel' | 'pdf' | 'json';

interface ExportOptions {
  format: ExportFormat;
  fileName?: string;
}

const generatePDF = async (data: any) => {
  const { PDFDocument, rgb, StandardFonts } = await import('pdf-lib');
  const doc = await PDFDocument.create();
  const timesRomanFont = await doc.embedFont(StandardFonts.TimesRoman);
  const helveticaFont = await doc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await doc.embedFont(StandardFonts.HelveticaBold);

  // Cover page
  const coverPage = doc.addPage();
  const { width, height } = coverPage.getSize();
  
  coverPage.drawText('QR Code Export Report', {
    x: 50,
    y: height - 100,
    size: 24,
    font: helveticaBold,
    color: rgb(0, 0, 0)
  });

  coverPage.drawText(`Generated on: ${new Date().toLocaleDateString()}`, {
    x: 50,
    y: height - 140,
    size: 12,
    font: helveticaFont,
    color: rgb(0.4, 0.4, 0.4)
  });

  // Summary page
  const summaryPage = doc.addPage();
  let yOffset = height - 100;
  
  summaryPage.drawText('Summary', {
    x: 50,
    y: yOffset,
    size: 20,
    font: helveticaBold,
    color: rgb(0, 0, 0)
  });
  
  yOffset -= 40;
  const totalQRs = data.qrCodes.length;
  const totalScans = data.qrCodes.reduce((acc: number, qr: any) => acc + (qr.scanCount || 0), 0);
  const activeQRs = data.qrCodes.filter((qr: any) => qr.active).length;

  const summaryItems = [
    `Total QR Codes: ${totalQRs}`,
    `Total Scans: ${totalScans}`,
    `Active QR Codes: ${activeQRs}`,
    `Inactive QR Codes: ${totalQRs - activeQRs}`
  ];

  for (const item of summaryItems) {
    summaryPage.drawText(item, {
      x: 50,
      y: yOffset,
      size: 12,
      font: helveticaFont,
      color: rgb(0.2, 0.2, 0.2)
    });
    yOffset -= 25;
  }

  // QR Codes detail pages
  for (const qr of data.qrCodes) {
    const page = doc.addPage();
    yOffset = height - 100;

    // QR Code title with status indicator
    const statusColor = qr.active ? rgb(0.2, 0.7, 0.2) : rgb(0.7, 0.2, 0.2);
    const status = qr.active ? 'Active' : 'Inactive';
    
    page.drawText(qr.title || 'Untitled QR Code', {
      x: 50,
      y: yOffset,
      size: 18,
      font: helveticaBold,
      color: rgb(0, 0, 0)
    });

    page.drawText(status, {
      x: 50,
      y: yOffset - 20,
      size: 12,
      font: helveticaFont,
      color: statusColor
    });

    yOffset -= 50;

    // QR Code details
    const details = [
      `Created: ${new Date(qr.createdAt).toLocaleDateString()}`,
      `Type: ${qr.type}`,
      `URL: ${qr.url}`,
      `Total Scans: ${qr.scanCount || 0}`,
      `Last Scan: ${qr.lastScan ? new Date(qr.lastScan).toLocaleDateString() : 'Never'}`
    ];

    for (const detail of details) {
      page.drawText(detail, {
        x: 50,
        y: yOffset,
        size: 12,
        font: helveticaFont,
        color: rgb(0.2, 0.2, 0.2)
      });
      yOffset -= 20;
    }

    // Recent scans
    if (qr.recentScans && qr.recentScans.length > 0) {
      yOffset -= 30;
      page.drawText('Recent Scans:', {
        x: 50,
        y: yOffset,
        size: 14,
        font: helveticaBold,
        color: rgb(0, 0, 0)
      });
      yOffset -= 20;

      for (const scan of qr.recentScans.slice(0, 5)) {
        const scanInfo = `${new Date(scan.timestamp).toLocaleString()}`;
        const locationInfo = scan.location ? ` - ${scan.location}` : '';
        const deviceInfo = scan.device ? ` - ${scan.device}` : '';
        
        page.drawText(`• ${scanInfo}${locationInfo}${deviceInfo}`, {
          x: 70,
          y: yOffset,
          size: 10,
          font: timesRomanFont,
          color: rgb(0.3, 0.3, 0.3)
        });
        yOffset -= 15;
      }
    }

    // Add QR code image if available
    if (qr.imageData) {
      try {
        const qrImage = await doc.embedPng(qr.imageData);
        const imgDims = qrImage.scale(0.5); // Scale down if needed
        page.drawImage(qrImage, {
          x: width - 200,
          y: height - 250,
          width: 150,
          height: 150,
        });
      } catch (error) {
        console.error('Failed to embed QR image:', error);
      }
    }
  }

  return await doc.save();
};

const generateExcel = async (data: any) => {
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
  data.qrCodes.forEach((qr: any) => {
    worksheet.addRow({
      id: qr._id,
      createdAt: new Date(qr.createdAt).toLocaleDateString(),
      content: qr.content,
      type: qr.type,
      scanCount: qr.scanCount || 0,
      lastScanned: qr.lastScanned ? new Date(qr.lastScanned).toLocaleDateString() : 'Never'
    });
  });

  // Generate buffer
  const buffer = await workbook.xlsx.writeBuffer();
  return buffer;
};

export async function exportUserData({ format, fileName }: ExportOptions): Promise<boolean> {
  try {
    const response = await fetch(`/api/auth/user/data/export?format=${format}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/octet-stream'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Failed to export data');
    }

    // Get the blob directly from response
    const blob = await response.blob();
    const mimeType = format === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    
    // Create and trigger download
    const url = window.URL.createObjectURL(new Blob([blob], { type: mimeType }));
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName || `QRData_${new Date().toISOString()}.${format === 'excel' ? 'xlsx' : format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    toast.success(`Successfully exported data as ${format.toUpperCase()}`);
    return true;
  } catch (error: any) {
    console.error('Export error:', error);
    toast.error(error.message || 'Failed to export data');
    return false;
  }
}
