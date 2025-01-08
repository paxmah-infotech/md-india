import { FC, useRef } from 'react';
import { IoMdShare, IoMdTrash, IoMdDownload } from 'react-icons/io';
import { motion } from 'framer-motion';
import QRCode from 'qrcode';

interface QRCodeCardProps {
  qrCode: any;
  index: number;
  qrPreview: any;
  handleViewLargeQR: (qrCode: any, index: number) => void;
  handleOpenScanModal: (scans: any) => void;
  handleShare: (qrCode: any) => void;
  setSelectedQRCode: (qrCode: any) => void;
  selectedQRCode: any;
  closeOptions: any;
  setQrIdForDelete?: any;
  setShowConfirm: (show: boolean) => void;
}

const QRCodeCard: FC<QRCodeCardProps> = ({
  qrCode,
  index,
  qrPreview,
  handleViewLargeQR,
  handleOpenScanModal,
  handleShare,
  setSelectedQRCode,
  selectedQRCode,
  closeOptions,
  setShowConfirm,
  setQrIdForDelete
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleDownload = async () => {
    if (typeof window === 'undefined') return;

    try {
      // Create a temporary canvas with white background
      const tempCanvas = document.createElement('canvas');
      const size = 500; // Larger size for better quality
      tempCanvas.width = size;
      tempCanvas.height = size;

      // Generate QR code directly on the canvas
      console.log("qr code is here , ", qrCode?.qrOptions?.data)
      await QRCode.toCanvas(tempCanvas, qrCode?.qrOptions?.data || '', {
        width: size,
        margin: 2,
        color: {
          dark: qrCode?.qrOptions?.dotsOptions?.color || '#000000',
          light: '#ffffff'
        },
        // Add any other QR code options from qrCode.qrOptions here
      });

      // Convert to blob
      const blob = await new Promise<Blob>((resolve, reject) => {
        tempCanvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to create blob'));
          }
        }, 'image/png', 1.0);
      });

      // Create download link
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${qrCode.title || 'qr-code'}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert('An error occurred while downloading the QR code');
      }
    }
  };

  return (
    <div
      key={qrCode._id}
      className='flex bg-white shadow-md rounded-lg items-center p-4 hover:shadow-lg transition-shadow duration-200 relative'
    >
      {/* QR Code on the Left */}
      <div
        ref={qrPreview}
        className='flex-shrink-0 flex items-center justify-center bg-gray-100 rounded-md'
        style={{
          width: '100px',
          height: '100px'
        }}
        onClick={() => handleViewLargeQR(qrCode, index)}
      >
        <canvas ref={canvasRef} />
      </div>

      {/* Details on the Right */}
      <div className='ml-4 flex flex-col justify flex-1 overflow-hidden'>
        {qrCode.showTitle && (
          <h3 className='text-sm font-medium text-gray-800 mb-1 truncate'>
            {qrCode.title}
          </h3>
        )}
        <p className='text-gray-600 text-sm mb-1'>
          Scans: {qrCode.scanCount}
        </p>
        <p className='text-sm text-gray-500 truncate'>
          Target URL:{' '}
          <a
            href={qrCode?.targetUrl}
            target='_blank'
            rel='noopener noreferrer'
            className='text-blue-500 underline break-all'
          >
            {qrCode?.targetUrl || ''}
          </a>
        </p>
        {qrCode?.scanCount > 0 && (
          <button
            className={`text-xs p-0.5 px-1 flex border bg-[${
              qrCode?.qrOptions?.dotsOptions?.color || 'bg-gray-500'
            }] rounded-md text-gray-300 w-20`}
            onClick={() => handleOpenScanModal(qrCode)}
          >
            View Scans
          </button>
        )}
      </div>

      {/* MoreVert Icon with Dropdown */}
      <div className='absolute top-2 right-2'>
        <motion.button
          onClick={() =>
            setSelectedQRCode(
              selectedQRCode?._id === qrCode._id ? null : qrCode
            )
          }
          className='text-gray-500 hover:text-gray-800'
        >
          ⋮
        </motion.button>
        {selectedQRCode && selectedQRCode._id === qrCode._id && (
          <div
            ref={closeOptions}
            className='absolute right-0 mt-2 w-40 bg-white border border-gray-200 shadow-lg rounded-lg z-10'
          >
            <button
              onClick={() => handleShare(selectedQRCode)}
              className='w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center space-x-2'
            >
              <IoMdShare className='text-lg' />
              <span>Share</span>
            </button>
            <button
              onClick={handleDownload}
              className='w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center space-x-2'
            >
              <IoMdDownload className='text-lg' />
              <span>Download</span>
            </button>
            <button
              onClick={() => {
                setShowConfirm(true);
                setQrIdForDelete(selectedQRCode?._id)
              }}
              className='w-full px-4 py-2 text-left text-red-500 hover:bg-red-100 flex items-center space-x-2'
            >
              <IoMdTrash className='text-lg' />
              <span>Delete</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QRCodeCard;
