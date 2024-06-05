import type { Theme } from '../types/theme'

// Themes
export const themes: { [key: string]: Theme } = {
  light: {
    backgroundColor: '#DFE3E1',
    textColor: '#101311',

    mainColor: '#f2f4f3',
    highlightColor1: '#B40BE6',
    highlightColor2: '#D90BE6',

    red: '#F30E0E',
    yellow: '#ECF20F',
    green: '#0FF21C',
    gray: '#687870'
  },

  dark: {
    backgroundColor: '#181B1E',
    textColor: '#E9ECEF',

    mainColor: '#212529',
    highlightColor1: '#C322F5',
    highlightColor2: '#E722F5',

    red: '#F30E0E',
    yellow: '#ECF20F',
    green: '#0FF21C',
    gray: '#687870'
  }
}
