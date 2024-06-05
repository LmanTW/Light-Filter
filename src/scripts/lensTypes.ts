import type { LensType } from '../types/lens'
import type { Pixel } from '../types/pixel'

export const lensTypes: { [key: string]: LensType } = {
  none: {
    name: 'None',

    pixel: (pixel) => {
      return pixel.color
    },

    options: {}
  },

  colorAdjustment: {
    name: 'Color Adjustment',

    pixel: (pixel, options) => {
      return {
        r: limitValue(pixel.color.r + options.red, 0, 255),
        g: limitValue(pixel.color.g + options.green, 0, 255),
        b: limitValue(pixel.color.b + options.blue, 0, 255)
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

  brightness: {
    name: 'Brightness',

    pixel: (pixel, options) => {
      return {
        r: limitValue(pixel.color.r + (255 * options.brightness), 0, 255),
        g: limitValue(pixel.color.g + (255 * options.brightness), 0, 255),
        b: limitValue(pixel.color.b + (255 * options.brightness), 0, 255)
      }
    },

    options: {
      brightness: {
        name: 'Brightness',
        default: 0,

        min: -1,
        max: 1,
        step: 0.1
      }
    }
  },

  ghost: {
    name: 'Ghost',

    pixel: (pixel, options) => {
      const offset = (pixel.size.width + pixel.size.height) / 5

      const color = pixel.getColor(Math.round(pixel.position.x - (options.xOffset * offset)), Math.round(pixel.position.y - (options.yOffset * offset)))

      return (color === undefined) ? {
        r: pixel.color.r,
        g: pixel.color.g,
        b: pixel.color.b
      } : {
        r: pixel.color.r + ((color.r - pixel.color.r) * options.strength),
        g: pixel.color.g + ((color.g - pixel.color.g) * options.strength),
        b: pixel.color.b + ((color.b - pixel.color.b) * options.strength)
      }
    },

    options: {
      strength: {
        name: 'Strength',
        default: 0,

        min: 0,
        max: 1,
        step: 0.1
      },

      xOffset: {
        name: 'X Offset',
        default: 0,

        min: -1,
        max: 1,
        step: 0.1
      },

      yOffset: {
        name: 'X Offset',
        default: 0,

        min: -1,
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

  invert: {
    name: 'Invert',

    pixel: (pixel, options) => {
      return {
        r: pixel.color.r + (((255 - (pixel.color.r)) - pixel.color.r) * options.strength),
        g: pixel.color.g + (((255 - (pixel.color.g)) - pixel.color.g) * options.strength),
        b: pixel.color.b + (((255 - (pixel.color.b)) - pixel.color.b) * options.strength)
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
          r: limitValue(pixel.color.r + value, 0, 255),
          g: limitValue(pixel.color.g + value, 0, 255),
          b: limitValue(pixel.color.b + value, 0, 255)
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
  },

  wave: {
    name: 'Wave',

    pixel: (pixel, options) => {
      const value = (6.28 / (pixel.size.width * options.size)) * pixel.position.x
      const distance = Math.sin(value) * (pixel.size.height * options.strength)
      
      let x = pixel.position.x + (distance * Math.cos(options.angle * Math.PI / 180))
      let y = pixel.position.y + (distance * Math.sin(options.angle * Math.PI / 180))

      while (y < 0) y += pixel.size.height
      while (y > pixel.size.height) y -= pixel.size.height

      while (x < 0) x += pixel.size.width
      while (x > pixel.size.width) x -= pixel.size.width

      const color = pixel.getColor(Math.round(x), Math.round(y))

      if (color === undefined) return { r: pixel.color.r, g: pixel.color.g, b: pixel.color.b }

      return { r: color.r, g: color.g, b: color.b }
    },

    options: {
      strength: {
        name: 'Strength',
        default: 0,

        min: 0,
        max: 1,
        step: 0.1
      },
      
      size: {
        name: 'Size',
        default: 0.5,

        min: 0,
        max: 1,
        step: 0.05
      },

      angle: {
        name: 'Angle',
        default: 90,

        min: 0,
        max: 360,
        step: 1
      }
    }
  }
}

// Posterization A Color Channel
function posterizeChannel(value: number, levels: number): number {
  const step = 255 / (levels - 1)

  return Math.round(value / step) * step
}

// Limit The Range Of A Value
function limitValue (value: number, min: number, max: number): number {
  if (value < min) return min
  else if (value > max) return max

  return value
}
