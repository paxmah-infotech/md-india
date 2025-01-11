import React, { useEffect } from 'react'
import { QRControls } from './QRControls'
import { QRPreview } from './QRPreview'
import { StyleGallery } from './StyleGallery'
import { useQRCode } from './hooks/useQRCode'
import { qrCodeStyles } from './styles'
import QRCodeStyling from 'qr-code-styling'
import { DotType, CornerSquareType, CornerDotType } from 'qr-code-styling'
import { QRCodeStateUpdate } from './types'
import { siteConfig } from '@/config/site.config'

export default function StylishQRCode() {
  const {
    state,
    setState,
    qrRef,
    desktopQrRef,
    handleDownload
  } = useQRCode()

  const updateState = (update: QRCodeStateUpdate) => {
    setState(prev => ({ ...prev, ...update }))
  }

  const handleStyleSelection = (index: number) => {
    const selectedStyle = qrCodeStyles[index]
    if (selectedStyle) {
      updateState({
        selectedStyleIndex: index,
        dotType: selectedStyle.dotsOptions?.type || 'square',
        cornerType: selectedStyle.cornersSquareOptions?.type || 'square',
        qrColor: selectedStyle.color || '#000000',
        bgColor: selectedStyle.backgroundColor || '#FFFFFF'
      })
    }
  }

  useEffect(() => {
    const origin = typeof window !== 'undefined' ? window.location.origin : process.env.NEXT_PUBLIC_BASE_URL;
    
    // Only generate style gallery QR codes, not the preview
    qrCodeStyles.forEach((style, index) => {
      const container = document.getElementById(`qr-preview-${index}`)
      if (container && container.childElementCount === 0) {
        const qrCodeInstance = new QRCodeStyling({
          ...style,
          width: 85,
          height: 85,
          image: siteConfig.qrlogo,
          data: `${origin}/api/v1/qr?shortId=find&targetUrl=${state.url}`,
          backgroundOptions: {
            color: state.bgColor
          },
          dotsOptions: {
            ...style.dotsOptions,
            color: style.color
          }
        })
        qrCodeInstance.append(container)
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
              title={state.title}
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
        <div className='flex flex-col lg:flex-row gap-6 px-4 py-6'>
          {/* Left side - Controls */}
          <div className='w-full lg:w-1/2 space-y-6'>
            <QRControls
              url={state.url}
              title={state.title}
              textContent={state.textContent}
              showUrl={true}
              showTitle={state.showTitle}
              showText={state.showText}
              cornerType={state.cornerType}
              dotType={state.dotType}
              cornerDotType={state.cornerDotType}
              margin={state.margin}
              width={state.width}
              bgColor={state.bgColor}
              qrColor={state.qrColor}
              onUrlChange={(e) => updateState({ url: e.target.value })}
              onTitleChange={(e) => updateState({ title: e.target.value })}
              onTextChange={(e) => updateState({ textContent: e.target.value })}
              onShowTitleChange={() => updateState({ showTitle: !state.showTitle })}
              onShowTextChange={() => updateState({ showText: !state.showText })}
              onCornerTypeChange={(e) => updateState({ cornerType: e.target.value as CornerSquareType })}
              onDotTypeChange={(e) => updateState({ dotType: e.target.value as DotType })}
              onCornerDotTypeChange={(e) => updateState({ cornerDotType: e.target.value as CornerDotType })}
              onWidthChange={(e) => updateState({ width: Number(e.target.value) })}
              onMarginChange={(e) => updateState({ margin: Number(e.target.value) })}
              onBgColorChange={(e) => updateState({ bgColor: e.target.value })}
              onQrColorChange={(e) => updateState({ qrColor: e.target.value })}
            />
          </div>

          {/* Right side - Preview and Style Gallery */}
          <div className='w-full lg:w-1/2 z-30'>
            <div className='lg:sticky lg:top-24 space-y-6'>
              {/* QR Preview */}
              <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-100'>
                <h3 className='text-sm font-semibold text-gray-700 mb-4'>QR Code Preview</h3>
                {/* title  */}
                <span className='text-xs text-center w-full flex items-center justify-center mb-4 italic'>{state.title}</span>
                <div ref={desktopQrRef} className='flex justify-center' />
                <button
                  onClick={handleDownload}
                  className='mt-4 w-full py-2 text-sm text-white font-medium bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors flex items-center justify-center gap-2'
                >
                  <svg className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4' />
                  </svg>
                  Download QR Code
                </button>
              </div>

              {/* Style Gallery */}
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
    </div>
  )
}
