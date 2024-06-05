<style scoped>
  .uploadArea {
    opacity: 0.5;
    transition: transform 0.5s, opacity 0.5s
  }

  .uploadArea #image {
    transition: transform 0.75s
  }

  .uploadArea:hover {
    transform: scale(1.02);
    opacity: 1
  }

  .uploadArea:hover #image {
    transform: scale(1.25) rotate(360deg)
  }

  .view-enter-active,
  .view-leave-active {
    transition: transform 0.5s, opacity 0.5s
  }

  .view-enter-from,
  .view-leave-to {
    transform: scale(0.9);
    opacity: 0
  }

  .message-enter-active,
  .message-leave-active {
    transition: opacity 0.5s
  }

  .message-enter-from,
  .message-leave-to {
    opacity: 0
  }
</style>

<template>
  <div class="shadow" style="background-color: var(--mainColor); border-radius: 25px; width: 100%; height: 100%; overflow: hidden;">
    <Transition name="view">
      <div v-if="state === 'upload'" style="display: flex; flex-direction: column; justify-content: center; align-items: center; width: 100%; height: 100%">
        <h1 style="color: var(--textColor); font-size: 30px; text-align: center; margin: 0px; margin-left: 30px; margin-right: 30px; margin-top: 30px; margin-bottom: 10px">Upload An Image</h1>
        <div style="display: flex; align-items: center; margin-left: 39px; margin-right: 30px; margin-bottom: 50px">
          <h1 style="color: var(--textColor); font-size: 17.5px; text-align: center; margin: 0px; width: 50%; opacity: 0.75">Drag and drop an image file here to upload.</h1>
          <div style="flex: 1; display: flex; justify-content: center; margin-left: 20px; margin-right: 20px; height: 100%">
            <div style="background-color: var(--textColor); border-radius: 5px; width: 1px; height: 100%; opacity: 0.25"></div>
          </div>
          <h1 style="color: var(--textColor); font-size: 17.5px; text-align: center; margin: 0px; width: 50%; opacity: 0.75">Click here to select a image file.</h1>
       </div>

        <div class="uploadArea shadow" @click="selectFile" @dragover="$event.preventDefault()" @drop="handleFileDrop" style="display: flex; justify-content: center; align-items: center; border: 2.5px dashed var(--textColor); border-radius: 10px; margin-left: 30px; margin-right: 30px; margin-bottom: 30px; width: 65%; height: 40%; cursor: pointer">
          <svg id="image" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" style="width: 40px"><path d="M448 256c0-106-86-192-192-192S64 150 64 256s86 192 192 192 192-86 192-192z" fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="32"/><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M256 176v160M336 256H176"/></svg>
        </div>

        <Transition name="message">
          <h1 v-if="errorMessage !== undefined" style="color: var(--red); font-size: 17.5px; margin: 0px; margin-top: -20px; margin-bottom: 30px">{{errorMessage}}</h1>
        </Transition>
      </div>

      <div v-else-if="state === 'loading'" style="display: flex; flex-direction: column; justify-content: center; align-items: center; width: 100%; height: 100%">
        <div style="display: flex; align-items: center">
          <h1 style="color: var(--textColor); font-size: 25px; margin: 0px; margin-right: 15px">Loading</h1>
          <div style="border: 3px solid var(--textColor); border-radius: 10px; width: 25px; height: 25px; animation: loading 1s infinite linear"></div>
        </div>
      </div>

      <canvas id="canvas" v-else style="width: 100%; height: 100%"></canvas>
    </Transition>
  </div>
</template>

