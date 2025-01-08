import React, { useEffect } from 'react'
import { QRControls } from './QRControls'
import { QRPreview } from './QRPreview'
import { StyleGallery } from './StyleGallery'
import { useQRCode } from './hooks/useQRCode'
import { qrCodeStyles } from './styles'
import QRCodeStyling from 'qr-code-styling'
import { DotType, CornerSquareType, CornerDotType } from 'qr-code-styling'
import { QRCodeStateUpdate } from './types'

export default function StylishQRCode() {
  const {
    state,
    setState,
    qrRef,
    desktopQrRef,
    handleStyleSelection,
    handleDownload
  } = useQRCode()

  const updateState = (update: QRCodeStateUpdate) => {
    setState(prev => ({ ...prev, ...update }))
  }

  useEffect(() => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    qrCodeStyles.forEach((style, index) => {
      const qrCodeInstance = new QRCodeStyling({
        ...style,
        width: 85,
        height: 85,
        data: `${origin}/api/v1/qr?shortId=find&targetUrl=${state.url}`,
        backgroundOptions: {
          color: state.bgColor
        },
        dotsOptions: {
          ...style.dotsOptions,
          color: style.color
        }
      })

      const qrContainer = document.getElementById(`qr-preview-${index}`)
      if (qrContainer && qrContainer.childElementCount === 0) {
        qrCodeInstance.append(qrContainer)
      }
    })
  }, [qrCodeStyles, state.bgColor])

  return (
    <div className='min-h-screen bg-gray-50 '>
      {/* Mobile Layout */}
      <div className='relative pb-2 lg:hidden'>
        {/* Fixed QR Preview at Top */}
        <div className='sticky top-10 w-full left-0 right-0 bg-white/20 backdrop-blur-md shadow-lg  p-1'>
          <div className='flex flex-col items-center'>
            <QRPreview
              qrRef={qrRef}
              width={state.width}
              loading={state.loading}
              onDownload={handleDownload}
            />
          </div>
        </div>

        {/* Scrollable Controls with top margin for fixed preview */}
        <div className=' space-y-4'>
          <QRControls
            {...state}
            onUrlChange={e => updateState({ url: e.target.value })}
            onTitleChange={e => updateState({ title: e.target.value })}
            onTextChange={e => updateState({ textContent: e.target.value })}
            onShowTitleChange={() => updateState({ showTitle: !state.showTitle })}
            onShowTextChange={() => updateState({ showText: !state.showText })}
            onCornerTypeChange={e => updateState({ cornerType: e.target.value as CornerSquareType })}
            onDotTypeChange={e => updateState({ dotType: e.target.value as DotType })}
            onCornerDotTypeChange={e => updateState({ cornerDotType: e.target.value as CornerDotType })}
            onWidthChange={e => updateState({ width: Number(e.target.value) })}
            onMarginChange={e => updateState({ margin: Number(e.target.value) })}
            onBgColorChange={e => updateState({ bgColor: e.target.value })}
            onQrColorChange={e => updateState({ qrColor: e.target.value })}
          />

          <StyleGallery
            styles={qrCodeStyles}
            visibleQrs={state.visibleQrs}
            selectedStyleIndex={state.selectedStyleIndex}
            onStyleSelect={handleStyleSelection}
            onShowMore={() => updateState({ visibleQrs: state.visibleQrs + 8 })}
          />
        </div>
      </div>

      {/* Desktop Layout */}
      <div className='hidden lg:block max-w-7xl mx-auto'>
        <div className='grid grid-cols-2 gap-8'>
          {/* Left side - Controls */}
          <div className='space-y-6'>
            <div className='flex items-center gap-3 mb-6'>
              <div className='h-8 w-2 bg-blue-500 rounded-full'></div>
              <h1 className='text-2xl font-bold text-gray-800'>QR Code Generator</h1>
            </div>

            <QRControls
              {...state}
              onUrlChange={e => updateState({ url: e.target.value })}
              onTitleChange={e => updateState({ title: e.target.value })}
              onTextChange={e => updateState({ textContent: e.target.value })}
              onShowTitleChange={() => updateState({ showTitle: !state.showTitle })}
              onShowTextChange={() => updateState({ showText: !state.showText })}
              onCornerTypeChange={e => updateState({ cornerType: e.target.value as CornerSquareType })}
              onDotTypeChange={e => updateState({ dotType: e.target.value as DotType })}
              onCornerDotTypeChange={e => updateState({ cornerDotType: e.target.value as CornerDotType })}
              onWidthChange={e => updateState({ width: Number(e.target.value) })}
              onMarginChange={e => updateState({ margin: Number(e.target.value) })}
              onBgColorChange={e => updateState({ bgColor: e.target.value })}
              onQrColorChange={e => updateState({ qrColor: e.target.value })}
            />
          </div>

          {/* Right side - Preview */}
          <div className='space-y-6'>
            <QRPreview
              qrRef={desktopQrRef}
              width={state.width}
              loading={state.loading}
              onDownload={handleDownload}
            />

            <StyleGallery
              styles={qrCodeStyles}
              visibleQrs={state.visibleQrs}
              selectedStyleIndex={state.selectedStyleIndex}
              onStyleSelect={handleStyleSelection}
              onShowMore={() => updateState({ visibleQrs: state.visibleQrs + 8 })}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
