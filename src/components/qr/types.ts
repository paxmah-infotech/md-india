import { DotType, CornerSquareType, CornerDotType, Options, ErrorCorrectionLevel } from 'qr-code-styling'

export type { ErrorCorrectionLevel }

export interface QRCodeStyle {
  name: string
  dotsOptions: {
    type: DotType
  }
  cornersSquareOptions: {
    type: CornerSquareType
  }
  backgroundColor: string
  color: string
}

export interface QRCodeOptions {
  width: number
  height: number
  data: string
  dotsOptions: {
    color: string
    type: DotType
  }
  cornersSquareOptions: {
    type: CornerSquareType
    color: string
  }
  cornersDotOptions: {
    type: CornerDotType
    color: string
  }
  backgroundOptions: {
    color: string
  }
  imageOptions: {
    hideBackgroundDots: boolean
    imageSize: number
    margin: number
  }
  margin: number
  qrOptions: {
    errorCorrectionLevel: ErrorCorrectionLevel
  }
}

export interface QRCodeState {
  url: string
  showUrl: boolean
  selectedStyleIndex: number | null
  bgColor: string
  qrColor: string
  title: string
  showTitle: boolean
  showText: boolean
  textContent: string
  qrCreated: boolean
  cornerType: CornerSquareType
  dotType: DotType
  cornerDotType: CornerDotType
  margin: number
  width: number
  visibleQrs: number
  loading: boolean
}

export type QRCodeStateUpdate = Partial<QRCodeState>
