import type { Pixel } from '../types/pixel'

// Lens Types
export interface LensType {
  name: string,

  pixel: (pixel: Pixel, options: { [key: string]: number }) => { r: number, g: number, b: number }

  options: {
    [key: string]: {
      name: string,
      default: number,

      min: number,
      max: number,
      step: number
    }
  }
}

// Lens
export interface LensData {
  type: string,

  enabled: boolean

  options: { [key: string]: number }
}

// Lens Function
export type LensFunction = () => {}
