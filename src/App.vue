<template>
  <div style="display: flex; width: 100vw; height: 100vh">
    <div style="flex: 1; display: flex; flex-direction: column; margin: 30px; margin-right: 15px">
      <ImageCanvas ref="imageCanvas" @image-uploaded="imageUploaded" @set-state="setState" style="flex: 1; margin-bottom: 15px"></ImageCanvas>
      <ActionBar ref="actionBar" @render="render"></ActionBar>
    </div>
    <LensMenu ref="lensMenu" @lens-updated="$refs.imageCanvas.renderPreview($refs.lensMenu.getLenses())" style="flex: 1; margin: 30px; margin-left: 15px"></LensMenu>
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
    lensMenu:{ getLenses: () => LensData[] } 
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
      imageUploaded (event: { width: number, height: number }): void {
        this.actionBar.updateState(undefined, undefined, undefined, `${event.width} x ${event.height}`)

        this.imageCanvas.renderPreview(this.lensMenu.getLenses())
      },

      render (): void {
        this.imageCanvas.render(this.lensMenu.getLenses())
      },

      setState (event: { type?: 'idle' | 'rendering', state?: string, progress?: null | number, resolution?: string }): void {
        this.actionBar.updateState(event.type, event.state, event.progress, event.resolution)
      },
    }
  }
</script>
