export const lensTypes: { [key: string]: LensType } = {
  none: {
    name: 'None',

    pixel: (pixel) => {
      return pixel.color
    },

    options: {}
  },

  'colorAdjustment': {
    name: 'Color Adjustment',

    pixel: (pixel, options) => {
      return {
        r: pixel.color.r + options.red,
        g: pixel.color.g + options.green,
        b: pixel.color.b + options.blue
      }
    },

    options: {
      red: {
        name: 'Red',
        default: 0,

        min: -255,
        max: 255,
        step: 1
      },

      green: {
        name: 'Green',
        default: 0,

        min: -255,
        max: 255,
        step: 1
      },

      blue: {
        name: 'Blue',
        default: 0,

        min: -255,
        max: 255,
        step: 1
      }
    }
  },

  blur: {
    name: 'Blur',

    pixel: (pixel) => {
      return pixel.color
    },

    options: {
      strength: {
        name: 'Strength',
        default: 0,

        min: 0,
        max: 100,
        step: 1 
      }
    }
  }
}

import type { LensType } from '../types/lens'
