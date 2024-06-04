// Lens Types
export interface LensType {
  name: string,

  options: {
    [key: string]: {
      name: string,
      default: number,

      min: number,
      max: number,
      step: number
    }
  }
}

// Lens
export interface LensData {
  type: string,

  enabled: boolean

  options: { [key: string]: number }
}
