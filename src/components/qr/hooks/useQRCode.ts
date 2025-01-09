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
    image: siteConfig.qrlogo,
    showTitle: true,
    showText: true,
    textContent: '',
    qrCreated: false,
    cornerType: 'extra-rounded',
    dotType: 'dots',
    cornerDotType: 'square',
    margin: 20,
    width: 300,
    visibleQrs: 4,
    loading: false
  })

  const router = useRouter()
  const qrRef = useRef<HTMLDivElement>(null)
  const desktopQrRef = useRef<HTMLDivElement>(null)
  const qrCodeInstance = useRef<QRCodeStyling | null>(null)

  const handleStyleSelection = (index: number) => {
    setState(prev => ({
      ...prev,
      selectedStyleIndex: index,
      qrColor: '',
      bgColor: ''
    }))
  }

  useEffect(() => {
    if (state.selectedStyleIndex === null) return

    const defaultBgColor =
      state.bgColor || qrCodeStyles[state.selectedStyleIndex]?.backgroundColor || '#ffffff'
    const defaultQrColor =
      state.qrColor || qrCodeStyles[state.selectedStyleIndex]?.color || '#000000'

    const qrOptions: QRCodeOptions = {
      width: state.width,
      height: state.width,
      data: state.url || 'https://example.com',
      image: siteConfig.qrlogo,
      dotsOptions: {
        color: defaultQrColor,
        type: state.dotType
      },
      cornersSquareOptions: {
        type: state.cornerType,
        color: defaultQrColor
      },
      cornersDotOptions: {
        type: state.cornerDotType,
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
      margin: state.margin,
      qrOptions: {
        errorCorrectionLevel: 'H'
      }
    }

    setState(prev => ({
      ...prev,
      qrColor: defaultQrColor,
      bgColor: defaultBgColor
    }))

    if (qrRef.current) {
      qrRef.current.innerHTML = ''
      qrCodeInstance.current = new QRCodeStyling(qrOptions)
      qrCodeInstance.current.append(qrRef.current)
    }

    if (desktopQrRef.current) {
      desktopQrRef.current.innerHTML = ''
      const desktopQrInstance = new QRCodeStyling(qrOptions)
      desktopQrInstance.append(desktopQrRef.current)
    }
  }, [
    state.url,
    state.selectedStyleIndex,
    state.qrColor,
    state.bgColor,
    state.width,
    state.cornerType,
    state.cornerDotType,
    state.dotType,
    state.margin
  ])

  const handleDownload = async () => {
    const activeQrRef = qrRef.current
    if (!activeQrRef || state.selectedStyleIndex === null) return

    try {
      setState(prev => ({ ...prev, loading: true }))

      const qrOptions = {
        width: state.width,
        height: state.width,
        data: state.url || 'https://example.com',
        image: siteConfig.qrlogo,
        dotsOptions: {
          color: state.qrColor || qrCodeStyles[state.selectedStyleIndex]?.color || '#000000',
          type: state.dotType
        },
        cornersSquareOptions: {
          type: state.cornerType,
          color: state.qrColor
        },
        cornersDotOptions: {
          type: state.cornerDotType,
          color: state.qrColor
        },
        backgroundOptions: {
          color: state.bgColor || '#ffffff'
        },
        margin: state.margin
      }

      const formData = new FormData()
      formData.append('targetUrl', state.url)
      formData.append('title', state.title)
      formData.append('showTitle', state.showTitle.toString())
      formData.append('qrOptions', JSON.stringify(qrOptions))

      const response = await createQr(formData)
      if (!response || !response.qrCode?.shortId) {
        throw new Error('Failed to save QR metadata to backend')
      }

      const canvas = activeQrRef.querySelector('canvas')
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
      link.download = 'qr-code.png'
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
