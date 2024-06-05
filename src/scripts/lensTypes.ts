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

  colorPosterization: {
    name: 'Color Posterization',

    pixel: (pixel, options) => {
      const level = -10 + (options.strength * 10) 

      return {
        r: posterizeChannel(pixel.color.r, level),
        g: posterizeChannel(pixel.color.g, level),
        b: posterizeChannel(pixel.color.b, level) 
      }
    },

    options: {
      strength: {
        name: 'Strength',
        default: 0,

        min: 0,
        max: 1,
        step: 0.1
      }
    }
  },

  blur: {
    name: 'Blur',

    pixel: (pixel, options) => {
      const averageR: number[] = []
      const averageG: number[] = []
      const averageB: number[] = []

      const radius = Math.round(((pixel.size.width + pixel.size.height) / 75) * options.strength)

      for (let x = pixel.position.x - radius; x < pixel.position.x + radius; x++) {
        for (let y = pixel.position.y - radius; y < pixel.position.y + radius; y++) {
          const color = pixel.getColor(x, y)

          if (color !== undefined) {
            averageR.push(color.r)
            averageG.push(color.g)
            averageB.push(color.b)
          }
        }
      }

      return {
        r: (averageR.length > 0) ? averageR.reduce((a, b) => a + b) / averageR.length : pixel.color.r,
        g: (averageG.length > 0) ? averageG.reduce((a, b) => a + b) / averageG.length : pixel.color.g,
        b: (averageB.length > 0) ? averageB.reduce((a, b) => a + b) / averageB.length : pixel.color.b
      } 
    },

    options: {
      strength: {
        name: 'Strength',
        default: 0,

        min: 0,
        max: 1,
        step: 0.1 
      }
    }
  },

  grayscale: {
    name: 'Grayscale',

    pixel: (pixel, options) => {
      const value = (pixel.color.r + pixel.color.g + pixel.color.b) / 3

      return {
        r: pixel.color.r + ((value - pixel.color.r) * options.strength),
        g: pixel.color.g + ((value - pixel.color.g) * options.strength),
        b: pixel.color.b + ((value - pixel.color.b) * options.strength)
      }
    },

    options: {
      strength: {
        name: 'Strength',
        default: 0,

        min: 0,
        max: 1,
        step: 0.1
      }
    }
  },

  noise: {
    name: 'Noise',

    pixel: (pixel, options) => {
      if (Math.random() <= options.amount) {
        const value = ((Math.random() - 0.5) * 2) * (255 * options.strength)

        return {
          r: pixel.color.r + value,
          g: pixel.color.g + value,
          b: pixel.color.b + value
        }
      }

      return pixel.color
    },

    options: {
      strength: {
        name: 'Strength',
        default: 0,

        min: 0,
        max: 1,
        step: 0.1
      },

      amount: {
        name: 'Amount',
        default: 0.5,

        min: 0,
        max: 1,
        step: 0.1
      }
    }
  }
}

// Posterization A Color Channel
function posterizeChannel(value: number, levels: number): number {
  const step = 255 / (levels - 1)

  return Math.round(value / step) * step
}

import type { LensType } from '../types/lens'
