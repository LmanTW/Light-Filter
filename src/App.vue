<template>
  <div style="display: flex; width: 100vw; height: 100vh">
    <div style="flex: 1; display: flex; flex-direction: column; margin: 30px; margin-right: 15px">
      <ImageCanvas ref="imageCanvas" @image-uploaded="$refs.imageCanvas.renderPreview(this.$refs.lensMenu.getLenses())" style="flex: 1; margin-bottom: 15px"></ImageCanvas>
      <ActionBar ref="actionBar"></ActionBar>
    </div>
    <LensMenu ref="lensMenu" @lens-updated="$refs.imageCanvas.renderPreview(this.$refs.lensMenu.getLenses())" style="flex: 1; margin: 30px; margin-left: 15px"></LensMenu>
  </div> 
</template>

<script lang="ts">
  import ImageCanvas from './components/ImageCanvas.vue'
  import ActionBar from './components/ActionBar.vue'
  import LensMenu from './components/LensMenu.vue'

  export default {
    components: {
      ImageCanvas,
      ActionBar,
      LensMenu
    }
  }
</script>
