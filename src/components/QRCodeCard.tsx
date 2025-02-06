import { FC, useRef, useEffect } from 'react';
import { IoMdTrash, IoMdDownload } from 'react-icons/io';
import { motion } from 'framer-motion';
import QRCodeStyling, { DotType, CornerSquareType, CornerDotType } from 'qr-code-styling';
import { MdOutlineContentCopy } from 'react-icons/md';

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
  const qrRef = useRef<QRCodeStyling>();
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !qrCode?.qrOptions) return;

    // Clear any existing QR code instance
    if (qrRef.current) {
      try {
        container.innerHTML = '';
        qrRef.current = undefined;
      } catch (error) {
        console.error('Error cleaning up QR code:', error);
      }
    }

    // Prevent multiple QR code instances
    if (container.children.length > 0) {
      return;
    }

    // Create QR code options with proper types
    const qrOptions = {
      width: 120,
      height: 120,
      data: qrCode.qrOptions.data,
      dotsOptions: {
        color: qrCode.qrOptions.dotsOptions?.color || '#000000',
        type: qrCode.qrOptions.dotsOptions?.type as DotType || 'square'
      },
      cornersSquareOptions: {
        color: qrCode.qrOptions.cornersSquareOptions?.color || '#000000',
        type: qrCode.qrOptions.cornersSquareOptions?.type as CornerSquareType || 'square'
      },
      cornersDotOptions: {
        color: qrCode.qrOptions.cornersDotOptions?.color || '#000000',
        type: qrCode.qrOptions.cornersDotOptions?.type as CornerDotType || 'square'
      },
      backgroundOptions: {
        color: qrCode.qrOptions.backgroundOptions?.color || '#ffffff',
      },
      imageOptions: {
        hideBackgroundDots: true,
        imageSize: 0.5,
        margin: 5,
        crossOrigin: 'anonymous',
      }
    };

    // Create new QR code instance
    qrRef.current = new QRCodeStyling(qrOptions);

    // Append to container
    qrRef.current.append(container);

    // Cleanup function
    return () => {
      if (container) {
        container.innerHTML = '';
      }
      if (qrRef.current) {
        qrRef.current = undefined;
      }
    };
  }, [qrCode?.qrOptions?.data]); // Only re-render when QR data changes

  const handleDownload = async () => {
    if (!qrRef.current || !qrCode?.qrOptions?.data) return;

    try {
      // Get the absolute path for the image
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      const imagePath = qrCode.qrOptions.image?.startsWith('/')
        ? `${origin}${qrCode.qrOptions.image}`
        : qrCode.qrOptions.image;

      // Create a new QR code instance with higher quality settings
      const downloadQr = new QRCodeStyling({
        ...qrCode.qrOptions,
        width: 800,  // Increased size for better quality
        height: 800,
        // image: imagePath,
        dotsOptions: {
          ...qrCode.qrOptions.dotsOptions,
          type: qrCode.qrOptions.dotsOptions?.type as DotType || 'square'
        },
        cornersSquareOptions: {
          ...qrCode.qrOptions.cornersSquareOptions,
          type: qrCode.qrOptions.cornersSquareOptions?.type as CornerSquareType || 'square'
        },
        cornersDotOptions: {
          ...qrCode.qrOptions.cornersDotOptions,
          type: qrCode.qrOptions.cornersDotOptions?.type as CornerDotType || 'square'
        },
        imageOptions: {
          hideBackgroundDots: true,
          imageSize: 0.5,
          margin: 5,
          crossOrigin: 'anonymous',
        }
      });

      // Download with higher quality
      await downloadQr.download({
        name: `qr-code-${qrCode.shortId}`,
        extension: 'png'
      });
    } catch (error) {
      console.error('Error downloading QR code:', error);
      alert('Failed to download QR code');
    }
  };

  return (
    <div className='relative bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex items-start space-x-4'>
      {/* QR Code on the Left */}
      <div
        className='flex-shrink-0 flex items-center justify-center bg-gray-100 rounded-md cursor-pointer'
        style={{ width: '120px', height: '120px' }}
        onClick={() => handleViewLargeQR(qrCode, index)}
      >
        <div 
        title='Click to view large QR code'
          ref={containerRef}
          className="flex items-center justify-center w-full h-full"
          style={{ minHeight: '120px' }}
        />
      </div>

      {/* Content on the Right */}
      <div className='flex-grow min-w-0'>
        <h3 className='text-sm font-medium text-gray-900 truncate'>
          {qrCode.title}
        </h3>
        <p className='mt-1 text-sm text-gray-500 truncate'>
          {qrCode.targetUrl}
        </p>
        {/* description with ... ending  */}
        <p className='mt-1 text-xs text-gray-500 truncate'>
          {qrCode?.textContent}
        </p>
        <div className='mt-2 flex items-center space-x-2'>
          <button
            className='text-xs p-0.5 px-1 flex border rounded-md text-gray-300 w-20'
            style={{ backgroundColor: qrCode?.qrOptions?.dotsOptions?.color || '#4a5568' }}
            onClick={() => handleOpenScanModal(qrCode)}
          >
            View Scans
          </button>
        </div>
        <span className='text-xs text-gray-500'>scan counts : {qrCode?.scanCount || 0}</span>
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
              <MdOutlineContentCopy className='text-lg' />
              <span>copy url</span>
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
                setQrIdForDelete(selectedQRCode?._id);
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
