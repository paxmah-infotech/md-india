import React from 'react'
import { DotType, CornerSquareType, CornerDotType } from 'qr-code-styling'
import UrlInput from '../common/Input'
import {
  cornerTypeOptions,
  dotTypeOptions,
  cornerDotTypeOptions,
  sizeOptions
} from './styles'

interface QRControlsProps {
  url: string
  title: string
  textContent: any
  showUrl: boolean
  showTitle: boolean
  showText: boolean
  image?: string
  cornerType: CornerSquareType
  dotType: DotType
  cornerDotType: CornerDotType
  width: number
  margin: number
  bgColor: string
  qrColor: string
  onUrlChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onTextChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  onShowTitleChange: () => void
  onShowTextChange: () => void
  onCornerTypeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  onDotTypeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  onCornerDotTypeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  onWidthChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  onMarginChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onBgColorChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onQrColorChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export const QRControls: React.FC<QRControlsProps> = ({
  url,
  title,
  textContent,
  showUrl,
  showTitle,
  showText,
  cornerType,
  image,
  dotType,
  cornerDotType,
  width,
  margin,
  bgColor,
  qrColor,
  onUrlChange,
  onTitleChange,
  onTextChange,
  onShowTitleChange,
  onShowTextChange,
  onCornerTypeChange,
  onDotTypeChange,
  onCornerDotTypeChange,
  onWidthChange,
  onMarginChange,
  onBgColorChange,
  onQrColorChange
}) => {
  return (
    <div className='space-y-6'>
      {/* URL Input */}
      {showUrl && (
        <div className='bg-white p-4 rounded-xl shadow-sm border border-gray-100'>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Target URL
          </label>
          <UrlInput
            type='text'
            value={url}
            onChange={onUrlChange}
            className='w-full border border-gray-200 rounded-lg p-3 text-sm'
            placeholder='Enter your destination URL'
          />
        </div>
      )}

      {/* Title and Text */}
      <div className='bg-white p-4 rounded-xl shadow-sm border border-gray-100'>
        <div className='space-y-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Title
            </label>
            <input
              type='text'
              value={title}
              onChange={onTitleChange}
              maxLength={60}
              className='w-full border border-gray-200 rounded-lg p-3 text-sm'
              placeholder='Enter QR title'
            />
            {/* <label className='flex items-center gap-2 text-sm text-gray-600 mt-2'>
              <input
                type='checkbox'
                checked={showTitle}
                onChange={onShowTitleChange}
                className='w-4 h-4 rounded border-gray-300 text-blue-500'
              />
              Show title in QR code
            </label> */}
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Additional Text
            </label>
            <textarea
              value={textContent}
              onChange={onTextChange}
              className='w-full border border-gray-200 rounded-lg p-3 text-sm min-h-[80px]'
              placeholder='Add description or notes'
            />
            {/* <label className='flex items-center gap-2 text-sm text-gray-600 mt-2'>
              <input
                type='checkbox'
                checked={showText}
                onChange={onShowTextChange}
                className='w-4 h-4 rounded border-gray-300 text-blue-500'
              />
              Show text in QR code
            </label> */}
          </div>
        </div>
      </div>

      {/* Advanced Options */}
      <div className='bg-white p-4 rounded-xl shadow-sm border border-gray-100'>
        <h3 className='text-sm font-semibold text-gray-700 mb-4'>
          Advanced Options
        </h3>
        <div className='space-y-4'>
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm text-gray-600 mb-2'>
                Corner Shape
              </label>
              <select
                value={cornerType}
                onChange={onCornerTypeChange}
                className='w-full border border-gray-200 rounded-lg p-3 text-sm'
              >
                {cornerTypeOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className='block text-sm text-gray-600 mb-2'>
                Dot Style
              </label>
              <select
                value={dotType}
                onChange={onDotTypeChange}
                className='w-full border border-gray-200 rounded-lg p-3 text-sm'
              >
                {dotTypeOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm text-gray-600 mb-2'>
                Corner Dot Style
              </label>
              <select
                value={cornerDotType}
                onChange={onCornerDotTypeChange}
                className='w-full border border-gray-200 rounded-lg p-3 text-sm'
              >
                {cornerDotTypeOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className='block text-sm text-gray-600 mb-2'>Size (best quality)</label>
              <select
                value={width}
                onChange={onWidthChange}
                className='w-full border border-gray-200 rounded-lg p-3 text-sm'
              >
                {sizeOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className='block text-sm text-gray-600 mb-2'>
              Margin: {margin}px (auto selected according page size)
            </label>
            <input
              type='range'
              min='0'
              max='50'
              value={margin}
              onChange={onMarginChange}
              className='w-full'
            />
          </div>
        </div>
      </div>

      {/* Colors */}
      <div className='bg-white p-4 rounded-xl shadow-sm border border-gray-100'>
        <h3 className='text-sm font-semibold text-gray-700 mb-4'>Colors</h3>
        <div className='grid grid-cols-2 gap-4'>
          <div>
            <label className='block text-sm text-gray-600 mb-2'>
              Background
            </label>
            <input
              type='color'
              value={bgColor}
              onChange={onBgColorChange}
              className='w-full h-10 rounded cursor-pointer'
            />
          </div>
          <div>
            <label className='block text-sm text-gray-600 mb-2'>QR Code</label>
            <input
              type='color'
              value={qrColor}
              onChange={onQrColorChange}
              className='w-full h-10 rounded cursor-pointer'
            />
          </div>
        </div>
      </div>
    </div>
  )
}
