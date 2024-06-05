import type { LensData } from '../types/lens'
import { lensTypes } from './lensTypes'
import type { Pixel } from '../types/pixel'

let state: 'idle' | 'rendering' | 'stopping' = 'idle'

self.addEventListener('message', (data) => {
  const msg = data.data

  if (msg.type === 'render') {
    self.postMessage({ type: 'setState', stateType: 'renderingPreview', state: 'Rendering Preview', progress: '0%', resolution: `${msg.width} x ${msg.height}` })

    const pixel: Pixel = {
      color: { r: 0, g: 0, b: 0 },
      size: { width: msg.width, height: msg.height },
      position: { x: 0, y: 0 },

      getColor: (x, y) => {
        const index = (x + (y * msg.width)) * 4

        return (data[index] === undefined) ? undefined : { r: data[index], g: data[index + 1], b: data[index + 2] }
      }
    }

    const data = new Uint8Array((msg.width * msg.height) * 4)

    data.set(msg.data, 0)

    msg.lenses.forEach((lens: LensData) => {
      if (lens.enabled) {
        for (let i = 0; i < msg.data.length; i += 4) {
          if (state === 'stopping') {
            state = 'idle'

            return
          }

          if (i % msg.width === 0) self.postMessage({ type: 'setState', progress: `${Math.round((100 / msg.data.length) * i)}%` }) 

          pixel.color = { r: msg.data[i], g: msg.data[i + 1], b: msg.data[i + 2] }
          pixel.position = { x: Math.trunc(i % msg.width) / 4, y: Math.trunc(i / msg.width) / 4 }

          pixel.color = lensTypes[lens.type].pixel(pixel, lens.options)

          data[i] = pixel.color.r
          data[i + 1] = pixel.color.g
          data[i + 2] = pixel.color.b
          data[i + 3] = 255
        }

        msg.data.set(data, 0)
      }
    }) 

    self.postMessage({ type: 'setState', stateType: 'idle', state: 'Idle', progress: null })

    self.postMessage({ type: 'renderResult', width: msg.width, height: msg.height, data })
  }
})
