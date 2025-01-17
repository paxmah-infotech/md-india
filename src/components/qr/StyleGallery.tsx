import React, { useEffect, useRef } from 'react'
import { QRCodeStyle } from './types'
import QRCodeStyling from 'qr-code-styling'
import { siteConfig } from '@/config/site.config'

interface StyleGalleryProps {
  styles: QRCodeStyle[]
  visibleQrs: number
  selectedStyleIndex: number | null
  onStyleSelect: (index: number) => void
  onShowMore: () => void
}

export const StyleGallery: React.FC<StyleGalleryProps> = ({
  styles,
  visibleQrs,
  selectedStyleIndex,
  onStyleSelect,
  onShowMore
}) => {
  const containersRef = useRef<Map<number, HTMLDivElement>>(new Map())
  const qrCodesRef = useRef<Map<number, QRCodeStyling>>(new Map())

  const setContainerRef = (index: number) => (element: HTMLDivElement | null) => {
    if (element) {
      containersRef.current.set(index, element)
    } else {
      containersRef.current.delete(index)
    }
  }

  useEffect(() => {
    if (typeof window === 'undefined') return

    // Cleanup old QR codes
    containersRef.current.forEach((container) => {
      container.innerHTML = ''
    })
    qrCodesRef.current.clear()

    // Create and render new QR codes
    styles.slice(0, visibleQrs).forEach((style, index) => {
      try {
        const container = containersRef.current.get(index)
        if (!container) return

        const qr = new QRCodeStyling({
          width:  105,
          height: 105,
          type: 'svg',
          data: `${window.location.origin}/api/v1/qr?shortId=find&targetUrl=${encodeURIComponent('https://example.com')}`,
          // image: siteConfig.qrlogo,
          dotsOptions: {
            color: style.color || '#000000',
            type: style.dotsOptions?.type || 'square'
          },
          cornersSquareOptions: {
            type: style.cornersSquareOptions?.type || 'square'
          },
          cornersDotOptions: {
            type: 'square'
          },
          backgroundOptions: {
            color: style.backgroundColor || '#FFFFFF',
          },
          imageOptions: {
            crossOrigin: 'anonymous',
            margin: 5
          }
        })

        qrCodesRef.current.set(index, qr)
        
        void qr.append(container)
      } catch (error) {
        console.error('Error creating QR code:', error)
      }
    })

    return () => {
      // Cleanup on unmount
      containersRef.current.forEach((container) => {
        container.innerHTML = ''
      })
      qrCodesRef.current.clear()
    }
  }, [styles, visibleQrs])

  return (
    <div className='bg-white p-4 rounded-xl shadow-sm border border-gray-100'>
      <h3 className='text-sm font-semibold text-gray-700 mb-4'>Style Gallery</h3>
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2'>
        {styles.slice(0, visibleQrs).map((style, index) => (
          <div
            key={index}
            className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer ${
              selectedStyleIndex === index
                ? 'ring-2 ring-blue-500 shadow-sm'
                : 'hover:shadow-sm border border-gray-200'
            }`}
            onClick={() => onStyleSelect(index)}
          >
            <div
              ref={setContainerRef(index)}
              className='w-full h-full bg-white flex items-center justify-center p-1'
            />
            {selectedStyleIndex === index && (
              <div className='absolute inset-0 bg-blue-500/10 flex items-center justify-center'>
                <div className='bg-white rounded-full p-1'>
                  <svg
                    className='w-3 h-3 text-blue-500'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M5 13l4 4L19 7'
                    />
                  </svg>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      {visibleQrs < styles.length && (
        <button
          onClick={onShowMore}
          className='mt-4 w-full py-2 text-sm text-blue-500 font-medium hover:bg-blue-50 rounded-lg transition-colors'
        >
          Show More
        </button>
      )}
    </div>
  )
}
