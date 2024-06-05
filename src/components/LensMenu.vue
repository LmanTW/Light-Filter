<style scoped>
.list-move,
.list-enter-active,
.list-leave-active {
  transition: transform 0.5s, opacity 0.5s
}

.list-enter-from {
  transform: scale(0.9);
  opacity: 0
}

.list-leave-to {
  opacity: 1
}

.list-leave-active {
  position: absolute;
  transform: scale(0.9);
  opacity: 0
}
</style>

<template>
  <div class="shadow" style="display: flex; flex-direction: column; flex-shrink: 0; background-color: var(--mainColor); border-radius: 25px; overflow: hidden">
    <div class="shadow" style="position: sticky; display: flex; flex-shrink: 0; align-items: center; background-color: var(--mainColor); border-radius: 20px; margin-left: 25px; margin-right: 25px; top: 25px; height: 50px; z-index: 999">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" style="color: var(--textColor); margin-left: 10px; width: 30px"><path d="M448 256c0-106-86-192-192-192S64 150 64 256s86 192 192 192 192-86 192-192z" fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="32"/><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M360 94.59V296M443.13 212.87L296 360M417.41 360H216M299.13 443.13l-144-144M152 416V216M68.87 299.13l144-144M94.59 152H288M212.87 68.87L360 216"/></svg>
      <div style="flex: 1"></div>
      <h1 class="button" @click="addLens" style="color: var(--textColor); font-size: 15px; margin: 0px; margin-right: 12.5px">Add Lens</h1>
    </div>

    <div style="flex: 1; position: relative; display: list-item; list-style: none; padding-top: 87.5px; padding-bottom: 12.5px; margin-top: -50px; overflow-y: scroll">
      <TransitionGroup name="list">
        <div class="shadow" v-for="(lensData, lensIndex) in lensesData" :key="lensData" style="display: flex; background-color: var(--mainColor); border-radius: 15px; margin-left: 25px; margin-bottom: 12.5px; width: calc(100% - 47.5px)">
          <div style="flex: 1; margin-left: 12.5px; margin-top: 10px; margin-bottom: 10px">
            <select @change="setLensType(lensIndex, $event.target.value)" v-model="lensData.type" :style="{ appearance: 'none', outline: 'none', backgroundColor: 'var(--mainColor)', color: 'var(--textColor)', border: 'none', fontSize: '20px', textDecoration: 'underline', fontWeight: 'bold', margin: '0px', marginBottom: (lensData.type === 'none') ? '' : '5px',  width: '200px', cursor: 'pointer' }">
              <option v-for="(lens, type) in lensTypes" :key="lens" :value="type" style="font-size: 10px">{{lens.name}}</option>
            </select>

            <div v-for="(option, optionID) in lensTypes[lensData.type].options" :key="option" style="display: flex; margin-top: 5px;">
              <h1 style="color: var(--textColor); font-size: 15px; margin: 0px; margin-right: 10px">{{option.name}}:</h1>
              <input type="range" @input="setLensOption(lensIndex, optionID, +$event.target.value)" :value="lensData.options[optionID]" :step="option.step" :min="option.min" :max="option.max" style="flex: 1; margin-right: 10px">
              <h1 style="color: var(--textColor); font-size: 15px; margin: 0px; margin-right: 10px; width: 35px">{{lensData.options[optionID]}}</h1>
            </div>

            <div v-if="lensData.type !== 'none'" style="display: flex; margin-top: 5px">
              <h1 style="color: var(--textColor); font-size: 15px; margin: 0px">Enable</h1>
              <input type="checkbox" @change="setLensEnabled(lensIndex, $event.target.checked)" style="width: 20px" :checked="lensData.enabled">
            </div>
          </div>

          <div style="display: flex; flex-direction: column; justify-content: center; align-items: center; margin-right: 5px">
            <svg xmlns="http://www.w3.org/2000/svg" v-if="lensData.type !== 'none'" @click="moveLensUp(lensIndex)" viewBox="0 0 512 512" style="color: var(--textColor); margin-top: 5px; margin-bottom: 5px; width: 15px; cursor: pointer"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="48" d="M112 328l144-144 144 144"/></svg>
            <svg xmlns="http://www.w3.org/2000/svg" @click="removeLens(lensIndex)" viewBox="0 0 512 512" style="color: var(--textColor); width: 30px; cursor: pointer"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M368 368L144 144M368 144L144 368"/></svg>
            <svg xmlns="http://www.w3.org/2000/svg" v-if="lensData.type !== 'none'" @click="moveLensDown(lensIndex)" viewBox="0 0 512 512" style="color: var(--textColor); margin-top: 5px; margin-bottom: 5px; width: 15px; cursor: pointer"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="48" d="M112 184l144 144 144-144"/></svg>
          </div>
        </div>
      </TransitionGroup>
    </div> 
  </div>
</template>

<script lang="ts">
  import { lensTypes } from '../scripts/lensTypes'
  import { LensType, LensData } from '../types/lens'

  // Data
  interface Data {
    lensTypes: { [key: string]: LensType },

    lensesData: LensData[]

    updateCooldown: number
  }

  export default {
    data () {
      return {
        lensTypes,

        lensesData: [],

        updateCooldown: -1
      } as Data
    },

    mounted () {
      setInterval(() => {
        if (this.updateCooldown > 0) {
          this.updateCooldown -= 0.1

          if (this.updateCooldown <= 0) this.$emit('lens-updated')
        }
      }, 100)
    },

    methods: {
      getLenses (): LensData[] {
        return this.lensesData
      },

      addLens (): void {
        this.lensesData.push({
          type: 'none',

          enabled: true,

          options: {}
        })

        this.updateCooldown = 1
      },

      removeLens (lensIndex: number): void {
        this.lensesData.splice(lensIndex, 1)

        this.updateCooldown = 1
      },

      setLensType (lensIndex: number, type: string): void {
        const options: { [key: string]: number } = {}

        Object.keys(lensTypes[type].options).forEach((optionID) => options[optionID] = lensTypes[type].options[optionID].default)

        this.lensesData[lensIndex].type = type
        this.lensesData[lensIndex].options = options

        this.updateCooldown = 1
      },

      setLensEnabled (lensIndex: number, value: boolean): void {
        this.lensesData[lensIndex].enabled = value

        this.updateCooldown = 1
      },

      setLensOption (lensIndex: number, id: string, value: number): void {
        this.lensesData[lensIndex].options[id] = value

        this.updateCooldown = 1
      },

      moveLensUp (lensIndex: number): void {
        if (lensIndex > 0) {
          const lens = this.lensesData[lensIndex] 

          this.lensesData[lensIndex] = this.lensesData[lensIndex - 1]
          this.lensesData[lensIndex - 1] = lens
  
          this.updateCooldown = 1
        } else if (this.lensesData.length > 1) this.moveLensDown(lensIndex)
      },

      moveLensDown (lensIndex: number): void {
        if (lensIndex < this.lensesData.length - 1) {
          const lens = this.lensesData[lensIndex] 

          this.lensesData[lensIndex] = this.lensesData[lensIndex + 1]
          this.lensesData[lensIndex + 1] = lens

          this.updateCooldown = 1
        } else if (this.lensesData.length > 1) this.moveLensUp(lensIndex)
      },
    } 
  }
</script>