<script lang="ts">
  import RenderWorker from '../scripts/worker?worker'
  import { LensData } from '../types/lens'

  // Data
  interface Data {
    acceptImageTypes: string[],

    state: 'upload' | 'loading' | 'canvas',
    errorMessage: undefined | string,

    worker: Worker,
    workerStateType: 'idle' | 'renderingPreview' | 'rendering',

    image: HTMLImageElement,
    previewData: ImageData,

    windowSizeChanged: boolean,
  }

  export default {
    data () {
      return {
        acceptImageTypes: ['image/png', 'image/jpeg', 'image/webp'],

        state: 'upload',
        errorMessage: undefined, 

        workerStateType: 'idle',

        image: new Image(),

        windowSizeChanged: true
      } as Data
    },

    mounted () {
      this.worker = new RenderWorker()

      this.worker.addEventListener('message', (data) => {
        const msg = data.data

        if (msg.type === 'setState') {
          this.workerStateType = msg.stateType

          this.$emit('set-state', { type: (this.workerStateType === 'idle') ? 'idle' : 'rendering', state: msg.state, progress: msg.progress, resolution: msg.resolution })
        } else if (msg.type === 'renderResult') {
          if (this.state === 'canvas') {
            this.previewData = new ImageData(msg.width, msg.height) 

            this.previewData.data.set(msg.data, 0)

            this.displayPreview()
          } 
        }
      })

      setInterval(() => {
        if (this.windowSizeChanged) {
          this.windowSizeChanged = false

          this.setCanvasSize()
          this.displayPreview()
        }
      }, 100)

      window.addEventListener('resize', () => this.windowSizeChanged = true)
    },

    methods: {
      selectFile (): void {
        if (this.state === 'upload') {
          const element = document.createElement('input')

          element.type = 'file'
          element.accept = this.acceptImageTypes.join(',')

          element.addEventListener('change', (event) => this.loadImage((event.target as HTMLInputElement).files![0]))

          element.click()
        }
      },

      handleFileDrop (event: DragEvent): void {
        if (this.state === 'upload') {
          event.preventDefault()

          this.loadImage(event.dataTransfer!.files[0])
        }
      },

      loadImage (file: File): void {
        if (this.state === 'upload') {
          if (this.acceptImageTypes.includes(file.type)) {
            this.state = 'loading'
            this.errorMessage = undefined

            const reader = new FileReader()

            reader.readAsDataURL(file)

            reader.addEventListener('loadend', (event) => {
              this.state = 'canvas'

              this.image.addEventListener('load', () => this.$emit('image-uploaded', { width: this.image.width, height: this.image.height }), { once: true })

              this.image.src = event.target!.result as string
            })
          } else this.errorMessage = `File must be an image (${this.acceptImageTypes.map((type) => type.split('/')[1]).join(', ')}).`
        }
      },

      setCanvasSize (): void {
        if (this.state === 'canvas') {
          const canvas = document.getElementById('canvas') as HTMLCanvasElement

          const rect = canvas.getBoundingClientRect()

          canvas.width = rect.width
          canvas.height = rect.height 
        }
      },

      renderPreview (lenses: LensData[]): void {
        if (this.state === 'canvas') {
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')!

          const size = this.calculateAspectRatioFit(this.image.width, this.image.height, 350, 350)

          canvas.width = size.width
          canvas.height = size.height 

          ctx.drawImage(this.image, 0, 0, canvas.width, canvas.height)

          this.worker.postMessage({ type: 'render', lenses: JSON.parse(JSON.stringify(lenses)), width: canvas.width, height: canvas.height, data: ctx.getImageData(0, 0, canvas.width, canvas.height).data }) 
        }
      },

      displayPreview (): void {
        if (this.state === 'canvas') {
          this.setCanvasSize()

          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')!

          canvas.width = this.previewData.width
          canvas.height = this.previewData.height

          ctx.putImageData(this.previewData, 0, 0)

          const canvas2 = document.getElementById('canvas') as HTMLCanvasElement
          const ctx2 = canvas2.getContext('2d')!

          ctx2.clearRect(0, 0, canvas2.width, canvas2.height)
 
          const size = this.calculateAspectRatioFit(canvas.width, canvas.height, canvas2.width, canvas2.height)

          ctx2.drawImage(canvas, (canvas2.width / 2) - (size.width / 2), (canvas2.height / 2) - (size.height / 2), size.width, size.height)
        }
      },

      calculateAspectRatioFit (srcWidth: number, srcHeight: number, maxWidth: number, maxHeight: number): { width: number, height: number } {
        const ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight)

        return { width: srcWidth * ratio, height: srcHeight * ratio }
      }
    }
  }
</script>
