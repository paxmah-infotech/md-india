import React from 'react'
import { FaDownload } from 'react-icons/fa'
import { RiLoader4Fill } from 'react-icons/ri'

interface QRPreviewProps {
  qrRef: React.RefObject<HTMLDivElement>
  width: number
  loading: boolean
  onDownload: () => void
}

export const QRPreview: React.FC<QRPreviewProps> = ({
  qrRef,
  width,
  loading,
  onDownload
}) => {
  return (
    <div className=' p-1 z-0'>
      {/* <h2 className='text-sm font-semibold text-gray-800 mb-4'>QR Code Preview</h2> */}
      <div
        ref={qrRef}
        className='flex justify-center items-center'
        style={{
          width: `${width}px`,
          height: `${width}px`,
          margin: '0 auto'
        }}
      />
      <button
        onClick={onDownload}
        disabled={loading}
        className='mt-6 w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg font-medium transition-all disabled:opacity-50'
      >
        {loading ? (
          <RiLoader4Fill className='animate-spin text-xl' />
        ) : (
          <>
            <FaDownload className='text-lg' />
            <span>Download QR Code</span>
          </>
        )}
      </button>
    </div>
  )
}
