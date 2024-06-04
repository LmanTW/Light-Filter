<template>
  <div class="shadow" style="display: flex; align-items: center; background-color: var(--mainColor); border-radius: 20px; height: 50px">
    <div style="flex: 1; display: flex; align-items: center">
      <div :style="{ backgroundColor: (state.type === 'idle') ? 'var(--green)' : 'var(--yellow)', borderRadius: '5px', marginLeft: '15px', marginRight: '7.5px', width: '5px', height: '27.5px' }"></div>
      <div>
        <h1 style="color: var(--textColor); font-size: 12.5px; margin: 0px">{{state.content}}</h1>
        <h1 style="color: var(--textColor); font-size: 12.5px; margin: 0px; opacity: 0.75">{{state.resolution}}</h1>
      </div>
    </div>
    <h1 class="button highlightText" style="color: var(--textColor); font-size: 20px">Render</h1>
    <div style="flex: 1"></div>
  </div>
</template>

<script lang="ts">
  interface Data {
    state: {
      type: 'idle' | 'rendering'

      content: string,
      resolution: string
    }
  }

  export default {
    data () {
      return {
        state: {
          type: 'idle',

          content: 'Idle',
          resolution: '??? x ???'
        }
      } as Data
    },

    methods: {
      updateState (type?: 'idle' | 'rendering', content?: string, resolution?: string): void {
        if (type !== undefined) this.state.type = type
        if (content !== undefined) this.state.content = content
        if (resolution !== undefined) this.state.resolution = resolution
      }
    }
  }
</script>
