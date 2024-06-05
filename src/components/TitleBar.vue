<template>
  <div class="shadow" style="display: flex; align-items: center; background-color: var(--mainColor); border-radius: 20px; height: 50px">
    <div style="flex: 1; display: flex; align-items: center;">
      <svg class="button" v-if="theme === 'light'" @click="setTheme('dark')" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" style="color: var(--textColor); margin-left: 10px; width: 30px"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-miterlimit="10" stroke-width="32" d="M256 48v48M256 416v48M403.08 108.92l-33.94 33.94M142.86 369.14l-33.94 33.94M464 256h-48M96 256H48M403.08 403.08l-33.94-33.94M142.86 142.86l-33.94-33.94"/><circle cx="256" cy="256" r="80" fill="none" stroke="currentColor" stroke-linecap="round" stroke-miterlimit="10" stroke-width="32"/></svg>
      <svg class="button" v-else @click="setTheme('light')" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" style="color: var(--textColor); margin-left: 10px; width: 30px"><path d="M160 136c0-30.62 4.51-61.61 16-88C99.57 81.27 48 159.32 48 248c0 119.29 96.71 216 216 216 88.68 0 166.73-51.57 200-128-26.39 11.49-57.38 16-88 16-119.29 0-216-96.71-216-216z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/></svg>
    </div>
    <h1 class="highlightText" style="color: var(--textColor); font-size: 27.5px; margin: 0px">Light-Filter</h1>
    <div style="flex: 1; display: flex; justify-content: end;">
      <a href="https://github.com/LmanTW/Light-Filter" target="_blank" style="display: flex; justify-content: center; align-items: center">
        <svg class="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" style="color: var(--textColor); margin-right: 10px; width: 30px"><path fill="currentColor" d="M256 32C132.3 32 32 134.9 32 261.7c0 101.5 64.2 187.5 153.2 217.9a17.56 17.56 0 003.8.4c8.3 0 11.5-6.1 11.5-11.4 0-5.5-.2-19.9-.3-39.1a102.4 102.4 0 01-22.6 2.7c-43.1 0-52.9-33.5-52.9-33.5-10.2-26.5-24.9-33.6-24.9-33.6-19.5-13.7-.1-14.1 1.4-14.1h.1c22.5 2 34.3 23.8 34.3 23.8 11.2 19.6 26.2 25.1 39.6 25.1a63 63 0 0025.6-6c2-14.8 7.8-24.9 14.2-30.7-49.7-5.8-102-25.5-102-113.5 0-25.1 8.7-45.6 23-61.6-2.3-5.8-10-29.2 2.2-60.8a18.64 18.64 0 015-.5c8.1 0 26.4 3.1 56.6 24.1a208.21 208.21 0 01112.2 0c30.2-21 48.5-24.1 56.6-24.1a18.64 18.64 0 015 .5c12.2 31.6 4.5 55 2.2 60.8 14.3 16.1 23 36.6 23 61.6 0 88.2-52.4 107.6-102.3 113.3 8 7.1 15.2 21.1 15.2 42.5 0 30.7-.3 55.5-.3 63 0 5.4 3.1 11.5 11.4 11.5a19.35 19.35 0 004-.4C415.9 449.2 480 363.1 480 261.7 480 134.9 379.7 32 256 32z"/></svg>
      </a>
    </div>
  </div>  
</template>

<script lang="ts">
  import { getCookie, setCookie } from '../scripts/cookie'
  import { themes } from '../scripts/themes'

  // Data
  interface Data {
    theme: 'light' | 'dark'
  }

  export default {
    data () {
      return {
        theme: getCookie('theme') || 'light'
      } as Data
    },

    mounted () {
      this.setTheme(this.theme)
    },

    methods: {
      setTheme (theme: 'light' | 'dark'): void {
        setCookie('theme', theme)

        this.theme = theme

        const style = document.documentElement.style

        style.setProperty('--backgroundColor', themes[this.theme].backgroundColor)
        style.setProperty('--textColor', themes[this.theme].textColor)

        style.setProperty('--mainColor', themes[this.theme].mainColor)
        style.setProperty('--highlightColor1', themes[this.theme].highlightColor1)
        style.setProperty('--highlightColor2', themes[this.theme].highlightColor2)

        style.setProperty('--red', themes[this.theme].red)
        style.setProperty('--yellow', themes[this.theme].yellow)
        style.setProperty('--green', themes[this.theme].green)
      }
    }
  }
</script>
