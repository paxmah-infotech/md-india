import { useState, useEffect, useRef } from 'react'
import QRCodeStyling from 'qr-code-styling'
import { QRCodeState, QRCodeOptions, ErrorCorrectionLevel } from '../types'
import { qrCodeStyles } from '../styles'
import { createQr } from '@/utils/apiHandlers'
import { useRouter } from 'next/navigation'
import { siteConfig } from '@/config/site.config'

export const useQRCode = () => {
  const [state, setState] = useState<QRCodeState>({
    url: 'https://example.com',
    showUrl: true,
    selectedStyleIndex: 0,
    bgColor: '#ffffff',
    qrColor: '',
    title: 'Scan Me',
    // image: siteConfig.qrlogo,
    showTitle: true,
    showText: true,
    textContent: '',
    qrCreated: false,
    cornerType: 'extra-rounded',
    dotType: 'rounded',
    cornerDotType: 'square',
    margin: 20,
    width: 300,
    visibleQrs: 4,
    loading: false
  })

  const [qrShortId, setQrShortId] = useState<string | null>(null);

  const router = useRouter()
  const qrRef = useRef<HTMLDivElement>(null)
  const desktopQrRef = useRef<HTMLDivElement>(null)

  const handleStyleSelection = (index: number) => {
    setState(prev => ({
      ...prev,
      selectedStyleIndex: index,
      qrColor: '',
      bgColor: ''
    }))
  }

  useEffect(() => {
    if (!qrRef.current || !state.url) return

    const origin = typeof window !== 'undefined' ? window.location.origin : ''
    const qrUrl = qrShortId 
      ? `${origin}/api/v1/qr?shortId=${qrShortId}&targetUrl=${state.url}` 
      : `${origin}/api/v1/qr?shortId=find&targetUrl=${state.url}`

    const defaultColor = qrCodeStyles[state.selectedStyleIndex || 0]?.color || '#000000'

    const qrOptions: QRCodeOptions = {
      width: state.width,
      height: state.width,
      data: qrUrl,
      // image: siteConfig.qrlogo,
      dotsOptions: {
        color: state.qrColor || defaultColor,
        type: state.dotType
      },
      cornersSquareOptions: {
        type: state.cornerType,
        color: state.qrColor || defaultColor
      },
      cornersDotOptions: {
        type: state.cornerDotType,
        color: state.qrColor || defaultColor
      },
      backgroundOptions: {
        color: state.bgColor || '#FFFFFF'
      },
      imageOptions: {
        hideBackgroundDots: true,
        imageSize: 0.4,
        margin: 10
      },
      margin: state.margin || 20,
      qrOptions: {
        errorCorrectionLevel: 'H'
      }
    }

    // Clear previous QR code
    if (qrRef.current) {
      qrRef.current.innerHTML = ''
    }

    const qr = new QRCodeStyling(qrOptions)
    qr.append(qrRef.current)

    // Also update desktop preview if it exists
    if (desktopQrRef.current) {
      desktopQrRef.current.innerHTML = ''
      const desktopQr = new QRCodeStyling({
        ...qrOptions,
        width: 300,
        height: 300
      })
      desktopQr.append(desktopQrRef.current)
    }

    return () => {
      if (qrRef.current) {
        qrRef.current.innerHTML = ''
      }
      if (desktopQrRef.current) {
        desktopQrRef.current.innerHTML = ''
      }
    }
  }, [
    state.url,
    state.width,
    state.qrColor,
    state.bgColor,
    state.dotType,
    state.cornerType,
    state.cornerDotType,
    state.selectedStyleIndex,
    qrShortId,
  ])

  const handleDownload = async () => {
    const activeQrRef = qrRef.current
    if (!activeQrRef || state.selectedStyleIndex === null) return

    try {
      setState(prev => ({ ...prev, loading: true }))

      const qrOptions: QRCodeOptions = {
        width: state.width,
        height: state.width,
        data: state.url || '',
        // image: siteConfig.qrlogo,
        dotsOptions: {
          color: state.qrColor || qrCodeStyles[state.selectedStyleIndex]?.color || '#000000',
          type: state.dotType
        },
        cornersSquareOptions: {
          type: state.cornerType,
          color: state.qrColor || qrCodeStyles[state.selectedStyleIndex]?.color || '#000000'
        },
        cornersDotOptions: {
          type: state.cornerDotType,
          color: state.qrColor || qrCodeStyles[state.selectedStyleIndex]?.color || '#000000'
        },
        backgroundOptions: {
          color: state.bgColor || '#ffffff'
        },
        margin: state.margin || 20,
        qrOptions: {
          errorCorrectionLevel: 'H'
        },
        imageOptions: {
          hideBackgroundDots: true,
          imageSize: 0.4,
          margin: 10
        }
      }

      const formData = new FormData()
      formData.append('targetUrl', state.url)
      formData.append('title', state.title)
      formData.append('showTitle', state.showTitle.toString())
      formData.append('qrOptions', JSON.stringify(qrOptions))
      formData.append('textContent', state.textContent)
      formData.append('showText', state.showText.toString())
      
      const response = await createQr(formData)
      if (!response || !response.qrCode?.shortId) {
        throw new Error('Failed to save QR metadata to backend')
      }

      // Set the shortId and wait for state update
      setQrShortId(response.qrCode.shortId)
      
      // Add a small delay to ensure QR code is updated with new shortId
      await new Promise(resolve => setTimeout(resolve, 500))

      const origin = typeof window !== 'undefined' ? window.location.origin : ''
      const finalQrUrl = `${origin}/api/v1/qr?shortId=${response.qrCode.shortId}&targetUrl=${state.url}`

      // Create new QR code with final URL for download
      const downloadQrOptions: QRCodeOptions = {
        ...qrOptions,
        data: finalQrUrl,
        imageOptions: {
          hideBackgroundDots: true,
          imageSize: 0.4,
          margin: 10
        }
      }

      // Create an Image element to preload the logo
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.src = siteConfig.qrlogo

      // Wait for image to load before creating QR
      await new Promise((resolve, reject) => {
        img.onload = resolve
        img.onerror = reject
        setTimeout(resolve, 1000) // Fallback timeout
      })

      const downloadQr = new QRCodeStyling(downloadQrOptions)
      const tempDiv = document.createElement('div')
      downloadQr.append(tempDiv)

      // Wait for QR code to render and image to load
      await new Promise(resolve => setTimeout(resolve, 300))

      const canvas = tempDiv.querySelector('canvas')
      if (!canvas) {
        throw new Error('QR code canvas not found')
      }

      const paddedCanvas = document.createElement('canvas')
      const ctx = paddedCanvas.getContext('2d')
      if (!ctx) {
        throw new Error('Failed to get canvas context')
      }

      const padding = 20
      paddedCanvas.width = canvas.width + padding * 2
      paddedCanvas.height = canvas.height + padding * 2

      ctx.fillStyle = state.bgColor || '#ffffff'
      ctx.fillRect(0, 0, paddedCanvas.width, paddedCanvas.height)
      ctx.drawImage(canvas, padding, padding)

      const link = document.createElement('a')
      link.download = `qr-code-${response.qrCode.shortId}.png`
      link.href = paddedCanvas.toDataURL('image/png')
      link.click()

      router.push('/dashboard')
    } catch (error) {
      console.error('Error occurred: ', error)
      alert('An error occurred while generating the QR code. Please try again.')
      setState(prev => ({ ...prev, qrCreated: false }))
    } finally {
      setState(prev => ({ ...prev, loading: false }))
    }
  }

  return {
    state,
    setState,
    qrRef,
    desktopQrRef,
    handleStyleSelection,
    handleDownload
  }
}
