export const lensTypes: { [key: string]: LensType } = {
  none: {
    name: 'None',

    options: {}
  },

  'colorAdjustment': {
    name: 'Color Adjustment',

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
