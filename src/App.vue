<template>
  <div style="display: flex; flex-wrap: wrap; gap: 30px; margin: 30px; width: calc(100vw - 60px); height: calc(100vh - 60px)">
    <div style="flex: 1; display: flex; flex-direction: column; min-width: 400px; min-height: 450px">
      <ImageCanvas ref="imageCanvas" @image-uploaded="imageUploaded" @set-state="setState" style="flex: 1; margin-bottom: 15px"></ImageCanvas>
      <ActionBar ref="actionBar" @render="render"></ActionBar>
    </div>
    <LensMenu ref="lensMenu" @load-lenses="loadLenses" @save-lenses="saveLenses" @lens-updated="$refs.imageCanvas.renderPreview($refs.lensMenu.getLenses())" style="flex: 1; flex-shrink: 0; min-width: 400px; height: 100%"></LensMenu>
  </div> 
</template>

<script lang="ts">
  import ImageCanvas from './components/ImageCanvas.vue'
  import ActionBar from './components/ActionBar.vue'
  import LensMenu from './components/LensMenu.vue'

  import { LensData } from './types/lens'

  // Data
  interface Data {
    imageCanvas: {
      renderPreview: (lenses: LensData[]) => void,
      render: (lenses: LensData[]) => void
    },
    actionBar: { updateState: (type?: 'idle' | 'rendering', state?: string, progress?: null | number, resolution?: string) => void },
    lensMenu:{
      setLenses: (lensesData: LensData[]) => void,
      getLenses: () => LensData[]
    }
  }

  export default {
    components: {
      ImageCanvas,
      ActionBar,
      LensMenu
    },

    data () {
      return {
        imageCanvas: this.$refs.imageCanvas as any,
        actionBar: this.$refs.actionBar as any,
        lensMenu: this.$refs.lensMenu as any
      } as Data
    },

    mounted (): void {
      this.imageCanvas = this.$refs.imageCanvas as any
      this.actionBar = this.$refs.actionBar as any
      this.lensMenu = this.$refs.lensMenu as any
    },

    methods: {
      // Image Uploaded
      imageUploaded (event: { width: number, height: number }): void {
        this.actionBar.updateState(undefined, undefined, undefined, `${event.width} x ${event.height}`)

        this.imageCanvas.renderPreview(this.lensMenu.getLenses())
      },

      // Render
      render (): void {
        this.imageCanvas.render(this.lensMenu.getLenses())
      },

      // Set The State
      setState (event: { type?: 'idle' | 'rendering', state?: string, progress?: null | number, resolution?: string }): void {
        this.actionBar.updateState(event.type, event.state, event.progress, event.resolution)
      },

      // Load The Lenses
      loadLenses (): void {
        const dialog = document.createElement('input')

        dialog.type = 'file'
        dialog.accept = 'application/json' 

        dialog.addEventListener('change', (event) => {
          const reader = new FileReader()

          reader.readAsText((event.target as HTMLInputElement).files![0])

          reader.addEventListener('loadend', (event) => this.lensMenu.setLenses(JSON.parse(event.target!.result as string)))

          this.imageCanvas.renderPreview(this.lensMenu.getLenses())
        })

        dialog.click()
      },

      // Save The Lenses
      saveLenses (): void {
        const link = document.body.appendChild(document.createElement('a'))

        link.href = `data:application/json;base64,${btoa(JSON.stringify(this.lensMenu.getLenses()))}` 
        link.download = 'Lenses.json'

        link.click()
      }
    }
  }
</script>
