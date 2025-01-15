import React, { useEffect, useRef, useState } from 'react'
import QRCodeStyling, { DotType, CornerSquareType } from 'qr-code-styling'
import { MdOutlineFileUpload } from 'react-icons/md'
import { FaDownload } from 'react-icons/fa'
import { RiLoader4Fill } from 'react-icons/ri'
import Image from 'next/image'
import { createQr } from '@/utils/apiHandlers'
import { useRouter } from 'next/navigation'
import UrlInput from './common/Input'
import html2canvas from 'html2canvas'
import { siteConfig } from '@/config/site.config'

// QR code styles
const qrCodeStyles = [
  {
    name: 'Red Square',
    dotsOptions: { type: 'square' as DotType },
    cornersSquareOptions: { type: 'square' as CornerSquareType },
    backgrouondColor: '#ffffff',
    color: '#000000'
  },
  {
    name: 'Green Dots',
    dotsOptions: { type: 'dots' as DotType },
    cornersSquareOptions: { type: 'extra-rounded' as CornerSquareType },
    backgrouondColor: '#ffffff',
    color: '#4caf50'
  },
  {
    name: 'Blue Dots',
    dotsOptions: { type: 'dots' as DotType },
    cornersSquareOptions: { type: 'dot' as CornerSquareType },
    backgrouondColor: '#ffffff',
    color: '#2196f3'
  },
  {
    name: 'Orange Classy',
    dotsOptions: { type: 'classy' as DotType },
    cornersSquareOptions: { type: 'square' as CornerSquareType },
    backgrouondColor: '#ffffff',
    color: '#ff5722'
  },
  {
    name: 'Purple Classy Rounded',
    dotsOptions: { type: 'classy-rounded' as DotType },
    cornersSquareOptions: { type: 'extra-rounded' as CornerSquareType },
    backgrouondColor: '#ffffff',
    color: '#9c27b0'
  },
  {
    name: 'Cyan Rounded Dots',
    dotsOptions: { type: 'dots' as DotType },
    cornersSquareOptions: { type: 'rounded' as CornerSquareType },
    backgrouondColor: '#ffffff',
    color: '#00bcd4'
  },
  {
    name: 'Orange Dotted',
    dotsOptions: { type: 'dots' as DotType },
    cornersSquareOptions: { type: 'dot' as CornerSquareType },
    backgrouondColor: '#ffffff',
    color: '#ff9800'
  },
  {
    name: 'Pink Diamond',
    dotsOptions: { type: 'diamond' as DotType },
    cornersSquareOptions: { type: 'rounded' as CornerSquareType },
    backgrouondColor: '#ffffff',
    color: '#e91e63'
  },
  {
    name: 'Purple Star',
    dotsOptions: { type: 'star' as DotType },
    cornersSquareOptions: { type: 'classy-rounded' as CornerSquareType },
    backgrouondColor: '#ffffff',
    color: '#673ab7'
  },
  {
    name: 'Teal Rectangular',
    dotsOptions: { type: 'rect' as DotType },
    cornersSquareOptions: { type: 'rounded' as CornerSquareType },
    backgrouondColor: '#ffffff',
    color: '#009688'
  },
  {
    name: 'Brown Rounded Dots',
    dotsOptions: { type: 'dots' as DotType },
    cornersSquareOptions: { type: 'rounded' as CornerSquareType },
    backgrouondColor: '#ffffff',
    color: '#795548'
  },
  {
    name: 'Blue Classy',
    dotsOptions: { type: 'classy' as DotType },
    cornersSquareOptions: { type: 'square' as CornerSquareType },
    backgrouondColor: '#ffffff',
    color: '#3f51b5'
  },
  {
    name: 'Gray Classy Rounded',
    dotsOptions: { type: 'classy-rounded' as DotType },
    cornersSquareOptions: { type: 'rounded' as CornerSquareType },
    backgrouondColor: '#ffffff',
    color: '#9e9e9e'
  },
  {
    name: 'Blue Gray Rounded',
    dotsOptions: { type: 'rounded' as DotType },
    cornersSquareOptions: { type: 'extra-rounded' as CornerSquareType },
    backgrouondColor: '#ffffff',
    color: '#607d8b'
  },
  {
    name: 'Light Green Square',
    dotsOptions: { type: 'square' as DotType },
    cornersSquareOptions: { type: 'dot' as CornerSquareType },
    backgrouondColor: '#ffffff',
    color: '#8bc34a'
  },
  {
    name: 'Yellow Star',
    dotsOptions: { type: 'star' as DotType },
    cornersSquareOptions: { type: 'dot' as CornerSquareType },
    backgrouondColor: '#ffffff',
    color: '#ffc107'
  },
  {
    name: 'Bright Yellow Dots',
    dotsOptions: { type: 'dots' as DotType },
    cornersSquareOptions: { type: 'square' as CornerSquareType },
    backgrouondColor: '#ffffff',
    color: '#ffeb3b'
  },
  {
    name: 'Cyan Classy Rounded',
    dotsOptions: { type: 'classy-rounded' as DotType },
    cornersSquareOptions: { type: 'rounded' as CornerSquareType },
    backgrouondColor: '#ffffff',
    color: '#00e5ff'
  },
  {
    name: 'Orange Extra-Rounded',
    dotsOptions: { type: 'square' as DotType },
    cornersSquareOptions: { type: 'extra-rounded' as CornerSquareType },
    backgrouondColor: '#ffffff',
    color: '#ff5722'
  },
  {
    name: 'Bright Red Dots',
    dotsOptions: { type: 'dot' as DotType },
    cornersSquareOptions: { type: 'classy-rounded' as CornerSquareType },
    backgrouondColor: '#ffffff',
    color: '#ff1744'
  },
  {
    name: 'Purple Dotted',
    dotsOptions: { type: 'dots' as DotType },
    cornersSquareOptions: { type: 'dot' as CornerSquareType },
    backgrouondColor: '#ffffff',
    color: '#8e24aa'
  },
  {
    name: 'Blue Extra-Rounded Classy',
    dotsOptions: { type: 'classy' as DotType },
    cornersSquareOptions: { type: 'extra-rounded' as CornerSquareType },
    backgrouondColor: '#ffffff',
    color: '#3f51b5'
  },
  {
    name: 'Dark Purple Square',
    dotsOptions: { type: 'classy-rounded' as DotType },
    cornersSquareOptions: { type: 'square' as CornerSquareType },
    backgrouondColor: '#ffffff',
    color: '#7b1fa2'
  }
]

