// Pixel
export interface Pixel {
  color: { r: number, g: number, b: number },
  position: { x: number, y: number },

  getColor: (x: number, y: number) => { r: number, g: number, b: number }
} 
