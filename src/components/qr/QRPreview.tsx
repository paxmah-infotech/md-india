import React from 'react'
import { FaDownload } from 'react-icons/fa'
import { RiLoader4Fill } from 'react-icons/ri'

interface QRPreviewProps {
  qrRef: React.RefObject<HTMLDivElement>
  width: number
  loading: boolean
  onDownload: () => void,
  title?: string
}

export const QRPreview: React.FC<QRPreviewProps> = ({
  qrRef,
  width,
  loading,
  onDownload,
  title
}) => {
  // console.log("title : ", title)
  return (
    <div className=' p-1 z-0'>
      {/* <span className='text-sm text-balanced mb-4'>{title}</span> */}
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