export default function StylishQRCode () {
  const [url, setUrl] = useState('https://example.com')
  const [showUrl, setShowUrl] = useState(true)
  const [selectedStyleIndex, setSelectedStyleIndex] = useState<number | null>(0)
  const [bgColor, setBgColor] = useState('#ffffff')
  const [qrColor, setQrColor] = useState('')
  const [isGradient, setIsGradient] = useState(false)
  const [logo, setLogo] = useState<File | null>(null)
  const [title, setTitle] = useState('Scan Me')
  const [showTitle, setShowTitle] = useState(true)
  const [showText, setShowText] = useState(true)
  const [textContent, setTextContent] = useState('')
  const [qrCreated, setQrCreated] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [gradientColors, setGradientColors] = useState(['#ff0000', '#0000ff'])
  const [cornerType, setCornerType] = useState<CornerSquareType>('square')
  const [dotType, setDotType] = useState<DotType>('square')
  const [cornerDotType, setCornerDotType] = useState<DotType>('square')
  const [margin, setMargin] = useState(20)
  const [width, setWidth] = useState(300)
  const [visibleQrs, setVisibleQrs] = useState(4)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setIsClient(true) // This will ensure that the component is only rendered on the client side.
  }, [])

  const router = useRouter()

  const [selectedLogo, setSelectedLogo] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const qrRef = useRef<HTMLDivElement>(null)
  const desktopQrRef = useRef<HTMLDivElement>(null)
  const qrCodeInstance = useRef<QRCodeStyling | null>(null)

  const handleStyleSelection = (index: number) => {
    setSelectedStyleIndex(index)
    setQrColor('')
    setBgColor('')
  }

  useEffect(() => {
    if (selectedStyleIndex === null || selectedStyleIndex === undefined) return

    const defaultBgColor =
      bgColor || qrCodeStyles[selectedStyleIndex]?.backgrouondColor || '#ffffff'
    const defaultQrColor =
      qrColor || qrCodeStyles[selectedStyleIndex]?.color || '#000000'

    const qrOptions: any = {
      width,
      height: width,
      data: url || 'https://example.com',
      // image: siteConfig.qrlogo,
      dotsOptions: {
        color: defaultQrColor,
        type: dotType
      },
      cornersSquareOptions: {
        type: cornerType,
        color: defaultQrColor
      },
      cornersDotOptions: {
        type: cornerDotType,
        color: defaultQrColor
      },
      backgroundOptions: {
        color: defaultBgColor
      },
      imageOptions: {
        hideBackgroundDots: true,
        imageSize: 0.4,
        margin: 0
      },
      margin,
      qrOptions: {
        errorCorrectionLevel: 'H'
      }
    }

    setQrColor(defaultQrColor)
    setBgColor(defaultBgColor)

    // Create QR instance for mobile preview
    if (qrRef.current) {
      qrRef.current.innerHTML = ''
      qrCodeInstance.current = new QRCodeStyling(qrOptions)
      qrCodeInstance.current.append(qrRef.current)
    }

    // Create QR instance for desktop preview
    if (desktopQrRef.current) {
      desktopQrRef.current.innerHTML = ''
      const desktopQrInstance = new QRCodeStyling(qrOptions)
      desktopQrInstance.append(desktopQrRef.current)
    }
  }, [
    url,
    selectedStyleIndex,
    qrColor,
    bgColor,
    width,
    cornerType,
    cornerDotType,
    dotType,
    margin,
    logo
  ])

  useEffect(() => {
    qrCodeStyles.forEach((style, index) => {
      const qrCodeInstance = new QRCodeStyling({
        ...style,
        width: 85,
        height: 85,
        data: `${window.location.origin}/api/v1/qr?shortId=find&targetUrl=${url}`,
        backgroundOptions: {
          color: bgColor // Customize background color if needed
        },
        dotsOptions: {
          ...style.dotsOptions,
          color: style.color // Apply the style's color to the dots
        }
      })

      // Append the QR code to the corresponding div
      const qrContainer = document.getElementById(`qr-preview-${index}`)
      if (qrContainer && qrContainer.childElementCount === 0) {
        qrCodeInstance.append(qrContainer)
      }
    })
  }, [qrCodeStyles, bgColor])

  const handleDownloadQRCode = async () => {
    console.log('trying to downlaod ...')
    const activeQrRef = qrRef.current
    if (
      !activeQrRef ||
      selectedStyleIndex === null ||
      selectedStyleIndex === undefined
    )
      return
console.log("condition passed ")
    try {
      setLoading(true)

      // Save QR metadata to backend if not already saved
      const qrOptions = {
        width,
        height: width,
        data: url || 'https://example.com',
        dotsOptions: {
          color:
            qrColor || qrCodeStyles[selectedStyleIndex]?.color || '#000000',
          type: dotType
        },
        cornersSquareOptions: {
          type: cornerType,
          color: qrColor
        },
        cornersDotOptions: {
          type: cornerDotType,
          color: qrColor
        },
        backgroundOptions: {
          color: bgColor || '#ffffff'
        },
        margin
      }

      const formData = new FormData()
      formData.append('targetUrl', url)
      formData.append('title', title)
      formData.append('showTitle', showTitle.toString())
      formData.append('textContent', textContent)
      formData.append('showText', showText.toString())
    formData.append('qrOptions', JSON.stringify(qrOptions))
      const response = await createQr(formData)
      if (!response || !response.qrCode?.shortId) {
        throw new Error('Failed to save QR metadata to backend')
      }

      // Get the canvas element directly from the QR code container
      const canvas = activeQrRef.querySelector('canvas')
      if (!canvas) {
        throw new Error('QR code canvas not found')
      }

      // Create a new canvas with padding
      const paddedCanvas = document.createElement('canvas')
      const ctx = paddedCanvas.getContext('2d')
      if (!ctx) {
        throw new Error('Failed to get canvas context')
      }

      // Set dimensions with padding
      const padding = 20
      paddedCanvas.width = canvas.width + padding * 2
      paddedCanvas.height = canvas.height + padding * 2

      // Fill background
      ctx.fillStyle = bgColor || '#ffffff'
      ctx.fillRect(0, 0, paddedCanvas.width, paddedCanvas.height)

      // Draw original QR code with padding
      ctx.drawImage(canvas, padding, padding)

      // Download the image
      const link = document.createElement('a')
      link.download = 'qr-code.png'
      link.href = paddedCanvas.toDataURL('image/png')
      link.click()

      router.push('/dashboard')
    } catch (error) {
      console.error('Error occurred: ', error)
      alert('An error occurred while generating the QR code. Please try again.')
      setQrCreated(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen bg-gray-50 p-4'>
      {/* Mobile Layout */}
      <div className='relative pb-4 lg:hidden'>
        {/* Fixed QR Preview at Top */}
        <div className='fixed top-0 left-0 right-0 bg-white shadow-lg z-50 p-4'>
          <div className='flex flex-col items-center'>
            <div
              ref={qrRef}
              className='mb-4 flex items-center justify-center'
              style={{
                width: `${width}px`,
                height: `${width}px`,
                margin: '0 auto'
              }}
            />
            <button
              onClick={handleDownloadQRCode}
              disabled={loading}
              className='w-full bg-blue-500 text-white rounded-lg py-3 px-4 font-medium hover:bg-blue-600 transition-colors flex items-center justify-center gap-2'
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
        </div>

        {/* Scrollable Controls with top margin for fixed preview */}
        <div className='mt-[400px] space-y-4'>
          {/* URL Input */}
          {showUrl && (
            <div className='bg-white p-4 rounded-xl shadow-sm border border-gray-100'>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Target URL
              </label>
              <UrlInput
                type='text'
                value={url}
                onChange={e => setUrl(e.target.value)}
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
                  onChange={e => setTitle(e.target.value)}
                  className='w-full border border-gray-200 rounded-lg p-3 text-sm'
                  placeholder='Enter QR title'
                />
                <label className='flex items-center gap-2 text-sm text-gray-600 mt-2'>
                  <input
                    type='checkbox'
                    checked={showTitle}
                    onChange={() => setShowTitle(!showTitle)}
                    className='w-4 h-4 rounded border-gray-300 text-blue-500'
                  />
                  Show title in QR code
                </label>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Additional Text
                </label>
                <textarea
                  value={textContent}
                  onChange={e => setTextContent(e.target.value)}
                  className='w-full border border-gray-200 rounded-lg p-3 text-sm min-h-[80px]'
                  placeholder='Add description or notes'
                />
                <label className='flex items-center gap-2 text-sm text-gray-600 mt-2'>
                  <input
                    type='checkbox'
                    checked={showText}
                    onChange={() => setShowText(!showText)}
                    className='w-4 h-4 rounded border-gray-300 text-blue-500'
                  />
                  Show text in QR code
                </label>
              </div>
            </div>
          </div>

          {/* Advanced QR Options */}
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
                    onChange={e =>
                      setCornerType(e.target.value as CornerSquareType)
                    }
                    className='w-full border border-gray-200 rounded-lg p-3 text-sm'
                  >
                    <option value='square'>Square</option>
                    <option value='extra-rounded'>Extra Rounded</option>
                    <option value='dot'>Dot</option>
                  </select>
                </div>
                <div>
                  <label className='block text-sm text-gray-600 mb-2'>
                    Dot Style
                  </label>
                  <select
                    value={dotType}
                    onChange={e => setDotType(e.target.value as DotType)}
                    className='w-full border border-gray-200 rounded-lg p-3 text-sm'
                  >
                    <option value='square'>Square</option>
                    <option value='dots'>Dots</option>
                    <option value='rounded'>Rounded</option>
                    <option value='classy'>Classy</option>
                    <option value='classy-rounded'>Classy Rounded</option>
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
                    onChange={e => setCornerDotType(e.target.value as DotType)}
                    className='w-full border border-gray-200 rounded-lg p-3 text-sm'
                  >
                    <option value='square'>Square</option>
                    <option value='dots'>Dots</option>
                  </select>
                </div>
                <div>
                  <label className='block text-sm text-gray-600 mb-2'>
                    Size
                  </label>
                  <select
                    value={width}
                    onChange={e => setWidth(Number(e.target.value))}
                    className='w-full border border-gray-200 rounded-lg p-3 text-sm'
                  >
                    <option value='200'>Small (200px)</option>
                    <option value='300'>Medium (300px)</option>
                    <option value='400'>Large (400px)</option>
                    <option value='500'>Extra Large (500px)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className='block text-sm text-gray-600 mb-2'>
                  Margin: {margin}px
                </label>
                <input
                  type='range'
                  min='0'
                  max='50'
                  value={margin}
                  onChange={e => setMargin(Number(e.target.value))}
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
                  onChange={e => setBgColor(e.target.value)}
                  className='w-full h-10 rounded cursor-pointer'
                />
              </div>
              <div>
                <label className='block text-sm text-gray-600 mb-2'>
                  QR Code
                </label>
                <input
                  type='color'
                  value={qrColor}
                  onChange={e => setQrColor(e.target.value)}
                  className='w-full h-10 rounded cursor-pointer'
                />
              </div>
            </div>
          </div>

          {/* Style Gallery */}
          <div className='bg-white p-4 rounded-xl shadow-sm border border-gray-100'>
            <h3 className='text-sm font-semibold text-gray-700 mb-4'>
              Style Gallery
            </h3>
            <div className='grid grid-cols-4 gap-2'>
              {qrCodeStyles.slice(0, visibleQrs).map((style, index) => (
                <div
                  key={index}
                  className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer ${
                    selectedStyleIndex === index
                      ? 'ring-2 ring-blue-500 shadow-sm'
                      : 'hover:shadow-sm border border-gray-200'
                  }`}
                  onClick={() => handleStyleSelection(index)}
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
            {visibleQrs < qrCodeStyles.length && (
              <button
                onClick={() => setVisibleQrs(prev => prev + 8)}
                className='mt-4 w-full py-2 text-sm text-blue-500 font-medium'
              >
                Show More
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className='hidden lg:block max-w-7xl mx-auto'>
        <div className='grid grid-cols-2 gap-8'>
          {/* Left side - Controls */}
          <div className='space-y-6'>
            <div className='flex items-center gap-3 mb-6'>
              <div className='h-8 w-2 bg-blue-500 rounded-full'></div>
              <h1 className='text-2xl font-bold text-gray-800'>
                QR Code Generator
              </h1>
            </div>

            {/* URL Input */}
            {showUrl && (
              <div className='bg-white p-4 rounded-xl shadow-sm border border-gray-100'>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Target URL
                </label>
                <UrlInput
                  type='text'
                  value={url}
                  onChange={e => setUrl(e.target.value)}
                  className='w-full border border-gray-200 rounded-lg p-3 text-sm'
                  placeholder='Enter your destination URL'
                />
              </div>
            )}

            {/* Controls sections - reuse mobile controls */}
            <div className='space-y-4'>
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
                      onChange={e => setTitle(e.target.value)}
                      className='w-full border border-gray-200 rounded-lg p-3 text-sm'
                      placeholder='Enter QR title'
                    />
                    <label className='flex items-center gap-2 text-sm text-gray-600 mt-2'>
                      <input
                        type='checkbox'
                        checked={showTitle}
                        onChange={() => setShowTitle(!showTitle)}
                        className='w-4 h-4 rounded border-gray-300 text-blue-500'
                      />
                      Show title in QR code
                    </label>
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Additional Text
                    </label>
                    <textarea
                      value={textContent}
                      onChange={e => setTextContent(e.target.value)}
                      className='w-full border border-gray-200 rounded-lg p-3 text-sm min-h-[80px]'
                      placeholder='Add description or notes'
                    />
                    <label className='flex items-center gap-2 text-sm text-gray-600 mt-2'>
                      <input
                        type='checkbox'
                        checked={showText}
                        onChange={() => setShowText(!showText)}
                        className='w-4 h-4 rounded border-gray-300 text-blue-500'
                      />
                      Show text in QR code
                    </label>
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
                        onChange={e =>
                          setCornerType(e.target.value as CornerSquareType)
                        }
                        className='w-full border border-gray-200 rounded-lg p-3 text-sm'
                      >
                        <option value='square'>Square</option>
                        <option value='extra-rounded'>Extra Rounded</option>
                        <option value='dot'>Dot</option>
                      </select>
                    </div>
                    <div>
                      <label className='block text-sm text-gray-600 mb-2'>
                        Dot Style
                      </label>
                      <select
                        value={dotType}
                        onChange={e => setDotType(e.target.value as DotType)}
                        className='w-full border border-gray-200 rounded-lg p-3 text-sm'
                      >
                        <option value='square'>Square</option>
                        <option value='dots'>Dots</option>
                        <option value='rounded'>Rounded</option>
                        <option value='classy'>Classy</option>
                        <option value='classy-rounded'>Classy Rounded</option>
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
                        onChange={e =>
                          setCornerDotType(e.target.value as DotType)
                        }
                        className='w-full border border-gray-200 rounded-lg p-3 text-sm'
                      >
                        <option value='square'>Square</option>
                        <option value='dots'>Dots</option>
                      </select>
                    </div>
                    <div>
                      <label className='block text-sm text-gray-600 mb-2'>
                        Size
                      </label>
                      <select
                        value={width}
                        onChange={e => setWidth(Number(e.target.value))}
                        className='w-full border border-gray-200 rounded-lg p-3 text-sm'
                      >
                        <option value='200'>Small (200px)</option>
                        <option value='300'>Medium (300px)</option>
                        <option value='400'>Large (400px)</option>
                        <option value='500'>Extra Large (500px)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className='block text-sm text-gray-600 mb-2'>
                      Margin: {margin}px
                    </label>
                    <input
                      type='range'
                      min='0'
                      max='50'
                      value={margin}
                      onChange={e => setMargin(Number(e.target.value))}
                      className='w-full'
                    />
                  </div>
                </div>
              </div>

              {/* Colors */}
              <div className='bg-white p-4 rounded-xl shadow-sm border border-gray-100'>
                <h3 className='text-sm font-semibold text-gray-700 mb-4'>
                  Colors
                </h3>
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-sm text-gray-600 mb-2'>
                      Background
                    </label>
                    <input
                      type='color'
                      value={bgColor}
                      onChange={e => setBgColor(e.target.value)}
                      className='w-full h-10 rounded cursor-pointer'
                    />
                  </div>
                  <div>
                    <label className='block text-sm text-gray-600 mb-2'>
                      QR Code
                    </label>
                    <input
                      type='color'
                      value={qrColor}
                      onChange={e => setQrColor(e.target.value)}
                      className='w-full h-10 rounded cursor-pointer'
                    />
                  </div>
                </div>
              </div>

              {/* Style Gallery */}
              <div className='bg-white p-4 rounded-xl shadow-sm border border-gray-100'>
                <h3 className='text-sm font-semibold text-gray-700 mb-4'>
                  Style Gallery
                </h3>
                <div className='grid grid-cols-4 gap-2'>
                  {qrCodeStyles.slice(0, visibleQrs).map((style, index) => (
                    <div
                      key={index}
                      className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer ${
                        selectedStyleIndex === index
                          ? 'ring-2 ring-blue-500 shadow-sm'
                          : 'hover:shadow-sm border border-gray-200'
                      }`}
                      onClick={() => handleStyleSelection(index)}
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
                {visibleQrs < qrCodeStyles.length && (
                  <button
                    onClick={() => setVisibleQrs(prev => prev + 8)}
                    className='mt-4 w-full py-2 text-sm text-blue-500 font-medium'
                  >
                    Show More
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right side - Preview */}
          <div className='space-y-6'>
            <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-100'>
              <h2 className='text-lg font-semibold text-gray-800 mb-4'>
                QR Code Preview
              </h2>
              <div
                ref={desktopQrRef}
                className='flex justify-center items-center'
                style={{
                  width: `${width}px`,
                  height: `${width}px`,
                  margin: '0 auto'
                }}
              />
              <button
                onClick={handleDownloadQRCode}
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
            {/* Style Gallery */}
            <div className='bg-white p-4 rounded-xl shadow-sm border border-gray-100'>
              <h3 className='text-sm font-semibold text-gray-700 mb-4'>
                Style Gallery
              </h3>
              <div className='grid grid-cols-4 gap-2'>
                {qrCodeStyles.slice(0, visibleQrs).map((style, index) => (
                  <div
                    key={index}
                    className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer ${
                      selectedStyleIndex === index
                        ? 'ring-2 ring-blue-500 shadow-sm'
                        : 'hover:shadow-sm border border-gray-200'
                    }`}
                    onClick={() => handleStyleSelection(index)}
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
              {visibleQrs < qrCodeStyles.length && (
                <button
                  onClick={() => setVisibleQrs(prev => prev + 8)}
                  className='mt-4 w-full py-2 text-sm text-blue-500 font-medium'
                >
                  Show More
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
