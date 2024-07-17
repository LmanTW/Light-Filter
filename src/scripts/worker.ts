import type { LensData } from '../types/lens'
import { lensTypes } from './lensTypes'
import type { Pixel } from '../types/pixel'

let state: 'idle' | 'rendering' | 'stopping' = 'idle'

self.addEventListener('message', (data) => {
  const msg = data.data

  if (msg.type === 'stop') {
    if (state === 'rendering') state = 'idle'
  } if (msg.type === 'render') {
    if (state === 'idle') {
      self.postMessage({ type: 'setState', stateType: (msg.preview) ? 'renderingPreview' : 'rendering', state: 'Rendering Preview', progress: '0%', resolution: `${msg.width} x ${msg.height}` })

      const pixel: Pixel = {
        color: { r: 0, g: 0, b: 0 },
        size: { width: msg.width, height: msg.height },
        position: { x: 0, y: 0 },

        getColor: (x, y) => {
          const index = (x + (y * msg.width)) * 4

          return (msg.data[index] === undefined) ? undefined : { r: msg.data[index], g: msg.data[index + 1], b: msg.data[index + 2] }
        }
      }

     const data = new Uint8Array((msg.width * msg.height) * 4)

      data.set(msg.data, 0)

      msg.lenses.forEach((lens: LensData, index: number) => {
        if (lens.enabled) {
          for (let i = 0; i < msg.data.length; i += 4) {
            if (state === 'stopping') break 

            if (i % msg.width === 0) self.postMessage({ type: 'setState', progress: `${Math.round((100 / (msg.data.length * msg.lenses.length)) * ((((msg.width * msg.height) * 4) * index) + i))}%` })

            pixel.color = { r: msg.data[i], g: msg.data[i + 1], b: msg.data[i + 2] }
            pixel.position = { x: Math.trunc((i / 4) % msg.width), y: Math.trunc((i / 4) / msg.width)}

            pixel.color = lensTypes[lens.type].pixel(pixel, lens.options)

            data[i] = pixel.color.r
            data[i + 1] = pixel.color.g
            data[i + 2] = pixel.color.b
            data[i + 3] = data[i + 3]
          }

          msg.data.set(data, 0)
        }
      }) 

      if (state as any === 'stopping') {
        state = 'idle'

        self.postMessage({ type: 'setState', stateType: 'idle', state: 'Idle', progress: '0%' })

        return
      }
  
      self.postMessage({ type: 'setState', stateType: 'idle', state: 'Idle', progress: null })
  
      self.postMessage({ type: 'renderResult', preview: msg.preview, width: msg.width, height: msg.height, data })
    }  
  }
})
