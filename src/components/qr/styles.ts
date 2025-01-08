import { QRCodeStyle } from './types'
import { DotType, CornerSquareType, CornerDotType } from 'qr-code-styling'

export const qrCodeStyles: QRCodeStyle[] = [
  {
    name: 'Red Square',
    dotsOptions: { type: 'square' as DotType },
    cornersSquareOptions: { type: 'square' as CornerSquareType },
    backgroundColor: '#ffffff',
    color: '#000000'
  },
  {
    name: 'Green Dots',
    dotsOptions: { type: 'dots' as DotType },
    cornersSquareOptions: { type: 'extra-rounded' as CornerSquareType },
    backgroundColor: '#ffffff',
    color: '#4caf50'
  },
  // Add more styles here...
]

export const sizeOptions = [
  { value: '200', label: 'Small (200px)' },
  { value: '300', label: 'Medium (300px)' },
  { value: '400', label: 'Large (400px)' },
  { value: '500', label: 'Extra Large (500px)' }
]

export const cornerTypeOptions = [
  { value: 'square', label: 'Square' },
  { value: 'extra-rounded', label: 'Extra Rounded' },
  { value: 'dot', label: 'Dot' }
]

export const dotTypeOptions = [
  { value: 'square', label: 'Square' },
  { value: 'dots', label: 'Dots' },
  { value: 'rounded', label: 'Rounded' },
  { value: 'classy', label: 'Classy' },
  { value: 'classy-rounded', label: 'Classy Rounded' }
]

export const cornerDotTypeOptions = [
  { value: 'dot', label: 'Dot' },
  { value: 'square', label: 'Square' }
]
