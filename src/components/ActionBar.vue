<template>
  <div class="shadow" style="display: flex; align-items: center; background-color: var(--mainColor); border-radius: 20px; height: 50px">
    <div style="flex: 1; display: flex; align-items: center">
      <div :style="{ backgroundColor: (state.type === 'idle') ? 'var(--green)' : 'var(--yellow)', borderRadius: '5px', marginLeft: '15px', marginRight: '7.5px', width: '5px', height: '27.5px', transition: 'background-color 0.5s' }"></div>
      <div>
        <h1 style="color: var(--textColor); font-size: 12px; white-space: nowrap; margin: 0px">State: {{state.state}}{{(state.progress === null) ? '' : ` (${state.progress})`}}</h1>
        <h1 style="color: var(--textColor); font-size: 12px; white-space: nowrap; margin: 0px; opacity: 0.75">Resolution: {{state.resolution}}</h1>
      </div>
    </div>
    <h1 class="button" @click="$emit('render')" :style="{ color: 'var(--textColor)', fontSize: '20px', opacity: (state.type === 'idle') ? 1 : 0.5, transition: 'color 1s, opacity 0.5s, transform 0.5s cubic-bezier(0, 0.55, 0.45, 1)' }">Render</h1>
    <div style="flex: 1; display: flex; justify-content: end;">
      <a class="button" href="https://github.com/LmanTW/Light-Filter" target="_blank" style="display: flex; justify-content: center; align-items: center; margin-right: 10px">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" style="color: var(--textColor); width: 30px"><path d="M256 32C132.3 32 32 134.9 32 261.7c0 101.5 64.2 187.5 153.2 217.9a17.56 17.56 0 003.8.4c8.3 0 11.5-6.1 11.5-11.4 0-5.5-.2-19.9-.3-39.1a102.4 102.4 0 01-22.6 2.7c-43.1 0-52.9-33.5-52.9-33.5-10.2-26.5-24.9-33.6-24.9-33.6-19.5-13.7-.1-14.1 1.4-14.1h.1c22.5 2 34.3 23.8 34.3 23.8 11.2 19.6 26.2 25.1 39.6 25.1a63 63 0 0025.6-6c2-14.8 7.8-24.9 14.2-30.7-49.7-5.8-102-25.5-102-113.5 0-25.1 8.7-45.6 23-61.6-2.3-5.8-10-29.2 2.2-60.8a18.64 18.64 0 015-.5c8.1 0 26.4 3.1 56.6 24.1a208.21 208.21 0 01112.2 0c30.2-21 48.5-24.1 56.6-24.1a18.64 18.64 0 015 .5c12.2 31.6 4.5 55 2.2 60.8 14.3 16.1 23 36.6 23 61.6 0 88.2-52.4 107.6-102.3 113.3 8 7.1 15.2 21.1 15.2 42.5 0 30.7-.3 55.5-.3 63 0 5.4 3.1 11.5 11.4 11.5a19.35 19.35 0 004-.4C415.9 449.2 480 363.1 480 261.7 480 134.9 379.7 32 256 32z"/></svg>
      </a>
    </div>
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
      // Update The State
      updateState (type?: 'idle' | 'rendering', state?: string, progress?: null | number, resolution?: string): void {
        if (type !== undefined) this.state.type = type
        if (state !== undefined) this.state.state = state
        if (progress !== undefined) this.state.progress = progress
        if (resolution !== undefined) this.state.resolution = resolution
      }
    }
  }
</script>
