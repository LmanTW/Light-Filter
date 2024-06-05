<template>
  <div class="shadow" style="display: flex; align-items: center; background-color: var(--mainColor); border-radius: 20px; height: 50px">
    <div style="flex: 1; display: flex; align-items: center">
      <div :style="{ backgroundColor: (state.type === 'idle') ? 'var(--green)' : 'var(--yellow)', borderRadius: '5px', marginLeft: '15px', marginRight: '7.5px', width: '5px', height: '27.5px' }"></div>
      <div>
        <h1 style="color: var(--textColor); font-size: 12px; white-space: nowrap; margin: 0px">State: {{state.state}}{{(state.progress === null) ? '' : ` (${state.progress})`}}</h1>
        <h1 style="color: var(--textColor); font-size: 12px; white-space: nowrap; margin: 0px; opacity: 0.75">Resolution: {{state.resolution}}</h1>
      </div>
    </div>
    <h1 class="button highlightText" :style="{ color: 'var(--textColor)', fontSize: '20px', opacity: (state.type === 'idle') ? 1 : 0.5, transition: 'opacity 0.5s, transform 0.5s cubic-bezier(0, 0.55, 0.45, 1)' }">Render</h1>
    <div style="flex: 1"></div>
  </div>
</template>

<script lang="ts">
  interface Data {
    state: {
      type: 'idle' | 'rendering'

      state: string,
      progress: null | number,

      resolution: string
    }
  }

  export default {
    data () {
      return {
        state: {
          type: 'idle',

          state: 'Idle',
          progress: null,

          resolution: '??? x ???'
        }
      } as Data
    },

    methods: {
      updateState (type?: 'idle' | 'rendering', state?: string, progress?: null | number, resolution?: string): void {
        if (type !== undefined) this.state.type = type
        if (state !== undefined) this.state.state = state
        if (progress !== undefined) this.state.progress = progress
        if (resolution !== undefined) this.state.resolution = resolution
      }
    }
  }
</script>
