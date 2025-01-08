import React from 'react'
import { QRCodeStyle } from './types'

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
  return (
    <div className='bg-white p-4 rounded-xl shadow-sm border border-gray-100'>
      <h3 className='text-sm font-semibold text-gray-700 mb-4'>Style Gallery</h3>
      <div className='grid grid-cols-4 gap-2'>
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
              id={`qr-preview-${index}`}
              className='w-full h-full bg-white flex items-center justify-center'
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
          className='mt-4 w-full py-2 text-sm text-blue-500 font-medium'
        >
          Show More
        </button>
      )}
    </div>
  )
}
